import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert';
import { AlertService } from '../../services/alert.service';

describe('AlertComponent', () => {
  it('renders the active alert and dismisses it', () => {
    const alertService = new AlertService();
    TestBed.configureTestingModule({ imports: [AlertComponent], providers: [{ provide: AlertService, useValue: alertService }] });
    const fixture = TestBed.createComponent(AlertComponent);

    alertService.success('Task saved', 'Success');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Task saved');
    expect(fixture.nativeElement.textContent).toContain('Success');

    fixture.componentInstance.dismiss();
    expect(alertService.leaving()).toBe(true);
  });
});
