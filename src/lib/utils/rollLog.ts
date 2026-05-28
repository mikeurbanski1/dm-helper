import dayjs from 'dayjs';

import { RollLogDetail, RollLogEntry } from '../models/rollLog';

export const getRollLogEntry = (result: RollLogDetail, description: string): RollLogEntry => {
    return {
        timestamp: dayjs(),
        description,
        result,
    };
};
