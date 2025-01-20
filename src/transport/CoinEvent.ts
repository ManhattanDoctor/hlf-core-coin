import { TransportEvent } from '@ts-core/common';

export interface ICoinEventDto {
    coinUid: string;
}

export class CoinEvent<T extends ICoinEventDto = ICoinEventDto> extends TransportEvent<T> {
    constructor(name: string, data: T) {
        super(name, data);
    }
}
