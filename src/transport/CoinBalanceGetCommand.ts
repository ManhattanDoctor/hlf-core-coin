import { TransformUtil } from '@ts-core/common';
import { Matches } from 'class-validator';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CoinBalance, ICoinBalance } from '../CoinBalance';
import * as _ from 'lodash';

export class CoinBalanceGetCommand<T extends ICoinBalance = ICoinBalance> extends HlfTransportCommandAsync<ICoinBalanceGetDto, T> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_BALANCE_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinBalanceGetDto) {
        super(CoinBalanceGetCommand.NAME, TransformUtil.toClass(CoinBalanceGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: T): T {
        return TransformUtil.toClass(CoinBalance, item) as T;
    }
}

export interface ICoinBalanceGetDto {
    coinUid: string;
    objectUid: string;
}

export class CoinBalanceGetDto implements ICoinBalanceGetDto {
    @Matches(CoinUtil.UID_REG_EXP)
    public coinUid: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public objectUid: string;
}
