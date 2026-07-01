import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!email || !password) return Alert.alert('입력 필요', '이메일과 비밀번호를 입력하세요.');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert('로그인 실패', e.message ?? '다시 시도하세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>🥃 MyWhis</Text>
          <Text style={styles.subtitle}>나만의 위스키 진열장</Text>
          <View style={{ height: spacing.xl }} />
          <Field label="이메일" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
          <Field label="비밀번호" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          <Button title="로그인" onPress={onSubmit} loading={loading} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>계정이 없으신가요? </Text>
            <Link href="/(auth)/signup" style={styles.link}>회원가입</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xl, justifyContent: 'center', flexGrow: 1 },
  logo: { color: colors.amber, fontSize: 40, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.textDim, textAlign: 'center', marginTop: spacing.sm, fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textDim },
  link: { color: colors.amber, fontWeight: '700' },
});
