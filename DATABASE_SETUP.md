# Database Setup Guide

## PostgreSQL Database Setup for LPU App

### Prerequisites
1. Install PostgreSQL on your system
2. Create a database named `lpu_app`
3. Set up your database credentials

### Setup Steps

1. **Install PostgreSQL** (if not already installed):
   - Download from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
   - Follow the installation instructions for your operating system

2. **Create Database**:
   ```sql
   CREATE DATABASE lpu_app;
   ```

3. **Environment Configuration**:
   - Copy `.env.example` to `.env`
   - Update the database credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=lpu_app
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

4. **Database Initialization**:
   The app will automatically create the required tables and sample data when it starts.

### Database Schema

#### Timetable Table
- `id`: Primary key
- `course_code`: Course code (e.g., CSE101)
- `course_name`: Full course name
- `room_number`: Classroom number
- `day_of_week`: Day of week (1=Monday, 2=Tuesday, ..., 6=Saturday, 0=Sunday)
- `start_time`: Class start time
- `end_time`: Class end time
- `teacher_name`: Teacher's name
- `is_active`: Whether the class is active

#### Attendance Table
- `id`: Primary key
- `timetable_id`: Foreign key to timetable
- `date`: Date of attendance
- `status`: Attendance status (present/absent/ongoing)

### Features

1. **Weekend Detection**: 
   - Saturday and Sunday are automatically detected as weekends
   - Shows "No Timetable Available" message on weekends

2. **Real-time Status**:
   - Shows "Going On" for current classes
   - Shows "Upcoming" for future classes
   - Shows attendance status for completed classes

3. **Automatic Scheduling**:
   - Only weekdays (Monday-Friday) have classes
   - No classes scheduled on weekends

### Sample Data
The app comes with sample timetable data for weekdays:
- Monday: PHY109, CSE101
- Tuesday: MATH201
- Wednesday: ENG102
- Thursday: CSE201
- Friday: PHY201

### Troubleshooting

1. **Database Connection Issues**:
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database `lpu_app` exists

2. **No Classes Showing**:
   - Check if it's a weekend (Saturday/Sunday)
   - Verify sample data was inserted correctly
   - Check console for any error messages

### Development Notes

- The database automatically initializes when the app starts
- Sample data is inserted only if it doesn't already exist
- Weekend logic is built into the TimetableService
- All database operations are handled through the TimetableService class
