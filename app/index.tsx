import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Edit app/index.tsx to edit this screen</Text>
            <Link href="/about">A propos</Link>
        </View>
    )
}

// const styles = {
//     container: {backgroundColor: '#ffff00', padding: 24}
// }

const styles = StyleSheet.create({
    container: {backgroundColor: '#ffff00', padding: 24}
})