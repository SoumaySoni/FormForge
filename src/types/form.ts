export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
    type: 'notEmpty' | 'minLength' | 'maxLength' | 'email' | 'password';
    value?: number | string;
    message: string;
}

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    defaultValue?: string | number | boolean | string[];
    validationRules: ValidationRule[];
    options?: string[]; // For select, radio, checkbox
    isDerived?: boolean;
    derivedConfig?: {
        parentFields: string[];
        formula: string;
    };
    placeholder?: string;
}

export interface FormSchema {
    id: string;
    name: string;
    fields: FormField[];
    createdAt: string;
}

export interface FormBuilderState {
    currentForm: {
        name: string;
        fields: FormField[];
    };
    savedForms: FormSchema[];
    isLoading: boolean;
    errors: Record<string, string>;
}

export interface FormSubmissionData {
    [fieldId: string]: string | number | boolean | string[];
}

export interface FormValidationError {
    fieldId: string;
    message: string;
}