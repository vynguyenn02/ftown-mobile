// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { login } from "../api/authApi";
// import { ThemeContext } from "../context/ThemeContext";

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       return Alert.alert("Thông báo", "Vui lòng nhập đầy đủ email và mật khẩu.");
//     }

//     try {
//       setLoading(true);
//       const { token, accountId } = await login(email, password);
//       await AsyncStorage.setItem("userToken", token);
//       await AsyncStorage.setItem("accountId", accountId.toString());
//       await AsyncStorage.setItem("userId", accountId.toString()); 
//       navigation.replace("HomeScreen");
//     } catch (err) {
//       console.log("LOGIN ERROR:", err);
//       Alert.alert("Lỗi", "Email hoặc mật khẩu không đúng.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={[styles.container, { backgroundColor: theme.background }]}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleIcon}>
//         <Ionicons
//           name={theme.mode === "dark" ? "sunny-outline" : "moon-outline"}
//           size={24}
//           color={theme.text}
//         />
//       </TouchableOpacity>

//       <Text style={[styles.logo, { color: theme.text }]}>FUNKYTOWN</Text>
//       <Text style={[styles.title, { color: theme.text }]}>ĐĂNG NHẬP TÀI KHOẢN</Text>

//       <TextInput
//         style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
//         placeholder="Email"
//         placeholderTextColor="#999"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <View style={[styles.passwordContainer, { backgroundColor: theme.input }]}>
//         <TextInput
//           style={[styles.passwordInput, { color: theme.text }]}
//           placeholder="Mật khẩu"
//           placeholderTextColor="#999"
//           secureTextEntry={!showPassword}
//           value={password}
//           onChangeText={setPassword}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={[styles.loginButton, { backgroundColor: theme.primary }]}
//         onPress={handleLogin}
//       >
//         <Text
//           style={[styles.loginButtonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}
//         >
//           Đăng nhập
//         </Text>
//       </TouchableOpacity>

//       <Text style={[styles.orText, { color: theme.text }]}>Hoặc đăng nhập bằng</Text>

//       <TouchableOpacity style={[styles.socialButton, { borderColor: theme.text }]}>
//         <FontAwesome name="google" size={20} color={theme.text} />
//         <Text style={[styles.socialButtonText, { color: theme.text }]}>Đăng nhập với Google</Text>
//       </TouchableOpacity>

//       <Text style={[styles.registerText, { color: theme.text }]}>Chưa có tài khoản?
//         <Text
//           style={[styles.registerNow, { color: theme.text }]}
//           onPress={() => navigation.navigate("Register")}
//         >
//           {" Đăng ký ngay"}
//         </Text>
//       </Text>

//       {loading && <ActivityIndicator size="large" color={theme.primary} />}
//     </KeyboardAvoidingView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   themeToggleIcon: {
//     position: "absolute",
//     top: 50,
//     right: 20,
//     zIndex: 10,
//   },
//   logo: {
//     fontSize: 32,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 28,
//   },
//   input: {
//     width: "100%",
//     padding: 14,
//     borderRadius: 8,
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     padding: 14,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   passwordInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   loginButton: {
//     width: "100%",
//     padding: 14,
//     alignItems: "center",
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   loginButtonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   orText: {
//     marginBottom: 12,
//   },
//   socialButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     width: "100%",
//     justifyContent: "center",
//     marginBottom: 30,
//   },
//   socialButtonText: {
//     marginLeft: 10,
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   registerText: {
//     marginTop: 10,
//     fontSize: 14,
//   },
//   registerNow: {
//     fontWeight: "bold",
//   },
// });

// screens/LoginScreen.js (cập nhật)
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api/authApi";
import { ThemeContext } from "../context/ThemeContext";
import LoginWithGoogle from "../components/LoginWithGoogle";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Thông báo", "Vui lòng nhập đầy đủ email và mật khẩu.");
    }

    try {
      setLoading(true);
      const { token, accountId } = await login(email, password);
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("accountId", accountId.toString());
      navigation.replace("HomeScreen");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      Alert.alert("Lỗi", "Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleIcon}>
        <Feather
          name={theme.mode === "dark" ? "sun" : "moon"}
          size={24}
          color={theme.text}
        />
      </TouchableOpacity>

      <Text style={[styles.logo, { color: theme.text }]}>FUNKYTOWN</Text>
      <Text style={[styles.title, { color: theme.text }]}>ĐĂNG NHẬP TÀI KHOẢN</Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={[styles.passwordContainer, { backgroundColor: theme.input }]}>  
        <TextInput
          style={[styles.passwordInput, { color: theme.text }]}
          placeholder="Mật khẩu"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: theme.primary }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.mode === "dark" ? "#000" : "#fff"} />
        ) : (
          <Text style={[styles.loginButtonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>Đăng nhập</Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.orText, { color: theme.text }]}>Hoặc đăng nhập bằng</Text>
      <LoginWithGoogle navigation={navigation} />

      <Text style={[styles.registerText, { color: theme.text }]}>Chưa có tài khoản?
        <Text
          style={[styles.registerNow, { color: theme.text }]}
          onPress={() => navigation.navigate("Register")}
        > Đăng ký ngay</Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  loginButton: {
    width: "100%",
    padding: 14,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    marginBottom: 12,
  },
  registerText: {
    marginTop: 10,
    fontSize: 14,
  },
  registerNow: {
    fontWeight: "bold",
  },
});
