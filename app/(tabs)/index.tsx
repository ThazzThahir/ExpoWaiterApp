import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/components/common/AppThemeProvider"; // Ensure this hook is imported

export default function TabOneScreen() {
    const { colors } = useAppTheme(); // Access theme colors
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab One</Text>
            <View style={styles.separator} />
            <Text>
                This is an example tab. You can edit it in
                app/%28tabs%29/index.tsx.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background, // Reference colors for background
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
