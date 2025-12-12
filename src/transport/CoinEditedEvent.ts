import { TransformUtil } from "@ts-core/common";
import { CoinEvent, ICoinEventDto } from "./CoinEvent";
import { CoinObjectAmount } from "../CoinAmount";
import { CoinObjectAmountDto, ICoinObjectAmountDto } from "./ICoinAmountDto";

export interface ICoinEditedEventDto extends ICoinEventDto, ICoinObjectAmountDto { }

export class CoinEditedEvent extends CoinEvent<ICoinEditedEventDto> {
    constructor(name: string, data: ICoinEditedEventDto) {
        super(name, TransformUtil.toClass(CoinEditedEventDto, data));
    }
}

export class CoinEditedEventDto extends CoinObjectAmountDto implements ICoinEditedEventDto { }
