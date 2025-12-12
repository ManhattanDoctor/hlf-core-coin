import { getUid, UID } from '@ts-core/common';
import { CoinAccount } from './CoinAccount';
import * as _ from 'lodash';

export class CoinAccountUtil {

    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = '→coin~account';

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

    public static createUid(coin: UID, owner?: UID): string {
        let item = `${CoinAccountUtil.PREFIX}:${getUid(coin)}`;
        return !_.isNil(owner) ? `${item}~${getUid(owner)}` : item;
    }

    public static decomposeUid(coin: UID): ICoinAccountUidDecomposition {
        let array = getUid(coin).split(':');
        if (array.length < 2) {
            return null;
        }
        let coinUid = array[1];
        let index = coinUid.indexOf('~');
        return index === -1 ? { coinUid } : { coinUid: coinUid.substring(0, index), owner: coinUid.substring(index + 1) };
    }
}

export interface ICoinAccountUidDecomposition {
    coinUid: string;
    owner?: string;
}
