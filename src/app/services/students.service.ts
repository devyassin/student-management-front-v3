import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private API_URL = `${environment.API_STD}/students`;

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_URL}`);
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/${id}`);
  }

  searchStudent(queryParams: any): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_URL}/search`, {
      params: queryParams,
    });
  }

  createStudent(
    student: Partial<Student>
  ): Observable<{ message: string; student: Student }> {
    return this.http.post<{ message: string; student: Student }>(
      this.API_URL,
      student
    );
  }

  updateStudent(
    id: string,
    student: Partial<Student>
  ): Observable<{ message: string; student: Student }> {
    return this.http.put<{ message: string; student: Student }>(
      `${this.API_URL}/${id}`,
      student
    );
  }

  deleteStudent(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
