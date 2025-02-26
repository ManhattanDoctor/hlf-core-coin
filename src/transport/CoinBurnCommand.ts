import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinEmitDto, ICoinEmitDto } from './CoinEmitCommand';

export class CoinBurnCommand extends HlfTransportCommandAsync<ICoinBurnDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = CommandName.COIN_BURN;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinEmitDto) {
        super(CoinBurnCommand.NAME, TransformUtil.toClass(CoinBurnDto, request));
    }
}

export interface ICoinBurnDto extends ICoinEmitDto { }

export class CoinBurnDto extends CoinEmitDto { }