import { TransformUtil } from '@ts-core/common';
import { Matches, IsNumberString } from 'class-validator';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';

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

export interface ICoinTransferDto {
    to: string;
    from: string;
    amount: string;
    coinUid: string;
}

class CoinTransferDto implements ICoinTransferDto {
    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    to: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    from: string;

    @IsNumberString()
    amount: string;

    @Matches(CoinUtil.UID_REG_EXP)
    coinUid: string;
}
