# React Native / Expo Components

A collection of reusable React Native & Expo components that are commonly needed but hard to find with clean, minimal implementations elsewhere.

Each component lives in its own folder with a dedicated README covering usage, props, and dependencies.

## Components

### Pressable

| Component | Description |
| --------- | ----------- |
| [ScalePressable](./components/pressable/) | Pressable with scale animation on press + loading state overlay |

## Philosophy

- No extra dependencies beyond what's needed
- Full TypeScript types
- Props extend the native component they wrap — no API surprises
- NativeWind (`className`) support where applicable
