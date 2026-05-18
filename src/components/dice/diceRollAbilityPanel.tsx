import { useState, type JSX } from 'react';

import { DieType } from '../../lib/models/dice';
import { roll } from '../../lib/utils/dice';

interface RollResult {
    total: number;
    raw: number[];
}
interface AttackRollResult extends RollResult {
    isCriticalHit: boolean;
    isCriticalMiss: boolean;
    total: number;
    selectedRollIndex: number;
    raw: number[];
}

type DiceRollAbilityPanelProps = {};
export function DiceRollAbilityPanel() {
    const [abilityName, setAbilityName] = useState('');
    const [isAttackRoll, setIsAttackRoll] = useState(true);
    const [hasAdvantage, setHasAdvantage] = useState(false);
    const [hasDisadvantage, setHasDisadvantage] = useState(false);
    const [attackRollModifier, setAttackRollModifier] = useState(0);
    const [attackRollResult, setAttackRollResult] = useState<AttackRollResult | null>(null);
    const [numDice, setNumDice] = useState(1);
    const [dieType, setDieType] = useState<DieType>(DieType.D8);
    const [modifier, setModifier] = useState(0);
    const [rollResult, setRollResult] = useState<RollResult | null>(null);

    const handleDamageRoll = () => {
        const results = Array.from({ length: numDice }, () => Math.floor(Math.random() * dieType) + 1);
        const result = results.reduce((a, b) => a + b, 0) + modifier;
        console.log(`Rolling ${numDice}d${dieType} + ${modifier} - total: ${result} (raw: ${results.join(', ')})`);
        setRollResult({ total: result, raw: results });
    };

    const handleAttackRoll = () => {
        const rolls = [roll(DieType.D20)];

        if (hasAdvantage !== hasDisadvantage) {
            rolls.push(roll(DieType.D20));
        }

        const bestRoll = Math.max(...rolls);
        const worstRoll = Math.min(...rolls);
        const rollToUse = hasAdvantage ? bestRoll : hasDisadvantage ? worstRoll : bestRoll;
        const isCriticalHit = rollToUse === 20;
        const isCriticalMiss = rollToUse === 1;
        const total = rollToUse + (isCriticalMiss ? 0 : attackRollModifier);
        const selectedRollIndex = rolls.indexOf(rollToUse);
        setAttackRollResult({ total, raw: rolls, isCriticalHit, isCriticalMiss, selectedRollIndex });
    };

    const attackRollRawElements = attackRollResult?.raw.reduce((acc, roll, index) => {
        const isSelected = index === attackRollResult.selectedRollIndex;
        const isCriticalHit = roll === 20 && isSelected;
        const isCriticalMiss = roll === 1 && isSelected;
        let className = '';
        if (isSelected && attackRollResult.raw.length > 1) {
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
        if (index < attackRollResult.raw.length - 1) {
            acc.push(' / ' as unknown as JSX.Element);
        }
        return acc;
    }, [] as JSX.Element[]);

    return (
        <div className="dice-roll-ability-panel">
            <div className="flex-row">
                <input
                    type="text"
                    placeholder="Ability name"
                    value={abilityName}
                    onChange={(e) => setAbilityName(e.target.value)}
                />
                <label>
                    <input type="checkbox" checked={isAttackRoll} onChange={(e) => setIsAttackRoll(e.target.checked)} />
                    Attack roll
                </label>
                {isAttackRoll && (
                    <label>
                        <input
                            type="checkbox"
                            checked={hasAdvantage}
                            onChange={(e) => setHasAdvantage(e.target.checked)}
                        />
                        Advantage
                    </label>
                )}
                {isAttackRoll && (
                    <label>
                        <input
                            type="checkbox"
                            checked={hasDisadvantage}
                            onChange={(e) => setHasDisadvantage(e.target.checked)}
                        />
                        Disadvantage
                    </label>
                )}
            </div>
            {isAttackRoll ? (
                <div className="flex-row">
                    Attack: D20 +{' '}
                    <input
                        className="number-spinner"
                        type="number"
                        placeholder="Attack roll modifier"
                        value={attackRollModifier}
                        onChange={(e) => setAttackRollModifier(Number(e.target.value))}
                    />
                    <button onClick={handleAttackRoll}>Roll attack</button>
                    {attackRollResult !== null && (
                        <span className="roll-result">
                            Result: ({attackRollRawElements})
                            {!attackRollResult.isCriticalMiss ? ` + ${attackRollModifier}` : ''} ={' '}
                            {attackRollResult.total}
                        </span>
                    )}
                </div>
            ) : null}
            <div className="flex-row">
                Effect:{' '}
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
                <button onClick={handleDamageRoll}>Roll damage</button>
                {rollResult !== null && (
                    <span className="roll-result">
                        Result: ({rollResult.raw.join(' + ')}) + {modifier} = {rollResult.total}
                    </span>
                )}
            </div>
            <button
                onClick={() => {
                    handleAttackRoll();
                    handleDamageRoll();
                }}
            >
                Roll attack + damage
            </button>
        </div>
    );
}
