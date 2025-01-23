import Card from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Link } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Index() {
    const colors = useThemeColors()
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
            <ThemedText variant="headLine" color="grayWhite">Pokédex</ThemedText>
        </SafeAreaView>
    )
}

// const styles = {
//     container: {backgroundColor: '#ffff00', padding: 24}
// }

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})