import * as React from "react";
import { ImageSource } from "@nativescript/core";
import { StyleSheet } from "react-nativescript";

interface GameIconProps {
    name: string;
    size?: number;
    style?: any;
}

export function GameIcon({ name, size = 32, style }: GameIconProps) {
    // Determine the correct path based on the icon name
    const getIconPath = (name: string) => {
        // Game UI icons
        if (['pause', 'resume', 'sound-on', 'sound-off'].includes(name)) {
            return `~/assets/icons/game/${name}.png`;
        }
        // Menu icons
        if (['play', 'share', 'rate'].includes(name)) {
            return `~/assets/icons/menu/${name}.png`;
        }
        // Default to app icons
        return `~/assets/icons/app/${name}.png`;
    };

    return (
        <image
            src={getIconPath(name)}
            style={[
                styles.icon,
                {
                    width: size,
                    height: size
                },
                style
            ]}
        />
    );
}

const styles = StyleSheet.create({
    icon: {
        objectFit: 'contain'
    }
});