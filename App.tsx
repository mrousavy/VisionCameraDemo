import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

function App(): React.JSX.Element {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back', {
    // Triple Camera if available - if not, it will find the closest matching camera (e.g. dual camera)
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });

  return (
    <View style={styles.container}>
      {hasPermission ? (
        device != null ? (
          <Camera
            device={device}
            isActive={true}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <Text>Your phone doesn't have a Camera</Text>
        )
      ) : (
        <Button title="Grant Permission" onPress={requestPermission} />
      )}
    </View>
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
