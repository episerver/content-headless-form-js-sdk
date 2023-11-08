# Headless Form JS SDK

This is a JS SDK package that helps render a form based on metadata taken from the Headless Form API. In this package, there are 2 main parts:

| Project                         | Description             |
| --------------------------------| ------------------------|
| @optimizely/forms-sdk           | JS SDK for models, client validation, form loader, form dependencies, form submit |
| @optimizely/forms-react         | React SDK for rendering a form as a React component |

## Getting Started

### Installation

Clone source code and install dependencies, then build and view site on the browser.

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

3. Build all projects

```sh
   npm run build
```

4. Run unit tests

```sh
   npm run test
```

5. Start management site

```sh
   npm run start-backend
```

6. Start react site

```sh
   npm run start-frontend
```

### View site on browser

Access management site with credentials:

|Name    |Password   
|--------|------------|
|cmsadmin|sparr0wHawk! 
|emil    |sparr0wHawk! 
|ida     |sparr0wHawk! 
|alfred  |sparr0wHawk! 
|lina    |sparr0wHawk!

Create a form with some elements in MainContentArea of Start page.

1. Management page

```sh
   http://localhost:8082/episerver/cms
```

2. React page

```sh
   http://localhost:3000/
```