import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Simulate successful login by setting a dummy token
      await AsyncStorage.setItem("userToken", "dummyToken");
  
      // Navigate to HomeScreen
      navigation.replace("HomeScreen");
    } catch (error) {
      Alert.alert("Login Failed", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.logo}>FUNKYTOWN</Text>
      <Text style={styles.loginText}>LOGIN TO CONTINUE</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g john@doe.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="**********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPassword}>forgot your password?</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or use other login method</Text>

      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="google" size={20} color="black" />
        <Text style={styles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity>
      
    
      
      <Text style={styles.registerText}>
        haven’t an account yet? <Text style={styles.registerNow} onPress={() => navigation.navigate("Register")}>register now</Text>
      </Text>

      {loading && <ActivityIndicator size="large" color="#000" />}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#412C2C",
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#412C2C",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#412C2C",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#777",
    fontStyle: "italic",
    marginBottom: 20,
  },
  orText: {
    color: "#777",
    marginBottom: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#412C2C",
    borderRadius: 5,
    marginBottom: 10,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    color: "#777",
    marginTop: 20,
  },
  registerNow: {
    color: "#412C2C",
    fontWeight: "bold",
  },
});
