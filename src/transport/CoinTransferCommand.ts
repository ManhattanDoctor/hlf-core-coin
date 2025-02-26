import { TransformUtil } from '@ts-core/common';
import { Matches, IsNumberString } from 'class-validator';
import { HlfTransportCommandAsync, IInitiatedDto, InitiatedDto } from '@hlf-core/common';
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

export interface ICoinTransferDto extends IInitiatedDto {
    to: string;
    from: string;
    amount: string;
    coinUid: string;
}

export class CoinTransferDto extends InitiatedDto implements ICoinTransferDto {
    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public to: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public from: string;

    @IsNumberString()
    public amount: string;

    @Matches(CoinUtil.UID_REG_EXP)
    public coinUid: string;
}
