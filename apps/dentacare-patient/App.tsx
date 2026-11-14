import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { colors, radius } from "./src/theme";
import AuthScreen from "./src/AuthScreen";

type TabKey = "home" | "appointments" | "records" | "profile";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "home", label: "Home", icon: "⌂" },
  { key: "appointments", label: "Appointments", icon: "▦" },
  { key: "records", label: "Records", icon: "▤" },
  { key: "profile", label: "Profile", icon: "○" }
];

function BrandMark() {
  return (
    <View style={styles.brandMark}>
      <Text style={styles.brandMarkText}>✦</Text>
    </View>
  );
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.linkText}>{action}</Text> : null}
    </View>
  );
}

function HomeScreen({ onBook, onRecords }: { onBook: () => void; onRecords: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <BrandMark />
          <View>
            <Text style={styles.brandName}>DentaCare</Text>
            <Text style={styles.brandCaption}>SMART DENTAL CLINIC</Text>
          </View>
        </View>
        <Pressable style={styles.notificationButton} onPress={() => Alert.alert("Notifications", "Your notifications will appear here.")}>
          <Text style={styles.notificationIcon}>♧</Text>
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={styles.eyebrow}>PATIENT PORTAL</Text>
        <Text style={styles.greeting}>Good morning, Olivia</Text>
        <Text style={styles.subGreeting}>A healthy smile starts with good care.</Text>
      </View>

      <View style={styles.appointmentCard}>
        <View style={styles.appointmentCardTop}>
          <View style={styles.appointmentLabel}>
            <Text style={styles.appointmentLabelText}>UPCOMING APPOINTMENT</Text>
          </View>
          <Text style={styles.cardSparkle}>✦</Text>
        </View>
        <Text style={styles.appointmentDate}>Tuesday, November 17</Text>
        <View style={styles.appointmentInfoRow}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorAvatarText}>EC</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. Emily Carter</Text>
            <Text style={styles.doctorSpecialty}>General Dentist · Smile Dental Studio</Text>
          </View>
        </View>
        <View style={styles.appointmentBottom}>
          <Text style={styles.appointmentTime}>◷  10:30 AM</Text>
          <Pressable style={styles.whiteButton} onPress={onBook}>
            <Text style={styles.whiteButtonText}>View details</Text>
          </Pressable>
        </View>
      </View>

      <SectionTitle title="Quick actions" />
      <View style={styles.actionGrid}>
        <Pressable style={styles.actionCard} onPress={onBook}>
          <View style={[styles.actionIcon, { backgroundColor: colors.purpleSoft }]}>
            <Text style={styles.actionEmoji}>＋</Text>
          </View>
          <Text style={styles.actionTitle}>Book visit</Text>
          <Text style={styles.actionSubtitle}>Choose a time</Text>
        </Pressable>
        <Pressable style={styles.actionCard} onPress={onRecords}>
          <View style={[styles.actionIcon, { backgroundColor: colors.pinkSoft }]}>
            <Text style={styles.actionEmoji}>▤</Text>
          </View>
          <Text style={styles.actionTitle}>My records</Text>
          <Text style={styles.actionSubtitle}>Treatments & files</Text>
        </Pressable>
        <Pressable style={styles.actionCard} onPress={onRecords}>
          <View style={[styles.actionIcon, { backgroundColor: "#E8F5F0" }]}>
            <Text style={styles.actionEmoji}>Rx</Text>
          </View>
          <Text style={styles.actionTitle}>Prescriptions</Text>
          <Text style={styles.actionSubtitle}>Your medication</Text>
        </Pressable>
        <Pressable style={styles.actionCard} onPress={() => Alert.alert("Find a clinic", "Clinic discovery will be connected in a later build.")}>
          <View style={[styles.actionIcon, { backgroundColor: "#FFF2E7" }]}>
            <Text style={styles.actionEmoji}>⌖</Text>
          </View>
          <Text style={styles.actionTitle}>Find clinic</Text>
          <Text style={styles.actionSubtitle}>Care near you</Text>
        </Pressable>
      </View>

      <SectionTitle title="Your dental care" action="View all" />
      <View style={styles.careCard}>
        <View style={styles.careIcon}>
          <Text style={styles.careIconText}>♡</Text>
        </View>
        <View style={styles.careCopy}>
          <Text style={styles.careTitle}>Keep your smile on track</Text>
          <Text style={styles.careDescription}>Your next routine check-up is a great way to stay ahead of dental concerns.</Text>
        </View>
        <Text style={styles.careArrow}>›</Text>
      </View>

      <View style={styles.demoNotice}>
        <Text style={styles.demoNoticeText}>Preview mode · Sample patient information only</Text>
      </View>
    </ScrollView>
  );
}

function AppointmentsScreen() {
  const [doctor, setDoctor] = useState("Dr. Emily Carter");
  const [day, setDay] = useState("Tue, 17");
  const [time, setTime] = useState("10:30 AM");
  const days = ["Mon, 16", "Tue, 17", "Wed, 18", "Thu, 19"];
  const times = ["9:00 AM", "10:30 AM", "12:00 PM", "2:30 PM"];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>YOUR VISITS</Text>
      <Text style={styles.screenTitle}>Appointments</Text>
      <Text style={styles.screenSubtitle}>Book a visit or keep track of your dental care.</Text>

      <View style={styles.nextVisitCard}>
        <Text style={styles.smallWhiteLabel}>NEXT APPOINTMENT</Text>
        <Text style={styles.nextVisitDate}>Tuesday, November 17</Text>
        <Text style={styles.nextVisitMeta}>10:30 AM  ·  Dr. Emily Carter</Text>
        <View style={styles.confirmedPill}><Text style={styles.confirmedText}>●  Confirmed · Sample</Text></View>
      </View>

      <SectionTitle title="Book a new appointment" />
      <Text style={styles.formLabel}>Choose your dentist</Text>
      <View style={styles.doctorChoice}>
        <View style={styles.doctorAvatar}><Text style={styles.doctorAvatarText}>EC</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.doctorName}>Dr. Emily Carter</Text>
          <Text style={styles.doctorSpecialty}>General Dentist</Text>
        </View>
        <Text style={styles.selectedCheck}>✓</Text>
      </View>
      <Text style={styles.formLabel}>Select a date</Text>
      <View style={styles.choiceRow}>
        {days.map((item) => (
          <Pressable key={item} onPress={() => setDay(item)} style={[styles.choiceChip, day === item && styles.choiceChipSelected]}>
            <Text style={[styles.choiceText, day === item && styles.choiceTextSelected]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.formLabel}>Available time</Text>
      <View style={styles.timeGrid}>
        {times.map((item) => (
          <Pressable key={item} onPress={() => setTime(item)} style={[styles.timeChip, time === item && styles.timeChipSelected]}>
            <Text style={[styles.choiceText, time === item && styles.choiceTextSelected]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={styles.primaryButton}
        onPress={() => Alert.alert("Booking preview", "Your selection is ready for review. Live clinic availability and booking will be connected after backend integration. No appointment has been submitted.")}
      >
        <Text style={styles.primaryButtonText}>Continue to review  →</Text>
      </Pressable>
      <Text style={styles.helperText}>This is a visual prototype. No real appointment is created.</Text>
    </ScrollView>
  );
}

function RecordsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>YOUR HEALTH INFORMATION</Text>
      <Text style={styles.screenTitle}>My records</Text>
      <Text style={styles.screenSubtitle}>Your dental history, treatment plans and prescriptions in one place.</Text>

      <View style={styles.recordsSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>02</Text>
          <Text style={styles.summaryLabel}>Visits</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>01</Text>
          <Text style={styles.summaryLabel}>Treatment plans</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>01</Text>
          <Text style={styles.summaryLabel}>Prescriptions</Text>
        </View>
      </View>

      <SectionTitle title="Recent activity" />
      <View style={styles.recordCard}>
        <View style={[styles.recordIcon, { backgroundColor: colors.purpleSoft }]}><Text style={styles.recordIconText}>✦</Text></View>
        <View style={styles.recordCopy}>
          <Text style={styles.recordTitle}>Routine dental check-up</Text>
          <Text style={styles.recordMeta}>Smile Dental Studio · Nov 03, 2026</Text>
          <Text style={styles.recordStatus}>Completed · Sample record</Text>
        </View>
        <Text style={styles.careArrow}>›</Text>
      </View>
      <View style={styles.recordCard}>
        <View style={[styles.recordIcon, { backgroundColor: colors.pinkSoft }]}><Text style={styles.recordIconText}>Rx</Text></View>
        <View style={styles.recordCopy}>
          <Text style={styles.recordTitle}>Prescription</Text>
          <Text style={styles.recordMeta}>Dr. Emily Carter · Nov 03, 2026</Text>
          <Text style={styles.recordStatus}>Available · Sample record</Text>
        </View>
        <Text style={styles.careArrow}>›</Text>
      </View>
      <View style={styles.secureNote}>
        <Text style={styles.secureNoteIcon}>♢</Text>
        <Text style={styles.secureNoteText}>Your real medical records will only appear after secure account verification and clinic connection.</Text>
      </View>
    </ScrollView>
  );
}

function ProfileScreen() {
  const rows = [
    ["Personal information", "Name, date of birth and contact"],
    ["Family members", "Manage dependent profiles"],
    ["Notifications", "Appointment and care reminders"],
    ["Privacy & security", "Account access and preferences"],
    ["Help & support", "Contact your clinic"]
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>ACCOUNT</Text>
      <Text style={styles.screenTitle}>My profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>OR</Text></View>
        <Text style={styles.profileName}>Olivia Reynolds</Text>
        <Text style={styles.profileEmail}>olivia@example.com</Text>
        <View style={styles.profileTag}><Text style={styles.profileTagText}>PATIENT ACCOUNT · DEMO</Text></View>
      </View>
      <SectionTitle title="Account settings" />
      <View style={styles.settingsCard}>
        {rows.map((row, index) => (
          <Pressable key={row[0]} style={[styles.settingRow, index === rows.length - 1 && styles.settingRowLast]} onPress={() => Alert.alert(row[0], "This setting will be available when account services are connected.")}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>{row[0]}</Text>
              <Text style={styles.settingDescription}>{row[1]}</Text>
            </View>
            <Text style={styles.careArrow}>›</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.demoNoticeText}>DentaCare · A Product by Nexora Solutions</Text>
    </ScrollView>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return (
      <View style={styles.app}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <AuthScreen onExploreDemo={() => setShowApp(true)} />
      </View>
    );
  }

  const content = () => {
    switch (activeTab) {
      case "appointments":
        return <AppointmentsScreen />;
      case "records":
        return <RecordsScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen onBook={() => setActiveTab("appointments")} onRecords={() => setActiveTab("records")} />;
    }
  };

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.screen}>{content()}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={styles.tabButton}>
              <View style={[styles.tabIconWrap, active && styles.tabIconWrapActive]}>
                <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{tab.icon}</Text>
              </View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, paddingTop: 44 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 28 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  brandMark: { width: 43, height: 43, borderRadius: 15, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#FFFFFF", fontSize: 23, fontWeight: "800" },
  brandName: { color: colors.purpleDeep, fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  brandCaption: { color: colors.muted, fontSize: 8, fontWeight: "800", letterSpacing: 1.4, marginTop: 2 },
  notificationButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  notificationIcon: { fontSize: 21, color: colors.purpleDark },
  notificationDot: { position: "absolute", top: 9, right: 10, width: 7, height: 7, borderRadius: 5, backgroundColor: colors.pink },
  greetingBlock: { marginBottom: 20 },
  eyebrow: { color: colors.pink, fontSize: 10, fontWeight: "800", letterSpacing: 1.7, marginBottom: 8 },
  greeting: { color: colors.text, fontSize: 26, fontWeight: "800", letterSpacing: -0.8 },
  subGreeting: { color: colors.muted, fontSize: 13, marginTop: 7 },
  appointmentCard: { backgroundColor: colors.purpleDark, borderRadius: radius.card, padding: 20, marginBottom: 27, overflow: "hidden" },
  appointmentCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  appointmentLabel: { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  appointmentLabelText: { color: "#FCE7F3", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  cardSparkle: { color: "#F9A8D4", fontSize: 24 },
  appointmentDate: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 18, marginBottom: 17 },
  appointmentInfoRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  doctorAvatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#FCE7F3", alignItems: "center", justifyContent: "center" },
  doctorAvatarText: { color: colors.purpleDark, fontSize: 12, fontWeight: "800" },
  doctorInfo: { flex: 1 },
  doctorName: { color: colors.text, fontSize: 13, fontWeight: "800" },
  doctorSpecialty: { color: colors.muted, fontSize: 11, marginTop: 4 },
  appointmentBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 19, paddingTop: 15, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.18)" },
  appointmentTime: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  whiteButton: { backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  whiteButtonText: { color: colors.purpleDark, fontSize: 11, fontWeight: "800" },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14, marginTop: 2 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  linkText: { color: colors.pink, fontSize: 11, fontWeight: "800" },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 26 },
  actionCard: { width: "48.2%", backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 10 },
  actionIcon: { width: 37, height: 37, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  actionEmoji: { color: colors.purpleDark, fontSize: 19, fontWeight: "800" },
  actionTitle: { color: colors.text, fontSize: 12, fontWeight: "800" },
  actionSubtitle: { color: colors.muted, fontSize: 10, marginTop: 4 },
  careCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.pinkSoft, borderRadius: 18, padding: 15, marginBottom: 16, gap: 12 },
  careIcon: { width: 39, height: 39, borderRadius: 14, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  careIconText: { color: colors.pink, fontSize: 21 },
  careCopy: { flex: 1 },
  careTitle: { color: colors.purpleDeep, fontSize: 12, fontWeight: "800" },
  careDescription: { color: "#795B73", fontSize: 10, lineHeight: 15, marginTop: 4 },
  careArrow: { color: colors.pink, fontSize: 25, fontWeight: "400" },
  demoNotice: { alignItems: "center", paddingVertical: 7 },
  demoNoticeText: { color: colors.muted, fontSize: 9, textAlign: "center" },
  screenTitle: { color: colors.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.8 },
  screenSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 7, marginBottom: 22 },
  nextVisitCard: { backgroundColor: colors.purpleDark, borderRadius: radius.card, padding: 19, marginBottom: 26 },
  smallWhiteLabel: { color: "#F9A8D4", fontSize: 9, fontWeight: "800", letterSpacing: 1.3 },
  nextVisitDate: { color: "#FFFFFF", fontSize: 19, fontWeight: "800", marginTop: 12 },
  nextVisitMeta: { color: "#E9D5FF", fontSize: 12, marginTop: 6 },
  confirmedPill: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, marginTop: 15 },
  confirmedText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  formLabel: { color: colors.text, fontSize: 12, fontWeight: "800", marginBottom: 10, marginTop: 5 },
  doctorChoice: { flexDirection: "row", alignItems: "center", gap: 11, padding: 13, borderRadius: 16, borderWidth: 1.5, borderColor: colors.purple, backgroundColor: colors.surface, marginBottom: 17 },
  selectedCheck: { color: colors.pink, fontSize: 19, fontWeight: "900" },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 17 },
  choiceChip: { borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingVertical: 10, paddingHorizontal: 11, backgroundColor: colors.surface },
  choiceChipSelected: { backgroundColor: colors.purpleSoft, borderColor: colors.purple },
  choiceText: { color: colors.muted, fontSize: 10, fontWeight: "700" },
  choiceTextSelected: { color: colors.purpleDark },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 21 },
  timeChip: { width: "48%", alignItems: "center", paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  timeChipSelected: { backgroundColor: colors.pinkSoft, borderColor: colors.pink },
  primaryButton: { backgroundColor: colors.pink, borderRadius: 15, paddingVertical: 16, alignItems: "center", marginTop: 3 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  helperText: { color: colors.muted, fontSize: 10, textAlign: "center", marginTop: 10, marginBottom: 18 },
  recordsSummary: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, paddingVertical: 18, marginBottom: 27 },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryNumber: { color: colors.purple, fontSize: 23, fontWeight: "800" },
  summaryLabel: { color: colors.muted, fontSize: 9, marginTop: 5, textAlign: "center" },
  summaryDivider: { height: 32, width: 1, backgroundColor: colors.border },
  recordCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 14, marginBottom: 10 },
  recordIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  recordIconText: { color: colors.purpleDark, fontSize: 17, fontWeight: "800" },
  recordCopy: { flex: 1 },
  recordTitle: { color: colors.text, fontSize: 12, fontWeight: "800" },
  recordMeta: { color: colors.muted, fontSize: 10, marginTop: 5 },
  recordStatus: { color: colors.success, fontSize: 9, fontWeight: "700", marginTop: 6 },
  secureNote: { flexDirection: "row", gap: 10, backgroundColor: colors.purpleSoft, padding: 14, borderRadius: 15, marginTop: 13 },
  secureNoteIcon: { color: colors.purple, fontSize: 20 },
  secureNoteText: { flex: 1, color: colors.purpleDark, fontSize: 10, lineHeight: 15 },
  profileCard: { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", padding: 22, marginTop: 5, marginBottom: 25 },
  profileAvatar: { width: 68, height: 68, borderRadius: 24, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  profileAvatarText: { color: colors.purpleDark, fontSize: 20, fontWeight: "900" },
  profileName: { color: colors.text, fontSize: 17, fontWeight: "800" },
  profileEmail: { color: colors.muted, fontSize: 11, marginTop: 5 },
  profileTag: { backgroundColor: colors.purpleSoft, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, marginTop: 12 },
  profileTagText: { color: colors.purpleDark, fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  settingsCard: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 15, marginBottom: 20 },
  settingRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingRowLast: { borderBottomWidth: 0 },
  settingCopy: { flex: 1 },
  settingTitle: { color: colors.text, fontSize: 12, fontWeight: "800" },
  settingDescription: { color: colors.muted, fontSize: 10, marginTop: 4 },
  tabBar: { flexDirection: "row", backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 9, paddingBottom: 17, paddingHorizontal: 9 },
  tabButton: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  tabIconWrap: { minWidth: 45, height: 29, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tabIconWrapActive: { backgroundColor: colors.purpleSoft },
  tabIcon: { color: colors.muted, fontSize: 19, fontWeight: "700" },
  tabIconActive: { color: colors.purple },
  tabLabel: { color: colors.muted, fontSize: 9, fontWeight: "600" },
  tabLabelActive: { color: colors.purple, fontWeight: "800" }
});