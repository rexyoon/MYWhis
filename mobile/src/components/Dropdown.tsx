import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, radius, spacing } from '@/theme';

export type Option = { label: string; value: string };

export function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder = '선택하세요',
  enabled = true,
}: {
  label: string;
  value: string | null;
  options: Option[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  enabled?: boolean;
}) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, !enabled && { opacity: 0.5 }]}>
        <Picker
          enabled={enabled}
          selectedValue={value ?? ''}
          onValueChange={(v) => onChange(v === '' ? null : String(v))}
          dropdownIconColor={colors.amber}
          style={styles.picker}
          itemStyle={Platform.OS === 'ios' ? styles.iosItem : undefined}
        >
          <Picker.Item label={placeholder} value="" color={colors.textFaint} />
          {options.map((o) => (
            <Picker.Item key={o.value} label={o.label} value={o.value} color={colors.text} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textDim, marginBottom: spacing.xs, fontSize: 13, fontWeight: '600' },
  box: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  picker: { color: colors.text },
  iosItem: { color: colors.text, height: 120 },
});
