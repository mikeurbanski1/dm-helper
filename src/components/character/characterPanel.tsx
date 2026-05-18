import { useState } from 'react';

import { DiceRollAbilityPanel } from '../dice/diceRollAbilityPanel';

export function CharacterPanel() {
    const [characterName, setCharacterName] = useState('');
    const [numAbilities, setNumAbilities] = useState<number>(1);

    const handleAddAbility = () => {
        setNumAbilities((prev) => prev + 1);
    };

    return (
        <div className="flex-column panel">
            <input
                type="text"
                placeholder="Character name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
            />
            {Array.from({ length: numAbilities }, (_, i) => (
                <DiceRollAbilityPanel key={i} />
            ))}
            <button onClick={handleAddAbility}>Add dice roll ability</button>
        </div>
    );
}
