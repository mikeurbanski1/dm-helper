import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import 'react-tabs/style/react-tabs.css';
import './App.css';

import { useState } from 'react';

import { CharacterListTab } from './components/character/characterTab';
import { RollLogContext } from './components/contexts';
import { RollLogTab } from './components/dice/rollLog';
import { RollLogEntry } from './lib/models/rollLog';

const maxRollLogEntries = 10;

function App() {
    const [rollLog, setRollLog] = useState<RollLogEntry[]>([]);

    const logRollResult = (result: RollLogEntry) => {
        setRollLog((prev) => {
            const newLog = [...prev, result];
            if (newLog.length > maxRollLogEntries) {
                newLog.shift();
            }
            return newLog;
        });
    };

    return (
        <RollLogContext.Provider
            value={{
                addLogEntry: (entry: RollLogEntry) => {
                    logRollResult(entry);
                },
            }}
        >
            <Tabs>
                <TabList>
                    <Tab>Characters</Tab>
                    <Tab>Roll log</Tab>
                </TabList>

                <TabPanel forceRender>
                    <CharacterListTab />
                </TabPanel>
                <TabPanel>
                    <RollLogTab rollLogEntries={rollLog} />
                </TabPanel>
            </Tabs>
        </RollLogContext.Provider>
        // <div className="app-tabs-layout">
        //     <SquareTabs tabs={tabs} selectedIndex={selectedTab} onSelect={setSelectedTab} />
        //     <div className="tab-content">
        //         {selectedTab === 0 && <CharacterTab />}
        //         {selectedTab === 1 && (
        //             <div className="flex-column panel">
        //                 {characterIds.map((id) => (
        //                     <CharacterPanel key={id} deleteCharacter={() => deleteCharacter(id)} />
        //                 ))}
        //                 <button onClick={handleAddCharacter}>Add character</button>
        //             </div>
        //         )}
        //     </div>
        // </div>
    );
}

export default App;
