import { IsString, IsOptional } from 'class-validator';
import { IInitiatedDto } from "@hlf-core/common";
import { CoinAmount, CoinObjectAmount, ICoinAmount, ICoinObjectAmount } from "../CoinAmount";

export interface ICoinAmountDto extends ICoinAmount, IInitiatedDto { }

export interface ICoinObjectAmountDto extends ICoinObjectAmount, IInitiatedDto { }

export class CoinAmountDto extends CoinAmount implements ICoinAmountDto {
    @IsOptional()
    @IsString()
    public initiatorUid?: string;
}

export class CoinObjectAmountDto extends CoinObjectAmount implements ICoinObjectAmountDto {
    @IsOptional()
    @IsString()
    public initiatorUid?: string;
}

