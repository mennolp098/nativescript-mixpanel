import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import { MainModel } from "./main-view-model";

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    const page = <pages.Page>args.object;
    page.bindingContext = new MainModel();
}
