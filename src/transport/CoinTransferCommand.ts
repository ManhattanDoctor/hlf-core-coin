import { TransformUtil } from '@ts-core/common';
import { Matches, IsOptional, IsString } from 'class-validator';
import { HlfTransportCommandAsync, IInitiatedDto } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';
import { CoinObjectAmount, ICoinObjectAmount } from '../CoinAmount';

export class CoinTransferCommand extends HlfTransportCommandAsync<ICoinTransferDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_TRANSFER;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinTransferDto) {
        super(CoinTransferCommand.NAME, TransformUtil.toClass(CoinTransferDto, request));
    }
}

export interface ICoinTransferDto extends ICoinObjectAmount, IInitiatedDto {
    to: string;
}

export class CoinTransferDto extends CoinObjectAmount implements ICoinTransferDto {
    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public to: string;

    @IsOptional()
    @IsString()
    public initiatorUid?: string;
}
