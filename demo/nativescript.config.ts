import { NativeScriptConfig } from "@nativescript/core";

const config: NativeScriptConfig = {
    id: "org.nativescript.demo",
    appResourcesPath: "app/App_Resources",
    android: {
        v8Flags: "--expose_gc",
        markingMode: "none",
    },
    appPath: "app",
};

// tslint:disable-next-line: no-default-export
export default config;
