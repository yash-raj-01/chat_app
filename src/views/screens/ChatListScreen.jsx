/**
 * ChatListScreen - Main screen showing all conversations
 * Part of the MVC View layer.
 */
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useChatListController } from "../../controllers/useChatListController";
import ChatItem from "../components/ChatItem";
import { theme } from "../styles/theme";

export default function ChatListScreen({ navigation }) {
  const {
    chats,
    loading,
    refreshing,
    error,
    onRefresh,
    handleChatPress,
  } = useChatListController(navigation);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
                <Text style={styles.emptyText}>No conversations yet</Text>
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
