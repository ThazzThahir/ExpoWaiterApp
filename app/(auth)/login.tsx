import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Platform,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LoginForm } from "@/components/auth/LoginForm";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
    const router = useRouter();
    const { users } = useAuthStore();

    const handleDemoLogin = () => {
        Alert.alert(
            "Demo Accounts",
            "You can use these accounts to login:\n\n" +
                "Username: admin\nPassword: 12345\n\n" +
                "Username: staff\nPassword: password",
            [{ text: "OK" }],
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={{
                                uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
                            }}
                            style={styles.logoBackground}
                        />
                        <Text style={styles.logoText}>Waiter App</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.subtitleText}>
                            Sign in to continue
                        </Text>

                        <LoginForm />

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>
                                Don't have an account?{" "}
                            </Text>
                            <Link href="/(auth)/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.signupLink}>
                                        SIGN UP
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                        <TouchableOpacity
                            style={styles.demoButton}
                            onPress={handleDemoLogin}
                        >
                            <Text style={styles.demoButtonText}>
                                View Demo Accounts
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        paddingTop: Platform.OS === "android" ? 40 : 0,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 40,
    },
    logoBackground: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    formContainer: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: colors.textLight,
        marginBottom: 30,
    },
    signupContainer: {
        flexDirection: "row",
        marginTop: 30,
        marginBottom: 20,
    },
    signupText: {
        color: colors.textLight,
        fontSize: 14,
    },
    signupLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: "bold",
    },
    demoButton: {
        marginTop: 10,
        padding: 10,
    },
    demoButtonText: {
        color: colors.textLight,
        fontSize: 14,
        textDecorationLine: "underline",
    },
});
