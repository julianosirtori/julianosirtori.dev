export const languages = {
  en: {
      native: 'English',
      flag: 'gb',
  },
  pt: {
      native: 'Português (Brasil)',
      flag: 'pt-br',
  },
} satisfies Record<
  string,
  {
      native: string;
      flag: string;
  }
>;

export type Language = keyof typeof languages;