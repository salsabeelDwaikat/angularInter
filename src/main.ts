import '@angular/localize/init';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import 'ag-grid-enterprise';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()) 
  ]
});
