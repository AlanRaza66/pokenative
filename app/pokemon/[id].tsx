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
import PagerView from "react-native-pager-view";
import { useRef, useState } from "react";

export default function Pokemon() {
    const params = useLocalSearchParams() as { id: string }
    const [id, setId] = useState(parseInt(params.id, 10));
    const offset = useRef(1);
    const pager = useRef<PagerView>(null)

    const onPageSelected = (e: { nativeEvent: { position: number } }) => {
        offset.current = e.nativeEvent.position - 1
    }

    const onPageScrollStateChanged = (e: { nativeEvent: { pageScrollState: string } }) => {
        if (e.nativeEvent.pageScrollState === 'idle') {
            return;
        }
        if (offset.current === -1 && id === 2) {
            return;
        }
        if (e.nativeEvent.pageScrollState === 'idle' && offset.current !== 1) {
            setId(id + offset.current)
            offset.current = 0
            pager.current?.setPageWithoutAnimation(1);
        }
    }

    const onPrevious = () => {
        pager.current?.setPage(0);
    }
    const onNext = () => {
        pager.current?.setPage(offset.current + 2);
    }

    return <PagerView initialPage={1} style={{ flex: 1 }} onPageSelected={onPageSelected} onPageScrollStateChanged={onPageScrollStateChanged}>
        <PokemonView onNext={onNext} onPrevious={onPrevious} key={id - 1} id={id - 1} />
        <PokemonView onNext={onNext} onPrevious={onPrevious} key={id} id={id} />
        <PokemonView onNext={onNext} onPrevious={onPrevious} key={id + 1} id={id + 1} />
    </PagerView>
}


type Props = {
    id: number;
    onPrevious: () => void;
    onNext: () => void;
}

function PokemonView({ id, onPrevious, onNext }: Props) {

    const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: id })
    const { data: species } = useFetchQuery("/pokemon-species/[id]", { id: id })
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
                <ThemedText color="grayWhite" variant="subtitle2">#{id.toString().padStart(3, '0')}</ThemedText>
            </Row>
            <Card style={[styles.card]}>
                <Row style={[styles.imageRow]}>
                    {id === 1 ? <View style={{ width: 24, height: 24 }}></View> : <Pressable onPress={onPrevious}>
                        <Image
                            height={24}
                            width={24}
                            source={require("@/assets/images/prev.png")}
                        />
                    </Pressable>}
                    <Pressable onPress={onImagePress}>
                        <Image
                            style={[styles.artwork, { width: 200, height: 200 }]}
                            source={{
                                uri: getPokemonArtwork(id)
                            }}
                        />
                    </Pressable>
                    <Pressable onPress={onNext}>
                        <Image
                            height={24}
                            width={24}
                            source={require("@/assets/images/next.png")}
                        />
                    </Pressable>
                </Row>
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
        justifyContent: "space-between",
        left: 0,
        right: 0,
        paddingHorizontal: 20
    },
    artwork: {
        alignSelf: "center",
    },
    card: {
        overflow: "visible",
        marginTop: 144,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        gap: 16,
        alignItems: "center"
    },
})