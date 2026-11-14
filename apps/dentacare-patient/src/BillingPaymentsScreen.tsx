import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "./theme";

type PaymentStatus = "Paid" | "Pending" | "Partial";
type Invoice = {
  id: string;
  patient: string;
  date: string;
  due: string;
  status: PaymentStatus;
  items: { name: string; qty: number; price: number }[];
  tax: number;
  discount: number;
  payments: { date: string; method: string; amount: number; reference: string }[];
};

const invoices: Invoice[] = [
  { id: "INV-2026-1048", patient: "Ava Thompson", date: "14 Nov 2026", due: "14 Nov 2026", status: "Pending", items: [{ name: "Dental consultation", qty: 1, price: 2500 }, { name: "Dental X-ray", qty: 1, price: 1800 }], tax: 430, discount: 300, payments: [] },
  { id: "INV-2026-1047", patient: "Noah Williams", date: "13 Nov 2026", due: "20 Nov 2026", status: "Partial", items: [{ name: "Root canal treatment", qty: 1, price: 18000 }, { name: "Temporary filling", qty: 1, price: 2500 }], tax: 2050, discount: 1000, payments: [{ date: "13 Nov 2026", method: "Cash", amount: 10000, reference: "DEMO-CASH-1047" }] },
  { id: "INV-2026-1046", patient: "Mia Johnson", date: "12 Nov 2026", due: "12 Nov 2026", status: "Paid", items: [{ name: "Teeth cleaning", qty: 1, price: 6500 }], tax: 780, discount: 280, payments: [{ date: "12 Nov 2026", method: "Card", amount: 7000, reference: "DEMO-CARD-1046" }] },
  { id: "INV-2026-1045", patient: "Ethan Brown", date: "11 Nov 2026", due: "18 Nov 2026", status: "Pending", items: [{ name: "Orthodontic consultation", qty: 1, price: 3500 }], tax: 420, discount: 0, payments: [] }
];

const money = (value: number) => "Rs. " + value.toLocaleString("en-PK");
const subtotal = (invoice: Invoice) => invoice.items.reduce((sum, item) => sum + item.qty * item.price, 0);
const total = (invoice: Invoice) => subtotal(invoice) + invoice.tax - invoice.discount;
const paid = (invoice: Invoice) => invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
const remaining = (invoice: Invoice) => Math.max(0, total(invoice) - paid(invoice));

function StatusPill({ status }: { status: PaymentStatus }) {
  const tone = status === "Paid" ? styles.paid : status === "Partial" ? styles.partial : styles.pending;
  return <View style={[styles.statusPill, tone]}><Text style={[styles.statusText, status === "Paid" ? styles.paidText : status === "Partial" ? styles.partialText : styles.pendingText]}>{status}</Text></View>;
}

export default function BillingPaymentsScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<"All" | PaymentStatus>("All");
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [demoPayments, setDemoPayments] = useState<Record<string, number>>({});
  const visibleInvoices = useMemo(() => invoices.filter((invoice) => filter === "All" || invoice.status === filter), [filter]);
  const getPaid = (invoice: Invoice) => paid(invoice) + (demoPayments[invoice.id] || 0);
  const getRemaining = (invoice: Invoice) => Math.max(0, total(invoice) - getPaid(invoice));

  if (selected) {
    const amountPaid = getPaid(selected);
    const balance = getRemaining(selected);
    const displayStatus: PaymentStatus = balance === 0 ? "Paid" : amountPaid > 0 ? "Partial" : "Pending";
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => setSelected(null)} style={styles.back}><Text style={styles.backText}>← All invoices</Text></Pressable>
          <Text style={styles.eyebrow}>INVOICE DETAILS</Text>
          <Text style={styles.title}>{selected.id}</Text>
          <View style={styles.invoiceHero}>
            <View style={styles.heroTop}><Text style={styles.heroLabel}>TOTAL AMOUNT</Text><StatusPill status={displayStatus} /></View>
            <Text style={styles.heroAmount}>{money(total(selected))}</Text>
            <Text style={styles.heroPatient}>{selected.patient} · {selected.date}</Text>
            <View style={styles.heroDivider} />
            <View style={styles.heroStats}>
              <View><Text style={styles.heroStatLabel}>Paid</Text><Text style={styles.heroStatValue}>{money(amountPaid)}</Text></View>
              <View><Text style={styles.heroStatLabel}>Balance due</Text><Text style={styles.heroStatValue}>{money(balance)}</Text></View>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Invoice items</Text>
          <View style={styles.card}>
            {selected.items.map((item, index) => (
              <View key={item.name} style={[styles.itemRow, index === selected.items.length - 1 && styles.noBorder]}>
                <View style={styles.itemCopy}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.itemMeta}>{item.qty} × {money(item.price)}</Text></View>
                <Text style={styles.itemAmount}>{money(item.qty * item.price)}</Text>
              </View>
            ))}
            <View style={styles.totalLine}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalValue}>{money(subtotal(selected))}</Text></View>
            <View style={styles.totalLine}><Text style={styles.totalLabel}>Tax</Text><Text style={styles.totalValue}>{money(selected.tax)}</Text></View>
            <View style={styles.totalLine}><Text style={styles.totalLabel}>Discount</Text><Text style={styles.discountValue}>− {money(selected.discount)}</Text></View>
            <View style={[styles.totalLine, styles.grandTotal]}><Text style={styles.grandLabel}>Total</Text><Text style={styles.grandValue}>{money(total(selected))}</Text></View>
          </View>
          <Text style={styles.sectionTitle}>Payment history</Text>
          <View style={styles.card}>
            {[...selected.payments, ...(demoPayments[selected.id] ? [{ date: "Today · Demo entry", method: "Cash (demo)", amount: demoPayments[selected.id], reference: "DEMO-ENTRY" }] : [])].length === 0 ? <Text style={styles.emptyText}>No payments recorded for this invoice.</Text> : [...selected.payments, ...(demoPayments[selected.id] ? [{ date: "Today · Demo entry", method: "Cash (demo)", amount: demoPayments[selected.id], reference: "DEMO-ENTRY" }] : [])].map((payment, index) => (
              <View key={payment.reference + index} style={styles.paymentRow}><View style={styles.paymentIcon}><Text style={styles.paymentIconText}>✓</Text></View><View style={styles.paymentCopy}><Text style={styles.paymentMethod}>{payment.method}</Text><Text style={styles.paymentMeta}>{payment.date} · {payment.reference}</Text></View><Text style={styles.paymentAmount}>{money(payment.amount)}</Text></View>
            ))}
          </View>
          {balance > 0 ? <Pressable style={styles.primaryButton} onPress={() => Alert.alert("Demo payment", "This is a preview only. No money was collected and no payment gateway was contacted.", [{ text: "Cancel", style: "cancel" }, { text: "Record demo payment", onPress: () => { setDemoPayments((current) => ({ ...current, [selected.id]: (current[selected.id] || 0) + balance })); Alert.alert("Demo entry added", "The invoice is now marked paid in this preview only."); } }])}><Text style={styles.primaryButtonText}>Record payment · {money(balance)}</Text></Pressable> : <View style={styles.paidNotice}><Text style={styles.paidNoticeText}>✓  This invoice is fully paid in the demo record.</Text></View>}
          <Text style={styles.disclaimer}>Demo billing data only · Not a tax invoice or proof of payment</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Clinic workspace</Text></Pressable>
        <Text style={styles.eyebrow}>FINANCE & ACCOUNTS</Text>
        <Text style={styles.title}>Billing & payments</Text>
        <Text style={styles.subtitle}>Track invoices, outstanding balances and payment history.</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>Total billed</Text><Text style={styles.summaryValue}>{money(35480)}</Text><Text style={styles.summaryHint}>Sample period</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>Collected</Text><Text style={[styles.summaryValue, { color: colors.success }]}>{money(7000)}</Text><Text style={styles.summaryHint}>Demo records</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>Outstanding</Text><Text style={[styles.summaryValue, { color: colors.pink }]}>{money(28480)}</Text><Text style={styles.summaryHint}>Across invoices</Text></View>
        </View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Invoices</Text><Text style={styles.count}>{visibleInvoices.length} records</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {(["All", "Pending", "Partial", "Paid"] as const).map((value) => <Pressable key={value} onPress={() => setFilter(value)} style={[styles.filterChip, filter === value && styles.filterActive]}><Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{value}</Text></Pressable>)}
        </ScrollView>
        {visibleInvoices.map((invoice) => (
          <Pressable key={invoice.id} style={styles.invoiceCard} onPress={() => setSelected(invoice)}>
            <View style={styles.invoiceTop}><Text style={styles.invoiceId}>{invoice.id}</Text><StatusPill status={invoice.status} /></View>
            <Text style={styles.invoicePatient}>{invoice.patient}</Text>
            <Text style={styles.invoiceDate}>Issued {invoice.date} · Due {invoice.due}</Text>
            <View style={styles.invoiceBottom}><View><Text style={styles.balanceLabel}>BALANCE DUE</Text><Text style={styles.balanceAmount}>{money(remaining(invoice))}</Text></View><Text style={styles.openDetails}>View invoice  ›</Text></View>
          </Pressable>
        ))}
        <View style={styles.notice}><Text style={styles.noticeTitle}>Payment safety</Text><Text style={styles.noticeText}>Recording a demo payment only changes this preview's local display. Real payments require an approved payment provider, secure server verification and an audit trail.</Text></View>
        <Text style={styles.disclaimer}>DentaCare · A Product by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 32 },
  back: { alignSelf: "flex-start", paddingVertical: 8, marginBottom: 16 },
  backText: { color: colors.purple, fontSize: 11, fontWeight: "900" },
  eyebrow: { color: colors.pink, fontSize: 9, fontWeight: "900", letterSpacing: 1.6, marginBottom: 8 },
  title: { color: colors.text, fontSize: 26, fontWeight: "900", letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 6, marginBottom: 20 },
  summaryGrid: { flexDirection: "row", gap: 8, marginBottom: 26 },
  summaryCard: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 11 },
  summaryLabel: { color: colors.muted, fontSize: 8, fontWeight: "800" },
  summaryValue: { color: colors.purpleDark, fontSize: 13, fontWeight: "900", marginTop: 8 },
  summaryHint: { color: colors.muted, fontSize: 7, marginTop: 5 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: "900", marginBottom: 11 },
  count: { color: colors.muted, fontSize: 9 },
  filters: { gap: 8, paddingBottom: 14 },
  filterChip: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  filterActive: { backgroundColor: colors.purpleDark, borderColor: colors.purpleDark },
  filterText: { color: colors.muted, fontSize: 9, fontWeight: "800" },
  filterTextActive: { color: "#FFFFFF" },
  invoiceCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 15, marginBottom: 10 },
  invoiceTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  invoiceId: { color: colors.purple, fontSize: 9, fontWeight: "900" },
  statusPill: { borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5 },
  paid: { backgroundColor: colors.successSoft },
  partial: { backgroundColor: "#FFF2E7" },
  pending: { backgroundColor: colors.pinkSoft },
  statusText: { fontSize: 8, fontWeight: "900" },
  paidText: { color: colors.success },
  partialText: { color: colors.warning },
  pendingText: { color: colors.pink },
  invoicePatient: { color: colors.text, fontSize: 13, fontWeight: "900", marginTop: 11 },
  invoiceDate: { color: colors.muted, fontSize: 9, marginTop: 4 },
  invoiceBottom: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 13 },
  balanceLabel: { color: colors.muted, fontSize: 7, fontWeight: "900", letterSpacing: 1 },
  balanceAmount: { color: colors.text, fontSize: 15, fontWeight: "900", marginTop: 4 },
  openDetails: { color: colors.pink, fontSize: 9, fontWeight: "900" },
  notice: { backgroundColor: colors.purpleSoft, borderRadius: 15, padding: 14, marginTop: 9 },
  noticeTitle: { color: colors.purpleDark, fontSize: 10, fontWeight: "900", marginBottom: 5 },
  noticeText: { color: colors.purpleDark, fontSize: 9, lineHeight: 14 },
  disclaimer: { color: colors.muted, fontSize: 8, textAlign: "center", marginTop: 17 },
  invoiceHero: { backgroundColor: colors.purpleDark, borderRadius: radius.card, padding: 18, marginTop: 18, marginBottom: 25 },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroLabel: { color: "#E9D5FF", fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  heroAmount: { color: "#FFFFFF", fontSize: 29, fontWeight: "900", marginTop: 13 },
  heroPatient: { color: "#E9D5FF", fontSize: 10, marginTop: 5 },
  heroDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginVertical: 16 },
  heroStats: { flexDirection: "row", justifyContent: "space-between" },
  heroStatLabel: { color: "#E9D5FF", fontSize: 8 },
  heroStatValue: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", marginTop: 5 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 17, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 23 },
  itemRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  noBorder: { borderBottomWidth: 0 },
  itemCopy: { flex: 1 },
  itemName: { color: colors.text, fontSize: 10, fontWeight: "800" },
  itemMeta: { color: colors.muted, fontSize: 8, marginTop: 4 },
  itemAmount: { color: colors.text, fontSize: 10, fontWeight: "900" },
  totalLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  totalLabel: { color: colors.muted, fontSize: 9 },
  totalValue: { color: colors.text, fontSize: 9, fontWeight: "800" },
  discountValue: { color: colors.success, fontSize: 9, fontWeight: "800" },
  grandTotal: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 4, paddingTop: 13, paddingBottom: 13 },
  grandLabel: { color: colors.text, fontSize: 11, fontWeight: "900" },
  grandValue: { color: colors.purple, fontSize: 13, fontWeight: "900" },
  emptyText: { color: colors.muted, fontSize: 9, paddingVertical: 18, textAlign: "center" },
  paymentRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 10 },
  paymentIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.successSoft, alignItems: "center", justifyContent: "center" },
  paymentIconText: { color: colors.success, fontSize: 13, fontWeight: "900" },
  paymentCopy: { flex: 1 },
  paymentMethod: { color: colors.text, fontSize: 10, fontWeight: "900" },
  paymentMeta: { color: colors.muted, fontSize: 8, marginTop: 4 },
  paymentAmount: { color: colors.success, fontSize: 10, fontWeight: "900" },
  primaryButton: { backgroundColor: colors.pink, borderRadius: 14, padding: 15, alignItems: "center", marginTop: 2 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  paidNotice: { backgroundColor: colors.successSoft, padding: 14, borderRadius: 13, alignItems: "center" },
  paidNoticeText: { color: colors.success, fontSize: 9, fontWeight: "900" }
});
