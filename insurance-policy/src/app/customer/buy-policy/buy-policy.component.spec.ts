import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPolicyComponent } from './buy-policy.component';

describe('BuyPolicyComponent', () => {
  let component: BuyPolicyComponent;
  let fixture: ComponentFixture<BuyPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyPolicyComponent]
    });
    fixture = TestBed.createComponent(BuyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
