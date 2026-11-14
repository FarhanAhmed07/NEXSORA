import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "./theme";

type Section = "communications" | "consents" | "audit" | "subscription";

const sectionLabels: { key: Section; label: string }[] = [
  { key: "communications", label: "Messages" },
  { key: "consents", label: "Consent" },
  { key: "audit", label: "Audit log" },
  { key: "subscription", label: "Plan" }
];

export default function ClinicGovernanceScreen({ onBack }: { onBack: () => void }) {
  const [section, setSection] = useState<Section>("communications");

  const heading = section === "communications" ? "Patient communications"
    : section === "consents" ? "Consent & documents"
    : section === "audit" ? "Activity audit log" : "Subscription & plan";

  const action = (title: string, message: string) => Alert.alert(title, message);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  Back to dashboard</Text></Pressable>
        <Text style={styles.eyebrow}>TAJ DENTAL · CLINIC ADMIN</Text>
        <Text style={styles.title}>{heading}</Text>
        <Text style={styles.subtitle}>Manage clinic communications, patient consent and operational oversight.</Text>
        <View style={styles.tabs}>
          {sectionLabels.map(item => (
            <Pressable key={item.key} onPress={() => setSection(item.key)} style={[styles.tab, section === item.key && styles.tabActive]}>
              <Text style={[styles.tabText, section === item.key && styles.tabTextActive]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {section === "communications" && <>
          <View style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>COMMUNICATION CENTRE</Text>
            <Text style={styles.heroTitle}>Keep patients informed</Text>
            <Text style={styles.heroText}>Prepare appointment reminders, follow-up messages and clinic announcements in one place.</Text>
          </View>
          <View style={styles.metrics}>
            <View style={styles.metric}><Text style={styles.metricValue}>12</Text><Text style={styles.metricLabel}>Reminders queued</Text></View>
            <View style={styles.metric}><Text style={styles.metricValue}>08</Text><Text style={styles.metricLabel}>Follow-ups due</Text></View>
          </View>
          {[
            ["Appointment reminder", "Your appointment at Taj Dental is coming up. Please arrive 10 minutes early."],
            ["Post-treatment follow-up", "We hope you are feeling well after your visit. Contact the clinic if you need assistance."],
            ["Clinic announcement", "Share clinic timings, holiday notices and important service updates."]
          ].map(([name, message]) => (
            <View key={name} style={styles.card}>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text style={styles.body}>{message}</Text>
              <Pressable style={styles.secondaryButton} onPress={() => action(name, "Message template preview only. SMS, WhatsApp and email delivery will be connected after provider setup.")}>
                <Text style={styles.secondaryText}>Preview template</Text>
              </Pressable>
            </View>
          ))}
        </>}

        {section === "consents" && <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Patient consent forms</Text>
            <Text style={styles.body}>Keep signed treatment consent and privacy acknowledgements linked to the correct patient record.</Text>
          </View>
          {[
            ["General treatment consent", "Template ready", "Ready"],
            ["Dental extraction consent", "Requires clinician review", "Review"],
            ["Privacy notice acknowledgement", "Template ready", "Ready"],
            ["Orthodontic treatment consent", "Requires clinician review", "Review"]
          ].map(([name, description, status]) => (
            <View key={name} style={styles.rowCard}>
              <View style={styles.rowCopy}><Text style={styles.cardTitle}>{name}</Text><Text style={styles.body}>{description}</Text></View>
              <Text style={[styles.status, status === "Ready" ? styles.statusReady : styles.statusReview]}>{status}</Text>
            </View>
          ))}
          <Pressable style={styles.primaryButton} onPress={() => action("Create consent form", "Consent form builder and secure e-signature are planned for the connected release.")}>
            <Text style={styles.primaryText}>＋  Create consent form</Text>
          </Pressable>
        </>}

        {section === "audit" && <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Clinic activity history</Text>
            <Text style={styles.body}>A future connected audit log will record sensitive access and changes with staff identity, timestamp and action details.</Text>
          </View>
          {[
            ["09:42 AM", "Reception workspace opened", "Front desk role · Demo event"],
            ["09:18 AM", "Appointment marked as arrived", "Reception role · Demo event"],
            ["Yesterday", "Inventory list reviewed", "Admin role · Demo event"],
            ["Yesterday", "Monthly report viewed", "Admin role · Demo event"]
          ].map(([time, name, detail]) => (
            <View key={time + name} style={styles.auditRow}>
              <View style={styles.auditDot} />
              <View style={styles.rowCopy}><Text style={styles.auditTime}>{time}</Text><Text style={styles.cardTitle}>{name}</Text><Text style={styles.body}>{detail}</Text></View>
            </View>
          ))}
        </>}

        {section === "subscription" && <>
          <View style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>TAJ DENTAL WORKSPACE</Text>
            <Text style={styles.heroTitle}>Clinic plan</Text>
            <Text style={styles.heroText}>Subscription controls will be enabled when Taj Dental's billing account is configured.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preview plan</Text>
            <Text style={styles.planName}>Clinic Pro · Preview</Text>
            <Text style={styles.body}>Multi-role workspace, clinic administration and reporting screens.</Text>
            <View style={styles.separator} />
            <Text style={styles.body}>Status: Not subscribed · No payment method connected</Text>
            <Pressable style={styles.primaryButton} onPress={() => action("Subscription setup", "No subscription or payment has been created. A billing provider and clinic owner approval are required.")}>
              <Text style={styles.primaryText}>View plan options</Text>
            </Pressable>
          </View>
        </>}

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Preview mode · no external messages sent</Text>
          <Text style={styles.noticeText}>All entries on this screen are sample content. No SMS, WhatsApp, email, e-signature, audit event or subscription transaction is active yet.</Text>
        </View>
        <Text style={styles.footer}>TAJ DENTAL · Developed by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 48, paddingBottom: 32 },
  back: { marginBottom: 20 },
  backText: { color: colors.purple, fontSize: 12, fontWeight: "800" },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.3, marginBottom: 9 },
  title: { color: colors.text, fontSize: 25, fontWeight: "900", letterSpacing: -0.6 },
  subtitle: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 7, marginBottom: 18 },
  tabs: { flexDirection: "row", flexWrap: "wrap", backgroundColor: colors.purpleSoft, borderRadius: 14, padding: 4, marginBottom: 18 },
  tab: { flexGrow: 1, alignItems: "center", paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10 },
  tabActive: { backgroundColor: colors.surface },
  tabText: { color: colors.muted, fontSize: 9, fontWeight: "800" },
  tabTextActive: { color: colors.purpleDark },
  heroCard: { backgroundColor: colors.purpleDark, borderRadius: radius.card, padding: 18, marginBottom: 13 },
  heroEyebrow: { color: "#E9D5FF", fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginTop: 10 },
  heroText: { color: "#F3E8FF", fontSize: 10, lineHeight: 16, marginTop: 7 },
  metrics: { flexDirection: "row", gap: 10, marginBottom: 12 },
  metric: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 15 },
  metricValue: { color: colors.purpleDark, fontSize: 23, fontWeight: "900" },
  metricLabel: { color: colors.muted, fontSize: 9, fontWeight: "700", marginTop: 4 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 15, marginBottom: 10 },
  cardTitle: { color: colors.text, fontSize: 11, fontWeight: "900" },
  body: { color: colors.muted, fontSize: 9, lineHeight: 15, marginTop: 6 },
  secondaryButton: { alignSelf: "flex-start", marginTop: 12, borderRadius: 10, backgroundColor: colors.purpleSoft, paddingHorizontal: 12, paddingVertical: 9 },
  secondaryText: { color: colors.purpleDark, fontSize: 9, fontWeight: "900" },
  rowCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 13, marginBottom: 8, gap: 10 },
  rowCopy: { flex: 1 },
  status: { fontSize: 8, fontWeight: "900", paddingHorizontal: 8, paddingVertical: 6, overflow: "hidden", borderRadius: 10 },
  statusReady: { color: colors.success, backgroundColor: colors.successSoft },
  statusReview: { color: colors.warning, backgroundColor: "#FFF4E5" },
  primaryButton: { backgroundColor: colors.purple, borderRadius: 13, alignItems: "center", padding: 13, marginTop: 12 },
  primaryText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  auditRow: { flexDirection: "row", gap: 11, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  auditDot: { width: 8, height: 8, borderRadius: 5, backgroundColor: colors.pink, marginTop: 5 },
  auditTime: { color: colors.pink, fontSize: 8, fontWeight: "900", marginBottom: 4 },
  planName: { color: colors.purpleDark, fontSize: 18, fontWeight: "900", marginTop: 12 },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 13 },
  notice: { backgroundColor: colors.pinkSoft, borderRadius: 14, padding: 13, marginTop: 8 },
  noticeTitle: { color: colors.purpleDark, fontSize: 10, fontWeight: "900" },
  noticeText: { color: colors.purpleDark, fontSize: 9, lineHeight: 14, marginTop: 5 },
  footer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 18 }
});
