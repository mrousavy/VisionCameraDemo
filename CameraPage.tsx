import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {Camera, CameraProps, useCameraDevice} from 'react-native-vision-camera';
import Reanimated from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const MAX_ZOOM_FACTOR = 10;

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

export function CameraPage() {
  // 1. Get Camera Device (here: we try to find the "Triple Camera" if available, otherwise the closest matching one)
  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });

  // Initialize with neutral zoom (1x instead of 0.5x)
  const neutralZoom = device?.neutralZoom ?? 0;
  const minZoom = device?.minZoom ?? 0;
  const maxZoom = Math.min(device?.maxZoom ?? 0, MAX_ZOOM_FACTOR);
  const zoom = useSharedValue(neutralZoom);

  useEffect(() => {
    // Reset to neutral zoom whenever the device changes (e.g. flipping camera)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  // Wrap SharedValue in Animated Props so we can pass it to Camera
  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({
      zoom: zoom.value,
    }),
    [zoom],
  );

  // Create pinch gesture
  const zoomOffset = useSharedValue(0);
  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate(event => {
      const z = zoomOffset.value * event.scale;
      console.log(z);
      zoom.value = interpolate(
        z,
        [1, 10],
        [minZoom, maxZoom],
        Extrapolation.CLAMP,
      );
    });

  if (device == null) {
    return <Text>Your phone doesn't have a Camera</Text>;
  }
  return (
    <GestureDetector gesture={gesture}>
      <ReanimatedCamera
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        animatedProps={animatedProps}
      />
    </GestureDetector>
  );
}
