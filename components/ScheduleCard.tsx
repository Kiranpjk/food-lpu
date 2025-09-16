import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Font } from "../constants/Typography";

interface ScheduleCardProps {
  courseCode: string;
  details: string;
  statusText: string;
  statusColor: string;
  time: string;
  gradientColors: [string, string, string];
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  courseCode,
  details,
  statusText,
  statusColor,
  time,
  gradientColors,
}) => {
  return (
    <LinearGradient
      colors={gradientColors as any}
      start={{x:0,y:0}}
      end={{x:1,y:0}}
      style={styles.card}
    >
      {/* Background graphic */}
      {/* <Image
        source={require("../assets/books.png")} // You'll need to add a subtle book graphic here
        style={styles.bgImage}
        resizeMode="contain"
      /> */}

      {/* Top Content */}
      <View style={styles.content}>
        <Text style={styles.courseCode}>{courseCode}</Text>
        <Text style={styles.details}>{details}</Text>

        {/* Status (dash only) */}
        <View style={[styles.statusContainer, statusText === '-' ? { backgroundColor: 'transparent', paddingHorizontal: 0 } : null, {width: 20, height: 20}]}>
          {statusText !== '-' && <View style={[styles.statusDot, { backgroundColor: statusColor }, {width:200,height:200}]} />}
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
        
        {/* Subtle background image instead of book icon */}
        <Image
          source={require('../assets/images/generated-image (1).png')}
          style={styles.bgImage}
          resizeMode="contain"
        />
      </View>

      {/* Time Banner */}
      <View style={styles.timeBanner}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    borderRadius: 8, // Reduced border radius
    overflow: "hidden",
    marginRight: 12,
    position: "relative",
    minHeight: 120,
  },
  bgImage: {
    position: "absolute",
    right: 5,
    top: 30,
    width: 90,
    height: 90,
    opacity: 0.2,
  },
  content: {
    padding: 16,
    flex: 1,
    position: "relative",
  },
  bookIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 0,
  },
  courseCode: {
    color: "#000",
    fontSize: 20,
    fontFamily: Font.bold,
  },
  details: {
    color: "#000",
    fontSize: 12,
    fontFamily: Font.regular,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: Font.regular,
  },
  timeBanner: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 8,
    alignItems: "center",
  },
  timeText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: Font.bold,
  },
  
});
