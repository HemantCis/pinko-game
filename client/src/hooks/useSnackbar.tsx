import { AlertColor } from '@mui/material';
import { useRecoilState } from 'recoil';
import { alertState, IAlert } from '../store/atoms/alertState';


let closeTimeout: any = null;

export const useSnackbar = () => {
    const [alert, setAlert] = useRecoilState(alertState);

  const closeAlert = () => {
    setAlert((prev: any) => ({
      ...prev,
      open: false,
    }));
  };

  const notify = (message: string, severity: AlertColor = 'success') => {
    clearTimeout(closeTimeout);

    const newAlert: IAlert = {
      open: true,
      message,
      severity,
    };

    closeAlert();

    setTimeout(() => {
      setAlert(newAlert);
    }, 300);

    closeTimeout = setTimeout(() => {
      closeAlert();
    }, 6000);
  };

  return {
    alert,
    notify,
    closeAlert,
  };
};
