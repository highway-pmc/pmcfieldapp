// GroutingForm.js
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CalendarPicker from './UI/calenderPicker';
import TimePicker from './UI/TimePicker';
import {useSnackbar} from '../context/snackbarContext';
import Input from './UI/Input';

type FormState = {
  projectName: string;
  clientName: string;
  engineerName: string;
  concessionaireName: string;
  contractorName: string;
  inspectionDate: string;
  inspectionBy: string;
  projectModuleName: string;
  segmentName: string;
  componentName: string;
  subComponentName: string;
  rfiReferenceNumber: string;
  inletFree: string;
  outletFree: string;
  ventsFree: string;
  cableDuctFree: string;
  leakageObserved: string;
  sealed: string;
  remedialMeasures: string;
  prestressingDate: string;
  groutingDate: string;
  cementType: string;
  wcRatio: string;
  mixingWaterTemp: string;
  groutTemp: string;
  startTime: string;
  finishTime: string;
  volumeOfGrout: string;
  groutingPressure: string;
  cementConsumptionTheoretical: string;
  cementConsumptionActual: string;
  passageThroughVents: string;
  passageThroughOutlet: string;
  equipmentFailure: string;
  probingByStiffwire: string;
  recommendations: string;
  rfiRecommendedBy: string;
  rfiApprovedBy: string;
  reportGeneratedBy: string;
  reportGeneratedOn: string;
};

const GroutingForm = () => {
  const {showSnackbar} = useSnackbar();
  const [form, setForm] = useState<FormState>({
    projectName: '',
    clientName: '',
    engineerName: '',
    concessionaireName: '',
    contractorName: '',
    inspectionDate: '',
    inspectionBy: '',
    projectModuleName: '',
    segmentName: '',
    componentName: '',
    subComponentName: '',
    rfiReferenceNumber: '',
    inletFree: '',
    outletFree: '',
    ventsFree: '',
    cableDuctFree: '',
    leakageObserved: '',
    sealed: '',
    remedialMeasures: '',
    prestressingDate: '',
    groutingDate: '',
    cementType: '',
    wcRatio: '',
    mixingWaterTemp: '',
    groutTemp: '',
    startTime: '',
    finishTime: '',
    volumeOfGrout: '',
    groutingPressure: '',
    cementConsumptionTheoretical: '',
    cementConsumptionActual: '',
    passageThroughVents: '',
    passageThroughOutlet: '',
    equipmentFailure: '',
    probingByStiffwire: '',
    recommendations: '',
    rfiRecommendedBy: '',
    rfiApprovedBy: '',
    reportGeneratedBy: '',
    reportGeneratedOn: '',
  });

  const handleInputChange = (name: keyof FormState, value: string) => {
    setForm({...form, [name]: value});
  };

  const handleSubmit = () => {
    console.log('Form Submitted', form);
    showSnackbar('Updated Successfully', 'success', 'done'); // Show success snackbar
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>General Information</Text>
      <Input
        label="Project Name"
        value={form.projectName}
        onChange={(value: string) => handleInputChange('projectName', value)}
        isRequired={true}
      />
      <Input
        label="Client Name"
        value={form.clientName}
        onChange={(value: string) => handleInputChange('clientName', value)}
        isRequired={true}
      />
      <Input
        label="Independent Engineer/Authority Engineer"
        value={form.engineerName}
        onChange={(value: string) => handleInputChange('engineerName', value)}
        isRequired={true}
      />
      <Input
        label="Concessionaire Name"
        value={form.concessionaireName}
        onChange={(value: string) =>
          handleInputChange('concessionaireName', value)
        }
        isRequired={true}
      />
      <Input
        label="EPC Contractor Name"
        value={form.contractorName}
        onChange={(value: string) => handleInputChange('contractorName', value)}
        isRequired={true}
      />
      <CalendarPicker
        label="Date of Inspection"
        value={form.inspectionDate}
        onChange={date => handleInputChange('inspectionDate', date)}
      />
      <Input
        label="Inspection Conducted By"
        value={form.inspectionBy}
        onChange={(value: string) => handleInputChange('inspectionBy', value)}
        isRequired={true}
      />

      <Text style={styles.header}>Other Information</Text>
      <Input
        label="Project Module Name"
        value={form.projectModuleName}
        onChange={(value: string) =>
          handleInputChange('projectModuleName', value)
        }
        isRequired={true}
      />
      <Input
        label="Segment Name"
        value={form.segmentName}
        onChange={(value: string) => handleInputChange('segmentName', value)}
        isRequired={true}
      />
      <Input
        label="Component Name"
        value={form.componentName}
        onChange={(value: string) => handleInputChange('componentName', value)}
        isRequired={true}
      />
      <Input
        label="Sub-Component Name"
        value={form.subComponentName}
        onChange={(value: string) =>
          handleInputChange('subComponentName', value)
        }
        isRequired={true}
      />
      <Input
        label="RFI Reference Number"
        value={form.rfiReferenceNumber}
        onChange={(value: string) =>
          handleInputChange('rfiReferenceNumber', value)
        }
        isRequired={true}
      />

      <Text style={styles.header}>Observations: Pre grouting checks</Text>
      {renderPicker('Inlet free of blockage', 'inletFree')}
      {renderPicker('Outlet free of blockage', 'outletFree')}
      {renderPicker('Vents free of blockage', 'ventsFree')}
      {renderPicker('Cable Duct free of blockage', 'cableDuctFree')}
      {renderPicker('Leakage observed', 'leakageObserved')}
      {renderPicker('Sealed', 'sealed')}
      {renderPicker(
        'If cable duct blocked remedial measures taken',
        'remedialMeasures',
      )}

      <Text style={styles.header}>Details of Grouting</Text>
      <CalendarPicker
        label="Last Date of prestressing"
        value={form.prestressingDate}
        onChange={date => handleInputChange('prestressingDate', date)}
      />
      <CalendarPicker
        label="Date of Grouting"
        value={form.groutingDate}
        onChange={date => handleInputChange('groutingDate', date)}
      />
      {renderPicker('Type of cement', 'cementType', ['OPC', 'II ISOPC'])}
      <Input
        label="W/c Ratio"
        value={form.wcRatio}
        onChange={(value: string) => handleInputChange('wcRatio', value)}
        isRequired={true}
      />
      <Input
        label="Temperature of mixing water (°C)"
        value={form.mixingWaterTemp}
        onChange={(value: string) =>
          handleInputChange('mixingWaterTemp', value)
        }
        isRequired={true}
      />
      <Input
        label="Temperature of Grout (°C)"
        value={form.groutTemp}
        onChange={(value: string) => handleInputChange('groutTemp', value)}
        isRequired={true}
      />
      <TimePicker
        label="Start Time"
        value={form.startTime}
        onChange={time => handleInputChange('startTime', time)}
      />
      <TimePicker
        label="Finish Time"
        value={form.finishTime}
        onChange={time => handleInputChange('finishTime', time)}
      />
      <Input
        label="Volume of Grout (Ltr)"
        value={form.volumeOfGrout}
        onChange={(value: string) => handleInputChange('volumeOfGrout', value)}
        isRequired={true}
      />
      <Input
        label="Grouting Pressure (Kg/cm²)"
        value={form.groutingPressure}
        onChange={(value: string) =>
          handleInputChange('groutingPressure', value)
        }
        isRequired={true}
      />
      <Input
        label="Cement consumption theoretical"
        value={form.cementConsumptionTheoretical}
        onChange={(value: string) =>
          handleInputChange('cementConsumptionTheoretical', value)
        }
        isRequired={true}
      />
      <Input
        label="Cement consumption actual"
        value={form.cementConsumptionActual}
        onChange={(value: string) =>
          handleInputChange('cementConsumptionActual', value)
        }
        isRequired={true}
      />
      {renderPicker('Passage of grout through vents', 'passageThroughVents')}
      {renderPicker('Passage of grout through outlet', 'passageThroughOutlet')}
      {renderPicker('Any equipment failure', 'equipmentFailure')}
      {renderPicker('Probing by Stiffwire', 'probingByStiffwire')}
      <Input
        label="Recommendations"
        value={form.recommendations}
        onChange={(value: string) =>
          handleInputChange('recommendations', value)
        }
        isRequired={true}
        multiline={true}
      />

      <Text style={styles.header}>RFI</Text>
      <Input
        label="RFI Recommended By"
        value={form.rfiRecommendedBy}
        onChange={(value: string) =>
          handleInputChange('rfiRecommendedBy', value)
        }
        isRequired={true}
      />
      <Input
        label="RFI Approved By"
        value={form.rfiApprovedBy}
        onChange={(value: string) => handleInputChange('rfiApprovedBy', value)}
        isRequired={true}
      />
      <Input
        label="Report Generated By"
        value={form.reportGeneratedBy}
        onChange={(value: string) =>
          handleInputChange('reportGeneratedBy', value)
        }
        isRequired={true}
      />
      <CalendarPicker
        label="Report Generated On"
        value={form.reportGeneratedOn}
        onChange={date => handleInputChange('reportGeneratedOn', date)}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  function renderPicker(
    label: string,
    name: keyof FormState,
    options = ['Y', 'N', 'NA'],
  ) {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form[name]}
            style={styles.picker}
            onValueChange={itemValue => handleInputChange(name, itemValue)}>
            {options.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroutingForm;
