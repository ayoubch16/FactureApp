import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root',
})
export class HttpService {
  base_url = 'http://localhost:8080/api';

  constructor(
    private httpClient: HttpClient,

  ) {
  }

  get(endpoint: string, options: HttpRequestOptions = {}): void {
    return this.baseRequest(Method.get, endpoint, null, options)
  }

  post(endpoint: string, data: any, options: HttpRequestOptions = {}): void {
    return this.baseRequest(Method.post, endpoint, data, options)
  }

  put(endpoint: string, data: any, options: HttpRequestOptions = {}): void {
    return this.baseRequest(Method.put, endpoint, data, options)
  }

  patch(endpoint: string, data: any, options: HttpRequestOptions = {}): void {
    return this.baseRequest(Method.patch, endpoint, data, options)
  }

  delete(endpoint: string, options: HttpRequestOptions = {}): void {
    return this.baseRequest(Method.delete, endpoint, null, options)
  }


  private baseRequest(method: Method, endpoint: string, data: any, options: HttpRequestOptions){

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
