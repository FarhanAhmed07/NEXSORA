import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "./theme";

type Patient = { id: string; name: string; age: number; phone: string; lastVisit: string; nextVisit: string; status: string; initials: string; concern: string };
const patients: Patient[] = [
  { id: "DC-1048", name: "Ava Thompson", age: 29, phone: "+1 202 555 0148", lastVisit: "Nov 03, 2026", nextVisit: "Nov 17 · 10:30 AM", status: "Active", initials: "AT", concern: "Routine check-up" },
  { id: "DC-1047", name: "Noah Williams", age: 41, phone: "+1 202 555 0147", lastVisit: "Oct 28, 2026", nextVisit: "Nov 17 · 11:00 AM", status: "Follow-up", initials: "NW", concern: "Tooth sensitivity" },
  { id: "DC-1046", name: "Mia Johnson", age: 35, phone: "+1 202 555 0146", lastVisit: "Oct 21, 2026", nextVisit: "Not scheduled", status: "Active", initials: "MJ", concern: "Cleaning & prevention" },
  { id: "DC-1045", name: "Ethan Brown", age: 52, phone: "+1 202 555 0145", lastVisit: "Sep 19, 2026", nextVisit: "Not scheduled", status: "Needs review", initials: "EB", concern: "Crown consultation" },
  { id: "DC-1044", name: "Isabella Davis", age: 24, phone: "+1 202 555 0144", lastVisit: "Sep 12, 2026", nextVisit: "Nov 19 · 09:15 AM", status: "Active", initials: "ID", concern: "Braces consultation" }
];

export default function PatientManagementScreen({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Patient | null>(null);
  const filtered = useMemo(() => patients.filter(p => (filter === "All" || p.status === filter) && (p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()))), [query, filter]);

  if (selected) return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => setSelected(null)} style={styles.back}><Text style={styles.backText}>‹  All patients</Text></Pressable>
        <View style={styles.profile}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{selected.initials}</Text></View>
          <Text style={styles.name}>{selected.name}</Text>
          <Text style={styles.muted}>{selected.id}  ·  {selected.age} years</Text>
          <View style={styles.status}><Text style={styles.statusText}>{selected.status.toUpperCase()}</Text></View>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={styles.action} onPress={() => Alert.alert("Call patient", "Calling will be enabled when clinic contact services are connected.")}><Text style={styles.actionIcon}>☎</Text><Text style={styles.actionLabel}>Call</Text></Pressable>
          <Pressable style={styles.action} onPress={() => Alert.alert("Message patient", "Secure messaging will be connected in a later phase.")}><Text style={styles.actionIcon}>✉</Text><Text style={styles.actionLabel}>Message</Text></Pressable>
          <Pressable style={styles.action} onPress={() => Alert.alert("Edit profile", "Patient editing will be enabled after secure staff access is connected.")}><Text style={styles.actionIcon}>✎</Text><Text style={styles.actionLabel}>Edit</Text></Pressable>
        </View>
        <Text style={styles.section}>Contact information</Text>
        <View style={styles.card}><Info label="Phone number" value={selected.phone} /><Info label="Patient ID" value={selected.id} /><Info label="Primary concern" value={selected.concern} /></View>
        <Text style={styles.section}>Care overview</Text>
        <View style={styles.card}><Info label="Last visit" value={selected.lastVisit} /><Info label="Next appointment" value={selected.nextVisit} /><Info label="Patient status" value={selected.status} /></View>
        <Text style={styles.section}>Clinical timeline</Text>
        <View style={styles.timeline}>
          <TimelineItem date={selected.lastVisit} title="Dental consultation" note="Visit record · Sample data" />
          <TimelineItem date="Oct 10, 2026" title="Treatment plan reviewed" note="Clinical note · Sample data" />
          <TimelineItem date="Sep 02, 2026" title="Patient profile created" note="Registration · Sample data" />
        </View>
        <View style={styles.notice}><Text style={styles.noticeTitle}>Privacy reminder</Text><Text style={styles.noticeText}>This is fictional demo information. Real patient charts must only be accessed by verified staff with the correct clinic permissions.</Text></View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  Clinic workspace</Text></Pressable>
        <Text style={styles.eyebrow}>CLINIC MANAGEMENT</Text>
        <Text style={styles.heading}>Patients</Text>
        <Text style={styles.subtitle}>Manage patient profiles, appointments and care history.</Text>
        <View style={styles.stats}>
          <Stat value="128" label="Total patients" />
          <Stat value="18" label="Today" />
          <Stat value="04" label="Need review" />
        </View>
        <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search name or patient ID" placeholderTextColor={colors.muted} style={styles.searchInput} /></View>
        <View style={styles.filters}>{["All", "Active", "Follow-up", "Needs review"].map(item => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</View>
        <View style={styles.listHead}><Text style={styles.section}>Patient directory</Text><Text style={styles.count}>{filtered.length} records</Text></View>
        {filtered.map(p => <Pressable key={p.id} style={styles.patient} onPress={() => setSelected(p)}>
          <View style={styles.patientAvatar}><Text style={styles.patientAvatarText}>{p.initials}</Text></View>
          <View style={styles.patientCopy}><Text style={styles.patientName}>{p.name}</Text><Text style={styles.patientMeta}>{p.id}  ·  Last visit {p.lastVisit}</Text><Text style={styles.patientNext}>Next: {p.nextVisit}</Text></View>
          <View style={styles.patientRight}><View style={[styles.dot, { backgroundColor: p.status === "Needs review" ? colors.warning : p.status === "Follow-up" ? colors.pink : colors.success }]} /><Text style={styles.patientStatus}>{p.status}</Text><Text style={styles.chevron}>›</Text></View>
        </Pressable>)}
        {filtered.length === 0 && <View style={styles.empty}><Text style={styles.emptyTitle}>No patients found</Text><Text style={styles.muted}>Try another name or filter.</Text></View>}
        <Pressable style={styles.addButton} onPress={() => Alert.alert("Register patient", "The registration form will be connected after the secure clinic workflow is approved.")}><Text style={styles.addText}>＋  Register new patient</Text></Pressable>
        <Text style={styles.footer}>DEMO DATA ONLY · DentaCare by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>; }
function TimelineItem({ date, title, note }: { date: string; title: string; note: string }) { return <View style={styles.timelineItem}><View style={styles.timelineDot} /><View style={styles.timelineCopy}><Text style={styles.timelineTitle}>{title}</Text><Text style={styles.timelineNote}>{date}  ·  {note}</Text></View></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 48, paddingBottom: 34 },
  back: { alignSelf: "flex-start", paddingVertical: 7, marginBottom: 16 },
  backText: { color: colors.purple, fontSize: 12, fontWeight: "900" },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.6, marginBottom: 7 },
  heading: { color: colors.text, fontSize: 28, fontWeight: "900", letterSpacing: -0.8 },
  subtitle: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 6, marginBottom: 19 },
  stats: { flexDirection: "row", gap: 8, marginBottom: 18 },
  stat: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 12 },
  statValue: { color: colors.purple, fontSize: 21, fontWeight: "900" },
  statLabel: { color: colors.muted, fontSize: 8, marginTop: 4 },
  search: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 13, marginBottom: 12 },
  searchIcon: { color: colors.pink, fontSize: 22, marginRight: 8 },
  searchInput: { flex: 1, height: 45, color: colors.text, fontSize: 11 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 22 },
  filter: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: colors.surface },
  filterActive: { backgroundColor: colors.purpleDark, borderColor: colors.purpleDark },
  filterText: { color: colors.muted, fontSize: 9, fontWeight: "800" },
  filterTextActive: { color: "#FFFFFF" },
  listHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  section: { color: colors.text, fontSize: 14, fontWeight: "900", marginTop: 7, marginBottom: 11 },
  count: { color: colors.muted, fontSize: 9 },
  patient: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12, marginBottom: 9, gap: 10 },
  patientAvatar: { width: 39, height: 39, borderRadius: 14, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  patientAvatarText: { color: colors.purpleDark, fontSize: 10, fontWeight: "900" },
  patientCopy: { flex: 1 },
  patientName: { color: colors.text, fontSize: 11, fontWeight: "900" },
  patientMeta: { color: colors.muted, fontSize: 8, marginTop: 4 },
  patientNext: { color: colors.purple, fontSize: 8, fontWeight: "700", marginTop: 5 },
  patientRight: { alignItems: "flex-end", gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 4 },
  patientStatus: { color: colors.muted, fontSize: 7, fontWeight: "800" },
  chevron: { color: colors.pink, fontSize: 19 },
  empty: { alignItems: "center", padding: 28, backgroundColor: colors.surface, borderRadius: 15 },
  emptyTitle: { color: colors.text, fontWeight: "900", marginBottom: 5 },
  addButton: { backgroundColor: colors.pink, borderRadius: 14, padding: 15, alignItems: "center", marginTop: 8 },
  addText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  footer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 20, letterSpacing: 0.6 },
  profile: { alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: 22, marginBottom: 14 },
  avatar: { width: 66, height: 66, borderRadius: 23, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center", marginBottom: 11 },
  avatarText: { color: colors.purpleDark, fontSize: 20, fontWeight: "900" },
  name: { color: colors.text, fontSize: 18, fontWeight: "900" },
  muted: { color: colors.muted, fontSize: 10, marginTop: 5 },
  status: { backgroundColor: colors.successSoft, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6, marginTop: 10 },
  statusText: { color: colors.success, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  actionRow: { flexDirection: "row", gap: 9, marginBottom: 19 },
  action: { flex: 1, alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12 },
  actionIcon: { color: colors.purple, fontSize: 17, fontWeight: "900" },
  actionLabel: { color: colors.text, fontSize: 9, fontWeight: "800", marginTop: 5 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 14, marginBottom: 15 },
  info: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { color: colors.muted, fontSize: 8, marginBottom: 4 },
  infoValue: { color: colors.text, fontSize: 11, fontWeight: "800" },
  timeline: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14 },
  timelineItem: { flexDirection: "row", gap: 10, paddingVertical: 9 },
  timelineDot: { width: 8, height: 8, borderRadius: 5, backgroundColor: colors.pink, marginTop: 3 },
  timelineCopy: { flex: 1 },
  timelineTitle: { color: colors.text, fontSize: 10, fontWeight: "900" },
  timelineNote: { color: colors.muted, fontSize: 8, marginTop: 4 },
  notice: { backgroundColor: colors.purpleSoft, borderRadius: 15, padding: 13, marginTop: 15 },
  noticeTitle: { color: colors.purpleDark, fontSize: 10, fontWeight: "900", marginBottom: 5 },
  noticeText: { color: colors.purpleDark, fontSize: 8, lineHeight: 13 }
});
