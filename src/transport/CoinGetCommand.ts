import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { IsOptional, Matches, IsArray } from 'class-validator';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';
import { Coin, ICoin } from '../Coin';
import * as _ from 'lodash';

export class CoinGetCommand<T extends ICoin = ICoin> extends HlfTransportCommandAsync<ICoinGetDto<T>, T> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinGetDto<T>) {
        super(CoinGetCommand.NAME, TransformUtil.toClass(CoinGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: T): T {
        return TransformUtil.toClass(Coin, item) as T;
    }
}

export interface ICoinGetDto<T extends ICoin = ICoin> {
    uid: string;
    details?: Array<keyof T>;
}

export class CoinGetDto<T extends ICoin = ICoin> implements ICoinGetDto<T> {
    @Matches(CoinUtil.UID_REG_EXP)
    public uid: string;

    @IsArray()
    @IsOptional()
    public details?: Array<keyof T>;
}
