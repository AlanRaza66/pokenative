import Card from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { getPokemonId } from "@/functions/pokemon";
import { useFetchQuery, useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, View } from "react-native";

export default function Index() {
    const colors = useThemeColors();
    // Fetch only one page
    // const { data, isFetching } = useFetchQuery("/pokemon?limit=21");
    // const pokemons = data?.results ?? [];
    const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery("/pokemon?limit=21");
    const pokemons = data?.pages.flatMap(page => page.results) ?? [];
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
                    onEndReached={() => fetchNextPage()}
                    ListFooterComponent={
                        isFetching ? <ActivityIndicator color={colors.tint} /> : null
                    }
                    renderItem={({ item }) => <PokemonCard id={getPokemonId(item.url)} name={item.name} style={{ flex: 1 / 3 }} />
                    } keyExtractor={(item) => item.url} />
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