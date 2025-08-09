import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { loadForm, deleteForm } from '../../store/slice/formBuilderSlice';
import type { FormSchema } from '../../types/form';
import { FileText, Eye, Calendar, Settings, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Typography,
    Chip,
    Button,
    Grid,
    Box,
    Stack,
} from '@mui/material';

export function FormList() {
    const dispatch = useAppDispatch();
    const { savedForms } = useAppSelector((state) => state.formBuilder);

    const handleLoadForm = (form: FormSchema) => {
        dispatch(loadForm(form.id));
    };

    const handleDeleteForm = (formId: string) => {
        if (window.confirm("Are you sure you want to delete this form?")) {
            dispatch(deleteForm(formId));
        }
    };

    if (savedForms.length === 0) {
        return (
            <Card variant="outlined" sx={{ boxShadow: 1 }}>
                <CardContent sx={{ py: 6, textAlign: 'center' }}>
                    <FileText size={48} style={{ color: 'gray', marginBottom: '1rem' }} />
                    <Typography variant="h6" gutterBottom>
                        No forms saved yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Create your first form to see it listed here.
                    </Typography>
                    <Button
                        variant="contained"
                        component={Link}
                        to="/create"
                        sx={{ mt: 2 }}
                    >
                        Create Your First Form
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Grid container spacing={4}>
            {savedForms.map((form) => (
                <Grid key={form.id}>
                    <Card variant="outlined" sx={{ transition: '0.3s', '&:hover': { boxShadow: 3 } }}>
                        <CardHeader
                            title={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <FileText size={20} color="black" />
                                    <Typography variant="h6">{form.name}</Typography>
                                </Stack>
                            }
                            action={
                                <Chip
                                    label={`${form.fields.length} fields`}
                                    variant="outlined"
                                    size="small"
                                />
                            }
                            sx={{ pb: 1 }}
                        />
                        <CardContent>
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <Calendar size={16} />
                                <Typography variant="body2" color="text.secondary">
                                    Created {format(new Date(form.createdAt), 'MMM d, yyyy')}
                                </Typography>
                            </Stack>

                            <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                                {Array.from(new Set(form.fields.map((f) => f.type))).map(
                                    (type) => (
                                        <Chip
                                            key={type}
                                            label={type}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )
                                )}
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="outlined"
                                size="small"
                                component={Link}
                                to="/preview"
                                onClick={() => handleLoadForm(form)}
                                startIcon={<Eye size={16} />}
                                fullWidth
                                sx={{
                                    color: 'green',
                                    borderColor: 'green',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 128, 0, 0.1)', // light green background on hover
                                        borderColor: 'green',
                                    },
                                }}
                            >
                                Preview
                            </Button>
                            <Button
                                variant="outlined" // gives it a border
                                size="small"
                                component={Link}
                                to="/create"
                                onClick={() => handleLoadForm(form)}
                                startIcon={<Settings size={16} />}
                                fullWidth
                                sx={{
                                    color: '#fbc02d', // yellow text
                                    borderColor: '#fbc02d', // yellow border
                                    '&:hover': {
                                        backgroundColor: 'rgba(251, 192, 45, 0.08)', // light yellow hover
                                        borderColor: '#fbc02d',
                                    },
                                }}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="outlined" size="small"
                                color="error"
                                onClick={() => handleDeleteForm(form.id)}
                                startIcon={<Trash2 size={16} />}
                                fullWidth
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
