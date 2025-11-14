
import { MathUtil, IUIDable } from '@ts-core/common';
import { IsString, IsNumberString } from 'class-validator';
import { CoinAmountMustBeGreaterThanZeroError, CoinBalanceMustBeGreaterThanAmountError } from './Error';
import { CoinAccountUtil } from './CoinAccountUtil';
import * as _ from 'lodash';

export class CoinAccount implements ICoinAccount {

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

    public add(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(amount);
        }
        this.inUse = MathUtil.add(this.inUse, amount);
    }

    public addHeld(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(amount);
        }
        this.held = MathUtil.add(this.held, amount);
    }

    public remove(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(amount);
        }
        if (MathUtil.greaterThan(amount, this.inUse)) {
            throw new CoinBalanceMustBeGreaterThanAmountError({ coinUid: CoinAccountUtil.decomposeUid(this.uid).coinUid, current: this.inUse, required: amount });
        }
        this.inUse = MathUtil.subtract(this.inUse, amount);
    }

    public removeHeld(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(amount);
        }
        if (MathUtil.greaterThan(amount, this.held)) {
            throw new CoinBalanceMustBeGreaterThanAmountError({ coinUid: CoinAccountUtil.decomposeUid(this.uid).coinUid, current: this.inUse, required: amount });
        }
        this.held = MathUtil.subtract(this.held, amount);
    }

    public hold(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(amount);
        }
        if (MathUtil.greaterThan(amount, this.inUse)) {
            throw new CoinBalanceMustBeGreaterThanAmountError({ coinUid: CoinAccountUtil.decomposeUid(this.uid).coinUid, current: this.inUse, required: amount });
        }
        this.held = MathUtil.add(this.held, amount);
        this.inUse = MathUtil.subtract(this.inUse, amount);
    }

    public unhold(amount: string): void {
        if (MathUtil.lessThanOrEqualTo(amount, '0')) {
            throw new CoinAmountMustBeGreaterThanZeroError(amount);
        }
        if (MathUtil.greaterThan(amount, this.held)) {
            throw new CoinBalanceMustBeGreaterThanAmountError({ coinUid: CoinAccountUtil.decomposeUid(this.uid).coinUid, current: this.inUse, required: amount });
        }
        this.held = MathUtil.subtract(this.held, amount);
        this.inUse = MathUtil.add(this.inUse, amount);
    }

    public nullify(): string {
        let amount = this.inUse;
        this.inUse = '0';
        return amount;
    }

    public nullifyHeld(): string {
        let amount = this.held;
        this.held = '0';
        return amount;
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

    add(amount: string): void;
    addHeld(amount: string): void;

    remove(amount: string): void;
    removeHeld(amount: string): void;

    hold(amount: string): void;
    unhold(amount: string): void;

    nullify(): string;
    nullifyHeld(): string;
}
