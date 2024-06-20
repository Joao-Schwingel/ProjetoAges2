import { Button, ThemeProvider } from '@mui/material';
import styles from '@/styles/components/button.module.css';
import theme from '@/styles/materialTheme';
import { useState } from 'react';

interface ButtonProps {
  type: 'primary' | 'secondary';
  onClick: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
  size: 3 | 2 | 1;
  icon?: React.ReactNode;
  id: string;
  disabled?: boolean;
}

export default function ButtonComponent({
  type,
  onClick,
  onMouseOver,
  onMouseLeave,
  children,
  size,
  icon,
  id
}: ButtonProps) {
  return (
    <ThemeProvider theme={theme}>
      <Button
        id={id}
        className={`
          ${styles['button-container']}
          ${icon ? styles['button-container-space'] : styles['button-container-center']}
          ${styles[`button-container-${type}`]}
          ${styles[`button-container-size-${size}`]}
        `}
        color="primary"
        variant="contained"
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        <div>
          {children}
          {icon ?? null}
        </div>
      </Button>
    </ThemeProvider>
  );
}
