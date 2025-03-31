import {useEffect} from 'react';
import Orientation from 'react-native-orientation-locker';

export const useOrientation = (screen: 'login' | 'signup' | 'other') => {
  useEffect(() => {
    if (screen === 'login' || screen === 'signup') {
      // Allow all orientations for login/signup
      Orientation.unlockAllOrientations();
    } else {
      // Lock to landscape for other screens
      Orientation.lockToLandscape();
    }

    return () => {
      // Reset to landscape when component unmounts
      Orientation.lockToLandscape();
    };
  }, [screen]);
};
