import { MixpanelHelper } from "@nstudio/nativescript-mixpanel";
import { Observable } from "tns-core-modules/data/observable";
import { setTimeout } from "@nativescript/core/timer";

import { MIXPANEL_TOKEN } from "~/constants";

export class MainModel extends Observable {
    public token: string = MIXPANEL_TOKEN;
    public testsEnabled: boolean = this.token.length > 0;

    constructor() {
        super();

        if (MIXPANEL_TOKEN.length === 0) {
            console.error(
                "No token has been set, please set your token in constants.ts"
            );
        }

        // This token should be set in constants.ts
        MixpanelHelper.init(MIXPANEL_TOKEN);
        console.log(`Mixpanel initialised, token: ${MIXPANEL_TOKEN}`);
    }

    // User Identity
    public onIdentifyPress() {
        console.log("Test: Identify");
        MixpanelHelper.identify("test identity");
    }

    public onAliasPress() {
        console.log("Test: Alias");
        MixpanelHelper.alias("test alias");
    }

    // Events
    public onRegisterSuperPropertiesPress() {
        console.log("Test: Register Super Properties");
        MixpanelHelper.registerSuperProperties({
            "Test Type": "test value"
        });
    }

    public onTrackPress() {
        console.log("Test: Track");
        MixpanelHelper.track("test event", {
            tracking: "this"
        });
    }

    public async onTimeEventPress() {
        console.log("Test: Time Event");

        const eventName = "Time Event Test";
        // Start Timer
        MixpanelHelper.timeEvent(eventName);

        await new Promise(resolve => setTimeout(resolve, 2000));

        // End Timer
        MixpanelHelper.timeEvent(eventName);
    }

    // Other
    public onFlushPress() {
        console.log("Test: Flush");
        MixpanelHelper.flush();
    }

    public onResetPress() {
        console.log("Test: Reset");
        MixpanelHelper.reset();
    }
}
