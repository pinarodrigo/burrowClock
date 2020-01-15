import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class MyHttpService {
    private serverUrl = "https://t7bes9gh71.execute-api.eu-central-1.amazonaws.com/dev/position";

    constructor(private http: HttpClient) { }

    postData(data: any) {
        let options = this.createRequestOptions();
        return this.http.put(this.serverUrl, data, { headers: options });
    }

    putData(data: any) {
        let options = this.createRequestOptions();
        return this.http.post(this.serverUrl, data, { headers: options });
    }

    private createRequestOptions() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        return headers;
    }
}