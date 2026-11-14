import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "./theme";

type Section = "Doctors" | "Inventory";
const doctors = [
  { name: "Dr. Emily Carter", specialty: "General Dentist", schedule: "Mon–Fri · 09:00 AM–05:00 PM", status: "Available", initials: "EC" },
  { name: "Dr. James Wilson", specialty: "Orthodontist", schedule: "Mon–Thu · 10:00 AM–06:00 PM", status: "In clinic", initials: "JW" },
  { name: "Dr. Sophia Lee", specialty: "Endodontist", schedule: "Tue–Sat · 09:00 AM–04:00 PM", status: "On leave", initials: "SL" },
  { name: "Dr. Daniel Harris", specialty: "Oral Surgeon", schedule: "Wed–Sat · 11:00 AM–07:00 PM", status: "Available", initials: "DH" }
];
const stock = [
  { name: "Examination gloves", category: "Clinical supplies", qty: 18, unit: "boxes", level: "Low stock", expiry: "Aug 2027" },
  { name: "Composite resin", category: "Restorative", qty: 42, unit: "syringes", level: "In stock", expiry: "Mar 2027" },
  { name: "Dental masks", category: "PPE", qty: 120, unit: "packs", level: "In stock", expiry: "Dec 2027" },
  { name: "Local anaesthetic", category: "Medication", qty: 8, unit: "boxes", level: "Low stock", expiry: "Jan 2027" },
  { name: "Sterilization pouches", category: "Clinical supplies", qty: 0, unit: "packs", level: "Out of stock", expiry: "—" }
];

export default function ClinicOperationsScreen({ initialSection, onBack }: { initialSection: Section; onBack: () => void }) {
  const [section, setSection] = useState<Section>(initialSection);
  const [query, setQuery] = useState("");
  const doctorRows = useMemo(() => doctors.filter(d => (d.name + d.specialty).toLowerCase().includes(query.toLowerCase())), [query]);
  const stockRows = useMemo(() => stock.filter(s => (s.name + s.category).toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  Clinic workspace</Text></Pressable>
        <Text style={styles.eyebrow}>CLINIC OPERATIONS</Text>
        <Text style={styles.heading}>{section === "Doctors" ? "Doctor management" : "Inventory"}</Text>
        <Text style={styles.subtitle}>{section === "Doctors" ? "Manage your dental team, specialties and availability." : "Track clinical supplies, stock levels and expiry dates."}</Text>
        <View style={styles.switcher}>
          {(["Doctors", "Inventory"] as Section[]).map(s => <Pressable key={s} onPress={() => { setSection(s); setQuery(""); }} style={[styles.switch, section === s && styles.switchActive]}><Text style={[styles.switchText, section === s && styles.switchTextActive]}>{s}</Text></Pressable>)}
        </View>
        <View style={styles.summary}>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{section === "Doctors" ? "04" : "05"}</Text><Text style={styles.summaryLabel}>{section === "Doctors" ? "Team members" : "Tracked items"}</Text></View>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{section === "Doctors" ? "03" : "02"}</Text><Text style={styles.summaryLabel}>{section === "Doctors" ? "Active today" : "Low stock"}</Text></View>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{section === "Doctors" ? "01" : "01"}</Text><Text style={styles.summaryLabel}>{section === "Doctors" ? "On leave" : "Out of stock"}</Text></View>
        </View>
        <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder={section === "Doctors" ? "Search doctor or specialty" : "Search item or category"} placeholderTextColor={colors.muted} style={styles.searchInput} /></View>
        {section === "Doctors" ? <>
          <Text style={styles.section}>Dental team</Text>
          {doctorRows.map(d => <Pressable key={d.name} style={styles.card} onPress={() => Alert.alert(d.name, d.specialty + "\n" + d.schedule + "\n\nStaff profile editing will be enabled after secure role setup.")}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{d.initials}</Text></View><View style={styles.copy}><Text style={styles.name}>{d.name}</Text><Text style={styles.meta}>{d.specialty}</Text><Text style={styles.meta}>{d.schedule}</Text></View><View style={styles.statusWrap}><View style={[styles.dot, { backgroundColor: d.status === "On leave" ? colors.warning : colors.success }]} /><Text style={styles.status}>{d.status}</Text></View>
          </Pressable>)}
          <Pressable style={styles.primary} onPress={() => Alert.alert("Add doctor", "Doctor onboarding and role assignment will be connected after secure authentication is approved.")}><Text style={styles.primaryText}>＋  Add doctor / staff member</Text></Pressable>
        </> : <>
          <Text style={styles.section}>Stock overview</Text>
          {stockRows.map(s => <View key={s.name} style={styles.stockCard}>
            <View style={styles.stockTop}><View style={styles.copy}><Text style={styles.name}>{s.name}</Text><Text style={styles.meta}>{s.category} · Expires {s.expiry}</Text></View><View style={[styles.stockBadge, { backgroundColor: s.level === "In stock" ? colors.successSoft : "#FFF2E7" }]}><Text style={[styles.stockBadgeText, { color: s.level === "In stock" ? colors.success : colors.warning }]}>{s.level}</Text></View></View>
            <View style={styles.stockBottom}><Text style={styles.qty}>{s.qty} <Text style={styles.unit}>{s.unit}</Text></Text><View style={styles.bar}><View style={[styles.barFill, { width: Math.min(s.qty / 120 * 100, 100) + "%", backgroundColor: s.qty < 20 ? colors.pink : colors.purple }]} /></View></View>
          </View>)}
          <Pressable style={styles.primary} onPress={() => Alert.alert("Stock entry", "Stock receiving, supplier purchase orders and adjustments will be connected after workflow approval.")}><Text style={styles.primaryText}>＋  Record stock received</Text></Pressable>
        </>}
        <View style={styles.notice}><Text style={styles.noticeTitle}>Preview data</Text><Text style={styles.noticeText}>Staff and inventory information shown here is fictional sample data. Stock deductions, expiry alerts and staff permissions are not live yet.</Text></View>
        <Text style={styles.footer}>DentaCare · A Product by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 48, paddingBottom: 32 },
  back: { alignSelf: "flex-start", paddingVertical: 7, marginBottom: 15 },
  backText: { color: colors.purple, fontSize: 11, fontWeight: "900" },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.6, marginBottom: 7 },
  heading: { color: colors.text, fontSize: 27, fontWeight: "900", letterSpacing: -0.8 },
  subtitle: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 6, marginBottom: 17 },
  switcher: { flexDirection: "row", backgroundColor: colors.purpleSoft, borderRadius: 13, padding: 4, marginBottom: 15 },
  switch: { flex: 1, alignItems: "center", padding: 10, borderRadius: 10 },
  switchActive: { backgroundColor: colors.surface },
  switchText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
  switchTextActive: { color: colors.purpleDark },
  summary: { flexDirection: "row", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, paddingVertical: 14, marginBottom: 14 },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { color: colors.purple, fontSize: 19, fontWeight: "900" },
  summaryLabel: { color: colors.muted, fontSize: 8, marginTop: 4 },
  search: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 13, paddingHorizontal: 12, marginBottom: 17 },
  searchIcon: { color: colors.pink, fontSize: 21, marginRight: 7 },
  searchInput: { flex: 1, height: 43, color: colors.text, fontSize: 10 },
  section: { color: colors.text, fontSize: 14, fontWeight: "900", marginBottom: 10 },
  card: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 12, marginBottom: 9 },
  avatar: { width: 39, height: 39, borderRadius: 14, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.purpleDark, fontSize: 10, fontWeight: "900" },
  copy: { flex: 1 },
  name: { color: colors.text, fontSize: 10, fontWeight: "900" },
  meta: { color: colors.muted, fontSize: 8, marginTop: 4 },
  statusWrap: { alignItems: "flex-end", gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  status: { color: colors.muted, fontSize: 7, fontWeight: "800" },
  stockCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 13, marginBottom: 9 },
  stockTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  stockBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 6 },
  stockBadgeText: { fontSize: 7, fontWeight: "900" },
  stockBottom: { flexDirection: "row", alignItems: "center", gap: 13, marginTop: 12 },
  qty: { color: colors.text, fontSize: 13, fontWeight: "900", minWidth: 72 },
  unit: { color: colors.muted, fontSize: 8, fontWeight: "600" },
  bar: { flex: 1, height: 6, borderRadius: 5, backgroundColor: colors.purpleSoft, overflow: "hidden" },
  barFill: { height: 6, borderRadius: 5 },
  primary: { backgroundColor: colors.pink, borderRadius: 13, padding: 14, alignItems: "center", marginTop: 7 },
  primaryText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  notice: { backgroundColor: colors.purpleSoft, borderRadius: 14, padding: 13, marginTop: 16 },
  noticeTitle: { color: colors.purpleDark, fontSize: 10, fontWeight: "900", marginBottom: 5 },
  noticeText: { color: colors.purpleDark, fontSize: 8, lineHeight: 13 },
  footer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 19 }
});
