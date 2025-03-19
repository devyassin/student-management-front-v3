import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses.service';
import { Course } from '../../../models/course.model';
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
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse: Course | undefined;
  errorMessage: string = '';
  isDialogVisible: boolean = false;
  isAddDialogVisible: boolean = false;
  loading: boolean = false;
  searchQuery: string = '';
  newCourse: Partial<Course> = {};

  constructor(
    private coursesService: CoursesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses(): void {
    this.loading = true;
    this.coursesService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load courses';
        this.showError(this.errorMessage);
        this.loading = false;
      },
    });
  }

  getCourseById(id: string): void {
    this.coursesService.getCourseById(id).subscribe({
      next: (data) => {
        this.selectedCourse = data;
        this.isDialogVisible = true;
      },
      error: (error) => {
        this.errorMessage = 'Course not found';
        this.showError(this.errorMessage);
      },
    });
  }

  searchCourses(): void {
    if (!this.searchQuery.trim()) {
      this.getAllCourses();
      return;
    }

    this.loading = true;
    // this.coursesService.searchCourse(this.searchQuery).subscribe({
    //   next: (data) => {
    //     this.courses = data;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     this.errorMessage = 'Search failed';
    //     this.showError(this.errorMessage);
    //     this.loading = false;
    //   },
    // });
  }

  openAddDialog(): void {
    this.newCourse = {};
    this.isAddDialogVisible = true;
  }

  createCourse(): void {
    if (!this.newCourse.name || !this.newCourse.code) {
      this.showError('Please fill in all required fields');
      return;
    }

    this.coursesService.createCourse(this.newCourse).subscribe({
      next: (response) => {
        this.courses.push(response.course);
        this.isAddDialogVisible = false;
        this.showSuccess('Course created successfully');
      },
      error: (error) => {
        this.errorMessage = 'Failed to create course';
        this.showError(this.errorMessage);
      },
    });
  }

  updateCourse(id: string, course: Partial<Course>): void {
    this.coursesService.updateCourse(id, course).subscribe({
      next: (response) => {
        this.courses = this.courses.map((c) =>
          c._id === id ? response.course : c
        );
        this.showSuccess('Course updated successfully');
      },
      error: (error) => {
        this.errorMessage = 'Failed to update course';
        this.showError(this.errorMessage);
      },
    });
  }

  confirmDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this course?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCourse(id);
      },
    });
  }

  deleteCourse(id: string): void {
    this.coursesService.deleteCourse(id).subscribe({
      next: () => {
        this.courses = this.courses.filter((c) => c._id !== id);
        this.showSuccess('Course deleted successfully');
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete course';
        this.showError(this.errorMessage);
      },
    });
  }

  closeDialog(): void {
    this.isDialogVisible = false;
    this.selectedCourse = undefined;
  }

  closeAddDialog(): void {
    this.isAddDialogVisible = false;
    this.newCourse = {};
  }

  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}