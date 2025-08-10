import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { FieldEditor } from './FieldEditor';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
    Button
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { reorderFields } from '../../store/slice/formBuilderSlice'; 
import { useState } from 'react';

export function FieldsList() {
    const dispatch = useAppDispatch();
    const { currentForm } = useAppSelector(state => state.formBuilder);
    const navigate = useNavigate();
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    const handlePreviewClick = () => {
        navigate('/preview'); 
    };

    // Handle drag end event
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const newOrder = Array.from(currentForm.fields);
        const [removed] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, removed);

        dispatch(reorderFields(newOrder));
    };

    // Optionally handle multi-select for reorder enabling (you can customize logic)
    const toggleSelectField = (fieldId: string) => {
        setSelectedFields(prev => {
            if (prev.includes(fieldId)) return prev.filter(id => id !== fieldId);
            return [...prev, fieldId];
        });
    };

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
                sx={{ borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                action={
                    <Button variant="contained" size="medium" onClick={handlePreviewClick}>
                        Preview
                    </Button>
                }
            />
            <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="fields-list">
                        {(provided) => (
                            <Box
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {currentForm.fields.map((field, index) => (
                                    <Draggable key={field.id} draggableId={field.id} index={index}>
                                        {(provided, snapshot) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                mb={2}
                                                sx={{
                                                    border: snapshot.isDragging ? '2px solid #1976d2' : 'none',
                                                    borderRadius: 1,
                                                    backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'transparent',
                                                    cursor: 'move'
                                                }}
                                                onClick={() => toggleSelectField(field.id)}
                                            >
                                                <FieldEditor field={field} index={index} />
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardContent>
        </Card>
    );
}
