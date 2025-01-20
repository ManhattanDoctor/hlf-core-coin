import { Event } from './Event';
import { CoinEditedEvent, ICoinEditedEventDto } from './CoinEditedEvent';

export class CoinUnholdedEvent extends CoinEditedEvent {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.COIN_UNHOLDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: ICoinEditedEventDto) {
        super(CoinUnholdedEvent.NAME, data);
    }
}