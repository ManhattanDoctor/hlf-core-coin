import { TransformUtil } from '@ts-core/common';
import { Matches, IsNumberString } from 'class-validator';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CoinUtil } from '../CoinUtil';
import { CommandName } from './Command';

export class CoinHoldCommand extends HlfTransportCommandAsync<ICoinHoldDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_HOLD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinHoldDto) {
        super(CoinHoldCommand.NAME, TransformUtil.toClass(CoinHoldDto, request));
    }
}

export interface ICoinHoldDto {
    from: string;
    amount: string;
    coinUid: string;
}

export class CoinHoldDto implements ICoinHoldDto {
    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    from: string;

    @IsNumberString()
    amount: string;

    @Matches(CoinUtil.UID_REG_EXP)
    coinUid: string;
}
