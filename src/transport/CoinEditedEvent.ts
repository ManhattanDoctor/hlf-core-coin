import { TransformUtil } from "@ts-core/common";
import { CoinEvent, ICoinEventDto } from "./CoinEvent";
import { CoinObjectAmount, ICoinObjectAmount } from "../CoinAmount";

export interface ICoinEditedEventDto extends ICoinEventDto, ICoinObjectAmount { }

export class CoinEditedEvent extends CoinEvent<ICoinEditedEventDto> {
    constructor(name: string, data: ICoinEditedEventDto) {
        super(name, TransformUtil.toClass(CoinEditedEventDto, data));
    }
}

export class CoinEditedEventDto extends CoinObjectAmount implements ICoinEditedEventDto { }
