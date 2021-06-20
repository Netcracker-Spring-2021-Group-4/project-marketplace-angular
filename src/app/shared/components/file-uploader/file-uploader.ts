import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

export class ValidFile  {
  selectedFile: File;
  isHeavier: boolean;
  isChange: boolean;
  isNotPng: boolean;
  isWrongResolution: boolean;
}

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.html',
  styleUrls: ['./file-uploader.scss']
})

export class FileUploader {

  @Input() public form:FormGroup
  @Output() correctFile = new EventEmitter<ValidFile>()
  updatedFile: ValidFile = new ValidFile()

  constructor() { }

   public onFileSelected($event: any) {
     this.updatedFile.selectedFile = $event.target.files[0];
     if (this.updatedFile.selectedFile) {
       this.updatedFile.isChange = true;
     }
     this.updatedFile.isNotPng = (this.updatedFile.selectedFile.type != 'image/png');
     this.updatedFile.isHeavier = (this.updatedFile.selectedFile.size >= 1000000);

     const reader = new FileReader();
     reader.readAsDataURL(this.updatedFile.selectedFile)
     reader.onload = () => {
       const img = new Image();
       img.src = reader.result as string
       img.onload = () => {
         this.updatedFile.isWrongResolution = img.height != 512 && img.width != 512;
         this.correctFile.emit(this.updatedFile);
       }
     }
  }

}
