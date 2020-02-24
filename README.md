# NativeScript Mixpanel

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nstudio/nativescript-mixpanel/Build%20CI?style=flat-square)](https://github.com/nstudio/nativescript-mixpanel/actions?workflow=Build+CI)
[![npm](https://img.shields.io/npm/v/@nstudio/nativescript-mixpanel?style=flat-square)](https://www.npmjs.com/package/@nstudio/nativescript-mixpanel)
[![npm](https://img.shields.io/npm/dt/@nstudio/nativescript-mixpanel?style=flat-square)](https://www.npmjs.com/package/@nstudio/nativescript-mixpanel)

> A NativeScript plugin to provide the ability to integrate with Mixpanel.

## Installation
From your command prompt/terminal go to your application's root folder and execute:

`tns plugin add @nstudio/nativescript-mixpanel`

## Usage


### Angular Native (NativeScript Angular) Usage

In main.ts add the following before you bootstrap

```typescript
import { MixpanelHelper } from "@nstudio/nativescript-mixpanel";
MixpanelHelper.init(YOUR_KEY_HERE);
```

## API
```typescript
import { MixpanelHelper } from "@nstudio/nativescript-mixpanel";
```

- **MixpanelHelper.init(token: any)**
- **MixpanelHelper.track(eventName: any, props?: any)**
- **MixpanelHelper.timeEvent(eventName: any)**
- **MixpanelHelper.identify(id: any, extraAtributes?: any)**
- **MixpanelHelper.registerSuperProperties(props: any)**
- **MixpanelHelper.addPushDeviceToken(token: any)**
- **MixpanelHelper.alias(alias: string)**
- **MixpanelHelper.reset()**
- **MixpanelHelper.flush()**

### Contributors

- Alex Miller
- Antonio Cueva Urraco
- Blake Nussey
- Demetrio Filocamo
