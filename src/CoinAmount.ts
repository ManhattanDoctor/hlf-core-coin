import { IsString, IsNumberString, Matches } from 'class-validator';
import { CoinUtil } from './CoinUtil';

export interface ICoinAmount {
    value: string;
    coinUid: string;
}

export interface ICoinObjectAmount extends ICoinAmount {
    objectUid: string;
}

export class CoinAmount implements ICoinAmount {
    @IsNumberString()
    public value: string;

    @IsString()
    public coinUid: string;
}

export class CoinObjectAmount extends CoinAmount {
    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public objectUid: string;
}