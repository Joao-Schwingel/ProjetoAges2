import React from 'react';
import Image from 'next/image';
import styles from '@/styles/components/loading.module.css';
import { CircularProgress, ThemeProvider } from '@mui/material';
import theme from '@/styles/materialTheme';

export default function Loading() {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingImageWrapper}>
          <Image src="/GloboAplausosLoginImage.svg" alt={'Logo GloboAplausos'} fill />
        </div>
        <CircularProgress color="primary" />
      </div>
    </ThemeProvider>
  );
}
