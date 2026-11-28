/**
 * IndividualChatScreen - Single conversation screen with live chat & drafts
 * Part of the MVC View layer.
 */
import React, { useRef } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useIndividualChatController } from "../../controllers/useIndividualChatController";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import TypingIndicator from "../components/TypingIndicator";
import ConnectionBanner from "../components/ConnectionBanner";
import { theme } from "../styles/theme";

export default function IndividualChatScreen({ route }) {
  const { chatId, name } = route.params || {};
  const headerHeight = useHeaderHeight();
  const listRef = useRef(null);

  const {
    messages,
    draft,
    typingUser,
    isConnected,
    reconnect,
    handleDraftChange,
    sendMessage,
  } = useIndividualChatController(chatId, name);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <ConnectionBanner isConnected={isConnected} onRetry={reconnect} />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => String(item.id || Math.random())}
        contentContainerStyle={styles.list}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => <MessageBubble message={item} />}
      />

      <TypingIndicator username={typingUser} />

      <MessageInput
        value={draft}
        onChangeText={handleDraftChange}
        onSend={sendMessage}
        placeholder="Message"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: 8,
  },
});
