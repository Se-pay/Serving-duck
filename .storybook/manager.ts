import { addons } from 'storybook/manager-api';
import { create, type ThemeVars } from 'storybook/theming';

const customTheme: ThemeVars = create({
  base: 'dark',
  // appContentBg is the specific property for the background area behind the canvas
  appContentBg: '#020617',
});

addons.setConfig({
  theme: customTheme
});
