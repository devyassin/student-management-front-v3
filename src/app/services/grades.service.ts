import { Injectable } from '@angular/core';
import { CrudService } from '../shared/base-crud/base-crud.component';
import { Grade } from '../models/grade.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GradesService implements CrudService<Grade> {
  private API_URL = `${environment.API_STD}/grades`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.API_URL);
  }
  getById(id: string): Observable<Grade> {
    return this.http.get<Grade>(`${this.API_URL}/${id}`);
  }
  create(grade: Partial<Grade>): Observable<{ message: string; grade: Grade }> {
    return this.http.post<{ message: string; grade: Grade }>(
      this.API_URL,
      grade
    );
  }
  update(
    id: string,
    grade: Partial<Grade>
  ): Observable<{ message: string; grade: Grade }> {
    return this.http.put<{ message: string; grade: Grade }>(
      `${this.API_URL}/${id}`,
      grade
    );
  }
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
