import pool from './database';

export interface TimetableEntry {
  id: number;
  courseCode: string;
  courseName: string;
  roomNumber: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacherName?: string;
  status?: 'present' | 'absent' | 'ongoing';
}

export class TimetableService {
  // Get current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  private getCurrentDayOfWeek(): number {
    return new Date().getDay();
  }

  // Check if current day is weekend (Saturday = 6, Sunday = 0)
  public isWeekend(): boolean {
    const day = this.getCurrentDayOfWeek();
    return day === 0 || day === 6;
  }

  // Get today's timetable
  public async getTodaysTimetable(): Promise<TimetableEntry[]> {
    try {
      // If it's weekend, return empty array
      if (this.isWeekend()) {
        return [];
      }

      const currentDay = this.getCurrentDayOfWeek();
      const today = new Date().toISOString().split('T')[0];

      const query = `
        SELECT 
          t.id,
          t.course_code as "courseCode",
          t.course_name as "courseName",
          t.room_number as "roomNumber",
          t.day_of_week as "dayOfWeek",
          t.start_time as "startTime",
          t.end_time as "endTime",
          t.teacher_name as "teacherName",
          COALESCE(a.status, 'scheduled') as status
        FROM timetable t
        LEFT JOIN attendance a ON t.id = a.timetable_id AND a.date = $1
        WHERE t.day_of_week = $2 AND t.is_active = true
        ORDER BY t.start_time
      `;

      const result = await pool.query(query, [today, currentDay]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching today\'s timetable:', error);
      return [];
    }
  }

  // Get current ongoing class
  public async getCurrentClass(): Promise<TimetableEntry | null> {
    try {
      if (this.isWeekend()) {
        return null;
      }

      const currentDay = this.getCurrentDayOfWeek();
      const currentTime = new Date().toTimeString().slice(0, 5); // HH:MM format

      const query = `
        SELECT 
          t.id,
          t.course_code as "courseCode",
          t.course_name as "courseName",
          t.room_number as "roomNumber",
          t.day_of_week as "dayOfWeek",
          t.start_time as "startTime",
          t.end_time as "endTime",
          t.teacher_name as "teacherName"
        FROM timetable t
        WHERE t.day_of_week = $1 
          AND t.start_time <= $2 
          AND t.end_time > $2
          AND t.is_active = true
        LIMIT 1
      `;

      const result = await pool.query(query, [currentDay, currentTime]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching current class:', error);
      return null;
    }
  }

  // Mark attendance
  public async markAttendance(timetableId: number, status: 'present' | 'absent'): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const query = `
        INSERT INTO attendance (timetable_id, date, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (timetable_id, date) 
        DO UPDATE SET status = $3, created_at = CURRENT_TIMESTAMP
      `;

      await pool.query(query, [timetableId, today, status]);
      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      return false;
    }
  }
}

export const timetableService = new TimetableService();
