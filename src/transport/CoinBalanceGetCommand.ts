import { TransformUtil } from '@ts-core/common';
import { Matches } from 'class-validator';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import * as _ from 'lodash';

export class CoinBalanceGetCommand extends HlfTransportCommandAsync<ICoinBalanceGetDto, ICoinBalanceGetDtoResponse> {
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
}

export interface ICoinBalanceGetDto {
    coinUid: string;
    objectUid: string;
}

export interface ICoinBalanceGetDtoResponse {
    held: string;
    inUse: string;
    total: string;
}

export class CoinBalanceGetDto implements ICoinBalanceGetDto {
    @Matches(CoinUtil.UID_REG_EXP)
    public coinUid: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public objectUid: string;
}
