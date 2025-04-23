import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-pdf-viewer-modal',
  imports: [
    MatIcon,
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './pdf-viewer-modal.component.html',
  standalone: true,
  styleUrl: './pdf-viewer-modal.component.css'
})
export class PdfViewerModalComponent implements OnInit{

  pdfSrc: any;

  constructor(
    public dialogRef: MatDialogRef<PdfViewerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      pdfBlob: Blob,
      filename: string
    }
  ) {}

  ngOnInit(): void {
    // Créer une URL de l'objet blob pour l'afficher dans l'iframe
    const blobUrl = URL.createObjectURL(this.data.pdfBlob);
    // Utiliser DomSanitizer pour permettre l'affichage de l'URL dans l'iframe
    this.pdfSrc = blobUrl;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  download(): void {
    const url = URL.createObjectURL(this.data.pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.data.filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
    // Libérer l'URL lorsque le composant est détruit
    if (this.pdfSrc) {
      URL.revokeObjectURL(this.pdfSrc);
    }
  }

}
