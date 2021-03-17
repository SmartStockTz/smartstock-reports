import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class PeriodDateRangeService {

  constructor() {
  }

  period = new BehaviorSubject<any>('');
  startDate = new BehaviorSubject<any>('');
  endDate = new BehaviorSubject<any>('');
  dateRange = new BehaviorSubject<any>('');

  // editPeriod(period): any {
  //   this.period.next(period);
  // }
  //
  // editStartDate(startDate): any {
  //   this.startDate.next(startDate);
  // }
  //
  // editEndDate(endDate): any {
  //   this.endDate.next(endDate);
  // }

  editDateRange(dateRange): any {
    this.dateRange.next(dateRange);
  }
}
