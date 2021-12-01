import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class PeriodDateRangeState {
  period = new BehaviorSubject<any>('');
  startDate = new BehaviorSubject<any>('');
  endDate = new BehaviorSubject<any>('');
  dateRange = new BehaviorSubject<any>('');

  constructor() {
  }

  editDateRange(dateRange: { period: string, endDate: any, startDate: any }): any {
    this.dateRange.next(dateRange);
  }
}
