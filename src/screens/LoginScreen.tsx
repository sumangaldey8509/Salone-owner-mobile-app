import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from 'lucide-react-native';
import { colors, typography } from '../theme';

type FormErrors = {
  username?: string;
  password?: string;
};

const KEYBOARD_GAP = 24;
const KEYBOARD_SCROLL_SPACE = 440;

export function LoginScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const focusedInputRef = useRef<TextInput | null>(null);
  const keyboardTopRef = useRef<number | null>(null);
  const scrollOffsetRef = useRef(0);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [keyboardInset, setKeyboardInset] = useState(0);

  const revealInput = useCallback((input: TextInput | null, keyboardTop?: number) => {
    const visibleKeyboardTop = keyboardTop ?? keyboardTopRef.current;

    if (!input || !visibleKeyboardTop) return;

    requestAnimationFrame(() => {
      input.measureInWindow((_x, y, _width, height) => {
        const overlap = y + height + KEYBOARD_GAP - visibleKeyboardTop;

        if (overlap > 0) {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, scrollOffsetRef.current + overlap),
            animated: true,
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    const handleKeyboardFrame = (event: KeyboardEvent) => {
      keyboardTopRef.current = event.endCoordinates.screenY;
      setKeyboardInset(Math.max(event.endCoordinates.height + KEYBOARD_GAP, 320));

      setTimeout(() => {
        revealInput(focusedInputRef.current, event.endCoordinates.screenY);
      }, 100);
    };

    const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardFrame);
    const frameSubscription =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardDidChangeFrame', handleKeyboardFrame)
        : null;
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      keyboardTopRef.current = null;
      focusedInputRef.current = null;
      setKeyboardInset(0);
    });

    return () => {
      showSubscription.remove();
      frameSubscription?.remove();
      hideSubscription.remove();
    };
  }, [revealInput]);

  const handleFocus = (input: TextInput | null, fallbackScrollY: number) => {
    focusedInputRef.current = input;
    setKeyboardInset(current => Math.max(current, KEYBOARD_SCROLL_SPACE));

    setTimeout(() => {
      const keyboardMetrics =
        typeof Keyboard.metrics === 'function' ? Keyboard.metrics() : undefined;
      const keyboardTop = keyboardMetrics?.screenY ?? Dimensions.get('window').height;

      keyboardTopRef.current = keyboardTop;
      scrollViewRef.current?.scrollTo({ y: fallbackScrollY, animated: true });
      revealInput(input, keyboardTop);
    }, Platform.OS === 'ios' ? 180 : 300);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  };

  const handleLogin = () => {
    const nextErrors: FormErrors = {};

    if (!username.trim()) nextErrors.username = 'ইউজারনেম লিখুন';
    if (!password.trim()) nextErrors.password = 'পাসওয়ার্ড লিখুন';

    setErrors(nextErrors);
    setSuccessMessage('');

    if (Object.keys(nextErrors).length > 0) return;

    Keyboard.dismiss();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('লগইন তথ্য প্রস্তুত। API যুক্ত হলে এখান থেকেই যাচাই হবে।');
    }, 700);
  };

  return (
    <View style={styles.root} testID="login-screen">
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              keyboardInset > 0 && { paddingBottom: keyboardInset },
            ]}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="always"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <Image
                source={require('../../assets/login-hero-botanical.png')}
                style={styles.heroBotanical}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />

              <Image
                source={require('../../assets/logo-option-5.png')}
                style={styles.logo}
                resizeMode="contain"
                tintColor={colors.background}
                accessibilityLabel="সুমন্ত সেলুনের লোগো"
              />
              <Text style={styles.brandName}>সুমন্ত সেলুন</Text>

              <View style={styles.ownerLabelRow}>
                <View style={styles.ownerDivider} />
                <Text style={styles.ownerLabel}>ওনার অ্যাপ</Text>
                <View style={styles.ownerDivider} />
              </View>
            </View>

            <View style={styles.formSurface}>
              <Text style={styles.heading}>স্বাগতম</Text>
              <Text style={styles.subtitle}>আপনার অ্যাকাউন্টে লগইন করুন</Text>

              <View style={styles.form}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.username && styles.inputContainerError,
                  ]}
                >
                  <UserRound color={colors.primary} size={27} strokeWidth={1.8} />
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>ইউজারনেম</Text>
                    <TextInput
                      ref={usernameRef}
                      accessibilityLabel="ইউজারনেম"
                      style={styles.input}
                      value={username}
                      onChangeText={(value) => {
                        setUsername(value);
                        setErrors(current => ({ ...current, username: undefined }));
                        setSuccessMessage('');
                      }}
                      placeholder="আপনার ইউজারনেম লিখুন"
                      placeholderTextColor={colors.textMuted}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="username"
                      returnKeyType="next"
                      onFocus={() => handleFocus(usernameRef.current, 220)}
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                  </View>
                </View>
                {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

                <View
                  style={[
                    styles.inputContainer,
                    styles.passwordContainer,
                    errors.password && styles.inputContainerError,
                  ]}
                >
                  <LockKeyhole color={colors.primary} size={27} strokeWidth={1.8} />
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>পাসওয়ার্ড</Text>
                    <TextInput
                      ref={passwordRef}
                      accessibilityLabel="পাসওয়ার্ড"
                      style={[styles.input, styles.passwordInput]}
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        setErrors(current => ({ ...current, password: undefined }));
                        setSuccessMessage('');
                      }}
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="current-password"
                      returnKeyType="done"
                      onFocus={() => handleFocus(passwordRef.current, 450)}
                      onSubmitEditing={handleLogin}
                    />
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={passwordVisible ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                    hitSlop={10}
                    onPress={() => setPasswordVisible(current => !current)}
                    style={({ pressed }) => [styles.eyeButton, pressed && styles.controlPressed]}
                  >
                    {passwordVisible ? (
                      <EyeOff color={colors.textSecondary} size={25} strokeWidth={1.8} />
                    ) : (
                      <Eye color={colors.textSecondary} size={25} strokeWidth={1.8} />
                    )}
                  </Pressable>
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                {successMessage ? (
                  <View style={styles.successRow} accessibilityLiveRegion="polite">
                    <CheckCircle2 color={colors.success} size={17} />
                    <Text style={styles.successText}>{successMessage}</Text>
                  </View>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="লগইন করুন"
                  disabled={isSubmitting}
                  onPress={handleLogin}
                  style={({ pressed }) => [
                    styles.loginButton,
                    pressed && styles.loginButtonPressed,
                    isSubmitting && styles.loginButtonDisabled,
                  ]}
                >
                  {isSubmitting ? (
                    <>
                      <ActivityIndicator color={colors.white} size="small" />
                      <Text style={styles.loginButtonText}>যাচাই হচ্ছে...</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>লগইন করুন</Text>
                      <ArrowRight color={colors.white} size={23} strokeWidth={2} />
                    </>
                  )}
                </Pressable>
              </View>

              <View style={styles.securitySection}>
                <CheckCircle2 color={colors.primary} size={28} strokeWidth={1.8} />
                <Text style={styles.securityText}>আপনার তথ্য নিরাপদ ও সুরক্ষিত</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 390 : undefined,
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.primary,
  },
  hero: {
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: 20,
    paddingBottom: 48,
    backgroundColor: colors.primary,
  },
  heroBotanical: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.26,
  },
  logo: {
    width: 150,
    height: 150,
  },
  brandName: {
    marginTop: -8,
    color: colors.background,
    fontFamily: typography.family,
    fontSize: 40,
    fontWeight: typography.weights.heavy,
    lineHeight: 50,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  ownerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 3,
  },
  ownerDivider: {
    width: 38,
    height: 1.5,
    borderRadius: 2,
    backgroundColor: 'rgba(251,247,239,0.78)',
  },
  ownerLabel: {
    color: colors.background,
    fontFamily: typography.family,
    fontSize: 19,
    fontWeight: typography.weights.semibold,
    lineHeight: 26,
  },
  formSurface: {
    flexGrow: 1,
    marginTop: -36,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 28,
    borderTopLeftRadius: 52,
    borderTopRightRadius: 52,
    backgroundColor: colors.background,
  },
  heading: {
    color: colors.primary,
    fontFamily: typography.family,
    fontSize: 35,
    fontWeight: typography.weights.heavy,
    lineHeight: 44,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: typography.family,
    fontSize: 16,
    fontWeight: typography.weights.medium,
    lineHeight: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    marginTop: 24,
  },
  inputContainer: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(7,93,62,0.08)',
    borderRadius: 20,
    backgroundColor: '#EAF1EC',
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  passwordContainer: {
    marginTop: 14,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    color: colors.textPrimary,
    fontFamily: typography.family,
    fontSize: 16,
    fontWeight: typography.weights.semibold,
    lineHeight: 21,
  },
  input: {
    minHeight: 27,
    padding: 0,
    color: colors.textPrimary,
    fontFamily: typography.family,
    fontSize: 15,
    fontWeight: typography.weights.medium,
    lineHeight: 21,
  },
  passwordInput: {
    paddingRight: 4,
  },
  eyeButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
  },
  controlPressed: {
    backgroundColor: 'rgba(7,93,62,0.08)',
  },
  errorText: {
    marginTop: 5,
    marginLeft: 7,
    marginBottom: 7,
    color: colors.error,
    fontFamily: typography.family,
    fontSize: 13,
    fontWeight: typography.weights.semibold,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  successText: {
    flex: 1,
    color: colors.success,
    fontFamily: typography.family,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    lineHeight: 19,
  },
  loginButton: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: colors.primary,
    shadowColor: '#064C34',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: Platform.OS === 'android' ? 0 : 0.18,
    shadowRadius: 14,
    elevation: Platform.OS === 'android' ? 5 : 0,
  },
  loginButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.992 }],
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.white,
    fontFamily: typography.family,
    fontSize: 21,
    fontWeight: typography.weights.bold,
    lineHeight: 28,
  },
  securitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 26,
  },
  securityText: {
    color: colors.textSecondary,
    fontFamily: typography.family,
    fontSize: 14,
    fontWeight: typography.weights.medium,
    lineHeight: 21,
    textAlign: 'center',
  },
});
