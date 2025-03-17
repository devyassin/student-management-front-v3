import { Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { StudentsComponent } from './components/dashboard/students/students.component';
import { GradesComponent } from './components/dashboard/grades/grades.component';
import { AccountsComponent } from './components/dashboard/accounts/accounts.component';
import { CoursesComponent } from './components/dashboard/courses/courses.component';
import { StatsComponent } from './components/dashboard/stats/stats.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard/students', component: StudentsComponent },
  { path: 'dashboard/grades', component: GradesComponent },
  { path: 'dashboard/accounts', component: AccountsComponent },
  { path: 'dashboard/courses', component: CoursesComponent },
  { path: 'dashboard/stats', component: StatsComponent },
];
