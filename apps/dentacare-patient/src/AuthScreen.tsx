import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { colors, radius } from "./src/theme";

type AuthMode = "signin" | "signup";

export default function AuthScreen({ onExploreDemo }: { onExploreDemo: () => void }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing information", "Please enter your email and password.");
      return;
    }
    if (mode === "signup" && (!name.trim() || !phone.trim() || !confirmPassword.trim())) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }
    Alert.alert(
      "Demo preview",
      "The sign-in interface is ready. Secure account creation, OTP verification and login will be enabled after the authentication backend is connected. No account or password has been saved."
    );
  };

  const field = (label: string, value: string, onChangeText: (value: string) => void, placeholder: string, options: { keyboardType?: "default" | "email-address" | "phone-pad"; secureTextEntry?: boolean; autoCapitalize?: "none" | "words" | "sentences" } = {}) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        keyboardType={options.keyboardType || "default"}
        secureTextEntry={options.secureTextEntry}
        autoCapitalize={options.autoCapitalize || "sentences"}
        autoCorrect={false}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>✦</Text></View>
          <Text style={styles.brandName}>DentaCare</Text>
          <Text style={styles.brandCaption}>SMART DENTAL CLINIC</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>YOUR SMILE, OUR PRIORITY</Text>
          <Text style={styles.title}>{mode === "signin" ? "Welcome back" : "Create your account"}</Text>
          <Text style={styles.subtitle}>
            {mode === "signin" ? "Sign in to manage your appointments and dental care." : "Join DentaCare to keep your dental health organised."}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.modeSwitch}>
            <Pressable onPress={() => setMode("signin")} style={[styles.modeButton, mode === "signin" && styles.modeButtonActive]}>
              <Text style={[styles.modeText, mode === "signin" && styles.modeTextActive]}>Sign in</Text>
            </Pressable>
            <Pressable onPress={() => setMode("signup")} style={[styles.modeButton, mode === "signup" && styles.modeButtonActive]}>
              <Text style={[styles.modeText, mode === "signup" && styles.modeTextActive]}>Create account</Text>
            </Pressable>
          </View>

          {mode === "signup" && (
            <>
              {field("Full name", name, setName, "Enter your full name", { autoCapitalize: "words" })}
              {field("Mobile number", phone, setPhone, "+92 300 1234567", { keyboardType: "phone-pad" })}
            </>
          )}
          {field("Email address", email, setEmail, "you@example.com", { keyboardType: "email-address", autoCapitalize: "none" })}

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.muted}
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}><Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text></Pressable>
            </View>
          </View>

          {mode === "signup" && field("Confirm password", confirmPassword, setConfirmPassword, "Re-enter your password", { secureTextEntry: true, autoCapitalize: "none" })}

          {mode === "signin" && (
            <Pressable style={styles.forgotButton} onPress={() => Alert.alert("Password recovery", "Password recovery will be available after secure authentication is connected.")}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          )}

          <Pressable style={styles.primaryButton} onPress={submit}>
            <Text style={styles.primaryButtonText}>{mode === "signin" ? "Sign in" : "Create account"}  →</Text>
          </Pressable>
          <Text style={styles.secureText}>Your health information deserves secure, private care.</Text>
        </View>

        <Pressable style={styles.demoButton} onPress={onExploreDemo}>
          <Text style={styles.demoButtonText}>Explore app preview</Text>
        </Pressable>
        <Text style={styles.footer}>DentaCare · A Product by Nexora Solutions</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 48, paddingBottom: 28 },
  brand: { alignItems: "center", marginBottom: 28 },
  brandMark: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  brandMarkText: { color: "#FFFFFF", fontSize: 27, fontWeight: "800" },
  brandName: { color: colors.purpleDeep, fontSize: 23, fontWeight: "900", letterSpacing: -0.7 },
  brandCaption: { color: colors.muted, fontSize: 8, fontWeight: "800", letterSpacing: 1.5, marginTop: 3 },
  hero: { marginBottom: 20 },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.5, marginBottom: 9 },
  title: { color: colors.text, fontSize: 28, fontWeight: "900", letterSpacing: -0.8 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 7 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, padding: 18 },
  modeSwitch: { flexDirection: "row", backgroundColor: colors.purpleSoft, borderRadius: 13, padding: 4, marginBottom: 20 },
  modeButton: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: 10 },
  modeButtonActive: { backgroundColor: "#FFFFFF" },
  modeText: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  modeTextActive: { color: colors.purpleDark, fontWeight: "900" },
  fieldWrap: { marginBottom: 14 },
  label: { color: colors.text, fontSize: 10, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 13, color: colors.text, fontSize: 12 },
  passwordRow: { minHeight: 48, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 12, paddingLeft: 13, paddingRight: 12, flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1, color: colors.text, fontSize: 12, paddingVertical: 12 },
  showText: { color: colors.purple, fontSize: 10, fontWeight: "800" },
  forgotButton: { alignSelf: "flex-end", marginTop: -3, marginBottom: 16 },
  forgotText: { color: colors.pink, fontSize: 10, fontWeight: "800" },
  primaryButton: { backgroundColor: colors.pink, borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 3 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  secureText: { color: colors.muted, fontSize: 9, textAlign: "center", lineHeight: 14, marginTop: 13 },
  demoButton: { alignItems: "center", paddingVertical: 16 },
  demoButtonText: { color: colors.purple, fontSize: 11, fontWeight: "900" },
  footer: { color: colors.muted, fontSize: 9, textAlign: "center", marginTop: 5 }
});
