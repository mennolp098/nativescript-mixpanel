export type LogMethod = (tag: string, msg: string) => void;

export interface NativeScriptMixpanelLogger {
  log: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

function createLogger(): NativeScriptMixpanelLogger {
  const formatMsg = (tag: string, msg: string) => `[${tag}]: ${msg}`;

  /**
   * NativeScript does not support console.debug.
   *
   * Supported console methods:
   * https://docs.nativescript.org/ns-framework-modules/console
   */
  return {
    /* tslint:disable:no-console */
    log: (tag: string, msg: string) => console.log(formatMsg(tag, msg)),
    info: (tag: string, msg: string) => console.info(formatMsg(tag, msg)),
    warn: (tag: string, msg: string) => console.warn(formatMsg(tag, msg)),
    error: (tag: string, msg: string) => console.error(formatMsg(tag, msg)),
    /* tslint:enable:no-console */
  };
}

export let logger: NativeScriptMixpanelLogger = createLogger();

export function useLogger(providedLogger: NativeScriptMixpanelLogger): void {
  logger = providedLogger;
}
