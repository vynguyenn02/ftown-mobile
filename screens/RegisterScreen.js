import React, { useState, useMemo, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { register as registerApi } from "../api/authApi";
import { ThemeContext } from "../context/ThemeContext";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isValidEmail = (e) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e);

  const formValid = useMemo(() => {
    return (
      email.length > 0 &&
      isValidEmail(email) &&
      username.length > 0 &&
      password.length >= 6 &&
      password === confirmPassword
    );
  }, [email, username, password, confirmPassword]);

  const handleRegister = async () => {
    if (!formValid) return;
    setIsLoading(true);
    try {
      await registerApi({ username, email, password });
      Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
      navigation.replace("Login");
    } catch (err) {
      Alert.alert("Lỗi", "Đăng ký thất bại, thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (field) => [
    styles.input,
    { backgroundColor: theme.input, color: theme.text },
    focusField === field && { borderColor: theme.text },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleIcon}>
          <Ionicons
            name={theme.mode === "dark" ? "sunny-outline" : "moon-outline"}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>

        <Text style={[styles.logo, { color: theme.text }]}>FUNKYTOWN</Text>
        <Text style={[styles.title, { color: theme.text }]}>TẠO TÀI KHOẢN MỚI</Text>

        <TextInput
          style={getInputStyle("email")}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusField("email")}
          onBlur={() => setFocusField(null)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={getInputStyle("username")}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          onFocus={() => setFocusField("username")}
          onBlur={() => setFocusField(null)}
          autoCapitalize="none"
        />

        <View style={[styles.passwordContainer, { backgroundColor: theme.input }]}> 
          <TextInput
            style={[styles.passwordInput, { color: theme.text }]}
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusField("password")}
            onBlur={() => setFocusField(null)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={[styles.passwordContainer, { backgroundColor: theme.input }]}> 
          <TextInput
            style={[styles.passwordInput, { color: theme.text }]}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setFocusField("confirm")}
            onBlur={() => setFocusField(null)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }, (!formValid || isLoading) && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!formValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.mode === "dark" ? "#000" : "#fff"} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>Đăng ký</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: theme.text }]}> 
          Đã có tài khoản?
          <Text
            style={styles.registerNow}
            onPress={() => navigation.navigate("Login")}
          >
            {" Đăng nhập ngay"}
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  themeToggleIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 28,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 14,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
  },
  registerNow: {
    fontWeight: "bold",
  },
});
