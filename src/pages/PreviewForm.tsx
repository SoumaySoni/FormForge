import { Layout } from '../components/Layout';
import { FormPreview } from '../components/FormPreview/FormPreview';

export default function PreviewForm() {
    return (
        <Layout
            title="Form Preview"
            description="Experience your form as users would see it"
        >
            <FormPreview />
        </Layout>
    );
}