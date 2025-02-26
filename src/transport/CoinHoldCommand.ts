import { TransformUtil } from '@ts-core/common';
import { Matches, IsNumberString } from 'class-validator';
import { HlfTransportCommandAsync, InitiatedDto } from '@hlf-core/common';
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

export interface ICoinHoldDto extends InitiatedDto {
    from: string;
    amount: string;
    coinUid: string;
}

export class CoinHoldDto extends InitiatedDto implements ICoinHoldDto {
    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public from: string;

    @IsNumberString()
    public amount: string;

    @Matches(CoinUtil.UID_REG_EXP)
    public coinUid: string;
}
