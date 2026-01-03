import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Modal, Dimensions, StyleSheet } from 'react-native';
import CalendarPicker from '../../../../../components/UI/CalenderPicker';
import DropdownPicker from '../../../../../components/UI/DropdownPicker';

export default function SamplePrepModal({ visible, onClose, onSubmit }) {
  const { height } = Dimensions.get('window');
  const calculatedHeight = height * 7;

  const [samples, setSamples] = useState([
    {
      id: 1,
      name: 'Sample 1',
      isPrepared: false,
      date: '',
      collectedBy: ''
    }
  ]);

  const addSample = () => {
    const newId = samples.length + 1;
    setSamples([...samples, {
      id: newId,
      name: `Sample ${newId}`,
      isPrepared: false,
      date: '',
      collectedBy: ''
    }]);
  };

  const removeSample = (id) => {
    if (samples.length > 1) {
      setSamples(samples.filter(s => s.id !== id));
    }
  };

  const updateSample = (id, field, value) => {
    setSamples(samples.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleSubmit = () => {
    console.log('Submitted samples:', samples);
    if (onSubmit) {
      onSubmit(samples);
    }
    // Reset form
    setSamples([{
      id: 1,
      name: 'Sample 1',
      isPrepared: false,
      date: '',
      collectedBy: ''
    }]);
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    setSamples([{
      id: 1,
      name: 'Sample 1',
      isPrepared: false,
      date: '',
      collectedBy: ''
    }]);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Sample Preparation</Text>
              <Text style={styles.headerSubtitle}>Enter sample details below</Text>
            </View>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={[styles.scrollView]} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.viewScrollContainer}>
              <View>
                {samples.map((sample, index) => (
                  <View key={sample.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>Sample #{index + 1}</Text>
                      {samples.length > 1 && (
                        <TouchableOpacity 
                          onPress={() => removeSample(sample.id)}
                          style={styles.deleteBtn}
                        >
                          <Text style={styles.deleteText}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.field}>
                      <Text style={styles.label}>Sample Name</Text>
                      <TextInput
                        style={styles.input}
                        value={sample.name}
                        onChangeText={(text) => updateSample(sample.id, 'name', text)}
                        placeholder="Enter sample name"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>

                    <View style={styles.field}>
                      <View style={styles.switchRow}>
                        <Text style={styles.label}>Sample Prepared</Text>
                        <View style={styles.switchContainer}>
                          <Text style={[styles.switchLabel, !sample.isPrepared && styles.switchLabelActive]}>
                            No
                          </Text>
                          <Switch
                            value={sample.isPrepared}
                            onValueChange={(value) => updateSample(sample.id, 'isPrepared', value)}
                            trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                            thumbColor={sample.isPrepared ? '#22c55e' : '#64748b'}
                          />
                          <Text style={[styles.switchLabel, sample.isPrepared && styles.switchLabelActive]}>
                            Yes
                          </Text>
                        </View>
                      </View>
                    </View>

                    <CalendarPicker
                        label="Sample Date"
                        value={sample.date}
                        onChange={date => updateSample(sample.id, 'date', date)}
                    />
                      {/* <Text style={styles.label}>Sample Collected By</Text>
                      <TextInput
                        style={styles.input}
                        value={sample.collectedBy}
                        onChangeText={(text) => updateSample(sample.id, 'collectedBy', text)}
                        placeholder="Enter collector name"
                        placeholderTextColor="#94a3b8"
                      /> */}
                      <DropdownPicker
                        label="Sample Collected By"
                        items={[
                            {label: 'Select', value: ''},
                            {label: '37.5mm', value: '37.5mm'},
                            {label: '26.5mm', value: '26.5mm'},
                            {label: '19mm', value: '19mm'},
                            {label: '13.2mm', value: '13.2mm'},
                        ]}
                        value={sample.collectedBy}
                        onChange={(text) => updateSample(sample.id, 'collectedBy', text)}
                        />
                  </View>
                ))}

                <TouchableOpacity style={styles.addButton} onPress={addSample}>
                  <Text style={styles.addButtonText}>+ Add More Sample</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    minHeight: '85%',
    maxHeight: '85%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#bfdbfe',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 22,
  },
  closeButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    
  },
  viewScrollContainer: {
    flex: 1,
    paddingBottom: 15
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 18,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    fontSize: 12,
    color: '#2c2c2c',
    position: 'relative',
    height: 42,
    paddingLeft: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  switchLabelActive: {
    color: '#1e293b',
    fontWeight: '600',
  },
  dateInputContainer: {
    position: 'relative',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});