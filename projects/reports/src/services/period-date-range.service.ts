import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '@smartstocktz/core-libs';
import {BFast} from 'bfastjs';
import {StorageService} from '@smartstocktz/core-libs';
import {CartModel} from '../models/cart.model';
import {toSqlDate} from '@smartstocktz/core-libs';
import {SalesModel} from '../models/sale.model';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class PeriodDateRangeService {

  constructor(){}

   period = new BehaviorSubject<any>('');
 // castPeriod = this.period.asObservable();
   startDate = new BehaviorSubject<any>('');
  // castStartDate = this.startDate.asObservable();
   endDate = new BehaviorSubject<any>('');
  // castEndDate = this.endDate.asObservable();

  editPeriod(period): any {
    this.period.next(period);
  }

  editStartDate(startDate): any {
    this.startDate.next(startDate);
  }

  editEndDate(endDate): any {
    this.endDate.next(endDate);
  }
}
