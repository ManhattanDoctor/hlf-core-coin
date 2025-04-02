import { IsString, IsNumberString, IsOptional } from 'class-validator';
import { MathUtil } from '@ts-core/common';
import { CoinAccount, ICoinAccount } from './CoinAccount';
import * as _ from 'lodash';

export class CoinBalance extends CoinAccount {

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static create(): CoinBalance {
        let item = new CoinBalance();
        item.emitted = item.burned = item.held = item.inUse = '0';
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @IsOptional()
    @IsString()
    declare public uid: string;

    @IsOptional()
    @IsString()
    declare public ownerUid: string;

    @IsNumberString()
    public burned: string;

    @IsNumberString()
    public emitted: string;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public add(amount: string): void {
        super.add(amount);
        this.emitted = MathUtil.add(this.emitted, amount);
    }

    public remove(amount: string): void {
        super.remove(amount);
        this.burned = MathUtil.add(this.burned, amount);
    }

    public addHeld(amount: string): void {
        super.addHeld(amount);
        this.emitted = MathUtil.add(this.emitted, amount);
    }

    public removeHeld(amount: string): void {
        super.removeHeld(amount);
        this.burned = MathUtil.add(this.burned, amount);
    }

    public transfer(amount: string): void { }

    public transferFromHeld(amount: string): void {
        this.unhold(amount);
    }

    public transferToHeld(amount: string): void {
        this.hold(amount);
    }

    public transferFromToHeld(amount: string): void { }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get total(): string {
        return this.getTotal();
    }
}

export interface ICoinBalance extends ICoinAccount {
    total: string;
    burned: string;
    emitted: string;
}
