import { RollLogEntry } from '../../lib/models/rollLog';

interface RollLogTabProps {
    rollLogEntries: RollLogEntry[]; // Replace with your actual log entry type
}
export function RollLogTab({ rollLogEntries }: RollLogTabProps) {
    console.log(rollLogEntries);
    return (
        <div className="flex-column panel">
            <h2>Roll log</h2>
            <p>Roll log content goes here...</p>
            {rollLogEntries.map((entry, index) => (
                <div key={index}>
                    <strong>{entry.timestamp.format('HH:mm:ss')}</strong>: {entry.description} -{' '}
                    {JSON.stringify(entry.result)}
                </div>
            ))}
        </div>
    );
}
