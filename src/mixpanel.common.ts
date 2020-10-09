export type JSONObject =
  | null
  | string
  | number
  | { [key: string]: JSONObject }
  | JSONArray;
export interface JSONArray extends Array<JSONObject> {}

export const LOGGING = {
  TAG: "Mixpanel",
  CALLED_WITHOUT_INSTANCE: "No instance found. Did you call 'getInstance'?",
  CONTEXT_FAILURE: "Failed to get context.",
  CUSTOM_LOGGER: "Now using provided logger.",
  INIT_FAILURE: "Native library failed to load.",
  NATIVE_CAPTURE_FAILURE: "Unable to capture native mixpanel instance.",
  PEOPLE_UNDEFINED_INSTANCE: "No instance found.",
};
