import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors, radius } from "./theme";

type ModuleKey = "overview" | "treatments" | "prescriptions" | "dental" | "billing" | "documents" | "notifications" | "guide";

const modules: { key: ModuleKey; title: string; subtitle: string; icon: string }[] = [
  { key: "overview", title: "Care overview", subtitle: "Your dental care at a glance", icon: "✦" },
  { key: "treatments", title: "Treatment plans", subtitle: "Procedures and progress", icon: "＋" },
  { key: "prescriptions", title: "Prescriptions", subtitle: "Medication instructions", icon: "Rx" },
  { key: "dental", title: "Dental chart", subtitle: "Interactive tooth map", icon: "▦" },
  { key: "billing", title: "Bills & payments", subtitle: "Invoices and payment history", icon: "₨" },
  { key: "documents", title: "Documents", subtitle: "Reports and dental files", icon: "▤" },
  { key: "notifications", title: "Notifications", subtitle: "Reminders and clinic updates", icon: "♧" },
  { key: "guide", title: "Dental assistant", subtitle: "General care guidance", icon: "✧" }
];

const teeth = [
  18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,
  48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38
];

export default function CareHubScreen() {
  const [active, setActive] = useState<ModuleKey>("overview");
  const [selectedTooth, setSelectedTooth] = useState(16);
  const [paid, setPaid] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const [openGuide, setOpenGuide] = useState<number | null>(0);

  const go = (key: ModuleKey) => setActive(key);
  const header = (eyebrow: string, title: string, subtitle: string) => (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
  const card = (children: React.ReactNode, extra?: ViewStyle) => <View style={[styles.card, extra]}>{children}</View>;
  const pill = (label: string, tone: "purple" | "green" | "orange" = "purple") => (
    <View style={[styles.pill, tone === "green" ? styles.pillGreen : tone === "orange" ? styles.pillOrange : styles.pillPurple]}>
      <Text style={[styles.pillText, tone === "green" ? styles.pillTextGreen : tone === "orange" ? styles.pillTextOrange : styles.pillTextPurple]}>{label}</Text>
    </View>
  );

  const renderOverview = () => (
    <>
      {header("YOUR DENTAL HEALTH", "Care hub", "Everything about your dental care, organised in one place.")}
      {card(
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.cardEyebrow}>CARE JOURNEY</Text>
            {pill("Demo profile")}
          </View>
          <Text style={styles.heroTitle}>Your smile, one step at a time.</Text>
          <Text style={styles.body}>Keep track of treatment progress, prescriptions, dental records and clinic updates.</Text>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          <Text style={styles.mutedSmall}>Sample progress · 2 of 4 care steps</Text>
        </>,
        { backgroundColor: colors.purpleDark, borderColor: colors.purpleDark }
      )}
      <Text style={styles.sectionTitle}>Your care tools</Text>
      <View style={styles.moduleGrid}>
        {modules.filter(item => item.key !== "overview").map(item => (
          <Pressable key={item.key} style={styles.moduleCard} onPress={() => go(item.key)}>
            <View style={styles.moduleIcon}><Text style={styles.moduleIconText}>{item.icon}</Text></View>
            <Text style={styles.moduleTitle}>{item.title}</Text>
            <Text style={styles.moduleSubtitle}>{item.subtitle}</Text>
            <Text style={styles.moduleArrow}>Open  ›</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.privacyBox}><Text style={styles.privacyTitle}>Private by design</Text><Text style={styles.privacyText}>This preview uses sample information only. Real clinic records will appear after secure sign-in and verified clinic linking.</Text></View>
    </>
  );

  const renderTreatments = () => (
    <>
      {header("YOUR CARE PLAN", "Treatment plans", "Follow the procedures recommended by your dental team.")}
      {card(
        <>
          <View style={styles.rowBetween}><Text style={styles.cardEyebrow}>ACTIVE PLAN · SAMPLE</Text>{pill("In progress", "green")}</View>
          <Text style={styles.itemTitle}>Comprehensive dental care</Text>
          <Text style={styles.body}>Taj Dental · Created 03 Nov 2026</Text>
          <View style={styles.separator} />
          {[
            ["Dental examination", "Completed", "green"],
            ["Professional cleaning", "Completed", "green"],
            ["Follow-up consultation", "Upcoming", "orange"],
            ["Routine review", "Planned", "purple"]
          ].map((item, index) => (
            <View key={item[0]} style={styles.timelineRow}>
              <View style={[styles.timelineDot, index < 2 && styles.timelineDotDone]} />
              <View style={styles.timelineCopy}><Text style={styles.itemTitleSmall}>{item[0]}</Text><Text style={styles.mutedSmall}>Step {index + 1} of 4</Text></View>
              {pill(item[1], item[2] as "green" | "orange" | "purple")}
            </View>
          ))}
        </>
      )}
      <Text style={styles.helper}>Treatment details are examples, not medical advice. Your dentist's signed plan is the source of truth.</Text>
    </>
  );

  const renderPrescriptions = () => (
    <>
      {header("MEDICATION RECORDS", "Prescriptions", "Review medication instructions provided by your clinic.")}
      {card(
        <>
          <View style={styles.rowBetween}><Text style={styles.cardEyebrow}>PRESCRIPTION · SAMPLE</Text>{pill("Completed", "green")}</View>
          <Text style={styles.itemTitle}>Post-visit prescription</Text>
          <Text style={styles.body}>Issued by Dr. Emily Carter · 03 Nov 2026</Text>
          <View style={styles.separator} />
          <Text style={styles.itemTitleSmall}>Example medicine entry</Text>
          <Text style={styles.body}>Medicine name · As directed by your dentist</Text>
          <View style={styles.medicationMeta}><Text style={styles.mutedSmall}>Dose: See signed prescription</Text><Text style={styles.mutedSmall}>Duration: As prescribed</Text></View>
          <View style={styles.privacyBox}><Text style={styles.privacyText}>Always follow the exact instructions on your clinic-issued prescription. Do not use this sample as a medication guide.</Text></View>
          <Pressable style={styles.outlineButton} onPress={() => Alert.alert("Prescription preview", "A downloadable, verified prescription will be available after secure clinic integration.")}><Text style={styles.outlineButtonText}>View prescription details</Text></Pressable>
        </>
      )}
    </>
  );

  const renderDental = () => (
    <>
      {header("TOOTH HISTORY", "Dental chart", "Select a tooth to view its sample chart status.")}
      {card(
        <>
          <View style={styles.rowBetween}><Text style={styles.cardEyebrow}>FDI TOOTH NUMBERING</Text>{pill("Interactive demo")}</View>
          <Text style={styles.itemTitle}>Permanent teeth</Text>
          <Text style={styles.body}>Upper jaw</Text>
          <View style={styles.teethGrid}>{teeth.slice(0,16).map(tooth => <Pressable key={tooth} onPress={() => setSelectedTooth(tooth)} style={[styles.tooth, selectedTooth === tooth && styles.toothSelected]}><Text style={[styles.toothText, selectedTooth === tooth && styles.toothTextSelected]}>{tooth}</Text></Pressable>)}</View>
          <View style={styles.jawDivider} />
          <Text style={styles.body}>Lower jaw</Text>
          <View style={styles.teethGrid}>{teeth.slice(16).map(tooth => <Pressable key={tooth} onPress={() => setSelectedTooth(tooth)} style={[styles.tooth, selectedTooth === tooth && styles.toothSelected]}><Text style={[styles.toothText, selectedTooth === tooth && styles.toothTextSelected]}>{tooth}</Text></Pressable>)}</View>
          <View style={styles.selectedToothBox}><Text style={styles.cardEyebrow}>SELECTED TOOTH</Text><Text style={styles.selectedToothTitle}>Tooth {selectedTooth}</Text><Text style={styles.body}>No clinical finding is recorded in this demo chart.</Text></View>
        </>
      )}
      <Text style={styles.helper}>This chart is for navigation and record display only. It does not detect cavities or diagnose dental conditions.</Text>
    </>
  );

  const renderBilling = () => (
    <>
      {header("ACCOUNT SUMMARY", "Bills & payments", "View clinic invoices and payment status.")}
      {card(
        <>
          <Text style={styles.cardEyebrow}>SAMPLE INVOICE · DC-2026-001</Text>
          <Text style={styles.itemTitle}>Dental consultation</Text>
          <Text style={styles.body}>Taj Dental · 03 Nov 2026</Text>
          <View style={styles.separator} />
          <View style={styles.rowBetween}><Text style={styles.body}>Consultation fee</Text><Text style={styles.money}>Rs. 2,000</Text></View>
          <View style={styles.rowBetween}><Text style={styles.body}>Dental examination</Text><Text style={styles.money}>Rs. 1,500</Text></View>
          <View style={styles.separator} />
          <View style={styles.rowBetween}><Text style={styles.itemTitle}>Total</Text><Text style={styles.total}>Rs. 3,500</Text></View>
          <View style={styles.rowBetween}>{pill(paid ? "Paid · Demo" : "Payment due · Demo", paid ? "green" : "orange")}<Text style={styles.mutedSmall}>No real charge</Text></View>
          <Pressable style={styles.primaryButton} onPress={() => setPaid(!paid)}><Text style={styles.primaryButtonText}>{paid ? "Reset demo payment status" : "Mark as paid (demo only)"}</Text></Pressable>
        </>
      )}
      <Text style={styles.helper}>No payment gateway is connected. This screen cannot charge a card or transfer money.</Text>
    </>
  );

  const renderDocuments = () => (
    <>
      {header("YOUR FILES", "Documents", "Keep clinic reports and dental files together.")}
      {["Dental examination summary", "Treatment plan overview", "Dental X-ray image"].map((name, index) => (
        <Pressable key={name} onPress={() => Alert.alert("Sample document", "Secure document preview and downloads will be enabled after clinic storage is connected.")} style={styles.documentRow}>
          <View style={styles.documentIcon}><Text style={styles.moduleIconText}>{index === 2 ? "▧" : "▤"}</Text></View>
          <View style={styles.timelineCopy}><Text style={styles.itemTitleSmall}>{name}</Text><Text style={styles.mutedSmall}>Sample file · {index === 2 ? "Image" : "PDF"}</Text></View>
          <Text style={styles.moduleArrow}>View ›</Text>
        </Pressable>
      ))}
      <View style={styles.privacyBox}><Text style={styles.privacyTitle}>Secure file access</Text><Text style={styles.privacyText}>Real medical documents will use private storage and verified access permissions.</Text></View>
    </>
  );

  const renderNotifications = () => (
    <>
      {header("STAY INFORMED", "Notifications", "Appointment reminders and messages from your clinic.")}
      {[
        ["Appointment reminder", "Your sample appointment is scheduled for Tuesday at 10:30 AM.", "Today"],
        ["Care plan updated", "A new step was added to your sample dental care plan.", "Yesterday"],
        ["Clinic message", "Your clinic has shared a sample follow-up note.", "03 Nov 2026"]
      ].map((item, index) => {
        const read = readNotifications.includes(index);
        return <Pressable key={item[0]} onPress={() => setReadNotifications(old => read ? old.filter(value => value !== index) : [...old, index])} style={[styles.notificationRow, read && styles.notificationRead]}>
          <View style={styles.notificationBullet} />
          <View style={styles.timelineCopy}><View style={styles.rowBetween}><Text style={styles.itemTitleSmall}>{item[0]}</Text><Text style={styles.mutedSmall}>{item[2]}</Text></View><Text style={styles.body}>{item[1]}</Text><Text style={styles.moduleArrow}>{read ? "Mark unread" : "Mark as read"}</Text></View>
        </Pressable>;
      })}
    </>
  );

  const renderGuide = () => (
    <>
      {header("TAJ DENTAL SUPPORT", "Dental care assistant", "Explore general oral-care information and learn when to contact your dental team.")}
      {card(
        <>
          <Text style={styles.cardEyebrow}>EDUCATIONAL PREVIEW</Text>
          <Text style={styles.itemTitle}>How can we help?</Text>
          <Text style={styles.body}>Choose a common question below. This preview provides general information only and does not assess symptoms or diagnose conditions.</Text>
        </>
      )}
      {[
        ["How often should I brush?", "Most people benefit from brushing twice a day for about two minutes with fluoride toothpaste. Use a soft-bristled brush and ask your dentist what is suitable for you."],
        ["Why is flossing important?", "Cleaning between teeth helps remove plaque where a toothbrush may not reach. Ask your dental professional to show you a technique that suits your teeth and gums."],
        ["What should I do if a tooth hurts?", "Arrange an assessment with a dentist. If you have facial swelling, fever, difficulty swallowing or breathing, seek urgent medical or dental care."],
        ["When should I book a check-up?", "Your dentist can recommend an interval based on your oral health, history and risk factors. Contact Taj Dental to arrange a review."]
      ].map((item,index)=>(
        <Pressable key={item[0]} style={styles.notificationRow} onPress={()=>setOpenGuide(openGuide===index?null:index)}>
          <View style={styles.timelineCopy}>
            <View style={styles.rowBetween}><Text style={styles.itemTitleSmall}>{item[0]}</Text><Text style={styles.moduleArrow}>{openGuide===index?"−":"+"}</Text></View>
            {openGuide===index?<Text style={styles.body}>{item[1]}</Text>:null}
          </View>
        </Pressable>
      ))}
      <View style={styles.privacyBox}>
        <Text style={styles.privacyTitle}>Need personal advice?</Text>
        <Text style={styles.privacyText}>Contact your dental professional. This guide is not an emergency service and cannot diagnose or recommend medication.</Text>
      </View>
    </>
  );

  const body = active === "overview" ? renderOverview()
    : active === "treatments" ? renderTreatments()
    : active === "prescriptions" ? renderPrescriptions()
    : active === "dental" ? renderDental()
    : active === "billing" ? renderBilling()
    : active === "documents" ? renderDocuments()
    : active === "guide" ? renderGuide()
    : renderNotifications();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <Pressable onPress={() => go("overview")} style={styles.brandRow}><View style={styles.brandMark}><Text style={styles.brandMarkText}>🦷</Text></View><View><Text style={styles.brandName}>TAJ DENTAL</Text><Text style={styles.brandCaption}>PATIENT CARE HUB</Text></View></Pressable>
        {active !== "overview" ? <Pressable style={styles.backButton} onPress={() => go("overview")}><Text style={styles.backText}>← All tools</Text></Pressable> : null}
      </View>
      {body}
      <Text style={styles.footer}>TAJ DENTAL · A Product by Nexora Solutions</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#fff", fontSize: 20, fontWeight: "900" },
  brandName: { color: colors.purpleDeep, fontSize: 17, fontWeight: "900" },
  brandCaption: { color: colors.muted, fontSize: 8, fontWeight: "800", letterSpacing: 1.2, marginTop: 2 },
  backButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, backgroundColor: colors.purpleSoft },
  backText: { color: colors.purpleDark, fontSize: 10, fontWeight: "800" },
  header: { marginBottom: 20 },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.5, marginBottom: 8 },
  title: { color: colors.text, fontSize: 27, fontWeight: "900", letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, padding: 17, marginBottom: 20 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  cardEyebrow: { color: colors.muted, fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "900", marginTop: 16 },
  body: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 6 },
  mutedSmall: { color: colors.muted, fontSize: 9, marginTop: 4 },
  progressTrack: { height: 6, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.2)", marginTop: 18 },
  progressFill: { width: "50%", height: 6, borderRadius: 5, backgroundColor: "#F9A8D4" },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: "900", marginBottom: 12 },
  moduleGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  moduleCard: { width: "48.5%", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 13, marginBottom: 10 },
  moduleIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  moduleIconText: { color: colors.purpleDark, fontSize: 15, fontWeight: "900" },
  moduleTitle: { color: colors.text, fontSize: 11, fontWeight: "900" },
  moduleSubtitle: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 4 },
  moduleArrow: { color: colors.pink, fontSize: 9, fontWeight: "900", marginTop: 9 },
  privacyBox: { backgroundColor: colors.purpleSoft, borderRadius: 14, padding: 13, marginTop: 4, marginBottom: 15 },
  privacyTitle: { color: colors.purpleDark, fontSize: 10, fontWeight: "900", marginBottom: 4 },
  privacyText: { color: colors.purpleDark, fontSize: 9, lineHeight: 14 },
  pill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20 },
  pillPurple: { backgroundColor: colors.purpleSoft },
  pillGreen: { backgroundColor: colors.successSoft },
  pillOrange: { backgroundColor: "#FFF2E2" },
  pillText: { fontSize: 8, fontWeight: "900" },
  pillTextPurple: { color: colors.purpleDark },
  pillTextGreen: { color: colors.success },
  pillTextOrange: { color: colors.warning },
  itemTitle: { color: colors.text, fontSize: 15, fontWeight: "900", marginTop: 13 },
  itemTitleSmall: { color: colors.text, fontSize: 10, fontWeight: "900" },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 15 },
  timelineRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  timelineDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.pinkSoft, borderWidth: 2, borderColor: colors.pink },
  timelineDotDone: { backgroundColor: colors.success, borderColor: colors.success },
  timelineCopy: { flex: 1 },
  helper: { color: colors.muted, fontSize: 9, lineHeight: 14, marginBottom: 18 },
  medicationMeta: { backgroundColor: colors.background, borderRadius: 12, padding: 12, marginTop: 12 },
  outlineButton: { borderWidth: 1, borderColor: colors.purple, borderRadius: 12, padding: 13, alignItems: "center", marginTop: 15 },
  outlineButtonText: { color: colors.purple, fontSize: 10, fontWeight: "900" },
  teethGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 5, marginTop: 12 },
  tooth: { width: "10.5%", minWidth: 28, height: 37, borderRadius: 9, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  toothSelected: { backgroundColor: colors.purple, borderColor: colors.purple },
  toothText: { color: colors.text, fontSize: 9, fontWeight: "800" },
  toothTextSelected: { color: "#fff" },
  jawDivider: { height: 1, backgroundColor: colors.border, marginTop: 18 },
  selectedToothBox: { backgroundColor: colors.pinkSoft, borderRadius: 14, padding: 13, marginTop: 17 },
  selectedToothTitle: { color: colors.purpleDark, fontSize: 18, fontWeight: "900", marginTop: 8 },
  money: { color: colors.text, fontSize: 11, fontWeight: "800" },
  total: { color: colors.purpleDark, fontSize: 16, fontWeight: "900" },
  primaryButton: { backgroundColor: colors.pink, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 17 },
  primaryButtonText: { color: "#fff", fontSize: 10, fontWeight: "900" },
  documentRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, marginBottom: 10 },
  documentIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  notificationRow: { flexDirection: "row", gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 14, marginBottom: 10 },
  notificationRead: { opacity: 0.62 },
  notificationBullet: { width: 8, height: 8, borderRadius: 5, backgroundColor: colors.pink, marginTop: 4 },
  footer: { color: colors.muted, fontSize: 9, textAlign: "center", marginTop: 12 }
});
