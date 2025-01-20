import { Event } from './Event';
import { CoinEditedEvent, ICoinEditedEventDto } from './CoinEditedEvent';

export class CoinEmittedEvent extends CoinEditedEvent {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.COIN_EMITTED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: ICoinEditedEventDto) {
        super(CoinEmittedEvent.NAME, data);
    }
}



