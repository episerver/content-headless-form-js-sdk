/**
 * Class to help save data to Storage. Default is sessionStorage.
 */
export class FormCache{
    readonly _storage: Storage

    constructor(storage?: Storage){
        this._storage = storage ?? window.sessionStorage;
    }

    get<T>(key: string): T | undefined{
        let data = this._storage[key];
        if (!data) {
            return undefined;
        }

        if(typeof data === "object"){
            data = JSON.parse(data);
        }

        if (!data) {
            return undefined;
        }

        return data as T;
    }

    set<T>(key: string, data: T): T{
        try { // safari private mode does not allow local storage
            this._storage.setItem(key, JSON.stringify(data));
        } catch (e: any) {
            console.log("Local Storage not supported: " + e.message);
        }
        return data;
    }

    remove(key: string): void{
        this._storage.removeItem(key);
    }
}