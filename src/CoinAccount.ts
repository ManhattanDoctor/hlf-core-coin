
import { getUid, MathUtil, UID, IUIDable } from '@ts-core/common';
import { IsString, IsNumberString } from 'class-validator';
import { CoinAmountMustBeGranterThanZeroError, CoinBalanceMustBeGranterThanAmountError } from './Error';
import * as _ from 'lodash';

export class CoinAccount implements ICoinAccount {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = '→coin~account';

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static create(coin: UID, owner: UID): CoinAccount {
        let item = new CoinAccount();
        item.uid = CoinAccount.createUid(coin, owner);
        item.held = item.inUse = '0';
        item.ownerUid = getUid(owner);
        return item;
    }

    public static createUid(coin: UID, owner?: UID): string {
        let item = `${CoinAccount.PREFIX}:${getUid(coin)}`;
        return !_.isNil(owner) ? `${item}~${getUid(owner)}` : item;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @IsString()
    public uid: string;

    @IsNumberString()
    public held: string;

    @IsNumberString()
    public inUse: string;

    @IsString()
    public ownerUid: string;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public emit(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGranterThanZeroError(amount);
        }
        this.inUse = MathUtil.add(this.inUse, amount);
    }

    public emitHeld(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGranterThanZeroError(amount);
        }
        this.held = MathUtil.add(this.held, amount);
    }

    public burn(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGranterThanZeroError(amount);
        }
        if (MathUtil.greaterThan(amount, this.inUse)) {
            throw new CoinBalanceMustBeGranterThanAmountError({ expected: this.inUse, value: amount });
        }
        this.inUse = MathUtil.subtract(this.inUse, amount);
    }

    public burnHeld(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGranterThanZeroError(amount);
        }
        if (MathUtil.greaterThan(amount, this.held)) {
            throw new CoinBalanceMustBeGranterThanAmountError({ expected: this.held, value: amount });
        }
        this.held = MathUtil.subtract(this.held, amount);
    }

    public hold(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGranterThanZeroError(amount);
        }
        if (MathUtil.greaterThan(amount, this.inUse)) {
            throw new CoinBalanceMustBeGranterThanAmountError({ expected: this.inUse, value: amount });
        }
        this.held = MathUtil.add(this.held, amount);
        this.inUse = MathUtil.subtract(this.inUse, amount);
    }

    public unhold(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGranterThanZeroError(amount);
        }
        if (MathUtil.greaterThan(amount, this.held)) {
            throw new CoinBalanceMustBeGranterThanAmountError({ expected: this.held, value: amount });
        }
        this.held = MathUtil.subtract(this.held, amount);
        this.inUse = MathUtil.add(this.inUse, amount);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public isEmpty(): boolean {
        let item = this.getTotal();
        return _.isNil(item) || MathUtil.equals(item, '0');
    }

    public getTotal(): string {
        return MathUtil.add(this.held, this.inUse);
    }
}

export interface ICoinAccount extends IUIDable {
    uid: string;
    held: string;
    inUse: string;
    ownerUid: string;

    isEmpty(): boolean;
    getTotal(): string;

    emit(amount: string): void;
    emitHeld(amount: string): void;

    burn(amount: string): void;
    burnHeld(amount: string): void;

    hold(amount: string): void;
    unhold(amount: string): void;
}
