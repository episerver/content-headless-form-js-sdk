import { FormAuthenticateConfig } from "./formAuthenticateConfig";

/**
 * Class to authenticate Headless Form API
 */
export class FormAuthenticate {
    readonly _formAuthConfig: FormAuthenticateConfig
    constructor(formAuthConfig: FormAuthenticateConfig){
        this._formAuthConfig = formAuthConfig;
    }

    /**
     * Function to login
     * @param username 
     * @param password 
     * @returns Access token string
     */
    async login(username: string, password: string): Promise<string> {
        let payload: Record<string,string> = {
            username,
            password,
            "grant_type": this._formAuthConfig.grantType,
            "client_id": this._formAuthConfig.clientId
        }

        let requestInit: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: this._convertObjectToFormBody(payload)
        }
        return new Promise<string>((resolve, reject) => {
            fetch(this._formAuthConfig.authBaseUrl, requestInit)
                .then(async (response: Response) => {
                    if(response.ok){
                        let json = await response.json();
                        resolve(json["access_token"]);
                    }
                    else {
                        reject(response);
                    }
                })
                .catch((error: any) => {
                    reject(error);
                });
        })
    }

    /**
     * Private function to convert object to x-www-form-urlencoded
     * @param payload 
     * @returns 
     */
    private _convertObjectToFormBody(payload: Record<string,string>): string {
        let formBody = [];
        for (var property in payload) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(payload[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        return formBody.join("&");
    }
}