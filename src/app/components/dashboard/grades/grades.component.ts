import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';

import {
  BaseCrudComponent,
  BaseEntity,
} from '../../../shared/base-crud/base-crud.component';
import { Course } from '../../../models/course.model';
import { Student } from '../students/students.component';
import { GradesService } from '../../../services/grades.service';
import { StudentsService } from '../../../services/students.service';
import { CoursesService } from '../../../services/courses.service';

export interface Grade extends BaseEntity {
  student?: Student;
  course?: Course;
  grade?: number;
  date?: Date;
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    DividerModule,
  ],
  providers: [MessageService, ConfirmationService],
  styleUrl: './grades.component.css',
})
export class GradesComponent extends BaseCrudComponent<Grade> implements OnInit {
  public students: Student[] = [];
  public courses: Course[] = [];

  protected searchFields: (keyof Grade)[] = ['student', 'course', 'grade'];
  protected requiredFields: string[] = ['student', 'course', 'grade'];

  // Properly inject the service using the inject function
  protected override service = inject(GradesService);
  public studentService = inject(StudentsService);
  public courseService = inject(CoursesService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadStudentsAndCourses();
  }

  private loadStudentsAndCourses(): void {
    // Load both students and courses concurrently
    this.getStudents();
    this.getCourses();
  }

  protected getEntityName(plural: boolean = false): string {
    return plural ? 'Grades' : 'Grade';
  }

  protected override prepareForUpdate(grade: Grade): Partial<Grade> {
    return {
      student: grade.student,
      course: grade.course,
      grade: grade.grade,
    };
  }

 

  protected getStudents(): void {
    this.studentService.getAll().subscribe({
      next: (students: Student[]) => {
        this.students = students;
        console.log('Loaded students:', this.students);
      },
      error: (error: any) => {
        this.errorMessage = `Failed to load students`;
        this.showError(this.errorMessage);
      },
    });
  }
  
  protected getCourses(): void {
    this.courseService.getAll().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
        console.log('Loaded courses:', this.courses);
      },
      error: (error: any) => {
        this.errorMessage = `Failed to load courses`;
        this.showError(this.errorMessage);
      },
    });
  }
}