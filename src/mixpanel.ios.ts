import { LOGGING, MixpanelPeopleCommon } from "./mixpanel.common";

type JSON = null | string | number | { [key: string]: JSON } | JSONArray;
interface JSONArray extends Array<JSON> {}

interface MixpanelIos {
  /**
   * A distinct ID is a string that uniquely identifies one of your users.
   * By default, we’ll use the device’s advertisingIdentifier UUIDString, if
   * that is not available we’ll use the device’s identifierForVendor
   * UUIDString, and finally if that is not available we will generate a new
   * random UUIDString. To change the current distinct ID, use the identify method.
   */
  distinctId: string;
  people: MixpanelPeopleCommon;

  flush: () => void;
  identify: (distinctId: string) => void;
  reset: () => void;

  // People
  getPeople: () => MixpanelPeopleCommon;

  // Super Properties
  registerSuperProperties: (properties: NSDictionary<any, any>) => void;
  clearSuperProperties: () => void;
  unregisterSuperProperty: (superPropertyName: string) => void;

  // Tracking
  createAliasForDistinctID: (alias: string, distinctId: string) => void;
  optInTracking: () => void;
  optOutTracking: () => void;
  timeEvent: (eventName: string) => void;
  track: (event: string) => void;
  trackProperties: (event: string, properties: NSDictionary<any, any>) => void;
}

export class NativeScriptMixpanel {
  private static _mixpanel?: MixpanelIos;

  private static get mixpanel(): MixpanelIos {
    if (this._mixpanel) {
      return this._mixpanel;
    }
    console.error(LOGGING.CALLED_WITHOUT_INSTANCE);
    throw new Error(LOGGING.CALLED_WITHOUT_INSTANCE);
  }

  private static set mixpanel(mixpanelInstance: MixpanelIos) {
    this._mixpanel = mixpanelInstance;
  }

  public static init(token: string): void {
    const mixpanel: any = this.getNativeInstance();

    // Ensure Mixpanel loads.
    // tslint:disable-next-line: triple-equals
    if (mixpanel == undefined) {
      console.error(LOGGING.INIT_FAILURE);
    }

    mixpanel.sharedInstanceWithToken(token);
    this.mixpanel = mixpanel.sharedInstance();
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
   * Mixpanel will choose a default local distinct ID.
   *
   * For tracking events, you do not need to call `identify`: However, Mixpanel
   * User profiles always require an explicit call to `identify`. If calls are made
   * to `set`, `increment` or other MixpanelPeople methods prior to calling `identify`,
   * then they are queued up and flushed once `identify` is called.
   *
   * If you’d like to use the default distinct ID for Mixpanel People as well (recommended),
   * call `identify` using the current distinct ID: [mixpanel identify:mixpanel.distinctId].
   *
   * @param distinctId string that uniquely identifies the current user
   */
  public static identify(distinctId: string): void {
    this.mixpanel.identify(distinctId);
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
   * Accessor to the Mixpanel People API object.
   */
  public static getPeople(): NativeScriptMixpanelPeople {
    return new NativeScriptMixpanelPeople(this.mixpanel);
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
  public static registerSuperProperties(properties: JSON): void {
    const iosProps = NSDictionary.dictionaryWithDictionary(properties as any);
    this.mixpanel.registerSuperProperties(iosProps);
  }

  /**
   * Clears all currently set super properties.
   */
  public static clearSuperProperties(): void {
    this.mixpanel.clearSuperProperties();
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
   * The alias method creates an alias which Mixpanel will use to remap one id to another.
   *
   * @param alias A unique identifier that you want to use as an identifier for this user.
   */
  public static alias(alias: string): void {
    this.mixpanel.createAliasForDistinctID(alias, this.mixpanel.distinctId);
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
   * Tracks an event.
   *
   * @param event event name
   * @param properties properties JSON
   */
  public static track(event: string, properties?: JSON): void {
    if (properties) {
      const iosProps = NSDictionary.dictionaryWithDictionary<any, any>(
        properties as any
      );
      this.mixpanel.trackProperties(event, iosProps);
    }
    this.mixpanel.track(event);
  }

  /**
   * Attempt to capture the native instance of Mixpanel.
   */
  private static getNativeInstance(): any {
    try {
      return Mixpanel;
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
  public set(properties: JSON): void {
    const iosProps = NSDictionary.dictionaryWithDictionary<any, any>(
      properties as any
    );
    this.people.set(iosProps);
  }
}
