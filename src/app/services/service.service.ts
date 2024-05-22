import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class userService {
  returnDeviceList: any;
  returnMusicList: any;

  constructor(
    private http: HttpClient,

  ) { }

  getBaseUrl(serviceName: String) {
    let url = environment.apiUrl + serviceName;
    return url;
  }

// endpoint for store data
  public postMethod(url, data): Observable<any> {
    const serviceUrl: string = this.getBaseUrl(url);
    console.log("url",serviceUrl);
    console.log("data",data);
    return this.http.post(serviceUrl, data);
  }

// endpoint for get data
  public getMethod(url): Observable<any> {
    const serviceUrl: string = this.getBaseUrl(url);
    console.log("url",serviceUrl);
    return this.http.get(serviceUrl);
  }

// endpoint for update data
  public putMethod(url, data): Observable<any> {
    const serviceUrl: string = this.getBaseUrl(url);
    console.log("url",serviceUrl);
    console.log("data",data);
    return this.http.put(serviceUrl, data);
  }

// endpoint for delete data
  public deleteMethod(url): Observable<any> {
    const serviceUrl: string = this.getBaseUrl(url);
    console.log("url",serviceUrl);
    return this.http.delete(serviceUrl);
  }

// endpoint for upload file
  public fileUpload(url, uploadData): Observable<HttpEvent<{}>> {   
    let serviceUrl: string = this.getBaseUrl(url);
    console.log("url",serviceUrl);
    console.log("data",uploadData);
    return this.http.post(serviceUrl, uploadData, {
      observe: 'events',
    });
  }
}
