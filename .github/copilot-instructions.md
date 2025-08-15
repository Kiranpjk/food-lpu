# Copilot Instructions for MyApp

Welcome to the MyApp codebase! This document provides essential guidance for AI coding agents to be productive in this project.

## Project Overview

MyApp is an [Expo](https://expo.dev) project created with `create-expo-app`. It uses file-based routing and is structured to support universal app development for Android, iOS, and the web.

### Key Directories

- **`app/`**: Contains the main application code, including screens and layouts. File-based routing is implemented here.
  - Example: `app/(tabs)/index.tsx` defines the main tab navigation.
- **`components/`**: Reusable UI components.
  - Example: `components/BottomTabs.js` implements the bottom tab navigation.
- **`constants/`**: Centralized constants for theming and configuration.
  - Example: `constants/Colors.ts` defines the app's color palette.
- **`hooks/`**: Custom React hooks for shared logic.
  - Example: `hooks/useThemeColor.ts` provides theming utilities.
- **`assets/`**: Static assets like images and fonts.
- **`scripts/`**: Utility scripts for project maintenance.
  - Example: `scripts/reset-project.js` resets the project to a blank state.

## Developer Workflows

### Install Dependencies

```bash
npm install
```

### Start the App

```bash
npx expo start
```

This command launches the Expo development server. You can open the app in a development build, Android emulator, iOS simulator, or Expo Go.

### Reset the Project

```bash
npm run reset-project
```

This script moves the starter code to `app-example/` and creates a blank `app/` directory for fresh development.

## Project-Specific Conventions

- **File-Based Routing**: The `app/` directory uses Expo's file-based routing. Refer to the [Expo Router documentation](https://docs.expo.dev/router/introduction/) for details.
- **Platform-Specific Components**: Some components have platform-specific implementations.
  - Example: `components/ui/TabBarBackground.tsx` (default) and `components/ui/TabBarBackground.ios.tsx` (iOS-specific).
- **Theming**: The app uses a custom theming system defined in `constants/Colors.ts` and implemented via hooks like `useThemeColor.ts`.

## External Dependencies

- **Expo**: Core framework for universal app development.
- **React Navigation**: Used for navigation patterns like tabs and stacks.
- **Haptics**: Provides tactile feedback for user interactions (e.g., `components/HapticTab.tsx`).

## Examples of Patterns

- **Reusable Components**: `components/CategoryItem.tsx` demonstrates how to create modular and reusable UI elements.
- **Custom Hooks**: `hooks/useColorScheme.ts` shows how to encapsulate logic for determining the user's color scheme.

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)

---

Feel free to update this document as the project evolves to ensure it remains a valuable resource for developers and AI agents alike.
