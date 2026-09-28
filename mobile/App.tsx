import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'BUSES' | 'REPORT' | 'TRACK'>('HOME');
  const [buses, setBuses] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBuses();
    fetchComplaints();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await fetch(`${API_BASE}/buses`);
      const json = await res.json();
      if (json.success) {
        setBuses(json.data.buses || []);
      }
    } catch (e) {
      console.warn('Failed to connect to backend API');
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE}/complaints`);
      const json = await res.json();
      if (json.success) {
        setComplaints(json.data.complaints || []);
      }
    } catch (e) {
      console.warn('Failed to fetch complaints');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Government Header */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>Govt of Tamil Nadu • Transport Dept</Text>
        <Text style={styles.headerTitle}>Smart Bus Mobile</Text>
      </View>

      {/* Main Content View */}
      <ScrollView style={styles.content}>
        {activeTab === 'HOME' && (
          <View style={styles.cardSection}>
            <Text style={styles.welcomeTitle}>Welcome Passenger 👋</Text>
            <Text style={styles.welcomeSub}>Real-Time Bus GPS & Citizen Complaint Portal</Text>

            <View style={styles.grid}>
              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('BUSES')}>
                <Text style={styles.cardEmoji}>🚌</Text>
                <Text style={styles.cardTitle}>Nearby Buses</Text>
                <Text style={styles.cardSub}>Live Map GPS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('REPORT')}>
                <Text style={styles.cardEmoji}>📝</Text>
                <Text style={styles.cardTitle}>File Complaint</Text>
                <Text style={styles.cardSub}>Photo Evidence</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Recent System Complaints</Text>
            {complaints.map((c, idx) => (
              <View key={idx} style={styles.complaintCard}>
                <View style={styles.badgeRow}>
                  <Text style={styles.complaintId}>{c.complaintId}</Text>
                  <Text style={styles.statusBadge}>{c.status}</Text>
                </View>
                <Text style={styles.busInfo}>Bus {c.busNumber} • {c.category}</Text>
                <Text style={styles.descText}>{c.description}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'BUSES' && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeader}>Nearby Buses ({buses.length})</Text>
            {buses.map((bus, idx) => (
              <View key={idx} style={styles.busCard}>
                <Text style={styles.busNumber}>{bus.busNumber}</Text>
                <Text style={styles.routeText}>{bus.route}</Text>
                <Text style={styles.metaText}>Driver: {bus.driver || 'N/A'} • Speed: {bus.speed || 0} km/h</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'REPORT' && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeader}>Submit New Complaint</Text>
            <Text style={styles.welcomeSub}>Report bus issues directly to transport officers.</Text>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => Alert.alert('Submitted', 'Complaint CMP-2026-000999 logged successfully!')}
            >
              <Text style={styles.submitBtnText}>Submit Complaint (Demo)</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('HOME')}>
          <Text style={activeTab === 'HOME' ? styles.navTextActive : styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('BUSES')}>
          <Text style={activeTab === 'BUSES' ? styles.navTextActive : styles.navText}>Buses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('REPORT')}>
          <Text style={activeTab === 'REPORT' ? styles.navTextActive : styles.navText}>Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#0f172a', padding: 16, paddingTop: 40 },
  headerSub: { color: '#38bdf8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: '900' },
  content: { flex: 1, padding: 16 },
  cardSection: { gap: 12 },
  welcomeTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  welcomeSub: { fontSize: 12, color: '#64748b' },
  grid: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  actionCard: { flex: 1, backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardEmoji: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  cardSub: { fontSize: 11, color: '#64748b' },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 12 },
  complaintCard: { backgroundColor: '#ffffff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 4 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  complaintId: { fontFamily: 'monospace', fontWeight: '700', color: '#475569', fontSize: 12 },
  statusBadge: { backgroundColor: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  busInfo: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  descText: { fontSize: 12, color: '#64748b' },
  busCard: { backgroundColor: '#ffffff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 2 },
  busNumber: { fontSize: 16, fontWeight: '800', color: '#0284c7' },
  routeText: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  metaText: { fontSize: 11, color: '#64748b' },
  submitBtn: { backgroundColor: '#0284c7', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#ffffff', borderTopWidth: 1, borderColor: '#e2e8f0', height: 60 },
  navBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  navTextActive: { color: '#0284c7', fontSize: 12, fontWeight: '800' },
});
