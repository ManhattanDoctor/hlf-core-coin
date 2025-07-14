import { ExtendedError } from '@ts-core/common';
import * as _ from 'lodash';

export class Error<T = void> extends ExtendedError<T, ErrorCode> {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static instanceOf(item: any): item is Error {
        return item instanceof Error || Object.values(ErrorCode).includes(item.code);
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(code: ErrorCode, public details: T, public status: number = ExtendedError.HTTP_CODE_BAD_REQUEST) {
        super('', code, details);
        this.message = this.constructor.name;
    }
}

export class CoinAmountMustBeGranterThanZeroError extends Error<string> {
    constructor(amount: string) {
        super(ErrorCode.COIN_AMOUNT_MUST_BE_GRANTER_THAN_ZERO, amount)
    }
}
export class CoinBalanceMustBeGranterThanAmountError extends Error<ICoinBalanceDetails> {
    constructor(details: ICoinBalanceDetails) {
        super(ErrorCode.COIN_BALANCE_MUST_BE_GRANTER_THAN_AMOUNT, details)
    }
}

export interface ICoinBalanceDetails {
    current: string;
    coinUid: string;
    required: string;
}

export interface IInvalidValue<T = any> {
    name?: string;
    value: T | Array<T>;
    expected?: T | Array<T>;
}

export enum ErrorCode {
    COIN_AMOUNT_MUST_BE_GRANTER_THAN_ZERO = 'HLF_COIN_AMOUNT_MUST_BE_GRANTER_THAN_ZERO',
    COIN_BALANCE_MUST_BE_GRANTER_THAN_AMOUNT = 'HLF_COIN_BALANCE_MUST_BE_GRANTER_THAN_AMOUNT',
}
