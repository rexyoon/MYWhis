import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { BottleResponse } from '@/types/bottle';

export function BottleCard({ bottle }: { bottle: BottleResponse }) {
  const pct = bottle.remainingPercent;
  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        <Text style={styles.name} numberOfLines={1}>{bottle.name}</Text>
        <View style={[styles.badge, bottle.opened ? styles.opened : styles.sealed]}>
          <Text style={[styles.badgeText, { color: bottle.opened ? colors.amber : colors.textDim }]}>
            {bottle.opened ? '개봉' : '미개봉'}
          </Text>
        </View>
      </View>

      <Text style={styles.meta}>
        {bottle.categoryLabel ?? '종류 미지정'}
        {bottle.subtypeLabel ? ` · ${bottle.subtypeLabel}` : ''}
        {bottle.abv != null ? ` · ${bottle.abv}%` : ''}
      </Text>

      <View style={styles.gaugeTrack}>
        <View style={[styles.gaugeFill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.small}>
          {bottle.remainingVolumeMl} / {bottle.totalVolumeMl} ml ({pct}%)
        </Text>
        <Text style={styles.small}>등록 {bottle.elapsedDaysSinceRegistered}일</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: colors.text, fontSize: 17, fontWeight: '700', flex: 1, marginRight: spacing.sm },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, borderWidth: 1 },
  opened: { borderColor: colors.amberDark, backgroundColor: colors.surfaceAlt },
  sealed: { borderColor: colors.border, backgroundColor: colors.surfaceAlt },
  badgeText: { fontSize: 11, fontWeight: '700' },
  meta: { color: colors.textDim, marginTop: 4, marginBottom: spacing.md, fontSize: 13 },
  gaugeTrack: { height: 8, backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, overflow: 'hidden' },
  gaugeFill: { height: 8, backgroundColor: colors.amber, borderRadius: radius.pill },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  small: { color: colors.textFaint, fontSize: 12 },
});
