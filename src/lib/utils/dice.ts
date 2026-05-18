import { DieType } from '../models/dice';

export const roll = (dieType: DieType) => {
    return Math.floor(Math.random() * dieType) + 1;
};
