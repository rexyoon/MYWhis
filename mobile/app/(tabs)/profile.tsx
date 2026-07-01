import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  function confirmSignOut() {
    Alert.alert('로그아웃', '정말 로그아웃 할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <View style={styles.screen}>
      <Card>
        <Text style={styles.avatar}>🥃</Text>
        <Text style={styles.nickname}>{user?.nickname ?? '위스키러버'}</Text>
        <Text style={styles.email}>{user?.email ?? '소셜 계정'}</Text>
      </Card>
      <View style={{ height: spacing.xl }} />
      <Button title="로그아웃" variant="danger" onPress={confirmSignOut} />
      <Text style={styles.version}>MyWhis v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
  avatar: { fontSize: 48, textAlign: 'center' },
  nickname: { color: colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: spacing.md },
  email: { color: colors.textDim, textAlign: 'center', marginTop: spacing.xs },
  version: { color: colors.textFaint, textAlign: 'center', marginTop: 'auto', paddingBottom: spacing.xl },
});
