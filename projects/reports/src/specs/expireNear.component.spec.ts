import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpireNearComponent } from '../components/expireNear.component';

describe('ProductsAboutToExpireComponent', () => {
  let component: ExpireNearComponent;
  let fixture: ComponentFixture<ExpireNearComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpireNearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpireNearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
