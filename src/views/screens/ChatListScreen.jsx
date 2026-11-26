/**
 * ChatListScreen - Main screen showing all conversations with search and session resume
 * Part of the MVC View layer.
 */
import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useChatListController } from "../../controllers/useChatListController";
import { useSessionRestoreController } from "../../controllers/useSessionRestoreController";
import ChatItem from "../components/ChatItem";
import SearchBar from "../components/SearchBar";
import { theme } from "../styles/theme";

export default function ChatListScreen({ navigation }) {
  const {
    chats,
    searchQuery,
    setSearchQuery,
    clearSearch,
    loading,
    refreshing,
    error,
    onRefresh,
    handleChatPress,
  } = useChatListController(navigation);

  const { lastChat, resumeLastChat, dismissResume } = useSessionRestoreController(
    navigation,
    chats
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={clearSearch}
        />

        {Boolean(lastChat) && (
          <View style={styles.resumeBanner}>
            <View style={styles.resumeInfo}>
              <Text style={styles.resumeTitle}>Resume Conversation</Text>
              <Text style={styles.resumeText}>
                Pick up where you left off with {lastChat.name}
              </Text>
            </View>
            <View style={styles.resumeActions}>
              <Pressable
                style={styles.resumeButton}
                onPress={resumeLastChat}
                accessibilityRole="button"
              >
                <Text style={styles.resumeButtonText}>Open</Text>
              </Pressable>
              <Pressable
                style={styles.dismissButton}
                onPress={dismissResume}
                accessibilityRole="button"
              >
                <Text style={styles.dismissButtonText}>×</Text>
              </Pressable>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{error}</Text>
          </View>
        )}

        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => String(item.id)}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={chats.length === 0 ? styles.emptyContainer : null}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>
                  {searchQuery ? "No matching conversations found" : "No conversations yet"}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <ChatItem chat={item} onPress={() => handleChatPress(item)} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  resumeBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#eff6ff",
    borderBottomWidth: 1,
    borderBottomColor: "#dbeafe",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e40af",
  },
  resumeText: {
    fontSize: 12,
    color: "#3b82f6",
    marginTop: 2,
  },
  resumeActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resumeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  resumeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  dismissButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  dismissButtonText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "600",
  },
  banner: {
    backgroundColor: "#fffbeb",
    borderBottomWidth: 1,
    borderBottomColor: "#fef3c7",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerText: {
    fontSize: 13,
    color: "#b45309",
    textAlign: "center",
  },
});
