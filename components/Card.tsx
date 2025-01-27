import { Shadows } from "@/constants/Shadows";
import { useThemeColors } from "@/hooks/useThemeColors";
import { View, ViewProps, ViewStyle } from "react-native";

type Props = ViewProps

export default function Card({ style, ...rest }: Props) {
    const colors = useThemeColors()
    return <View style={[style, styles, { backgroundColor: colors.grayWhite }]} {...rest} ></View>
}

const styles = {
    borderRadius: 8,
    overflow: "hidden",
    ...Shadows.dp2
} satisfies ViewStyle;