import { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { FormBuilder } from '../components/FormBuilder/FormBuilder';
import { useAppDispatch } from '../store/hooks';
import { loadSavedForms } from '../store/slice/formBuilderSlice';

export default function CreateForm() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadSavedForms());
    }, [dispatch]);

    return (
        <Layout
            title="Create Form"
            description="Build your custom form by adding and configuring fields"
        >
            <FormBuilder />
        </Layout>
    );
}