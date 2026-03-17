import { Feather } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ArticleCard } from "@/components/ArticleCard";
import Colors from "@/constants/colors";
import { Article, useFeeds } from "@/context/FeedsContext";

export default function SavedScreen() {
  const { savedArticles, markAsRead, toggleSaved } = useFeeds();
  const insets = useSafeAreaInsets();

  const topPad =
    Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const renderItem = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCard
        article={item}
        onMarkRead={markAsRead}
        onToggleSaved={toggleSaved}
        showFeedName
      />
    ),
    [markAsRead, toggleSaved]
  );

  const ListHeader = (
    <View style={[styles.header, { paddingTop: topPad + 16 }]}>
      <Text style={styles.heading}>Saved</Text>
      <Text style={styles.subheading}>
        {savedArticles.length} article{savedArticles.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather name="bookmark" size={32} color={Colors.light.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>Nothing saved yet</Text>
      <Text style={styles.emptyDesc}>
        Tap the bookmark icon on any article to save it for later.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={savedArticles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={[
          styles.list,
          Platform.OS === "web" && { paddingBottom: 34 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  list: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 2,
  },
  heading: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: Colors.light.text,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
});
