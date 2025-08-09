import { Card, CardContent, CardHeader, Typography, Button, Box } from '@mui/material';
import {
  TextFields,
  Numbers,
  Description,
  ArrowDropDown,
  RadioButtonChecked,
  CheckBox,
  CalendarToday
} from '@mui/icons-material';
import { useAppDispatch } from '../../store/hooks';
import { addField } from '../../store/slice/formBuilderSlice';
import type { FieldType } from '../../types/form';

const fieldTypes: { type: FieldType; label: string; icon: any; description: string }[] = [
  {
    type: 'text',
    label: 'Text',
    icon: TextFields,
    description: 'Single line text input'
  },
  {
    type: 'number',
    label: 'Number',
    icon: Numbers,
    description: 'Numeric input'
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: Description,
    description: 'Multi-line text input'
  },
  {
    type: 'select',
    label: 'Select',
    icon: ArrowDropDown,
    description: 'Dropdown selection'
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: RadioButtonChecked,
    description: 'Single choice from options'
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: CheckBox,
    description: 'Multiple selections'
  },
  {
    type: 'date',
    label: 'Date',
    icon: CalendarToday,
    description: 'Date picker'
  },
];

export function FieldTypeSelector() {
  const dispatch = useAppDispatch();

  const handleAddField = (type: FieldType) => {
    const baseField = {
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      validationRules: [],
      placeholder: type === 'textarea' ? 'Enter your text here...' : `Enter ${type}...`,
    };

    // Add options for select, radio, and checkbox
    if (['select', 'radio', 'checkbox'].includes(type)) {
      (baseField as any).options = ['Option 1', 'Option 2', 'Option 3'];
    }

    dispatch(addField(baseField));
  };

  return (
    <Card sx={{ position: 'sticky', top: 16 }}>
      <CardHeader>
        <Typography variant="h6" component="h2">
          Add Fields
        </Typography>
      </CardHeader>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {fieldTypes.map((fieldType) => {
          const Icon = fieldType.icon;
          return (
            <Button
              key={fieldType.type}
              variant="outlined"
              onClick={() => handleAddField(fieldType.type)}
              sx={{
                justifyContent: 'flex-start',
                p: 2,
                height: 'auto',
                textAlign: 'left',
                '&:hover': {
                  boxShadow: 2
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.light',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.25
                }}>
                  <Icon sx={{ fontSize: 16, color: 'primary.contrastText' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'none' }}>
                    {fieldType.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textTransform: 'none' }}>
                    {fieldType.description}
                  </Typography>
                </Box>
              </Box>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}