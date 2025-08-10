import { useState } from 'react';
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    Switch,
    IconButton,
    FormControlLabel,
    Snackbar,
    Alert
} from '@mui/material';
import {
    ChevronDown,
    ChevronUp,
    Trash2,
    Settings
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
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
    const [toastOpen, setToastOpen] = useState(false);

    const allFields = useAppSelector(state => state.formBuilder.currentForm.fields);
    const canToggleDerived = allFields.length >= 2;

    const handleFieldUpdate = (updates: Partial<FormField>) => {
        if (updates.isDerived && !canToggleDerived) {
            return;
        }
        dispatch(updateField({ ...field, ...updates }));
    };

    const handleRemoveField = () => {
        dispatch(removeField(field.id));
    };

    const handleToastClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') return;
        setToastOpen(false);
    };

    const handleDerivedClick = () => {
        if (!canToggleDerived) {
            setToastOpen(true);
        }
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
        <>
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader
                    title={
                        <Grid container alignItems="center" spacing={1}>
                            <Grid>
                                <Chip
                                    label={field.type}
                                    sx={{
                                        backgroundColor: fieldTypeColors[field.type],
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </Grid>
                            <Grid>
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

                            <Grid>
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
                                    value={(field.defaultValue as string) || ''}
                                    onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    type={
                                        field.type === 'number' ? 'number' :
                                            field.type === 'date' ? 'date' : 'text'
                                    }
                                    label="Default Value"
                                    value={(field.defaultValue as string) || ''}
                                    onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
                                    InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                                    {...(field.type === 'date' && {
                                        onKeyDown: (e) => e.preventDefault()  // disable typing only for date
                                    })}
                                />
                            )}
                        </Grid>

                        {/* Required Toggle */}
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.required}
                                        onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                                    />
                                }
                                label="Required field"
                            />

                            {/* Derived Toggle with click wrapper */}
                            <Box onClick={handleDerivedClick} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={field.isDerived || false}
                                            onChange={(e) => handleFieldUpdate({ isDerived: e.target.checked })}
                                            disabled={!canToggleDerived}
                                        />
                                    }
                                    label="Derived field"
                                />
                            </Box>
                        </Box>

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

            <Snackbar
                open={toastOpen}
                autoHideDuration={4000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleToastClose} severity="warning" sx={{ width: '100%' }}>
                    At least two fields are required to enable this option.
                </Alert>
            </Snackbar>
        </>
    );
}
