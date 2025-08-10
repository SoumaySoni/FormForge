import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, Typography, Container, Box } from '@mui/material';
import { Description, Add, Visibility, List, FlashOn, Security, Code } from '@mui/icons-material';
import { useState } from 'react';

const Index = () => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    const features = [
        {
            icon: Add,
            title: 'Dynamic Form Builder',
            description: 'Create forms with multiple field types and advanced configurations',
        },
        {
            icon: FlashOn,
            title: 'Real-time Preview',
            description: 'See how your forms look and behave for end users instantly',
        },
        {
            icon: Security,
            title: 'Advanced Validation',
            description: 'Built-in validation rules and custom validation support',
        },
        {
            icon: Code,
            title: 'Derived Fields',
            description: 'Create fields that compute values from other fields automatically',
        },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <Container maxWidth="lg" sx={{ py: 12 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Description sx={{ fontSize: 64, color: 'primary.main' }} />
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '3rem', md: '4rem' } }}
                            >
                                FormForge
                            </Typography>
                        </Box>
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}>
                            Build beautiful, dynamic forms with advanced validation, derived fields, and real-time preview.
                            No coding required - just drag, drop, and configure.
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                size="large"
                                variant="contained"
                                component={Link}
                                to="/create"
                                startIcon={<Add />}
                                sx={{ minWidth: 200 }}
                            >
                                Create New Form
                            </Button>
                            <Button
                                size="large"
                                variant="outlined"
                                component={Link}
                                to="/myforms"
                                startIcon={<List />}
                                sx={{ minWidth: 200 }}
                            >
                                View My Forms
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Powerful Form Building
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Everything you need to create professional forms
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                        gap: 3,
                    }}
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: 4 } }}>
                                <CardHeader
                                    avatar={
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: 'primary.light',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 0,
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 24, color: 'primary.contrastText' }} />
                                        </Box>
                                    }
                                    title={
                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                                            {feature.title}
                                        </Typography>
                                    }
                                />
                                <CardContent sx={{ pt: 0 }}>
                                    <Typography color="text.secondary">{feature.description}</Typography>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>
            </Container>

            {/* Quick Actions */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 3,
                    }}
                >
                    <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: 3 } }}>
                        <CardHeader
                            title={
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}
                                >
                                    <Add color="primary" />
                                    Create Form
                                </Typography>
                            }
                            subheader={
                                <Typography color="text.secondary">
                                    Start building a new form with our intuitive drag-and-drop interface
                                </Typography>
                            }
                        />
                        <CardContent>
                            <Button
                                variant="outlined"
                                fullWidth
                                component={Link}
                                to="/create"
                                style={{
                                    backgroundColor: hoveredButton === 'create' ? '#3b82f6' : 'transparent',
                                    color: hoveredButton === 'create' ? 'white' : '#3b82f6',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={() => setHoveredButton('create')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                Get Started
                            </Button>
                        </CardContent>
                    </Card>

                    <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: 3 } }}>
                        <CardHeader
                            title={
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}
                                >
                                    <Visibility color="primary" />
                                    Preview
                                </Typography>
                            }
                            subheader={
                                <Typography color="text.secondary">Test your current form and see how it behaves for end users</Typography>
                            }
                        />
                        <CardContent>
                            <Button
                                variant="outlined"
                                fullWidth
                                component={Link}
                                to="/preview"
                                style={{
                                    backgroundColor: hoveredButton === 'preview' ? '#3b82f6' : 'transparent',
                                    color: hoveredButton === 'preview' ? 'white' : '#3b82f6',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={() => setHoveredButton('preview')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                Preview Form
                            </Button>
                        </CardContent>
                    </Card>

                    <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: 3 } }}>
                        <CardHeader
                            title={
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}
                                >
                                    <List color="primary" />
                                    My Forms
                                </Typography>
                            }
                            subheader={<Typography color="text.secondary">Access and manage all your previously created forms</Typography>}
                        />
                        <CardContent>
                            <Button
                                variant="outlined"
                                fullWidth
                                component={Link}
                                to="/myforms"
                                style={{
                                    backgroundColor: hoveredButton === 'myforms' ? '#3b82f6' : 'transparent',
                                    color: hoveredButton === 'myforms' ? 'white' : '#3b82f6',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={() => setHoveredButton('myforms')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                View Forms
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

export default Index;
