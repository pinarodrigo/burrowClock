import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { SettingsComponent } from "./settings.component";
import { LocateComponent } from "./locate.component";

const routes: Routes = [
    { path: "", redirectTo: "/locate", pathMatch: "full" },
    { path: "settings", component: SettingsComponent },
    { path: "locate", component: LocateComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})


export class AppRoutingModule { }
