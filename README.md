# `@royal-duck/serving-duck`

Zero-UI-dependency **Vue 3 + Tailwind CSS v4** Atomic Design System built for **Royal Duck** dashboards, operational SaaS applications, and HTML browser game menus/lobbies.

## Installation

```sh
npm install @royal-duck/serving-duck
```

Peer dependency: `vue@^3.5.0`.

## CSS & Theme Setup

`@royal-duck/serving-duck` supports **both** Tailwind CSS v4 consumer apps and standalone non-Tailwind Vue 3 apps.

### Option A: Consuming App Uses Tailwind CSS v4 (Recommended)

Import `@royal-duck/serving-duck/theme.css` right after `tailwindcss` in your main CSS file to share all semantic tokens (`bg-sd-canvas`, `text-sd-fg`, `bg-sd-primary`, etc.) and automatically scan component utilities:

```css
@import "tailwindcss";
@import "@royal-duck/serving-duck/theme.css";
```

### Option B: Standalone Vue 3 App (Without Tailwind CSS)

Import the pre-compiled stylesheet once in your app entrypoint:

```ts
import '@royal-duck/serving-duck/style.css';
```

### Dark & Light Mode

`:root` defaults to the **Dark** Slate + Royal Indigo + Royal Duck Gold palette out of the box. Switch any page or subtree to Light mode via `data-theme="light"` (or `.light`), and scope explicit Dark surfaces via `data-theme="dark"` (or `.dark`):

```html
<html lang="en" data-theme="dark">
  <!-- Or data-theme="light" -->
</html>
```

Override any `--sd-*` CSS custom property (colors, `--sd-font-sans`, `--sd-font-display`, `--sd-font-mono`, radii) on `:root` to customize the brand skin per project.

## Component Usage

### Tree-Shakeable Named Imports

```vue
<script setup lang="ts">
import { SDLabel, SDTitle } from '@royal-duck/serving-duck';
</script>

<template>
  <SDTitle
    as="h2"
    size="lg"
    status="success"
  >
    Server Online
  </SDTitle>

  <SDLabel
    for="callsign"
    required
  >
    Player Callsign
  </SDLabel>
</template>
```

### Optional Global Plugin Registration

```ts
import { createApp } from 'vue';
import { ServingDuck } from '@royal-duck/serving-duck';
import '@royal-duck/serving-duck/style.css';

import App from './App.vue';

createApp(App).use(ServingDuck).mount('#app');
```

## Development Scripts

```sh
# Launch Storybook component workbench on http://localhost:6006
npm run storybook

# Lint (Oxlint + ESLint)
npm run lint

# Type-check all TS/Vue configs
npm run type-check

# Run unit tests (jsdom) + Storybook Playwright browser & axe a11y tests
npm run test:unit -- --run

# Build production library (ESM + .d.ts + style.css + theme.css + tokens.css)
npm run build

# Build static Storybook documentation
npm run build-storybook
```

## Creating Components

Create the component under components (decide logically if it is an atom, molecule, organism or template).

Add or update an index.ts file in the components folder to export the component and its types.

Add the new component to the global index.ts file in the install script and the GlobalComponents definition.

Create a Story for the component in the stories folder.

Create a Test for the component in the __tests__ folder. Ensure all tests pass and all storybook tests pass.
