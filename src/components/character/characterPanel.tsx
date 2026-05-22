import { useState } from 'react';

import { DiceRollAbilityPanel } from '../dice/diceRollAbilityPanel';

type CharacterPanelProps = {
    deleteCharacter: () => void;
};
export function CharacterPanel({ deleteCharacter }: CharacterPanelProps) {
    const [characterName, setCharacterName] = useState('');
    const [nextAbilityId, setNextAbilityId] = useState(1);
    const [abilityIds, setAbilityIds] = useState<number[]>([0]);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleAddAbility = () => {
        setAbilityIds((prev) => [...prev, nextAbilityId]);
        setNextAbilityId((prev) => prev + 1);
    };

    const deleteAbility = (id: number) => {
        console.log(`Deleting ability with id: ${id}`);
        setAbilityIds((prev) => prev.filter((abilityId) => abilityId !== id));
    };

    return (
        <div className="flex-column panel">
            <div className="flex-row">
                <span className="delete-x" onClick={deleteCharacter}>
                    X
                </span>
                <input
                    type="text"
                    placeholder="Character name"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="text-input"
                />
                <button onClick={() => setIsExpanded((prev) => !prev)}>{isExpanded ? 'Collapse' : 'Expand'}</button>
            </div>
            <div className="flex-column" style={{ display: isExpanded ? 'flex' : 'none' }}>
                {abilityIds.map((id) => (
                    <DiceRollAbilityPanel key={id} deleteAbility={() => deleteAbility(id)} />
                ))}

                <button onClick={handleAddAbility}>Add dice roll ability</button>
            </div>
        </div>
    );
}
