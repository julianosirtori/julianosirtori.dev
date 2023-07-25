export const featureFlags = {
  BLOG: process.env.FEATURE_FLAG_BLOG === 'true',
  ABOUT: process.env.FEATURE_FLAG_ABOUT === 'true',
  CONTACTS: process.env.FEATURE_FLAG_CONTACTS === 'true',
}

export type TFeatureFlags = keyof typeof featureFlags;


export const useFeatureFlag = (featureFlag: TFeatureFlags) => {
  return featureFlags[`${featureFlag}`];
}