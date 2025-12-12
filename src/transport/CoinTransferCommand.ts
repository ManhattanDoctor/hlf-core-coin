import { TransformUtil } from '@ts-core/common';
import { Matches } from 'class-validator';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';
import { CoinObjectAmountDto, ICoinObjectAmountDto } from './ICoinAmountDto';

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

export interface ICoinTransferDto extends ICoinObjectAmountDto {
    to: string;
}

export class CoinTransferDto extends CoinObjectAmountDto implements ICoinTransferDto {
    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public to: string;
}
