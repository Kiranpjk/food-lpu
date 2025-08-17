import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'your_username',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'lpu_app',
  password: process.env.DB_PASSWORD || 'your_password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Database initialization
export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create timetable table
    await client.query(`
      CREATE TABLE IF NOT EXISTS timetable (
        id SERIAL PRIMARY KEY,
        course_code VARCHAR(10) NOT NULL,
        course_name VARCHAR(100) NOT NULL,
        room_number VARCHAR(20) NOT NULL,
        day_of_week INTEGER NOT NULL, -- 1=Monday, 2=Tuesday, ..., 6=Saturday, 0=Sunday
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        teacher_name VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create attendance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        timetable_id INTEGER REFERENCES timetable(id),
        date DATE NOT NULL,
        status VARCHAR(20) NOT NULL, -- 'present', 'absent', 'ongoing'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert sample data for weekdays only (Monday to Friday)
    await client.query(`
      INSERT INTO timetable (course_code, course_name, room_number, day_of_week, start_time, end_time, teacher_name)
      VALUES 
        ('PHY109', 'Physics Lab', '55-705', 1, '13:00', '14:00', 'Dr. Smith'),
        ('CSE101', 'Computer Science Fundamentals', '12-304', 1, '14:00', '15:00', 'Prof. Johnson'),
        ('MATH201', 'Advanced Mathematics', '22-501', 2, '10:00', '11:00', 'Dr. Wilson'),
        ('ENG102', 'Technical English', '15-302', 3, '11:00', '12:00', 'Ms. Brown'),
        ('CSE201', 'Data Structures', '12-304', 4, '09:00', '10:00', 'Prof. Davis'),
        ('PHY201', 'Quantum Physics', '55-706', 5, '15:00', '16:00', 'Dr. Lee')
      ON CONFLICT DO NOTHING;
    `);

    client.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

export default pool;
