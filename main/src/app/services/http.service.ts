import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {buildQueryParams} from "../utils/string-utils";


@Injectable({
  providedIn: 'root',
})
export class HttpService {
  base_url = 'http://localhost:8080';

  constructor(
    private httpClient: HttpClient,

  ) {
  }

  get(endpoint: string): Observable<any> {
    return this.baseRequest(Method.get, endpoint, null)
  }

  // post(endpoint: string, data: any, options: HttpRequestOptions = {}): Observable<any> {
  //   return this.baseRequest(Method.post, endpoint, data, options)
  // }
  //
  // put(endpoint: string, data: any, options: HttpRequestOptions = {}): Observable<any> {
  //   return this.baseRequest(Method.put, endpoint, data, options)
  // }
  //
  // patch(endpoint: string, data: any, options: HttpRequestOptions = {}): Observable<any> {
  //   return this.baseRequest(Method.patch, endpoint, data, options)
  // }
  //
  // delete(endpoint: string, options: HttpRequestOptions = {}): Observable<any> {
  //   return this.baseRequest(Method.delete, endpoint, null, options)
  // }


  private baseRequest(method: Method, endpoint: string, data: any): Observable<any> {
    return this.httpClient.request(method, this.base_url + endpoint , {
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text' // Changez en 'text' et parsez manuellement
    }).pipe(
      map(response => {
        try {
          return typeof response === 'string' ? JSON.parse(response) : response;
        } catch (e) {
          return response; // ou throw une erreur selon votre besoin
        }
      })
    );
  }
}

enum Method {
  'get' = 'get', 'post' = 'post', 'put' = 'put', 'patch' = 'patch', 'delete' = 'delete'
}

export interface HttpRequestOptions {
  useToken?: boolean,
  showLoading?: boolean,
  showErrorAlert?: boolean,
  usePagination?: boolean,
  queryParameters?: object
}
