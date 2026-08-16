import { TestBed } from '@angular/core/testing';
import { TaskMetricsComponent } from './task-metrics';

describe('TaskMetricsComponent', () => {
  it('renders task totals and progress', () => {
    TestBed.configureTestingModule({ imports: [TaskMetricsComponent] });
    const fixture = TestBed.createComponent(TaskMetricsComponent);
    fixture.componentRef.setInput('total', 10);
    fixture.componentRef.setInput('completed', 6);
    fixture.componentRef.setInput('pending', 4);
    fixture.componentRef.setInput('progress', 60);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('10');
    expect(fixture.nativeElement.textContent).toContain('6');
    expect(fixture.nativeElement.textContent).toContain('4');
    expect(fixture.nativeElement.textContent).toContain('60%');
  });
});
