import { Platform } from 'react-native';

export const typography = {
  family: Platform.select({
    android: 'sans-serif',
    ios: 'Kohinoor Bangla',
    default: 'sans-serif',
  }),
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};
