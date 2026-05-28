import { createContext } from 'react';

import { RollLogEntry } from '../lib/models/rollLog';

export const RollLogContext = createContext<{
    addLogEntry: (entry: RollLogEntry) => void;
}>({
    addLogEntry: () => {},
});
