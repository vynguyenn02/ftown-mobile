import React, { useState } from "react";
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
import { FontAwesome, Feather } from "@expo/vector-icons";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !username || !password || !confirmPassword) {
      Alert.alert("Registration Error", "Please fill in all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Registration Error", "Passwords do not match.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Store user data in AsyncStorage
      await AsyncStorage.setItem("userEmail", username);
      await AsyncStorage.setItem("userPassword", password);
  
      setIsLoading(false);
      Alert.alert("Registration Successful", `Welcome, ${username}!`);
      navigation.replace("Login");
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Registration Failed", "An error occurred. Try again.");
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Text style={styles.logo}>FUNKYTOWN</Text>
        <Text style={styles.registerText}>REGISTER TO CONTINUE</Text>
        <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
        </View>

        <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        </View>

        <View style={styles.passwordContainer}>
          <TextInput style={styles.passwordInput} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput style={styles.passwordInput} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.alreadyText}>Already have an account? <Text style={styles.loginNow} onPress={() => navigation.navigate("Login")}>Login now</Text></Text>

        {isLoading && <ActivityIndicator size="large" color="#000" />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
  registerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#412C2C",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
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
  registerButton: {
    width: "100%",
    backgroundColor: "#412C2C",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  alreadyText: {
    color: "#777",
    marginTop: 20,
  },
  loginNow: {
    color: "#412C2C",
    fontWeight: "bold",
  },
});