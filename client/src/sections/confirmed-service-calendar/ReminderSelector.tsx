import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

interface ReminderSelectorProps {
    reminders: Record<string, boolean>;
    onChange: (updated: Record<string, boolean>) => void;
}

export function ReminderSelector({ reminders, onChange }: ReminderSelectorProps) {
    const handleCheckboxChange = (label: string) => {
        const updated = { ...reminders, [label]: !reminders[label] };
        onChange(updated);
    };

    return (
        <FormGroup row>
            {Object.entries(reminders).map(([label, checked]) => (
                <FormControlLabel
                    key={label}
                    control={<Checkbox checked={checked} onChange={() => handleCheckboxChange(label)} />}
                    label={label}
                />
            ))}
        </FormGroup>
    );
}
