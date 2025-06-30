import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { User, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { validateUsername, validatePassword } from '@/utils/validation';

export default function SignupScreen() {
    const router = useRouter();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        setUsernameError(null);
        if (error) clearError();
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setPasswordError(null);
        if (error) clearError();
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        setConfirmPasswordError(null);
        if (error) clearError();
    };

    const handleNameChange = (text: string) => {
        setName(text);
        setNameError(null);
        if (error) clearError();
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async () => {
        // Validate inputs
        const usernameValidationError = validateUsername(username);
        const passwordValidationError = validatePassword(password);
        let confirmPasswordValidationError = null;
        let nameValidationError = null;

        if (!name) {
            nameValidationError = 'Name is required';
        }

        if (!confirmPassword) {
            confirmPasswordValidationError = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            confirmPasswordValidationError = 'Passwords do not match';
        }

        setUsernameError(usernameValidationError);
        setPasswordError(passwordValidationError);
        setConfirmPasswordError(confirmPasswordValidationError);
        setNameError(nameValidationError);

        if (!usernameValidationError && !passwordValidationError && !confirmPasswordValidationError && !nameValidationError) {
            const success = await register(username, password, name);
            if (success) {
                router.replace("/(auth)/login");
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <ChevronLeft size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Create Account</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoidingView}
                    >
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <View style={styles.formContainer}>
                                <Text style={styles.welcomeText}>Join Waiter App</Text>
                                <Text style={styles.subtitleText}>Create your account</Text>

                                <View style={styles.form}>
                                    <View style={styles.inputContainer}>
                                        <User size={20} color={colors.textLight} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Full Name"
                                            value={name}
                                            onChangeText={handleNameChange}
                                            autoCapitalize="words"
                                            placeholderTextColor={colors.textLight}
                                        />
                                    </View>
                                    {nameError && <Text style={styles.errorText}>{nameError}</Text>}

                                    <View style={styles.inputContainer}>
                                        <User size={20} color={colors.textLight} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Username"
                                            value={username}
                                            onChangeText={handleUsernameChange}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            placeholderTextColor={colors.textLight}
                                        />
                                    </View>
                                    {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

                                    <View style={styles.inputContainer}>
                                        <Lock size={20} color={colors.textLight} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Password"
                                            value={password}
                                            onChangeText={handlePasswordChange}
                                            secureTextEntry={!showPassword}
                                            placeholderTextColor={colors.textLight}
                                        />
                                        <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
                                            {showPassword ? (
                                                <EyeOff size={20} color={colors.textLight} />
                                            ) : (
                                                <Eye size={20} color={colors.textLight} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                                    <View style={styles.inputContainer}>
                                        <Lock size={20} color={colors.textLight} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChangeText={handleConfirmPasswordChange}
                                            secureTextEntry={!showConfirmPassword}
                                            placeholderTextColor={colors.textLight}
                                        />
                                        <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.eyeIcon}>
                                            {showConfirmPassword ? (
                                                <EyeOff size={20} color={colors.textLight} />
                                            ) : (
                                                <Eye size={20} color={colors.textLight} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

                                    {error && <Text style={styles.errorText}>{error}</Text>}

                                    <TouchableOpacity
                                        style={styles.signupButton}
                                        onPress={handleSubmit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.signupButtonText}>SIGN UP</Text>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.loginContainer}>
                                        <Text style={styles.loginText}>Already have an account? </Text>
                                        <Link href="/(auth)/login" asChild>
                                            <TouchableOpacity>
                                                <Text style={styles.loginLink}>LOGIN</Text>
                                            </TouchableOpacity>
                                        </Link>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: colors.textLight,
        marginBottom: 30,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 12,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: colors.text,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 8,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginBottom: 10,
        marginTop: -5,
    },
    signupButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    loginText: {
        color: colors.textLight,
        fontSize: 14,
    },
    loginLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});