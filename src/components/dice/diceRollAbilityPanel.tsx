import { useState } from 'react';

import { DieType, type RollResult } from '../../lib/models/dice';
import { AttackRoll } from './diceRoll';

type DiceRollAbilityPanelProps = {};
export function DiceRollAbilityPanel() {
    const [abilityName, setAbilityName] = useState('');
    const [isAttackRoll, setIsAttackRoll] = useState(true);

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

    const updateDamageRollModifier = (newModifier: number) => {
        setModifier(newModifier);
        if (rollResult) {
            const total = rollResult.raw.reduce((a, b) => a + b, 0) + newModifier;
            setRollResult({ ...rollResult, total });
        }
    };

    return (
        <div className="flex-column panel">
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
            </div>
            {isAttackRoll && <AttackRoll />}
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
                    onChange={(e) => updateDamageRollModifier(Number(e.target.value))}
                />
                <button onClick={handleDamageRoll}>Roll damage</button>
                {rollResult !== null && (
                    <span className="roll-result">
                        Result: ({rollResult.raw.join(' + ')}) + {modifier} = {rollResult.total}
                    </span>
                )}
            </div>
            {isAttackRoll && (
                <button
                    onClick={() => {
                        handleDamageRoll();
                    }}
                >
                    Roll attack + damage
                </button>
            )}
        </div>
    );
}
