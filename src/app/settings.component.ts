import { Component, OnInit } from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import { TextField } from "tns-core-modules/ui/text-field";
import {ActivatedRoute} from "@angular/router";
import { setString, getString } from "tns-core-modules/application-settings";


@Component({
    selector: "settings",
    templateUrl: "./settings.component.html"
})

export class SettingsComponent implements OnInit {
    public username : any;

    ngOnInit() {
		this.username = getString('username', "Enter name");
    }
    
    public constructor(private route: ActivatedRoute) {
        this.route.params.subscribe((params) => {
            //this.name = params["name"];
        });
    }

    onReturnPress(args: { object: TextField; }) {
        // returnPress event will be triggered when user submits a value
        let nameField = <TextField>args.object;
        // Gets or sets the input text.

        setString("username", nameField.text);
        console.log("Changed user to: " + getString("username"));
    
        setTimeout(() => {
            nameField.dismissSoftInput(); // Hides the soft input method, ususally a soft keyboard.
        }, 100);
    }

    onFocus(args: { object: TextField; }) {
        // focus event will be triggered when the users enters the TextField
        let nameField = <TextField>args.object;
    }

    onBlur(args: { object: TextField; }) {
        // blur event will be triggered when the user leaves the TextField
        let nameField = <TextField>args.object;
    }

}