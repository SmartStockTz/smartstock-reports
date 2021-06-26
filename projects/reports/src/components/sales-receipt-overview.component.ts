import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PrintService} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-sales-receipt-overview',
  template: `
    <div>
      <div mat-dialog-title>
        <p>Receipt : {{data.id}}</p>
        <p>Amount : {{data.amount}}</p>
      </div>
      <div mat-dialog-content>
        <form [formGroup]="tempReceipt" (ngSubmit)="print()">
          <mat-form-field style="width: 100%">
            <mat-label>Date</mat-label>
            <input matInput formControlName="date">
            <mat-error>Date required</mat-error>
          </mat-form-field>
          <mat-form-field style="width: 100%">
            <mat-label>Buyer</mat-label>
            <input matInput formControlName="buyer">
            <mat-error>Buyer name required</mat-error>
          </mat-form-field>
          <mat-form-field style="width: 100%">
            <mat-label>Buyer TIN</mat-label>
            <input placeholder="enter buyer TIN" matInput formControlName="buyerTin">
          </mat-form-field>
          <mat-form-field style="width: 100%">
            <mat-label>Paid For</mat-label>
            <textarea matInput placeholder="paid for what goods or service" formControlName="paidFor" rows="3"></textarea>
            <mat-error>Description required, at least 8 words</mat-error>
          </mat-form-field>
        </form>
      </div>
      <div mat-dialog-actions class="d-flex justify-content-end">
        <button (click)="print()" mat-flat-button color="primary">Print</button>
        <div style="width: 10px; height: 10px"></div>
        <button mat-dialog-close mat-button color="warn">Cancel</button>
      </div>
    </div>
  `,
})

export class SalesReceiptOverviewComponent implements OnInit {
  tempReceipt: FormGroup;

  constructor(public readonly dialogRef: MatDialogRef<SalesReceiptOverviewComponent>,
              private readonly formBuilder: FormBuilder,
              private readonly printService: PrintService,
              private readonly snack: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  print(): void {
    console.log(this.data);
    const dataToPrint = `
ITEM : ${this.tempReceipt.value.seller}
QUANTITY : ${this.tempReceipt.value.seller} PRICE:
_____________________________________________
        `;
    if (this.tempReceipt.valid) {
      this.printService.print({
        id: new Date().toISOString(),
        printer: 'tm20',
        data: dataToPrint,
        qr: this.data.id
      }, true).then(_ => {
        this.snack.open('Receipt overview printed', 'Ok', {duration: 2000});
        this.dialogRef.close(true);
      }).catch(reason => {
        this.snack.open(reason && reason.message ? reason.message : reason, 'Ok', {duration: 3000});
      });
    } else {
      this.snack.open('Fill all required items', 'Ok', {duration: 2000});
    }
  }

  ngOnInit(): void {
    this.tempReceipt = this.formBuilder.group({
      date: [this.data.date, [Validators.required, Validators.nullValidator]],
      buyer: [this.data.customer, [Validators.required, Validators.nullValidator]],
      buyerTin: [''],
      seller: [this.data.businessName],
      amount: [this.data.amount],
      paidFor: ['', [Validators.required, Validators.nullValidator, Validators.minLength(8)]]
    });
  }
}

