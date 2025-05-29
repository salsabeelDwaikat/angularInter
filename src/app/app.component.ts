import { Component, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet,
  RouterLink,
  RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'angular-app';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  showSidebar = true;
  sidenavMode: 'over' | 'side' = 'side';
  isScreenSmall = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const hideSidebarRoutes = ['/login', '/register'];
        this.showSidebar = !hideSidebarRoutes.includes(event.urlAfterRedirects);

        if (!this.showSidebar && this.sidenav) {
          this.sidenav.close();
        }

        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isScreenSmall = window.innerWidth < 768;
    this.sidenavMode = this.isScreenSmall ? 'over' : 'side';
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
