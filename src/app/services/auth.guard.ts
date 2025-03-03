import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NotifyService } from './notify.service';

export const authGuard: CanActivateFn = (route, state) => {

    // Take token from storage: : 
    const token = localStorage.getItem("token");

    // If there is a token: 
    if(token) return true;

    // DI: 
    const notifyService = inject(NotifyService);
    const router = inject(Router);

    // Error: 
    notifyService.error("You are not logged-in.");
    router.navigateByUrl("/login");
    return false;
};
