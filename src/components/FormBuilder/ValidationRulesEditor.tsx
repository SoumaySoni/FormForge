import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Divider,
    Box
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Plus, X } from 'lucide-react';
import type { ValidationRule, FieldType } from '../../types/form';

interface ValidationRulesEditorProps {
    rules: ValidationRule[];
    fieldType: FieldType;
    onChange: (rules: ValidationRule[]) => void;
}

const ruleTypes = [
    { value: 'notEmpty', label: 'Not Empty', description: 'Field cannot be empty' },
    { value: 'minLength', label: 'Minimum Length', description: 'Minimum number of characters' },
    { value: 'maxLength', label: 'Maximum Length', description: 'Maximum number of characters' },
    { value: 'email', label: 'Email Format', description: 'Must be a valid email address' },
    { value: 'password', label: 'Password', description: 'Minimum 8 characters with at least one number' },
];

export function ValidationRulesEditor({ rules, onChange }: ValidationRulesEditorProps) {
    const [newRuleType, setNewRuleType] = useState<string>('');
    const [newRuleValue, setNewRuleValue] = useState<string>('');
    const [newRuleMessage, setNewRuleMessage] = useState<string>('');

    const handleAddRule = () => {
        if (!newRuleType || !newRuleMessage) return;

        const newRule: ValidationRule = {
            type: newRuleType as ValidationRule['type'],
            message: newRuleMessage,
        };

        if (['minLength', 'maxLength'].includes(newRuleType) && newRuleValue) {
            newRule.value = parseInt(newRuleValue);
        }

        onChange([...rules, newRule]);
        setNewRuleType('');
        setNewRuleValue('');
        setNewRuleMessage('');
    };

    const handleRemoveRule = (index: number) => {
        const updatedRules = rules.filter((_, i) => i !== index);
        onChange(updatedRules);
    };

    const getDefaultMessage = (type: string, value?: string) => {
        switch (type) {
            case 'notEmpty':
                return 'This field is required';
            case 'minLength':
                return `Must be at least ${value || 'X'} characters long`;
            case 'maxLength':
                return `Must be no more than ${value || 'X'} characters long`;
            case 'email':
                return 'Please enter a valid email address';
            case 'password':
                return 'Password must be at least 8 characters long and contain at least one number';
            default:
                return '';
        }
    };

    const handleRuleTypeChange = (type: string) => {
        setNewRuleType(type);
        setNewRuleMessage(getDefaultMessage(type, newRuleValue));
    };

    const handleRuleValueChange = (value: string) => {
        setNewRuleValue(value);
        if (['minLength', 'maxLength'].includes(newRuleType)) {
            setNewRuleMessage(getDefaultMessage(newRuleType, value));
        }
    };

    return (
        <Card variant="outlined">
            <CardHeader
                title={
                    <Typography variant="subtitle2" fontWeight="bold">
                        Validation Rules
                    </Typography>
                }
            />
            <CardContent>
                {/* Existing Rules */}
                {rules.length > 0 && (
                    <Box mb={2}>
                        {rules.map((rule, index) => (
                            <Box
                                key={index}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={1}
                                border="1px solid #ddd"
                                borderRadius={1}
                                mb={1}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Chip
                                        label={ruleTypes.find(rt => rt.value === rule.type)?.label || rule.type}
                                        variant="outlined"
                                        size="small"
                                    />
                                    {rule.value && (
                                        <Typography variant="caption" color="text.secondary">
                                            ({rule.value})
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                        {rule.message}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveRule(index)}
                                    sx={{ color: 'error.main' }}
                                >
                                    <X size={14} />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Add New Rule */}
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid>
                        <FormControl size="small" sx={{ width: 300 }}>
                            <InputLabel>Rule Type</InputLabel>
                            <Select
                                value={newRuleType}
                                onChange={(e) => handleRuleTypeChange(e.target.value)}
                                label="Rule Type"
                            >
                                {ruleTypes.map((ruleType) => (
                                    <MenuItem key={ruleType.value} value={ruleType.value}>
                                        <Box>
                                            <Typography variant="body2">{ruleType.label}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {ruleType.description}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {['minLength', 'maxLength'].includes(newRuleType) && (
                        <Grid>
                            <TextField
                                label="Value"
                                type="number"
                                value={newRuleValue}
                                onChange={(e) => handleRuleValueChange(e.target.value)}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                    )}
                </Grid>

                {newRuleType && (
                    <Box mt={2}>
                        <TextField
                            label="Error Message"
                            value={newRuleMessage}
                            onChange={(e) => setNewRuleMessage(e.target.value)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                )}

                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    {newRuleType && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                setNewRuleType('');
                                setNewRuleValue('');
                                setNewRuleMessage('');
                            }}
                        >
                            Discard
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<Plus size={14} />}
                        onClick={handleAddRule}
                        disabled={!newRuleType || !newRuleMessage}
                    >
                        Add Rule
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
