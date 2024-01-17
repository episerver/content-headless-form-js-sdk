# Headless Form React Documentation
There are two components can be used when install package `@episerver/forms-react`:
## Form 
### Description
This is the main component that will be used to render the form from the metadata received from the Headless Form API
### Usage
```js
<Form
    formKey={formKey}
    language={language}
    baseUrl={"/"}
    identityInfo={identityInfo} 
    history={history}
    currentPageUrl={"http://yourdomain/en/"}
    optiGraphUrl={"https://cg.optimizely.com/content/v2?auth={singlekey}"}
/>
```
### Propperties
* formKey - The form key that identifies the form
* language - The code of the form language
* baseUrl - The base url of Headless Form API
* identityInfo - Access token for form submit
* history - The instance of useHistory() received from react-router-dom
* currentPageUrl - The public url of current page
* optiGraphUrl - The endpoint url of Optimizely Graph with your singlekey

## FormLogin
### Description
This is a component that will be used to render a login form, it helps to login to Headless Form API
### Usage
```js
<FormLogin
    clientId='TestClient'
    authBaseUrl={""}
    onAuthenticated={handleAuthen} />
```
### Properties
* clientId - Client Id that's allowed access API
* authBaseUrl - Endpoint to get access token
* onAuthenticated - Callback function when authenticated successfully