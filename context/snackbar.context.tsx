import * as React from 'react';
import { Snackbar, Text, useTheme } from 'react-native-paper';

interface ISnackbarContext {
  setSnackbar: React.Dispatch<React.SetStateAction<ISnackbarProps>>;
}

interface ISnackbarProps {
  visible: boolean;
  action?: {
    label: string;
    onPress: () => void;
  };
  label: string;
}

export const SnackbarContext = React.createContext<ISnackbarContext>({} as ISnackbarContext);

export const SnackbarContextProvider: React.FC = ({ children }) => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = React.useState({} as ISnackbarProps);
  const [show, setShow] = React.useState(snackbar.visible);

  const onDismiss = () => setShow(false);

  React.useMemo(() => {
    setShow(snackbar.visible);
  }, [snackbar]);

  return (
    <SnackbarContext.Provider value={React.useMemo(() => ({ setSnackbar }), [setSnackbar])}>
      {children}
      <Snackbar
        {...snackbar}
        visible={show}
        onDismiss={onDismiss}
        style={{ backgroundColor: theme.colors.background }}
      >
        <Text>{snackbar.label}</Text>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
