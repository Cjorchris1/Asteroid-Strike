import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";

type DisclaimerScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Disclaimer">;
};

export function DisclaimerScreen({ navigation }: DisclaimerScreenProps) {
    return (
        <flexboxLayout style={styles.container}>
            <flexboxLayout style={styles.content}>
                <label style={styles.warningText}>
                    ⚠️ WARNING ⚠️
                </label>
                <label style={styles.mainText}>
                    game contains jump scares and loud noises.
                </label>
                <label style={styles.volumeText}>
                    Please MAX THE VOLUME! 
                </label>
                <button
                    style={styles.button}
                    onTap={() => navigation.navigate("MainMenu")}
                >
                    I Understand
                </button>
            </flexboxLayout>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        padding: 20
    },
    content: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        gap: 12
    },
    warningText: {
        color: "#ff0000",
        fontSize: 18,
        fontWeight: "bold",
        textAlignment: "center",
        marginBottom: 12
    },
    mainText: {
        color: "#ffffff",
        fontSize: 14,
        textAlignment: "center",
        textWrapping: "wrap",
        width: "100%",
        marginBottom: 6
    },
    volumeText: {
        color: "#ffffff",
        fontSize: 12,
        textAlignment: "center",
        textWrapping: "wrap",
        width: "100%",
        marginBottom: 16
    },
    button: {
        backgroundColor: "#ff0000",
        color: "#ffffff",
        fontSize: 14,
        padding: 8,
        borderRadius: 6,
        width: 120,
        textAlignment: "center"
    }
});