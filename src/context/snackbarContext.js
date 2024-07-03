// SnackbarContext.js
import React, {createContext, useContext, useState} from 'react';
import Snackbar from '../components/Utils/Snackbar';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({children}) => {
  const [snackbar, setSnackbar] = useState({
    message: '',
    type: 'info',
    icon: 'info',
    visible: false,
  });

  const showSnackbar = (message, type = 'info', icon = 'info') => {
    setSnackbar({message, type, icon, visible: true});
    setTimeout(() => {
      setSnackbar(prev => ({...prev, visible: false}));
    }, 3000);
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({...prev, visible: false}));
  };

  return (
    <SnackbarContext.Provider value={{showSnackbar, hideSnackbar}}>
      {children}
      <Snackbar {...snackbar} onClose={hideSnackbar} />
    </SnackbarContext.Provider>
  );
};
