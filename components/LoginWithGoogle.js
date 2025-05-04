// components/LoginWithGoogle.js
import React, { useState, useEffect, useContext } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { googleLogin } from '../api/authApi';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function LoginWithGoogle({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:    '<YOUR_EXPO_CLIENT_ID>',    // ví dụ: xxxxxx-xxxx.apps.googleusercontent.com
    iosClientId:     '<YOUR_IOS_CLIENT_ID>',
    androidClientId: '<YOUR_ANDROID_CLIENT_ID>',
    webClientId:     '747725179393-j703g0e2ib3uag197qo53pajdr1qrsji.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleSignIn(authentication.idToken);
    }
  }, [response]);

  const handleSignIn = async (idToken) => {
    if (!idToken) {
      Alert.alert('Lỗi', 'Không lấy được ID token từ Google');
      return;
    }
    try {
      setLoading(true);
      const { token, account } = await googleLogin(idToken);
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('accountId', account.accountId.toString());
      navigation.replace('HomeScreen');
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: theme.text }]}
      onPress={() => promptAsync()}
      disabled={!request || loading}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.content}>
          <FontAwesome name="google" size={20} color={theme.text} />
          <Text style={[styles.text, { color: theme.text }]}>
            Đăng nhập với Google
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 30,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});
