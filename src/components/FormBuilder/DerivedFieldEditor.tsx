import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Box
} from "@mui/material";
import { X } from "lucide-react";
import type { FormField } from "../../types/form";
import { useAppSelector } from "../../store/hooks";

interface DerivedFieldEditorProps {
    field: FormField;
    onChange: (config: FormField["derivedConfig"]) => void;
}

export function DerivedFieldEditor({ field, onChange }: DerivedFieldEditorProps) {
    const { currentForm } = useAppSelector((state) => state.formBuilder);
    const [selectedParents, setSelectedParents] = useState<string[]>(
        field.derivedConfig?.parentFields || []
    );
    const [formula, setFormula] = useState(field.derivedConfig?.formula || "");

    const availableParentFields = currentForm.fields.filter(
        (f:FormField) => f.id !== field.id && !f.isDerived
    );

    useEffect(() => {
        const newConfig = { parentFields: selectedParents, formula };
        if (
            JSON.stringify(field.derivedConfig) !== JSON.stringify(newConfig)
        ) {
            onChange(newConfig);
        }
    }, [selectedParents, formula, onChange, field.derivedConfig]);

    useEffect(() => {
        setSelectedParents(field.derivedConfig?.parentFields || []);
        setFormula(field.derivedConfig?.formula || "");
    }, [field.derivedConfig]);

    const handleAddParentField = (fieldId: string) => {
        if (!selectedParents.includes(fieldId)) {
            setSelectedParents([...selectedParents, fieldId]);
        }
    };

    const handleRemoveParentField = (fieldId: string) => {
        setSelectedParents(selectedParents.filter((id) => id !== fieldId));
    };

    const getFieldLabel = (fieldId: string) => {
        const f = currentForm.fields.find((f) => f.id === fieldId);
        return f?.label || "Unknown Field";
    };

    const formulaExamples = [
        "SUM(field1, field2) - Calculate sum of numeric fields",
        'CONCAT(field1, " ", field2) - Combine text fields',
        "AGE(dateOfBirth) - Calculate age from date of birth",
        'IF(field1 > 100, "High", "Low") - Conditional logic'
    ];

    return (
        <Card variant="outlined">
            <CardHeader
                title={<Typography variant="subtitle2">Derived Field Configuration</Typography>}
            />
            <CardContent>
                {/* Parent Fields */}
                <Typography variant="caption" display="block">
                    Parent Fields
                </Typography>
                <Box mt={1} mb={2}>
                    {selectedParents.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                            {selectedParents.map((fieldId) => (
                                <Chip
                                    key={fieldId}
                                    label={getFieldLabel(fieldId)}
                                    onDelete={() => handleRemoveParentField(fieldId)}
                                    deleteIcon={<X size={14} />}
                                    size="small"
                                    color="secondary"
                                />
                            ))}
                        </Box>
                    )}

                    <FormControl fullWidth size="small">
                        <InputLabel>Select parent field to add</InputLabel>
                        <Select
                            value=""
                            onChange={(e) => handleAddParentField(e.target.value)}
                            label="Select parent field to add"
                        >
                            {availableParentFields
                                .filter((f) => !selectedParents.includes(f.id))
                                .map((parentField) => (
                                    <MenuItem key={parentField.id} value={parentField.id}>
                                        <Chip label={parentField.type} size="small" sx={{ mr: 1 }} />
                                        {parentField.label}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Formula */}
                <Typography variant="caption" display="block">
                    Formula
                </Typography>
                <TextField
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder='Enter formula (e.g., SUM(field1, field2) or AGE(dateField))'
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    margin="normal"
                />

                {/* Formula Examples */}
                <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                    Formula Examples:
                </Typography>
                {formulaExamples.map((example, index) => (
                    <Typography key={index} variant="caption" color="textSecondary" display="block">
                        • {example}
                    </Typography>
                ))}

                {/* Empty state */}
                {selectedParents.length === 0 && (
                    <Box
                        mt={2}
                        p={1}
                        border="1px dashed"
                        borderColor="grey.400"
                        borderRadius={1}
                        textAlign="center"
                    >
                        <Typography variant="caption" color="textSecondary">
                            Select at least one parent field to create a derived field
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
