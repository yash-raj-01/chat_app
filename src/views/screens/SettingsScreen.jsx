/**
 * SettingsScreen - App configuration and local storage management
 * Part of the MVC View layer.
 */
import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useSettingsController } from "../../controllers/useSettingsController";
import { theme } from "../styles/theme";

export default function SettingsScreen() {
  const {
    serverHost,
    setServerHost,
    autoResume,
    handleToggleAutoResume,
    savedStatus,
    storageCount,
    handleSaveHost,
    handleClearCache,
  } = useSettingsController();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Server Configuration</Text>
          <Text style={styles.description}>
            Enter the LAN IP and port of your running chat backend server (e.g. 192.168.1.7:3001).
          </Text>

          <TextInput
            style={styles.input}
            value={serverHost}
            onChangeText={setServerHost}
            placeholder="192.168.1.7:3001"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleSaveHost}
          >
            <Text style={styles.buttonText}>Save Server IP</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Preferences</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Auto-resume last conversation</Text>
              <Text style={styles.switchSubLabel}>
                Reopen the chat you were viewing when restarting the app
              </Text>
            </View>
            <Switch
              value={autoResume}
              onValueChange={handleToggleAutoResume}
              trackColor={{ false: "#d2dce2", true: theme.colors.primaryLight }}
              thumbColor={autoResume ? theme.colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Storage & Cache</Text>
          <Text style={styles.description}>
            Local AsyncStorage keys currently stored: {storageCount}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.dangerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleClearCache}
          >
            <Text style={styles.buttonText}>Clear Cached Data</Text>
          </Pressable>
        </View>

        {Boolean(savedStatus) && (
          <View style={styles.statusToast}>
            <Text style={styles.statusText}>{savedStatus}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chat App v1.0.0 (MVC Architecture)</Text>
          <Text style={styles.footerText}>Built with React Native & Expo</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  section: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.title,
    fontSize: 17,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  switchSubLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#f9fafb",
    color: theme.colors.textPrimary,
  },
  button: {
    height: 44,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: "#dc2626",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: theme.colors.textWhite,
    fontWeight: "700",
    fontSize: 15,
  },
  statusToast: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statusText: {
    color: "#065f46",
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
