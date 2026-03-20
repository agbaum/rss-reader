import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useFeeds } from "@/context/FeedsContext";


interface Props {
  visible: boolean;
  onClose: () => void;
}

export function AddFeedSheet({ visible, onClose }: Props) {
  const { addFeed } = useFeeds();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleAdd = useCallback(async () => {
    if (!url.trim() || isLoading) return;

    let feedUrl = url.trim();
    if (!feedUrl.startsWith("http://") && !feedUrl.startsWith("https://")) {
      feedUrl = "https://" + feedUrl;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await addFeed(feedUrl);
    setIsLoading(false);

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUrl("");
      onClose();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Could not add feed", result.error ?? "Unknown error");
    }
  }, [url, isLoading, addFeed, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { paddingBottom: insets.bottom + 16 }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Add Feed</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Feather name="x" size={22} color={Colors.light.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.inputRow}>
          <Feather
            name="rss"
            size={18}
            color={Colors.light.textTertiary}
            style={styles.inputIcon}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="https://example.com/feed.xml"
            placeholderTextColor={Colors.light.textTertiary}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            editable={!isLoading}
          />
          {!!url && !isLoading && (
            <Pressable onPress={() => setUrl("")} hitSlop={12}>
              <Feather name="x-circle" size={16} color={Colors.light.textTertiary} />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addBtn,
            pressed && { opacity: 0.85 },
            (!url.trim() || isLoading) && styles.addBtnDisabled,
          ]}
          disabled={!url.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.addBtnText}>Add Feed</Text>
          )}
        </Pressable>

      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.border,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    marginBottom: 14,
    gap: 10,
  },
  inputIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.light.text,
  },
  addBtn: {
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  suggestions: {
    gap: 4,
  },
  suggestionsLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    gap: 12,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.light.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionText: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.light.text,
  },
  suggestionUrl: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textTertiary,
    marginTop: 1,
  },
});
