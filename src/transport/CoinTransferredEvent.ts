import { TransportEvent } from '@ts-core/common';
import { Event } from './Event';
import { ICoinEventDto } from './CoinEvent';
import { ICoinObjectAmount } from '../CoinAmount';

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
export interface ICoinTransferEventDto extends ICoinEventDto, ICoinObjectAmount {
    to: string;
}