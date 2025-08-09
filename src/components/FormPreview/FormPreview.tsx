import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    Box,
    Divider,
} from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import type { FormSubmissionData, FormValidationError } from '../../types/form';
import { PreviewField } from './PreviewField';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Link } from 'react-router-dom';

export function FormPreview() {
    const { currentForm } = useAppSelector((state) => state.formBuilder);
    const [formData, setFormData] = useState<FormSubmissionData>({});
    const [errors, setErrors] = useState<FormValidationError[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const initialData: FormSubmissionData = {};
        currentForm.fields.forEach((field) => {
            if (field.defaultValue !== undefined) {
                initialData[field.id] = field.defaultValue;
            }
        });
        setFormData(initialData);
        calculateDerivedFields(initialData);
    }, [currentForm.fields]);

    useEffect(() => {
        calculateDerivedFields(formData);
    }, [formData, currentForm.fields]);

    const calculateDerivedFields = (data: FormSubmissionData) => {
        const updatedData = { ...data };
        let hasChanges = false;
        currentForm.fields.forEach((field) => {
            if (field.isDerived && field.derivedConfig) {
                const { parentFields, formula } = field.derivedConfig;
                const newValue = evaluateFormula(formula, parentFields, data);
                if (updatedData[field.id] !== newValue) {
                    updatedData[field.id] = newValue;
                    hasChanges = true;
                }
            }
        });
        if (hasChanges) setFormData(updatedData);
    };

    const evaluateFormula = (
        formula: string,
        parentFields: string[],
        data: FormSubmissionData
    ): string => {
        try {
            let result = formula;
            parentFields.forEach((fieldId) => {
                const field = currentForm.fields.find((f) => f.id === fieldId);
                const value = data[fieldId] || '';
                const fieldPlaceholder =
                    field?.label.toLowerCase().replace(/\s+/g, '_') || fieldId;
                result = result.replace(
                    new RegExp(`\\b${fieldPlaceholder}\\b`, 'gi'),
                    String(value)
                );
            });

            if (result.startsWith('SUM(') && result.endsWith(')')) {
                const values = result
                    .slice(4, -1)
                    .split(',')
                    .map((v) => parseFloat(v.trim()) || 0);
                return String(values.reduce((sum, val) => sum + val, 0));
            }
            if (result.startsWith('CONCAT(') && result.endsWith(')')) {
                const values = result
                    .slice(7, -1)
                    .split(',')
                    .map((v) => v.trim().replace(/"/g, ''));
                return values.join('');
            }
            if (result.startsWith('AGE(') && result.endsWith(')')) {
                const dateStr = result.slice(4, -1).trim();
                const birthDate = new Date(dateStr);
                if (!isNaN(birthDate.getTime())) {
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    return String(age);
                }
            }
            return result;
        } catch {
            return '';
        }
    };

    const validateForm = (): FormValidationError[] => {
        const formErrors: FormValidationError[] = [];
        currentForm.fields.forEach((field) => {
            const value = formData[field.id];
            if (field.isDerived) return;
            if (field.required && (!value || value === '')) {
                formErrors.push({ fieldId: field.id, message: `${field.label} is required` });
                return;
            }
            field.validationRules.forEach((rule) => {
                const stringValue = String(value || '');
                switch (rule.type) {
                    case 'notEmpty':
                        if (!stringValue.trim()) {
                            formErrors.push({ fieldId: field.id, message: rule.message });
                        }
                        break;
                    case 'minLength':
                        if (typeof rule.value === 'number' && stringValue.length < rule.value) {
                            formErrors.push({ fieldId: field.id, message: rule.message });
                        }
                        break;
                    case 'maxLength':
                        if (typeof rule.value === 'number' && stringValue.length > rule.value) {
                            formErrors.push({ fieldId: field.id, message: rule.message });
                        }
                        break;
                    case 'email':
                        if (
                            stringValue &&
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)
                        ) {
                            formErrors.push({ fieldId: field.id, message: rule.message });
                        }
                        break;
                    case 'password':
                        if (stringValue && !/^(?=.*\d).{8,}$/.test(stringValue)) {
                            formErrors.push({ fieldId: field.id, message: rule.message });
                        }
                        break;
                }
            });
        });
        return formErrors;
    };

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
        setErrors((prev) => prev.filter((error) => error.fieldId !== fieldId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();
        setErrors(formErrors);
        if (formErrors.length === 0) {
            setIsSubmitted(true);
            toast({ title: 'Form submitted successfully!' });
        } else {
            toast({
                title: 'Form validation failed',
                description: `Please fix ${formErrors.length} error(s) and try again.`,
                severity: 'error',});
        }
    };

    if (currentForm.fields.length === 0) {
        return (
            <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <AlertCircle size={48} style={{ marginBottom: 16 }} />
                    <Typography variant="h6">No form to preview</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Create a form first to see the preview.
                    </Typography>
                    <Button variant="contained" component={Link} to="/create">
                        Create Form
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (isSubmitted) {
        return (
            <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <CheckCircle size={48} color="green" style={{ marginBottom: 16 }} />
                    <Typography variant="h6">Form Submitted Successfully!</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Your form data has been validated and processed.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => setIsSubmitted(false)}>
                            Submit Again
                        </Button>
                        <Button variant="outlined" component={Link} to="/create">
                            Edit Form
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Box maxWidth="md" mx="auto">
            <Card>
                <CardHeader
                    title={
                        <Box display="flex" alignItems="center" gap={1}>
                            <FileText size={24} />
                            <Typography variant="h5">
                                {currentForm.name || 'Form Preview'}
                            </Typography>
                        </Box>
                    }
                />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {currentForm.fields.map((field) => (
                            <PreviewField
                                key={field.id}
                                field={field}
                                value={formData[field.id]}
                                onChange={(value) => handleFieldChange(field.id, value)}
                                error={errors.find((err) => err.fieldId === field.id)?.message}
                            />
                        ))}
                        <Divider sx={{ my: 3 }} />
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="outlined" component={Link} to="/create">
                                Edit Form
                            </Button>
                            <Button variant="contained" type="submit">
                                Submit Form
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
