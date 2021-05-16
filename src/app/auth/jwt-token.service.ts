import {Injectable} from "@angular/core";
import jwtDecode, {JwtPayload} from "jwt-decode";
import {UserRole} from "../shared/models/enums/role.enum";

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  private static keyName = 'auth-token';

  constructor(
  ) {
  }

  saveToken(token: string) {
    const pureToken = token.substring(7, token.length)
    this.setToken(pureToken)
  }

  deleteToken() {
    this.removeToken()
  }

  get role(): UserRole {
    const roleString = this.payload?.authorities
      .map((a: any) => a.authority)
      .filter((s: string) => s.indexOf('ROLE_') !== -1)[0]

    return (<any>UserRole)[roleString]
  }

  get isExpired(): boolean {
    const exp = this.payload?.exp

    return exp ? ( Date.now() >= exp * 1000) : true;
  }

  get payload() : any | null {
    const token = JwtTokenService.getToken()
    return token ? JwtTokenService.decodeToken(token) : null;
  }

  private setToken(token: string) {
    sessionStorage.setItem(JwtTokenService.keyName, token)
  }

  static getToken() : string | null {
    return sessionStorage.getItem(JwtTokenService.keyName)
  }

  private removeToken() {
    sessionStorage.removeItem(JwtTokenService.keyName)
  }

  private static decodeToken(token: string) : JwtPayload | null {
    try{
      return jwtDecode<JwtPayload>(token);
    }
    catch(Error){
      console.log(Error)
      return null;
    }
  }

}
