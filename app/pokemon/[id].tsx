import Card from "@/components/Card";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { Colors } from "@/constants/Colors";
import { formatSize, formatWeight, getPokemonArtwork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Audio } from "expo-av";

export default function Pokemon() {
    const params = useLocalSearchParams() as { id: string }
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id })
    const { data: species } = useFetchQuery("/pokemon-species/[id]", { id: params.id })
    const mainType = pokemon?.types[0].type.name
    const colors = useThemeColors();
    const colorType = mainType ? Colors.types[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries.find(({ language }) => language.name === "en")?.flavor_text.replaceAll("\n", ". ")

    const onImagePress = async () => {
        const cry = pokemon?.cries.latest;
        if (!cry) {
            return;
        }
        const { sound } = await Audio.Sound.createAsync({
            uri: cry
        }, { shouldPlay: true });
        sound.playAsync();
    }
    return <RootView backgroundColor={colorType}>
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
                <Row style={[styles.imageRow]}>
                    <Pressable onPress={onImagePress}>
                        <Image
                            style={[styles.artwork, { width: 200, height: 200 }]}
                            source={{
                                uri: getPokemonArtwork(params.id)
                            }}
                        />
                    </Pressable>
                </Row>
            </View>
            <Card style={[styles.card]}>
                <Row gap={16} style={{ height: 20 }}>
                    {types?.map((type) => {
                        return <PokemonType name={type.type.name} key={type.type.name} />
                    })}
                </Row>
                <ThemedText variant="subtitle1" style={[{ color: colorType }]}>About</ThemedText>
                <Row style={{ alignSelf: "stretch" }}>
                    <PokemonSpec style={{ borderStyle: "solid", borderRightWidth: 1, borderColor: colors.grayLight }} title={formatWeight(pokemon?.weight)} description="Weight" image={require("@/assets/images/weight.png")} />
                    <PokemonSpec style={{ borderStyle: "solid", borderRightWidth: 1, borderColor: colors.grayLight }} title={formatSize(pokemon?.height)} description="Size" image={require("@/assets/images/height.png")} />
                    <PokemonSpec title={pokemon?.moves.slice(0, 2).map(m => m.move.name).join("\n")} description="Moves" />
                </Row>
                <ThemedText>{bio}</ThemedText>

                {/* Stats */}
                <ThemedText variant="subtitle1" style={[{ color: colorType }]}>Base Stats</ThemedText>
                <View style={{ alignSelf: "stretch" }}>
                    {pokemon?.stats.map((s) => <PokemonStat name={s.stat.name} value={s.base_stat} color={colorType} key={s.stat.name} />)}
                </View>
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
    imageRow: {
        alignSelf: "center",
        position: "absolute",
        top: -140,
    },
    artwork: {
        alignSelf: "center",
    },
    body: {
        alignSelf: "stretch",
        marginTop: 144,
        zIndex: 2
    },
    card: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        gap: 16,
        alignItems: "center"
    },
})