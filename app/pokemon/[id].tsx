import Card from "@/components/Card";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { Colors } from "@/constants/Colors";
import { getPokemonArtwork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function Pokemon() {
    const params = useLocalSearchParams() as { id: string }
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id })
    const mainType = pokemon?.types[0].type.name
    const colors = useThemeColors();
    const colorType = mainType ? Colors.types[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    return <RootView style={{ backgroundColor: colorType }}>
        <View >
            <Image style={[styles.pokeball]} source={require("@/assets/images/bigPokeball.png")} />
            <Row style={styles.header}>
                <Pressable onPress={router.back}>
                    <Row>
                        <Image source={require("@/assets/images/arrow_back.png")} width={32} height={32} />
                    </Row>
                </Pressable>
                <ThemedText color="grayWhite" variant="headLine" style={{ textTransform: "capitalize" }}>{pokemon?.name}</ThemedText>
                <ThemedText color="grayWhite" variant="subtitle2">#{params.id.padStart(3, '0')}</ThemedText>
            </Row>
            <View style={styles.body}>
                <Image
                    style={[styles.artwork, { width: 200, height: 200 }]}
                    source={{
                        uri: getPokemonArtwork(params.id)
                    }}
                />
            </View>
            <Card style={[styles.card]}>
                <Row style={{ justifyContent: "center" }} gap={16}>
                    {types?.map((type) => {
                        return <PokemonType name={type.type.name} key={type.type.name} />
                    })}
                </Row>
            </Card>
        </View>
    </RootView>
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: "space-between"
    },
    pokeball: {
        opacity: .1,
        position: "absolute",
        top: 8,
        right: 8
    },
    artwork: {
        alignSelf: "center",
        position: "absolute",
        top: -140,
    },
    body: {
        marginTop: 144,
        zIndex: 2
    },
    card: {
        paddingHorizontal: 20,
        paddingTop: 60,
    }
})