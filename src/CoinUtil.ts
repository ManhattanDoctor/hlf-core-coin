import { getUid, MathUtil, MathUtilConfig, UID } from '@ts-core/common';
import * as _ from 'lodash';

export class CoinUtil {

    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = 'coin';
    public static COIN_ID_MIN = 1;
    public static COIN_ID_MAX = 64;

    public static COIN_ID_PATTERN = `[A-Za-z0-9.]{${CoinUtil.COIN_ID_MIN},${CoinUtil.COIN_ID_MAX}}`;
    public static DECIMALS_PATTERN = '[0-9]*';
    public static OWNER_UID_PATTERN = '[A-Za-z0-9_]*';
    public static OBJECT_UID_PATTERN = '[A-Za-z0-9_]*';

    public static UID_REG_EXP = new RegExp(`^${CoinUtil.PREFIX}_${CoinUtil.OWNER_UID_PATTERN}_${CoinUtil.DECIMALS_PATTERN}_${CoinUtil.COIN_ID_PATTERN}$`);
    public static COIN_ID_REG_EXP = new RegExp(`^${CoinUtil.COIN_ID_PATTERN}$`);
    public static OWNER_UID_REG_EXP = new RegExp(`^${CoinUtil.OWNER_UID_PATTERN}$`);
    public static OBJECT_UID_REG_EXP = new RegExp(`^${CoinUtil.OBJECT_UID_PATTERN}$`);
    public static DECIMALS_UID_REG_EXP = new RegExp(`^${CoinUtil.DECIMALS_PATTERN}$`);

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public static createUid(coinId: string, decimals: number, owner: UID): string {
        return `${CoinUtil.PREFIX}_${getUid(owner)}_${decimals}_${coinId}`;
    }

    public static isCoin(uid: UID): boolean {
        return CoinUtil.UID_REG_EXP.test(getUid(uid));
    }

    public static getCoinId<T = string>(coin: UID): T {
        let { coinId } = CoinUtil.decomposeUid(coin);
        return coinId as T;
    }

    public static getOwnerUid(coin: UID): string {
        let { ownerUid } = CoinUtil.decomposeUid(coin);
        return ownerUid;
    }

    public static getDecimals(coin: UID): number {
        let { decimals } = CoinUtil.decomposeUid(coin);
        return decimals;
    }

    public static decomposeUid(coin: UID): ICoinUidDecomposition {
        let uid = getUid(coin);
        let array = uid.split('_');
        let length = array.length;
        return {
            coinId: array[length - 1],
            decimals: parseInt(array[length - 2]),
            ownerUid: array.slice(1, length - 2).join('_')
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Transform Methods
    //
    // --------------------------------------------------------------------------

    public static toCent(amount: string, decimals: number): string {
        if (_.isNil(amount) || _.isNil(decimals)) {
            return null;
        }
        CoinUtil.config = { precision: 100, toExpPos: 100, toExpNeg: -100 };
        let constructor = MathUtil.create();
        let value = MathUtil.pow('10', decimals.toString());
        let item = new constructor(MathUtil.multiply(amount, value)).toDecimalPlaces(0).toString();
        CoinUtil.config = null;
        return item;
    }

    public static fromCent(amount: string, decimals: number): string {
        if (_.isNil(amount) || _.isNil(decimals)) {
            return null;
        }
        CoinUtil.config = { precision: 100, toExpPos: 100, toExpNeg: -100 };
        let value = MathUtil.pow('10', decimals.toString());
        let item = MathUtil.divide(amount, value);
        CoinUtil.config = null;
        return item;
    }

    public static toPercent(amount: string, total: string): number {
        return MathUtil.toNumber(MathUtil.multiply('100', MathUtil.divide(amount, total)));
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Static Methods
    //
    // --------------------------------------------------------------------------

    private static get config(): MathUtilConfig {
        return MathUtil.config;
    }

    private static set config(item: MathUtilConfig) {
        MathUtil.config = _.isNil(item) ? { toExpNeg: -100, toExpPos: 100, precision: 100 } : item;
    }
}

export interface ICoinUidDecomposition {
    coinId: string;
    decimals: number;
    ownerUid: string;
}
