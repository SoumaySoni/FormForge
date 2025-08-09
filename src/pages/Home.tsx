import { Box, Typography, Button, Paper, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "93vh",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                p: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    maxWidth: 600,
                    textAlign: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 4,
                }}
            >
                <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
                    Dynamic Form Builder
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: "#555" }}>
                    Welcome! 🎉 This project is a fully interactive form builder built with React, Redux Toolkit,
                    and Material-UI — allowing you to design, customize, and preview forms instantly.
                </Typography>

                <List sx={{ textAlign: "left", mt: 2 }}>
                    <ListItem>
                        <ListItemText primary="✨ Create your own form fields with various input types" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="✨ Preview them in real-time before saving" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="✨ Save & Persist your designs with Redux Persist for reload safety" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="✨ Add Validation & Derived Fields to make forms smarter" />
                    </ListItem>
                </List>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4, px: 4, py: 1.5, fontSize: "1.1rem", borderRadius: "8px" }}
                    onClick={() => navigate("/create")}
                >
                    🚀 Start Building
                </Button>
            </Paper>
        </Box>
    );
}
