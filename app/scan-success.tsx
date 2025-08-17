import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font } from '../constants/Typography';
import MessCouponScreen from './HostelMessScanner';

// Import the WhatsApp video
const whatsappVideo = require('../assets/videos/WhatsApp Video 2025-08-13 at 2.50.45 PM (1).mp4');

// Import your photo
const myPhoto = require('../assets/images/photo.jpg');

/*
	Scan Success / Result Screen (Mess Pass Layout)
	Fixed header at top, draggable content below
	Params (via query): meal, status, name, studentId, course, session, father, mother, hostel.
*/

export default function ScanSuccessScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const {
		meal = 'Lunch',
		status = 'valid',
		name = 'Pybogula Jaya Kiran',
		studentId = '12305441',
		course = 'Mess BH-3',
		session = 'P13AF-L:B.Tech. (Robotics and Automation) [Lateral Entry] (2023)',
		father = 'Pybogula Shanmuka (9353493116)',
		mother = 'Pybogula Sowmya (8174425738)',
		hostel = 'Boys Hostel-03-B614-Bed A (Std Non-AC 4 Seater)',
	} = params as Record<string,string>;

	const isValid = ['valid','success','accepted'].includes(String(status).toLowerCase());
	const { height: screenHeight } = Dimensions.get('window');

	// State to control sticky header visibility - start with true to show at top
	const [showStickyHeader, setShowStickyHeader] = useState(true);

	// Timer state for 30-second countdown
	const [timeRemaining, setTimeRemaining] = useState(30);

	// Capture timestamp once when opened (unless provided)
	const now = useMemo(() => new Date(), []);
	const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
	const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

	// Animation values
	const scale = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(screenHeight * 0.15)).current; // Start at top position (15% from top)

	useEffect(() => {
		Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 140 }).start();
	}, [scale]);

	// Monitor translateY changes to control sticky header visibility
	useEffect(() => {
		const listener = translateY.addListener(({ value }) => {
			const shouldShowSticky = value < screenHeight * 0.2;
			if (shouldShowSticky !== showStickyHeader) {
				setShowStickyHeader(shouldShowSticky);
			}
		});

		return () => {
			translateY.removeListener(listener);
		};
	}, [translateY, screenHeight, showStickyHeader]);

	// Timer countdown effect30
	useEffect(() => {
		if (timeRemaining > 0) {
			const timer = setTimeout(() => {
				setTimeRemaining(timeRemaining - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else {
			// Auto-close when timer reaches 0
			router.back();
		}
	}, [timeRemaining, router]);

	// Pan responder for dragging
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gestureState) => {
				// Only respond to dragging when not scrolling or when scroll is disabled
				const isVerticalGesture = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
				return isVerticalGesture && (!showStickyHeader || Math.abs(gestureState.dy) > 10);
			},
			onPanResponderGrant: () => {
				translateY.setOffset((translateY as any)._value);
			},
			onPanResponderMove: Animated.event(
				[null, { dy: translateY }],
				{ useNativeDriver: false }
			),
			onPanResponderRelease: (_, gestureState) => {
				translateY.flattenOffset();
				
				// Snap to positions based on gesture
				const snapThreshold = screenHeight * 0.1;
				let snapToY = (translateY as any)._value;
				
				if (gestureState.dy < -snapThreshold) {
					snapToY = screenHeight * 0.15; // Snap to top (below fixed header)
				} else if (gestureState.dy > snapThreshold) {
					snapToY = screenHeight * 0.6; // Snap to bottom
				} else {
					snapToY = screenHeight * 0.3; // Snap to middle
				}
				
				// Update sticky header visibility based on final position
				setShowStickyHeader(snapToY < screenHeight * 0.2);
				
				Animated.spring(translateY, {
					toValue: snapToY,
					useNativeDriver: false,
				}).start();
			},
		})
	).current;

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
			<View style={{ flex: 1 }}>
				{/* Background - HostelMessScanner page will be visible here */}
				<MessCouponScreen />
				<View style={styles.backgroundDimmer} />
			
			{/* Draggable content area - entire area is draggable */}
			<Animated.View 
				style={[
					styles.draggableContent,
					{
						transform: showStickyHeader ? [] : [{ translateY }],
						...(showStickyHeader ? {
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							transform: []
						} : {})
					}
				]}
				{...panResponder.panHandlers}
			>
				{/* Header inside draggable area */}
				<View style={[
					styles.movableHeader,
					showStickyHeader ? { backgroundColor: '#323232' } : { backgroundColor: '#323232' }
				]}>
					{/* Black overlay for safe area when at top */}
					{showStickyHeader && (
						<View style={styles.safeAreaBlackOverlay}>
							{/* Drag bar positioned in black area */}
							
						</View>
					)}
					<View style={[
						styles.headerBar,
						// Reduced padding when sticky since drag bar is in black area
						showStickyHeader ? { paddingTop: 15 } : { paddingTop: 5 }
					]}>
						<View style={styles.headerSpacer} />
						<View style={styles.titleContainer}>
							{/* Show drag bar here only when not sticky */}
							<View style={styles.dragHandle}>
								<View style={styles.dragBar} />
							</View>
							<Text style={[styles.headerTitle, { fontFamily: Font.bold }]}>Mess Pass</Text>
						</View>
						<TouchableOpacity onPress={() => router.replace('/HostelMessScanner')} style={styles.headerClosePlain} accessibilityLabel="Close">
							<Ionicons name="close" size={26} color="#fff" />
						</TouchableOpacity>
					</View>
				</View>

				{/* Scrollable content area - scrollable when header touches safe area */}
				<ScrollView 
					style={styles.scrollableArea} 
					showsVerticalScrollIndicator={false}
					scrollEnabled={showStickyHeader}
				>
					<View style={styles.bodyWrapper}>
						<View style={styles.card}>
							{/* Timer in top right corner */}
							<View style={styles.timerCorner}>
								<Text style={styles.timerText}>{timeRemaining}</Text>
							</View>
							<View style={styles.topRow}>
								<View style={styles.avatarOutline}>
									<Image source={myPhoto} style={styles.avatar} />
								</View>
								<View style={styles.topTextBlock}>
									<Text style={[styles.meal, { fontFamily: Font.bold }]}>{String(meal).charAt(0).toUpperCase() + String(meal).slice(1)}</Text>
									<Text style={[styles.id, { fontFamily: Font.bold }]}>{studentId}</Text>
									<Text style={[styles.name, { fontFamily: Font.bold }]} numberOfLines={1}>{name}</Text>
									<Text style={[styles.course, { fontFamily:Font.bold }]} numberOfLines={2}>{course}</Text>
								</View>
							</View>
							<Text style={[styles.sessionLine, { fontFamily: Font.bold }]} numberOfLines={2}>{session}</Text>
							<View style={styles.dateTimeRow}>
								<Text style={[styles.dateText, { fontFamily: Font.bold }]}>{dateStr}</Text>
								<Text style={[styles.timeText, { fontFamily: Font.bold }]}>{timeStr}</Text>
							</View>
							{!isValid && (
								<View style={styles.alertBanner}>
									<Text style={[styles.alertBannerText, { fontFamily: Font.bold }]}>Dear Student, This mess is not allocated to you. Please report to your concerned Hostel Warden.</Text>
								</View>
							)}
							{isValid && (
								<View > 
									<Text style={[styles.alertBannerText, { fontFamily: Font.bold }]}>Meal Approved</Text>
								</View>
							)}
							{isValid && (
								<View style={styles.validationBox}>
									<View style={styles.iconArea}>
										<Animated.View style={{ transform: [{ scale }] }}>
											<Video
												source={whatsappVideo}
												style={styles.gifImage}
												resizeMode={ResizeMode.CONTAIN}
												shouldPlay={true}
												isLooping={true}
												isMuted={true}
											/>
										</Animated.View>
									</View>
								</View>
							)}
							{/* Father's Name section moved up */}
							<View style={styles.fatherNameSection}>
								<View style={styles.footerBlock}>
									<Text style={[styles.footerLabel, { fontFamily: Font.bold }]}>Father's Name</Text>
									<Text style={[styles.footerValue, { fontFamily: Font.regular }]} numberOfLines={1}>{father}</Text>
								</View>
								<View style={styles.footerBlock}>
									<Text style={[styles.footerLabel, { fontFamily: Font.bold }]}>Mother's Name</Text>
									<Text style={[styles.footerValue, { fontFamily: Font.regular }]} numberOfLines={1}>{mother}</Text>
								</View>
								<View style={styles.footerBlock}>
									<Text style={[styles.footerLabel, { fontFamily: Font.bold }]}>Session</Text>
									<Text style={[styles.footerValue, { fontFamily: Font.regular }]} numberOfLines={2}>{session}</Text>
								</View>
								<View style={styles.footerBlock}>
									<Text style={[styles.footerLabel, { fontFamily: Font.bold }]}>Hostel</Text>
									<Text style={[styles.footerValue, { fontFamily: Font.regular }]} numberOfLines={1}>{hostel || '—'}</Text>
								</View>
							</View>
						</View>
					</View>
				</ScrollView>
			</Animated.View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	backgroundDimmer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
	
	// Movable header inside draggable content
	movableHeader: { backgroundColor: '#323232' },
	safeAreaBlackOverlay: { 
		position: 'absolute', 
		top: -20, 
		left: 0, 
		right: 0, 
		height: 40, 
		backgroundColor: '#000000',
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 5
	},
	draggableContent: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 0, borderTopRightRadius: 10, elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: -5 }, shadowRadius: 10 },
	dragHandle: { alignItems: 'center', paddingVertical: 0, paddingHorizontal: 0, backgroundColor: 'transparent', borderTopLeftRadius: 0, borderTopRightRadius: 0 },
	dragBar: { width: 40, height: 6, backgroundColor: '#ffffff', borderRadius: 10, marginTop: 15, marginBottom: 5 },
	scrollableArea: { flex: 1 },
	titleContainer: { flex: 1, alignItems: 'center' },
	headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 15, paddingBottom: 8, backgroundColor: '#323232', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
	headerSpacer: { width: 40, height: 0 },
	headerIconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
	headerClosePlain: { paddingHorizontal: 4, paddingVertical: 4 },
	headerTitle: { fontSize: 22, color: '#fff', letterSpacing: 0.5, fontFamily: Font.bold },
	timerText: { fontSize: 14, color: '#fff', fontFamily: Font.bold, backgroundColor: '#6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
	timerCorner: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
	mealTimerRow: { flexDirection: 'row', alignItems: 'center' },
	bodyWrapper: { alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#FFFFFF', paddingTop: 20 },
	card: { width: '92%', backgroundColor: '#ffffff', borderRadius: 22, padding: 20, marginTop: 12, elevation: 26, shadowColor: '#000', shadowOpacity: 0.48, shadowOffset: { width: 0, height: 16 }, shadowRadius: 36, borderWidth: 1.5, borderColor: '#bcbebd' },
	topRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
	avatarOutline: { 
		width: 130, 
		height: 130, 
		borderRadius: 65, 
		alignItems: 'center', 
		justifyContent: 'center', 
		shadowColor: '#000', 
		shadowOpacity: 0.3, 
		shadowOffset: { width: 2, height: 2 }, 
		shadowRadius: 4, 
		elevation: 8, 
		borderWidth: 3, 
		borderColor: '#000', 
		backgroundColor: '#fff' 
	},
	avatar: { width: 124, height: 124, borderRadius: 62, backgroundColor: '#ddd' },
	topTextBlock: { marginLeft: 16, flexShrink: 1 },
	meal: { fontSize: 32, color: '#111', fontFamily: Font.bold, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 },
	id: { marginTop: 4, fontSize: 18, color: '#222', fontFamily: Font.regular, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
	name: { marginTop: 2, fontSize: 18, color: '#222', fontFamily: Font.bold, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
	course: { marginTop: 2, fontSize: 16, color: '#444', fontFamily: Font.regular, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
	sessionLine: { marginTop: 16, fontSize: 18, color: '#333', lineHeight: 22, fontFamily: Font.bold },
	dateTimeRow: { marginTop: 24, marginBottom: 8, marginLeft:30,marginRight:50,flexDirection: 'row', justifyContent: 'space-between' },
	dateText: { fontSize: 19, color: '#333', fontFamily: Font.bold },
	timeText: { fontSize: 19, color: '#333', fontFamily: Font.bold },
	alertBanner: { marginTop: 20, backgroundColor: '#C62828', padding: 10, borderRadius: 10, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6 },
	alertBannerText: { fontSize: 34, color: '#a7e222', lineHeight: 34, fontFamily: Font.bold, textAlign: 'center',marginBottom:10 },
	validationBox: { backgroundColor: 'transparent', borderWidth: 20, borderColor: '#083ccaff', borderRadius: 0, marginTop: 8, marginBottom: 16, marginHorizontal: -20, paddingVertical: 20, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
	iconArea: { alignItems: 'center', justifyContent: 'center', marginTop: 16,marginBottom: 16 },
	statusIconCircle: { width: 184, height: 184, borderRadius: 92, alignItems: 'center', justifyContent: 'center', position: 'relative' },
	greenBox: { backgroundColor: '#0F6D39', borderRadius: 12, padding: 8, alignItems: 'center', justifyContent: 'center' },
	greenCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0F6D39', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#0F6D39', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12 },
	videoContainer: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#0F6D39', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12 },
	successVideo: { width: 120, height: 120, borderRadius: 60 },
	gifImage: { width: 200, height: 200 },
	dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#C62828' },
	successDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#0F6D39', opacity: 0.8 },
	fatherNameSection: { marginTop: 8, paddingTop: 10 },
	footerSection: { marginTop: 28, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#d7d7d7', paddingTop: 20 },
	footerBlock: { marginBottom: 16 },
	footerLabel: { fontSize: 15, color: '#7A7A7A', marginBottom: 4, fontFamily: Font.bold },
	footerValue: { fontSize: 17, color: '#222', lineHeight: 22, fontFamily: Font.regular }
});
