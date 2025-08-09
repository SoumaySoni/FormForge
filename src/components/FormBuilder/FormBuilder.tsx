import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, TextField, Box, Typography } from '@mui/material';
import { Save, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setFormName, saveForm, clearCurrentForm } from '../../store/slice/formBuilderSlice';
import { FieldTypeSelector } from './FieldTypeSelector';
import { FieldsList } from './FieldsList';
import { SaveFormDialog } from './SaveFormDialog';

export function FormBuilder() {
    const dispatch = useAppDispatch();
    const { currentForm } = useAppSelector(state => state.formBuilder);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleSaveForm = () => {
        if (!currentForm.name.trim()) {
            setShowSaveDialog(true);
            return;
        }

        if (currentForm.fields.length === 0) {
            enqueueSnackbar("Please add at least one field to your form", { variant: 'error' });
            return;
        }

        dispatch(saveForm());
        enqueueSnackbar(`"${currentForm.name}" has been saved to your forms.`, { variant: 'success' });

        // Reset form after saving
        dispatch(clearCurrentForm());
    };


    const handleClearForm = () => {
        dispatch(clearCurrentForm());
        enqueueSnackbar("Started with a new blank form", { variant: 'info' });
    };

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
            {/* Form Builder Panel */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Form Settings */}
                <Card>
                    <CardHeader>
                        <Typography variant="h6" component="h2">
                            Form Settings
                        </Typography>
                    </CardHeader>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Form Name"
                            placeholder="Enter form name..."
                            value={currentForm.name}
                            onChange={(e) => dispatch(setFormName(e.target.value))}
                            fullWidth
                            variant="outlined"
                        />

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                onClick={handleSaveForm}
                                variant="contained"
                                startIcon={<Save />}
                                disabled={currentForm.fields.length === 0}
                            >
                                Save Form
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleClearForm}
                                startIcon={<Delete />}
                            >
                                Clear All
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Fields List */}
                <FieldsList />
            </Box>

            {/* Field Type Selector */}
            <Box>
                <FieldTypeSelector />
            </Box>

            {/* Save Dialog */}
            <SaveFormDialog
                open={showSaveDialog}
                onOpenChange={setShowSaveDialog}
                onSave={() => {
                    dispatch(saveForm());
                    dispatch(clearCurrentForm()); // clear after save
                    setShowSaveDialog(false);
                    enqueueSnackbar(`"${currentForm.name}" has been saved to your forms.`, { variant: 'success' });
                }}

            />
        </Box>
    );
}