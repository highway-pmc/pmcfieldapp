import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  NativeEventEmitter,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

// --- UI Components ---
import CustomSelectDropdown from '../Common/CustomSelectDropdown';
import CalendarPicker from '../../components/UI/CalenderPicker';
import TimePicker from '../../components/UI/TimePicker';
import Input from '../../components/UI/Input';
import LoadingAnimation from '../Common/LoadingAnimation';

// --- Context & Actions ---
import {useSnackbar} from '../../context/SnackbarContext';
import {
  getQualityMasterList,
  getMixDesignFormInfo,
  saveMixDesignFormInfo,
  clearRFITasksEvent,
  getMixDesignList,
} from '../RFIs/actions';

// --- Constants & Utilities ---
import {
  HeaderItems,
  MIX_DESIGN_DETAILS_DATA,
  SAMPLE_BY_LIST,
  TEST_CONDUCTED_BY_LIST,
} from '../../constants/constants';
import {getDbDateFromDDMMYYYY} from '../../utils/Utils';
import DropdownPicker from '../../components/UI/DropdownPicker';

// --- Component ---
const MixDesign = ({navigation}: {navigation: any}) => {
  const {showSnackbar} = useSnackbar();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  // --- Redux State ---
  const {
    savedMixDesignFormInfo,
    mixDesignListData,
    qualityMixDesignFormInfo,
    loading,
    error,
  } = useSelector((state: any) => state.RFIs);
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  // --- Component State ---
  const [mixDesignShortName, setMixDesignShortName] = useState('');
  const [dateOfSampling, setDateOfSampling] = useState('');
  const [timeOfSampling, setTimeOfSampling] = useState('');
  const [sampleBy, setSampleBy] = useState('Concessionaire');
  const [mixDesignConductedBy, setMixDesignConductedBy] =
    useState('Concessionaire');
  const [totalQty, setTotalQty] = useState('');
  const [recommend, setRecommend] = useState('');

  const [selectedWorkCategory, setSelectedWorkCategory] = useState<any>(null);
  const [selectedMaterialType, setSelectedMaterialType] = useState<any>(null);
  const [selectedMaterialCategory, setSelectedMaterialCategory] =
    useState<any>('');
  const [mixDesignDetails, setMixDesignDetails] = useState<any>({});

  const [materialsData, setMaterialsData] = useState<any[]>([]);

  // --- Effects ---

  // Set header title on focus
  if (isFocused) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.mixDesignInfo);
  }

  // Initial data load and form reset on focus
  useEffect(() => {
    if (isFocused) {
      dispatch(clearRFITasksEvent());
      dispatch(getQualityMasterList({testType: 'mix-design'}));
      dispatch(getMixDesignList({projectId: loggedInUser.projectId, testType: 'mix-design'}));
      console.log('sdsaeda', mixDesignListData)
      // Reset all state variables
      setMixDesignShortName('');
      setDateOfSampling('');
      setTimeOfSampling('');
      setSampleBy('Concessionaire');
      setMixDesignConductedBy('Concessionaire');
      setTotalQty('');
      setRecommend('');
      setSelectedWorkCategory(null);
      setSelectedMaterialType(null);
      setSelectedMaterialCategory('');
      setMaterialsData([]);
    }
  }, [isFocused, dispatch]);

  // Handle API responses
  useEffect(() => {
    if (savedMixDesignFormInfo) {
      showSnackbar('Mix Design saved successfully!', 'success');
      navigation.navigate('MixDesignListing');
    }
    if (error) {
      showSnackbar(error.message || 'Unable to save Mix Design data.', 'error');
    }
  }, [savedMixDesignFormInfo, navigation, error]);

  // Populate materials list when form info is fetched
  useEffect(() => {
    if (qualityMixDesignFormInfo) {
      const initializedMaterials = qualityMixDesignFormInfo.map(
        (item: any) => ({
          ...item,
          selectedSource: null,
          qty: '',
        }),
      );
      setMaterialsData(initializedMaterials);
    }
  }, [qualityMixDesignFormInfo]);

  // --- Handlers ---

  const handleFetchFormInfo = (workCategory: any, materialType: any) => {
    if (workCategory?.type && materialType?._id) {
      dispatch(
        getMixDesignFormInfo({
          projectId: loggedInUser.projectId,
          testWorkCategoryType: workCategory.type,
          testMaterialId: materialType._id,
        }),
      );
    }
  };

  const handleWorkCategorySelect = (selectedOption: any) => {
    setSelectedWorkCategory(selectedOption);
    console.log('98734982374', selectedWorkCategory)
    setSelectedMaterialType(null);
    setSelectedMaterialCategory('');
    setMaterialsData([]);
  };

  const handleMaterialTypeSelect = (selectedOption: any) => {
    setSelectedMaterialType(selectedOption);
    setSelectedMaterialCategory('');
    setMaterialsData([]);
    console.log('Selected Work Category:', selectedWorkCategory);
    console.log('Selected Material Type:', selectedOption);
    handleFetchFormInfo(selectedWorkCategory, selectedOption);
  };

  const handleMaterialItemChange = (
    index: number,
    field: string,
    value: any,
  ) => {
    const updatedMaterials = [...materialsData];
    updatedMaterials[index][field] = value;
    setMaterialsData(updatedMaterials);
  };

  const handleMixDesignDetailsChange = (field: string, value: any) => {
    setMixDesignDetails((prev: any) => ({...prev, [field]: value}));
  };

  const validateMixDesignDetails = () => {
    const details = MIX_DESIGN_DETAILS_DATA.filter(
      item =>
        item.workCategory === selectedWorkCategory?.type &&
        item.materialName === selectedMaterialType?.name?.toLowerCase(),
    );

    for (const detail of details) {
      const value = mixDesignDetails[detail.variableName];
      if (value === undefined || value === '') {
        showSnackbar(`Please enter a value for ${detail.displayName}.`, 'error');
        return false;
      }

      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        showSnackbar(`${detail.displayName} must be a number.`, 'error');
        return false;
      }

      const { constraints } = detail;
      if (constraints.min !== undefined && numericValue <= constraints.min) {
        showSnackbar(`${detail.displayName} must be greater than ${constraints.min}.`, 'error');
        return false;
      }

      if (constraints.max !== undefined && numericValue > constraints.max) {
        showSnackbar(`${detail.displayName} must be less than or equal to ${constraints.max}.`, 'error');
        return false;
      }

      if (constraints.decimal !== undefined) {
        const decimalPart = (value.split('.')[1] || '').length;
        if (decimalPart > constraints.decimal) {
          showSnackbar(`${detail.displayName} can have at most ${constraints.decimal} decimal places.`, 'error');
          return false;
        }
      }
    }

    return true;
  };

  const onSubmit = () => {
    // --- Validation ---
    if (!mixDesignShortName.trim()) {
      showSnackbar('Please enter a Mix Design Short Name.', 'error');
      return;
    }
    if (
      !selectedWorkCategory ||
      !selectedMaterialType ||
      (selectedMaterialType?.category && selectedMaterialType?.category.length) ? !selectedMaterialCategory : false
    ) {
      showSnackbar('Please complete all Mix Design details.', 'error');
      return;
    }
    if (!dateOfSampling || !timeOfSampling) {
      showSnackbar(
        'Please provide the full date and time of sampling.',
        'error',
      );
      return;
    }
    if (!totalQty) {
      showSnackbar('Please enter the total quantity.', 'error');
      return;
    }

    if (!validateMixDesignDetails()) {
        return;
    }

    // --- Payload Preparation ---
    const finalMaterialsData = materialsData.map(item => ({
      _id: item._id,
      materialType: item.materialType,
      materialUnit: item.materialUnit,
      materialCategory: item.selectedMaterialCategory,
      name: item.name,
      selectedSource: item.selectedSource
        ? {_id: item.selectedSource._id, name: item.selectedSource.name}
        : null,
      qty: item.qty ? Number(item.qty) : 0,
    }));

    const payload = {
      projectId: loggedInUser.projectId,
      testWorkCategoryType: selectedWorkCategory?.type,
      testMaterialId: selectedMaterialType?._id,
      
      body: {
        name: mixDesignShortName,
        shortName:mixDesignShortName,
        totalMixDesignQty: Number(totalQty),
        comments: recommend,
        testMaterialType: selectedMaterialType?.materialType,
        materialCategory: selectedMaterialCategory,
        materialUnit: selectedMaterialType?.materialUnit,
        dateOfSampling: `${getDbDateFromDDMMYYYY(dateOfSampling)} ${timeOfSampling}`,
        timeOfSampling: timeOfSampling,
        sampleBy: sampleBy,
        conductedBy: mixDesignConductedBy,
        mixDesignData: {
          materialsData: finalMaterialsData,
          mixDesignDetails: mixDesignDetails,
        },
      },
    };

    console.log('payload', payload, finalMaterialsData)

    dispatch(saveMixDesignFormInfo(payload));
  };

  // --- Render Methods ---

  const renderMixDesignDetails = () => {
    const details = MIX_DESIGN_DETAILS_DATA.filter(
      item =>
        item.workCategory === selectedWorkCategory?.type &&
        item.materialName === selectedMaterialType?.name?.toLowerCase(),
    );

    if (details.length === 0) {
      return null;
    }

    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mix Design Specification</Text>
        {details.map(item => (
          <Input
            key={item.variableName}
            label={item.displayName}
            value={mixDesignDetails[item.variableName] || ''}
            onChange={(value: string) =>
              handleMixDesignDetailsChange(item.variableName, value)
            }
            keyboardType="numeric"
            placeholder={item.placeholder}
          />
        ))}
      </View>
    );
  };

  const renderMaterialsTable = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Material Composition</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, {width: 150}]}>
              Description of Material
            </Text>
            <Text style={[styles.tableHeader, {width: 150}]}>
              Material Category
            </Text>
            <Text style={[styles.tableHeader, {width: 200}]}>
              Source of Material
            </Text>
            <Text style={[styles.tableHeader, {width: 100}]}>Unit</Text>
            <Text style={[styles.tableHeader, {width: 120}]}>Quantity</Text>
          </View>

          {/* Table Body */}
          {materialsData.map((item, index) => (
            <View key={item._id || index} style={styles.tableRow}>
              <Text style={[styles.tableCell, {width: 150}]}>{item.name}</Text>
              <Text style={[styles.tableCell, {width: 150}]}>
                {item.category && item.category.length ?
                  <CustomSelectDropdown
                    label=""
                    data={item.category}
                    selectedValue={item.selectedMaterialCategory}
                    itemTypeOf="string"
                    onSelect={(selectedItem: any) =>
                      handleMaterialItemChange(
                        index,
                        'selectedMaterialCategory',
                        selectedItem,
                      )
                    }
                  />
                  : 'N/A'}
              </Text>
              <View style={{width: 200, paddingHorizontal: 5}}>
                <CustomSelectDropdown
                  label=""
                  data={item.sourceApprovals}
                  selectedValue={item.selectedSource}
                  onSelect={(selectedItem: any) =>
                    handleMaterialItemChange(
                      index,
                      'selectedSource',
                      selectedItem,
                    )
                  }
                />
              </View>
              <Text style={[styles.tableCell, {width: 100}]}>
                {item.materialUnit || 'N/A'}
              </Text>
              <View style={{width: 120, paddingHorizontal: 5}}>
                <Input
                  label=""
                  value={item.qty}
                  onChange={(value: string) =>
                    handleMaterialItemChange(index, 'qty', value)
                  }
                  keyboardType="numeric"
                  placeholder="e.g., 150.5"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sampling Information</Text>
          <View style={{flex: 1}}>
            <CalendarPicker
              label="Date of Sampling"
              value={dateOfSampling}
              onChange={setDateOfSampling}
            />
          </View>
          <View style={{flex: 1}}>
            <TimePicker
              label="Time of Sampling"
              value={timeOfSampling}
              onChange={setTimeOfSampling}
            />
          </View>

          <DropdownPicker
            label="Sampled By"
            items={SAMPLE_BY_LIST}
            value={sampleBy}
            onChange={setSampleBy}
            isRequired
          />
          <DropdownPicker
            label="Conducted By"
            items={TEST_CONDUCTED_BY_LIST}
            value={mixDesignConductedBy}
            onChange={setMixDesignConductedBy}
            isRequired
          />

          <Text style={styles.sectionTitle}>Mix Design Details</Text>
          <Input
            label="Mix Design Short Name"
            value={mixDesignShortName}
            onChange={setMixDesignShortName}
            maxLength={50}
            isRequired
          />
          {/* <Input
            label="Mix Design Name"
            value={mixDesignShortName}
            onChange={setMixDesignShortName}
            maxLength={50}
            isRequired
          /> */}
          <CustomSelectDropdown
            label="Work Category"
            data={mixDesignListData?.testWorkCategoriesData}
            selectedValue={selectedWorkCategory}
            onSelect={handleWorkCategorySelect}
          />
          <CustomSelectDropdown
            label="Material Type"
            data={selectedWorkCategory?.materialsData}
            selectedValue={selectedMaterialType}
            onSelect={handleMaterialTypeSelect}
          />
          {selectedMaterialType?.category && selectedMaterialType?.category.length ?
            <CustomSelectDropdown
              label="Material Category"
              data={selectedMaterialType?.category}
              selectedValue={selectedMaterialCategory}
              itemTypeOf="string"
              onSelect={setSelectedMaterialCategory}
            />
            : <View style={styles.formGroup}>
                <Text style={styles.label}>Material Category</Text>
                <Text style={styles.textDisplay}>
                  N/A
                </Text>
              </View>
            }
          <View style={styles.formGroup}>
            <Text style={styles.label}>Unit</Text>
            <Text style={styles.textDisplay}>
              {selectedMaterialType?.materialUnit || ''}
            </Text>
          </View>
          <Input
            label={`Total Qty of ${
              selectedMaterialType?.name || 'Material'
            } Considered (in Kg)`}
            value={totalQty}
            onChange={setTotalQty}
            keyboardType="numeric"
            placeholder=">0, up to 3 decimal places"
            isRequired
          />


          {materialsData.length > 0 && renderMaterialsTable()}
          {renderMixDesignDetails()}


          <Text style={styles.sectionTitle}>Recommendation</Text>
          <Input
            label=""
            value={recommend}
            onChange={setRecommend}
            multiline
            numberOfLines={4}
            placeholder="Enter recommendations..."
          />

        </View>
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitButtonText}>Submit Mix Design</Text>
        </TouchableOpacity>
      </ScrollView>
      <LoadingAnimation loading={loading} />
    </KeyboardAvoidingView>
  );
};

// --- Styles ---
const COLORS = {
  primary: '#5EAB4B',
  background: '#F4F7FC',
  card: '#FFFFFF',
  text: '#333333',
  textLight: '#777777',
  border: '#E0E0E0',
  headerBg: '#F8F9FA',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  textDisplay: {
    fontSize: 12,
    color: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // --- Table Styles ---
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: 5,
  },
  tableCell: {
    fontSize: 14,
    color: COLORS.textLight,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  // --- Submit Button ---
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MixDesign;
