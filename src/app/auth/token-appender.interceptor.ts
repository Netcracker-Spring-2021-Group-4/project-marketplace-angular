import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {JwtTokenService} from "./jwt-token.service";

@Injectable()
export class TokenAppenderInterceptor implements HttpInterceptor {

  public intercept(request: HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>> {

    const token = JwtTokenService.getToken()
    if (!token) return next.handle(request);

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(request);
  }
}
