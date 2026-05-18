import { useState } from 'react';

import './App.css';

import { CharacterPanel } from './components/character/characterPanel';

function App() {
    const [numCharacters, setNumCharacters] = useState<number>(1);
    return (
        <div className="flex-column panel">
            {Array.from({ length: numCharacters }, (_, i) => (
                <CharacterPanel key={i} />
            ))}
            <button onClick={() => setNumCharacters((prev) => prev + 1)}>Add character</button>
        </div>
    );
}

export default App;
