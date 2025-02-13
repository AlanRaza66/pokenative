import { Colors } from "@/constants/Colors"
import { View, ViewStyle } from "react-native"
import { ThemedText } from "../ThemedText"

type Props = {
    name: keyof typeof Colors["types"]
}

export function PokemonType({ name }: Props) {
    return <View style={[rootStyle, { backgroundColor: Colors.types[name] }]}>
        <ThemedText color="grayWhite" variant="subtitle3" style={{ textTransform: "capitalize" }}>{name}</ThemedText>
    </View>
}

const rootStyle = {
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 8
} satisfies ViewStyle