import { IsString, IsNumberString } from 'class-validator';

export interface ICoinAmount {
    value: string;
    coinUid: string;
}

export class CoinAmount implements ICoinAmount {
    @IsNumberString()
    value: string;

    @IsString()
    coinUid: string;
}
