import { MixpanelHelper } from "@nstudio/nativescript-mixpanel";
import { Observable } from "tns-core-modules/data/observable";

export class MainModel extends Observable {
    constructor() {
        super();

        console.log("TODO use your token");
        MixpanelHelper.init("TODO use your token");
    }
}
