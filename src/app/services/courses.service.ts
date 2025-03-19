import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private API_URL = `${environment.API_STD}/courses`;

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.API_URL);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.API_URL}/${id}`);
  }

  createCourse(
    course: Partial<Course>
  ): Observable<{ message: string; course: Course }> {
    return this.http.post<{ message: string; course: Course }>(
      this.API_URL,
      course
    );
  }

  updateCourse(
    id: string,
    course: Partial<Course>
  ): Observable<{ message: string; course: Course }> {
    return this.http.put<{ message: string; course: Course }>(
      `${this.API_URL}/${id}`,
      course
    );
  }

  deleteCourse(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
