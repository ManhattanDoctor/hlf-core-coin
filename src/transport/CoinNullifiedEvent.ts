import { TransformUtil } from "@ts-core/common";
import { Matches } from 'class-validator';
import { CoinEvent, ICoinEventDto } from "./CoinEvent";
import { CoinUtil } from "../CoinUtil";
import { Event } from './Event';

export class CoinNullifiedEvent extends CoinEvent<ICoinNullifiedEventDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = Event.COIN_NULLIFIED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: ICoinNullifiedEventDto) {
        super(CoinNullifiedEvent.NAME, TransformUtil.toClass(CoinNullifiedEventDto, data));
    }
}
export interface ICoinNullifiedEventDto extends ICoinEventDto {
    objectUid: string;
}

export class CoinNullifiedEventDto implements ICoinNullifiedEventDto {
    @Matches(CoinUtil.UID_REG_EXP)
    public coinUid: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public objectUid: string;
}


