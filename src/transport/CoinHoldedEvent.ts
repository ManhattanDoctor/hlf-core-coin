import { Event } from './Event';
import { CoinEditedEvent, ICoinEditedEventDto } from './CoinEditedEvent';

export class CoinHoldedEvent extends CoinEditedEvent {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.COIN_HOLDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: ICoinEditedEventDto) {
        super(CoinHoldedEvent.NAME, data);
    }
}