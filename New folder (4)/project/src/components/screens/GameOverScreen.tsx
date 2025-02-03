import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { RouteProp } from "@react-navigation/core";
import { MainStackParamList } from "../../NavigationParamList";

type GameOverScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "GameOver">;
    route: RouteProp<MainStackParamList, "GameOver">;
};

export function GameOverScreen({ navigation, route }: GameOverScreenProps) {
    const { score, completed } = route.params;

    return (
        <flexboxLayout style={styles.container}>
            <label className="text-3xl mb-8 font-bold text-center text-white">
                {completed ? "Congratulations!" : "Game Over"}
            </label>
            <label className="text-xl mb-8 text-center text-white">
                Score: {score}
            </label>
            <button
                className="bg-gray-500 text-white p-4 rounded-lg w-64"
                onTap={() => navigation.navigate("MainMenu")}
            >
                Main Menu
            </button>
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
    }
});