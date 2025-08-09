import { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { FormList } from '../components/FormList/FormList';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadSavedForms, deleteAllForms } from '../store/slice/formBuilderSlice';
import { Box, Button, Typography } from '@mui/material';

export default function MyForms() {
    const dispatch = useAppDispatch();
    const { savedForms } = useAppSelector((state) => state.formBuilder);

    useEffect(() => {
        dispatch(loadSavedForms());
    }, [dispatch]);

    const handleDeleteAll = () => {
        if (window.confirm("Are you sure you want to delete ALL saved forms?")) {
            dispatch(deleteAllForms());
        }
    };

    return (
        <Layout
            title={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">My Forms</Typography>
                    {savedForms.length > 0 && (
                        <Button variant="outlined" color="error" onClick={handleDeleteAll}>
                            Delete All
                        </Button>
                    )}
                </Box>
            }
            description="View and manage all your saved forms"
        >
            <FormList />
        </Layout>
    );
}
