import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Description, Visibility, List, Add } from '@mui/icons-material';

interface LayoutProps {
    children: ReactNode;
    title: ReactNode;
    description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
    const location = useLocation();

    const navItems = [
        { path: '/create', label: 'Create Form', icon: Add },
        { path: '/preview', label: 'Preview', icon: Visibility },
        { path: '/myforms', label: 'My Forms', icon: List },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Description sx={{ fontSize: 32, color: 'primary.main' }} />
                            <Typography variant="h4" component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                FormForge
                            </Typography>
                        </Link>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Button
                                    key={item.path}
                                    variant={isActive ? "contained" : "text"}
                                    size="small"
                                    component={Link}
                                    to={item.path}
                                    startIcon={<Icon />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {title}
                        {description && (
                            <Typography variant="h6" color="text.secondary">
                                {description}
                            </Typography>
                        )}
                    </Typography>
                </Box>
                {children}
            </Container>
        </Box>
    );
}