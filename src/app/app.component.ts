import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {UserRole} from "./shared/models/enums/role.enum";
import {CheckoutService} from "./services/checkout.service";
import {PublicApiService} from "./api-services/public-http.service";
import {ToasterCustomService} from "./services/toaster-custom.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'projectMarketplaceAngular';
  secretMessage = environment.secretMessage;

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    console.log("Processing beforeunload...");
    if(this.checkoutService.isReserved) {
      this.publicApiService
        .cancelReservation(this.checkoutService.cart!.content)
        .subscribe(_ => this.toaster.successfulNotification("The reservation was removed"));
    }
  }

  constructor(
    private publicApiService: PublicApiService,
    private checkoutService: CheckoutService,
    private toaster: ToasterCustomService
    ) {
  }

  ngOnInit() {
  }

  get roleEnum(): typeof UserRole {
    return UserRole;
  }
}
