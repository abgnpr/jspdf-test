import { Component, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-jspdf-playground',
  templateUrl: './jspdf-playground.component.html',
  styleUrls: ['./jspdf-playground.component.css'],
})
export class JspdfPlaygroundComponent implements OnInit {

  pdfSrc: string

  constructor() {
    this.pdfSrc = this.generateReport()
  }

  ngOnInit(): void { }


  generateReport(): string {

    // do not touch
    const doc = new jsPDF();
    function newImg(src: string): HTMLImageElement {
      const img = new Image();
      img.src = src;
      return img;
    }

    // write code below -----------------------

    for (let i = 1; i <= 5; i++) {
      doc.text("Hello world!", 10, 10 * i);
    }

    doc.addImage(
      newImg('/assets/kccb-logo.png'),
      'PNG', 0, 0, 100, 100
    );
    
    doc.addImage(
      newImg('/assets/kccb-logo.png'),
      'PNG', 0, 0, 100, 100
    );

    // ---------------------------------------
    // do no touch
    return doc.output('dataurlstring');

  }

}
