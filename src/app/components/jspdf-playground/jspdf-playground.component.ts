import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { applyPlugin } from 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import * as wrap from 'word-wrap';
import { sampleStatment } from '../../../assets/sample-statement';

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-jspdf-playground',
  templateUrl: './jspdf-playground.component.html',
  styleUrls: ['./jspdf-playground.component.css'],
})
export class JspdfPlaygroundComponent implements OnInit {

  pdfSrc: string

  constructor() {
    this.pdfSrc = this.generateReport();
  }

  ngOnInit(): void { }

  generateReport(): string {

    // Standard fonts
    // const standardFonts = [
    //   ['Helvetica', "helvetica", "normal", 'WinAnsiEncoding'],
    //   ['Helvetica-Bold', "helvetica", "bold", 'WinAnsiEncoding'],
    //   ['Helvetica-Oblique', "helvetica", "italic", 'WinAnsiEncoding'],
    //   ['Helvetica-BoldOblique', "helvetica", "bolditalic", 'WinAnsiEncoding'],
    //   ['Courier', "courier", "normal", 'WinAnsiEncoding'],
    //   ['Courier-Bold', "courier", "bold", 'WinAnsiEncoding'],
    //   ['Courier-Oblique', "courier", "italic", 'WinAnsiEncoding'],
    //   ['Courier-BoldOblique', "courier", "bolditalic", 'WinAnsiEncoding'],
    //   ['Times-Roman', "times", "normal", 'WinAnsiEncoding'],
    //   ['Times-Bold', "times", "bold", 'WinAnsiEncoding'],
    //   ['Times-Italic', "times", "italic", 'WinAnsiEncoding'],
    //   ['Times-BoldItalic', "times", "bolditalic", 'WinAnsiEncoding'],
    //   ['ZapfDingbats', "zapfdingbats", "normal", null],
    //   ['Symbol', "symbol", "normal", null]
    // ];

    // initialization
    applyPlugin(jsPDF);
    const doc = new jsPDF() as jsPDFWithPlugin;

    // functions
    function newImg(src: string): HTMLImageElement {
      const img = new Image();
      img.src = src;
      return img;
    }
    function printKeyValue(x: number, y: number, key: string, value: string): number {
      doc.setFont('times', 'normal');
      doc.text(key + '  :  ', x, y);
      const offset = doc.getCharWidthsArray(key + '  :  ').reduce((a, b) => a + b, 0);
      x += offset * 3;
      doc.setFont('courier', 'bold');
      value = wrap(value, { width: 32 });
      doc.text(value, x, y);
      doc.setFont('helvetica', 'normal');
      return value.split('\n').length;
    }

    // write code below -----------------------

    // watermark
    // doc.addImage(newImg('/assets/kccb-bw-logo.png'), 'PNG', 5, 50, 200, 200);

    // head
    doc.addImage(newImg('/assets/kccb-logo-bkup.png'), 'PNG', 5, 5, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text("THE KANGRA CENTRAL CO-OPERATIVE BANK LTD.", 35, 17.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text("e-Statement Service", 173, 30);
    doc.setDrawColor('#cccccc')
    doc.line(170, 29, 5, 29);

    // left details column
    const leftColumnDetails = {
      "Account Name   ": sampleStatment.NAME,
      "Account Number": sampleStatment.ACCT_NO,
      "CIF Number       ": sampleStatment.CUST_NO,
      "Address              ": sampleStatment.CUST_ADDR,
    };
    doc.setFontSize(10);
    let y = 40, vSpace = 6;
    for (let [key, value] of Object.entries(leftColumnDetails)) {
      const linesUsed = printKeyValue(10, y, key, value);
      if (linesUsed === 1)
        y += vSpace;
      else
        y += vSpace + (linesUsed - 1) * (vSpace - 2);
    }

    // right details column
    const rightColumnDetails = {
      "Branch Name       ": sampleStatment.BRANCH_NAME,
      "Branch Code        ": sampleStatment.BRANCH_NO,
      "Branch Address   ": sampleStatment.BANK_ADDR,
      "Branch E-mail ID": sampleStatment.EMAIL_ID, // not coming from db
      "IFSC Code           ": "KACE0000035", // not coming from db
      "MICR Code         ": sampleStatment.MICR_CODE,
      "Product                ": "SAVING NON-CHQ MEMBER",
    };
    let totalLinesUsed = 0;
    y = 40;
    for (let [key, value] of Object.entries(rightColumnDetails)) {
      const linesUsed = printKeyValue(106, y, key, value);
      if (linesUsed === 1)
        y += vSpace;
      else
        y += vSpace + (linesUsed - 1) * (vSpace - 2);
      totalLinesUsed += linesUsed;
    }

    // warning
    y += totalLinesUsed;
    doc.setFontSize(10);
    doc.rect(10, y, 185, 17);
    y += 2.3;
    doc.addImage(newImg('assets/exclamation-mark.png'), 'PNG', 13, y, 12, 12);
    y += 3.3;
    doc.text(
      wrap(
        'NEVER SHARE your Card number, CVV, PIN, OTP, Internet Banking User ID, Password or URB with anyone even if the caller claims to be a bank employee. Sharing these details can lead to unauthorised access to your account.',
        { width: 95 }
      ),
      27, y
    );

    y += 22;
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text("Account statement from", 10, y);
    doc.setFont('courier', 'bold');
    doc.text("25/10/2021", 49, y);
    doc.setFont('times', 'normal');
    doc.text("to", 73.5, y);
    doc.setFont('courier', 'bold');
    doc.text("05/11/2021", 78, y);

    // table
    const transactions = sampleStatment.transactions.map(transaction => {
      transaction.STMT_DATE = transaction.STMT_DATE.substring(0, 10);
      if (!transaction.DESCRIPTION) transaction.DESCRIPTION = '-';
      return transaction;
    })
    console.log(transactions);
    y += 7;
    doc.autoTable(
      {
        styles: {
          font: 'courier',
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        columns: [
          { header: 'Date', dataKey: 'STMT_DATE' },
          { header: 'Mode', dataKey: 'TRANSACTION_MODE' },
          { header: 'Particulars', dataKey: 'DESCRIPTION' },
          { header: 'Withdrawls', dataKey: 'DR_AMT' },
          { header: 'Deposits', dataKey: 'CR_AMT' },
          { header: 'Balance', dataKey: 'BALANCE' }
        ],
        body: transactions,
        headStyles: {
          halign: 'center'
        },
        columnStyles: {
          'STMT_DATE': { halign: 'center', valign: 'middle' },
          'TRANSACTION_MODE': { halign: 'center', valign: 'middle', cellWidth: 35 },
          'DESCRIPTION': { cellWidth: 50 },
          'DR_AMT': { halign: 'right', valign: 'middle', cellWidth: 25 },
          'CR_AMT': { halign: 'right', valign: 'middle', cellWidth: 25 },
          'BALANCE': { halign: 'right', valign: 'middle', cellWidth: 30 }
        },
        theme: 'grid',
        startY: y,
        margin: {
          left: 10,
          right: 10,
        }
      }
    );

    y = (doc as any).lastAutoTable.finalY + 10;
    if (y >= 285) {
      doc.addPage();
      y = 10;
    }
    doc.setFont('courier', 'normal');
    doc.text('END OF STATEMENT', 10, y);

    doc.setFont('times', 'normal');
    y += 10;
    if (y >= 275) {
      doc.addPage();
      y = 15;
    }
    doc.text(
      wrap(
        'Unless a constituent notifies the bank immediately of any discrepancy found by him/her/them in this statement of account, it will be taken that he/she/they have found this statement correct.',
        { width: 120 }
      ),
      8, y
    );
    y += 13;
    doc.text('This is only for information purpose and not for legal use.', 9.5, y);


    // footer
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const pageCount = doc.getNumberOfPages();
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text('** This is only for information purpose and not for legal use **', 60, 291);
      doc.text(`Page ${i} of ${pageCount}`, 190, 291);
    }

    // ---------------------------------------
    // do no touch
    doc.save();
    return doc.output('dataurlstring');

  }

}
