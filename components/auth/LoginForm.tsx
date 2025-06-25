import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { User, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { validateUsername, validatePassword } from '@/utils/validation';
import { colors } from '@/constants/colors';

export const LoginForm = () => {
    const { login, isLoading, error, clearError } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

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

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        // Validate inputs
        const usernameValidationError = validateUsername(username);
        const passwordValidationError = validatePassword(password);

        setUsernameError(usernameValidationError);
        setPasswordError(passwordValidationError);

        if (!usernameValidationError && !passwordValidationError) {
            await login(username, password);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.form}>
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

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    form: {
        width: '100%',
        paddingHorizontal: 20,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginBottom: 10,
        marginTop: -5,
    },
});