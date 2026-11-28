/**
 * IndividualChatScreen - Single conversation screen with live chat, reactions & drafts
 * Part of the MVC View layer.
 */
import React, { useRef, useState, useEffect } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useIndividualChatController } from "../../controllers/useIndividualChatController";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import TypingIndicator from "../components/TypingIndicator";
import ConnectionBanner from "../components/ConnectionBanner";
import MessageActionsModal from "../components/MessageActionsModal";
import { theme } from "../styles/theme";

export default function IndividualChatScreen({ route }) {
  const { chatId, name } = route.params || {};
  const headerHeight = useHeaderHeight();
  const listRef = useRef(null);
  const initialHeightRef = useRef(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

  const {
    messages,
    draft,
    typingUser,
    isConnected,
    selectedMessage,
    setSelectedMessage,
    handleToggleReaction,
    handleDeleteMessage,
    reconnect,
    handleDraftChange,
    sendMessage,
  } = useIndividualChatController(chatId, name);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const onKeyboardShow = (e) => {
      const height = e?.endCoordinates?.height || 0;
      setAndroidKeyboardHeight(height);
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 50);
    };

    const onKeyboardHide = () => {
      setAndroidKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleContainerLayout = (e) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0) {
      if (
        !initialHeightRef.current ||
        (androidKeyboardHeight === 0 && height > initialHeightRef.current)
      ) {
        initialHeightRef.current = height;
      }
      setContainerHeight(height);
    }
  };

  const osShrinkAmount =
    initialHeightRef.current > 0 && containerHeight > 0
      ? Math.max(0, initialHeightRef.current - containerHeight)
      : 0;
  const effectivePadding = Math.max(0, androidKeyboardHeight - osShrinkAmount);

  const Container = Platform.OS === "ios" ? KeyboardAvoidingView : View;
  const containerProps =
    Platform.OS === "ios"
      ? {
          behavior: "padding",
          keyboardVerticalOffset: headerHeight,
        }
      : {
          onLayout: handleContainerLayout,
        };

  return (
    <Container
      style={[
        styles.container,
        Platform.OS === "android" && { paddingBottom: effectivePadding },
      ]}
      {...containerProps}
    >
      <ConnectionBanner isConnected={isConnected} onRetry={reconnect} />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => String(item.id || Math.random())}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            onLongPress={(msg) => {
              Keyboard.dismiss();
              setSelectedMessage(msg);
            }}
          />
        )}
      />

      <TypingIndicator username={typingUser} />

      <MessageInput
        value={draft}
        onChangeText={handleDraftChange}
        onSend={sendMessage}
        placeholder="Message"
      />

      <MessageActionsModal
        visible={Boolean(selectedMessage)}
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onSelectReaction={handleToggleReaction}
        onDeleteMessage={handleDeleteMessage}
      />
    </Container>
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
