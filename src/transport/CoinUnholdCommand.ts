import { TransformUtil } from '@ts-core/common';
import { CommandName } from './Command';
import { CoinHoldDto, ICoinHoldDto } from './CoinHoldCommand';
import { HlfTransportCommandAsync } from '@hlf-core/common';

export class CoinUnholdCommand extends HlfTransportCommandAsync<ICoinUnholdDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_UNHOLD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinHoldDto) {
        super(CoinUnholdCommand.NAME, TransformUtil.toClass(CoinUnholdDto, request));
    }
}

export interface ICoinUnholdDto extends ICoinHoldDto { }

export class CoinUnholdDto extends CoinHoldDto { }