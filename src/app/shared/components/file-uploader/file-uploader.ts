import {Component, Output, EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

export class ValidFile  {
  selectedFile: File;
  isHeavier: boolean;
  isChange: boolean;
  isNotPng: boolean;
  isWrongResolution: boolean;
  isEmpty: boolean = false;
  imgUrl: any;
}

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.html',
  styleUrls: ['./file-uploader.scss']
})

export class FileUploader {

  @ViewChild('toHide') hide: ElementRef;
  @Input() public form:FormGroup;
  @Output() correctFile = new EventEmitter<ValidFile>();
  updatedFile: ValidFile = new ValidFile();


  constructor() { }

   public onFileSelected($event: any) {
     this.updatedFile.selectedFile = $event.target.files[0];
     if (this.updatedFile.selectedFile) {
       this.updatedFile.isChange = true;
     }
     else if (!this.hide.nativeElement.value) {
       this.updatedFile.isEmpty = true;
     }
     this.updatedFile.isNotPng = (this.updatedFile.selectedFile.type != 'image/png');
     this.updatedFile.isHeavier = (this.updatedFile.selectedFile.size >= 1000000);
     const reader = new FileReader();
     reader.readAsDataURL(this.updatedFile.selectedFile)
     reader.onload = () => {
       const img = new Image();
       img.src = reader.result as string
       img.onload = () => {
         this.updatedFile.imgUrl = reader.result;
         this.updatedFile.isWrongResolution = img.height != 512 && img.width != 512;
         this.correctFile.emit(this.updatedFile);
       }
     }
  }
}