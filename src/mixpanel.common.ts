export type JSON = null | string | number | { [key: string]: JSON } | JSONArray;
export interface JSONArray extends Array<JSON> {}

export interface MixpanelCommon {
  identify: (identity: string) => void;
}

export interface MixpanelPeopleCommon {
  identify: (distinctId: string) => void;
  set: (properties: org.json.JSONObject) => void;
}

const MIXPANEL: string = "Mixpanel:";
export const LOGGING = {
  CALLED_WITHOUT_INSTANCE: `${MIXPANEL} No instance found. Did you call 'getInstance'?`,
  CONTEXT_FAILURE: `${MIXPANEL} Failed to get context.`,
  INIT_FAILURE: `${MIXPANEL} Native library failed to load.`,
  PEOPLE_UNDEFINED_INSTANCE: `${MIXPANEL} No instance found.`,
};
