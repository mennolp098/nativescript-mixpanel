import { EventData, Page } from "@nativescript/core";
import { MainModel } from "./main-view-model";

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: EventData): void {
    // Get the event sender
    const page = args.object as Page;
    page.bindingContext = new MainModel();
}
