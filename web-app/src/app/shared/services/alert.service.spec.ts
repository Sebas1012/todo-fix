import { vi } from 'vitest';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new AlertService();
  });

  afterEach(() => vi.useRealTimers());

  it('shows success, error and warning alerts', () => {
    service.success('Saved', 'Done');
    expect(service.alert()).toMatchObject({ type: 'success', title: 'Done', message: 'Saved' });

    service.error('Failed');
    expect(service.alert()).toMatchObject({ type: 'error', title: 'Ocurrió un error', message: 'Failed' });

    service.warning('Check this');
    expect(service.alert()).toMatchObject({ type: 'warning', title: 'Advertencia', message: 'Check this' });
  });

  it('dismisses an alert after the configured duration', () => {
    service.show({ type: 'success', title: 'Done', message: 'Saved', duration: 1000 });
    vi.advanceTimersByTime(1000);
    expect(service.leaving()).toBe(true);
    vi.advanceTimersByTime(280);
    expect(service.alert()).toBeNull();
    expect(service.leaving()).toBe(false);
  });

  it('does nothing when dismissing without an active alert', () => {
    service.dismiss();
    expect(service.alert()).toBeNull();
    expect(service.leaving()).toBe(false);
  });
});
