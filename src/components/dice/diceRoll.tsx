import { useState, type JSX } from 'react';

import { AdvantageState, DieType, type AttackRollResult } from '../../lib/models/dice';
import { roll } from '../../lib/utils/dice';

// type DiceRollProps = {
//     rollType: RollType;
//     defaultNumDice?: number;
//     defaultDieType?: DieType;
//     defaultModifier?: number;
//     defaultAdvantageState?: AdvantageState;
//     // handleRoll: () => RollResult;
// };
// export function DiceRoll({
//     rollType,
//     defaultNumDice,
//     defaultDieType,
//     defaultModifier,
//     defaultAdvantageState,
//     // handleRoll,
// }: DiceRollProps) {
//     const [numDice, setNumDice] = useState<number>(defaultNumDice ?? 1);
//     const [dieType, setDieType] = useState<DieType>(
//         defaultDieType ?? (rollType === RollType.Attack ? DieType.D20 : DieType.D8)
//     );
//     const [modifier, setModifier] = useState<number>(defaultModifier ?? 0);
//     const [advantageState, setAdvantageState] = useState<AdvantageState>(
//         defaultAdvantageState ?? AdvantageState.Normal
//     );
//     const [rollResult, setRollResult] = useState<RollResult | null>(null);

//     let updateRollModifier: (newModifier: number) => void;

//     const rollButtonText = rollType === RollType.Attack ? 'Roll attack' : 'Roll damage';

//     if (rollType === RollType.Attack) {
//         updateRollModifier = (newModifier: number) => {
//             setModifier(newModifier);
//             if (isAttackRollResult(rollResult)) {
//                 const total = rollResult.raw[rollResult.selectedRollIndex] + newModifier;
//                 setRollResult({ ...rollResult, total });
//             }
//         };
//     } else {
//         updateRollModifier = (newModifier: number) => {
//             setModifier(newModifier);
//             if (rollResult) {
//                 const total = rollResult.raw.reduce((a, b) => a + b, 0) + newModifier;
//                 setRollResult({ ...rollResult, total });
//             }
//         };
//     }

//     return (
//         <div className="flex-row">
//             <input
//                 className="number-spinner"
//                 type="number"
//                 placeholder="Attack roll modifier"
//                 value={modifier}
//                 onChange={(e) => updateRollModifier(Number(e.target.value))}
//             />
//             <button onClick={handleRoll}>{rollButtonText}</button>
//         </div>
//     );
// }

type AttackRollProps = {
    defaultModifier?: number;
    defaultAdvantageState?: AdvantageState;
    // handleRoll: () => RollResult;
};
export function AttackRoll({ defaultModifier, defaultAdvantageState }: AttackRollProps) {
    const [modifier, setModifier] = useState<number>(defaultModifier ?? 0);
    const [advantageState, setAdvantageState] = useState<AdvantageState>(
        defaultAdvantageState ?? AdvantageState.Normal
    );
    const [rollResult, setRollResult] = useState<AttackRollResult | null>(null);

    const updateAttackRollModifier = (newModifier: number) => {
        setModifier(newModifier);
        if (rollResult) {
            const total = rollResult.raw[rollResult.selectedRollIndex] + newModifier;
            setRollResult({ ...rollResult, total });
        }
    };

    const handleAttackRoll = () => {
        const rolls = [roll(DieType.D20)];

        if (advantageState !== AdvantageState.Normal) {
            rolls.push(roll(DieType.D20));
        }

        const bestRoll = Math.max(...rolls);
        const worstRoll = Math.min(...rolls);
        const rollToUse =
            advantageState === AdvantageState.Advantage
                ? bestRoll
                : advantageState === AdvantageState.Disadvantage
                  ? worstRoll
                  : bestRoll;
        const isCriticalHit = rollToUse === 20;
        const isCriticalMiss = rollToUse === 1;
        const total = rollToUse + (isCriticalMiss ? 0 : modifier);
        const selectedRollIndex = rolls.indexOf(rollToUse);
        setRollResult({ total, raw: rolls, isCriticalHit, isCriticalMiss, selectedRollIndex });
    };

    const rollResultRawElements = rollResult?.raw.reduce(
        (acc, roll, index) => {
            const isSelected = index === rollResult.selectedRollIndex;
            const isCriticalHit = roll === 20 && isSelected;
            const isCriticalMiss = roll === 1 && isSelected;
            let className = '';
            if (isSelected && rollResult.raw.length > 1) {
                className += 'selected-roll ';
            }
            if (isCriticalHit) {
                className += 'critical-hit ';
            } else if (isCriticalMiss) {
                className += 'critical-miss ';
            }
            acc.push(
                <span key={index} className={className.trim()}>
                    {roll}
                </span>
            );
            if (index < rollResult.raw.length - 1) {
                acc.push(' / ');
            }
            return acc;
        },
        [] as (JSX.Element | string)[]
    );

    return (
        <div className="flex-row">
            Attack: D20 +
            <input
                className="number-spinner"
                type="number"
                placeholder="Attack roll modifier"
                value={modifier}
                onChange={(e) => updateAttackRollModifier(Number(e.target.value))}
            />
            <select value={advantageState} onChange={(e) => setAdvantageState(Number(e.target.value))}>
                <option value={AdvantageState.Normal}>No Adv</option>
                <option value={AdvantageState.Advantage}>Adv</option>
                <option value={AdvantageState.Disadvantage}>Dis</option>
            </select>
            <button onClick={handleAttackRoll}>Roll attack</button>
            {rollResult !== null && (
                <span className="roll-result">
                    Result: ({rollResultRawElements}){!rollResult.isCriticalMiss ? ` + ${modifier}` : ''} ={' '}
                    {rollResult.total}
                </span>
            )}
        </div>
    );
}
