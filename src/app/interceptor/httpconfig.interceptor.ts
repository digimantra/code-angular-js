import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HttpHeaders
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
      ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('access_token');
 
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', token) });
        }
        // request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });

        // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    if(event.body.error == true){
                        if(event.body.message == 'No record found'){
                            console.log('interceptors', event.body.message);
                        }else{
                            // alert(event.body.message);
                        }
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log('error--->>>', error);          
                // alert(error.error.message);
                if(error.status == 401){
                    this.router.navigate(['/login']);
                }
                return throwError(error);
            }));
    }
}
