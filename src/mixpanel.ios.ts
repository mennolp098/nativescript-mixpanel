import { logger, NativeScriptMixpanelLogger, useLogger } from "./logger";
import { JSONObject, LOGGING } from "./mixpanel.common";

/**
 * Typed interface representing the native instance of Mixpanel.
 */
interface MixpanelIos {
  /**
   * A distinct ID is a string that uniquely identifies one of your users.
   * By default, we’ll use the device’s advertisingIdentifier UUIDString, if
   * that is not available we’ll use the device’s identifierForVendor
   * UUIDString, and finally if that is not available we will generate a new
   * random UUIDString. To change the current distinct ID, use the identify method.
   */
  distinctId: string;
  people: MixpanelPeopleIos;

  // Identity
  identify: (distinctId: string) => void;
  createAliasForDistinctID: (alias: string, distinctId: string) => void;

  // Super Properties
  registerSuperProperties: (properties: NSDictionary<any, any>) => void;
  unregisterSuperProperty: (superPropertyName: string) => void;
  clearSuperProperties: () => void;

  // Tracking
  track: (event: string) => void;
  trackProperties: (event: string, properties: NSDictionary<any, any>) => void;
  timeEvent: (eventName: string) => void;

  // People
  getPeople: () => MixpanelPeopleIos;

  // Other
  optInTracking: () => void;
  optOutTracking: () => void;
  flush: () => void;
  reset: () => void;
}

/**
 * Typed interface representing the native instance of Mixpanel.
 */
interface MixpanelPeopleIos {
  identify: (distinctId: string) => void;
  set: (properties: NSDictionary<any, any>) => void;
}

export class NativeScriptMixpanel {
  private static _mixpanel?: MixpanelIos;

  private static get mixpanel(): MixpanelIos {
    if (this._mixpanel) {
      return this._mixpanel;
    }
    logger.error(LOGGING.TAG, LOGGING.CALLED_WITHOUT_INSTANCE);
    throw new Error(LOGGING.CALLED_WITHOUT_INSTANCE);
  }

  private static set mixpanel(mixpanelInstance: MixpanelIos) {
    this._mixpanel = mixpanelInstance;
  }

  /**
   * Get the instance of MixpanelAPI associated with your Mixpanel project token.
   *
   * @param token
   */
  public static init(token: string): void {
    const mixpanel: any = this.getNativeInstance();

    // Ensure Mixpanel loads.
    // tslint:disable-next-line: triple-equals
    if (mixpanel == undefined) {
      logger.error(LOGGING.TAG, LOGGING.INIT_FAILURE);
    }

    mixpanel.sharedInstanceWithToken(token);
    this.mixpanel = mixpanel.sharedInstance();
  }

  /**
   * Replace the default console logger with a custom logger binding.
   *
   * If you intend to use a custom logger or bound logger, this should
   * be called before `init` to correctly output any errors.
   *
   * @param providedLogger
   */
  public static useLogger(providedLogger: NativeScriptMixpanelLogger): void {
    useLogger(providedLogger);
    logger.info(LOGGING.TAG, LOGGING.CUSTOM_LOGGER);
  }

  /**
   * Mixpanel will choose a default local distinct ID.
   *
   * For tracking events, you do not need to call `identify`: However, Mixpanel
   * User profiles always require an explicit call to `identify`. If calls are made
   * to `set`, `increment` or other MixpanelPeople methods prior to calling `identify`,
   * then they are queued up and flushed once `identify` is called.
   *
   * If you’d like to use the default distinct ID for Mixpanel People as well (recommended),
   * call `identify` using the current distinct ID: getDistinctId.
   *
   * @param distinctId string that uniquely identifies the current user
   */
  public static identify(distinctId: string): void {
    this.mixpanel.identify(distinctId);
  }

  /**
   * The distinct ID of the current user.
   */
  public static getDistinctId(): string {
    return this.mixpanel.distinctId;
  }

  /**
   * The alias method creates an alias which Mixpanel will use to remap one id to another.
   *
   * @param alias A unique identifier that you want to use as an identifier for this user.
   */
  public static alias(alias: string): void {
    this.mixpanel.createAliasForDistinctID(alias, this.mixpanel.distinctId);
  }

  /**
   * Registers super properties, overwriting ones that have already been set.
   *
   * Super properties, once registered, are automatically sent as properties for
   * all event tracking calls. They save you having to maintain and add a common
   * set of properties to your events.
   *
   * @param properties properties dictionary
   */
  public static registerSuperProperties(properties: JSONObject): void {
    const iosProps = NSDictionary.dictionaryWithDictionary(properties as any);
    this.mixpanel.registerSuperProperties(iosProps);
  }

  /**
   * Removes a previously registered super property.
   *
   * As an alternative to clearing all properties, unregistering specific super properties
   * prevents them from being recorded on future events. This operation does not affect
   * the value of other super properties. Any property name that is not registered is ignored.
   *
   * Note that after removing a super property, events will show the attribute as having
   * the value undefined in Mixpanel until a new value is registered.
   *
   * @param superPropertyName name of the property to unregister
   */
  public static unregisterSuperProperty(superPropertyName: string): void {
    this.mixpanel.unregisterSuperProperty(superPropertyName);
  }

  /**
   * Clears all currently set super properties.
   */
  public static clearSuperProperties(): void {
    this.mixpanel.clearSuperProperties();
  }

  /**
   * Tracks an event.
   *
   * @param event event name
   * @param properties properties JSON
   */
  public static track(event: string, properties?: JSONObject): void {
    if (properties) {
      const iosProps = NSDictionary.dictionaryWithDictionary<any, any>(
        properties as any
      );
      this.mixpanel.trackProperties(event, iosProps);
    }
    this.mixpanel.track(event);
  }

  /**
   * This method is intended to be used in advance of events that have a duration.
   * For example, if a developer were to track an “Image Upload” event she might want
   * to also know how long the upload took.
   *
   * Calling this method before the upload code would implicitly cause the track
   * call to record its duration.
   *
   * @param eventName identical to the name of the event that will be tracked.
   */
  public static timeEvent(eventName: string): void {
    this.mixpanel.timeEvent(eventName);
  }

  /**
   * Returns a NativeScriptMixpanelPeople instance that can be used to identify
   * and set properties.
   */
  public static getPeople(): NativeScriptMixpanelPeople {
    return new NativeScriptMixpanelPeople(this.mixpanel);
  }

  /**
   * Use this method to opt in an already opted out user from tracking. People updates
   * and track calls will be sent to Mixpanel after using this method.
   */
  public static optInTracking(): void {
    this.mixpanel.optInTracking();
  }

  /**
   * This method is used to opt out tracking. This causes all events and people request
   * no longer to be sent back to the Mixpanel server.
   */
  public static optOutTracking(): void {
    this.mixpanel.optOutTracking();
  }

  /**
   * Uploads queued data to the Mixpanel server.
   *
   * By default, queued data is flushed to the Mixpanel servers every
   * minute (the default for `flushInterval`), and on background (since
   * `flushOnBackground` is on by default).
   *
   * You only need to call this method manually if you want to force a
   * flush at a particular moment.
   */
  public static flush(): void {
    this.mixpanel.flush();
  }

  /**
   * Clears all stored properties and distinct IDs.
   *
   * Useful if your application's user logs out.
   */
  public static reset(): void {
    this.mixpanel.reset();
  }

  /**
   * Attempt to capture the native instance of Mixpanel.
   */
  private static getNativeInstance(): any {
    console.log("Getting native instance IOS");
    try {
      return Mixpanel;
    } catch (error) {
      logger.error(LOGGING.TAG, LOGGING.NATIVE_CAPTURE_FAILURE);
    }
    return undefined;
  }
}

export class NativeScriptMixpanelPeople {
  private _people?: MixpanelPeopleIos;

  private get people(): MixpanelPeopleIos {
    if (this._people) {
      return this._people;
    }
    logger.error(LOGGING.TAG, LOGGING.PEOPLE_UNDEFINED_INSTANCE);
    throw new Error(LOGGING.PEOPLE_UNDEFINED_INSTANCE);
  }

  private set people(peopleInstance: MixpanelPeopleIos) {
    this._people = peopleInstance;
  }

  constructor(private mixpanel: MixpanelIos) {
    this.people = this.mixpanel.people;
  }

  /**
   * Please note that the core Mixpanel and MixpanelPeople classes share the
   * identify method.
   *
   * The Mixpanel identify affects the distinct_id property of events sent by track
   * and track:properties: and determines which Mixpanel People user record will
   * be updated by set, increment and other MixpanelPeople methods.
   *
   * @param distinctId string that uniquely identifies the current user
   */
  public identify(distinctId: string): void {
    this.mixpanel.identify(distinctId);
  }

  /**
   * The properties will be set on the current user. Incorrect types are
   * converted to strings using [NSString stringWithFormat:@“%@”, value].
   *
   * You can override the default the current project token and distinct ID by
   * including the special properties: $token and $distinct_id.
   *
   * If the existing user record on the server already has a value for a given
   * property, the old value is overwritten. Other existing properties will
   * not be affected.
   *
   * @param properties properties JSON
   */
  public set(properties: JSONObject): void {
    const iosProps = NSDictionary.dictionaryWithDictionary<any, any>(
      properties as any
    );
    this.people.set(iosProps);
  }
}
