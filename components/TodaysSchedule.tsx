import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Font } from "../constants/Typography";
import { ScheduleCard } from "./ScheduleCard";

export const TodaysSchedule = () => {
  const scheduleData = [
    {
      courseCode: "PHY109",
      details: "55-705 : LPULive",
      statusText: "Absent",
      statusColor: "red",
      time: "01-02 PM",
      gradientColors: ["#e47668", "#e59769", "#ffdb79"],
    },
    {
      courseCode: "CSE101",
      details: "12-304 : LPULive",
      statusText: "Going On",
      statusColor: "green",
      time: "02-03 PM",
      gradientColors: ["#e47668", "#e59769", "#ffdb79"],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Today's Schedule</Text>
        <LinearGradient 
          colors={["#e47668", "#e59769", "#ffdb79"]} 
          start={{x:0,y:0}} 
          end={{x:1,y:0}} 
          style={styles.dostBadge}
        >
          <Text style={styles.dostText}>Your Dost</Text>
        </LinearGradient>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {scheduleData.map((item, index) => (
          <ScheduleCard key={index} {...item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingLeft: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingRight: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: Font.bold,
    color: "#333",
  },
  dostBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dostText: {
    fontSize: 12,
    fontFamily: Font.bold,
    color: '#000',
  },
});
