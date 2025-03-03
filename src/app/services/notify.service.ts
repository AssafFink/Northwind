import { Injectable } from '@angular/core';
import { Notyf } from 'notyf'; // npm i notyf

@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    private notyf = new Notyf({
        duration: 3000,
        position: { x: "center", y: "top" },
        dismissible: true,
        ripple: true
    });

    public success(message: string): void {
        this.notyf.success(message);
    }

    public error(error: any): void {
        const message = this.extractError(error);
        this.notyf.error(message);
    }

    private extractError(error: any) : string {

        if(typeof error === "string") return error;

        if(typeof error.error === "string") return error.error;

        if(typeof error.message === "string") return error.message;

        return "Some error, please try again.";
    }

}
