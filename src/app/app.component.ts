import { Component, NgZone } from "@angular/core";
import * as Geolocation from "nativescript-geolocation";
import { MyHttpPostService } from "./http-post.service";
import { MyHttpPutService } from "./http-put.service";

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
    providers: [MyHttpPostService, MyHttpPutService]
})
export class AppComponent {

    public latitude: number;
    public longitude: number;
    private watchId: number;
    public message: string = "";
    public constructor(private burrowPostService: MyHttpPostService, private burrowPutService: MyHttpPutService, private zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;
    }

    private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            Geolocation.enableLocationRequest().then(() => {
                Geolocation.getCurrentLocation({ timeout: 10000 }).then(location => {
                    resolve(location);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    public updateLocation() {
        this.getDeviceLocation().then(result => {
            this.latitude = result.latitude;
            this.longitude = result.longitude;
            this.makePostRequest(result.latitude, result.longitude);

            console.log("Device Location: " + this.latitude + ", " + this.longitude);
        }, error => {
            console.error(error);
        });
    }

    public startWatchingLocation() {
        this.watchId = Geolocation.watchLocation(location => {
            if (location) {
                this.zone.run(() => {
                    this.latitude = location.latitude;
                    this.longitude = location.longitude;
                });
                this.makePutRequest(location.latitude, location.longitude);
                console.log("Device Location updated: " + this.latitude + ", " + this.longitude);
            }
        }, error => {
            console.log(error);
        }, { updateDistance: 1, minimumUpdateTime: 1000, iosAllowsBackgroundLocationUpdates: true });
    }

    public stopWatchingLocation() {
        if (this.watchId) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    private makePostRequest(lat, lon) {
        this.burrowPostService
            .postData({ name: "regina", latitude: "" + lat, longitude: "" + lon })
            .subscribe(res => {
                this.message = "";
            });
    }

    private makePutRequest(lat, lon) {
        this.burrowPutService
            .putData({ name: "regina", latitude: "" + lat, longitude: "" + lon })
            .subscribe(res => {
                this.message = "";
            });
    }
}