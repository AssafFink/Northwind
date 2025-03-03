import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function extraSpacing(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors => {

        // If there is no value - all is good: 
        if (!control.value) return null; // No error.

        // If there is an extra spacing: 
        if (control.value.includes("  ")) return { extraSpacing: "Extra spacing is forbidden." }

        // All is good: 
        return null;
    };
}
