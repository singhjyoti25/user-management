import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

declare const getTimeZone:any;

@Injectable(
    {providedIn: 'root'}
)

export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        /* 
        * Common header data pass
        */

        req = req.clone({
            setHeaders:
                { 
                    'username': this.authService.getUserName() ? this.authService.getUserName() : 'test',
                    'Access-Control-Allow-Origin': '*',
                    // Request methods you wish to allow
                    'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                }
            }
        );
        
        /*
        * Check method and appned header according to conditions
        */
        // if(req.method=='PUT' || req.method=='PATCH'){
        //     req = req.clone({ setHeaders:{ 'Content-Type': 'application/x-www-form-urlencoded' } }); 
        // }

        return next.handle(req);
    }
}