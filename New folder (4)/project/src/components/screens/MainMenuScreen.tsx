import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { Utils, Clipboard } from "@nativescript/core";

type MainMenuScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "MainMenu">;
};

export function MainMenuScreen({ navigation }: MainMenuScreenProps) {
    const SHARE_URL = "https://example.com/asteroid-strike";
    const RATE_URL = "https://example.com/rate-asteroid-strike";

    const handleShare = () => {
        Clipboard.setText(SHARE_URL).then(() => {
            alert("Game URL copied to clipboard!");
        });
    };

    const handleRate = () => {
        Utils.openUrl(RATE_URL);
    };

    const startGame = () => {
        navigation.navigate("Game");
    };

    return (
        <absoluteLayout style={styles.container}>
            <image
                src="~/assets/images/menu-background.jpg"
                stretch="aspectFill"
                style={styles.backgroundImage}
            />
            <flexboxLayout style={styles.content}>
                <label className="text-4xl mb-12 font-bold text-center text-white">
                    Asteroid Strike
                </label>
                <button
                    className="bg-blue-500 text-white p-4 rounded-lg mb-4 w-64 text-xl"
                    onTap={startGame}
                >
                    Play
                </button>
                <button
                    className="bg-green-500 text-white p-4 rounded-lg mb-4 w-64 text-xl"
                    onTap={handleShare}
                >
                    Share
                </button>
                <button
                    className="bg-yellow-500 text-white p-4 rounded-lg w-64 text-xl"
                    onTap={handleRate}
                >
                    Rate
                </button>
            </flexboxLayout>
        </absoluteLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    },
    backgroundImage: {
        width: "100%",
        height: "100%"
    },
    content: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)"
    }
});