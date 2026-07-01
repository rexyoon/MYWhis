import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!email || !password || !nickname) return Alert.alert('입력 필요', '닉네임, 이메일, 비밀번호를 모두 입력하세요.');
    if (password.length < 6) return Alert.alert('비밀번호', '비밀번호는 6자 이상이어야 합니다.');
    setLoading(true);
    try {
      await signUp(email.trim(), password, nickname.trim());
    } catch (e: any) {
      Alert.alert('회원가입 실패', e.message ?? '다시 시도하세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>회원가입</Text>
          <View style={{ height: spacing.lg }} />
          <Field label="닉네임" value={nickname} onChangeText={setNickname} placeholder="위스키러버" />
          <Field label="이메일" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
          <Field label="비밀번호 (6자 이상)" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          <Button title="가입하기" onPress={onSubmit} loading={loading} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있으신가요? </Text>
            <Link href="/(auth)/login" style={styles.link}>로그인</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xl, justifyContent: 'center', flexGrow: 1 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textDim },
  link: { color: colors.amber, fontWeight: '700' },
});
