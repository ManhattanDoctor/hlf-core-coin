
import { MathUtil, IUIDable } from '@ts-core/common';
import { IsString, IsNumberString } from 'class-validator';
import { CoinAmountMustBeGreaterThanZeroError, CoinBalanceMustBeGreaterThanAmountError } from './Error';
import { CoinAccountUtil } from './CoinAccountUtil';
import * as _ from 'lodash';

export class CoinAccount implements ICoinAccount {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static create(): CoinAccount {
        let item = new CoinAccount();
        item.held = item.inUse = '0';
        return item;
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

    public add(value: string): void {
        if (MathUtil.lessThanOrEqualTo(value, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(value);
        }
        this.inUse = MathUtil.add(this.inUse, value);
    }

    public addHeld(value: string): void {
        if (MathUtil.lessThanOrEqualTo(value, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(value);
        }
        this.held = MathUtil.add(this.held, value);
    }

    public remove(value: string): void {
        if (MathUtil.lessThanOrEqualTo(value, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(value);
        }
        if (MathUtil.greaterThan(value, this.inUse)) {
            throw new CoinBalanceMustBeGreaterThanAmountError({ coinUid: CoinAccountUtil.decomposeUid(this.uid).coinUid, current: this.inUse, required: value });
        }
        this.inUse = MathUtil.subtract(this.inUse, value);
    }

    public removeHeld(value: string): void {
        if (MathUtil.lessThanOrEqualTo(value, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(value);
        }
        if (MathUtil.greaterThan(value, this.held)) {
            throw new CoinBalanceMustBeGreaterThanAmountError({ coinUid: CoinAccountUtil.decomposeUid(this.uid).coinUid, current: this.held, required: value });
        }
        this.held = MathUtil.subtract(this.held, value);
    }

    public hold(value: string): void {
        if (MathUtil.lessThanOrEqualTo(value, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(value);
        }
        if (MathUtil.greaterThan(value, this.inUse)) {
            throw new CoinBalanceMustBeGreaterThanAmountError({ coinUid: CoinAccountUtil.decomposeUid(this.uid).coinUid, current: this.inUse, required: value });
        }
        this.held = MathUtil.add(this.held, value);
        this.inUse = MathUtil.subtract(this.inUse, value);
    }

    public unhold(value: string): void {
        if (MathUtil.lessThanOrEqualTo(value, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(value);
        }
        if (MathUtil.greaterThan(value, this.held)) {
            throw new CoinBalanceMustBeGreaterThanAmountError({ coinUid: CoinAccountUtil.decomposeUid(this.uid).coinUid, current: this.held, required: value });
        }
        this.held = MathUtil.subtract(this.held, value);
        this.inUse = MathUtil.add(this.inUse, value);
    }

    public nullify(): string {
        let value = this.inUse;
        this.inUse = '0';
        return value;
    }

    public nullifyHeld(): string {
        let value = this.held;
        this.held = '0';
        return value;
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

    add(value: string): void;
    addHeld(value: string): void;

    remove(value: string): void;
    removeHeld(value: string): void;

    hold(value: string): void;
    unhold(value: string): void;

    nullify(): string;
    nullifyHeld(): string;
}
