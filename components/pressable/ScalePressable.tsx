import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export type ScalePressableProps = PressableProps & {
  /** Scale when pressed (default 0.96) */
  activeScale?: number;
  /** Duration in ms (default 120) */
  duration?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
  /** When true, shows a loading spinner instead of children */
  loading?: boolean;
};

export const ScalePressable = React.forwardRef<View, ScalePressableProps>(
  (
    {
      activeScale = 0.96,
      duration = 120,
      loading = false,
      style,
      onPressIn,
      onPressOut,
      children,
      ...rest
    },
    ref
  ) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          ref={ref}
          onPressIn={(e) => {
            scale.value = withTiming(activeScale, { duration });
            onPressIn?.(e);
          }}
          onPressOut={(e) => {
            scale.value = withTiming(1, { duration });
            onPressOut?.(e);
          }}
          style={style}
          {...rest}
          disabled={loading || rest.disabled}>
          {loading ? (
            <>
              <View style={{ opacity: 0 }}>{children as React.ReactNode}</View>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator color="white" />
              </View>
            </>
          ) : (
            children
          )}
        </Pressable>
      </Animated.View>
    );
  }
);
