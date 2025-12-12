import { TransformUtil } from '@ts-core/common';
import { IsString, IsOptional } from 'class-validator';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinObjectAmountDto, ICoinObjectAmountDto } from './ICoinAmountDto';

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

export interface ICoinEmitDto extends ICoinObjectAmountDto {
    transactionHash?: string;
}

export class CoinEmitDto extends CoinObjectAmountDto implements ICoinEmitDto {
    @IsOptional()
    @IsString()
    public transactionHash?: string;
}