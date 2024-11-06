import React, { useEffect } from 'react';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { settings } from '~/configs';
import { Provider } from 'react-redux';
import { persistor, store } from '~/store';
import { AppNavigator } from '~/navigators';
import { LogBox } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';

LogBox.ignoreAllLogs();
const App = (): JSX.Element => {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize(settings.oneSignalKey);

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', (event) => {
    // console.log('OneSignal: notification clicked:', event.result);
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
