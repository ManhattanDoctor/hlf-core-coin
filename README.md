# @hlf-core/coin

> TypeScript библиотека для управления токенами и их балансами в блокчейн-системах

[![npm version](https://badge.fury.io/js/@hlf-core%2Fcoin.svg)](https://badge.fury.io/js/@hlf-core%2Fcoin)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 📑 Содержание

- [Описание](#-описание)
- [Ключевые возможности](#-ключевые-возможности)
- [Быстрый старт](#-быстрый-старт)
- [Архитектура](#️-архитектура)
- [Основные операции](#-основные-операции)
- [Обработка ошибок](#️-обработка-ошибок)
- [Интеграция с Hyperledger Fabric](#-интеграция-с-hyperledger-fabric)
- [Система команд и событий](#-система-команд-и-событий)
- [Расширенное использование](#-расширенное-использование)
- [Настройка конфигурации](#-конфигурация-и-настройка)
- [Примеры реальных сценариев](#-примеры-реальных-сценариев)
- [Производительность](#-производительность)
- [Тестирование](#-тестирование)
- [Структура проекта](#-структура-проекта)
- [API Reference](#-api-reference)
- [Лучшие практики](#️-важные-замечания-и-лучшие-практики)
- [Зависимости](#-зависимости)
- [Сборка и разработка](#️-сборка-и-разработка)
- [FAQ](#-faq-часто-задаваемые-вопросы)
- [Безопасность](#-безопасность)
- [Вклад в проект](#-вклад-в-проект)
- [Лицензия](#-лицензия)
- [Автор](#-автор)

## 📖 Описание

**@hlf-core/coin** — это профессиональная библиотека на TypeScript для создания и управления токенами в блокчейн-приложениях. Библиотека предоставляет полный набор инструментов для работы с цифровыми активами: от создания токенов до сложных операций с балансами, включая систему удержания средств и аудит всех операций.

### ✨ Ключевые возможности

- 🪙 **Полный жизненный цикл токенов**: создание, эмиссия, переводы, сжигание
- 🔒 **Система удержания средств**: блокировка токенов для транзакций
- 📊 **Детальный аудит**: отслеживание всех операций с токенами
- 🛡️ **Безопасность**: валидация данных и проверка бизнес-правил
- 🔗 **Интеграция**: готовые команды и события для Hyperledger Fabric
- 💯 **Точность**: работа с числами через строки для избежания потери точности

## 🚀 Быстрый старт

### Установка

```bash
npm install @hlf-core/coin
```

### Базовый пример

```typescript
import { 
    Coin, 
    CoinUtil, 
    CoinAccountUtil, 
    CoinBalance,
    CoinTransferCommand 
} from '@hlf-core/coin';

// 1. Создание токена
const coin = new Coin();
coin.uid = CoinUtil.createUid('MYTOKEN', 8, 'issuer');
coin.balance = CoinBalance.create();

// 2. Создание аккаунта пользователя
const account = CoinAccountUtil.create(coin.uid, 'user1');
account.add('1000'); // Эмиссия 1000 токенов

// 3. Перевод токенов
const transfer = new CoinTransferCommand({
    objectUid: 'user1',  // отправитель
    targetUid: 'user2',  // получатель
    value: '100',
    coinUid: coin.uid
});

console.log(`Баланс: ${account.getTotal()}`); // "1000"
```

## 🏗️ Архитектура

### Основные компоненты

#### 💳 CoinAccount - Управление аккаунтами

Основной класс для работы с аккаунтами пользователей:

```typescript
const account = new CoinAccount();
account.uid = '→coin~account:coin_user1_8_BTC~user1';
account.inUse = '1000';  // Доступные средства
account.held = '200';    // Заблокированные средства
account.ownerUid = 'user1';

// Операции
account.add('500');      // Пополнение: +500
account.hold('100');     // Блокировка: 100 → held
account.remove('300');   // Списание: -300
account.unhold('50');    // Разблокировка: 50 → inUse

// Проверки
console.log(account.isEmpty());     // false
console.log(account.getTotal());    // "1400" (inUse=1150 + held=250)
```

#### 📈 CoinBalance - Расширенное управление

Наследует `CoinAccount` и добавляет аудит:

```typescript
const balance = CoinBalance.create();
balance.add('1000');     // emitted: 1000
balance.remove('200');   // burned: 200

console.log(balance.emitted); // "1000" - всего эмитировано
console.log(balance.burned);  // "200"  - всего сожжено
console.log(balance.total);   // "800"  - текущий баланс
```

#### 🔧 CoinUtil - Утилиты

Статический класс с инструментами:

```typescript
// Генерация UID токена
const coinUid = CoinUtil.createUid('BTC', 8, 'owner1');
// Результат: "coin_owner1_8_BTC"

// Разбор UID
const parts = CoinUtil.decomposeUid(coinUid);
// { coinId: 'BTC', decimals: 8, ownerUid: 'owner1' }

// Математические операции
const cents = CoinUtil.toCent('1.5', 2);     // "150"
const value = CoinUtil.fromCent('150', 2);  // "1.5"
const percent = CoinUtil.toPercent('25', '100'); // 25

// Валидация
const isValid = CoinUtil.isCoin('coin_user_8_BTC'); // true
```

#### 🔑 CoinAccountUtil - Ключи аккаунтов

Аккаунт хранится в состоянии по составному ключу «пространство имён + монета + владелец»:

```
→coin~account:coin_owner1_8_BTC~user1
└─ пространство ┘└─── монета ───┘└ владелец ┘
```

Такой ключ обслуживает два сценария: прочитать один аккаунт по точному ключу и перечислить все аккаунты монеты диапазонным запросом по префиксу. Ключи собирает `StateKey` из `@hlf-core/common`, поэтому разделители и проверка частей едины для всей экосистемы.

```typescript
// Точный ключ аккаунта — владелец обязателен
const uid = CoinAccountUtil.createUid('coin_owner1_8_BTC', 'user1');
// →coin~account:coin_owner1_8_BTC~user1

// Префикс для перечисления всех аккаунтов монеты
const prefix = CoinAccountUtil.createPrefix('coin_owner1_8_BTC');
// →coin~account:coin_owner1_8_BTC~

// Префикс всех аккаунтов всех монет
const all = CoinAccountUtil.createPrefix();
// →coin~account:

// Разбор ключа обратно на части
const parts = CoinAccountUtil.decomposeUid(uid);
// { coinUid: 'coin_owner1_8_BTC', owner: 'user1' }

// Создание аккаунта с готовым ключом
const account = CoinAccountUtil.create('coin_owner1_8_BTC', 'user1');
```

**Точный ключ и префикс — разные методы, и это важно.** Префикс поиска обязан заканчиваться разделителем, иначе диапазонный запрос захватит соседние монеты, чей идентификатор начинается так же:

```typescript
// НЕВЕРНО: префикс без разделителя
'→coin~account:coin_owner1_8_BTC'

// попадает под него:
//   →coin~account:coin_owner1_8_BTC~user1           нужный аккаунт
//   →coin~account:coin_owner1_8_BTC2~user2          ЧУЖАЯ монета BTC2
//   →coin~account:coin_owner1_8_BTC.SERIES.1~user2  ЧУЖАЯ серийная монета

// ВЕРНО: createPrefix всегда добавляет разделитель
CoinAccountUtil.createPrefix('coin_owner1_8_BTC');
// →coin~account:coin_owner1_8_BTC~
```

Поэтому `createUid` требует владельца, а для поиска существует отдельный `createPrefix` — перепутать их нельзя.

Части ключа проверяются при сборке: пустая часть либо часть, содержащая `~` или `:`, вызывает `StateKeySegmentInvalidError`. Разделитель внутри значения сдвинул бы границу между частями, и поиск по префиксу молча возвращал бы не то.

## 🎯 Основные операции

### Эмиссия токенов

```typescript
import { CoinEmitCommand, CoinEmittedEvent } from '@hlf-core/coin';

// Команда эмиссии
const emitCommand = new CoinEmitCommand({
    value: '10000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1',
    transactionHash: '0x123abc...'
});

// Событие после выполнения
const emittedEvent = new CoinEmittedEvent({
    value: '10000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1'
});
```

### Переводы между аккаунтами

```typescript
import { CoinTransferCommand, CoinTransferredEvent } from '@hlf-core/coin';

// Команда перевода
const transferCommand = new CoinTransferCommand({
    objectUid: 'alice',  // отправитель
    targetUid: 'bob',    // получатель
    value: '500',
    coinUid: 'coin_issuer_8_MYTOKEN'
});

// Событие перевода
const transferEvent = new CoinTransferredEvent({
    objectUid: 'alice',  // отправитель
    targetUid: 'bob',    // получатель
    value: '500',
    coinUid: 'coin_issuer_8_MYTOKEN'
});
```

### Система удержания средств

```typescript
import { 
    CoinHoldCommand, 
    CoinUnholdCommand,
    CoinHoldedEvent,
    CoinUnholdedEvent 
} from '@hlf-core/coin';

// Блокировка средств для транзакции
const holdCommand = new CoinHoldCommand({
    objectUid: 'user1',
    value: '100',
    coinUid: 'coin_issuer_8_MYTOKEN'
});

// После завершения транзакции - разблокировка
const unholdCommand = new CoinUnholdCommand({
    objectUid: 'user1',
    value: '100',
    coinUid: 'coin_issuer_8_MYTOKEN'
});
```

### Сжигание токенов

```typescript
import { CoinBurnCommand, CoinBurnedEvent } from '@hlf-core/coin';

const burnCommand = new CoinBurnCommand({
    value: '1000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1'
});

const burnedEvent = new CoinBurnedEvent({
    value: '1000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1'
});
```

### Полное обнуление баланса (Nullify)

Операция для обнуления всего баланса пользователя (например, при закрытии аккаунта):

```typescript
import { CoinNullifyCommand, CoinNullifiedEvent } from '@hlf-core/coin';

// Команда обнуления баланса
const nullifyCommand = new CoinNullifyCommand({
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1',
    transactionHash: '0xabc123...' // опционально
});

// Событие обнуления
const nullifiedEvent = new CoinNullifiedEvent({
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1'
    // Внимание: событие НЕ содержит поле value
});

// Использование в CoinAccount
const account = CoinAccountUtil.create('coin_issuer_8_MYTOKEN', 'user1');
account.add('5000');

// Обнулить inUse баланс
const removedInUse = account.nullify(); // Возвращает "5000", inUse становится "0"

// Обнулить held баланс
account.hold('1000');
const removedHeld = account.nullifyHeld(); // Возвращает "1000", held становится "0"
```

## 🛡️ Обработка ошибок

Библиотека предоставляет детальную систему ошибок:

```typescript
import { 
    CoinAmountMustBeGreaterThanZeroError,
    CoinBalanceMustBeGreaterThanAmountError 
} from '@hlf-core/coin';

try {
    account.add('-100'); // Отрицательная сумма
} catch (error) {
    if (error instanceof CoinAmountMustBeGreaterThanZeroError) {
        console.log(`Некорректная сумма: ${error.details}`);
    }
}

try {
    account.remove('5000'); // Недостаточно средств
} catch (error) {
    if (error instanceof CoinBalanceMustBeGreaterThanAmountError) {
        console.log(`Недостаточно средств:`, error.details);
        // { coinUid: '...', current: '1000', required: '5000' }
    }
}
```

## 🔗 Интеграция с Hyperledger Fabric

Сам пакет `@hlf-core/coin` платформо-нейтрален: он содержит только модели и команды/события, без транспортной логики. Для реального исполнения команд используйте парные пакеты:

- **`@hlf-core/transport`** — клиентская сторона (отправка команд в chaincode через Fabric Gateway, подписка на блок-события).
- **`@hlf-core/transport-chaincode`** — chaincode-сторона (приём команд, верификация подписи, диспетчеризация в обработчики).
- **`@hlf-core/coin-chaincode`** — содержит `CoinService` и `CoinManager`, выполняющие операции `transfer`/`emit`/`burn`/`hold`/`nullify` поверх ledger.

Подписка на события `CoinTransferredEvent`, `CoinEmittedEvent` и т.д. в клиентском коде делается через стандартный механизм событий Fabric, поднимаемый `TransportFabric` (см. README соответствующего пакета).

## 📊 Система команд и событий

### Команды (Commands)

| Команда | Описание |
|---------|----------|
| `CoinEmitCommand` | Эмиссия новых токенов |
| `CoinBurnCommand` | Сжигание токенов |
| `CoinTransferCommand` | Перевод между аккаунтами |
| `CoinHoldCommand` | Блокировка средств |
| `CoinUnholdCommand` | Разблокировка средств |
| `CoinNullifyCommand` | Полное обнуление баланса аккаунта |
| `CoinGetCommand` | Получение информации о токене |
| `CoinBalanceGetCommand` | Получение баланса аккаунта |

### События (Events)

| Событие | Описание |
|---------|----------|
| `CoinEmittedEvent` | Токены эмитированы |
| `CoinBurnedEvent` | Токены сожжены |
| `CoinTransferredEvent` | Перевод выполнен |
| `CoinHoldedEvent` | Средства заблокированы |
| `CoinUnholdedEvent` | Средства разблокированы |
| `CoinNullifiedEvent` | Баланс полностью обнулен |
| `CoinEditedEvent` | Токен отредактирован |

## 🎨 Расширенное использование

### Работа с инициатором транзакций

Библиотека поддерживает отслеживание инициатора операции через DTO классы:

```typescript
import {
    CoinAmountDto,
    CoinObjectAmountDto,
    ICoinAmountDto
} from '@hlf-core/coin';

// Простая сумма с инициатором
const amountDto: ICoinAmountDto = {
    value: '1000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    initiatorUid: 'admin_user_123' // опционально
};

// Операция с объектом и инициатором
const objectAmountDto = new CoinObjectAmountDto();
objectAmountDto.value = '500';
objectAmountDto.coinUid = 'coin_issuer_8_MYTOKEN';
objectAmountDto.objectUid = 'user1';
objectAmountDto.initiatorUid = 'system'; // кто инициировал операцию

// Использование в переводах
const transfer = new CoinTransferCommand({
    objectUid: 'user1',  // отправитель
    targetUid: 'user2',  // получатель
    value: '100',
    coinUid: 'coin_issuer_8_MYTOKEN',
    initiatorUid: 'admin' // администратор инициировал перевод
});
```

### Создание кастомного токена

```typescript
import { Coin, CoinBalance, CoinUtil } from '@hlf-core/coin';

class MyCustomToken extends Coin {
    public customProperty: string;

    constructor() {
        super();
        this.balance = new CoinBalance();
        this.customProperty = 'custom_value';
    }
}

const token = new MyCustomToken();
token.uid = CoinUtil.createUid('CUSTOM', 18, 'owner');
```

### Работа с несколькими токенами

```typescript
// Создание портфеля токенов
const portfolio = new Map<string, CoinAccount>();

const btcAccount = CoinAccountUtil.create('coin_owner_8_BTC', 'user1');
const ethAccount = CoinAccountUtil.create('coin_owner_18_ETH', 'user1');

portfolio.set('BTC', btcAccount);
portfolio.set('ETH', ethAccount);

// Операции с портфелем
portfolio.get('BTC')?.add('1000');
portfolio.get('ETH')?.add('500');

// Общий баланс в USD (пример)
const totalValue = Array.from(portfolio.values())
    .reduce((sum, account) => sum + parseFloat(account.getTotal()), 0);
```

## 🔧 Конфигурация и настройка

### Настройка точности вычислений

```typescript
import { MathUtil } from '@ts-core/common';

// Настройка для высокоточных вычислений
MathUtil.config = {
    precision: 100,
    toExpPos: 100,
    toExpNeg: -100
};
```

### Валидация данных

```typescript
import { validate } from 'class-validator';

const account = new CoinAccount();
account.uid = 'invalid_uid';
account.inUse = 'not_a_number';

const errors = await validate(account);
if (errors.length > 0) {
    console.log('Ошибки валидации:', errors);
}
```

## 💡 Примеры реальных сценариев

### Сценарий 1: ICO и распределение токенов

```typescript
import { Coin, CoinUtil, CoinBalance, CoinAccountUtil } from '@hlf-core/coin';

// 1. Создание токена для ICO
const ico = CoinUtil.create(Coin, 'ICO_TOKEN', 18, 'company');
console.log(`Токен создан: ${ico.uid}`); // coin_company_18_ICO_TOKEN

// 2. Эмиссия токенов для продажи
ico.balance.add('1000000'); // 1 миллион токенов

// 3. Распределение между инвесторами
const investor1 = CoinAccountUtil.create(ico.uid, 'investor1');
const investor2 = CoinAccountUtil.create(ico.uid, 'investor2');

investor1.add('50000');  // Инвестор 1 купил 50k токенов
investor2.add('30000');  // Инвестор 2 купил 30k токенов

console.log(`Всего эмитировано: ${ico.balance.emitted}`);
console.log(`Баланс инвестора 1: ${investor1.getTotal()}`);
```

### Сценарий 2: Эскроу-система для безопасных сделок

```typescript
import { CoinAccountUtil, CoinTransferCommand } from '@hlf-core/coin';

// Покупатель и продавец
const buyer = CoinAccountUtil.create('coin_issuer_8_USD', 'buyer_alice');
const seller = CoinAccountUtil.create('coin_issuer_8_USD', 'seller_bob');
const escrow = CoinAccountUtil.create('coin_issuer_8_USD', 'escrow_service');

buyer.add('1000'); // У покупателя 1000 USD

// Шаг 1: Покупатель блокирует средства
buyer.hold('100'); // Заблокировано 100 USD для сделки
console.log(`Доступно покупателю: ${buyer.inUse}`);   // 900
console.log(`Заблокировано: ${buyer.held}`);          // 100

// Шаг 2: Переводим в эскроу из held
buyer.removeHeld('100');
escrow.add('100');

// Шаг 3: После подтверждения - переводим продавцу
escrow.remove('100');
seller.add('100');

console.log(`Баланс продавца: ${seller.getTotal()}`); // 100
```

### Сценарий 3: Стейкинг с вознаграждениями

```typescript
import { CoinBalance, CoinAccountUtil } from '@hlf-core/coin';

// Стейкинг пул
const stakingPool = CoinBalance.create();
const user = CoinAccountUtil.create('coin_issuer_18_STAKE', 'user1');

user.add('10000'); // У пользователя 10000 токенов

// Пользователь стейкает токены
const stakeAmount = '5000';
user.hold(stakeAmount); // Заблокировали 5000 токенов

console.log(`В стейкинге: ${user.held}`);        // 5000
console.log(`Доступно: ${user.inUse}`);          // 5000

// Через месяц начисляем награду 10%
const reward = '500';
user.addHeld(reward); // Добавляем награду к заблокированным

console.log(`В стейкинге с наградой: ${user.held}`); // 5500

// Пользователь снимает стейк
user.unhold('5500'); // Разблокируем все токены

console.log(`Итоговый баланс: ${user.getTotal()}`); // 10500
```

### Сценарий 4: Комиссионная система

```typescript
import { CoinAccountUtil, CoinUtil, MathUtil } from '@hlf-core/coin';

function transferWithFee(
    from: CoinAccount,
    to: CoinAccount,
    feeAccount: CoinAccount,
    amount: string,
    feePercent: number
) {
    // Рассчитываем комиссию
    const fee = MathUtil.multiply(
        amount,
        MathUtil.divide(feePercent.toString(), '100')
    );
    const netAmount = MathUtil.subtract(amount, fee);

    // Выполняем перевод
    from.remove(amount);
    to.add(netAmount);
    feeAccount.add(fee);

    return { netAmount, fee };
}

const alice = CoinAccountUtil.create('coin_issuer_8_TOKEN', 'alice');
const bob = CoinAccountUtil.create('coin_issuer_8_TOKEN', 'bob');
const platform = CoinAccountUtil.create('coin_issuer_8_TOKEN', 'platform');

alice.add('1000');

// Перевод с комиссией 2%
const result = transferWithFee(alice, bob, platform, '100', 2);

console.log(`Получатель получил: ${result.netAmount}`);  // 98
console.log(`Комиссия платформы: ${result.fee}`);        // 2
console.log(`Баланс платформы: ${platform.getTotal()}`); // 2
```

### Сценарий 5: Конвертация между токенами

```typescript
import { CoinUtil, CoinAccountUtil, MathUtil } from '@hlf-core/coin';

// Создаем два токена с разной точностью
const btcAccount = CoinAccountUtil.create('coin_exchange_8_BTC', 'user1');
const usdtAccount = CoinAccountUtil.create('coin_exchange_6_USDT', 'user1');

btcAccount.add('100000000'); // 1 BTC (8 decimals)

// Курс: 1 BTC = 50,000 USDT
const btcDecimals = 8;
const usdtDecimals = 6;
const exchangeRate = '50000';

// Конвертируем 0.5 BTC в USDT
const btcAmount = '50000000'; // 0.5 BTC
btcAccount.remove(btcAmount);

// Рассчитываем USDT с учетом decimals
const btcInWhole = CoinUtil.fromCent(btcAmount, btcDecimals);       // "0.5"
const usdtInWhole = MathUtil.multiply(btcInWhole, exchangeRate);    // "25000"
const usdtAmount = CoinUtil.toCent(usdtInWhole, usdtDecimals);      // "25000000000"

usdtAccount.add(usdtAmount);

console.log(`Осталось BTC: ${CoinUtil.fromCent(btcAccount.inUse, btcDecimals)}`);      // 0.5
console.log(`Получено USDT: ${CoinUtil.fromCent(usdtAccount.inUse, usdtDecimals)}`);   // 25000
```

## 📈 Производительность

- ⚡ **Быстрая инициализация**: минимальные зависимости
- 🔢 **Точные вычисления**: использование строк для арифметики
- 🎯 **Оптимизированная валидация**: эффективные регулярные выражения
- 💾 **Экономия памяти**: ленивая инициализация объектов

## 🧪 Тестирование

```typescript
import { CoinAccount, CoinAccountUtil, CoinUtil } from '@hlf-core/coin';

describe('CoinAccount', () => {
    let account: CoinAccount;

    beforeEach(() => {
        account = CoinAccountUtil.create('coin_test_8_BTC', 'user1');
    });

    test('should add tokens correctly', () => {
        account.add('1000');
        expect(account.inUse).toBe('1000');
        expect(account.getTotal()).toBe('1000');
    });

    test('should hold tokens correctly', () => {
        account.add('1000');
        account.hold('200');

        expect(account.inUse).toBe('800');
        expect(account.held).toBe('200');
        expect(account.getTotal()).toBe('1000');
    });

    test('should nullify balance', () => {
        account.add('5000');
        const nullified = account.nullify();

        expect(nullified).toBe('5000');
        expect(account.inUse).toBe('0');
        expect(account.isEmpty()).toBe(true);
    });
});
```

## 📋 Структура проекта

```
hlf-core-coin/
├── src/
│   ├── Coin.ts                      # Основной класс токена
│   ├── CoinAccount.ts               # Управление аккаунтами
│   ├── CoinAccountUtil.ts           # Утилиты для аккаунтов
│   ├── CoinAmount.ts                # Классы для работы с суммами
│   ├── CoinBalance.ts               # Баланс с аудитом
│   ├── CoinUtil.ts                  # Вспомогательные утилиты
│   ├── Error.ts                     # Типы ошибок
│   ├── public-api.ts                # Публичный API
│   └── transport/                   # Команды и события
│       ├── CoinAmountDto.ts         # DTO для операций с суммами
│       ├── CoinBalanceGetCommand.ts
│       ├── CoinBurnCommand.ts
│       ├── CoinBurnedEvent.ts
│       ├── CoinEditedEvent.ts
│       ├── CoinEmitCommand.ts
│       ├── CoinEmittedEvent.ts
│       ├── CoinGetCommand.ts
│       ├── CoinHoldCommand.ts
│       ├── CoinHoldedEvent.ts
│       ├── CoinNullifyCommand.ts
│       ├── CoinNullifiedEvent.ts
│       ├── CoinTransferCommand.ts
│       ├── CoinTransferredEvent.ts
│       ├── CoinUnholdCommand.ts
│       └── CoinUnholdedEvent.ts
├── dist/                            # Скомпилированный код
│   ├── cjs/                         # CommonJS модули
│   └── esm/                         # ES модули
├── package.json
├── tsconfig.json
└── README.md
```

## 🔍 API Reference

### Основные типы

```typescript
// Интерфейсы токенов
interface ICoin<T = ICoinBalance> {
    uid: string;
    balance: T;
}

// Интерфейсы аккаунтов
interface ICoinAccount {
    uid: string;
    held: string;
    inUse: string;
    ownerUid: string;

    isEmpty(): boolean;
    getTotal(): string;
    add(value: string): void;
    remove(value: string): void;
    hold(value: string): void;
    unhold(value: string): void;
    nullify(): string;
    nullifyHeld(): string;
}

// Интерфейс баланса
interface ICoinBalance extends ICoinAccount {
    total: string;
    burned: string;
    emitted: string;

    transfer(value: string): void;
    transferToHeld(value: string): void;
    transferFromHeld(value: string): void;
}

// Интерфейсы сумм
interface ICoinAmount {
    value: string;
    coinUid: string;
}

interface ICoinObjectAmount extends ICoinAmount {
    objectUid: string;
}

interface ICoinAmountDto extends ICoinAmount {
    initiatorUid?: string;
}

interface ICoinObjectAmountDto extends ICoinObjectAmount {
    initiatorUid?: string;
}
```

### Регулярные выражения

```typescript
// Валидация UID токена
CoinUtil.UID_REG_EXP
// Паттерн: ^coin_[A-Za-z0-9_]+_[0-9]+_[A-Za-z0-9.]{1,64}$
// Пример: coin_owner_8_BTC

// Валидация ID токена
CoinUtil.COIN_ID_REG_EXP
// Паттерн: ^[A-Za-z0-9.]{1,64}$
// Пример: BTC, ETH, MY.TOKEN

// Валидация UID владельца
CoinUtil.OWNER_UID_REG_EXP
// Паттерн: ^[A-Za-z0-9_]+$
// Пример: user_123, alice

// Валидация UID объекта
CoinUtil.OBJECT_UID_REG_EXP
// Паттерн: ^[A-Za-z0-9_]+$
// Пример: user1, bob_wallet
```

### Методы CoinUtil

```typescript
// Создание токена
CoinUtil.create<T>(classType: ClassType<T>, coinId: string, decimals: number, owner: UID): T

// Создание UID
CoinUtil.createUid(coinId: string, decimals: number, owner: UID): string

// Проверка UID
CoinUtil.isCoin(uid: UID): boolean

// Разбор UID
CoinUtil.decomposeUid(coin: UID): ICoinUidDecomposition
// Возвращает: { coinId: string, decimals: number, ownerUid: string }

// Получение компонентов
CoinUtil.getCoinId<T = string>(coin: UID): T
CoinUtil.getOwnerUid(coin: UID): string
CoinUtil.getDecimals(coin: UID): number

// Конвертация значений
CoinUtil.toCent(value: string, decimals: number): string
CoinUtil.fromCent(value: string, decimals: number): string
CoinUtil.toPercent(value: string, total: string): number
```

### Методы CoinAccountUtil

```typescript
// Сборщик ключей пространства аккаунтов
CoinAccountUtil.PREFIX: string   // →coin~account
CoinAccountUtil.KEY: StateKey

// Создание аккаунта
CoinAccountUtil.create(coin: UID, owner: UID): CoinAccount

// Точный ключ аккаунта — владелец обязателен
CoinAccountUtil.createUid(coin: UID, owner: UID): string
// Формат: →coin~account:coin_uid~owner_uid

// Префикс для диапазонного поиска — всегда с завершающим разделителем
CoinAccountUtil.createPrefix(coin?: UID): string
// Формат: →coin~account:coin_uid~   либо   →coin~account:   без аргумента

// Разбор UID аккаунта
CoinAccountUtil.decomposeUid(coin: UID): ICoinAccountUidDecomposition
// Возвращает: { coinUid: string, owner?: string } либо null для чужого пространства
```

### Структура команд и событий

```typescript
// ============== КОМАНДЫ ==============

// Команда перевода
interface ICoinTransferDto {
    objectUid: string;     // Отправитель
    to: string;            // Получатель
    value: string;         // Сумма перевода
    coinUid: string;       // UID токена
    initiatorUid?: string; // Опционально: инициатор операции
}

// Команда удержания/разблокировки
interface ICoinObjectAmountDto {
    objectUid: string;     // Пользователь, чьи средства блокируются
    value: string;         // Сумма
    coinUid: string;       // UID токена
    initiatorUid?: string; // Опционально: инициатор операции
}

// Команда эмиссии/сжигания
interface ICoinEmitDto {
    objectUid: string;        // Пользователь
    value: string;            // Сумма
    coinUid: string;          // UID токена
    transactionHash?: string; // Опционально: хеш транзакции
    initiatorUid?: string;    // Опционально: инициатор операции
}

// Команда обнуления
interface ICoinNullifyDto {
    coinUid: string;          // UID токена
    objectUid: string;        // Пользователь
    transactionHash?: string; // Опционально: хеш транзакции
    initiatorUid?: string;    // Опционально: инициатор операции
}

// ============== СОБЫТИЯ ==============

// Событие перевода (внимание: target вместо to!)
interface ICoinTransferEventDto {
    objectUid: string;     // Отправитель
    target: string;        // Получатель (в событии это target!)
    value: string;         // Сумма перевода
    coinUid: string;       // UID токена
    initiatorUid?: string; // Опционально: инициатор операции
}

// События эмиссии/сжигания/удержания/разблокировки
interface ICoinEditedEventDto {
    objectUid: string;     // Пользователь
    value: string;         // Сумма
    coinUid: string;       // UID токена
    initiatorUid?: string; // Опционально: инициатор операции
}

// Событие обнуления (внимание: НЕТ поля value!)
interface ICoinNullifiedEventDto {
    coinUid: string;       // UID токена
    objectUid: string;     // Пользователь
    initiatorUid?: string; // Опционально: инициатор операции
}
```

### Коды ошибок

```typescript
enum ErrorCode {
    // Сумма должна быть больше нуля
    COIN_AMOUNT_MUST_BE_GREATER_THAN_ZERO = 'HLF_COIN_AMOUNT_MUST_BE_GREATER_THAN_ZERO',

    // Сумма должна быть больше или равна нулю
    COIN_AMOUNT_MUST_BE_GREATER_OR_EQUALS_ZERO = 'HLF_COIN_AMOUNT_MUST_BE_GREATER_OR_EQUALS_ZERO',

    // Баланс должен быть больше требуемой суммы
    COIN_BALANCE_MUST_BE_GREATER_THAN_AMOUNT = 'HLF_COIN_BALANCE_MUST_BE_GREATER_THAN_AMOUNT'
}
```

## ⚠️ Важные замечания и лучшие практики

### Работа с числами

```typescript
// ✅ ПРАВИЛЬНО: Всегда используйте строки
account.add('1000.50');
account.remove('500.25');

// ❌ НЕПРАВИЛЬНО: Не используйте числа напрямую
account.add(1000.50);  // Может привести к потере точности
```

### Валидация данных

```typescript
import { validate } from 'class-validator';
import { CoinAccount } from '@hlf-core/coin';

// Всегда валидируйте данные перед операциями
const account = new CoinAccount();
account.uid = 'coin_owner_8_BTC';
account.inUse = '1000';
account.held = '0';
account.ownerUid = 'user1';

const errors = await validate(account);
if (errors.length > 0) {
    throw new Error('Невалидные данные аккаунта');
}
```

### Безопасность операций

```typescript
try {
    account.remove('5000');
} catch (error) {
    if (error instanceof CoinBalanceMustBeGreaterThanAmountError) {
        // Обработка недостаточного баланса
        console.error('Недостаточно средств:', error.details);
    }
}
```

### Атомарность транзакций

```typescript
// При переводе убедитесь, что все операции выполнены успешно
function atomicTransfer(from: CoinAccount, to: CoinAccount, amount: string) {
    try {
        from.remove(amount);
        to.add(amount);
        return true;
    } catch (error) {
        // В случае ошибки откатываем изменения
        console.error('Ошибка перевода:', error);
        return false;
    }
}
```

## 🔧 Зависимости

### Основные зависимости

```json
{
    "@hlf-core/common": "~3.2.7"
}
```

**@hlf-core/common** предоставляет:
- `StateKey` - сборка ключей состояния и префиксов поиска
- `MathUtil` - утилиты для точных математических операций
- `TransformUtil` - утилиты для трансформации объектов
- `HlfTransportCommandAsync` - базовый класс для команд Hyperledger Fabric
- `IUIDable`, `UID`, `getUid` - типы и утилиты для работы с идентификаторами

### Dev зависимости

```json
{
    "@types/node": "^14.14.31",
    "gulp-npm-module-publisher": "^3.0.5"
}
```

### Peer зависимости

Библиотека использует следующие peer зависимости:
- `class-validator` - для декораторов валидации (@IsString, @IsNumberString, @Matches)
- `class-transformer` - для трансформации объектов (@Type)
- `lodash` - для вспомогательных функций
- `@ts-core/common` - базовые типы и утилиты

## 🏗️ Сборка и разработка

### Установка зависимостей

```bash
npm install
```

### Структура сборки

Проект поддерживает оба формата модулей:

**CommonJS** (для Node.js)
```javascript
const { Coin, CoinUtil } = require('@hlf-core/coin');
```

**ES Modules** (для современных систем)
```javascript
import { Coin, CoinUtil } from '@hlf-core/coin';
```

### TypeScript конфигурации

- `tsconfig.json` - базовая конфигурация
- `tsconfig.cjs.json` - для сборки CommonJS модулей
- `tsconfig.esm.json` - для сборки ES модулей

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта!

### Как помочь:

1. 🐛 **Сообщить об ошибке**: создайте issue с описанием проблемы
2. 💡 **Предложить улучшение**: опишите идею в issue
3. 🔧 **Исправить код**: сделайте fork и отправьте pull request
4. 📖 **Улучшить документацию**: помогите сделать документацию лучше

### Требования к коду:

- TypeScript с строгой типизацией
- Следование принципам SOLID
- Покрытие тестами
- Документация для публичных API

### Процесс разработки:

```bash
# 1. Форк и клонирование
git clone https://github.com/your-username/hlf-core-coin.git

# 2. Создание ветки
git checkout -b feature/your-feature-name

# 3. Внесение изменений
# ... ваш код ...

# 4. Коммит и push
git add .
git commit -m "feat: описание изменений"
git push origin feature/your-feature-name

# 5. Создание Pull Request
```

## ❓ FAQ (Часто задаваемые вопросы)

### Почему используются строки вместо чисел?

JavaScript имеет ограничения точности при работе с числами с плавающей запятой. Использование строк с библиотекой `MathUtil` обеспечивает абсолютную точность в финансовых операциях.

```typescript
// JavaScript теряет точность
0.1 + 0.2 === 0.3 // false (0.30000000000000004)

// С библиотекой - точно
MathUtil.add('0.1', '0.2') // "0.3"
```

### В чем разница между CoinAccount и CoinBalance?

- **CoinAccount** - базовый класс для управления балансом с двумя состояниями (inUse и held)
- **CoinBalance** - расширенная версия с аудитом (emitted, burned) для отслеживания истории

```typescript
// Для пользовательских аккаунтов
const userAccount = new CoinAccount(); // inUse, held

// Для главного баланса токена с аудитом
const tokenBalance = new CoinBalance(); // + emitted, burned
```

### Как работает система held/unhold?

Система блокировки средств позволяет зарезервировать токены для будущих операций:

```typescript
account.add('1000');     // inUse: 1000, held: 0
account.hold('300');     // inUse: 700,  held: 300 (заблокировано)
account.unhold('100');   // inUse: 800,  held: 200 (разблокировано)
```

### Можно ли использовать библиотеку без Hyperledger Fabric?

Да, библиотека может использоваться в любых TypeScript/JavaScript проектах. Классы команд и событий опциональны и нужны только для интеграции с Hyperledger Fabric.

### Как обрабатывать ошибки валидации?

Используйте `class-validator` для валидации перед операциями:

```typescript
import { validate } from 'class-validator';

const account = new CoinAccount();
// ... установка свойств ...

const errors = await validate(account);
if (errors.length > 0) {
    console.log('Ошибки валидации:', errors);
}
```

## 🔒 Безопасность

### Отчеты о уязвимостях

Если вы обнаружили уязвимость безопасности, пожалуйста, отправьте email на [renat.gubaev@gmail.com](mailto:renat.gubaev@gmail.com) вместо создания публичного issue.

### Рекомендации по безопасности

1. **Валидация входных данных**: Всегда валидируйте данные перед операциями
2. **Проверка балансов**: Используйте try-catch для обработки ошибок недостаточного баланса
3. **Атомарность операций**: Обеспечьте откат изменений при ошибках
4. **Аудит операций**: Используйте CoinBalance для отслеживания всех изменений

## 📄 Лицензия

ISC License

Copyright (c) 2024 Renat Gubaev

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

## 👨‍💻 Автор

**Renat Gubaev**
📧 Email: [renat.gubaev@gmail.com](mailto:renat.gubaev@gmail.com)
🐙 GitHub: [@ManhattanDoctor](https://github.com/ManhattanDoctor)

## 🙏 Благодарности

Спасибо всем контрибьюторам и пользователям библиотеки за обратную связь и помощь в развитии проекта!

## 🔗 Полезные ссылки

- 📦 [NPM Package](https://www.npmjs.com/package/@hlf-core/coin)
- 🐛 [Issues](https://github.com/ManhattanDoctor/hlf-core-common/issues)
- 📖 [Documentation](https://github.com/ManhattanDoctor/hlf-core-common#readme)
- 🏗️ [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/)
- 📚 [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- 🔧 [Class Validator](https://github.com/typestack/class-validator)

## 📈 Статистика проекта

![npm version](https://badge.fury.io/js/@hlf-core%2Fcoin.svg)
![npm downloads](https://img.shields.io/npm/dm/@hlf-core/coin.svg)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

---

⭐ **Если проект полезен, поставьте звезду на GitHub!**

💬 **Есть вопросы? Создайте [issue](https://github.com/ManhattanDoctor/hlf-core-common/issues) или напишите [email](mailto:renat.gubaev@gmail.com)**