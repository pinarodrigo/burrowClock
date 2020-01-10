import { Component, NgZone } from "@angular/core";
import * as Geolocation from "nativescript-geolocation";

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {

    public latitude: number;
    public longitude: number;
    private watchId: number;

    public constructor(private zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;
    }

    private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            Geolocation.enableLocationRequest().then(() => {
                Geolocation.getCurrentLocation({timeout: 10000}).then(location => {
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
        }, error => {
            console.error(error);
        });
    }

    public startWatchingLocation() {
        this.watchId = Geolocation.watchLocation(location => {
            if(location) {
                this.zone.run(() => {
                    this.latitude = location.latitude;
                    this.longitude = location.longitude;
                });
            }
        }, error => {
            console.dump(error);
        }, { updateDistance: 1, minimumUpdateTime: 1000 });
    }

    public stopWatchingLocation() {
        if(this.watchId) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

}