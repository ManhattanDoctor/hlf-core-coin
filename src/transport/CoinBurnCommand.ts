import { TransformUtil } from '@ts-core/common';
import { HlfTransportCommandAsync } from '@hlf-core/common';
import { CommandName } from './Command';
import { CoinEmitDto, ICoinEmitDto } from './CoinEmitCommand';

export class CoinBurnCommand extends HlfTransportCommandAsync<ICoinEmitDto, void> {
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
        super(CoinBurnCommand.NAME, TransformUtil.toClass(CoinEmitDto, request));
    }
}