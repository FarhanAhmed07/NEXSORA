import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "./theme";

type Section = "treatments" | "chart" | "prescriptions";
const teeth = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

export default function ClinicClinicalScreen({ onBack, initialSection = "treatments" }: { onBack: () => void; initialSection?: Section }) {
  const [section, setSection] = useState<Section>(initialSection);
  const [selectedTooth, setSelectedTooth] = useState(16);
  const [completed, setCompleted] = useState<string[]>(["Clinical examination"]);
  const toggle = (item: string) => setCompleted(current => current.includes(item) ? current.filter(x => x !== item) : [...current, item]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  Back to dashboard</Text></Pressable>
        <Text style={styles.eyebrow}>TAJ DENTAL · CLINICAL WORKSPACE</Text>
        <Text style={styles.title}>Clinical tools</Text>
        <Text style={styles.subtitle}>Review care plans, select FDI teeth and preview prescription records.</Text>
        <View style={styles.tabs}>
          {([
            ["treatments","Treatment plan"],["chart","Dental chart"],["prescriptions","Prescriptions"]
          ] as [Section,string][]).map(([key,label])=><Pressable key={key} onPress={()=>setSection(key)} style={[styles.tab,section===key&&styles.tabActive]}><Text style={[styles.tabText,section===key&&styles.tabTextActive]}>{label}</Text></Pressable>)}
        </View>

        {section === "treatments" && <>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>ACTIVE PLAN · SAMPLE PATIENT</Text>
            <Text style={styles.cardTitle}>Comprehensive dental care</Text>
            <Text style={styles.body}>Patient: Ava Thompson · Plan ID: TP-208</Text>
            <View style={styles.progressTrack}><View style={[styles.progressFill,{width:(completed.length/4*100)+"%"}]} /></View>
            <Text style={styles.muted}>{completed.length} of 4 procedures marked complete in this preview</Text>
          </View>
          {["Clinical examination","Professional cleaning","Restoration consultation","Follow-up review"].map((item,index)=><Pressable key={item} style={styles.listRow} onPress={()=>toggle(item)}><View style={[styles.check,completed.includes(item)&&styles.checkActive]}><Text style={styles.checkText}>{completed.includes(item)?"✓":String(index+1)}</Text></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{item}</Text><Text style={styles.body}>{index<2?"Planned care item":"Pending clinician review"}</Text></View><Text style={styles.action}>{completed.includes(item)?"Done":"Mark"}</Text></Pressable>)}
          <Pressable style={styles.primary} onPress={()=>Alert.alert("Treatment plan", "Saving treatment plans to the verified patient record will be enabled after secure backend setup.")}><Text style={styles.primaryText}>Save plan changes</Text></Pressable>
        </>}

        {section === "chart" && <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Interactive dental chart</Text>
            <Text style={styles.body}>FDI two-digit tooth numbering · Select a tooth to review its sample chart entry.</Text>
            <Text style={styles.quadrant}>UPPER JAW</Text>
            <View style={styles.teeth}>{teeth.slice(0,16).map(tooth=><Pressable key={tooth} onPress={()=>setSelectedTooth(tooth)} style={[styles.tooth,selectedTooth===tooth&&styles.toothActive]}><Text style={[styles.toothText,selectedTooth===tooth&&styles.toothTextActive]}>{tooth}</Text></Pressable>)}</View>
            <View style={styles.midline} />
            <View style={styles.teeth}>{teeth.slice(16).map(tooth=><Pressable key={tooth} onPress={()=>setSelectedTooth(tooth)} style={[styles.tooth,selectedTooth===tooth&&styles.toothActive]}><Text style={[styles.toothText,selectedTooth===tooth&&styles.toothTextActive]}>{tooth}</Text></Pressable>)}</View>
            <Text style={styles.quadrant}>LOWER JAW</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>SELECTED TOOTH</Text>
            <Text style={styles.selectedTooth}>{selectedTooth}</Text>
            <Text style={styles.body}>No clinical finding recorded in this sample chart. Add findings only after examination.</Text>
            <Pressable style={styles.secondary} onPress={()=>Alert.alert("Clinical finding", "Structured chart notes and history will be saved after the patient record backend is approved.")}><Text style={styles.secondaryText}>Add chart note</Text></Pressable>
          </View>
          <Text style={styles.disclaimer}>This chart is a documentation aid, not an automated diagnosis.</Text>
        </>}

        {section === "prescriptions" && <>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>PRESCRIPTION · SAMPLE</Text>
            <Text style={styles.cardTitle}>Post-visit instructions</Text>
            <Text style={styles.body}>Patient: Ava Thompson · Prescriber: Dr. Emily Carter</Text>
            <View style={styles.separator} />
            <Text style={styles.rowTitle}>Medication details</Text>
            <Text style={styles.body}>No medication has been prescribed in this preview. Enter medication, dose, frequency and duration only after a clinician makes the decision.</Text>
          </View>
          <Pressable style={styles.primary} onPress={()=>Alert.alert("New prescription", "Prescription creation, clinician signature and pharmacy-ready PDF will be connected after backend and permissions setup.")}><Text style={styles.primaryText}>＋  Create prescription</Text></Pressable>
          <View style={styles.notice}><Text style={styles.noticeText}>Medication safety: this screen does not recommend medicines or generate treatment decisions.</Text></View>
        </>}
        <Text style={styles.footer}>TAJ DENTAL · Developed by Nexora Solutions</Text>
      </ScrollView>
    </View>
  );
}

const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.background},content:{padding:20,paddingTop:48,paddingBottom:32},back:{marginBottom:20},backText:{color:colors.purple,fontSize:12,fontWeight:"800"},eyebrow:{color:colors.pink,fontSize:9,fontWeight:"900",letterSpacing:1.2,marginBottom:8},title:{color:colors.text,fontSize:26,fontWeight:"900"},subtitle:{color:colors.muted,fontSize:11,lineHeight:17,marginTop:7,marginBottom:17},tabs:{flexDirection:"row",backgroundColor:colors.purpleSoft,borderRadius:13,padding:4,marginBottom:15},tab:{flex:1,alignItems:"center",paddingVertical:10,borderRadius:10},tabActive:{backgroundColor:colors.surface},tabText:{color:colors.muted,fontSize:8,fontWeight:"800"},tabTextActive:{color:colors.purpleDark},card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:17,padding:15,marginBottom:11},cardEyebrow:{color:colors.pink,fontSize:8,fontWeight:"900",letterSpacing:1},cardTitle:{color:colors.text,fontSize:13,fontWeight:"900",marginTop:8},body:{color:colors.muted,fontSize:9,lineHeight:15,marginTop:5},progressTrack:{height:7,backgroundColor:colors.purpleSoft,borderRadius:8,overflow:"hidden",marginTop:15},progressFill:{height:7,backgroundColor:colors.purple,borderRadius:8},muted:{color:colors.muted,fontSize:8,marginTop:6},listRow:{flexDirection:"row",alignItems:"center",gap:10,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:14,padding:12,marginBottom:8},check:{width:27,height:27,borderRadius:9,backgroundColor:colors.purpleSoft,alignItems:"center",justifyContent:"center"},checkActive:{backgroundColor:colors.successSoft},checkText:{color:colors.purpleDark,fontSize:9,fontWeight:"900"},rowCopy:{flex:1},rowTitle:{color:colors.text,fontSize:10,fontWeight:"900"},action:{color:colors.purple,fontSize:9,fontWeight:"900"},primary:{backgroundColor:colors.purple,borderRadius:13,padding:14,alignItems:"center",marginTop:7},primaryText:{color:"#FFFFFF",fontSize:10,fontWeight:"900"},quadrant:{color:colors.muted,fontSize:8,fontWeight:"900",textAlign:"center",letterSpacing:1,marginVertical:12},teeth:{flexDirection:"row",flexWrap:"wrap",justifyContent:"center",gap:4},tooth:{width:33,height:38,borderWidth:1,borderColor:colors.border,borderRadius:9,alignItems:"center",justifyContent:"center",backgroundColor:colors.surface},toothActive:{backgroundColor:colors.purple,borderColor:colors.purple},toothText:{color:colors.text,fontSize:8,fontWeight:"800"},toothTextActive:{color:"#FFFFFF"},midline:{height:1,backgroundColor:colors.border,marginTop:13},selectedTooth:{color:colors.purpleDark,fontSize:28,fontWeight:"900",marginTop:7},secondary:{alignSelf:"flex-start",backgroundColor:colors.purpleSoft,paddingHorizontal:12,paddingVertical:9,borderRadius:10,marginTop:12},secondaryText:{color:colors.purpleDark,fontSize:9,fontWeight:"900"},disclaimer:{color:colors.warning,fontSize:9,lineHeight:14,marginBottom:12},separator:{height:1,backgroundColor:colors.border,marginVertical:13},notice:{backgroundColor:colors.pinkSoft,padding:13,borderRadius:13,marginTop:12},noticeText:{color:colors.purpleDark,fontSize:9,lineHeight:14},footer:{color:colors.muted,fontSize:8,textAlign:"center",marginTop:18}
});
