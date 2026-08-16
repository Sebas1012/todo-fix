import { TestBed } from '@angular/core/testing';
import { IconComponent } from './icon';
import type { IconName } from './icon';

describe('IconComponent', () => {
  it('renders every supported icon', () => {
    const icons: IconName[] = ['grid', 'check-circle', 'calendar', 'chart', 'settings', 'list', 'clock', 'search', 'target', 'folder', 'sliders', 'more', 'arrow-up-down', 'code', 'database', 'file', 'check', 'alert-circle', 'alert-triangle', 'logout', 'user'];
    TestBed.configureTestingModule({ imports: [IconComponent] });
    const fixture = TestBed.createComponent(IconComponent);

    for (const name of icons) {
      fixture.componentRef.setInput('name', name);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg')).not.toBeNull();
    }
  });
});
