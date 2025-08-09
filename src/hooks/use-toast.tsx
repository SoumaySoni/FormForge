// toast.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert";

type ToastProps = {
    title?: string;
    description?: string;
    severity?: AlertColor; // "success" | "info" | "warning" | "error"
    duration?: number; // ms
};

type ToastContextType = {
    toast: (props: ToastProps) => void;
    dismiss: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [toastData, setToastData] = useState<ToastProps>({
        title: "",
        description: "",
        severity: "info",
        duration: 3000,
    });

    const toast = useCallback((props: ToastProps) => {
        setToastData({
            severity: props.severity || "info",
            title: props.title || "",
            description: props.description || "",
            duration: props.duration || 3000,
        });
        setOpen(true);
    }, []);

    const dismiss = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}

            <Snackbar
                open={open}
                autoHideDuration={toastData.duration}
                onClose={dismiss}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={dismiss}
                    severity={toastData.severity}
                    sx={{ width: "100%" }}
                >
                    {toastData.title && <strong>{toastData.title}</strong>}
                    {toastData.description && (
                        <div style={{ marginTop: 4 }}>{toastData.description}</div>
                    )}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

// Hook for components
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
