import { HTMLInputTypeAttribute, useEffect, useState } from 'react';
import { TextField, InputAdornment, IconButton, ThemeProvider } from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material/';
import theme from '@/styles/materialTheme';
import styles from '@/styles/components/textFieldComponent.module.css';

interface TextFieldComponentProps extends Partial<HTMLInputElement> {
  label: string;
  errorText: string;
  type: HTMLInputTypeAttribute | 'textbox' | 'modalDescription';
  onChange: (newValue: string) => void;
  isValid?: boolean;
}

export default function TextFieldComponent({
  label,
  errorText,
  onChange,
  id,
  type,
  required,
  placeholder,
  isValid = true,
  ...htmlInputElementProps
}: TextFieldComponentProps) {
  const maxLength = 300;
  const [inputValue, setInputValue] = useState(htmlInputElementProps.value ?? '');
  const [isInputValid, setInputValid] = useState(isValid);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setInputValid(isValid);
  }, [isValid]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    if (newValue.length > maxLength) {
      newValue = newValue.substring(0, maxLength);
    }

    setInputValue(newValue);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validators: Record<string, () => boolean> = {
      textbox: () => newValue.length <= 300,
      modalDescription: () => newValue.length <= 300,
      email: () => emailRegex.test(newValue),
      password: () => newValue.length > 0
    };

    if (required && newValue.trim() === '') {
      setInputValid(false);
    } else {
      setInputValid(validators[type]?.() ?? true);
    }

    onChange(newValue);
  };

  const inputProps =
    type !== 'password'
      ? {}
      : {
          type: showPassword ? 'text' : 'password',
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(event) => event.preventDefault()}
              >
                {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
              </IconButton>
            </InputAdornment>
          )
        };

  return (
    <ThemeProvider theme={theme}>
      <div id={id} className={styles.container}>
        <label className={styles.componentLabel}>{label}</label>
        <TextField
          id={`outlined-${type}-input`}
          label={placeholder}
          autoFocus
          value={inputValue || null}
          onChange={handleChange}
          className={styles.textFieldComponent}
          color="secondary"
          variant="outlined"
          fullWidth
          InputProps={inputProps}
          rows={7}
          multiline={type === 'textbox' || type === 'modalDescription'}
          error={!isInputValid}
          helperText={!isInputValid ? errorText : ''}
        />
      </div>
    </ThemeProvider>
  );
}
