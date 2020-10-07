import { android } from "@nativescript/core/application/application";

import {
  LOGGING,
  MixpanelCommon,
  MixpanelPeopleCommon,
} from "./mixpanel.common";

type JSON = null | string | number | { [key: string]: JSON } | JSONArray;
interface JSONArray extends Array<JSON> {}

/**
 * Typed interface representing the native instance of Mixpanel.
 */
interface MixpanelAndroid extends MixpanelCommon {
  getInstance: (context: any, token: string) => MixpanelAndroid;

  flush: () => void;
  identify: (distinctId: string) => void;
  reset: () => void;

  // People
  getPeople: () => MixpanelPeopleCommon;

  // Super Properties
  registerSuperProperties: (properties: org.json.JSONObject) => void;
  clearSuperProperties: () => void;
  unregisterSuperProperty: (superPropertyName: string) => void;

  // Tracking
  alias: (alias: string, original: string | null) => void;
  optInTracking: () => void;
  optOutTracking: () => void;
  timeEvent: (eventName: string) => void;
  track: (eventName: string, properties?: org.json.JSONObject) => void;
}

export class NativeScriptMixpanel {
  private static _mixpanel?: MixpanelAndroid;

  private static get mixpanel(): MixpanelAndroid {
    if (this._mixpanel) {
      return this._mixpanel;
    }
    console.error(LOGGING.CALLED_WITHOUT_INSTANCE);
    throw new Error(LOGGING.CALLED_WITHOUT_INSTANCE);
  }

  private static set mixpanel(mixpanelApiInstance: MixpanelAndroid) {
    this._mixpanel = mixpanelApiInstance;
  }

  /**
   * Get the instance of MixpanelAPI associated with your Mixpanel project token.
   *
   * @param token
   */
  public static init(token: string): void {
    const mixpanel: any = this.getNativeInstance();
    const mixpanelApi: MixpanelAndroid =
      mixpanel && mixpanel.android.mpmetrics.MixpanelAPI;

    let initFailed = false;

    // Ensure Mixpanel loads.
    // tslint:disable-next-line: strict-type-predicates triple-equals
    if (mixpanel == undefined || mixpanelApi == undefined) {
      console.error(LOGGING.INIT_FAILURE);
      initFailed = true;
    }

    const context: any = android.context;
    // Ensure the context is valid.
    // tslint:disable-next-line: triple-equals
    if (context == undefined) {
      console.error(LOGGING.CONTEXT_FAILURE);
      initFailed = true;
    }

    // If there is an init failure, prevent a hard crash.
    if (!initFailed) {
      this.mixpanel = mixpanelApi.getInstance(context, token);
    }
  }

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
  public static flush(): void {
    this.mixpanel.flush();
  }

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
  public static identify(distinctId: string): void {
    this.mixpanel.identify(distinctId);
  }

  /**
   * Clears tweaks and all distinct_ids, superProperties, and push
   * registrations from persistent storage. Will not clear referrer information.
   */
  public static reset(): void {
    this.mixpanel.reset();
  }

  /**
   * Returns a Mixpanel.People object that can be used to set and increment People
   * Analytics properties.
   */
  public static getPeople(): NativeScriptMixpanelPeople {
    return new NativeScriptMixpanelPeople(this.mixpanel);
  }

  /**
   * Register properties that will be sent with every subsequent call
   * to track(string, JSON).
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
  public static registerSuperProperties(properties: JSON): void {
    const androidProps = new org.json.JSONObject(JSON.stringify(properties));
    this.mixpanel.registerSuperProperties(androidProps);
  }

  /**
   * Erase all currently registered superProperties.
   *
   * Future tracking calls to Mixpanel will not contain the specific superProperties
   * registered before the clearSuperProperties method was called.
   *
   * To remove a single superProperty, use unregisterSuperProperty(string)
   */
  public static clearSuperProperties(): void {
    this.mixpanel.clearSuperProperties();
  }

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
  public static unregisterSuperProperty(superPropertyName: string): void {
    this.mixpanel.unregisterSuperProperty(superPropertyName);
  }

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
   */
  public static alias(alias: string): void {
    // tslint:disable-next-line: no-null-keyword
    this.mixpanel.alias(alias, null);
  }

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
  public static optInTracking(): void {
    this.mixpanel.optInTracking();
  }

  /**
   * Use this method to opt-out a user from tracking.
   *
   * Events and people updates that haven't been flushed yet will be deleted.
   * Use flush() before calling this method if you want to send all the queues
   * to Mixpanel before.
   *
   * This method will also remove any user-related information from the device.
   */
  public static optOutTracking(): void {
    this.mixpanel.optOutTracking();
  }

  /**
   * Begin timing of an event. Calling timeEvent("Thing") will not send an event,
   * but when you eventually call track("Thing"), your tracked event will be sent
   * with a "$duration" property, representing the number of seconds between your calls.
   *
   * @param eventName the name of the event to track with timing.
   */
  public static timeEvent(eventName: string): void {
    this.mixpanel.timeEvent(eventName);
  }

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
  public static track(eventName: string, properties?: JSON): void {
    if (properties) {
      const androidProps = new org.json.JSONObject(JSON.stringify(properties));
      this.mixpanel.track(eventName, androidProps);
      return;
    }
    this.mixpanel.track(eventName);
  }

  /**
   * Attempt to capture the native instance of Mixpanel.
   */
  private static getNativeInstance(): any {
    try {
      return com.mixpanel || Mixpanel;
    } catch (error) {
      console.log(`${LOGGING.NATIVE_CAPTURE_FAILURE}`);
    }
    return undefined;
  }
}

export class NativeScriptMixpanelPeople {
  private _people?: MixpanelPeopleCommon;

  private get people(): MixpanelPeopleCommon {
    if (this._people) {
      return this._people;
    }
    console.error(LOGGING.PEOPLE_UNDEFINED_INSTANCE);
    throw new Error(LOGGING.PEOPLE_UNDEFINED_INSTANCE);
  }

  private set people(peopleInstance: MixpanelPeopleCommon) {
    this._people = peopleInstance;
  }

  constructor(mixpanel: MixpanelAndroid) {
    this.people = mixpanel.getPeople();
  }

  /**
   * Associate future calls to set(JSON), increment(Map), append(string, Object),
   * etc... with a particular People Analytics user.
   *
   * All future calls to the People object will rely on this value to assign
   * and increment properties. The user identification will persist across
   * restarts of your application. We recommend calling People.identify as soon
   * as you know the distinct id of the user.
   *
   * @param distinctId  a String that uniquely identifies the user. Users
   * identified with the same distinct id will be considered to be the same
   * user in Mixpanel, across all platforms and devices. We recommend choosing
   * a distinct id that is meaningful to your other systems (for example, a
   * server-side account identifier), and using the same distinct id for both
   * calls to People.identify and MixpanelAPI.identify(string).
   */
  public identify(distinctId: string): void {
    this.people.identify(distinctId);
  }

  /**
   * Set a collection of properties on the identified user all at once.
   *
   * @param properties a JSONObject containing the collection of properties
   * you wish to apply to the identified user. Each key in the JSONObject will
   * be associated with a property name, and the value of that key will be
   * assigned to the property.
   */
  public set(properties: JSON): void {
    const androidProps = new org.json.JSONObject(JSON.stringify(properties));
    this.people.set(androidProps);
  }
}
