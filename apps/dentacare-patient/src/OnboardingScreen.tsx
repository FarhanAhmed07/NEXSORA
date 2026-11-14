import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "./theme";

type Props = { onContinue: () => void };

export default function OnboardingScreen({ onContinue }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [emergency, setEmergency] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");

  const field = (label: string, value: string, setter: (v: string) => void, placeholder: string, keyboardType: "default" | "phone-pad" = "default") => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor={colors.muted} keyboardType={keyboardType} style={styles.input} />
    </View>
  );

  const finish = () => {
    if (!fullName.trim() || !phone.trim()) {
      Alert.alert("Required details", "Please add your full name and mobile number to continue.");
      return;
    }
    Alert.alert("Preview only", "Your details are not being saved. Secure patient profile storage will be connected after backend approval.", [{ text: "Continue", onPress: onContinue }]);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>Taj Dental</Text>
          <Text style={styles.step}>PATIENT SETUP · STEP 1 OF 2</Text>
          <Text style={styles.title}>Let’s get to know you</Text>
          <Text style={styles.subtitle}>Add a few details to personalise your dental care experience.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Personal information</Text>
          {field("Full name *", fullName, setFullName, "Your full name")}
          {field("Mobile number *", phone, setPhone, "+92 300 1234567", "phone-pad")}
          {field("Date of birth", dob, setDob, "DD / MM / YYYY")}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.options}>
            {["Female", "Male", "Prefer not to say"].map(item => (
              <Pressable key={item} onPress={() => setGender(item)} style={[styles.option, gender === item && styles.optionActive]}>
                <Text style={[styles.optionText, gender === item && styles.optionTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.separator} />
          <Text style={styles.section}>Health information</Text>
          <Text style={styles.helper}>Optional for this demo. Share only what is relevant to your care.</Text>
          {field("Emergency contact", emergency, setEmergency, "Name and phone number")}
          {field("Known allergies", allergies, setAllergies, "e.g. medicines, latex")}
          {field("Existing medical conditions", conditions, setConditions, "Add any relevant information")}
          <View style={styles.notice}>
            <Text style={styles.noticeText}>Privacy note: this is a visual prototype. Nothing entered here is uploaded or stored.</Text>
          </View>
          <Pressable style={styles.primary} onPress={finish}><Text style={styles.primaryText}>Save profile & continue  →</Text></Pressable>
          <Pressable style={styles.skip} onPress={onContinue}><Text style={styles.skipText}>Skip for now</Text></Pressable>
        </View>
        <Text style={styles.footer}>Taj Dental · A Product by Nexora Solutions</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 22, paddingTop: 46, paddingBottom: 30 },
  header: { marginBottom: 22 },
  brand: { color: colors.purple, fontSize: 17, fontWeight: "900", marginBottom: 22 },
  step: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.4, marginBottom: 10 },
  title: { color: colors.text, fontSize: 27, fontWeight: "900", letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 8 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, padding: 18 },
  section: { color: colors.purpleDeep, fontSize: 14, fontWeight: "900", marginBottom: 14 },
  helper: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: -7, marginBottom: 14 },
  field: { marginBottom: 14 },
  label: { color: colors.text, fontSize: 10, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 47, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 13, color: colors.text, fontSize: 12 },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 8 },
  option: { borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colors.background },
  optionActive: { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
  optionText: { color: colors.muted, fontSize: 9, fontWeight: "700" },
  optionTextActive: { color: colors.purpleDark },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 18 },
  notice: { backgroundColor: colors.purpleSoft, padding: 12, borderRadius: 12, marginTop: 3, marginBottom: 14 },
  noticeText: { color: colors.purpleDark, fontSize: 10, lineHeight: 15 },
  primary: { backgroundColor: colors.pink, borderRadius: 13, paddingVertical: 15, alignItems: "center" },
  primaryText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  skip: { alignItems: "center", paddingVertical: 15 },
  skipText: { color: colors.purple, fontSize: 11, fontWeight: "800" },
  footer: { color: colors.muted, fontSize: 9, textAlign: "center", marginTop: 18 }
});
