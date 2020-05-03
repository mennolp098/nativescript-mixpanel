export declare class Mixpanel {
  // define your typings manually
  // or..
  // take the ios or android .d.ts files and copy/paste them here
  static addPushDeviceToken(token: any): void;
  static alias(alias: string): void;
  static flush(): void;
  static identify(id: any, extraAttributes?: any): void;
  static init(token: any): void;
  static registerSuperProperties(props: any): void;
  static reset(): void;
  static timeEvent(eventName: any): void;
  static track(eventName: any, props: any): void;
}
