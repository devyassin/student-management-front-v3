import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { StudentsService } from '../../../services/students.service';
import { BaseCrudComponent, BaseEntity } from '../../../shared/base-crud/base-crud.component';
import { Course } from '../../../models/course.model';
import { CoursesService } from '../../../services/courses.service';

export interface Student extends BaseEntity {
  name?: string;
  code?: string;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    DividerModule,
  ],
  providers: [MessageService, ConfirmationService],
  styleUrl: './courses.component.css',
})
export class CoursesComponent extends BaseCrudComponent<Course> {
  protected searchFields: (keyof Course)[] = ['name', 'code'];
  protected requiredFields: string[] = ['name', 'code'];
  
  // Properly inject the service using the inject function
  protected override service = inject(CoursesService);

  protected getEntityName(plural: boolean = false): string {
    return plural ? 'Courses' : 'Course';
  }

  protected override prepareForUpdate(course: Course): Partial<Course> {
    return {
      name: course.name,
      code: course.code
    };
  }
}