import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {zip} from "rxjs";
import {AuthApiService} from "../../../api-services/auth-http.service";
import Labels from "../../../shared/models/labels/labels.constant";
import {Toaster} from "ngx-toast-notifications";
import {Route} from "../../../shared/models/enums/route.enum";

@Component({
  selector: 'app-confirm-token',
  templateUrl: './confirm-token.component.html',
  styleUrls: ['./confirm-token.component.scss']
})
export class ConfirmTokenComponent implements OnInit {

  token: string
  takePassword: boolean

  constructor(
    private activatedRoute: ActivatedRoute,
    private authApiService: AuthApiService,
    private toaster: Toaster,
    private router: Router,
  ) {
    const observable = zip(
      this.activatedRoute.params, this.activatedRoute.queryParams
    )

   observable.subscribe( obj =>{
     this.token = obj[0].token
     const queryParams = obj[1]
     this.takePassword = Object.keys(queryParams).length !== 0
   });
  }

  ngOnInit(): void {
    if (this.takePassword) return
    this.authApiService.confirmSignUp(this.token).subscribe( res => {
      this.toaster.open({
        text: Labels.register.success,
        caption: Labels.caption.success,
        duration: 4000,
        type: 'success'
      });

      this.router.navigate([Route.LOGIN])
    }, err => {
      const text = err.status === 417 ? Labels.register.tokenAlreadyUsed : Labels.register.wrongTokenFormat
      this.toaster.open({
        text,
        caption: Labels.caption.error,
        duration: 4000,
        type: 'danger'
      });
    })
  }

}
