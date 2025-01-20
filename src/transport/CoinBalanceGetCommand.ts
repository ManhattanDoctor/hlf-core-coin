import { TransformUtil } from '@ts-core/common';
import { Matches } from 'class-validator';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CoinBalance } from '../CoinBalance';
import * as _ from 'lodash';

export class CoinBalanceGetCommand extends HlfTransportCommandAsync<ICoinBalanceGetDto, CoinBalance> {
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

    protected checkResponse(item: CoinBalance): CoinBalance {
        return TransformUtil.toClass(CoinBalance, item);
    }
}

export interface ICoinBalanceGetDto {
    coinUid: string;
    objectUid: string;
}

class CoinBalanceGetDto implements ICoinBalanceGetDto {
    @Matches(CoinUtil.UID_REG_EXP)
    coinUid: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    objectUid: string;
}
