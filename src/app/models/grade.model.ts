import { Course } from './course.model';
import { Student } from './student.model';

export interface Grade {
  _id: string;
  student: Student;
  course: Course;
  grade: number;
}
