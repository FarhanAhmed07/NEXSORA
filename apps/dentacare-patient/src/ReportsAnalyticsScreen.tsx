import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

type Period = "Week" | "Month" | "Year";
const revenue: Record<Period, number[]> = {
  Week: [32, 48, 39, 68, 54, 82, 61],
  Month: [42, 55, 49, 76, 62, 88, 71, 94, 58, 79, 66, 90],
  Year: [35, 48, 43, 58, 64, 52, 73, 69, 82, 76, 91, 96]
};
const labels: Record<Period, string[]> = {
  Week: ["M", "T", "W", "T", "F", "S", "S"],
  Month: ["1", "3", "5", "7", "9", "11", "13", "15", "17", "19", "21", "23"],
  Year: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

function StatCard({ label, value, note, accent }: { label: string; value: string; note: string; accent: string }) {
  return <View style={styles.statCard}><View style={[styles.accent, { backgroundColor: accent }]} /><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text><Text style={styles.statNote}>{note}</Text></View>;
}

export default function ReportsAnalyticsScreen({ onBack }: { onBack: () => void }) {
  const [period, setPeriod] = useState<Period>("Month");
  const [section, setSection] = useState<"Overview" | "Treatments" | "Inventory">("Overview");
  const values = revenue[period];
  const max = Math.max(...values);
  const total = useMemo(() => values.reduce((sum, n) => sum + n, 0), [values]);
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Pressable style={styles.back} onPress={onBack}><Text style={styles.backText}>‹</Text></Pressable><View style={{ flex: 1 }}><Text style={styles.eyebrow}>CLINIC MANAGEMENT</Text><Text style={styles.title}>Reports & analytics</Text></View><View style={styles.headerIcon}><Text style={styles.headerIconText}>▥</Text></View></View>
        <View style={styles.demo}><Text style={styles.demoText}>DEMO REPORTS · SAMPLE FIGURES</Text></View>
        <Text style={styles.intro}>Understand clinic performance and keep track of the numbers that matter.</Text>
        <View style={styles.tabs}>{(["Overview", "Treatments", "Inventory"] as const).map(x => <Pressable key={x} onPress={() => setSection(x)} style={[styles.tab, section === x && styles.tabActive]}><Text style={[styles.tabText, section === x && styles.tabTextActive]}>{x}</Text></Pressable>)}</View>
        {section === "Overview" ? <>
          <View style={styles.periodRow}>{(["Week", "Month", "Year"] as const).map(x => <Pressable key={x} onPress={() => setPeriod(x)} style={[styles.period, period === x && styles.periodActive]}><Text style={[styles.periodText, period === x && styles.periodTextActive]}>{x}</Text></Pressable>)}</View>
          <View style={styles.statsGrid}>
            <StatCard label="Total revenue" value={period === "Week" ? "Rs 84K" : period === "Month" ? "Rs 486K" : "Rs 5.2M"} note="+12.8% vs previous" accent={colors.purple} />
            <StatCard label="Appointments" value={period === "Week" ? "42" : period === "Month" ? "186" : "2,140"} note="Across all doctors" accent={colors.pink} />
            <StatCard label="New patients" value={period === "Week" ? "09" : period === "Month" ? "38" : "412"} note="Patient registrations" accent="#28A879" />
            <StatCard label="Completion rate" value="94.2%" note="Appointments attended" accent="#E3A43B" />
          </View>
          <View style={styles.panel}><View style={styles.panelHead}><View><Text style={styles.panelTitle}>Revenue trend</Text><Text style={styles.panelSub}>Illustrative activity · {period.toLowerCase()}</Text></View><Text style={styles.chartTotal}>Rs {total}K</Text></View><View style={styles.chart}>{values.map((v, i) => <View key={i} style={styles.barColumn}><Text style={styles.barValue}>{v}</Text><View style={styles.barTrack}><View style={[styles.bar, { height: (v / max) * 112 }]} /></View><Text style={styles.barLabel}>{labels[period][i]}</Text></View>)}</View></View>
          <View style={styles.panel}><Text style={styles.panelTitle}>Appointment summary</Text><View style={styles.progressRow}><Text style={styles.progressLabel}>Completed</Text><Text style={styles.progressValue}>72%</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: "72%", backgroundColor: "#28A879" }]} /></View><View style={styles.progressRow}><Text style={styles.progressLabel}>Rescheduled</Text><Text style={styles.progressValue}>18%</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: "18%", backgroundColor: colors.purple }]} /></View><View style={styles.progressRow}><Text style={styles.progressLabel}>Cancelled / missed</Text><Text style={styles.progressValue}>10%</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: "10%", backgroundColor: colors.pink }]} /></View></View>
        </> : section === "Treatments" ? <View style={styles.panel}><Text style={styles.panelTitle}>Treatment mix</Text><Text style={styles.panelSub}>Sample distribution of completed services</Text>{[["General check-up", "38%", 38], ["Teeth cleaning", "27%", 27], ["Fillings", "19%", 19], ["Braces consultation", "10%", 10], ["Other", "6%", 6]].map(([name, pct, width]) => <View key={String(name)} style={styles.mixItem}><View style={styles.progressRow}><Text style={styles.progressLabel}>{name}</Text><Text style={styles.progressValue}>{pct}</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: String(width) + "%", backgroundColor: colors.purple }]} /></View></View>)}</View> : <><View style={styles.statsGrid}><StatCard label="Total items" value="248" note="Across categories" accent={colors.purple} /><StatCard label="Low stock" value="12" note="Reorder suggested" accent="#E3A43B" /><StatCard label="Out of stock" value="03" note="Requires attention" accent={colors.pink} /><StatCard label="Expiring soon" value="07" note="Next 30 days" accent="#28A879" /></View><View style={styles.panel}><Text style={styles.panelTitle}>Stock attention list</Text>{[["Dental gloves · Medium", "Low stock", "12 units"], ["Composite resin", "Expiring soon", "18 units"], ["Disposable masks", "Out of stock", "0 units"], ["Etching gel", "Low stock", "4 units"]].map(([name, status, qty]) => <View key={name} style={styles.stockRow}><View style={{ flex: 1 }}><Text style={styles.stockName}>{name}</Text><Text style={styles.stockStatus}>{status}</Text></View><Text style={styles.stockQty}>{qty}</Text></View>)}</View></>}
        <View style={styles.note}><Text style={styles.noteTitle}>About these reports</Text><Text style={styles.noteText}>All values shown here are sample figures for the product preview. Live reports will be calculated from verified clinic records after backend and permissions setup.</Text></View>
        <Text style={styles.footer}>DentaCare · A Product by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 32 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 },
  back: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.purpleSoft, alignItems: "center", justifyContent: "center" },
  backText: { color: colors.purpleDark, fontSize: 30, lineHeight: 34 },
  eyebrow: { color: colors.pink, fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 20, fontWeight: "900", marginTop: 3 },
  headerIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center" },
  headerIconText: { color: colors.purpleDark, fontSize: 19, fontWeight: "900" },
  demo: { alignSelf: "flex-start", backgroundColor: colors.pinkSoft, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, marginBottom: 10 },
  demoText: { color: colors.pink, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  intro: { color: colors.muted, fontSize: 11, lineHeight: 17, marginBottom: 17 },
  tabs: { flexDirection: "row", backgroundColor: colors.purpleSoft, borderRadius: 13, padding: 4, marginBottom: 15 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: colors.surface },
  tabText: { color: colors.muted, fontSize: 9, fontWeight: "800" },
  tabTextActive: { color: colors.purpleDark },
  periodRow: { flexDirection: "row", justifyContent: "flex-end", gap: 7, marginBottom: 12 },
  period: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  periodActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  periodText: { color: colors.muted, fontSize: 9, fontWeight: "800" },
  periodTextActive: { color: "#FFFFFF" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 13 },
  statCard: { width: "48.5%", backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 13, marginBottom: 9 },
  accent: { width: 7, height: 7, borderRadius: 5, marginBottom: 9 },
  statValue: { color: colors.text, fontSize: 21, fontWeight: "900" },
  statLabel: { color: colors.text, fontSize: 10, fontWeight: "800", marginTop: 4 },
  statNote: { color: colors.muted, fontSize: 8, marginTop: 5 },
  panel: { backgroundColor: colors.surface, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 13 },
  panelHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  panelTitle: { color: colors.text, fontSize: 13, fontWeight: "900" },
  panelSub: { color: colors.muted, fontSize: 8, marginTop: 4 },
  chartTotal: { color: colors.purple, fontSize: 12, fontWeight: "900" },
  chart: { height: 158, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 17, gap: 4 },
  barColumn: { flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%" },
  barValue: { color: colors.muted, fontSize: 7, marginBottom: 5 },
  barTrack: { height: 112, width: "72%", justifyContent: "flex-end", backgroundColor: colors.purpleSoft, borderRadius: 6, overflow: "hidden" },
  bar: { width: "100%", backgroundColor: colors.purple, borderRadius: 6 },
  barLabel: { color: colors.muted, fontSize: 7, marginTop: 6 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14, marginBottom: 7 },
  progressLabel: { color: colors.text, fontSize: 9, fontWeight: "700" },
  progressValue: { color: colors.purple, fontSize: 9, fontWeight: "900" },
  progressTrack: { height: 7, backgroundColor: colors.purpleSoft, borderRadius: 8, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 8 },
  mixItem: { marginTop: 5 },
  stockRow: { flexDirection: "row", alignItems: "center", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  stockName: { color: colors.text, fontSize: 10, fontWeight: "800" },
  stockStatus: { color: colors.pink, fontSize: 8, marginTop: 4 },
  stockQty: { color: colors.purpleDark, fontSize: 9, fontWeight: "900" },
  note: { backgroundColor: colors.purpleSoft, borderRadius: 15, padding: 14, marginTop: 2 },
  noteTitle: { color: colors.purpleDark, fontSize: 10, fontWeight: "900", marginBottom: 5 },
  noteText: { color: colors.purpleDark, fontSize: 8, lineHeight: 14 },
  footer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 18 }
});