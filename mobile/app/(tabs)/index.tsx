import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { BottleCard } from '@/components/BottleCard';
import { bottleApi } from '@/api/bottles';
import { catalogApi } from '@/api/catalog';
import { BottleResponse } from '@/types/bottle';
import { Category } from '@/types/catalog';
import { colors, radius, spacing } from '@/theme';

export default function CollectionScreen() {
  const router = useRouter();
  const [bottles, setBottles] = useState<BottleResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [b, c] = await Promise.all([bottleApi.list(), catalogApi.categories()]);
      setBottles(b);
      setCategories(c);
    } catch (e: any) {
      setError(e.message ?? '불러오기 실패');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = useMemo(
    () => (filter ? bottles.filter((b) => b.categoryId === filter) : bottles),
    [bottles, filter]
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.amber} size="large" /></View>;
  }

  return (
    <View style={styles.screen}>
      {error && <Text style={styles.error}>⚠️ {error}</Text>}

      <View style={styles.chipsWrap}>
        <Chip label="전체" active={filter === null} onPress={() => setFilter(null)} />
        {categories.map((c) => (
          <Chip key={c.id} label={c.labelKo} active={filter === c.id} onPress={() => setFilter(c.id)} />
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.amber} />
        }
        renderItem={({ item }) => <BottleCard bottle={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🫙</Text>
            <Text style={styles.emptyText}>아직 등록된 위스키가 없어요.</Text>
            <Text style={styles.emptySub}>아래 + 버튼으로 첫 보틀을 등록해보세요.</Text>
          </View>
        }
      />

      <Pressable style={styles.fab} onPress={() => router.push('/bottle/new')}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  error: { color: colors.danger, padding: spacing.md, textAlign: 'center' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.amber, borderColor: colors.amber },
  chipText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: colors.bg },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 56 },
  emptyText: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: spacing.md },
  emptySub: { color: colors.textDim, marginTop: spacing.xs },
  fab: {
    position: 'absolute', right: spacing.xl, bottom: spacing.xl, width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center', elevation: 6,
  },
  fabText: { color: colors.bg, fontSize: 32, fontWeight: '700', marginTop: -2 },
});
