import {Component, OnInit} from '@angular/core';
import {UserSearchModel} from "../../../shared/models/api/send/user-search.model";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {FormGroup} from "@angular/forms";
import {UserStatus} from "../../../shared/models/enums/user-status.enum";
import {ProfileModel} from "../../../shared/models/api/receive/profile.model";
import {StaffSearchHttpService} from "../../../api-services/staff-search-http.service";
import {EagerContentPage} from "../../../shared/models/api/receive/cotent-page.model";
import {PageEvent} from "@angular/material/paginator";
import {ProdMgrService} from "../services/prod-mgr.service";
import {Title} from "@angular/platform-browser";
import {ToasterCustomService} from "../../../services/toaster-custom.service";

@Component({
  selector: 'app-staff-list-page',
  templateUrl: './staff-list-page.component.html',
  styleUrls: ['./staff-list-page.component.scss']
})
export class StaffListPageComponent implements OnInit {
  private searchCriteria ?: UserSearchModel;
  formControlsGroup: FormGroup;
  contentPage ?: EagerContentPage<ProfileModel>;
  selectedPage: number;

  constructor(
    private mgrFormService: ProdMgrService,
    private staffSearch: StaffSearchHttpService,
    private titleService: Title, private toasterService : ToasterCustomService
  ) {
    this.titleService.setTitle("Staff")
    this.formControlsGroup = mgrFormService.staffSearchForm();
    this.selectedPage = 0;
  }

  ngOnInit(): void {
    this.setSearchCriteria(new FormGroup({}));
  }

  setSearchCriteria(staffFilterForm: FormGroup): void {
    let searchCriteria: UserSearchModel = {};

    if (staffFilterForm.get('firstName')?.value) {
      if (staffFilterForm.get('firstName')?.value.length < 2) {
        this.toasterService.errorNotification("First name must be at least 2 characters long.");
        return;
      }
      searchCriteria.firstNameSeq = staffFilterForm.get('firstName')?.value
    }
    if (staffFilterForm.get('lastName')?.value) {
      if (staffFilterForm.get('lastName')?.value.length < 2) {
        this.toasterService.errorNotification("Last name must be at least 2 characters long.");
        return;
      }
      searchCriteria.lastNameSeq = staffFilterForm.get('lastName')?.value
    }

    let targetRoles = [];
    let targetStatuses = [];

    if (staffFilterForm.get('isRoleCourier')?.value)
      targetRoles.push(UserRole.ROLE_COURIER);
    if (staffFilterForm.get('isRolePM')?.value)
      targetRoles.push(UserRole.ROLE_PRODUCT_MGR);
    if (targetRoles.length) searchCriteria.targetRoles = targetRoles;

    if (staffFilterForm.get('isStatusActive')?.value)
      targetStatuses.push(UserStatus.ACTIVE);
    if (staffFilterForm.get('isStatusInactive')?.value)
      targetStatuses.push(UserStatus.INACTIVE);
    if (staffFilterForm.get('isStatusTerminated')?.value)
      targetStatuses.push(UserStatus.TERMINATED);
    if (staffFilterForm.get('isStatusUnconfirmed')?.value)
      targetStatuses.push(UserStatus.UNCONFIRMED);
    if (targetStatuses.length) searchCriteria.targetStatuses = targetStatuses;

    this.staffSearch.findStaff(searchCriteria, this.selectedPage)
      .subscribe(response => {
        this.contentPage = response;
        this.searchCriteria = searchCriteria;
        this.selectedPage = 0;
      });
  }

  handlePageChange($event: PageEvent): void {
    if (!this.searchCriteria) return;
    this.staffSearch.findStaff(this.searchCriteria, $event.pageIndex)
      .subscribe(response => {
        this.contentPage = response;
        this.selectedPage = $event.pageIndex;
      });
  }
}
