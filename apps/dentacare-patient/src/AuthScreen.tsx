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
  View,
} from "react-native";
import type { Session } from "@supabase/supabase-js";
import { colors, radius } from "./theme";
import { isSupabaseConfigured, supabase } from "./supabase";

type AuthMode = "signin" | "signup";

type Props = {
  onExploreDemo: () => void;
  onOpenClinicDemo: () => void;
  onAuthenticated: (session: Session) => void;
};

export default function AuthScreen({ onExploreDemo, onOpenClinicDemo, onAuthenticated }: Props) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [accountKind, setAccountKind] = useState<"patient" | "clinic">("patient");
  const [clinicName, setClinicName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      Alert.alert("Missing information", "Please enter your email and password.");
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      Alert.alert("Setup required", "TAJ DENTAL connection is not configured on this device yet. Add the project values to the app's .env file and restart Expo.");
      return;
    }
    if (mode === "signup") {
      if (!name.trim() || !phone.trim() || !confirmPassword || (accountKind === "clinic" && !clinicName.trim())) {
        Alert.alert("Missing information", "Please complete all required fields.");
        return;
      }
      if (password.length < 8) {
        Alert.alert("Password too short", "Use at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Password mismatch", "Your passwords do not match.");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        if (data.session) onAuthenticated(data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
              phone: phone.trim(),
              account_type: accountKind === "clinic" ? "clinic_admin" : "patient",
              clinic_name: accountKind === "clinic" ? clinicName.trim() : null,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          onAuthenticated(data.session);
        } else {
          Alert.alert("Verify your email", "Your account has been created. Check your email for the confirmation link, then return here and sign in.");
          setMode("signin");
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      Alert.alert("Authentication failed", message);
    } finally {
      setBusy(false);
    }
  };

  const recoverPassword = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      Alert.alert("Email required", "Enter your email address first.");
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      Alert.alert("Setup required", "Configure the TAJ DENTAL connection in the app's .env file first.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) throw error;
      Alert.alert("Check your email", "If this address has an account, password recovery instructions will be sent.");
    } catch (error) {
      Alert.alert("Could not send recovery email", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const field = (
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    placeholder: string,
    options: { keyboardType?: "default" | "email-address" | "phone-pad"; secureTextEntry?: boolean; autoCapitalize?: "none" | "words" | "sentences" } = {},
  ) => (
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
        editable={!busy}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>🦷</Text></View>
          <Text style={styles.brandName}>TAJ DENTAL</Text>
          <Text style={styles.brandCaption}>SMART DENTAL CLINIC</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>YOUR SMILE, OUR PRIORITY</Text>
          <Text style={styles.title}>{mode === "signin" ? "Welcome back" : "Create your account"}</Text>
          <Text style={styles.subtitle}>
            {mode === "signin" ? "Sign in to manage your appointments and dental care." : "Join Taj Dental to keep your dental health organised."}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.modeSwitch}>
            <Pressable disabled={busy} onPress={() => setMode("signin")} style={[styles.modeButton, mode === "signin" && styles.modeButtonActive]}>
              <Text style={[styles.modeText, mode === "signin" && styles.modeTextActive]}>Sign in</Text>
            </Pressable>
            <Pressable disabled={busy} onPress={() => setMode("signup")} style={[styles.modeButton, mode === "signup" && styles.modeButtonActive]}>
              <Text style={[styles.modeText, mode === "signup" && styles.modeTextActive]}>Create account</Text>
            </Pressable>
          </View>

          {mode === "signup" && (
            <View style={styles.accountKindWrap}>
              <Text style={styles.label}>Account type</Text>
              <View style={styles.accountKindRow}>
                <Pressable disabled={busy} onPress={() => setAccountKind("patient")} style={[styles.accountKindButton, accountKind === "patient" && styles.accountKindButtonActive]}>
                  <Text style={[styles.accountKindText, accountKind === "patient" && styles.accountKindTextActive]}>Patient</Text>
                </Pressable>
                <Pressable disabled={busy} onPress={() => setAccountKind("clinic")} style={[styles.accountKindButton, accountKind === "clinic" && styles.accountKindButtonActive]}>
                  <Text style={[styles.accountKindText, accountKind === "clinic" && styles.accountKindTextActive]}>Clinic owner</Text>
                </Pressable>
              </View>
              {accountKind === "clinic" && field("Clinic name", clinicName, setClinicName, "Enter your clinic name", { autoCapitalize: "words" })}
            </View>
          )}
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
                editable={!busy}
              />
              <Pressable disabled={busy} onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
              </Pressable>
            </View>
          </View>

          {mode === "signup" && field("Confirm password", confirmPassword, setConfirmPassword, "Re-enter your password", { secureTextEntry: true, autoCapitalize: "none" })}

          {mode === "signin" && (
            <Pressable disabled={busy} style={styles.forgotButton} onPress={recoverPassword}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          )}

          <Pressable disabled={busy} style={[styles.primaryButton, busy && styles.disabledButton]} onPress={submit}>
            <Text style={styles.primaryButtonText}>{busy ? "Please wait…" : mode === "signin" ? "Sign in  →" : "Create account  →"}</Text>
          </Pressable>
          <Text style={styles.secureText}>Your health information deserves secure, private care.</Text>
          {!isSupabaseConfigured && <Text style={styles.configWarning}>Connection setup required · Add the Supabase values to .env</Text>}
        </View>

        <Pressable style={styles.demoButton} onPress={onExploreDemo}>
          <Text style={styles.demoButtonText}>Continue to patient preview</Text>
        </Pressable>
        <Pressable style={styles.staffDemoButton} onPress={onOpenClinicDemo}>
          <Text style={styles.staffDemoText}>Clinic staff workspace preview  →</Text>
        </Pressable>
        <Text style={styles.footer}>Taj Dental · A Product by Nexora Solutions</Text>
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
  accountKindWrap: { marginBottom: 8 },
  accountKindRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  accountKindButton: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingVertical: 11, alignItems: "center", backgroundColor: colors.background },
  accountKindButtonActive: { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
  accountKindText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
  accountKindTextActive: { color: colors.purpleDark },
  label: { color: colors.text, fontSize: 10, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 13, color: colors.text, fontSize: 12 },
  passwordRow: { minHeight: 48, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 12, paddingLeft: 13, paddingRight: 12, flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1, color: colors.text, fontSize: 12, paddingVertical: 12 },
  showText: { color: colors.purple, fontSize: 10, fontWeight: "800" },
  forgotButton: { alignSelf: "flex-end", marginTop: -3, marginBottom: 16 },
  forgotText: { color: colors.pink, fontSize: 10, fontWeight: "800" },
  primaryButton: { backgroundColor: colors.pink, borderRadius: 13, paddingVertical: 15, alignItems: "center", marginTop: 3 },
  disabledButton: { opacity: 0.65 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  secureText: { color: colors.muted, fontSize: 9, textAlign: "center", lineHeight: 14, marginTop: 13 },
  configWarning: { color: "#B45309", fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 10 },
  demoButton: { alignItems: "center", paddingVertical: 16 },
  demoButtonText: { color: colors.purple, fontSize: 11, fontWeight: "900" },
  staffDemoButton: { alignItems: "center", paddingVertical: 12, marginTop: -5 },
  staffDemoText: { color: colors.pink, fontSize: 10, fontWeight: "900" },
  footer: { color: colors.muted, fontSize: 9, textAlign: "center", marginTop: 5 },
});
