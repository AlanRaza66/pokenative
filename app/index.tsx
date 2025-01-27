import Card from "@/components/Card";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { SortButton } from "@/components/SortButton";
import { ThemedText } from "@/components/ThemedText";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { getPokemonId } from "@/functions/pokemon";
import { useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, View } from "react-native";

export default function Index() {
    const colors = useThemeColors();
    // Fetch only one page
    // const { data, isFetching } = useFetchQuery("/pokemon?limit=21");
    // const pokemons = data?.results ?? [];
    const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery("/pokemon?limit=21");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<"id" | "name">("id");
    const pokemons = data?.pages.flatMap(page => page.results.map(r => ({ name: r.name, id: getPokemonId(r.url), url: r.url }))) ?? [];
    const filteredPokemons = [...search
        ? pokemons.filter(p =>
            p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            getPokemonId(p.url).toString().includes(search)
        )
        : pokemons].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1));
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.tint, padding: 4 }]}>
            <Row style={styles.header} gap={16}>
                <Image source={require("@/assets/images/pokeball.png")} width={24} height={24} />
                <ThemedText variant="headLine" color="grayWhite">Pokédex</ThemedText>
            </Row>
            <Row gap={16} style={[styles.form]}>
                <SearchBar value={search} onChange={setSearch} />
                <SortButton value={sortKey} onChange={setSortKey} />
            </Row>
            <Card style={styles.body}>
                <FlatList
                    data={filteredPokemons}
                    numColumns={3}
                    contentContainerStyle={[styles.gridGap, styles.list]}
                    columnWrapperStyle={styles.gridGap}
                    // onEndReached={search ? undefined : () => fetchNextPage()}
                    onEndReached={() => fetchNextPage()}
                    ListFooterComponent={
                        isFetching ? <ActivityIndicator color={colors.tint} /> : null
                    }
                    renderItem={({ item }) => <PokemonCard id={item.id} name={item.name} style={{ flex: 1 / 3 }} />
                    } keyExtractor={(item) => item.id.toString()} />
            </Card>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
    },
    header: {
        paddingHorizontal: 12,
        paddingBottom: 8
    },
    body: {
        flex: 1,
        marginTop: 16
    },
    gridGap: {
        gap: 8
    },
    list: {
        padding: 12
    },
    form: {
        paddingHorizontal: 12
    }
})