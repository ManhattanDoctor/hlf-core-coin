import { TransformUtil } from '@ts-core/common';
import { Matches, IsString, IsNumberString, IsOptional } from 'class-validator';
import { HlfTransportCommandAsync, InitiatedDto } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';
import { CoinObjectAmount, ICoinObjectAmount } from '../CoinAmount';

export class CoinEmitCommand extends HlfTransportCommandAsync<ICoinEmitDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_EMIT;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinEmitDto) {
        super(CoinEmitCommand.NAME, TransformUtil.toClass(CoinEmitDto, request));
    }
}

export interface ICoinEmitDto extends ICoinObjectAmount, InitiatedDto {
    transactionHash?: string;
}

export class CoinEmitDto extends CoinObjectAmount implements ICoinEmitDto {
    @IsOptional()
    @IsString()
    public initiatorUid?: string;

    @IsOptional()
    @IsString()
    public transactionHash?: string;
}