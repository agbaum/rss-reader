import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ArticleCard } from "@/components/ArticleCard";
import Colors from "@/constants/colors";
import { Article, useFeeds } from "@/context/FeedsContext";

const FILTERS = ["All", "Unread"] as const;
type Filter = (typeof FILTERS)[number];

export default function TodayScreen() {
  const { articles, isRefreshing, refreshFeeds, markAsRead, markAllAsRead } = useFeeds();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("Unread");

  const filtered = useMemo(() => {
    if (filter === "Unread") return articles.filter((a) => !a.isRead);
    return articles;
  }, [articles, filter]);

  const unreadCount = useMemo(
    () => articles.filter((a) => !a.isRead).length,
    [articles]
  );

  const handleMarkAllRead = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    markAllAsRead();
  }, [markAllAsRead]);

  const renderItem = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCard article={item} onMarkRead={markAsRead} showFeedName />
    ),
    [markAsRead]
  );

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const ListHeader = (
    <View style={[styles.header, { paddingTop: topPad + 16 }]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.heading}>Inbox</Text>
          {unreadCount > 0 && (
            <Text style={styles.subheading}>
              {unreadCount} unread article{unreadCount !== 1 ? "s" : ""}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable
            onPress={handleMarkAllRead}
            style={({ pressed }) => [
              styles.markAllBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Feather name="check-circle" size={16} color={Colors.light.accent} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => {
              Haptics.selectionAsync();
              setFilter(f);
            }}
            style={[styles.filter, filter === f && styles.filterActive]}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather name="inbox" size={32} color={Colors.light.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>
        {filter === "Unread" ? "All caught up" : "No articles yet"}
      </Text>
      <Text style={styles.emptyDesc}>
        {filter === "Unread"
          ? "You've read everything. Check back later."
          : "Add some feeds in the Feeds tab to get started."}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFeeds}
            tintColor={Colors.light.accent}
            colors={[Colors.light.accent]}
            progressBackgroundColor={Colors.light.surface}
          />
        }
        contentContainerStyle={styles.list}
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
    paddingBottom: Platform.OS === "web" ? 34 : 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
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
    marginTop: 2,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.light.accentLight,
    borderRadius: 20,
    marginTop: 8,
  },
  markAllText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.accent,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
  },
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceAlt,
  },
  filterActive: {
    backgroundColor: Colors.light.text,
  },
  filterText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.textSecondary,
  },
  filterTextActive: {
    color: Colors.light.background,
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
