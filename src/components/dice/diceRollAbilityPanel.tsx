import { useRef, useState } from 'react';

import { AttackRollHandle, DamageRollHandle } from '../../lib/models/dice';
import { AttackRoll, DiceRoll } from './diceRoll';

type DiceRollAbilityPanelProps = {};
export function DiceRollAbilityPanel() {
    const [abilityName, setAbilityName] = useState('');
    const [isAttackRoll, setIsAttackRoll] = useState(true);
    const [numDamageEffects, setNumDamageEffects] = useState(1);

    const attackRollRef = useRef<AttackRollHandle>(null);
    const damageRollRefs = useRef(new Map<number, DamageRollHandle>());

    const rollAllDamage = () => {
        damageRollRefs.current.forEach((ref, key) => {
            const result = ref.roll();
            console.log(`Damage roll ${key} result:`, result);
        });
    };

    const rollAttackAndDamage = () => {
        if (attackRollRef.current) {
            const result = attackRollRef.current.roll();
            console.log('Attack roll result:', result);
        }
        rollAllDamage();
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
            </div>
            {isAttackRoll && <AttackRoll ref={attackRollRef} />}
            <div className="flex-row">
                Damage: <button onClick={rollAllDamage}>Roll all damage</button>
            </div>
            {Array.from({ length: numDamageEffects }, (_, i) => (
                <DiceRoll
                    key={i}
                    ref={(ref) => {
                        damageRollRefs.current.set(i, ref!);
                    }}
                />
            ))}
            <button onClick={() => setNumDamageEffects((prev) => prev + 1)}>Add effect</button>
        </div>
    );
}
