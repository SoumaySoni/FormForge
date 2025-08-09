import { useState } from 'react';
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    Switch,
    IconButton,
    FormControlLabel
} from '@mui/material';
import {
    ChevronDown,
    ChevronUp,
    Trash2,
    Settings
} from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { updateField, removeField } from '../../store/slice/formBuilderSlice';
import type { FormField } from '../../types/form';
import { ValidationRulesEditor } from './ValidationRulesEditor';
import { OptionsEditor } from './OptionsEditor';
import { DerivedFieldEditor } from './DerivedFieldEditor';

interface FieldEditorProps {
    field: FormField;
    index: number;
}

export function FieldEditor({ field }: FieldEditorProps) {
    const dispatch = useAppDispatch();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFieldUpdate = (updates: Partial<FormField>) => {
        dispatch(updateField({ ...field, ...updates }));
    };

    const handleRemoveField = () => {
        dispatch(removeField(field.id));
    };

    const fieldTypeColors: Record<string, string> = {
        text: '#1976d2',
        number: '#2e7d32',
        textarea: '#6a1b9a',
        select: '#ef6c00',
        radio: '#d81b60',
        checkbox: '#3949ab',
        date: '#c62828',
    };

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardHeader
                title={
                    <Grid container alignItems="center" spacing={1}>
                        <Grid >
                            <Chip
                                label={field.type}
                                sx={{
                                    backgroundColor: fieldTypeColors[field.type],
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Grid>
                        <Grid >
                            <Typography variant="subtitle1">{field.label}</Typography>
                        </Grid>
                        {field.required && (
                            <Grid>
                                <Chip label="Required" color="error" size="small" />
                            </Grid>
                        )}
                        {field.isDerived && (
                            <Grid>
                                <Chip label="Derived" variant="outlined" size="small" />
                            </Grid>
                        )}
                    </Grid>
                }
                action={
                    <>
                        <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
                            <Settings size={18} />
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </IconButton>
                        <IconButton size="small" color="error" onClick={handleRemoveField}>
                            <Trash2 size={18} />
                        </IconButton>
                    </>
                }
            />

            {isExpanded && (
                <CardContent>
                    {/* Basic Settings */}
                    <Grid container spacing={2}>
                        <Grid>
                            <TextField
                                fullWidth
                                label="Label"
                                value={field.label}
                                onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                            />
                        </Grid>

                        <Grid >
                            <TextField
                                fullWidth
                                label="Placeholder"
                                value={field.placeholder || ''}
                                onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                            />
                        </Grid>
                    </Grid>

                    {/* Default Value */}
                    <Grid mt={2} mb={2}>
                        {field.type === 'textarea' ? (
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Default Value"
                                value={field.defaultValue as string || ''}
                                onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
                            />
                        ) : (
                                <TextField
                                    fullWidth
                                    type={
                                        field.type === 'number' ? 'number' :
                                            field.type === 'date' ? 'date' :
                                                'text'
                                    }
                                    label="Default Value"
                                    value={field.defaultValue as string || ''}
                                    onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
                                    InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                                    {...(field.type === 'date' && {
                                        onKeyDown: (e) => e.preventDefault()  // disable typing only for date
                                    })}
                                />
                        )}
                    </Grid>

                    {/* Required Toggle */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={field.required}
                                onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                            />
                        }
                        label="Required field"
                        sx={{ mt: 2 }}
                    />

                    {/* Derived Toggle */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={field.isDerived || false}
                                onChange={(e) => handleFieldUpdate({ isDerived: e.target.checked })}
                            />
                        }
                        label="Derived field"
                        sx={{ mt: 2 }}
                    />

                    {/* Options Editor */}
                    {['select', 'radio', 'checkbox'].includes(field.type) && (
                        <OptionsEditor
                            options={field.options || []}
                            onChange={(options) => handleFieldUpdate({ options })}
                        />
                    )}

                    {/* Derived Field Config */}
                    {field.isDerived && (
                        <DerivedFieldEditor
                            field={field}
                            onChange={(derivedConfig) => handleFieldUpdate({ derivedConfig })}
                        />
                    )}

                    {/* Validation Rules */}
                    <ValidationRulesEditor
                        rules={field.validationRules}
                        fieldType={field.type}
                        onChange={(validationRules) => handleFieldUpdate({ validationRules })}
                    />
                </CardContent>
            )}
        </Card>
    );
}
