import {Injectable} from '@angular/core';
import * as moment from 'moment';
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

  editDateRange(dateRange: {period: string, endDate: any, startDate: any}): any {
    // dateRange = Object.assign(dateRange, {
    //   endDate: moment(dateRange.endDate).format('YYYY-MM-DD'),
    //   startDate: moment(dateRange.endDate).format('YYYY-MM-DD'),
    // })
    this.dateRange.next(dateRange);
  }
}
