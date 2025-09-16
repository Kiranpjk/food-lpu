import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Font } from '../constants/Typography';
import MessCouponScreen from './HostelMessScanner';

// Import videos with proper error handling
const successVideoSource = require('../assets/videos/success.webm');
const repeatVideoSource = require('../assets/videos/failure.webm');

// Import your photo
const myPhoto = require('../assets/images/photo.jpg');

export default function ScanSuccessScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	
	function generateVerificationCode() {
		const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
		return `12${random}`;
	}
	const verificationCode = useMemo(() => generateVerificationCode(), []);
	
	const {
		meal = 'Lunch',
		status = 'valid',
		name = 'Pybogula Jaya Kiran',
		studentId = '12305241',
		course = 'Mess BH-3',
		session = 'P13AF-L:B.Tech. (Robotics and Automation) [Lateral Entry] (2023)',
		father = 'Pybogula Somanna',
		mother = 'Pybogula Lakshmi',
		hostel = 'Boys Hostel-03-B614-Bed A (Std Non-AC 4 Seater)',
		repeat = '0',
	} = params as Record<string,string>;

	const isRepeat = String(repeat) === '1' || String(repeat).toLowerCase() === 'true';

	// Choose video based on repeat status with fallback
	const videoSource = isRepeat ? repeatVideoSource : successVideoSource;
	
	// State to track if video failed to load
	const [videoError, setVideoError] = useState(false);

	// Video player with error handling
	const player = useVideoPlayer(videoSource, (p) => {
		try {
			p.loop = true;
			p.muted = true;
			p.play();
		} catch (error) {
			console.warn('Video playback error:', error);
			setVideoError(true);
		}
	});

	const isValid = ['valid','success','accepted'].includes(String(status).toLowerCase());
	const { height: screenHeight } = Dimensions.get('window');

	// State to control sticky header visibility
	const [showStickyHeader, setShowStickyHeader] = useState(false);

	// Timer state for 30-second countdown
	const [timeRemaining, setTimeRemaining] = useState(30);

	// Capture timestamp once when opened (unless provided)
	const now = useMemo(() => new Date(), []);
	const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
	const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

	// Animation values
	const scale = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(screenHeight * 0.4)).current;
	const opacity = useRef(new Animated.Value(1)).current;

	// Drag to dismiss constants
	const DISMISS_THRESHOLD_POSITION = screenHeight * 0.9;
	const DISMISS_THRESHOLD_VELOCITY = 800;
	const TOP_POSITION = screenHeight * 0.15;
	const MIDDLE_POSITION = screenHeight * 0.4;
	const BOTTOM_POSITION = screenHeight * 0.75;
	const STICKY_THRESHOLD = screenHeight * 0.2;

	useEffect(() => {
		Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 140 }).start();
		
		Animated.timing(translateY, {
			toValue: TOP_POSITION,
			duration: 400,
			useNativeDriver: false,
		}).start();
	}, [scale]);

	// Monitor translateY changes to control sticky header visibility
	useEffect(() => {
		const listener = translateY.addListener(({ value }) => {
			const shouldShowSticky = value <= STICKY_THRESHOLD;
			if (shouldShowSticky !== showStickyHeader) {
				setShowStickyHeader(shouldShowSticky);
			}
		});

		return () => {
			translateY.removeListener(listener);
		};
	}, [translateY, showStickyHeader]);

	// Timer countdown effect
	useEffect(() => {
		if (timeRemaining > 0) {
			const timer = setTimeout(() => {
				setTimeRemaining(timeRemaining - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else {
			router.back();
		}
	}, [timeRemaining, router]);

	// Function to dismiss the screen with animation
	const dismissScreen = () => {
		Animated.parallel([
			Animated.timing(translateY, {
				toValue: screenHeight,
				duration: 300,
				useNativeDriver: false,
			}),
			Animated.timing(opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			})
		]).start(() => {
			router.back();
		});
	};

	// Pan responder for dragging with dismiss functionality
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gestureState) => {
				const isVerticalGesture = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
				return isVerticalGesture && Math.abs(gestureState.dy) > 5;
			},
			onPanResponderGrant: () => {
				translateY.setOffset((translateY as any)._value);
			},
			onPanResponderMove: (_, gestureState) => {
				const newY = Math.max(TOP_POSITION - (translateY as any)._offset, gestureState.dy);
				translateY.setValue(newY);
				
				const currentPosition = (translateY as any)._offset + newY;
				if (currentPosition > BOTTOM_POSITION) {
					const dismissProgress = Math.min((currentPosition - BOTTOM_POSITION) / (DISMISS_THRESHOLD_POSITION - BOTTOM_POSITION), 1);
					opacity.setValue(1 - (dismissProgress * 0.6));
				} else {
					opacity.setValue(1);
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				translateY.flattenOffset();
				const currentY = (translateY as any)._value;
				const velocity = gestureState.vy;
				
				const shouldDismissByPosition = currentY >= DISMISS_THRESHOLD_POSITION;
				const shouldDismissByVelocity = velocity > DISMISS_THRESHOLD_VELOCITY && currentY > MIDDLE_POSITION;
				
				if (shouldDismissByPosition || shouldDismissByVelocity) {
					dismissScreen();
					return;
				}
				
				Animated.timing(opacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: false,
				}).start();
				
				let snapToY;
				
				if (velocity < -300) {
					snapToY = TOP_POSITION;
				} else if (velocity > 300) {
					if (currentY > MIDDLE_POSITION) {
						snapToY = BOTTOM_POSITION;
					} else {
						snapToY = MIDDLE_POSITION;
					}
				} else {
					const distanceToTop = Math.abs(currentY - TOP_POSITION);
					const distanceToMiddle = Math.abs(currentY - MIDDLE_POSITION);
					const distanceToBottom = Math.abs(currentY - BOTTOM_POSITION);
					
					const minDistance = Math.min(distanceToTop, distanceToMiddle, distanceToBottom);
					
					if (minDistance === distanceToTop) {
						snapToY = TOP_POSITION;
					} else if (minDistance === distanceToMiddle) {
						snapToY = MIDDLE_POSITION;
					} else {
						snapToY = BOTTOM_POSITION;
					}
				}
				
				setShowStickyHeader(snapToY <= STICKY_THRESHOLD);
				
				Animated.spring(translateY, {
					toValue: snapToY,
					useNativeDriver: false,
					friction: 8,
					tension: 100,
				}).start();
			},
		})
	).current;

	// Fallback component when video fails
	const VideoFallback = ({ isRepeat }: { isRepeat: boolean }) => (
		<View style={styles.videoFallback}>
			<View style={[
				styles.fallbackCircle,
				isRepeat ? styles.fallbackCircleError : styles.fallbackCircleSuccess
			]}>
				<Ionicons 
					name={isRepeat ? "close-circle" : "checkmark-circle"} 
					size={120} 
					color={isRepeat ? "#C62828" : "#0F6D39"} 
				/>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
			<View style={{ flex: 1 }}>
				<MessCouponScreen />
				<Animated.View style={[styles.backgroundDimmer, { opacity }]} />
			
				<Animated.View 
					style={[
						styles.draggableContent,
						{
							opacity,
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
					<View style={[
						styles.movableHeader,
						showStickyHeader ? { backgroundColor: '#323232' } : { backgroundColor: '#323232' }
					]}>
						{showStickyHeader && (
							<View style={styles.safeAreaBlackOverlay}>
							</View>
						)}
						<View style={[
							styles.headerBar,
							showStickyHeader ? { paddingTop: 15 } : { paddingTop: 5 }
						]}>
							<View style={styles.headerSpacer} />
							<View style={styles.titleContainer}>
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

					<ScrollView 
						style={styles.scrollableArea} 
						showsVerticalScrollIndicator={false}
						scrollEnabled={showStickyHeader}
					>
						<View style={styles.bodyWrapper}>
							<View style={styles.card}>
								<View style={styles.timerCorner}>
									{typeof timeRemaining === 'number' && timeRemaining > 0 && (
										<Text style={styles.timerText}>{timeRemaining}</Text>
									)}
								</View>
								<View style={styles.topRow}>
									<View style={styles.avatarOutline}>
										<Image source={myPhoto} style={styles.avatar} />
									</View>
									<View style={styles.topTextBlock}>
										<Text style={[styles.meal, { fontFamily: Font.bold }]}>{String(meal).charAt(0).toUpperCase() + String(meal).slice(1)}</Text>
										<Text style={[styles.id, { fontFamily: Font.bold }]}>{studentId}</Text>
										<Text style={[styles.name, { fontFamily: Font.bold }]} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
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
								{isValid && !isRepeat && (
									<View > 
										<Text style={[styles.alertBannerText, { fontFamily: Font.bold }]}>Meal Approved</Text>
									</View>
								)}
								{isValid && isRepeat && (
									<View>
										<Text style={[styles.alertBannerTextRepeat, { fontFamily: Font.bold }]}>You have Already Taken this Meal</Text>
									</View>
								)}
								{isValid && (
									<View style={[
										styles.validationBox,
										isRepeat ? styles.validationBoxRepeat : null,
									]}>
										<View style={styles.iconArea}>
											<Animated.View style={{ transform: [{ scale }] }}>
												{videoError ? (
													<VideoFallback isRepeat={isRepeat} />
												) : (
													<VideoView
														player={player}
														style={styles.gifImage}
														contentFit="contain"
														nativeControls={false}
														allowsFullscreen={false}
														allowsPictureInPicture={false}
														requiresLinearPlayback={false}
														onError={(error) => {
															console.warn('VideoView error:', error);
															setVideoError(true);
														}}
													/>
												)}
											</Animated.View>
										</View>
									</View>
								)}
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
										<Text style={[styles.footerValue, { fontFamily: Font.regular }]} numberOfLines={2} ellipsizeMode="tail">{hostel || '—'}</Text>
									</View>
									{!isRepeat && (
										<>
											<View style={styles.dividerShadow} />
											<View style={[styles.footerBlock, styles.verificationRow]}>
												<Text style={styles.verificationLabel}>Verification Code</Text>
												<Text style={styles.verificationValue}>{verificationCode}</Text>
											</View>
										</>
									)}
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
	dividerShadow: {
		height: StyleSheet.hairlineWidth * 2,
		backgroundColor: '#c5c5c5',
		marginVertical: 12,
		alignSelf: 'stretch',
		opacity: 0.9,
	},
	
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
	timerText: { fontSize: 18, color: '#fff', fontFamily: Font.bold, backgroundColor: '#888', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, overflow: 'hidden', fontWeight: 'bold', letterSpacing: 1 },
	timerCorner: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
	mealTimerRow: { flexDirection: 'row', alignItems: 'center' },
	bodyWrapper: { alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#FFFFFF', paddingTop: 20 },
	card: { width: '92%', backgroundColor: '#ffffff', borderRadius: 22, padding: 20, marginTop: 12, elevation: 26, shadowColor: '#000', shadowOpacity: 0.48, shadowOffset: { width: 0, height: 16 }, shadowRadius: 36, borderWidth: 1.5, borderColor: '#bcbebd' },
	topRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, justifyContent: 'flex-start' },
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
		backgroundColor: '#fff',
		marginLeft: -10
	},
	avatar: { width: 124, height: 124, borderRadius: 62, backgroundColor: '#ddd' },
	topTextBlock: { marginLeft: 6, flexShrink: 1 },
	meal: { fontSize: 32, color: '#111', fontFamily: Font.bold, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 },
	id: { marginTop: 4, fontSize: 18, color: '#222', fontFamily: Font.regular, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
	name: { marginTop: 2, fontSize: 18, color: '#222', fontFamily: Font.bold, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
	course: { marginTop: 2, fontSize: 16, color: '#444', fontFamily: Font.regular, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
	sessionLine: { marginTop: 16, fontSize: 18, color: '#333', lineHeight: 22, fontFamily: Font.bold },
	dateTimeRow: { marginTop: 24, marginBottom: 8, marginLeft:30,marginRight:50,flexDirection: 'row', justifyContent: 'space-between' },
	dateText: { fontSize: 19, color: '#333', fontFamily: Font.bold },
	timeText: { fontSize: 19, color: '#333', fontFamily: Font.bold },
	alertBanner: { marginTop: 20, backgroundColor: '#C62828', padding: 10, borderRadius: 10, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6 },
	alertBannerText: { fontSize: 34, color: '#5FBF21', lineHeight: 34, fontFamily: Font.bold, textAlign: 'center',marginBottom:1,marginTop:40 },
	alertBannerTextRepeat: { fontSize: 28, color: '#C62828', lineHeight: 32, fontFamily: Font.bold, textAlign: 'center', marginTop: 40, marginBottom: 1 },
	validationBox: { backgroundColor: 'transparent', borderWidth: 20, borderColor: '#122455', borderRadius: 0, marginTop: 8, marginBottom: 16, marginHorizontal: -20, paddingVertical: 20, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
	validationBoxRepeat: { borderColor: '#C62828' },
	iconArea: { alignItems: 'center', justifyContent: 'center', marginTop: 1,marginBottom: 1 },
	statusIconCircle: { width: 184, height: 184, borderRadius: 92, alignItems: 'center', justifyContent: 'center', position: 'relative' },
	greenBox: { backgroundColor: '#0F6D39', borderRadius: 12, padding: 8, alignItems: 'center', justifyContent: 'center' },
	greenCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0F6D39', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#0F6D39', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12 },
	videoContainer: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#0F6D39', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12 },
	successVideo: { width: 120, height: 120, borderRadius: 60 },
	gifImage: { width: 260, height: 260 },
	// New styles for video fallback
	videoFallback: {
		width: 260,
		height: 260,
		alignItems: 'center',
		justifyContent: 'center',
	},
	fallbackCircle: {
		width: 200,
		height: 200,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 8,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 12,
		shadowOpacity: 0.4,
	},
	fallbackCircleSuccess: {
		backgroundColor: '#0F6D39',
		shadowColor: '#0F6D39',
	},
	fallbackCircleError: {
		backgroundColor: '#C62828',
		shadowColor: '#C62828',
	},
	dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#C62828' },
	successDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#0F6D39', opacity: 0.8 },
	fatherNameSection: { marginTop: 8, paddingTop: 10 },
	footerSection: { marginTop: 28, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#d7d7d7', paddingTop: 20 },
	footerBlock: { marginBottom: 16 },
	footerLabel: { fontSize: 17, color: '#333', marginBottom: 4, fontFamily: Font.bold },
	footerValue: { fontSize: 17, color: '#222', lineHeight: 22, fontFamily: Font.regular },
	verificationRow: {
		marginTop: 16,
		marginBottom: 16,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderWidth: 2,
		borderColor: '#000',
		backgroundColor: '#fff',
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	verificationLabel: {
		fontFamily: Font.bold,
		fontSize: Math.min(24, Math.max(18, Dimensions.get('window').width * 0.055)),
		color: '#111',
		flexShrink: 1,
	},
	verificationValue: {
		fontFamily: Font.bold,
		fontSize: Math.min(26, Math.max(20, Dimensions.get('window').width * 0.06)),
		color: '#000',
		letterSpacing: 1,
	},
});