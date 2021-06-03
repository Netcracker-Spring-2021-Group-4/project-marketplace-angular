import { Component, OnInit } from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  handlePageChange($event: PageEvent): void {
    console.log("event")
  //   if (!this.searchCriteria) return;
  //   this.staffSearch.findStaff(this.searchCriteria, $event.pageIndex)
  //     .subscribe(response => {
  //       this.contentPage = response;
  //       this.selectedPage = $event.pageIndex;
  //     });
   }
}
