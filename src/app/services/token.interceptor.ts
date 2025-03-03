import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

    // Take token from storage: : 
    const token = localStorage.getItem("token");

    // Add bearer token: 
    const clonedRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    // Continue to next interceptor: 
    return next(clonedRequest);
};
