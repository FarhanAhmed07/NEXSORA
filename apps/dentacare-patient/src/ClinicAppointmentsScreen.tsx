import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

type Status = "Confirmed" | "Arrived" | "Completed" | "Cancelled";
type Appointment = { id: string; time: string; patient: string; service: string; doctor: string; status: Status };

const seed: Appointment[] = [
  { id: "TD-1042", time: "09:00 AM", patient: "Ava Thompson", service: "Routine check-up", doctor: "Dr. Emily Carter", status: "Arrived" },
  { id: "TD-1043", time: "09:30 AM", patient: "Noah Williams", service: "Tooth pain consultation", doctor: "Dr. James Lee", status: "Confirmed" },
  { id: "TD-1044", time: "10:15 AM", patient: "Mia Johnson", service: "Professional cleaning", doctor: "Dr. Emily Carter", status: "Confirmed" },
  { id: "TD-1045", time: "11:00 AM", patient: "Ethan Brown", service: "Follow-up visit", doctor: "Dr. James Lee", status: "Completed" },
  { id: "TD-1046", time: "12:00 PM", patient: "Isabella Davis", service: "Braces consultation", doctor: "Dr. Emily Carter", status: "Cancelled" }
];

type Filter = "All" | "Today" | "Upcoming";

export default function ClinicAppointmentsScreen({ onBack }: { onBack: () => void }) {
  const [appointments, setAppointments] = useState(seed);
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(() => appointments.filter(item => filter === "All" || (filter === "Today" ? item.status !== "Cancelled" : item.status === "Confirmed")), [appointments, filter]);
  const updateStatus = (id: string, status: Status) => setAppointments(current => current.map(item => item.id === id ? { ...item, status } : item));
  const tone = (status: Status) => status === "Completed" || status === "Arrived" ? styles.statusGreen : status === "Cancelled" ? styles.statusRed : styles.statusPurple;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  Back to dashboard</Text></Pressable>
        <Text style={styles.eyebrow}>TAJ DENTAL · RECEPTION</Text>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Review the daily schedule and update patient arrival status.</Text>
        <View style={styles.summary}>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{appointments.length.toString().padStart(2,"0")}</Text><Text style={styles.summaryLabel}>Total</Text></View>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{appointments.filter(x=>x.status==="Arrived").length.toString().padStart(2,"0")}</Text><Text style={styles.summaryLabel}>Arrived</Text></View>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{appointments.filter(x=>x.status==="Confirmed").length.toString().padStart(2,"0")}</Text><Text style={styles.summaryLabel}>Confirmed</Text></View>
        </View>
        <View style={styles.filters}>
          {(["All","Today","Upcoming"] as Filter[]).map(item=><Pressable key={item} onPress={()=>setFilter(item)} style={[styles.filter,filter===item&&styles.filterActive]}><Text style={[styles.filterText,filter===item&&styles.filterTextActive]}>{item}</Text></Pressable>)}
        </View>
        {visible.map(item=>(
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={[styles.status,tone(item.status)]}>{item.status}</Text>
            </View>
            <Text style={styles.patient}>{item.patient}</Text>
            <Text style={styles.meta}>{item.service}</Text>
            <Text style={styles.meta}>{item.doctor} · {item.id}</Text>
            <View style={styles.actions}>
              {item.status==="Confirmed" ? <Pressable style={styles.actionPrimary} onPress={()=>updateStatus(item.id,"Arrived")}><Text style={styles.actionPrimaryText}>Mark arrived</Text></Pressable> : null}
              {item.status==="Arrived" ? <Pressable style={styles.actionPrimary} onPress={()=>updateStatus(item.id,"Completed")}><Text style={styles.actionPrimaryText}>Complete visit</Text></Pressable> : null}
              {item.status==="Completed" || item.status==="Cancelled" ? <Pressable style={styles.actionSecondary} onPress={()=>Alert.alert("Appointment details", "This is a sample appointment. Live patient and scheduling records will be connected after backend approval.")}><Text style={styles.actionSecondaryText}>View details</Text></Pressable> : <Pressable style={styles.actionSecondary} onPress={()=>Alert.alert("Reschedule appointment", "Live availability and patient notifications will be enabled after backend and messaging setup.")}><Text style={styles.actionSecondaryText}>Reschedule</Text></Pressable>}
            </View>
          </View>
        ))}
        <Pressable style={styles.addButton} onPress={()=>Alert.alert("New appointment", "The booking interface is available in the patient preview. Reception-side patient matching and live slot validation will be connected with the backend.")}><Text style={styles.addText}>＋  Add appointment</Text></Pressable>
        <View style={styles.notice}><Text style={styles.noticeText}>Demo schedule only · Status changes are local to this preview and are not saved to a clinic database.</Text></View>
        <Text style={styles.footer}>TAJ DENTAL · Developed by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.background},
  content:{padding:20,paddingTop:48,paddingBottom:32},
  back:{marginBottom:20},
  backText:{color:colors.purple,fontSize:12,fontWeight:"800"},
  eyebrow:{color:colors.pink,fontSize:9,fontWeight:"900",letterSpacing:1.2,marginBottom:8},
  title:{color:colors.text,fontSize:26,fontWeight:"900"},
  subtitle:{color:colors.muted,fontSize:11,lineHeight:17,marginTop:7,marginBottom:17},
  summary:{flexDirection:"row",gap:8,marginBottom:16},
  summaryItem:{flex:1,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:15,padding:13},
  summaryValue:{color:colors.purpleDark,fontSize:22,fontWeight:"900"},
  summaryLabel:{color:colors.muted,fontSize:9,fontWeight:"700",marginTop:3},
  filters:{flexDirection:"row",backgroundColor:colors.purpleSoft,borderRadius:13,padding:4,marginBottom:13},
  filter:{flex:1,alignItems:"center",paddingVertical:10,borderRadius:10},
  filterActive:{backgroundColor:colors.surface},
  filterText:{color:colors.muted,fontSize:9,fontWeight:"800"},
  filterTextActive:{color:colors.purpleDark},
  card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:17,padding:15,marginBottom:10},
  cardTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  time:{color:colors.purple,fontSize:10,fontWeight:"900"},
  status:{fontSize:8,fontWeight:"900",paddingHorizontal:9,paddingVertical:6,borderRadius:10,overflow:"hidden"},
  statusGreen:{color:colors.success,backgroundColor:colors.successSoft},
  statusRed:{color:"#B42318",backgroundColor:"#FEE4E2"},
  statusPurple:{color:colors.purpleDark,backgroundColor:colors.purpleSoft},
  patient:{color:colors.text,fontSize:14,fontWeight:"900",marginTop:10},
  meta:{color:colors.muted,fontSize:9,marginTop:5},
  actions:{flexDirection:"row",gap:8,marginTop:13},
  actionPrimary:{backgroundColor:colors.purple,borderRadius:10,paddingHorizontal:12,paddingVertical:9},
  actionPrimaryText:{color:"#FFFFFF",fontSize:9,fontWeight:"900"},
  actionSecondary:{backgroundColor:colors.purpleSoft,borderRadius:10,paddingHorizontal:12,paddingVertical:9},
  actionSecondaryText:{color:colors.purpleDark,fontSize:9,fontWeight:"900"},
  addButton:{backgroundColor:colors.purple,borderRadius:13,padding:14,alignItems:"center",marginTop:5},
  addText:{color:"#FFFFFF",fontSize:10,fontWeight:"900"},
  notice:{backgroundColor:colors.pinkSoft,borderRadius:13,padding:13,marginTop:13},
  noticeText:{color:colors.purpleDark,fontSize:9,lineHeight:14},
  footer:{color:colors.muted,fontSize:8,textAlign:"center",marginTop:18}
});
