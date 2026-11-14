import React, { useEffect, useState } from "react";
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
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./src/supabase";
import AuthScreen from "./src/AuthScreen";
import OnboardingScreen from "./src/OnboardingScreen";
import CareHubScreen from "./src/CareHubScreen";
import AppointmentBookingScreen from "./src/AppointmentBookingScreen";
import ClinicDashboardScreen from "./src/ClinicDashboardScreen";

type TabKey = "home" | "appointments" | "records" | "care" | "profile";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "home", label: "Home", icon: "⌂" },
  { key: "appointments", label: "Appointments", icon: "▦" },
  { key: "records", label: "Records", icon: "▤" },
  { key: "care", label: "Care", icon: "✦" },
  { key: "profile", label: "Profile", icon: "○" }
];

function BrandMark() {
  return (
    <View style={styles.brandMark}>
      <Text style={styles.brandMarkText}>🦷</Text>
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
            <Text style={styles.brandName}>TAJ DENTAL</Text>
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
            <Text style={styles.doctorSpecialty}>General Dentist · Taj Dental</Text>
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

      <SectionTitle title="Your smile routine" action="Care hub" />
      <View style={styles.routineCard}>
        <View style={styles.routineHeader}>
          <View>
            <Text style={styles.routineTitle}>Daily dental habits</Text>
            <Text style={styles.routineSub}>A simple routine makes a difference</Text>
          </View>
          <View style={styles.routineBadge}><Text style={styles.routineBadgeText}>TODAY</Text></View>
        </View>
        <View style={styles.routineRow}>
          <View style={styles.routineCheck}><Text style={styles.routineCheckText}>✓</Text></View>
          <Text style={styles.routineItem}>Brush twice a day</Text>
          <Text style={styles.routineDone}>2 / 2</Text>
        </View>
        <View style={styles.routineRow}>
          <View style={styles.routineCheck}><Text style={styles.routineCheckText}>✓</Text></View>
          <Text style={styles.routineItem}>Floss once a day</Text>
          <Text style={styles.routineDone}>1 / 1</Text>
        </View>
        <View style={styles.routineRow}>
          <View style={styles.routinePending}><Text style={styles.routinePendingText}>○</Text></View>
          <Text style={styles.routineItem}>Rinse after meals</Text>
          <Text style={styles.routinePendingLabel}>Optional</Text>
        </View>
        <Text style={styles.routineDisclaimer}>Sample habit tracker · Not medical advice</Text>
      </View>

      <SectionTitle title="Your clinic" />
      <View style={styles.clinicCard}>
        <View style={styles.clinicIcon}><Text style={styles.clinicIconText}>✚</Text></View>
        <View style={styles.clinicCopy}>
          <Text style={styles.clinicName}>Taj Dental</Text>
          <Text style={styles.clinicAddress}>Main clinic · address to be configured</Text>
          <Text style={styles.clinicMeta}>Your sample connected clinic</Text>
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
  return <AppointmentBookingScreen />;
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
          <Text style={styles.recordMeta}>Taj Dental · Nov 03, 2026</Text>
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

function ProfileScreen({ session, onSignOut }: { session: Session | null; onSignOut: () => void }) {
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
        <Text style={styles.profileName}>{String(session.user.user_metadata?.full_name || "TAJ DENTAL Patient")}</Text>
        <Text style={styles.profileEmail}>{session?.user.email || "Preview account"}</Text>
        <View style={styles.profileTag}><Text style={styles.profileTagText}>{session ? "SECURE PATIENT ACCOUNT" : "PATIENT PREVIEW"}</Text></View>
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
      <Pressable onPress={onSignOut} style={{ backgroundColor: colors.purpleDark, borderRadius: 13, paddingVertical: 14, alignItems: "center", marginTop: 18 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "800" }}>Sign out</Text>
      </Pressable>
      <Text style={styles.demoNoticeText}>Taj Dental · A Product by Nexora Solutions</Text>
    </ScrollView>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [accountType, setAccountType] = useState<"signedout" | "checking" | "patient" | "staff" | "error">("signedout");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [demoPatient, setDemoPatient] = useState(false);
  const [demoStaff, setDemoStaff] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setAuthReady(true);
      }
    }).catch(() => {
      if (mounted) setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) setAccountType("signedout");
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session || !supabase) {
      if (!session) setAccountType("signedout");
      return;
    }
    let active = true;
    setAccountType("checking");
    const resolveAccount = async () => {
      const { data, error } = await supabase
        .from("clinic_memberships")
        .select("clinic_id, role, branch_id")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .limit(1);
      if (!active) return;
      if (error) {
        setAccountType("error");
      } else {
        setAccountType(data && data.length > 0 ? "staff" : "patient");
      }
    };
    resolveAccount();
    return () => { active = false; };
  }, [session]);

  const signOut = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Sign out failed", error.message);
        return;
      }
    }
    setSession(null);
    setDemoPatient(false);
    setDemoStaff(false);
    setShowOnboarding(false);
    setAccountType("signedout");
  };

  if (!authReady || (session && accountType === "checking")) {
    return (
      <View style={[styles.app, { alignItems: "center", justifyContent: "center" }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Text style={{ color: colors.purpleDark, fontSize: 14, fontWeight: "800" }}>TAJ DENTAL</Text>
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 8 }}>Securely loading your account…</Text>
      </View>
    );
  }

  if (session && accountType === "error") {
    return (
      <View style={[styles.app, { alignItems: "center", justifyContent: "center", padding: 24 }]}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>Could not verify your clinic access</Text>
        <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 8 }}>Please check your connection and try signing in again.</Text>
        <Pressable onPress={signOut} style={{ backgroundColor: colors.pink, borderRadius: 12, padding: 14, marginTop: 18 }}>
          <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>Sign out</Text>
        </Pressable>
      </View>
    );
  }

  if (session && accountType === "staff" || demoStaff) {
    return (
      <View style={styles.app}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ClinicDashboardScreen onExit={session ? signOut : () => setDemoStaff(false)} />
      </View>
    );
  }

  if (showOnboarding && !session) {
    return (
      <View style={styles.app}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <OnboardingScreen onContinue={() => { setShowOnboarding(false); setDemoPatient(true); }} />
      </View>
    );
  }

  if (session && accountType === "patient" || demoPatient) {
    const content = () => {
      switch (activeTab) {
        case "appointments":
          return <AppointmentsScreen />;
        case "records":
          return <RecordsScreen />;
        case "care":
          return <CareHubScreen />;
        case "profile":
          return session
            ? <ProfileScreen session={session} onSignOut={signOut} />
            : <ProfileScreen session={null} onSignOut={() => setDemoPatient(false)} />;
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

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AuthScreen
        onExploreDemo={() => setShowOnboarding(true)}
        onOpenClinicDemo={() => setDemoStaff(true)}
        onAuthenticated={(nextSession) => {
          setSession(nextSession);
          setDemoPatient(false);
          setDemoStaff(false);
          setShowOnboarding(false);
        }}
      />
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
  routineCard: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 24 },
  routineHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  routineTitle: { color: colors.text, fontSize: 13, fontWeight: "800" },
  routineSub: { color: colors.muted, fontSize: 10, marginTop: 4 },
  routineBadge: { backgroundColor: colors.pinkSoft, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 12 },
  routineBadgeText: { color: colors.pink, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  routineRow: { flexDirection: "row", alignItems: "center", paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.border, gap: 10 },
  routineCheck: { width: 22, height: 22, borderRadius: 8, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  routineCheckText: { color: colors.purple, fontSize: 12, fontWeight: "900" },
  routinePending: { width: 22, height: 22, borderRadius: 8, backgroundColor: "#FFF2E7", alignItems: "center", justifyContent: "center" },
  routinePendingText: { color: "#D97706", fontSize: 13 },
  routineItem: { flex: 1, color: colors.text, fontSize: 11, fontWeight: "700" },
  routineDone: { color: colors.success, fontSize: 10, fontWeight: "800" },
  routinePendingLabel: { color: colors.muted, fontSize: 9 },
  routineDisclaimer: { color: colors.muted, fontSize: 8, marginTop: 10 },
  clinicCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surface, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 17 },
  clinicIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  clinicIconText: { color: colors.purple, fontSize: 20, fontWeight: "900" },
  clinicCopy: { flex: 1 },
  clinicName: { color: colors.text, fontSize: 12, fontWeight: "800" },
  clinicAddress: { color: colors.muted, fontSize: 10, marginTop: 4 },
  clinicMeta: { color: colors.pink, fontSize: 9, fontWeight: "700", marginTop: 5 },
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