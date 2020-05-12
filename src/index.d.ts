type JSON = null | string | number | { [key: string]: JSON } | JSONArray;
interface JSONArray extends Array<JSON> {}

export declare class NativeScriptMixpanel {
  /**
   * Get the instance of MixpanelAPI associated with your Mixpanel project token.
   *
   * @param token
   */
  public static init(token: string): void;

  /**
   * Push all queued Mixpanel events and People Analytics changes to Mixpanel servers.
   *
   * Events and People messages are pushed gradually throughout the lifetime of your
   * application. This means that to ensure that all messages are sent to Mixpanel when
   * your application is shut down, you will need to call flush() to let the Mixpanel
   * library know it should send all remaining messages to the server.
   *
   * We strongly recommend placing a call to flush() in the onDestroy() method of your
   * main application activity.
   */
  public static flush(): void;

  /**
   * Associate all future calls to track(string, JSON) with the user identified by the
   * given distinct id.
   *
   * This call does not identify the user for People Analytics; to do that,
   * see MixpanelAPI.People.identify(String).
   * Mixpanel recommends using the same distinct_id for both calls, and using a
   * distinct_id that is easy to associate with the given user, for example, a
   * server-side account identifier.
   *
   * Calls to track(string, JSON) made before corresponding calls to identify
   * will use an anonymous locally generated distinct id, which means it is best to
   * call identify early to ensure that your Mixpanel funnels and retention analytics
   * can continue to track the user throughout their lifetime. We recommend calling
   * identify when the user authenticates.
   *
   * Once identify is called, the local distinct id persists across restarts of your application.
   *
   * @param distinctId a string uniquely identifying this user. Events sent to Mixpanel
   * using the same distinct_id will be considered associated with the same visitor/customer
   * for retention and funnel reporting, so be sure that the given value is globally unique
   * for each individual user you intend to track.
   */
  public static identify(id: any, extraAttributes?: any): void;

  /**
   * Clears tweaks and all distinct_ids, superProperties, and push
   * registrations from persistent storage. Will not clear referrer information.
   */
  public static reset(): void;

  /**
   * Returns a Mixpanel.People object that can be used to set and increment People
   * Analytics properties.
   */
  public static getPeople(): MixpanelPeople;

  /**
   * Register properties that will be sent with every subsequent call
   * to  track(string, JSON).
   *
   * SuperProperties are a collection of properties that will be sent with every
   * event to Mixpanel, and persist beyond the lifetime of your application.
   *
   * Setting a superProperty with registerSuperProperties will store a new
   * superProperty, possibly overwriting any existing superProperty with the
   * same name (to set a superProperty only if it is currently unset, use
   * registerSuperPropertiesOnce(JSON)).
   *
   * SuperProperties will persist even if your application is taken completely
   * out of memory. to remove a superProperty, call unregisterSuperProperty(string)
   * or clearSuperProperties()
   *
   * @param properties A JSON containing super properties to register
   */
  public static registerSuperProperties(properties: JSON): void;

  /**
   * Erase all currently registered superProperties.
   *
   * Future tracking calls to Mixpanel will not contain the specific superProperties
   * registered before the clearSuperProperties method was called.
   *
   * To remove a single superProperty, use unregisterSuperProperty(string)
   */
  public static clearSuperProperties(): void;

  /**
   * Remove a single superProperty, so that it will not be sent with future calls
   * to track(String, JSONObject).
   *
   * If there is a superProperty registered with the given name, it will be permanently
   * removed from the existing superProperties.
   *
   * To clear all superProperties, use clearSuperProperties()
   *
   * @param superPropertyName name of the property to unregister
   */
  public static unregisterSuperProperty(superPropertyName: string): void;

  /**
   * This function creates a distinct_id alias from alias to original.
   * If original is null, then it will create an alias to the current events
   * distinct_id, which may be the distinct_id randomly generated by the
   * Mixpanel library before identify(string) is called.
   *
   * This call does not identify the user after. You must still call both
   * identify(string) and MixpanelAPI.People.identify(string) if you wish the
   * new alias to be used for Events and People.
   *
   * @param alias the new distinct_id that should represent original.
   * @param original the old distinct_id that alias will be mapped to.
   */
  public static alias(alias: string, original?: string): void;

  /**
   * Use this method to opt-in an already opted-out user from tracking.
   *
   * People updates and track calls will be sent to Mixpanel after using
   * this method. This method will internally track an opt-in event to
   * your project.
   *
   * If you want to identify the opt-in event and/or pass properties to
   * the event, see optInTracking(String).
   */
  public static optInTracking(distinctId?: string): void;

  /**
   * Use this method to opt-out a user from tracking.
   *
   * Events and people updates that haven't been flushed yet will be deleted.
   * Use flush() before calling this method if you want to send all the queues
   * to Mixpanel before.
   *
   * This method will also remove any user-related information from the device.
   */
  public static optOutTracking(): void;

  /**
   * Begin timing of an event. Calling timeEvent("Thing") will not send an event,
   * but when you eventually call track("Thing"), your tracked event will be sent
   * with a "$duration" property, representing the number of seconds between your calls.
   *
   * @param eventName the name of the event to track with timing.
   */
  public static timeEvent(eventName: string): void;

  /**
   * Track an event.
   *
   * Every call to track eventually results in a data point sent to Mixpanel.
   * These data points are what are measured, counted, and broken down to create
   * your Mixpanel reports. Events have a string name, and an optional set of
   * name/value pairs that describe the properties of that event.
   *
   * @param eventName The name of the event to send.
   * @param properties A JSON containing the key value pairs of the properties
   * to include in this event.
   */
  public static track(eventName: string, properties?: JSON): void;
}
