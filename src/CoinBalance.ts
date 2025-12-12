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
        item.held = item.inUse = item.emitted = item.burned = '0';
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

    public add(value: string): void {
        super.add(value);
        this.emitted = MathUtil.add(this.emitted, value);
    }

    public remove(value: string): void {
        super.remove(value);
        this.burned = MathUtil.add(this.burned, value);
    }

    public addHeld(value: string): void {
        super.addHeld(value);
        this.emitted = MathUtil.add(this.emitted, value);
    }

    public removeHeld(value: string): void {
        super.removeHeld(value);
        this.burned = MathUtil.add(this.burned, value);
    }

    public transfer(value: string): void { }

    public transferFromHeld(value: string): void {
        this.unhold(value);
    }

    public transferToHeld(value: string): void {
        this.hold(value);
    }

    public nullify(): string {
        let value = super.nullify();
        this.burned = MathUtil.add(this.burned, value);
        return value;
    }

    public nullifyHeld(): string {
        let value = super.nullifyHeld();
        this.burned = MathUtil.add(this.burned, value);
        return value;
    }

    public transferFromToHeld(value: string): void { }

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

    transfer(value: string): void;
    transferToHeld(value: string): void;
    transferFromHeld(value: string): void;
    transferFromToHeld(value: string): void;
}
