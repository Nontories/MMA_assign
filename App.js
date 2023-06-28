import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MenuList from './components/MenuList'
import FavoriteList from './components/FavoriteList';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider
      style={{
        flex: 1,
      }}
    >
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Orchids"
            component={MenuList}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="flower" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Favorite"
            component={FavoriteList}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="heart" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
