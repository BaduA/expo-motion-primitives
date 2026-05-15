# ScalePressable

A drop-in replacement for React Native's `Pressable` that adds a smooth scale animation on press and an optional loading state — without losing any of the original `Pressable` API.

## Why

React Native's built-in `Pressable` has no animation. Adding `Animated` manually every time is boilerplate. This component wraps it once and gives you scale feedback + loading state out of the box.

## Dependencies

- `react-native-reanimated`

## Usage

```tsx
import { ScalePressable } from './ScalePressable';

// Basic
<ScalePressable onPress={() => console.log('pressed')}>
  <Text>Press me</Text>
</ScalePressable>

// Custom scale & duration
<ScalePressable activeScale={0.92} duration={200} onPress={handlePress}>
  <Text>Slower, bigger dip</Text>
</ScalePressable>

// Loading state — children stay mounted (preserving layout), spinner overlays
<ScalePressable loading={isSubmitting} onPress={handleSubmit}>
  <Text>Submit</Text>
</ScalePressable>
```

## Props

| Prop          | Type      | Default | Description                                              |
| ------------- | --------- | ------- | -------------------------------------------------------- |
| `activeScale` | `number`  | `0.96`  | Scale value while pressed. Lower = more dramatic dip.    |
| `duration`    | `number`  | `120`   | Animation duration in ms for both press-in and press-out.|
| `loading`     | `boolean` | `false` | Shows an `ActivityIndicator` overlay, disables presses.  |
| `style`       | `ViewStyle` | —     | Style passed to the inner `Pressable`.                   |
| `className`   | `string`  | —       | NativeWind class support.                                |
| ...rest       | `PressableProps` | — | All standard `Pressable` props are forwarded.           |

## Notes

- The loading trick renders children at `opacity: 0` to hold the button's dimensions, then absolutely positions the spinner on top. This prevents layout shifts when toggling `loading`.
- `disabled` prop and `loading` are both respected — either one disables interaction.
- Uses `forwardRef` so you can pass a ref to the underlying `View`.
