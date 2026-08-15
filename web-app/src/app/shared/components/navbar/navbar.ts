import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon';
import { navbarItems } from './navbar.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IconComponent, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly items = navbarItems;
}
