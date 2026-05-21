import {
    AdvantageState,
    AttackRollDebugOpts,
    AttackRollResult,
    CriticalHitOption,
    DiceRollDebugOpts,
    DieType,
} from '../models/dice';

export function roll(dieType: DieType): number;
export function roll(range: [number, number]): number;
export function roll(dieTypeOrRange: DieType | [number, number]): number;
export function roll(dieTypeOrRange: DieType | [number, number]): number {
    if (Array.isArray(dieTypeOrRange)) {
        const [min, max] = dieTypeOrRange;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        return Math.floor(Math.random() * dieTypeOrRange) + 1;
    }
}

export const damageRoll = (
    numDice: number,
    dieType: DieType,
    modifier: number,
    criticalHitOption?: CriticalHitOption,
    debug?: DiceRollDebugOpts
) => {
    const { resultRangeOverride, rollResultOverride, modifierOverride } = debug || {};
    const results: number[] = [];

    if (rollResultOverride && rollResultOverride.length > 0) {
        results.push(...rollResultOverride);
    } else {
        if (criticalHitOption === CriticalHitOption.RollDoubleDice) {
            numDice *= 2;
        }
        for (let i = 0; i < numDice; i++) {
            const res = roll(resultRangeOverride ?? dieType);
            results.push(res);
            if (criticalHitOption === CriticalHitOption.DoubleRollResult) {
                results.push(res);
            }
        }
    }

    const modToUse = modifierOverride ?? modifier;
    const total = results.reduce((a, b) => a + b, 0) + modToUse;
    console.log(`Rolling damage: ${numDice}d${dieType} + ${modToUse} - total: ${total} (raw: ${results.join(', ')})`);
    return {
        total,
        modifier: modToUse,
        raw: results,
    };
};

export const attackRoll = (modifier: number, advantageState: AdvantageState, debug?: AttackRollDebugOpts) => {
    const { resultRangeOverride, rollResultOverride, modifierOverride, advantageOverride } = debug || {};

    const rolls: number[] = [];

    const advToUse = advantageOverride ?? advantageState;
    const modToUse = modifierOverride ?? modifier;

    if (rollResultOverride && rollResultOverride.length > 0) {
        rolls.push(...rollResultOverride);
    } else {
        rolls.push(roll(resultRangeOverride ?? DieType.D20));
        if (advToUse !== AdvantageState.Normal) {
            rolls.push(roll(resultRangeOverride ?? DieType.D20));
        }
    }

    console.log(`Rolling attack: D20 + ${modToUse} with ${AdvantageState[advToUse]} - raw result: ${rolls.join(', ')}`);

    const bestRoll = Math.max(...rolls);
    const worstRoll = Math.min(...rolls);
    const rollToUse =
        advToUse === AdvantageState.Advantage
            ? bestRoll
            : advToUse === AdvantageState.Disadvantage
              ? worstRoll
              : bestRoll;
    const isCriticalHit = rollToUse === 20;
    const isCriticalMiss = rollToUse === 1;
    const total = rollToUse + (isCriticalMiss ? 0 : modToUse);
    const selectedRollIndex = rolls.indexOf(rollToUse);
    const result: AttackRollResult = {
        total,
        modifier: modToUse,
        raw: rolls,
        isCriticalHit,
        isCriticalMiss,
        selectedRollIndex,
    };
    return result;
};
