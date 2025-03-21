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

export interface Student extends BaseEntity {
  firstName?: string;
  lastName?: string;
}

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
export class StudentsComponent extends BaseCrudComponent<Student> {
  protected searchFields: (keyof Student)[] = ['firstName', 'lastName'];
  protected requiredFields: string[] = ['firstName', 'lastName'];
  
  // Properly inject the service using the inject function
  protected override service = inject(StudentsService);

  protected getEntityName(plural: boolean = false): string {
    return plural ? 'Students' : 'Student';
  }

  protected override prepareForUpdate(student: Student): Partial<Student> {
    return {
      firstName: student.firstName,
      lastName: student.lastName
    };
  }
}