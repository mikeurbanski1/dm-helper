import { Dayjs } from 'dayjs';

import { AttackRollResult, RollResult } from './dice';

export interface CombinedRollResult {
    attackRoll: AttackRollResult;
    damageRolls: RollResult[];
}

export type RollLogDetail = RollResult | RollResult[] | CombinedRollResult;

export interface RollLogEntry {
    timestamp: Dayjs;
    description: string;
    result: RollLogDetail;
}
