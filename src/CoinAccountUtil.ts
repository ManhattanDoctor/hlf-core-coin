import { getUid, UID } from '@ts-core/common';
import { StateKey } from '@hlf-core/common';
import { CoinAccount } from './CoinAccount';
import * as _ from 'lodash';

export class CoinAccountUtil {

    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = '→coin~account';
    public static KEY = new StateKey(CoinAccountUtil.PREFIX);

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static create(coin: UID, owner: UID): CoinAccount {
        let item = CoinAccount.create();
        item.uid = CoinAccountUtil.createUid(coin, owner);
        item.ownerUid = getUid(owner);
        return item;
    }

    public static createUid(coin: UID, owner: UID): string {
        return CoinAccountUtil.KEY.key(coin, owner);
    }

    public static createPrefix(coin?: UID): string {
        return !_.isNil(coin) ? CoinAccountUtil.KEY.prefix(coin) : CoinAccountUtil.KEY.prefix();
    }

    public static decomposeUid(coin: UID): ICoinAccountUidDecomposition {
        let items = CoinAccountUtil.KEY.decompose(coin);
        if (_.isEmpty(items)) {
            return null;
        }
        let [coinUid, owner] = items;
        return { coinUid, owner: !_.isEmpty(owner) ? owner : undefined };
    }
}

export interface ICoinAccountUidDecomposition {
    coinUid: string;
    owner?: string;
}
