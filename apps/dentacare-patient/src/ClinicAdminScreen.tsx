import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

type Section = "Branches" | "Staff & roles" | "Services" | "Settings";
const branchData = [
  { name: "Taj Dental", address: "Main clinic · address to be configured", status: "Main branch", staff: "8 staff" },
  { name: "Taj Dental · Branch 02 (Preview)", address: "Branch 02 · address to be configured", status: "Branch", staff: "5 staff" }
];
const staffData = [
  { initials: "EC", name: "Dr. Emily Carter", role: "Clinic dentist", access: "Doctor" },
  { initials: "OR", name: "Olivia Reed", role: "Front desk manager", access: "Reception" },
  { initials: "JM", name: "James Miller", role: "Dental assistant", access: "Assistant" },
  { initials: "SL", name: "Sophia Lee", role: "Clinic administrator", access: "Admin" }
];
const serviceData = [
  ["General check-up", "20 min", "Rs 1,500"],
  ["Teeth cleaning", "45 min", "Rs 4,000"],
  ["Tooth filling", "40 min", "Rs 3,500"],
  ["Braces consultation", "30 min", "Rs 2,000"],
  ["Root canal consultation", "30 min", "Rs 2,500"]
];

export default function ClinicAdminScreen({ onBack }: { onBack: () => void }) {
  const [section, setSection] = useState<Section>("Branches");
  const [clinicName, setClinicName] = useState("Taj Dental");
  const [reminders, setReminders] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [onlineBooking, setOnlineBooking] = useState(false);
  const [currency, setCurrency] = useState("PKR · Pakistani Rupee");
  const sections: Section[] = ["Branches", "Staff & roles", "Services", "Settings"];
  const toggle = (label: string, value: boolean, setter: (v: boolean) => void) => <Pressable style={styles.settingRow} onPress={() => setter(!value)}><View style={{ flex: 1 }}><Text style={styles.settingName}>{label}</Text><Text style={styles.settingSub}>Demo preference · not saved to a live account</Text></View><View style={[styles.toggle, value && styles.toggleOn]}><View style={[styles.toggleKnob, value && styles.toggleKnobOn]} /></View></Pressable>;
  return (
    <View style={styles.screen}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><Pressable style={styles.back} onPress={onBack}><Text style={styles.backText}>‹</Text></Pressable><View style={{ flex: 1 }}><Text style={styles.eyebrow}>CLINIC MANAGEMENT</Text><Text style={styles.title}>Administration</Text></View><View style={styles.headerIcon}><Text style={styles.headerIconText}>⚙</Text></View></View>
      <View style={styles.demo}><Text style={styles.demoText}>ADMIN PREVIEW · SAMPLE CONFIGURATION</Text></View>
      <Text style={styles.intro}>Manage your clinic structure, team access, services and preferences from one place.</Text>
      <View style={styles.tabs}>{sections.map(x => <Pressable key={x} onPress={() => setSection(x)} style={[styles.tab, section === x && styles.tabActive]}><Text style={[styles.tabText, section === x && styles.tabTextActive]}>{x}</Text></Pressable>)}</View>
      {section === "Branches" ? <>
        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Clinic locations</Text><Pressable onPress={() => Alert.alert("Add branch", "Branch creation will be enabled after secure backend setup.")}><Text style={styles.action}>+ Add branch</Text></Pressable></View>
        {branchData.map((b, i) => <View key={b.name} style={styles.card}><View style={styles.branchTop}><View style={styles.branchIcon}><Text style={styles.branchIconText}>⌖</Text></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{b.name}</Text><Text style={styles.cardSub}>{b.address}</Text></View><Text style={styles.chevron}>›</Text></View><View style={styles.branchMeta}><Text style={styles.pill}>{b.status}</Text><Text style={styles.metaText}>{b.staff}</Text></View><Pressable style={styles.manageButton} onPress={() => Alert.alert(b.name, "Branch details and working hours will be editable after backend setup.")}><Text style={styles.manageText}>Manage branch</Text></Pressable></View>)}
      </> : section === "Staff & roles" ? <>
        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Team members</Text><Pressable onPress={() => Alert.alert("Invite staff", "Secure staff invitations will be enabled after authentication setup.")}><Text style={styles.action}>+ Invite staff</Text></Pressable></View>
        <View style={styles.card}>{staffData.map((s, i) => <View key={s.name} style={[styles.staffRow, i === staffData.length - 1 && { borderBottomWidth: 0 }]}><View style={styles.staffAvatar}><Text style={styles.staffInitials}>{s.initials}</Text></View><View style={{ flex: 1 }}><Text style={styles.staffName}>{s.name}</Text><Text style={styles.cardSub}>{s.role}</Text></View><View style={styles.rolePill}><Text style={styles.roleText}>{s.access}</Text></View></View>)}</View>
        <View style={styles.info}><Text style={styles.infoTitle}>Role-based access</Text><Text style={styles.infoText}>Doctors access assigned clinical records. Reception manages bookings and front-desk tasks. Assistants receive limited care-workflow access. Administrators manage clinic configuration.</Text></View>
      </> : section === "Services" ? <>
        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Service catalogue</Text><Pressable onPress={() => Alert.alert("Add service", "Service creation will be enabled after backend setup.")}><Text style={styles.action}>+ Add service</Text></Pressable></View>
        <View style={styles.card}>{serviceData.map(([name, duration, price], i) => <View key={name} style={[styles.serviceRow, i === serviceData.length - 1 && { borderBottomWidth: 0 }]}><View style={{ flex: 1 }}><Text style={styles.staffName}>{name}</Text><Text style={styles.cardSub}>{duration} appointment</Text></View><Text style={styles.price}>{price}</Text></View>)}</View>
        <Text style={styles.smallNote}>Prices are examples and can be configured per branch in the live system.</Text>
      </> : <>
        <View style={styles.card}><Text style={styles.cardTitle}>Clinic profile</Text><Text style={styles.fieldLabel}>Display name</Text><View style={styles.field}><Text style={styles.fieldValue}>{clinicName}</Text></View><Pressable style={styles.manageButton} onPress={() => Alert.alert("Clinic profile", "Profile editing will be connected to secure clinic settings.")}><Text style={styles.manageText}>Edit clinic profile</Text></Pressable><Text style={styles.fieldLabel}>Default currency</Text><View style={styles.field}><Text style={styles.fieldValue}>{currency}</Text></View><Pressable style={styles.manageButton} onPress={() => setCurrency(currency.startsWith("PKR") ? "USD · US Dollar" : "PKR · Pakistani Rupee")}><Text style={styles.manageText}>Switch demo currency</Text></Pressable></View>
        <View style={styles.card}><Text style={styles.cardTitle}>Workspace preferences</Text>{toggle("Appointment reminders", reminders, setReminders)}{toggle("Two-step sign-in", twoFactor, setTwoFactor)}{toggle("Online appointment requests", onlineBooking, setOnlineBooking)}</View>
        <View style={styles.info}><Text style={styles.infoTitle}>Security & privacy</Text><Text style={styles.infoText}>Live access controls, consent retention, audit history and clinic data isolation require backend configuration and must be reviewed before activation.</Text></View>
      </>}
      <View style={styles.footerNote}><Text style={styles.footerTitle}>Preview only</Text><Text style={styles.footerText}>Changes on this screen are local demo interactions. Nothing is saved to a real clinic or database.</Text></View>
      <Text style={styles.footer}>TAJ DENTAL · A Product by Nexora Solutions</Text>
    </ScrollView></View>
  );
}

const styles = StyleSheet.create({
 screen:{flex:1,backgroundColor:colors.background},content:{paddingHorizontal:20,paddingTop:48,paddingBottom:32},
 header:{flexDirection:"row",alignItems:"center",gap:12,marginBottom:18},back:{width:38,height:38,borderRadius:13,backgroundColor:colors.purpleSoft,alignItems:"center",justifyContent:"center"},backText:{color:colors.purpleDark,fontSize:30,lineHeight:34},eyebrow:{color:colors.pink,fontSize:8,fontWeight:"900",letterSpacing:1.2},title:{color:colors.text,fontSize:20,fontWeight:"900",marginTop:3},headerIcon:{width:40,height:40,borderRadius:14,backgroundColor:colors.pinkSoft,alignItems:"center",justifyContent:"center"},headerIconText:{color:colors.purpleDark,fontSize:19,fontWeight:"900"},
 demo:{alignSelf:"flex-start",backgroundColor:colors.pinkSoft,borderRadius:20,paddingHorizontal:11,paddingVertical:7,marginBottom:10},demoText:{color:colors.pink,fontSize:8,fontWeight:"900",letterSpacing:1},intro:{color:colors.muted,fontSize:11,lineHeight:17,marginBottom:17},
 tabs:{flexDirection:"row",flexWrap:"wrap",backgroundColor:colors.purpleSoft,borderRadius:13,padding:4,marginBottom:16},tab:{flexGrow:1,alignItems:"center",paddingVertical:10,paddingHorizontal:6,borderRadius:10},tabActive:{backgroundColor:colors.surface},tabText:{color:colors.muted,fontSize:8,fontWeight:"800"},tabTextActive:{color:colors.purpleDark},
 sectionHead:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:12},sectionTitle:{color:colors.text,fontSize:14,fontWeight:"900"},action:{color:colors.pink,fontSize:9,fontWeight:"900"},
 card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:17,padding:14,marginBottom:12},branchTop:{flexDirection:"row",alignItems:"center",gap:10},branchIcon:{width:38,height:38,borderRadius:13,backgroundColor:colors.purpleSoft,alignItems:"center",justifyContent:"center"},branchIconText:{fontSize:20,color:colors.purpleDark},cardTitle:{color:colors.text,fontSize:11,fontWeight:"900"},cardSub:{color:colors.muted,fontSize:8,marginTop:4},chevron:{fontSize:22,color:colors.pink},branchMeta:{flexDirection:"row",alignItems:"center",gap:10,marginTop:13},pill:{backgroundColor:colors.pinkSoft,color:colors.pink,fontSize:8,fontWeight:"900",overflow:"hidden",paddingHorizontal:9,paddingVertical:5,borderRadius:9},metaText:{color:colors.muted,fontSize:8},manageButton:{alignItems:"center",paddingVertical:10,backgroundColor:colors.purpleSoft,borderRadius:10,marginTop:12},manageText:{color:colors.purpleDark,fontSize:9,fontWeight:"900"},
 staffRow:{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:12,borderBottomWidth:1,borderBottomColor:colors.border},staffAvatar:{width:36,height:36,borderRadius:13,backgroundColor:colors.purpleSoft,alignItems:"center",justifyContent:"center"},staffInitials:{color:colors.purpleDark,fontSize:9,fontWeight:"900"},staffName:{color:colors.text,fontSize:10,fontWeight:"900"},rolePill:{backgroundColor:colors.pinkSoft,paddingHorizontal:8,paddingVertical:6,borderRadius:8},roleText:{color:colors.pink,fontSize:8,fontWeight:"900"},
 info:{backgroundColor:colors.purpleSoft,borderRadius:15,padding:14,marginTop:3,marginBottom:12},infoTitle:{color:colors.purpleDark,fontSize:10,fontWeight:"900",marginBottom:5},infoText:{color:colors.purpleDark,fontSize:8,lineHeight:14},serviceRow:{flexDirection:"row",alignItems:"center",paddingVertical:13,borderBottomWidth:1,borderBottomColor:colors.border},price:{color:colors.purple,fontSize:9,fontWeight:"900"},smallNote:{color:colors.muted,fontSize:8,lineHeight:13,marginBottom:12},
 fieldLabel:{color:colors.muted,fontSize:8,fontWeight:"900",marginTop:15,marginBottom:6},field:{backgroundColor:colors.background,borderRadius:10,padding:12},fieldValue:{color:colors.text,fontSize:10,fontWeight:"800"},settingRow:{flexDirection:"row",alignItems:"center",paddingVertical:13,borderBottomWidth:1,borderBottomColor:colors.border},settingName:{color:colors.text,fontSize:10,fontWeight:"800"},settingSub:{color:colors.muted,fontSize:7,marginTop:4},toggle:{width:38,height:22,borderRadius:12,backgroundColor:"#D8DCE7",padding:3,justifyContent:"center"},toggleOn:{backgroundColor:colors.purple},toggleKnob:{width:16,height:16,borderRadius:9,backgroundColor:"#FFFFFF"},toggleKnobOn:{alignSelf:"flex-end"},
 footerNote:{backgroundColor:colors.pinkSoft,borderRadius:14,padding:13,marginTop:4},footerTitle:{color:colors.pink,fontSize:9,fontWeight:"900",marginBottom:4},footerText:{color:colors.purpleDark,fontSize:8,lineHeight:13},footer:{color:colors.muted,fontSize:8,textAlign:"center",marginTop:18}
});