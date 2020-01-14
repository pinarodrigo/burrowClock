import { Component, NgZone, AfterViewInit } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';
import * as Geolocation from "nativescript-geolocation";
import { MyHttpPostService } from "./http-post.service";
import { MyHttpPutService } from "./http-put.service";
import { getString } from "tns-core-modules/application-settings";
import { Router, Event, NavigationEnd} from '@angular/router';
import { Page, Observable, EventData } from "tns-core-modules/ui/page/page";
import { Label } from "tns-core-modules/ui/label";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";

@Component({
    selector: "my-app",
    templateUrl: "locate.component.html",
    providers: [MyHttpPostService, MyHttpPutService]
})
export class LocateComponent implements AfterViewInit{

    public latitude: number;
    public longitude: number;
    private watchId: number;
    public message: string = "";
    public username: string;

    public constructor(private page:Page, private burrowPostService: MyHttpPostService, private burrowPutService: MyHttpPutService, public nav: RouterExtensions, private router:Router, public zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;

        this.page.on(Page.navigatingToEvent, function(args: EventData){
            const page = <Page>args.object;
            const container = <StackLayout>page.getViewById("container");
            const vm = new Observable();
            const myLabel = <Label>page.getViewById("usernameLabel");
            myLabel.text = getString("username");
        })
    }
    ngAfterViewInit(): void {

    }

    ngOnInit() {
        let parent = this;
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

    public navigateTo(page) {
        this.nav.navigate([page], {
            animated: true
        });
    }
}