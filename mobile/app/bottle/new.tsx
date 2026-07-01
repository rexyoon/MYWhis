import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Button, Field } from '@/components/ui';
import { Dropdown } from '@/components/Dropdown';
import { bottleApi } from '@/api/bottles';
import { catalogApi } from '@/api/catalog';
import { Category, Subtype } from '@/types/catalog';
import { isValidDateStr, todayStr } from '@/utils/date';
import { colors, spacing } from '@/theme';

export default function NewBottleScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subtypes, setSubtypes] = useState<Subtype[]>([]);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subtypeId, setSubtypeId] = useState<string | null>(null);
  const [total, setTotal] = useState('700');
  const [remaining, setRemaining] = useState('700');
  const [abv, setAbv] = useState('');
  const [registeredDate, setRegisteredDate] = useState(todayStr());
  const [openedDate, setOpenedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([catalogApi.categories(), catalogApi.subtypes()])
      .then(([c, s]) => { setCategories(c); setSubtypes(s); })
      .catch((e) => Alert.alert('불러오기 실패', e.message));
  }, []);

  const subtypeOptions = useMemo(
    () => subtypes.filter((s) => s.categoryId === categoryId).map((s) => ({ label: s.labelKo, value: s.id })),
    [subtypes, categoryId]
  );

  async function onSave() {
    if (!name.trim()) return Alert.alert('입력 필요', '이름을 입력하세요.');
    const totalN = parseInt(total, 10);
    const remN = parseInt(remaining, 10);
    if (!totalN || totalN <= 0) return Alert.alert('용량', '총 용량을 올바르게 입력하세요.');
    if (isNaN(remN) || remN < 0) return Alert.alert('용량', '남은 용량을 올바르게 입력하세요.');
    if (remN > totalN) return Alert.alert('용량', '남은 용량이 총 용량보다 클 수 없어요.');
    if (!isValidDateStr(registeredDate)) return Alert.alert('날짜', '등록일 형식은 YYYY-MM-DD 입니다.');
    if (openedDate && !isValidDateStr(openedDate)) return Alert.alert('날짜', '개봉일 형식은 YYYY-MM-DD 입니다.');

    setSaving(true);
    try {
      await bottleApi.create({
        name: name.trim(),
        categoryId,
        subtypeId,
        totalVolumeMl: totalN,
        remainingVolumeMl: remN,
        abv: abv ? parseFloat(abv) : null,
        registeredDate,
        openedDate: openedDate || null,
        imageUrl: null,
        notes: notes.trim() || null,
      });
      router.back();
    } catch (e: any) {
      Alert.alert('저장 실패', e.message ?? '다시 시도하세요.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: '위스키 등록', headerStyle: { backgroundColor: colors.bg }, headerTitleStyle: { color: colors.text }, headerTintColor: colors.amber }} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
        <Field label="이름 *" value={name} onChangeText={setName} placeholder="예: 라가불린 16년" />
        <Dropdown label="종류 *" value={categoryId} options={categories.map((c) => ({ label: c.labelKo, value: c.id }))} onChange={(v) => { setCategoryId(v); setSubtypeId(null); }} placeholder="종류 선택" />
        <Dropdown label="세부분류" value={subtypeId} options={subtypeOptions} onChange={setSubtypeId} placeholder={categoryId ? '세부분류 선택' : '먼저 종류를 선택하세요'} enabled={!!categoryId && subtypeOptions.length > 0} />
        <View style={styles.row}>
          <View style={styles.half}><Field label="총 용량 (ml) *" value={total} onChangeText={setTotal} keyboardType="number-pad" /></View>
          <View style={styles.half}><Field label="남은 용량 (ml) *" value={remaining} onChangeText={setRemaining} keyboardType="number-pad" /></View>
        </View>
        <Field label="도수 ABV (%)" value={abv} onChangeText={setAbv} keyboardType="decimal-pad" placeholder="예: 43" />
        <Field label="등록일 (YYYY-MM-DD) *" value={registeredDate} onChangeText={setRegisteredDate} />
        <Field label="개봉일 (YYYY-MM-DD, 미개봉이면 비움)" value={openedDate} onChangeText={setOpenedDate} placeholder="아직 안 열었으면 비워두세요" />
        <Field label="메모" value={notes} onChangeText={setNotes} placeholder="향, 맛, 구매처 등" multiline />
        <Button title="저장하기" onPress={onSave} loading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
});
