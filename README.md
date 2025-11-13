# @hlf-core/coin

> TypeScript библиотека для управления токенами и их балансами в блокчейн-системах

[![npm version](https://badge.fury.io/js/@hlf-core%2Fcoin.svg)](https://badge.fury.io/js/@hlf-core%2Fcoin)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

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
    from: 'user1',
    to: 'user2',
    amount: '100',
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
console.log(account.getTotal());    // "1200" (1000 + 200)
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
const amount = CoinUtil.fromCent('150', 2);  // "1.5"
const percent = CoinUtil.toPercent('25', '100'); // 25

// Валидация
const isValid = CoinUtil.isCoin('coin_user_8_BTC'); // true
```

## 🎯 Основные операции

### Эмиссия токенов

```typescript
import { CoinEmitCommand, CoinEmittedEvent } from '@hlf-core/coin';

// Команда эмиссии
const emitCommand = new CoinEmitCommand({
    amount: '10000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1',
    transactionHash: '0x123abc...'
});

// Событие после выполнения
const emittedEvent = new CoinEmittedEvent({
    amount: '10000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1'
});
```

### Переводы между аккаунтами

```typescript
import { CoinTransferCommand, CoinTransferredEvent } from '@hlf-core/coin';

// Команда перевода
const transferCommand = new CoinTransferCommand({
    from: 'alice',
    to: 'bob',
    amount: '500',
    coinUid: 'coin_issuer_8_MYTOKEN'
});

// Событие перевода
const transferEvent = new CoinTransferredEvent({
    from: 'alice',
    to: 'bob',
    amount: '500',
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
    from: 'user1',
    amount: '100',
    coinUid: 'coin_issuer_8_MYTOKEN'
});

// После завершения транзакции - разблокировка
const unholdCommand = new CoinUnholdCommand({
    from: 'user1',
    amount: '100',
    coinUid: 'coin_issuer_8_MYTOKEN'
});
```

### Сжигание токенов

```typescript
import { CoinBurnCommand, CoinBurnedEvent } from '@hlf-core/coin';

const burnCommand = new CoinBurnCommand({
    amount: '1000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1'
});

const burnedEvent = new CoinBurnedEvent({
    amount: '1000',
    coinUid: 'coin_issuer_8_MYTOKEN',
    objectUid: 'user1'
});
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

Библиотека полностью совместима с Hyperledger Fabric:

```typescript
import { HlfTransport } from '@hlf-core/common';

// Выполнение команды в chaincode
const transport = new HlfTransport();
const result = await transport.execute(transferCommand);

// Подписка на события
transport.on('CoinTransferred', (event) => {
    console.log('Перевод выполнен:', event.data);
});
```

## 📊 Система команд и событий

### Команды (Commands)

| Команда | Описание |
|---------|----------|
| `CoinEmitCommand` | Эмиссия новых токенов |
| `CoinBurnCommand` | Сжигание токенов |
| `CoinTransferCommand` | Перевод между аккаунтами |
| `CoinHoldCommand` | Блокировка средств |
| `CoinUnholdCommand` | Разблокировка средств |
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

## 🎨 Расширенное использование

### Создание кастомного токена

```typescript
import { Coin, CoinBalance } from '@hlf-core/coin';

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

## 📈 Производительность

- ⚡ **Быстрая инициализация**: минимальные зависимости
- 🔢 **Точные вычисления**: использование строк для арифметики
- 🎯 **Оптимизированная валидация**: эффективные регулярные выражения
- 💾 **Экономия памяти**: ленивая инициализация объектов

## 🧪 Тестирование

```typescript
import { CoinAccount, CoinUtil } from '@hlf-core/coin';

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
});
```

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

## 📄 Лицензия

ISC License

Copyright (c) 2024 Renat Gubaev

## 👨‍💻 Автор

**Renat Gubaev**  
📧 Email: [renat.gubaev@gmail.com](mailto:renat.gubaev@gmail.com)  
🐙 GitHub: [@ManhattanDoctor](https://github.com/ManhattanDoctor)

## 🔗 Полезные ссылки

- 📦 [NPM Package](https://www.npmjs.com/package/@hlf-core/coin)
- 🐛 [Issues](https://github.com/ManhattanDoctor/hlf-core-common/issues)
- 📖 [Documentation](https://github.com/ManhattanDoctor/hlf-core-common#readme)
- 🏗️ [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/)

---

⭐ **Если проект полезен, поставьте звезду на GitHub!**