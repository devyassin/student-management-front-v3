import { Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { StudentsComponent } from './components/dashboard/students/students.component';
import { GradesComponent } from './components/dashboard/grades/grades.component';
import { AccountsComponent } from './components/dashboard/accounts/accounts.component';
import { CoursesComponent } from './components/dashboard/courses/courses.component';
import { StatsComponent } from './components/dashboard/stats/stats.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'dashboard/students',
    component: StudentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'SCOLARITE'] },
  },
  {
    path: 'dashboard/grades',
    component: GradesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'SCOLARITE', 'STUDENT'] },
  },
  {
    path: 'dashboard/courses',
    component: CoursesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'SCOLARITE', 'STUDENT'] },
  },
  {
    path: 'dashboard/accounts',
    component: AccountsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'dashboard/stats',
    component: StatsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'SCOLARITE', 'STUDENT'] },
  },
];
