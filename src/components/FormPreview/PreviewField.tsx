import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Checkbox,
    FormLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { FormField } from '../../types/form';

interface PreviewFieldProps {
    field: FormField;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

export function PreviewField({ field, value, onChange, error }: PreviewFieldProps) {
    const handleCheckboxChange = (option: string, checked: boolean) => {
        const currentValues = Array.isArray(value) ? value : [];
        if (checked) {
            onChange([...currentValues, option]);
        } else {
            onChange(currentValues.filter((v: string) => v !== option));
        }
    };

    const renderField = () => {
        const disabled = field.isDerived;

        switch (field.type) {
            case 'text':
            case 'number':
                return (
                    <TextField
                        type={field.type}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        disabled={disabled}
                        fullWidth
                        error={!!error}
                        helperText={error}
                    />
                );

            case 'textarea':
                return (
                    <TextField
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        disabled={disabled}
                        multiline
                        rows={4}
                        fullWidth
                        error={!!error}
                        helperText={error}
                    />
                );

            case 'select':
                return (
                    <FormControl fullWidth error={!!error}>
                        <Select
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            displayEmpty
                            disabled={disabled}
                        >
                            <MenuItem value="" disabled>
                                {field.placeholder || 'Select an option'}
                            </MenuItem>
                            {field.options?.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );

            case 'radio':
                return (
                    <FormControl component="fieldset" disabled={disabled} error={!!error}>
                        <FormLabel>{field.label}</FormLabel>
                        <RadioGroup
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                        >
                            {field.options?.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                );

            case 'checkbox':
                const checkedValues = Array.isArray(value) ? value : [];
                return (
                    <FormControl component="fieldset" disabled={disabled} error={!!error}>
                        <FormLabel>{field.label}</FormLabel>
                        {field.options?.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={checkedValues.includes(option)}
                                        onChange={(e) =>
                                            handleCheckboxChange(option, e.target.checked)
                                        }
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </FormControl>
                );

            case 'date':
                return (
                    <DatePicker
                        value={value ? new Date(value) : null}
                        onChange={(date) =>
                            onChange(date ? date.toISOString().split('T')[0] : '')
                        }
                        disabled={disabled}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!error,
                                helperText: error,
                                placeholder: field.placeholder || 'Pick a date',
                            },
                        }}
                    />
                );

            default:
                return <div>Unsupported field type: {field.type}</div>;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {field.type !== 'radio' && field.type !== 'checkbox' && (
                <FormLabel>
                    {field.label}
                    {field.required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
                    {field.isDerived && (
                        <span style={{ fontSize: '0.8em', color: '#888', marginLeft: 8 }}>
                            (Auto-calculated)
                        </span>
                    )}
                </FormLabel>
            )}
            {renderField()}
        </div>
    );
}
