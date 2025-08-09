import { useAppSelector } from '../../store/hooks';
import { FieldEditor } from './FieldEditor';
import { AlertCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box
} from '@mui/material';

export function FieldsList() {
    const { currentForm } = useAppSelector(state => state.formBuilder);

    if (currentForm.fields.length === 0) {
        return (
            <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 1 }}>
                <CardContent sx={{ py: 6 }}>
                    <Box textAlign="center">
                        <AlertCircle size={48} style={{ color: '#9e9e9e', marginBottom: 16 }} />
                        <Typography variant="h6" gutterBottom>
                            No fields added yet
                        </Typography>
                        <Typography color="text.secondary">
                            Start building your form by adding fields from the panel on the right.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 1 }}>
            <CardHeader
                title={`Form Fields (${currentForm.fields.length})`}
                sx={{ borderBottom: '1px solid #e0e0e0' }}
            />
            <CardContent>
                {currentForm.fields.map((field, index) => (
                    <Box key={field.id} mb={2}>
                        <FieldEditor field={field} index={index} />
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}
