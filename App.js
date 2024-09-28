// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreen';
import GameScreen from './GameScreen'; // Asegúrate de que esta pantalla esté importada
import TamagotchiGame from './TamagotchiGame'; // Asegúrate de tener este componente
import MemoriceGame from './MemoriceGame'; // Asegúrate de tener este componente
import JumpMonitoGame from './JumpMonitoGame'; // Asegúrate de tener este componente

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Tamagotchi" component={TamagotchiGame} />
        <Stack.Screen name="Memorice" component={MemoriceGame} />
        <Stack.Screen name="JumpMonito" component={JumpMonitoGame} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
