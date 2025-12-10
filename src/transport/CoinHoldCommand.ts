import { TransformUtil } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import { HlfTransportCommandAsync, InitiatedDto } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinObjectAmount, ICoinObjectAmount } from '../CoinAmount';

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

export interface ICoinHoldDto extends ICoinObjectAmount, InitiatedDto { }

export class CoinHoldDto extends CoinObjectAmount implements ICoinHoldDto {
    @IsOptional()
    @IsString()
    public initiatorUid?: string;
}
