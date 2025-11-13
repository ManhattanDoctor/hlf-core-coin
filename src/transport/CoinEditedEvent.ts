import { TransformUtil } from "@ts-core/common";
import { Matches, IsNumberString } from 'class-validator';
import { CoinEvent, ICoinEventDto } from "./CoinEvent";
import { CoinUtil } from "../CoinUtil";

export interface ICoinEditedEventDto extends ICoinEventDto {
    amount: string;
    objectUid: string;
}

export class CoinEditedEvent extends CoinEvent<ICoinEditedEventDto> {
    constructor(name: string, data: ICoinEditedEventDto) {
        super(name, TransformUtil.toClass(CoinEditedEventDto, data));
    }
}

export class CoinEditedEventDto implements ICoinEditedEventDto {
    @IsNumberString()
    public amount: string;

    @Matches(CoinUtil.UID_REG_EXP)
    public coinUid: string;

    @Matches(CoinUtil.OBJECT_UID_REG_EXP)
    public objectUid: string;
}
