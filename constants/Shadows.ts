import { ViewStyle } from "react-native";

export const Shadows = {
  dp2: {
    // Ombre portée pour IOS
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    // Ombre portée pour Android
    elevation: 2,
  },
} satisfies Record<string, ViewStyle>;
