import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";
import { supabase } from "./supabase";

type Status = "requested" | "confirmed" | "arrived" | "in_progress" | "completed" | "cancelled" | "no_show" | "rescheduled";
type RawAppointment = {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  service_id: string | null;
  scheduled_start: string;
  scheduled_end: string;
  status: Status;
  reason: string | null;
};
type Appointment = RawAppointment & { patientName: string; doctorName: string; serviceName: string };
type Filter = "All" | "Today" | "Upcoming";

const statusLabel: Record<Status, string> = {
  requested: "Requested", confirmed: "Confirmed", arrived: "Arrived",
  in_progress: "In progress", completed: "Completed", cancelled: "Cancelled",
  no_show: "No show", rescheduled: "Rescheduled"
};

export default function ClinicAppointmentsScreen({ onBack, clinicId }: { onBack: () => void; clinicId: string | null }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    if (!supabase || !clinicId) {
      setAppointments([]);
      setLoading(false);
      return;
    }
    setError("");
    const { data, error: queryError } = await supabase
      .from("appointments")
      .select("id, patient_id, doctor_id, service_id, scheduled_start, scheduled_end, status, reason")
      .eq("clinic_id", clinicId)
      .order("scheduled_start", { ascending: true })
      .limit(100);
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }
    const rows = (data || []) as RawAppointment[];
    const patientIds = [...new Set(rows.map(row => row.patient_id))];
    const doctorIds = [...new Set(rows.map(row => row.doctor_id).filter((id): id is string => Boolean(id)))];
    const serviceIds = [...new Set(rows.map(row => row.service_id).filter((id): id is string => Boolean(id)))];
    const [patientsResult, doctorsResult, servicesResult] = await Promise.all([
      patientIds.length ? supabase.from("patients").select("id, full_name").in("id", patientIds) : Promise.resolve({ data: [], error: null }),
      doctorIds.length ? supabase.from("doctors").select("id, full_name").in("id", doctorIds) : Promise.resolve({ data: [], error: null }),
      serviceIds.length ? supabase.from("services").select("id, name").in("id", serviceIds) : Promise.resolve({ data: [], error: null })
    ]);
    if (patientsResult.error || doctorsResult.error || servicesResult.error) {
      setError(patientsResult.error?.message || doctorsResult.error?.message || servicesResult.error?.message || "Could not load appointment details.");
      setLoading(false);
      return;
    }
    const patientNames = new Map((patientsResult.data || []).map((item: any) => [item.id, item.full_name]));
    const doctorNames = new Map((doctorsResult.data || []).map((item: any) => [item.id, item.full_name]));
    const serviceNames = new Map((servicesResult.data || []).map((item: any) => [item.id, item.name]));
    setAppointments(rows.map(row => ({
      ...row,
      patientName: String(patientNames.get(row.patient_id) || "Patient"),
      doctorName: row.doctor_id ? String(doctorNames.get(row.doctor_id) || "Doctor not assigned") : "Doctor not assigned",
      serviceName: row.service_id ? String(serviceNames.get(row.service_id) || "Service") : (row.reason || "Consultation")
    })));
    setLoading(false);
  }, [clinicId]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const refresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const updateStatus = async (id: string, status: Status) => {
    if (!supabase || !clinicId) return;
    setSavingId(id);
    const { error: updateError } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .eq("clinic_id", clinicId);
    setSavingId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setAppointments(current => current.map(item => item.id === id ? { ...item, status } : item));
  };

  const visible = useMemo(() => appointments.filter(item => {
    if (filter === "All") return true;
    const start = new Date(item.scheduled_start);
    const now = new Date();
    if (filter === "Today") return start.toDateString() === now.toDateString();
    return start.getTime() >= now.getTime() && item.status !== "cancelled" && item.status !== "completed";
  }), [appointments, filter]);

  const tone = (status: Status) => status === "completed" || status === "arrived" || status === "in_progress" ? styles.statusGreen : status === "cancelled" || status === "no_show" ? styles.statusRed : styles.statusPurple;

  const nextAction = (item: Appointment) => {
    if (item.status === "requested") return { label: "Confirm", status: "confirmed" as Status };
    if (item.status === "confirmed") return { label: "Mark arrived", status: "arrived" as Status };
    if (item.status === "arrived") return { label: "Start visit", status: "in_progress" as Status };
    if (item.status === "in_progress") return { label: "Complete visit", status: "completed" as Status };
    return null;
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.purple} />}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  Back to dashboard</Text></Pressable>
        <Text style={styles.eyebrow}>TAJ DENTAL · CLINIC WORKSPACE</Text>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Live clinic schedule. Pull down to refresh the latest appointments.</Text>
        {!clinicId ? <View style={styles.notice}><Text style={styles.noticeText}>Sign in with a clinic staff account to view its appointment schedule. Demo workspace data is not shown here.</Text></View> : null}
        {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text><Pressable onPress={loadAppointments}><Text style={styles.retry}>Try again</Text></Pressable></View> : null}
        {clinicId && loading ? <View style={styles.loading}><ActivityIndicator color={colors.purple} /><Text style={styles.meta}>Loading appointments…</Text></View> : null}
        {clinicId && !loading ? <>
          <View style={styles.summary}>
            <View style={styles.summaryItem}><Text style={styles.summaryValue}>{appointments.length.toString().padStart(2, "0")}</Text><Text style={styles.summaryLabel}>Total loaded</Text></View>
            <View style={styles.summaryItem}><Text style={styles.summaryValue}>{appointments.filter(x => x.status === "arrived").length.toString().padStart(2, "0")}</Text><Text style={styles.summaryLabel}>Arrived</Text></View>
            <View style={styles.summaryItem}><Text style={styles.summaryValue}>{appointments.filter(x => x.status === "requested" || x.status === "confirmed").length.toString().padStart(2, "0")}</Text><Text style={styles.summaryLabel}>Pending</Text></View>
          </View>
          <View style={styles.filters}>
            {(["All", "Today", "Upcoming"] as Filter[]).map(item => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}
          </View>
          {visible.map(item => {
            const action = nextAction(item);
            return <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}><Text style={styles.time}>{new Date(item.scheduled_start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text><Text style={[styles.status, tone(item.status)]}>{statusLabel[item.status]}</Text></View>
              <Text style={styles.patient}>{item.patientName}</Text>
              <Text style={styles.meta}>{item.serviceName}</Text>
              <Text style={styles.meta}>{item.doctorName} · {new Date(item.scheduled_start).toLocaleDateString()}</Text>
              {item.reason ? <Text style={styles.reason}>{item.reason}</Text> : null}
              <View style={styles.actions}>
                {action ? <Pressable disabled={savingId === item.id} style={styles.actionPrimary} onPress={() => updateStatus(item.id, action.status)}><Text style={styles.actionPrimaryText}>{savingId === item.id ? "Saving…" : action.label}</Text></Pressable> : null}
                {item.status !== "completed" && item.status !== "cancelled" && item.status !== "no_show" ? <Pressable disabled={savingId === item.id} style={styles.actionSecondary} onPress={() => updateStatus(item.id, "cancelled")}><Text style={styles.actionSecondaryText}>Cancel</Text></Pressable> : null}
              </View>
            </View>;
          })}
          {visible.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No appointments found</Text><Text style={styles.meta}>New patient bookings will appear here when created.</Text></View> : null}
        </> : null}
        <Text style={styles.footer}>TAJ DENTAL · A Product by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 48, paddingBottom: 32 },
  back: { marginBottom: 20 },
  backText: { color: colors.purple, fontSize: 12, fontWeight: "800" },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.2, marginBottom: 8 },
  title: { color: colors.text, fontSize: 26, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 7, marginBottom: 17 },
  summary: { flexDirection: "row", gap: 8, marginBottom: 16 },
  summaryItem: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 13 },
  summaryValue: { color: colors.purpleDark, fontSize: 22, fontWeight: "900" },
  summaryLabel: { color: colors.muted, fontSize: 9, fontWeight: "700", marginTop: 3 },
  filters: { flexDirection: "row", backgroundColor: colors.purpleSoft, borderRadius: 13, padding: 4, marginBottom: 13 },
  filter: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10 },
  filterActive: { backgroundColor: colors.surface },
  filterText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
  filterTextActive: { color: colors.purpleDark },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, marginBottom: 10 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  time: { color: colors.purpleDark, fontSize: 15, fontWeight: "900" },
  status: { fontSize: 8, fontWeight: "900", paddingHorizontal: 9, paddingVertical: 6, borderRadius: 10, overflow: "hidden" },
  statusGreen: { color: "#18794E", backgroundColor: "#E4F7ED" },
  statusRed: { color: "#B42318", backgroundColor: "#FEE4E2" },
  statusPurple: { color: colors.purpleDark, backgroundColor: colors.purpleSoft },
  patient: { color: colors.text, fontSize: 13, fontWeight: "900" },
  meta: { color: colors.muted, fontSize: 10, marginTop: 5 },
  reason: { color: colors.text, fontSize: 10, marginTop: 8 },
  actions: { flexDirection: "row", gap: 8, marginTop: 13 },
  actionPrimary: { backgroundColor: colors.pink, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10 },
  actionPrimaryText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
  actionSecondary: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10 },
  actionSecondaryText: { color: colors.muted, fontSize: 9, fontWeight: "800" },
  loading: { alignItems: "center", paddingVertical: 30, gap: 9 },
  empty: { alignItems: "center", paddingVertical: 35 },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: "900", marginBottom: 6 },
  notice: { backgroundColor: colors.purpleSoft, padding: 14, borderRadius: 13, marginBottom: 15 },
  noticeText: { color: colors.purpleDark, fontSize: 10, lineHeight: 15 },
  error: { backgroundColor: "#FEE4E2", padding: 13, borderRadius: 12, marginBottom: 14 },
  errorText: { color: "#B42318", fontSize: 10, lineHeight: 15 },
  retry: { color: "#B42318", fontSize: 10, fontWeight: "900", marginTop: 8 },
  footer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 20 }
});
