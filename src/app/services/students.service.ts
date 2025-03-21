import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { CrudService } from '../shared/base-crud/base-crud.component';

@Injectable({
  providedIn: 'root',
})
export class StudentsService implements CrudService<Student> {
  private API_URL = `${environment.API_STD}/students`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_URL}`);
  }

  getById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/${id}`);
  }

  searchStudent(query: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_URL}/search`, {
      params: { firstName: query },
    });
  }

  create(
    student: Partial<Student>
  ): Observable<{ message: string; student: Student }> {
    return this.http.post<{ message: string; student: Student }>(
      this.API_URL,
      student
    );
  }

  update(
    id: string,
    student: Partial<Student>
  ): Observable<{ message: string; student: Student }> {
    return this.http.put<{ message: string; student: Student }>(
      `${this.API_URL}/${id}`,
      student
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
