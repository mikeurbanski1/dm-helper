import { forwardRef, JSX, useImperativeHandle, useState } from 'react';

import {
    AdvantageState,
    AttackRollHandle,
    AttackRollResult,
    DamageRollHandle,
    DieType,
    RollResult,
} from '../../lib/models/dice';
import { roll } from '../../lib/utils/dice';

type DamageRollProps = {
    defaultNumDice?: number;
    defaultDieType?: DieType;
    defaultModifier?: number;
    deleteDamageEffect: () => void;
    reportDamageRollResult: (result?: RollResult) => void;
    // handleRoll: () => RollResult;
};
export const DiceRoll = forwardRef<DamageRollHandle, DamageRollProps>((props, ref) => {
    const { defaultNumDice, defaultDieType, defaultModifier, deleteDamageEffect, reportDamageRollResult } = props;
    const [label, setLabel] = useState('');
    const [numDice, setNumDice] = useState<number>(defaultNumDice ?? 1);
    const [dieType, setDieType] = useState<DieType>(defaultDieType ?? DieType.D8);
    const [modifier, setModifier] = useState<number>(defaultModifier ?? 0);
    const [rollResult, setRollResult] = useState<RollResult | undefined>();

    // const updateRollModifier = (newModifier: number) => {
    //     setModifier(newModifier);
    //     if (rollResult) {
    //         const total = rollResult.raw.reduce((a, b) => a + b, 0) + newModifier;
    //         setRollResult({ ...rollResult, total });
    //     }
    // };

    const roll = () => {
        const results = Array.from({ length: numDice }, () => Math.floor(Math.random() * dieType) + 1);
        const total = results.reduce((a, b) => a + b, 0) + modifier;
        console.log(`Rolling ${numDice}d${dieType} + ${modifier} - total: ${total} (raw: ${results.join(', ')})`);
        const result: RollResult = {
            total,
            modifier,
            raw: results,
        };
        setRollResult(result);
        return result;
    };

    const handleDamageRollClick = () => {
        const result = roll();
        reportDamageRollResult(result);
    };

    const clearRoll = () => {
        setRollResult(undefined);
    };

    const handleClearRollClick = () => {
        clearRoll();
        reportDamageRollResult(undefined);
    };

    useImperativeHandle(ref, () => ({
        roll,
        clearRoll,
    }));

    return (
        <div className="flex-row">
            <span className="delete-x" onClick={deleteDamageEffect}>
                X
            </span>
            <input
                type="text"
                placeholder="Effect label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="text-input damage-roll-label"
            />
            <input
                className="number-spinner"
                type="number"
                placeholder="Number of dice"
                value={numDice}
                min={1}
                onChange={(e) => setNumDice(Number(e.target.value))}
            />
            <select
                className="dice-selector"
                value={dieType}
                onChange={(e) => setDieType(Number(e.target.value) as DieType)}
            >
                {Object.values(DieType)
                    .filter((value) => typeof value === 'number')
                    .map((value) => (
                        <option key={value} value={value}>
                            D{value}
                        </option>
                    ))}
            </select>
            +
            <input
                className="number-spinner"
                type="number"
                value={modifier}
                onChange={(e) => setModifier(Number(e.target.value))}
            />
            <button onClick={handleDamageRollClick}>Roll</button>
            {rollResult !== undefined && (
                <span className="delete-x" onClick={handleClearRollClick}>
                    X
                </span>
            )}
            {rollResult !== undefined && (
                <span className="roll-result">
                    Result: ({rollResult.raw.join(' + ')}) + {rollResult.modifier} = {rollResult.total}
                </span>
            )}
        </div>
    );
});

type AttackRollProps = {
    defaultModifier?: number;
    defaultAdvantageState?: AdvantageState;
    reportAttackRoll: (isRolled: boolean) => void;
    // handleRoll: () => RollResult;
};
export const AttackRoll = forwardRef<AttackRollHandle, AttackRollProps>(
    ({ defaultModifier, defaultAdvantageState, reportAttackRoll }: AttackRollProps, ref) => {
        const [modifier, setModifier] = useState<number>(defaultModifier ?? 0);
        const [advantageState, setAdvantageState] = useState<AdvantageState>(
            defaultAdvantageState ?? AdvantageState.Normal
        );
        const [rollResult, setRollResult] = useState<AttackRollResult | undefined>();

        // const updateAttackRollModifier = (newModifier: number) => {
        //     setModifier(newModifier);
        //     if (rollResult) {
        //         const total = rollResult.raw[rollResult.selectedRollIndex] + newModifier;
        //         setRollResult({ ...rollResult, total });
        //     }
        // };

        const _roll = () => {
            const rolls = [roll(DieType.D20)];

            if (advantageState !== AdvantageState.Normal) {
                rolls.push(roll(DieType.D20));
            }

            console.log(
                `Rolling attack: D20 + ${modifier} with ${AdvantageState[advantageState]} - raw result: ${rolls.join(', ')}`
            );

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
            const result: AttackRollResult = {
                total,
                modifier,
                raw: rolls,
                isCriticalHit,
                isCriticalMiss,
                selectedRollIndex,
            };
            setRollResult(result);
            return result;
        };

        const handleAttackRollClick = () => {
            const result = _roll();
            reportAttackRoll(true);
        };

        const clearRoll = () => {
            setRollResult(undefined);
        };

        const handleClearRollClick = () => {
            clearRoll();
            reportAttackRoll(false);
        };

        useImperativeHandle(ref, () => ({
            roll: _roll,
            clearRoll: () => setRollResult(undefined),
        }));

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
                    onChange={(e) => setModifier(Number(e.target.value))}
                />
                <select value={advantageState} onChange={(e) => setAdvantageState(Number(e.target.value))}>
                    <option value={AdvantageState.Normal}>No Adv</option>
                    <option value={AdvantageState.Advantage}>Adv</option>
                    <option value={AdvantageState.Disadvantage}>Dis</option>
                </select>
                <button onClick={handleAttackRollClick}>Roll attack</button>
                {rollResult !== undefined && (
                    <span className="delete-x" onClick={handleClearRollClick}>
                        X
                    </span>
                )}
                {rollResult !== undefined && (
                    <span className="roll-result">
                        Result: ({rollResultRawElements}){!rollResult.isCriticalMiss ? ` + ${rollResult.modifier}` : ''}{' '}
                        = {rollResult.total}
                    </span>
                )}
            </div>
        );
    }
);
