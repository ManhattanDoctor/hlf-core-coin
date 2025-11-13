import { IsString, IsNumberString } from 'class-validator';

export interface ICoinAmount {
    value: string;
    coinUid: string;
}

export class CoinAmount implements ICoinAmount {
    @IsNumberString()
    public value: string;

    @IsString()
    public coinUid: string;
}
