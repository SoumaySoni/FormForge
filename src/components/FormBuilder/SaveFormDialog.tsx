import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Button,
    Box
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setFormName } from '../../store/slice/formBuilderSlice';

interface SaveFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
}

export function SaveFormDialog({ open, onOpenChange, onSave }: SaveFormDialogProps) {
    const dispatch = useAppDispatch();
    const { currentForm } = useAppSelector(state => state.formBuilder);
    const [localName, setLocalName] = useState(currentForm.name);

    useEffect(() => {
        setLocalName(currentForm.name);
    }, [currentForm.name, open]);

    const handleSave = () => {
        if (localName.trim()) {
            dispatch(setFormName(localName.trim()));
            onSave();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && localName.trim()) {
            handleSave();
        }
    };

    return (
        <Dialog open={open} onClose={() => onOpenChange(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Save Form</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Give your form a name to save it for later use.
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <TextField
                        id="form-name"
                        label="Form Name"
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter a name for your form..."
                        size="small"
                        fullWidth
                        autoFocus
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!localName.trim()}
                >
                    Save Form
                </Button>
            </DialogActions>
        </Dialog>
    );
}
