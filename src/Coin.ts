import { IUIDable } from "@ts-core/common";
import { CoinBalance, ICoinBalance } from "./CoinBalance";
import { IsOptional, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CoinUtil } from "./CoinUtil";
import * as _ from 'lodash';

export class Coin<T extends ICoinBalance = ICoinBalance> implements ICoin<T> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = 'coin';

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @Matches(CoinUtil.UID_REG_EXP)
    public uid: string;

    @IsOptional()
    @Type(() => CoinBalance)
    @ValidateNested()
    public balance: T;
}


export interface ICoin<T = ICoinBalance> extends IUIDable {
    uid: string;
    balance: T;
}
