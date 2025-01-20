import { TransportEvent } from '@ts-core/common';
import { Event } from './Event';
import { ICoinEventDto } from './CoinEvent';

export class CoinTransferredEvent extends TransportEvent<ICoinTransferEventDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.COIN_TRANSFERRED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: ICoinTransferEventDto) {
        super(CoinTransferredEvent.NAME, data);
    }
}
export interface ICoinTransferEventDto extends ICoinEventDto {
    to: string;
    from: string;
    amount: string;
}