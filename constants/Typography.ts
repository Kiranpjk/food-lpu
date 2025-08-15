// Centralized typography tokens

import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

// Primary font stack preference order
export const Font = {
  regular: 'Nunito_400Regular',
  bold: 'Nunito_700Bold',
};


// Export the font objects for loading
export const FontAssets = {
  Nunito_400Regular,
  Nunito_700Bold,
};

export const TextStyles = {
  heading: {
    fontFamily: Font.bold,
    fontSize: 22,
    lineHeight: 28,
  },
  subheading: {
    fontFamily: Font.bold,
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: Font.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: Font.bold,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  meta: {
    fontFamily: Font.regular,
    fontSize: 11,
    letterSpacing: 0.2,
    opacity: 0.8,
  },
};

export type TextStyleName = keyof typeof TextStyles;

export function getTextStyle(name: TextStyleName) {
  return TextStyles[name];
}
