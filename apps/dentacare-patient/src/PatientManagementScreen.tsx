import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "./theme";
import { supabase } from "./supabase";

type Patient = {
  id: string;
  patient_number: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  status: "active" | "inactive" | "archived";
  created_at: string;
};

export default function PatientManagementScreen({ onBack, clinicId }: { onBack: () => void; clinicId: string | null }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadPatients = useCallback(async () => {
    if (!supabase || !clinicId) {
      setPatients([]);
      setLoading(false);
      return;
    }
    setError("");
    const { data, error: loadError } = await supabase
      .from("patients")
      .select("id, patient_number, full_name, phone, email, status, created_at")
      .eq("clinic_id", clinicId)
      .order("created_at", { ascending: false })
      .limit(250);
    if (loadError) setError(loadError.message);
    else setPatients((data || []) as Patient[]);
    setLoading(false);
  }, [clinicId]);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  const refresh = async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  };

  const filtered = useMemo(() => patients.filter(patient =>
    patient.full_name.toLowerCase().includes(query.toLowerCase()) ||
    patient.patient_number.toLowerCase().includes(query.toLowerCase()) ||
    (patient.phone || "").includes(query)
  ), [patients, query]);

  const createPatient = async () => {
    if (!supabase || !clinicId) return;
    if (!name.trim()) {
      setError("Patient name is required.");
      return;
    }
    setSaving(true);
    setError("");
    const { data: userResult } = await supabase.auth.getUser();
    const userId = userResult.user?.id;
    if (!userId) {
      setSaving(false);
      setError("Your session has expired. Please sign in again.");
      return;
    }
    const patientNumber = "TD-" + Date.now().toString(36).toUpperCase();
    const { data, error: insertError } = await supabase.from("patients").insert({
      clinic_id: clinicId,
      patient_number: patientNumber,
      full_name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      address: address.trim() || null,
      status: "active",
      created_by: userId
    }).select("id, patient_number, full_name, phone, email, status, created_at").single();
    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setPatients(current => [data as Patient, ...current]);
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setAdding(false);
    setSelected(data as Patient);
  };

  const updateStatus = async (patient: Patient, status: Patient["status"]) => {
    if (!supabase || !clinicId) return;
    const { error: updateError } = await supabase.from("patients").update({ status }).eq("id", patient.id).eq("clinic_id", clinicId);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    const updated = { ...patient, status };
    setPatients(current => current.map(item => item.id === patient.id ? updated : item));
    setSelected(updated);
  };

  const Field = ({ label, value, onChangeText, placeholder, keyboardType = "default" }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: "default" | "email-address" | "phone-pad" }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} keyboardType={keyboardType} autoCapitalize={keyboardType === "email-address" ? "none" : "words"} style={styles.input} />
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.purple} />}>
        <Pressable onPress={() => selected || adding ? (setSelected(null), setAdding(false)) : onBack()} style={styles.back}><Text style={styles.backText}>‹  {selected || adding ? "Patient directory" : "Clinic workspace"}</Text></Pressable>
        <Text style={styles.eyebrow}>TAJ DENTAL · CLINIC MANAGEMENT</Text>
        <Text style={styles.title}>{adding ? "Register patient" : selected ? "Patient profile" : "Patients"}</Text>
        <Text style={styles.subtitle}>{adding ? "Add a patient to this clinic's secure records." : selected ? "Patient details stored in this clinic workspace." : "Search and manage your clinic's patient directory."}</Text>

        {!clinicId ? <View style={styles.notice}><Text style={styles.noticeText}>Sign in with a clinic staff account to access patient records. Demo patient data is not displayed.</Text></View> : null}
        {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}
        {clinicId && loading ? <View style={styles.loading}><ActivityIndicator color={colors.purple} /><Text style={styles.meta}>Loading patient records…</Text></View> : null}

        {clinicId && !loading && adding ? <>
          <View style={styles.formCard}>
            <Field label="Full name *" value={name} onChangeText={setName} placeholder="Patient full name" />
            <Field label="Phone number" value={phone} onChangeText={setPhone} placeholder="+92 3XX XXXXXXX" keyboardType="phone-pad" />
            <Field label="Email address" value={email} onChangeText={setEmail} placeholder="patient@example.com" keyboardType="email-address" />
            <Field label="Address" value={address} onChangeText={setAddress} placeholder="Patient address" />
            <Pressable disabled={saving} style={[styles.primary, saving && styles.disabled]} onPress={createPatient}><Text style={styles.primaryText}>{saving ? "Saving patient…" : "Save patient record"}</Text></Pressable>
          </View>
        </> : null}

        {clinicId && !loading && selected && !adding ? <>
          <View style={styles.profileCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{selected.full_name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}</Text></View>
            <Text style={styles.patientName}>{selected.full_name}</Text>
            <Text style={styles.meta}>{selected.patient_number}</Text>
            <Text style={[styles.status, selected.status === "active" ? styles.statusActive : styles.statusInactive]}>{selected.status.toUpperCase()}</Text>
          </View>
          <View style={styles.card}>
            <Info label="Phone" value={selected.phone || "Not provided"} />
            <Info label="Email" value={selected.email || "Not provided"} />
            <Info label="Registered" value={new Date(selected.created_at).toLocaleDateString()} />
            <Info label="Patient ID" value={selected.patient_number} />
          </View>
          {selected.status === "active" ? <Pressable style={styles.secondary} onPress={() => updateStatus(selected, "inactive")}><Text style={styles.secondaryText}>Mark inactive</Text></Pressable> : <Pressable style={styles.primary} onPress={() => updateStatus(selected, "active")}><Text style={styles.primaryText}>Reactivate patient</Text></Pressable>}
          <Text style={styles.privacy}>Clinical notes, diagnoses and medical history are kept in separate permission-controlled modules.</Text>
        </> : null}

        {clinicId && !loading && !selected && !adding ? <>
          <View style={styles.stats}>
            <View style={styles.stat}><Text style={styles.statValue}>{patients.length}</Text><Text style={styles.statLabel}>Total records</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>{patients.filter(item => item.status === "active").length}</Text><Text style={styles.statLabel}>Active</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>{patients.filter(item => item.status !== "active").length}</Text><Text style={styles.statLabel}>Inactive</Text></View>
          </View>
          <TextInput value={query} onChangeText={setQuery} placeholder="Search name, patient ID or phone" placeholderTextColor={colors.muted} style={styles.search} />
          <Pressable style={styles.primary} onPress={() => setAdding(true)}><Text style={styles.primaryText}>＋  Register new patient</Text></Pressable>
          {filtered.map(patient => <Pressable key={patient.id} style={styles.patientRow} onPress={() => setSelected(patient)}>
            <View style={styles.rowAvatar}><Text style={styles.rowAvatarText}>{patient.full_name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}</Text></View>
            <View style={styles.rowCopy}><Text style={styles.rowName}>{patient.full_name}</Text><Text style={styles.meta}>{patient.patient_number} · {patient.phone || "No phone"}</Text></View>
            <Text style={[styles.rowStatus, patient.status === "active" ? styles.activeText : styles.inactiveText]}>{patient.status}</Text>
          </Pressable>)}
          {filtered.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No patient records yet</Text><Text style={styles.meta}>Register your first patient to begin.</Text></View> : null}
        </> : null}
        <Text style={styles.footer}>TAJ DENTAL · A Product by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 48, paddingBottom: 32 },
  back: { marginBottom: 20 },
  backText: { color: colors.purple, fontSize: 12, fontWeight: "800" },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.2, marginBottom: 8 },
  title: { color: colors.text, fontSize: 26, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 7, marginBottom: 17 },
  stats: { flexDirection: "row", gap: 8, marginBottom: 14 },
  stat: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 13 },
  statValue: { color: colors.purpleDark, fontSize: 21, fontWeight: "900" },
  statLabel: { color: colors.muted, fontSize: 9, marginTop: 4 },
  search: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, color: colors.text, fontSize: 11, marginBottom: 12 },
  primary: { backgroundColor: colors.pink, borderRadius: 13, paddingVertical: 14, alignItems: "center", marginBottom: 14 },
  primaryText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  secondary: { borderWidth: 1, borderColor: colors.border, borderRadius: 13, paddingVertical: 14, alignItems: "center", marginTop: 14 },
  secondaryText: { color: colors.purpleDark, fontSize: 11, fontWeight: "900" },
  formCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 15 },
  field: { marginBottom: 13 },
  label: { color: colors.text, fontSize: 10, fontWeight: "800", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 12, color: colors.text, fontSize: 11 },
  patientRow: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, marginBottom: 8 },
  rowAvatar: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  rowAvatarText: { color: colors.purpleDark, fontSize: 10, fontWeight: "900" },
  rowCopy: { flex: 1 },
  rowName: { color: colors.text, fontSize: 11, fontWeight: "900" },
  rowStatus: { fontSize: 9, fontWeight: "900" },
  activeText: { color: colors.success },
  inactiveText: { color: colors.muted },
  profileCard: { alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, marginBottom: 12 },
  avatar: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  avatarText: { color: colors.purpleDark, fontSize: 17, fontWeight: "900" },
  patientName: { color: colors.text, fontSize: 15, fontWeight: "900" },
  status: { fontSize: 8, fontWeight: "900", borderRadius: 10, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 6, marginTop: 9 },
  statusActive: { color: "#18794E", backgroundColor: "#E4F7ED" },
  statusInactive: { color: colors.muted, backgroundColor: colors.purpleSoft },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, paddingHorizontal: 14 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { color: colors.muted, fontSize: 10 },
  infoValue: { color: colors.text, fontSize: 10, fontWeight: "800", flexShrink: 1, textAlign: "right" },
  notice: { backgroundColor: colors.purpleSoft, padding: 14, borderRadius: 13 },
  noticeText: { color: colors.purpleDark, fontSize: 10, lineHeight: 15 },
  error: { backgroundColor: "#FEE4E2", padding: 13, borderRadius: 12, marginBottom: 14 },
  errorText: { color: "#B42318", fontSize: 10, lineHeight: 15 },
  loading: { alignItems: "center", paddingVertical: 30, gap: 9 },
  empty: { alignItems: "center", paddingVertical: 35 },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: "900", marginBottom: 6 },
  meta: { color: colors.muted, fontSize: 10, marginTop: 5 },
  disabled: { opacity: 0.55 },
  privacy: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 13 },
  footer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 20 }
});
