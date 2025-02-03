import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";

import { DisclaimerScreen } from "./screens/DisclaimerScreen";
import { MainMenuScreen } from "./screens/MainMenuScreen";
import { GameScreen } from "./screens/GameScreen";
import { GameOverScreen } from "./screens/GameOverScreen";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Disclaimer"
            screenOptions={{
                headerShown: false
            }}
        >
            <StackNavigator.Screen
                name="Disclaimer"
                component={DisclaimerScreen}
            />
            <StackNavigator.Screen
                name="MainMenu"
                component={MainMenuScreen}
            />
            <StackNavigator.Screen
                name="Game"
                component={GameScreen}
            />
            <StackNavigator.Screen
                name="GameOver"
                component={GameOverScreen}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);