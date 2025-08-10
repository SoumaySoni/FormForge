import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormBuilderState, FormField, FormSchema } from '../../types/form';
import { v4 as uuidv4 } from 'uuid';

const initialState: FormBuilderState = {
    currentForm: {
        name: '',
        fields: [],
    },
    savedForms: [],
    isLoading: false,
    errors: {},
};

const formBuilderSlice = createSlice({
    name: 'formBuilder',
    initialState,
    reducers: {
        setFormName: (state, action: PayloadAction<string>) => {
            state.currentForm.name = action.payload;
        },
        addField: (state, action: PayloadAction<Omit<FormField, 'id'>>) => {
            const newField: FormField = {
                ...action.payload,
                id: uuidv4(),
            };
            state.currentForm.fields.push(newField);
        },
        updateField: (state, action: PayloadAction<FormField>) => {
            const index = state.currentForm.fields.findIndex(field => field.id === action.payload.id);
            if (index !== -1) {
                state.currentForm.fields[index] = action.payload;
            }
        },
        removeField: (state, action: PayloadAction<string>) => {
            state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload);
        },
        // Updated reorderFields to accept the reordered fields array
        reorderFields: (state, action: PayloadAction<FormField[]>) => {
            state.currentForm.fields = action.payload;
        },
        saveForm: (state) => {
            if (state.currentForm.name && state.currentForm.fields.length > 0) {
                const newForm: FormSchema = {
                    id: uuidv4(),
                    name: state.currentForm.name,
                    fields: [...state.currentForm.fields],
                    createdAt: new Date().toISOString(),
                };
                state.savedForms.push(newForm);
                // Save to localStorage
                localStorage.setItem('formBuilder_savedForms', JSON.stringify(state.savedForms));
            }
        },
        loadSavedForms: (state) => {
            const saved = localStorage.getItem('formBuilder_savedForms');
            if (saved) {
                state.savedForms = JSON.parse(saved);
            }
        },
        deleteForm: (state, action: PayloadAction<string>) => {
            state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
            localStorage.setItem('formBuilder_savedForms', JSON.stringify(state.savedForms));
        },
        deleteAllForms: (state) => {
            state.savedForms = [];
            localStorage.setItem('formBuilder_savedForms', JSON.stringify(state.savedForms));
        },
        loadForm: (state, action: PayloadAction<string>) => {
            const form = state.savedForms.find(f => f.id === action.payload);
            if (form) {
                state.currentForm = {
                    name: form.name,
                    fields: [...form.fields],
                };
            }
        },
        clearCurrentForm: (state) => {
            state.currentForm = {
                name: '',
                fields: [],
            };
        },
        setError: (state, action: PayloadAction<{ field: string; message: string }>) => {
            state.errors[action.payload.field] = action.payload.message;
        },
        clearErrors: (state) => {
            state.errors = {};
        },
    },
});

export const {
    setFormName,
    addField,
    updateField,
    removeField,
    reorderFields,
    saveForm,
    loadSavedForms,
    deleteForm,
    deleteAllForms,
    loadForm,
    clearCurrentForm,
    setError,
    clearErrors,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
