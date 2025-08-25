# Headless Form JS SDK (beta release)

This JS SDK package helps render a form based on metadata taken from the Headless Form API. In this package, there are 2 main parts:

| Project                         | Description             | Doc                     |
| --------------------------------| ------------------------| ------------------------|
| @episerver/forms-sdk           | JS SDK for models, client validation, form loader, form dependencies, form submit | https://github.com/episerver/content-headless-form-js-sdk/tree/develop/src/%40episerver/forms-sdk#readme
| @episerver/forms-react         | React SDK for rendering a form as a React component | https://github.com/episerver/content-headless-form-js-sdk/tree/develop/src/%40episerver/forms-react#readme

ref: 

   https://docs.developers.optimizely.com/content-management-system/v1.2.0-forms/docs/get-started-with-headless-optimizely-forms
   
   https://world.optimizely.com/blogs/linh-hoang/dates/2024/8/optimizely-headless-form-setup/
   
Wiki:

   [Setup AAD with Form Headless API](https://github.com/episerver/content-headless-form-js-sdk/wiki/Setup-AAD-with-Form-Headless-API)
   
   [Setup Anonymous token provider with Headless Forms](https://github.com/episerver/content-headless-form-js-sdk/wiki/Setup-Anonymous-token-provider-with-Headless-Form)
   
   [Setup Form Headless API with OIDC](https://github.com/episerver/content-headless-form-js-sdk/wiki/Setup-Form-Headless-API-with-OIDC)
   
## Getting Started

### Installation
**From Azure Artifacts** 

Source https://dev.azure.com/EpiserverEngineering/netCore/_artifacts/feed/HeadlessForms

To use packages from Azure Artifacts, configure your project to reference this feed. Create a new text file called .npmrc in the same directory as your package.json, then copy the snippet below.
```
   @episerver:registry=https://pkgs.dev.azure.com/EpiserverEngineering/netCore/_packaging/HeadlessForms/npm/registry/
```
Install from the command line
```
   $ npm install @episerver/forms-sdk@%verion%
```
```
   $ npm install @episerver/forms-react@%verion%
```

**OR** clone source code and install dependencies, then build and view the site on the browser.
#### Sample site structures
This repository contains two sample sites 
* Site render using Headless Form Api
   - `/samples/ManagementSite` Backend decouples site that hosts the Headless Form API
   - `/samples/sample-react-app` Frontend React site that render form using Headless Form API
* Site render using Content Graph
   - `/samples/musicfestival-backend-dotnet` Backend site that fully index using Content Graph
   - `/samples/musicfestival-frontend-react` Frontend React site that renders the full site, including the Form, using Content Graph

#### Installing and running sample sites
1. Clone repo

```sh
   git clone https://github.com/episerver/content-headless-form-js-sdk.git
```
```sh
   cd content-headless-form-js-sdk
```

2. Install package dependencies and database

```sh
   npm run setup
```

To setup musicfestival: 
- https://github.com/episerver/content-headless-form-js-sdk/tree/develop/samples/musicfestival-backend-dotnet
- https://github.com/episerver/content-headless-form-js-sdk/tree/develop/samples/musicfestival-frontend-react

3. Build all projects

```sh
   npm run build
```

4. Start management site

```sh
   npm run start-backend
```

for musicfestival sample site

```sh
   npm run start-musicfestival-backend
``` 
5. Start react site

```sh
   npm run start-frontend
```

for musicfestival sample site

```sh
   npm run start-musicfestival
``` 

### View site on browser

Create a form with some elements in MainContentArea of Start page.

1. Management page

```sh
   http://localhost:8082/episerver/cms
```

2. React page

```sh
   http://localhost:3000/
```
