import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import { MainModel } from "./main-view-model";

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData): void {
    // Get the event sender
    const page = args.object as pages.Page;
    page.bindingContext = new MainModel();
}
