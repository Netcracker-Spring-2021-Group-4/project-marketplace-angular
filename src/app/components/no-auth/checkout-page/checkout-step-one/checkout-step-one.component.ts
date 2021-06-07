import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, Input, Output, ViewChild, EventEmitter, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../../shared/models/labels/validation.message";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-checkout-step-one',
  templateUrl: './checkout-step-one.component.html',
  styleUrls: ['./checkout-step-one.component.scss']
})
export class CheckoutStepOneComponent implements OnInit{

  @ViewChild('commentInput') commentInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  @Input()
  firstStepForm: FormGroup
  @Output()
  cancelReservationEvent = new EventEmitter<void>()
  @Output()
  nextStepEvent = new EventEmitter<void>()

  comment_ctrl = new FormControl()
  separatorKeysCodes: number[] = [ENTER, COMMA];
  commentChoicesList = ['Do not disturb', 'Please call before arriving',
    'Morning delivery', 'Evening delivery', 'No Preferences']
  commentChoices = ['No preferences'];

  phoneNumberErrorMessage = ValidationMessages.phoneNumber
  flatErrorMessage = ValidationMessages.flat

  ngOnInit() {
    this.commentField().setValue(this.commentChoices.join('\n'))
  }

  addComment(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    const index = this.commentChoices.indexOf(value);
    if (value && index < 0) {
      this.commentChoices.push(value);
    }

    event.chipInput!.clear();
    this.comment_ctrl.setValue(null);
    this.commentField().setValue(this.commentChoices.join('\n'))
  }

  removeComment(comment: string): void {
    const index = this.commentChoices.indexOf(comment);

    if (index >= 0) {
      this.commentChoices.splice(index, 1);
      this.commentField().setValue(this.commentChoices.join('\n'))
    }
  }

  selectedComment(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue
    const index = this.commentChoices.indexOf(value);
    if(index < 0 ) {
      this.commentChoices.push(value);
      this.commentInput.nativeElement.value = '';
      this.comment_ctrl.setValue(null);
      this.commentField().setValue(this.commentChoices.join('\n'))
    }
  }

  private commentField(): AbstractControl {
    return this.firstStepForm.get('comment')!;
  }

  addressNamingErrorMessage(isBuilding = false) : string {
    return `The field can contain at most ${isBuilding? 8 : 64} characters`
  }

  cancelReservation() {
    this.cancelReservationEvent.emit()
  }

  nextPage() {
    this.nextStepEvent.emit();
  }
}
