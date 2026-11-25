/**
 * App Root - Navigation setup and providers
 * Configures the Native Stack Navigator for MVC Views.
 */
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ChatListScreen from "./src/views/screens/ChatListScreen";
import IndividualChatScreen from "./src/views/screens/IndividualChatScreen";
import SettingsScreen from "./src/views/screens/SettingsScreen";
import { theme } from "./src/views/styles/theme";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Chats"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerTintColor: theme.colors.primary,
            headerTitleStyle: {
              fontWeight: "700",
              color: theme.colors.textPrimary,
            },
            headerShadowVisible: true,
          }}
        >
          <Stack.Screen
            name="Chats"
            component={ChatListScreen}
            options={({ navigation }) => ({
              title: "Chats",
              headerLargeTitle: true,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                  style={styles.settingsButton}
                  accessibilityLabel="Open settings"
                  accessibilityRole="button"
                >
                  <Text style={styles.settingsButtonText}>Settings</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Individual Chat"
            component={IndividualChatScreen}
            options={({ route }) => ({
              title: route.params?.name || "Chat",
              headerBackTitle: "Chats",
            })}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: "Settings",
              headerBackTitle: "Chats",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  settingsButtonText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
