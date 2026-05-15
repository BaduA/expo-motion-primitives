import React, { useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { height: SCREEN_H } = Dimensions.get('window');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type Props = {
  children: React.ReactNode;
  onClose: () => void;
  backgroundColor?: string;
};

export function BottomSheet({ children, onClose, backgroundColor = '#241e1c' }: Props) {
  const translateY = useSharedValue(SCREEN_H);
  const backdropOpacity = useSharedValue(0);

  const open = useCallback(() => {
    backdropOpacity.value = withTiming(1, { duration: 250 });
    translateY.value = withSpring(0, { damping: 24, stiffness: 260, mass: 0.8 });
  }, []);

  const close = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(
      SCREEN_H,
      { duration: 280, easing: Easing.in(Easing.cubic) },
      (done) => { if (done) runOnJS(onClose)(); },
    );
  }, [onClose]);

  useEffect(() => { open(); }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 100 || e.velocityY > 600) {
        backdropOpacity.value = withTiming(0, { duration: 180 });
        if (e.velocityY > 600) {
          // Fast swipe — carry finger momentum with decay
          translateY.value = withDecay(
            { velocity: e.velocityY, clamp: [0, SCREEN_H + 200] },
            (done) => { if (done) runOnJS(onClose)(); },
          );
        } else {
          // Slow swipe past threshold — snap out quickly
          translateY.value = withTiming(
            SCREEN_H,
            { duration: 500, easing: Easing.out(Easing.cubic) },
            (done) => { if (done) runOnJS(onClose)(); },
          );
        }
      } else {
        translateY.value = withSpring(0, { damping: 24, stiffness: 260 });
      }
    });

  const backdropTap = Gesture.Tap().onEnd(() => runOnJS(close)());

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const blurProps = useAnimatedProps(() => ({
    intensity: interpolate(translateY.value, [0, SCREEN_H * 0.5], [50, 0], 'clamp'),
  }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Backdrop */}
      <GestureDetector gesture={backdropTap}>
        <Animated.View style={[StyleSheet.absoluteFillObject, backdropStyle]} pointerEvents="auto">
          <AnimatedBlurView
            animatedProps={blurProps}
            tint="systemUltraThinMaterialDark"
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </GestureDetector>

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, { backgroundColor }, sheetStyle]}>
          <View style={styles.handle} />
          {children}
          <View style={styles.safeArea} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(61,50,45,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2e2522',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  safeArea: {
    height: 32,
  },
});
