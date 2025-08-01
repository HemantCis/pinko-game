import { AlertColor } from '@mui/material';
import { atom } from 'recoil';

export interface IAlert {
    open: boolean;
    message: string;
    severity: AlertColor | undefined;
}

export const alertState = atom<IAlert>({
  key: 'alert',
  default: {
    open: false,
    message: '',
    severity: undefined,
  },
});