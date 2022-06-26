import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

@Component({
  selector: 'app-date-range',
  template: `
    <div class="date-range-container">
      <button mat-button class="load-button" color="primary" (click)="exportReport()">
        Export
      </button>
      <button mat-button class="load-button" color="primary" (click)="applyDateRange()">
        Reload
      </button>
      <span style="flex: 1 1 auto"></span>
      <mat-form-field>
        <mat-label>From date</mat-label>
        <input [readonly]="true" [matDatepicker]="dp"
               (click)="dp.open()" matInput [formControl]="fromDateFormControl">
        <mat-datepicker-toggle matPrefix [for]="dp"></mat-datepicker-toggle>
        <mat-datepicker [startView]="view" #dp [touchUi]="true"></mat-datepicker>
      </mat-form-field>
      <mat-form-field>
        <mat-label>To date</mat-label>
        <input [readonly]="true"
               matInput [matDatepicker]="dp2"
               (click)="dp2.open()"
               [formControl]="toDateFormControl">
        <mat-datepicker-toggle matPrefix [for]="dp2"></mat-datepicker-toggle>
        <mat-datepicker [startView]="view" #dp2 [touchUi]="true"></mat-datepicker>
      </mat-form-field>
    </div>
  `,
  styleUrls: ['../styles/date-range.style.scss'],
})
export class DateRangeComponent implements OnInit {
  @Input() from = new Date(new Date().setDate(new Date().getDate() - 7));
  @Input() to = new Date();
  @Output() reload = new EventEmitter<{ from: Date, to: Date }>();
  @Output() export = new EventEmitter();
  @Input() view: 'month' | 'year' | 'multi-year' = 'month';

  fromDateFormControl = new UntypedFormControl(new Date(new Date().setDate(new Date().getDate() - 7)));
  toDateFormControl = new UntypedFormControl(new Date());

  constructor() {
  }

  ngOnInit(): void {
    this.fromDateFormControl.setValue(this.from);
    this.toDateFormControl.setValue(this.to);
    this.reload.emit({
      from: this.from,
      to: this.to
    });
  }

  applyDateRange(): void {
    this.reload.emit({
      from: new Date(this.fromDateFormControl.value),
      to: new Date(this.toDateFormControl.value)
    });
  }

  exportReport(): void {
    this.export.emit('export');
  }
}
