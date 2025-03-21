import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { CrudService } from '../shared/base-crud/base-crud.component';

@Injectable({
  providedIn: 'root',
})
export class CoursesService implements CrudService<Course> {
  private API_URL = `${environment.API_STD}/courses`;

  constructor(private http: HttpClient) {}
  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.API_URL);
  }
  getById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.API_URL}/${id}`);
  }
  create(
    course: Partial<Course>
  ): Observable<{ message: string; course: Course }> {
    return this.http.post<{ message: string; course: Course }>(
      this.API_URL,
      course
    );
  }
  update(
    id: string,
    course: Partial<Course>
  ): Observable<{ message: string; course: Course }> {
    return this.http.put<{ message: string; course: Course }>(
      `${this.API_URL}/${id}`,
      course
    );
  }
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
