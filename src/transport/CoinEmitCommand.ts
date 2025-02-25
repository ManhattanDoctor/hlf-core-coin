import { TransformUtil } from '@ts-core/common';
import { Matches, IsString, IsNumberString, IsOptional } from 'class-validator';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';

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

export interface ICoinEmitDto {
    amount: string;
    coinUid: string;
    objectUid: string;
    transactionHash?: string;
}

export class CoinEmitDto {
    @IsNumberString()
    public amount: string;

    @Matches(CoinUtil.UID_REG_EXP)
    public coinUid: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public objectUid: string;

    @IsString()
    @IsOptional()
    public transactionHash?: string;
}