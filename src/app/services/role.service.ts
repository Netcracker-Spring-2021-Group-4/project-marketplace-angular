import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {UserRole} from "../shared/models/enums/role.enum";
import {JwtTokenService} from "../auth/jwt-token.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private roleSource = new BehaviorSubject<UserRole>( UserRole.ROLE_NO_AUTH_CUSTOMER)
  currentRole = this. roleSource.asObservable();

  constructor(
    private jwtTokenService: JwtTokenService,
  ){
    if(!this.jwtTokenService.isExpired) {
      this.changeRole(this.jwtTokenService.role)
    }
  }

  changeRole(role: UserRole) {
    this.roleSource.next(role)
  }

}
