import { CoinEditedEvent, ICoinEditedEventDto } from './CoinEditedEvent';
import { Event } from './Event';

export class CoinBurnedEvent extends CoinEditedEvent {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.COIN_BURNED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: ICoinEditedEventDto) {
        super(CoinBurnedEvent.NAME, data);
    }
}




