import { useState } from 'react';

import './App.css';

import { CharacterPanel } from './components/character/characterPanel';

function App() {
    const [nextCharacterId, setNextCharacterId] = useState<number>(1);
    const [characterIds, setCharacterIds] = useState<number[]>([0]);

    const handleAddCharacter = () => {
        setCharacterIds((prev) => [...prev, nextCharacterId]);
        setNextCharacterId((prev) => prev + 1);
    };

    const deleteCharacter = (id: number) => {
        console.log(`Deleting character with id: ${id}`);
        setCharacterIds((prev) => prev.filter((characterId) => characterId !== id));
    };

    return (
        <div className="flex-column panel">
            {characterIds.map((id) => (
                <CharacterPanel key={id} deleteCharacter={() => deleteCharacter(id)} />
            ))}
            <button onClick={handleAddCharacter}>Add character</button>
        </div>
    );
}

export default App;
