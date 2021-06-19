import {Component, Output, EventEmitter, Input} from '@angular/core';

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
  @Output() correctFile = new EventEmitter<ValidFile>()
  updatedFile: ValidFile = new ValidFile()

  constructor() { }

   public onFileSelected($event: any) {
     const global = this;
     this.updatedFile.selectedFile = $event.target.files[0];
     if (this.updatedFile.selectedFile) {
       this.updatedFile.isChange = true;
     }
     this.updatedFile.isNotPng = (this.updatedFile.selectedFile.type != 'image/png');
     this.updatedFile.isHeavier = (this.updatedFile.selectedFile.size >= 1000000);
     const reader = new FileReader();
     reader.readAsDataURL(this.updatedFile.selectedFile)
     reader.onload = function ($event): any {
       const img = new Image();
       // @ts-ignore
       img.src = $event.target.result
       img.onload = function () {
         global.updatedFile.isWrongResolution = img.height != 512 && img.width != 512;
       }
     }
    this.correctFile.emit(this.updatedFile);
  }

}
