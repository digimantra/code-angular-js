import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('access_token');

        if (token) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && event.body.error) {
                    const errorMessage = event.body.message;
                    if (errorMessage === 'No record found') {
                        console.log('Interceptor:', errorMessage);
                    } else {
                        // Handle other error messages if needed
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('HTTP Error:', error);
                if (error.status === 401) {
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}
