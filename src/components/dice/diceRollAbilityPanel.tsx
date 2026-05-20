import { useRef, useState } from 'react';

import { AttackRollHandle, DamageRollHandle, RollResult } from '../../lib/models/dice';
import { AttackRoll, DiceRoll } from './diceRoll';

type DiceRollAbilityPanelProps = {};
export function DiceRollAbilityPanel() {
    const [abilityName, setAbilityName] = useState('');
    const [isAttackRoll, setIsAttackRoll] = useState(true);
    const [nextDamageEffectId, setNextDamageEffectId] = useState(1);
    const [damageEffectIds, setDamageEffectIds] = useState<number[]>([0]);
    const [damageEffectResults, setDamageEffectResults] = useState<Record<number, RollResult>>({});
    const [totalDamage, setTotalDamage] = useState<number | null>(null);
    const [hasRolledAttack, setHasRolledAttack] = useState(false);

    const attackRollRef = useRef<AttackRollHandle>(null);
    const damageRollRefs = useRef(new Map<number, DamageRollHandle>());

    const rollAllDamage = () => {
        let total = 0;
        const newResults: Record<number, RollResult> = {};
        damageRollRefs.current.forEach((ref, key) => {
            if (ref) {
                const result = ref.roll();
                console.log(`Damage roll ${key} result:`, result);
                total += result.total;
                newResults[key] = result;
            }
        });
        setDamageEffectResults(newResults);
        setTotalDamage(total);
    };

    const rollAttackAndDamage = () => {
        if (attackRollRef.current) {
            const result = attackRollRef.current.roll();
            console.log('Attack roll result:', result);
            setHasRolledAttack(true);
        }
        rollAllDamage();
    };

    const deleteDamageEffect = (id: number) => {
        console.log(`Deleting damage effect with id: ${id}`);
        setDamageEffectIds((prev) => prev.filter((effectId) => effectId !== id));
        const newDamageEffectResults = { ...damageEffectResults };
        delete newDamageEffectResults[id];
        setDamageEffectResults(newDamageEffectResults);
        setTotalDamage(Object.values(newDamageEffectResults).reduce((sum, r) => sum + r.total, 0));
        damageRollRefs.current.delete(id);
    };

    const reportDamageRollResult = (id: number, result?: RollResult) => {
        console.log(`Received damage roll result from child ${id}:`, result);
        const newResults = { ...damageEffectResults };
        if (result) {
            newResults[id] = result;
        } else {
            delete newResults[id];
        }
        console.log(`New results: ${JSON.stringify(newResults)}`);
        if (Object.keys(newResults).length === 0) {
            setTotalDamage(null);
        } else {
            setTotalDamage(Object.values(newResults).reduce((sum, r) => sum + r.total, 0));
        }
        setDamageEffectResults(newResults);
    };

    const clearAllDamageRollResults = () => {
        setDamageEffectResults({});
        setTotalDamage(null);
        damageRollRefs.current.forEach((ref, key) => {
            if (ref) {
                ref.clearRoll();
            }
        });
    };

    const handleAttackRollResult = (isRolled: boolean) => {
        setHasRolledAttack(isRolled);
    };

    const clearAllRollResults = () => {
        setHasRolledAttack(false);
        clearAllDamageRollResults();
        if (attackRollRef.current) {
            attackRollRef.current.clearRoll();
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
                    className="text-input"
                />
                <label>
                    <input type="checkbox" checked={isAttackRoll} onChange={(e) => setIsAttackRoll(e.target.checked)} />
                    Attack roll?
                </label>
                {isAttackRoll && <button onClick={rollAttackAndDamage}>Roll attack + damage</button>}
                {isAttackRoll && (hasRolledAttack || Object.keys(damageEffectResults).length > 0) && (
                    <span className="delete-x" onClick={clearAllRollResults}>
                        X
                    </span>
                )}
            </div>
            {isAttackRoll && <AttackRoll reportAttackRoll={handleAttackRollResult} ref={attackRollRef} />}
            <div className="flex-row">
                Damage: <button onClick={rollAllDamage}>Roll all damage</button>
                {totalDamage !== null && <span>Total damage: {totalDamage}</span>}
                {totalDamage !== null && (
                    <span className="delete-x" onClick={clearAllDamageRollResults}>
                        X
                    </span>
                )}
            </div>
            {damageEffectIds.map((id) => (
                <DiceRoll
                    key={id}
                    ref={(ref) => {
                        damageRollRefs.current.set(id, ref!);
                    }}
                    deleteDamageEffect={() => deleteDamageEffect(id)}
                    reportDamageRollResult={(result) => reportDamageRollResult(id, result)}
                />
            ))}
            <button
                onClick={() => {
                    setDamageEffectIds((prev) => [...prev, nextDamageEffectId]);
                    setNextDamageEffectId((prev) => prev + 1);
                }}
            >
                Add effect
            </button>
        </div>
    );
}
