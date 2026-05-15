# BottomSheet

A gesture-driven bottom sheet with spring open animation, animated blur backdrop, and smart swipe-to-dismiss — no external sheet library needed.

## Why

Most bottom sheet libraries are heavy and opinionated. This is ~140 lines, fully customizable, and handles the two details that matter most: momentum-based dismiss on fast swipe, and snap-back on slow drags that don't cross the threshold.

## Dependencies

- `react-native-reanimated`
- `react-native-gesture-handler`
- `expo-blur`

## Usage

This is a wrapper — pass any content as `children`.

```tsx
import { BottomSheet } from './BottomSheet';

const [open, setOpen] = useState(false);

{open && (
  <BottomSheet onClose={() => setOpen(false)}>
    <Text>Any content goes here</Text>
  </BottomSheet>
)}
```

Render it at the top of your tree (or in a Portal) so it sits above everything else.

## Props

| Prop              | Type                | Default       | Description                                      |
| ----------------- | ------------------- | ------------- | ------------------------------------------------ |
| `children`        | `React.ReactNode`   | —             | Content rendered inside the sheet.               |
| `onClose`         | `() => void`        | —             | Called after the close animation finishes.       |
| `backgroundColor` | `string`            | `'#241e1c'`   | Background color of the sheet panel.             |

## Behavior

- **Open** — springs in with `damping: 24, stiffness: 260, mass: 0.8` for a snappy but not bouncy feel.
- **Backdrop** — animated blur (`expo-blur`) that fades in on open and tracks sheet position while dragging.
- **Tap backdrop** — closes the sheet.
- **Slow drag past 100px** — snaps out with `Easing.out(Easing.cubic)`.
- **Fast swipe (velocityY > 600)** — continues with `withDecay` carrying the finger's momentum naturally.
- **Drag below threshold** — snaps back to open position with spring.
