import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useCameraPermission} from 'react-native-vision-camera';
import {CameraPage} from './CameraPage';

function App(): React.JSX.Element {
  const {hasPermission, requestPermission} = useCameraPermission();

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <View style={styles.container}>
        {hasPermission ? (
          <CameraPage />
        ) : (
          <Button title="Grant Permission" onPress={requestPermission} />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
