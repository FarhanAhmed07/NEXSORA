import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "./theme";

const clinics = [
  { name: "Taj Dental", area: "Main clinic · address to be configured", initials: "TD" },
  { name: "Taj Dental · Branch 02 (Preview)", area: "Branch 02 · address to be configured", initials: "T2" }
];
const doctors = [
  { name: "Dr. Emily Carter", specialty: "General Dentist", initials: "EC", clinic: 0 },
  { name: "Dr. Ahmed Khan", specialty: "Orthodontist", initials: "AK", clinic: 0 },
  { name: "Dr. Sara Malik", specialty: "Dental Surgeon", initials: "SM", clinic: 1 }
];
const services = ["General check-up", "Teeth cleaning", "Tooth pain", "Braces consultation"];
const dates = [
  { day: "MON", date: "16", month: "NOV" },
  { day: "TUE", date: "17", month: "NOV" },
  { day: "WED", date: "18", month: "NOV" },
  { day: "THU", date: "19", month: "NOV" },
  { day: "FRI", date: "20", month: "NOV" }
];
const slots = ["09:00 AM", "10:30 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

export default function AppointmentBookingScreen() {
  const [clinic, setClinic] = useState(0);
  const [doctor, setDoctor] = useState(0);
  const [service, setService] = useState(services[0]);
  const [date, setDate] = useState(1);
  const [slot, setSlot] = useState("10:30 AM");
  const [confirmed, setConfirmed] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const filteredDoctors = doctors.map((item, index) => ({ ...item, index })).filter(item => item.clinic === clinic);

  const selectClinic = (index: number) => {
    setClinic(index);
    setDoctor(doctors.findIndex(item => item.clinic === index));
  };
  const confirmDemo = () => {
    setConfirmed(true);
    setShowReview(false);
    Alert.alert("Demo booking complete", "Your appointment preview has been added on this screen only. No clinic was contacted and no real appointment was created.");
  };

  if (showReview || confirmed) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
        <Pressable onPress={() => { setShowReview(false); setConfirmed(false); }} style={styles.back}><Text style={styles.backText}>‹  Back to booking</Text></Pressable>
        <View style={styles.successMark}><Text style={styles.successMarkText}>{confirmed ? "✓" : "✦"}</Text></View>
        <Text style={styles.eyebrow}>{confirmed ? "PREVIEW SAVED" : "ALMOST THERE"}</Text>
        <Text style={styles.title}>{confirmed ? "Your visit preview" : "Review your visit"}</Text>
        <Text style={styles.subtitle}>{confirmed ? "This appointment is saved only in this demo session." : "Please check the details before confirming the demo."}</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>APPOINTMENT SUMMARY</Text>
          <Text style={styles.summaryTitle}>{service}</Text>
          <View style={styles.divider} />
          {[
            ["Clinic", clinics[clinic].name],
            ["Location", clinics[clinic].area],
            ["Dentist", doctors[doctor].name],
            ["Date", dates[date].day + ", " + dates[date].date + " " + dates[date].month + " 2026"],
            ["Time", slot]
          ].map(row => <View key={row[0]} style={styles.summaryRow}><Text style={styles.summaryLabel}>{row[0]}</Text><Text style={styles.summaryValue}>{row[1]}</Text></View>)}
        </View>
        {!confirmed ? <Pressable style={styles.primary} onPress={confirmDemo}><Text style={styles.primaryText}>Confirm demo appointment  →</Text></Pressable> : <Pressable style={styles.secondary} onPress={() => { setConfirmed(false); setShowReview(false); }}><Text style={styles.secondaryText}>Book another visit</Text></Pressable>}
        <Text style={styles.note}>Demo only · Live clinic schedules, booking confirmation and reminders will be connected securely later.</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>YOUR VISITS</Text>
      <Text style={styles.title}>Book an appointment</Text>
      <Text style={styles.subtitle}>Choose your clinic, dentist and a time that works for you.</Text>

      <View style={styles.stepRow}>
        {["Clinic", "Dentist", "Time", "Review"].map((label, i) => <View key={label} style={styles.stepItem}><View style={[styles.stepDot, i < 3 && styles.stepDotActive]}><Text style={[styles.stepNumber, i < 3 && styles.stepNumberActive]}>{i + 1}</Text></View><Text style={styles.stepLabel}>{label}</Text></View>)}
      </View>

      <Text style={styles.sectionTitle}>1. Select a clinic</Text>
      {clinics.map((item, index) => <Pressable key={item.name} onPress={() => selectClinic(index)} style={[styles.clinicCard, clinic === index && styles.selectedCard]}>
        <View style={styles.clinicIcon}><Text style={styles.clinicInitial}>{item.initials}</Text></View>
        <View style={styles.flex}><Text style={styles.itemTitle}>{item.name}</Text><Text style={styles.muted}>{item.area}</Text><Text style={styles.clinicMeta}>Clinic profile · Sample listing</Text></View>
        <View style={[styles.radio, clinic === index && styles.radioSelected]}>{clinic === index ? <View style={styles.radioInner} /> : null}</View>
      </Pressable>)}

      <Text style={styles.sectionTitle}>2. Choose your dentist</Text>
      {filteredDoctors.map(item => <Pressable key={item.name} onPress={() => setDoctor(item.index)} style={[styles.doctorCard, doctor === item.index && styles.selectedCard]}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{item.initials}</Text></View>
        <View style={styles.flex}><Text style={styles.itemTitle}>{item.name}</Text><Text style={styles.muted}>{item.specialty}</Text></View>
        {doctor === item.index ? <Text style={styles.check}>✓</Text> : <View style={styles.radio} />}
      </Pressable>)}

      <Text style={styles.sectionTitle}>3. What do you need?</Text>
      <View style={styles.chipWrap}>{services.map(item => <Pressable key={item} onPress={() => setService(item)} style={[styles.chip, service === item && styles.chipSelected]}><Text style={[styles.chipText, service === item && styles.chipTextSelected]}>{item}</Text></Pressable>)}</View>

      <Text style={styles.sectionTitle}>4. Pick a date</Text>
      <View style={styles.dateRow}>{dates.map((item, index) => <Pressable key={item.date} onPress={() => setDate(index)} style={[styles.dateCard, date === index && styles.dateSelected]}><Text style={[styles.dateDay, date === index && styles.whiteText]}>{item.day}</Text><Text style={[styles.dateNumber, date === index && styles.whiteText]}>{item.date}</Text><Text style={[styles.dateMonth, date === index && styles.whiteText]}>{item.month}</Text></Pressable>)}</View>

      <Text style={styles.sectionTitle}>5. Available time</Text>
      <View style={styles.slotGrid}>{slots.map(item => <Pressable key={item} onPress={() => setSlot(item)} style={[styles.slot, slot === item && styles.slotSelected]}><Text style={[styles.slotText, slot === item && styles.chipTextSelected]}>{item}</Text></Pressable>)}</View>

      <View style={styles.summaryStrip}><Text style={styles.summaryStripLabel}>SELECTED SLOT</Text><Text style={styles.summaryStripValue}>{dates[date].day}, {dates[date].date} {dates[date].month} · {slot}</Text></View>
      <Pressable style={styles.primary} onPress={() => setShowReview(true)}><Text style={styles.primaryText}>Review appointment  →</Text></Pressable>
      <Text style={styles.note}>Sample clinics, dentists and time slots. Availability is not live and no real booking is made.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 21, paddingTop: 8, paddingBottom: 32 },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.5, marginTop: 9, marginBottom: 8 },
  title: { color: colors.text, fontSize: 26, fontWeight: "900", letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 7, marginBottom: 18 },
  stepRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 12, marginBottom: 22 },
  stepItem: { alignItems: "center", gap: 5 },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  stepDotActive: { backgroundColor: colors.purple },
  stepNumber: { color: colors.muted, fontSize: 9, fontWeight: "900" },
  stepNumberActive: { color: "#fff" },
  stepLabel: { color: colors.muted, fontSize: 8, fontWeight: "700" },
  sectionTitle: { color: colors.text, fontSize: 13, fontWeight: "900", marginTop: 8, marginBottom: 10 },
  clinicCard: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 12, marginBottom: 9 },
  selectedCard: { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
  clinicIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center" },
  clinicInitial: { color: colors.purpleDark, fontSize: 11, fontWeight: "900" },
  flex: { flex: 1 },
  itemTitle: { color: colors.text, fontSize: 11, fontWeight: "900" },
  muted: { color: colors.muted, fontSize: 9, marginTop: 4 },
  clinicMeta: { color: colors.pink, fontSize: 8, fontWeight: "800", marginTop: 5 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: colors.purple },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.purple },
  doctorCard: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 11, marginBottom: 8 },
  avatar: { width: 37, height: 37, borderRadius: 13, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.purpleDark, fontSize: 10, fontWeight: "900" },
  check: { color: colors.pink, fontSize: 18, fontWeight: "900" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 5 },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 11 },
  chipSelected: { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
  chipText: { color: colors.muted, fontSize: 9, fontWeight: "700" },
  chipTextSelected: { color: colors.purpleDark, fontWeight: "900" },
  dateRow: { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  dateCard: { flex: 1, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 13, alignItems: "center", paddingVertical: 10 },
  dateSelected: { backgroundColor: colors.purple, borderColor: colors.purple },
  dateDay: { color: colors.muted, fontSize: 7, fontWeight: "900" },
  dateNumber: { color: colors.text, fontSize: 17, fontWeight: "900", marginVertical: 5 },
  dateMonth: { color: colors.muted, fontSize: 7, fontWeight: "900" },
  whiteText: { color: "#fff" },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { width: "31.5%", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 11, paddingVertical: 12, alignItems: "center" },
  slotSelected: { borderColor: colors.pink, backgroundColor: colors.pinkSoft },
  slotText: { color: colors.muted, fontSize: 9, fontWeight: "800" },
  summaryStrip: { backgroundColor: colors.purpleSoft, borderRadius: 13, padding: 13, marginTop: 18 },
  summaryStripLabel: { color: colors.muted, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  summaryStripValue: { color: colors.purpleDark, fontSize: 11, fontWeight: "900", marginTop: 5 },
  primary: { backgroundColor: colors.pink, borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 15 },
  primaryText: { color: "#fff", fontSize: 11, fontWeight: "900" },
  note: { color: colors.muted, fontSize: 9, lineHeight: 14, textAlign: "center", marginTop: 12, marginBottom: 20 },
  back: { paddingVertical: 10, alignSelf: "flex-start" },
  backText: { color: colors.purple, fontSize: 11, fontWeight: "900" },
  successMark: { width: 54, height: 54, borderRadius: 20, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center", marginTop: 25, marginBottom: 18 },
  successMarkText: { color: colors.purple, fontSize: 24, fontWeight: "900" },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, padding: 17, marginTop: 10, marginBottom: 15 },
  cardLabel: { color: colors.muted, fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  summaryTitle: { color: colors.text, fontSize: 15, fontWeight: "900", marginTop: 10 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 13 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 8 },
  summaryLabel: { color: colors.muted, fontSize: 9 },
  summaryValue: { color: colors.text, fontSize: 9, fontWeight: "800", flex: 1, textAlign: "right" }
});
