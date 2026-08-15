import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/components/alert/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
