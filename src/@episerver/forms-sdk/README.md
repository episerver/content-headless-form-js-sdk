# Headless Form JS SDK Documentation
## 1, FormAuthenticate:
### Description:
This class is an API client service, that is used to authenticate Headless Form API when the form is not allow anonymous submit.
### Method:
* login - Function to login with the given username and password, and return an access token string

### Usage:
```js
//init config option
var  config = { 
 clientId: “name_of_client”,
 grantType: “password”,
 authBaseUrl: “http://yourdomain.com/api/episerver/connect/token
}
//get token
var formAuthenticate = new FormAuthenticate(config);
formAuthenticate.login(“username”, “password”).then((tokenString) => {
 //your login here
});
```
## 2, FormCache:
### Description: 
This class is a helper class, that is used to set/get/remove data from sessionStorage or localStorage of Browser. Default storage is sessionStorage.
### Method:
* get<T> - Function to load data item that saved in storage
* set<T> - Function to save data item into storage
* remove - Function to remove data item that saved in storage

### Usage:
```js
//init 
var formCache = new FormCache(); 
//in-case you want to save to localStorage
// var formCache = new FormCache(window.localStorage);
//save data to cache
formCache.set(“key”, ”value”);
//receive data from cache
formCache.get(“key”);
//remove data from cache
formCache.remove(“key”);
```
## 3, FormDependConditions
### Description:
This class is used to check conditions for an element that was dependent on some others element. The main function checkConditions() will return a Boolean, True if All or Any conditions are satisfied, otherwise False.
### Method:
* checkConditions - Function to check if depend conditions of an element are satisfied or not

### Usage:
```js
//init
var formDependConditions = new FormDependConditions(formElement);
/* The parameter element is a form element that is a child of the current FormContainer.*/
//check if satisfy the conditions
var isSatisfied = formDependConditions.checkConditions(formSubmissions);
/* The parameter formSubmissions is an array of form element values that are inputted by user. For example: [{elementKey: “”, value: “”}];*/
```
## 4, FormLoader
### Description:
This class is an API client service, that is used to get a form by formKey from Headless Form API. The main function getForm() will return an object of type FormContainer.
### Method:
* getForm - Function to get a form with GUID key, return a promise with a form
* queryForm - Function to query a form with GUID key, return a promise with a form

### Usage:
```js
//init
var formLoader = new FormLoader({baseUrl: “http://yourdomain.com/”});
//receive a form from Headless Form API
var form =  formLoader.getForm(formKey, formLanguage);
/* Parameters:
	- formKey is a GUID identifier of form
	- formLanguage is locale of form. For example: en, sv, …*/
//Or receive a form from Optimizely Graph
var form =  formLoader.queryForm(optiGraphUrl, formKey, formLanguage);
/* Parameters:
	- optiGraphUrl is this endpoint url with your singlekey, "https://cg.optimizely.com/content/v2?auth={singlekey}"
	- formKey is a GUID identifier of form
	- formLanguage is locale of form. For example: en, sv, …*/
```
## 5, StepBuilder
### Description:
This is a helper class, that is used to arrange elements by step. Once run buildForm() function, the properties steps of FormContainer will be an array of Step  that contains all elements in step.
### Method:
* buildForm - Function to arrange elements by step, return a form with property steps is updated

### Usage:
```js
//init
var stepBuilder = new StepBuilder(formContainer);
/* formContainer parameter is a form that was received from API.*/
//get form that arranged elements by step
var form = stepBuilder.buildForm();
```
## 6, FormStorage
### Description:
This is a helper class, that is used to set/get/remove an array of FormSubmission from sessionStorage of Browser.
### Method:
* saveFormDataToStorage - Function to save form data submission into storage
* loadFormDataFromStorage - Function to load form data submission from storage
* removeFormDataInStorage - Function to remove form data submission from storage

### Usage:
```js
//init
var formStorage = new FormStorage(formContainer);
//save data to storage
formStorage.saveFormDataToStorage(formSubmissions);
//load data from storage
var formSubmissions = formStorage.loadFormDataFromStorage();
//remove data from storage
formStorage.removeFormDataInStorage();
```
## 7, FormSubmitter
### Description:
This is an API client service class. This is used to post a collection of FormData to Headless Form API
### Method:
* doSubmit - Function to submit form data submission to API, return a Promise resolve with an object FormSubmitResult, or reject with an object ProblemDetail
* doValidate - Function to validate all form data submissions, return the list of validation results

### Usage:
```js
//init
var formSubmitter = new FormSubmitter(formContainer, baseUrl);
//validate data before submit
var validationResult = formSubmitter.doValidate(formSubmissions);
//submit form to API
var formSubmitModel = {
formKey: formContainer.key,
locale: formContainer.locale,
isFinalized: true,
partialSubmissionKey: “partialSubmissionKey”,
hostedPageUrl: “/”,
submissionData: formSubmissions,
accessToken: “accessToken”,
currentStep: 0
};
formSubmitter.doSubmit(formSubmitModel).then((result)=>{
//logic to handle result
}).catch((error)=>{
//logic to handle exception
});
```
## 8, FormValidator
### Description:
This class is used to validate input value of form element by validators that are defined in metadata of form element. These are basic validators: RequiredValidator, EmailValidator, RegularExpressionValidator, … The main function validate() will return True/False that means the input value is valid or not.
### Method:
* validateRequired - Function to validate required element
* validateRegex - Function to validate element with regex pattern
* validateFileExtension - Function to validate file extension of file input
* validateFileSize - Function to validate file size of file input
* validateNumeric - Function to validate numeric element
* validate - Main function to validate input value of element that combines all above functions in switch scope, return the list of validation result

### Usage:
```js
//init
var formValidator = new FormValidator(formElement);
//validate input value
var result = formValidator.validate(value);
```
## 9, StepDependCondition
### Description:
This is a helper class, it is used to find next / previous step, if step depend on form element value, the class will help to check if step is satisfied the depend conditions. And if it is satisfied, the step index will be return as a result, otherwise find another one.
### Method:
* isSatisfied - Check if step is satisfying the depend condition
* findNextStep - Rescusive finding next step to display in form.
* findPreviousStep - Find previous step to display in form.
* isStepValidToDisplay - Whether step index is valid to display
* getInactiveStepsIndex - Get an array of step index that are inactive by depend conditions

### Usage:
```js
//init
var stepDependCondition = new StepDependCondition(dependencyInactiveElements);
/* The parameter dependencyInactiveElements is an array of form element keys that are inactive, since they are not satisfying the depend conditions. This parameter will need to check satisfy the depend conditions for step.*/
//find next step index
var nextStepIndex = stepDependCondition.findNextStep(currentStepIndex);
//find previous step index
var previousStepIndex = stepDependCondition.findPreviousStep(currentStepIndex);
```
## 10, StepHelper
### Description:
Class for step function helpers
### Method:
* isAllStepsAreNotLinked - Verify this Form has all steps not attached to any page.
* isMalFormSteps - Check whether a Form has steps each attached to a page.
* getCurrentStepIndex - Get current step index depend on current page url
* isInCurrentStep - Check whether element is in step
* getFirstInvalidElement - Get the first elementKey in the list element that are invalid value
* isNeedCheckDependCondition - Check whether a step is needed to check depend condition

### Usage:
```js
//init
var stepHelper = new StepHelper(formContainer);
//get current step index
var stepIndex = stepHelper. getCurrentStepIndex(currentPageUrl);
```
## 11, Other util functions
* getDefaultValue - Get a default value of element. The value can be predefinedValue, the first value of autofill data, or values of items are checked.
* initFormState - Function to initialize FormState object base on FormContainer

## 12, List of Models
| Name                         | Description             |
| -----------------------------| ------------------------|
|Element base types|
|FormElementBase	|Base class for all elements of Forms|
|ValidatableElementBase	|Base class for elements can be applied with the validator|
|DataElementBlockBase	|These type of elements supports validating, field-mapping to other system.|
|InputElementBase	|Base class for all of input elements.|
|SelectionBase	|Base class for selection elements such as radios, checkboxes, dropdown, listbox.|
|ButtonBase	|Base for all button type elements|
|HiddenElementBase	|Base class for all hidden form elements.|
|Element types|
|Textbox	|Allows users to input and display a single line of text|
|Textarea	|Allows users to input and display multiple lines of text within a defined area.|
|SubmitButton	|Allow user to submit the form|
|Selection	|This element can be rendered as Combobox or Listbox, base on SelectionBase's allowMultiSelect property|
|ResetButton	|Note that reset button must be in a "form tag" for being functional|
|Range	|Allows users to select an integer value within a specified range|
|PredefinedHidden	|Hidden with predefined value|
|ParagraphText	|Rich text (with placeholder)|
|Number	|Only allows users to input numeric values|
|ImageChoice	|Allow users to select from a set of images|
|FormStep	|Indicate a form step has ended|
|FileUpload	|Allow user to select file(s) to be included as part of a form submission|
|Choice	|This element can be rendered as Radio or Checkbox, base on SelectionBase's allowMultiSelect property|
|Url	|Allows users to input and display a url|
|VisitorDataHidden	|Collecting visitor data (ip, geo, browser ...) using a hidden input|
|Condition type|
|Condition	|Determines whether the element should be displayed or hidden based on a given condition|
|ConditionProperties	|Block that will be displayed or hidden based on a given condition|
|Enum types|
|ConditionCombinationType	|How to combine result of all condition satisfy|
|ConditionFunctionType	|enum represent a dependent condition Operator (in the Rule to evaluate depend value).|
|FormConstants	|The list of constants is the keyword used for cached values|
|SatisfiedActionType	|The action when condition is satisfied|
|SubmitButtonType	|Enum represent type name of step navigation|
|ValidatorType	|The list of validator type|
|State types|
|FormState	|Represent type of object that is form context|
|FormSubmission	|Represent type of object that is form submission|
|FormValidationResult	|Represent type of object that is form validation result|
|ElementValidationResult	|Represent type of object that is element validation result|
|Other types|
|FormContainer	|Represent the Form and will be rendered as a hidden container|
|IdentityInfo	|Represent type of object that is identity information|
|ProblemDetail	|Represent type of API exception|
