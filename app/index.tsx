import Card from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { FlatList, Image, SafeAreaView, StyleSheet, View, Text } from "react-native";

export default function Index() {
    const colors = useThemeColors()
    const pokemons = Array.from({ length: 35 }, (_, k) => ({
        name: "Pokemon name",
        id: k + 1
    }))
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.tint, padding: 4 }]}>
            <View style={styles.header}>
                <Image source={require("@/assets/images/pokeball.png")} width={24} height={24} />
                <ThemedText variant="headLine" color="grayWhite">Pokédex</ThemedText>
            </View>
            <Card style={styles.body}>
                <FlatList
                    data={pokemons}
                    numColumns={3}
                    contentContainerStyle={[styles.gridGap, styles.list]}
                    columnWrapperStyle={styles.gridGap}
                    renderItem={({ item }) => <Card style={{ flex: 1 / 3, height: 200 }}>
                        <Text>{item.name}</Text>
                    </Card>} keyExtractor={(item) => item.id.toString()} />
            </Card>
        </SafeAreaView>
    )
}

// const styles = {
//     container: {backgroundColor: '#ffff00', padding: 24}
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: 12,
    },
    body: {
        flex: 1
    },
    gridGap: {
        gap: 8
    },
    list: {
        padding: 12
    }
})