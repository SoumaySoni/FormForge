import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    IconButton,
    Divider,
    Box,
} from '@mui/material';
import { Plus, X, GripVertical } from 'lucide-react';

interface OptionsEditorProps {
    options: string[];
    onChange: (options: string[]) => void;
}

export function OptionsEditor({ options, onChange }: OptionsEditorProps) {
    const [newOption, setNewOption] = useState('');

    const handleAddOption = () => {
        if (newOption.trim()) {
            onChange([...options, newOption.trim()]);
            setNewOption('');
        }
    };

    const handleUpdateOption = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        onChange(updatedOptions);
    };

    const handleRemoveOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        onChange(updatedOptions);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newOption.trim()) {
            handleAddOption();
        }
    };

    return (
        <Card variant="outlined">
            <CardHeader
                title={<Typography variant="subtitle2">Options</Typography>}
                sx={{ pb: 1 }}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Existing Options */}
                {options.length > 0 && (
                    <Box display="flex" flexDirection="column" gap={1}>
                        {options.map((option, index) => (
                            <Box key={index} display="flex" alignItems="center" gap={1}>
                                <GripVertical size={16} style={{ color: '#9e9e9e', cursor: 'grab' }} />
                                <TextField
                                    value={option}
                                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    size="small"
                                    fullWidth
                                />
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveOption(index)}
                                >
                                    <X size={14} />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Add New Option */}
                <Divider />
                <Box display="flex" alignItems="center" gap={1}>
                    <Box width={16} /> {/* Spacer for alignment */}
                    <TextField
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add new option..."
                        size="small"
                        fullWidth
                    />
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={handleAddOption}
                        disabled={!newOption.trim()}
                    >
                        <Plus size={14} />
                    </IconButton>
                </Box>

                {options.length === 0 && (
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ py: 1 }}>
                        No options added yet. Add at least one option.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
