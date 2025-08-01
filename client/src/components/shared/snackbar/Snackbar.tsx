import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { Slide, Snackbar as SnackbarMaterial } from '@mui/material';
import { useSnackbar } from '../../../hooks/useSnackbar';


const defaultAlignment = {
  vertical: 'bottom',
  horizontal: 'center',
};

export const Snackbar = () => {
  const { alert, closeAlert } = useSnackbar();

  return (
    <SnackbarMaterial
      open={alert.open}
      //@ts-ignore
      anchorOrigin={defaultAlignment}
      onClose={closeAlert}
    >
      <Slide direction='up' in={true}>
        <Alert
          onClose={() => closeAlert()}
          severity={alert?.severity}
        >
          {alert?.message}
        </Alert>
      </Slide>
    </SnackbarMaterial>
  );
};

export default Snackbar;