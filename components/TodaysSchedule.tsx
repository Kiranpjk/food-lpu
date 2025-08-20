import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Font } from "../constants/Typography";
import { ScheduleCard } from "./ScheduleCard";

interface TimetableEntry {
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

// Mock timetable data - weekdays only
const mockTimetableData: TimetableEntry[] = [
  // Monday (1)
  { id: 1, courseCode: "PHY109", roomNumber: "55-705", dayOfWeek: 1, startTime: "13:00", endTime: "14:00", teacherName: "Dr. Smith" },
  { id: 2, courseCode: "CSE101", roomNumber: "12-304", dayOfWeek: 1, startTime: "14:00", endTime: "15:00", teacherName: "Prof. Johnson" },
  
  // Tuesday (2)
  { id: 3, courseCode: "MATH201", courseName: "Advanced Mathematics", roomNumber: "22-501", dayOfWeek: 2, startTime: "10:00", endTime: "11:00", teacherName: "Dr. Wilson" },
  
  // Wednesday (3)
  { id: 4, courseCode: "ENG102", courseName: "Technical English", roomNumber: "15-302", dayOfWeek: 3, startTime: "11:00", endTime: "12:00", teacherName: "Ms. Brown" },
  
  // Thursday (4)
  { id: 5, courseCode: "CSE201", courseName: "Data Structures", roomNumber: "12-304", dayOfWeek: 4, startTime: "09:00", endTime: "10:00", teacherName: "Prof. Davis" },
  
  // Friday (5)
  { id: 6, courseCode: "PHY201", courseName: "Quantum Physics", roomNumber: "55-706", dayOfWeek: 5, startTime: "15:00", endTime: "16:00", teacherName: "Dr. Lee" }
];

export const TodaysSchedule = () => {
  const [scheduleData, setScheduleData] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWeekend, setIsWeekend] = useState(false);

  useEffect(() => {
    loadTodaysSchedule();
  }, []);

  const isWeekendDay = (): boolean => {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  const loadTodaysSchedule = async () => {
    try {
      setLoading(true);
      
      // Check if it's weekend
      const weekend = isWeekendDay();
      setIsWeekend(weekend);
      
      if (weekend) {
        setScheduleData([]);
      } else {
        // Get today's classes from mock data
        const currentDay = new Date().getDay();
        const todaysClasses = mockTimetableData.filter(entry => entry.dayOfWeek === currentDay);
        setScheduleData(todaysClasses);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      setScheduleData([]);
    } finally {
      setLoading(false);
    }
  };

  // Format time without AM/PM
  const formatTimeNoPeriod = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}`;
  };

  // Get AM/PM for a given time
  const getPeriod = (timeString: string) => {
    const hour = parseInt(timeString.split(':')[0]);
    return hour >= 12 ? 'PM' : 'AM';
  };

  const getStatusInfo = (entry: TimetableEntry) => {
    const currentTime = new Date();
    const [startHour, startMinute] = entry.startTime.split(':').map(Number);
    const [endHour, endMinute] = entry.endTime.split(':').map(Number);
    
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { text: "Going On", color: "green" };
    } else if (currentTime > endTime) {
      return { text: entry.status === 'present' ? "Present" : "Absent", color: entry.status === 'present' ? "green" : "red" };
    } else {
      return { text: "Upcoming", color: "blue" };
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Loading schedule...</Text>
        </View>
      );
    }

    if (isWeekend) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No Timetable Available</Text>
         
        </View>
      );
    }

    if (scheduleData.length === 0) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No classes scheduled for today</Text>
        </View>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {scheduleData.map((item) => {
          const status = getStatusInfo(item);
          const period = getPeriod(item.endTime); // Use end time for AM/PM
          const timeRange = `${formatTimeNoPeriod(item.startTime)}-${formatTimeNoPeriod(item.endTime)} ${period}`;
          return (
            <ScheduleCard 
              key={item.id}
              courseCode={item.courseCode}
              details={`${item.roomNumber}`}
              statusText={status.text}
              statusColor={status.color}
              time={timeRange}
              gradientColors={["#e47668", "#e59769", "#ffdb79"] as [string, string, string]}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Today's Timetable</Text>
        <LinearGradient 
          colors={["#e47668", "#e59769", "#ffdb79"]} 
          start={{x:0,y:0}} 
          end={{x:1,y:0}} 
          style={styles.dostBadge}
        >
          <Text style={styles.dostText}>Your Dost</Text>
        </LinearGradient>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16, // Changed from paddingLeft to paddingHorizontal for center alignment
    backgroundColor: '#fff', // Added grey background
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: "#000", // Changed to grey color
  },
  dostBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dostText: {
    fontSize: 14,
    fontFamily: Font.regular,
    color: '#000',
  },
  messageContainer: {
    paddingHorizontal: 0,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
   // Added grey background for message container
    borderWidth: 1,
    borderColor: '#d8d6d8', // Changed border to grey
    borderRadius: 0,
    marginHorizontal: 8, // Added margin for better centering
  },
  messageText: {
    fontSize: 16,
    fontFamily: Font.bold,
    color: '#a9a8ab', // Changed to grey color
    textAlign: 'center',
  },
  subMessageText: {
    fontSize: 14,
    fontFamily: Font.regular,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
});
