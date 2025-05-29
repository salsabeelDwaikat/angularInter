import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './home/about/about.component';
import { ContactComponent } from './home/contact/contact.component';
import { DataGridComponent } from './data-grid/data-grid.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PostsComponent } from './posts/posts.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CarGridComponent } from './components/car-grid/car-grid.component';
export const routes: Routes = [
  {
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent }
    ]
  },
  { path: 'posts', component: PostsComponent },
  { path: 'data-grid', component: DataGridComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'cars', component: CarGridComponent },
  { path: 'feedback', component: FeedbackComponent },  
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
