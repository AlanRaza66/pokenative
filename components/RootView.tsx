import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps;

export function RootView({ style, ...rest }: Props) {
    const colors = useThemeColors();
    return <SafeAreaView style={[rootStyle, { backgroundColor: colors.tint, padding: 4 }, style]} {...rest}>
    </SafeAreaView>
}

const rootStyle = {
    flex: 1,
    padding: 4,
}