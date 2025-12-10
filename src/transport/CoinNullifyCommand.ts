
import { TransformUtil } from '@ts-core/common';
import { Matches, IsString, IsOptional } from 'class-validator';
import { HlfTransportCommandAsync, InitiatedDto } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinUtil } from '../CoinUtil';

export class CoinNullifyCommand extends HlfTransportCommandAsync<ICoinNullifyDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_NULLIFY;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinNullifyDto) {
        super(CoinNullifyCommand.NAME, TransformUtil.toClass(CoinNullifyDto, request));
    }
}

export interface ICoinNullifyDto extends InitiatedDto {
    coinUid: string;
    objectUid: string;
    transactionHash?: string;
}

export class CoinNullifyDto extends InitiatedDto {
    @Matches(CoinUtil.UID_REG_EXP)
    public coinUid: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public objectUid: string;

    @IsOptional()
    @IsString()
    public transactionHash?: string;
}