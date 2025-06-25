import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/components/common/AppThemeProvider";

export default function TabOneScreen() {
    const { colors } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Tab One</Text>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <Text style={{ color: colors.textLight }}>
                This is an example tab. You can edit it in app/%28tabs%29/index.tsx.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});