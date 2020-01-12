import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class MyHttpPutService {
    private serverUrl = "https://t7bes9gh71.execute-api.eu-central-1.amazonaws.com/dev/position";

    constructor(private http: HttpClient) { }

    putData(data: any) {
        let headers = this.createRequestHeader();
        return this.http.put(this.serverUrl, data , { headers: headers });
    }

    private createRequestHeader() {
        // set headers here e.g.
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
         });

        return headers;
    }
}