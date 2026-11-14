import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "./theme";
import { supabase } from "./supabase";

type Section = "Doctors" | "Inventory";
type Doctor = { id: string; full_name: string; specialty: string | null; license_number: string | null; phone: string | null; email: string | null; is_active: boolean };
const stock = [
  { name: "Examination gloves", category: "Clinical supplies", qty: 18, unit: "boxes", level: "Low stock", expiry: "Aug 2027" },
  { name: "Composite resin", category: "Restorative", qty: 42, unit: "syringes", level: "In stock", expiry: "Mar 2027" },
  { name: "Dental masks", category: "PPE", qty: 120, unit: "packs", level: "In stock", expiry: "Dec 2027" },
  { name: "Local anaesthetic", category: "Medication", qty: 8, unit: "boxes", level: "Low stock", expiry: "Jan 2027" },
  { name: "Sterilization pouches", category: "Clinical supplies", qty: 0, unit: "packs", level: "Out of stock", expiry: "—" }
];

export default function ClinicOperationsScreen({ initialSection, onBack, clinicId, canManage }: { initialSection: Section; onBack: () => void; clinicId: string | null; canManage: boolean }) {
  const [section, setSection] = useState<Section>(initialSection);
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const loadDoctors = useCallback(async () => {
    if (!supabase || !clinicId) {
      setDoctors([]);
      setLoading(false);
      return;
    }
    setError("");
    const { data, error: queryError } = await supabase.from("doctors")
      .select("id, full_name, specialty, license_number, phone, email, is_active")
      .eq("clinic_id", clinicId)
      .order("full_name", { ascending: true });
    if (queryError) setError(queryError.message);
    else setDoctors((data || []) as Doctor[]);
    setLoading(false);
  }, [clinicId]);

  useEffect(() => { if (section === "Doctors") loadDoctors(); }, [section, loadDoctors]);

  const doctorRows = useMemo(() => doctors.filter(d => (d.full_name + (d.specialty || "")).toLowerCase().includes(query.toLowerCase())), [doctors, query]);
  const stockRows = useMemo(() => stock.filter(s => (s.name + s.category).toLowerCase().includes(query.toLowerCase())), [query]);

  const addDoctor = async () => {
    if (!supabase || !clinicId || !canManage) return;
    if (!name.trim()) { setError("Doctor name is required."); return; }
    setSaving(true);
    setError("");
    const { data, error: insertError } = await supabase.from("doctors").insert({
      clinic_id: clinicId,
      full_name: name.trim(),
      specialty: specialty.trim() || null,
      license_number: license.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      is_active: true
    }).select("id, full_name, specialty, license_number, phone, email, is_active").single();
    setSaving(false);
    if (insertError) { setError(insertError.message); return; }
    setDoctors(current => [...current, data as Doctor].sort((a, b) => a.full_name.localeCompare(b.full_name)));
    setName(""); setSpecialty(""); setLicense(""); setPhone(""); setEmail("");
    setAdding(false);
  };

  const toggleDoctor = async (doctor: Doctor) => {
    if (!supabase || !clinicId || !canManage) return;
    const { error: updateError } = await supabase.from("doctors").update({ is_active: !doctor.is_active }).eq("id", doctor.id).eq("clinic_id", clinicId);
    if (updateError) { setError(updateError.message); return; }
    setDoctors(current => current.map(item => item.id === doctor.id ? { ...item, is_active: !doctor.is_active } : item));
  };

  const refresh = async () => {
    setRefreshing(true);
    if (section === "Doctors") await loadDoctors();
    setRefreshing(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.purple} />}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  Clinic workspace</Text></Pressable>
        <Text style={styles.eyebrow}>CLINIC OPERATIONS</Text>
        <Text style={styles.heading}>{section === "Doctors" ? "Doctor management" : "Inventory"}</Text>
        <Text style={styles.subtitle}>{section === "Doctors" ? "Manage your dental team and professional directory." : "Track clinical supplies, stock levels and expiry dates."}</Text>
        <View style={styles.switcher}>
          {(["Doctors", "Inventory"] as Section[]).map(s => <Pressable key={s} onPress={() => { setSection(s); setQuery(""); setAdding(false); }} style={[styles.switch, section === s && styles.switchActive]}><Text style={[styles.switchText, section === s && styles.switchTextActive]}>{s}</Text></Pressable>)}
        </View>

        {section === "Doctors" ? <>
          {!clinicId ? <View style={styles.notice}><Text style={styles.noticeTitle}>Demo mode</Text><Text style={styles.noticeText}>Sign in with an authorized clinic account to manage the doctor directory. Sample doctor names are not displayed.</Text></View> : null}
          {clinicId && loading ? <View style={styles.loading}><ActivityIndicator color={colors.purple} /><Text style={styles.meta}>Loading doctors…</Text></View> : null}
          {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}
          {clinicId && !loading && adding ? <View style={styles.formCard}>
            <Field label="Doctor full name *" value={name} onChangeText={setName} placeholder="Dr. Full Name" />
            <Field label="Specialty" value={specialty} onChangeText={setSpecialty} placeholder="e.g. General Dentist" />
            <Field label="Professional licence number" value={license} onChangeText={setLicense} placeholder="Registration / licence" />
            <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="+92 3XX XXXXXXX" />
            <Field label="Email" value={email} onChangeText={setEmail} placeholder="doctor@example.com" />
            <Pressable disabled={saving} style={[styles.primary, saving && styles.disabled]} onPress={addDoctor}><Text style={styles.primaryText}>{saving ? "Saving…" : "Save doctor"}</Text></Pressable>
          </View> : null}
          {clinicId && !loading && !adding ? <>
            <View style={styles.summary}><View style={styles.summaryItem}><Text style={styles.summaryValue}>{doctors.length}</Text><Text style={styles.summaryLabel}>Listed doctors</Text></View><View style={styles.summaryItem}><Text style={styles.summaryValue}>{doctors.filter(d => d.is_active).length}</Text><Text style={styles.summaryLabel}>Active</Text></View><View style={styles.summaryItem}><Text style={styles.summaryValue}>{doctors.filter(d => !d.is_active).length}</Text><Text style={styles.summaryLabel}>Inactive</Text></View></View>
            <TextInput value={query} onChangeText={setQuery} placeholder="Search doctor or specialty" placeholderTextColor={colors.muted} style={styles.searchInput} />
            {canManage ? <Pressable style={styles.primary} onPress={() => setAdding(true)}><Text style={styles.primaryText}>＋  Add doctor</Text></Pressable> : null}
            <Text style={styles.section}>Dental team</Text>
            {doctorRows.map(d => <View key={d.id} style={styles.card}><View style={styles.avatar}><Text style={styles.avatarText}>{d.full_name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}</Text></View><View style={styles.copy}><Text style={styles.name}>{d.full_name}</Text><Text style={styles.meta}>{d.specialty || "Specialty not provided"}</Text><Text style={styles.meta}>{d.license_number ? "Licence: " + d.license_number : "Licence not provided"}</Text><Text style={styles.meta}>{d.phone || d.email || "Contact not provided"}</Text></View><View style={styles.statusWrap}><View style={[styles.dot, { backgroundColor: d.is_active ? colors.success : colors.warning }]} /><Text style={styles.status}>{d.is_active ? "Active" : "Inactive"}</Text>{canManage ? <Pressable onPress={() => toggleDoctor(d)}><Text style={styles.toggle}>{d.is_active ? "Deactivate" : "Activate"}</Text></Pressable> : null}</View></View>)}
            {doctorRows.length === 0 ? <View style={styles.empty}><Text style={styles.name}>No doctors listed yet</Text><Text style={styles.meta}>Add your first doctor to build the clinic directory.</Text></View> : null}
          </> : null}
        </> : <>
          {clinicId ? <View style={styles.notice}><Text style={styles.noticeTitle}>Inventory integration pending</Text><Text style={styles.noticeText}>Inventory stock figures below are sample placeholders only. Live stock, supplier receiving, adjustments and expiry alerts are not connected yet.</Text></View> : <View style={styles.notice}><Text style={styles.noticeText}>Inventory preview only. Sign in to a clinic account for future live inventory features.</Text></View>}
          <TextInput value={query} onChangeText={setQuery} placeholder="Search sample inventory item" placeholderTextColor={colors.muted} style={styles.searchInput} />
          {stockRows.map(s => <View key={s.name} style={styles.stockCard}><View style={styles.stockTop}><View style={styles.copy}><Text style={styles.name}>{s.name}</Text><Text style={styles.meta}>{s.category} · Sample expiry {s.expiry}</Text></View><View style={styles.stockBadge}><Text style={styles.stockBadgeText}>{s.level}</Text></View></View><View style={styles.stockBottom}><Text style={styles.qty}>{s.qty} <Text style={styles.unit}>{s.unit}</Text></Text><View style={styles.bar}><View style={[styles.barFill, { width: Math.min(s.qty / 120 * 100, 100) + "%" }]} /></View></View></View>)}
        </>}
        <Text style={styles.footer}>TAJ DENTAL · A Product by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} style={styles.input} /></View>;
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
  searchInput: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 13, color: colors.text, fontSize: 10 },
  section: { color: colors.text, fontSize: 14, fontWeight: "900", marginBottom: 10 },
  card: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 12, marginBottom: 9 },
  avatar: { width: 39, height: 39, borderRadius: 14, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.purpleDark, fontSize: 10, fontWeight: "900" },
  copy: { flex: 1 },
  name: { color: colors.text, fontSize: 10, fontWeight: "900" },
  meta: { color: colors.muted, fontSize: 8, marginTop: 4 },
  statusWrap: { alignItems: "flex-end", gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  status: { color: colors.muted, fontSize: 7 },
  toggle: { color: colors.pink, fontSize: 8, fontWeight: "900" },
  primary: { backgroundColor: colors.pink, borderRadius: 13, paddingVertical: 14, alignItems: "center", marginBottom: 14 },
  primaryText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  formCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 14 },
  field: { marginBottom: 12 },
  label: { color: colors.text, fontSize: 10, fontWeight: "800", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 12, color: colors.text, fontSize: 11 },
  disabled: { opacity: 0.55 },
  loading: { alignItems: "center", paddingVertical: 30, gap: 8 },
  empty: { alignItems: "center", paddingVertical: 30 },
  error: { backgroundColor: "#FEE4E2", padding: 12, borderRadius: 12, marginBottom: 12 },
  errorText: { color: "#B42318", fontSize: 10 },
  notice: { backgroundColor: colors.purpleSoft, padding: 14, borderRadius: 13, marginBottom: 15 },
  noticeTitle: { color: colors.purpleDark, fontSize: 11, fontWeight: "900" },
  noticeText: { color: colors.purpleDark, fontSize: 9, lineHeight: 14, marginTop: 4 },
  stockCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 13, marginBottom: 9 },
  stockTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stockBadge: { backgroundColor: colors.purpleSoft, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6 },
  stockBadgeText: { color: colors.purpleDark, fontSize: 7, fontWeight: "900" },
  stockBottom: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 13 },
  qty: { color: colors.purpleDark, fontSize: 17, fontWeight: "900", width: 80 },
  unit: { color: colors.muted, fontSize: 8, fontWeight: "600" },
  bar: { flex: 1, height: 6, backgroundColor: colors.purpleSoft, borderRadius: 5, overflow: "hidden" },
  barFill: { height: 6, backgroundColor: colors.purple, borderRadius: 5 },
  footer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 20 }
});
