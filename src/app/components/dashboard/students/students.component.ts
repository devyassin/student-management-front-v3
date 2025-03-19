import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../services/students.service';
import { Student } from '../../../models/student.model';
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
  selector: 'app-students',
  templateUrl: './students.component.html',
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
  styleUrl: './students.component.css',
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = []; // New property to store filtered students
  selectedStudent: Student | undefined;
  errorMessage: string = '';
  isDialogVisible: boolean = false;
  isAddDialogVisible: boolean = false;
  loading: boolean = false;
  searchQuery: string = '';
  newStudent: Partial<Student> = {};

  constructor(
    private studentService: StudentsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllStudents();
  }

  getAllStudents(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = [...this.students]; // Initialize filtered students with all students
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load students';
        this.showError(this.errorMessage);
        this.loading = false;
      },
    });
  }

  getStudentById(id: string): void {
    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.selectedStudent = data;
        this.isDialogVisible = true;
      },
      error: (error) => {
        this.errorMessage = 'Student not found';
        this.showError(this.errorMessage);
      },
    });
  }

  // Modified to filter the local array instead of calling the endpoint
  searchStudents(): void {
    if (!this.searchQuery.trim()) {
      this.filteredStudents = [...this.students];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    console.log(query);
    this.filteredStudents = this.students.filter(
      (student) =>
        student.firstName?.toLowerCase().includes(query) ||
        student.lastName?.toLowerCase().includes(query) ||
        (student._id && student._id.toLowerCase().includes(query))
    );
  }

  openAddDialog(): void {
    this.newStudent = {};
    this.isAddDialogVisible = true;
  }

  createStudent(): void {
    if (!this.newStudent.firstName || !this.newStudent.lastName) {
      this.showError('Please fill in all required fields');
      return;
    }

    this.studentService.createStudent(this.newStudent).subscribe({
      next: (response) => {
        this.students.push(response.student);
        this.filteredStudents = [...this.students]; // Update filtered students
        this.isAddDialogVisible = false;
        this.showSuccess('Student created successfully');
      },
      error: (error) => {
        this.errorMessage = 'Failed to create student';
        this.showError(this.errorMessage);
      },
    });
  }

  updateStudent(id: string, student: Partial<Student>): void {
    this.studentService.updateStudent(id, student).subscribe({
      next: (response) => {
        this.students = this.students.map((s) =>
          s._id === id ? response.student : s
        );
        this.filteredStudents = this.filteredStudents.map((s) =>
          s._id === id ? response.student : s
        );
        this.showSuccess('Student updated successfully');
      },
      error: (error) => {
        this.errorMessage = 'Failed to update student';
        this.showError(this.errorMessage);
      },
    });
  }

  confirmDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this student?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStudent(id);
      },
    });
  }

  deleteStudent(id: string): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.students = this.students.filter((s) => s._id !== id);
        this.filteredStudents = this.filteredStudents.filter(
          (s) => s._id !== id
        );
        this.showSuccess('Student deleted successfully');
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete student';
        this.showError(this.errorMessage);
      },
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredStudents = [...this.students];
  }

  closeDialog(): void {
    this.isDialogVisible = false;
    this.selectedStudent = undefined;
  }

  closeAddDialog(): void {
    this.isAddDialogVisible = false;
    this.newStudent = {};
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
