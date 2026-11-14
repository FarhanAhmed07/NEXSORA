import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "./theme";
import PatientManagementScreen from "./PatientManagementScreen";
import ClinicOperationsScreen from "./ClinicOperationsScreen";
import BillingPaymentsScreen from "./BillingPaymentsScreen";
import ReportsAnalyticsScreen from "./ReportsAnalyticsScreen";
import ClinicAdminScreen from "./ClinicAdminScreen";
import ClinicGovernanceScreen from "./ClinicGovernanceScreen";
import ClinicAppointmentsScreen from "./ClinicAppointmentsScreen";

type Mode = "doctor" | "reception" | "admin";
const doctorPatients = [
  { time: "09:00", name: "Ava Thompson", service: "Routine check-up", status: "In progress", tone: "purple" },
  { time: "10:30", name: "Noah Williams", service: "Tooth pain consultation", status: "Waiting", tone: "pink" },
  { time: "11:15", name: "Mia Johnson", service: "Teeth cleaning", status: "Confirmed", tone: "green" }
];
const receptionPatients = [
  { time: "09:15", name: "Ethan Brown", service: "New patient registration", status: "Check-in", tone: "purple" },
  { time: "09:45", name: "Isabella Davis", service: "Payment pending", status: "Front desk", tone: "pink" },
  { time: "10:30", name: "Noah Williams", service: "Dr. Emily Carter", status: "Arrived", tone: "green" }
];

function Metric({ label, value, note, tint }: { label: string; value: string; note: string; tint: string }) {
  return <View style={styles.metric}><View style={[styles.metricDot, { backgroundColor: tint }]} /><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricNote}>{note}</Text></View>;
}

export default function ClinicDashboardScreen({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("doctor");
  const [showPatients, setShowPatients] = useState(false);
  const [operationsSection, setOperationsSection] = useState<"Doctors" | "Inventory" | null>(null);
  const [showBilling, setShowBilling] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showGovernance, setShowGovernance] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  if (operationsSection) return <ClinicOperationsScreen initialSection={operationsSection} onBack={() => setOperationsSection(null)} />;
  if (showBilling) return <BillingPaymentsScreen onBack={() => setShowBilling(false)} />;
  if (showReports) return <ReportsAnalyticsScreen onBack={() => setShowReports(false)} />;
  if (showAdmin) return <ClinicAdminScreen onBack={() => setShowAdmin(false)} />;
  if (showGovernance) return <ClinicGovernanceScreen onBack={() => setShowGovernance(false)} />;
  if (showAppointments) return <ClinicAppointmentsScreen onBack={() => setShowAppointments(false)} />;
  if (showPatients) return <PatientManagementScreen onBack={() => setShowPatients(false)} />;
  const doctor = mode === "doctor";
  const reception = mode === "reception";
  const rows = doctor ? doctorPatients : reception ? receptionPatients : [];
  const title = doctor ? "Good morning, Dr. Carter" : reception ? "Good morning, Olivia" : "Welcome, Clinic Admin";
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View style={styles.brandRow}><View style={styles.logo}><Text style={styles.logoText}>🦷</Text></View><View><Text style={styles.brand}>TAJ DENTAL</Text><Text style={styles.brandSub}>CLINIC MANAGEMENT</Text></View></View>
          <Pressable style={styles.avatar} onPress={() => Alert.alert("Demo account", "Staff profile and permissions will be connected to secure authentication.")}><Text style={styles.avatarText}>{doctor ? "EC" : reception ? "OR" : "AD"}</Text></Pressable>
        </View>
        <View style={styles.demoBanner}><Text style={styles.demoBannerText}>DEMO WORKSPACE  ·  SAMPLE CLINIC DATA</Text></View>
        <Text style={styles.greeting}>{title}</Text>
        <Text style={styles.subtitle}>{doctor ? "Here is your clinical overview for today." : reception ? "Your front desk overview for today." : "Manage your Taj Dental clinic operations from one place."}</Text>
        <View style={styles.switcher}>
          <Pressable onPress={() => setMode("doctor")} style={[styles.switchButton, doctor && styles.switchActive]}><Text style={[styles.switchText, doctor && styles.switchTextActive]}>Doctor</Text></Pressable>
          <Pressable onPress={() => setMode("reception")} style={[styles.switchButton, reception && styles.switchActive]}><Text style={[styles.switchText, reception && styles.switchTextActive]}>Reception</Text></Pressable>
          <Pressable onPress={() => setMode("admin")} style={[styles.switchButton, mode === "admin" && styles.switchActive]}><Text style={[styles.switchText, mode === "admin" && styles.switchTextActive]}>Admin</Text></Pressable>
        </View>

        <View style={styles.metrics}>
          {doctor ? <>
            <Metric label="Today's visits" value="08" note="+2 from yesterday" tint={colors.purple} />
            <Metric label="Completed" value="03" note="Of 8 appointments" tint="#28A879" />
            <Metric label="Waiting" value="02" note="Next patient soon" tint={colors.pink} />
          </> : reception ? <>
            <Metric label="Appointments" value="18" note="Across all doctors" tint={colors.purple} />
            <Metric label="Checked in" value="07" note="Patients arrived" tint="#28A879" />
            <Metric label="Pending bills" value="04" note="Needs follow-up" tint={colors.pink} />
          </> : <>
            <Metric label="Today's revenue" value="PKR 48k" note="Sample figures" tint={colors.purple} />
            <Metric label="Appointments" value="18" note="Across the clinic" tint="#28A879" />
            <Metric label="Low stock" value="03" note="Needs attention" tint={colors.pink} />
          </>}
        </View>

        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>{doctor ? "Today's patient schedule" : reception ? "Front desk queue" : "Clinic activity overview"}</Text><Text style={styles.sectionAction}>View all</Text></View>
        <View style={styles.listCard}>
          {rows.map((item, index) => (
            <Pressable key={item.name} style={[styles.patientRow, index === rows.length - 1 && styles.lastRow]} onPress={() => Alert.alert(item.name, "Patient details are sample data. Verified patient records will appear after secure clinic setup.")}>
              <View style={styles.timeBox}><Text style={styles.time}>{item.time}</Text></View>
              <View style={styles.patientCopy}><Text style={styles.patientName}>{item.name}</Text><Text style={styles.patientService}>{item.service}</Text><View style={styles.statusLine}><View style={[styles.statusDot, { backgroundColor: item.tone === "green" ? "#28A879" : item.tone === "pink" ? colors.pink : colors.purple }]} /><Text style={styles.statusText}>{item.status}</Text></View></View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>{doctor ? "Clinical tools" : reception ? "Front desk tools" : "Administration tools"}</Text><Text style={styles.sectionAction}>Workspace</Text></View>
        <View style={styles.toolsGrid}>
          {(doctor ? [
            ["✚", "Patient records", "History & notes"],
            ["▦", "Treatment plans", "Care coordination"],
            ["◉", "Dental chart", "Tooth-by-tooth"],
            ["Rx", "Prescriptions", "Medication records"],
            ["♙", "Doctors", "Team & availability"],
            ["▥", "Inventory", "Stock & expiry"],
            ["▤", "Reports", "Clinic performance"],
            ["⚙", "Administration", "Clinic settings"]
          ] : [
            ["＋", "Register patient", "New patient profile"],
            ["▦", "Appointments", "Manage bookings"],
            ["＄", "Billing", "Invoices & payments"],
            ["♧", "Patient queue", "Check-in & status"],
            ["♙", "Doctors", "Team & availability"],
            ["▥", "Inventory", "Stock & expiry"],
            ["▤", "Reports", "Clinic performance"],
            ["⚙", "Administration", "Clinic settings"]
          ] : reception ? [
            ["＋", "Register patient", "New patient profile"],
            ["▦", "Appointments", "Manage bookings"],
            ["＄", "Billing", "Invoices & payments"],
            ["♧", "Patient queue", "Check-in & status"],
            ["♙", "Doctors", "Team & availability"],
            ["▥", "Inventory", "Stock & expiry"],
            ["▤", "Reports", "Clinic performance"],
            ["⚙", "Administration", "Clinic settings"]
          ] : [
            ["▤", "Reports", "Revenue & performance"],
            ["♙", "Doctors", "Staff & schedules"],
            ["▥", "Inventory", "Stock & expiry"],
            ["＄", "Billing", "Invoices & payments"],
            ["✚", "Patient records", "Clinic patient list"],
            ["⚙", "Administration", "Branches, roles & services"],
            ["♧", "Communications", "Patient reminders"],
            ["☑", "Consent forms", "Patient approvals"],
            ["▧", "Audit log", "Staff activity history"],
            ["◇", "Subscription", "Clinic plan & billing"]
          ]).map(([icon, name, sub]) => <Pressable key={name} style={styles.tool} onPress={() => name === "Patient records" || name === "Register patient" || name === "Patient queue" ? setShowPatients(true) : name === "Appointments" ? setShowAppointments(true) : name === "Doctors" ? setOperationsSection("Doctors") : name === "Inventory" ? setOperationsSection("Inventory") : name === "Billing" ? setShowBilling(true) : name === "Reports" ? setShowReports(true) : name === "Administration" ? setShowAdmin(true) : ["Communications", "Consent forms", "Audit log", "Subscription"].includes(name) ? setShowGovernance(true) : Alert.alert(name, "This workspace module is part of the planned demo. Secure clinic workflows will be connected after approval.")}><View style={styles.toolIcon}><Text style={styles.toolIconText}>{icon}</Text></View><Text style={styles.toolName}>{name}</Text><Text style={styles.toolSub}>{sub}</Text></Pressable>)}
        </View>

        <View style={styles.notice}><Text style={styles.noticeTitle}>Privacy-first clinic workspace</Text><Text style={styles.noticeText}>Patient access, clinical notes, billing and staff permissions will be protected by verified roles and clinic-level data access. No real patient information is stored in this preview.</Text></View>
        <Pressable style={styles.exitButton} onPress={onExit}><Text style={styles.exitText}>← Back to patient app</Text></Pressable>
        <Text style={styles.footer}>TAJ DENTAL · Developed by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 30 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 19 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center" },
  logoText: { color: "#FFFFFF", fontSize: 23, fontWeight: "900" },
  brand: { color: colors.purpleDeep, fontSize: 19, fontWeight: "900" },
  brandSub: { color: colors.muted, fontSize: 8, fontWeight: "900", letterSpacing: 1.4, marginTop: 3 },
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.purpleDark, fontSize: 11, fontWeight: "900" },
  demoBanner: { alignSelf: "flex-start", backgroundColor: colors.pinkSoft, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, marginBottom: 15 },
  demoBannerText: { color: colors.pink, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  greeting: { color: colors.text, fontSize: 24, fontWeight: "900", letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 11, marginTop: 6, marginBottom: 18 },
  switcher: { flexDirection: "row", backgroundColor: colors.purpleSoft, borderRadius: 14, padding: 4, marginBottom: 17 },
  switchButton: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: 11 },
  switchActive: { backgroundColor: "#FFFFFF" },
  switchText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
  switchTextActive: { color: colors.purpleDark },
  metrics: { flexDirection: "row", gap: 8, marginBottom: 25 },
  metric: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12 },
  metricDot: { width: 7, height: 7, borderRadius: 5, marginBottom: 9 },
  metricValue: { color: colors.text, fontSize: 22, fontWeight: "900" },
  metricLabel: { color: colors.text, fontSize: 9, fontWeight: "800", marginTop: 3 },
  metricNote: { color: colors.muted, fontSize: 8, marginTop: 5, lineHeight: 12 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 1 },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: "900" },
  sectionAction: { color: colors.pink, fontSize: 9, fontWeight: "900" },
  listCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 13, marginBottom: 25 },
  patientRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 10 },
  lastRow: { borderBottomWidth: 0 },
  timeBox: { width: 49, height: 43, borderRadius: 12, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  time: { color: colors.purpleDark, fontSize: 10, fontWeight: "900" },
  patientCopy: { flex: 1 },
  patientName: { color: colors.text, fontSize: 11, fontWeight: "900" },
  patientService: { color: colors.muted, fontSize: 9, marginTop: 4 },
  statusLine: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 4 },
  statusText: { color: colors.muted, fontSize: 8, fontWeight: "700" },
  chevron: { color: colors.pink, fontSize: 22 },
  toolsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 18 },
  tool: { width: "48.5%", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 13, marginBottom: 9 },
  toolIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  toolIconText: { color: colors.purpleDark, fontSize: 16, fontWeight: "900" },
  toolName: { color: colors.text, fontSize: 10, fontWeight: "900" },
  toolSub: { color: colors.muted, fontSize: 8, marginTop: 4 },
  notice: { backgroundColor: colors.purpleSoft, borderRadius: 16, padding: 15, marginBottom: 13 },
  noticeTitle: { color: colors.purpleDark, fontSize: 11, fontWeight: "900", marginBottom: 6 },
  noticeText: { color: colors.purpleDark, fontSize: 9, lineHeight: 15 },
  exitButton: { alignItems: "center", paddingVertical: 14 },
  exitText: { color: colors.purple, fontSize: 10, fontWeight: "900" },
  footer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 6 }
});
