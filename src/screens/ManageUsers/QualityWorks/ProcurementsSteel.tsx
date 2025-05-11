import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  NativeEventEmitter,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {useSnackbar} from '../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../../components/UI/Input';
import {useIsFocused} from '@react-navigation/native';
import {
  BEARING_TYPE_LIST,
  CONCRETE_GRADE_LIST,
  DIAMETER_REINFORCEMENT,
  GRADE_REINFORCEMENT,
  GRADE_STRUCTURE_STEEL,
  HeaderItems,
  SOURCE_APPROVAL_STATUS,
  TEST_MATERIALS_TYPES,
} from '../../../constants/constants';
import {Image} from 'react-native-elements';
import LoadingAnimation from '../../Common/LoadingAnimation';
import {Picker} from '@react-native-picker/picker';
import CalendarPicker from '../../../components/UI/CalenderPicker';
import {
  addProcurement,
  clearProcurements,
  deleteProcurement,
  getProcurements,
  getSourceApprovalsByStatus,
  updateProcurement,
} from '../actions';
import CustomAlert from '../../Common/CustomAlert';
import {
  getDbDate,
  getDbDateFromDDMMYYYY,
  getDisplayDate,
} from '../../../utils/Utils';
import DocumentPicker from 'react-native-document-picker';
import appConfig from '../../../common/app.config';
import DropdownPicker from '../../../components/UI/DropdownPicker';

const ProcurementsSteel = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {
    testWorkCategoryName,
    testWorkCategoryType,
    testMaterialName,
    materialType,
    testMaterialId,
  } = route.params;
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    procurements,
    addedProcurement,
    updatedProcurement,
    deletedProcurement,
    loading,
    error,
  } = useSelector((state: any) => state.Procurements);
  const {sourceApprovalsByStatus} = useSelector(
    (state: any) => state.SourceApprovals,
  );
  const [openProcurementsPopup, setOpenProcurementPopup] = useState(false);
  const [selectedProcurement, setSelectedProcurement]: any = useState(null);
  const [confirmationAlert, setConfirmationAlert] = useState(false);
  const [gradeField, setGradeField]: any = useState({});

  const [vehicleNos, setVehicleNos]: any = useState([]);
  //use state for Steel
  const [formSoil, setFormSoil]: any = useState({
    sourceApprovalId: '',
    sourceApprovalDetailId: '',
    procurementDateTime: '',
    vehicleNo: [],
    vehicleNoTemp: '',
    qtyInTonne: '',
    invoiceFile: '',
    lotNo: '',
    grade: 'MS',
  });
  const [steelRForm, setSteelRForm]: any = useState({
    sourceApprovalId: '',
    sourceApprovalDetailId: '',
    procurementDateTime: '',
    vehicleNo: [],
    diameter: '',
    vehicleNoTemp: '',
    qtyInTonne: '',
    invoiceFile: '',
    lotNo: '',
    grade: 'Fe 415',
  });

  const [data, setData]: any = useState([]);
  const [sourceApprovals, setSourceApprovals]: any = useState([]);
  const [sourceApprovalDetails, setSourceApprovalDetails] = useState([]);
  const [sourceApprovalsFiltered, setSourceApprovalsFiltered]: any = useState(
    [],
  );
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.procurements);
  }

  const {showSnackbar} = useSnackbar();

  const dispatch = useDispatch();

  useEffect(() => {
    if (procurements) {
      setData(procurements);
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [procurements, error]);

  useEffect(() => {
    if (sourceApprovalsByStatus) {
      setSourceApprovals(sourceApprovalsByStatus);
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [sourceApprovalsByStatus, error]);

  // mount
  useEffect(() => {
    if (materialType === TEST_MATERIALS_TYPES.CONCRETE) {
      setGradeField({
        name: 'gradeOfConcrete',
        label: 'Grade Of Concrete',
      });
    } else if (materialType === TEST_MATERIALS_TYPES.CEMENT) {
      setGradeField({
        name: 'gradeOfCement',
        label: 'Grade Of Cement',
      });
    }
    dispatch(
      getProcurements({
        projectId: loggedInUser.projectId,
        testMaterialId: testMaterialId,
        testWorkCategoryType: testWorkCategoryType,
      }),
    );

    dispatch(
      getSourceApprovalsByStatus({
        projectId: loggedInUser.projectId,
        testMaterialId: testMaterialId,
        status: SOURCE_APPROVAL_STATUS.APPROVED,
      }),
    );
  }, []);

  // unmount
  useEffect(
    () => () => {
      dispatch(clearProcurements());
    },
    [],
  );

  const handleDeleteAddedVehicle = (vehicleNo: any) => {
    const index = vehicleNos.indexOf(vehicleNo);
    if (index != -1) {
      vehicleNos.splice(index, 1);
      setVehicleNos([...vehicleNos]);
      if (materialType === TEST_MATERIALS_TYPES.REINFORCEMENT) {
        setSteelRForm({...steelRForm});
      } else {
        setFormSoil({...formSoil});
      }
    }
  };

  const onAddProcurement = () => {
    setSelectedProcurement(null);
    setSourceApprovalDetails([]);
    setVehicleNos([]);
    if (materialType === TEST_MATERIALS_TYPES.REINFORCEMENT) {
      setSteelRForm({
        sourceApprovalId: '',
        sourceApprovalDetailId: '',
        procurementDateTime: '',
        vehicleNo: [],
        qtyInTonne: '',
        invoiceFile: '',
        lotNo: '',
        diameter: '',
        grade: 'MS',
      });
    } else {
      setFormSoil({
        sourceApprovalId: '',
        sourceApprovalDetailId: '',
        procurementDateTime: '',
        vehicleNo: [],
        qtyInTonne: '',
        invoiceFile: '',
        lotNo: '',
        grade: 'Fe 415',
      });
    }

    setOpenProcurementPopup(true);
  };

  const handleDelete = (item: any) => {
    setSelectedProcurement(item);
    setConfirmationAlert(true);
  };

  const onPressAlertOkButton = () => {
    dispatch(
      deleteProcurement({
        projectId: loggedInUser.projectId,
        testMaterialId: testMaterialId,
        id: selectedProcurement._id,
      }),
    );
  };

  const onPressAlertCancelButton = () => {
    setSelectedProcurement(null);
    setConfirmationAlert(false);
  };

  const handleEdit = (item: any) => {
    setSelectedProcurement(item);
    setSourceApprovalDetails(
      sourceApprovals.find((x: any) => x._id === item.sourceApprovalId._id)
        ?.sourceApprovalDetails,
    );
    setVehicleNos(item.vehicleNo || []);
    if (materialType === TEST_MATERIALS_TYPES.REINFORCEMENT) {
      setSteelRForm({
        sourceApprovalId: item.sourceApprovalId._id,
        sourceApprovalDetailId: item.sourceApprovalDetailId,
        procurementDateTime: getDisplayDate(item.procurementDateTime),
        vehicleNo: item.vehicleNo,
        invoiceFile: item.invoiceFile,
        diameter: item.diameter,
        qtyInTonne: '' + item.qtyInTonne,
        lotNo: item.lotNo,
        grade: item.grade,
      });
    } else {
      setFormSoil({
        sourceApprovalId: item.sourceApprovalId._id,
        sourceApprovalDetailId: item.sourceApprovalDetailId,
        procurementDateTime: getDisplayDate(item.procurementDateTime),
        vehicleNo: item.vehicleNo,
        invoiceFile: item.invoiceFile,
        qtyInTonne: '' + item.qtyInTonne,
        lotNo: item.lotNo,
        grade: item.grade,
      });
    }
    setOpenProcurementPopup(true);
  };
  const validateForm = () => {
    let isValid = true;
    let errorMessage = '';

    // Validate qtyInTonne (>0, up to 3 decimal places, max limit 1000)
    const qtyRegex = /^\d{0,4}(\.\d{1,3})?$/;
    if (materialType === TEST_MATERIALS_TYPES.REINFORCEMENT) {
      if (
        !qtyRegex.test(steelRForm.qtyInTonne) ||
        Number(steelRForm.qtyInTonne) <= 0 ||
        Number(steelRForm.qtyInTonne) > 1000
      ) {
        isValid = false;
        errorMessage =
          'Quantity in Tonne must be greater than 0, up to 3 decimal places, and not exceed 1000.';
      }

      // Validate lotNo (>0, integer, max limit 1000)
      if (
        !/^\d+$/.test(steelRForm.lotNo) ||
        Number(steelRForm.lotNo) <= 0 ||
        Number(steelRForm.lotNo) > 1000
      ) {
        isValid = false;
        errorMessage =
          'Lot Number must be a positive integer and not exceed 1000.';
      }

      // Validate invoiceFile (should be image/pdf)
      if (
        steelRForm.invoiceFile &&
        !/\.(jpg|jpeg|png|pdf)$/i.test(steelRForm.invoiceFile.name)
      ) {
        isValid = false;
        errorMessage =
          'Only JPG, PNG, or PDF files are allowed for the invoice.';
      }
    } else {
      if (
        !qtyRegex.test(formSoil.qtyInTonne) ||
        Number(formSoil.qtyInTonne) <= 0 ||
        Number(formSoil.qtyInTonne) > 1000
      ) {
        isValid = false;
        errorMessage =
          'Quantity in Tonne must be greater than 0, up to 3 decimal places, and not exceed 1000.';
      }

      // Validate lotNo (>0, integer, max limit 1000)
      if (
        !/^\d+$/.test(formSoil.lotNo) ||
        Number(formSoil.lotNo) <= 0 ||
        Number(formSoil.lotNo) > 1000
      ) {
        isValid = false;
        errorMessage =
          'Lot Number must be a positive integer and not exceed 1000.';
      }

      // Validate invoiceFile (should be image/pdf)
      if (
        formSoil.invoiceFile &&
        !/\.(jpg|jpeg|png|pdf)$/i.test(formSoil.invoiceFile.name)
      ) {
        isValid = false;
        errorMessage =
          'Only JPG, PNG, or PDF files are allowed for the invoice.';
      }
    }

    if (!isValid) {
      showSnackbar(errorMessage, 'error');
    }

    return isValid;
  };

  const handleInputChange = (name: string, value: string | number | []) => {
    let isValid = true;
    let errorMessage = '';
    if (materialType === TEST_MATERIALS_TYPES.REINFORCEMENT) {
      setSteelRForm({...steelRForm, [name]: value});
    } else {
      setFormSoil({...formSoil, [name]: value});
    }

    if (name === 'sourceApprovalId') {
      setSourceApprovalDetails(
        sourceApprovals.find((x: any) => x._id === value)
          ?.sourceApprovalDetails,
      );
    } else if (name === 'grade') {
      const filteredData = sourceApprovals.filter(
        (s: any) =>
          s.sourceApprovalDetails &&
          s.sourceApprovalDetails.find(
            (sd: any) => sd.metaData && sd.metaData[name] === value,
          ),
      );
      setSourceApprovalsFiltered(filteredData);
    }
    if (!isValid) {
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    let procurementData = {};
    if (materialType === TEST_MATERIALS_TYPES.REINFORCEMENT) {
      procurementData = {
        sourceApprovalId: steelRForm.sourceApprovalId,
        sourceApprovalDetailId: steelRForm.sourceApprovalDetailId,
        procurementDateTime: getDbDateFromDDMMYYYY(
          steelRForm.procurementDateTime,
        ),
        vehicleNo: vehicleNos.length
          ? vehicleNos
          : [steelRForm.vehicleNo || ''],
        invoiceFile: steelRForm.invoiceFile,
        lotNo: steelRForm.lotNo,
        metaData: {
          qtyInTonne: Number(steelRForm.qtyInTonne),
          grade: steelRForm.grade,
          diameter: steelRForm.diameter,
        },
      };
    } else {
      procurementData = {
        sourceApprovalId: formSoil.sourceApprovalId,
        sourceApprovalDetailId: formSoil.sourceApprovalDetailId,
        procurementDateTime: getDbDateFromDDMMYYYY(
          formSoil.procurementDateTime,
        ),
        vehicleNo: vehicleNos.length ? vehicleNos : [formSoil.vehicleNo || ''],
        invoiceFile: formSoil.invoiceFile,
        lotNo: formSoil.lotNo,
        metaData: {
          qtyInTonne: Number(formSoil.qtyInTonne),
          grade: formSoil.grade,
        },
      };
    }

    if (!selectedProcurement) {
      dispatch(
        addProcurement({
          projectId: loggedInUser.projectId,
          testMaterialId: testMaterialId,
          testWorkCategoryType: testWorkCategoryType,
          body: procurementData,
        }),
      );
    } else {
      dispatch(
        updateProcurement({
          projectId: loggedInUser.projectId,
          testMaterialId: testMaterialId,
          testWorkCategoryType: testWorkCategoryType,
          id: selectedProcurement._id,
          body: procurementData,
        }),
      );
    }
  };

  useEffect(() => {
    if (addedProcurement) {
      setOpenProcurementPopup(false);
      showSnackbar('Procurement Added Successfully', 'success'); // Show success snackbar
      dispatch(
        getProcurements({
          projectId: loggedInUser.projectId,
          testMaterialId: testMaterialId,
          testWorkCategoryType: testWorkCategoryType,
        }),
      );
      uploadInvoice();
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [addedProcurement, error]);

  useEffect(() => {
    if (updatedProcurement) {
      setOpenProcurementPopup(false);
      showSnackbar('Procurement Updated Successfully', 'success'); // Show success snackbar
      dispatch(
        getProcurements({
          projectId: loggedInUser.projectId,
          testMaterialId: testMaterialId,
          testWorkCategoryType: testWorkCategoryType,
        }),
      );
      uploadInvoice();
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [updatedProcurement, error]);

  useEffect(() => {
    if (deletedProcurement) {
      showSnackbar('Procurement Deleted Successfully', 'success'); // Show success snackbar
      dispatch(
        getProcurements({
          projectId: loggedInUser.projectId,
          testMaterialId: testMaterialId,
          testWorkCategoryType: testWorkCategoryType,
        }),
      );
      onPressAlertCancelButton();
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [deletedProcurement, error]);

  const onAddVehicle = () => {
    const vehicleNoTemp =
      materialType === TEST_MATERIALS_TYPES.REINFORCEMENT
        ? steelRForm.vehicleNoTemp.trim()
        : formSoil.vehicleNoTemp.trim();
    const vehicleNoRegex = /^\d{4}$/;
    if (vehicleNoTemp && vehicleNoRegex.test(vehicleNoTemp)) {
      if (!vehicleNos) {
        setVehicleNos([]);
      }

      const index = vehicleNos.indexOf(vehicleNoTemp);
      if (index === -1) {
        vehicleNos.push(vehicleNoTemp);
        formSoil.vehicleNoTemp = '';
        setVehicleNos([...vehicleNos]);
        if (materialType === TEST_MATERIALS_TYPES.REINFORCEMENT) {
          setSteelRForm({...steelRForm});
        } else {
          setFormSoil({...formSoil});
        }
      }
    } else {
      // Show an error message using Snackbar or any other method
      showSnackbar('Vehicle number must be exactly 4 digits.', 'error');
    }
  };

  const [fileRes, setFileRes]: any = useState(null);

  const onDocumentPress = async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      const res = result[0];
      console.log('==res===', res);
      setFileRes(res);
    } catch (err) {
      console.log('======err2===', err);
      if (DocumentPicker.isCancel(err)) {
        showSnackbar('No document selected');
      } else {
        throw err;
      }
    }
  };
  const renderSourceDetailsPickerBearing = (
    label: string,
    field: string,
    options: any = sourceApprovalDetails,
  ) => {
    if (!options.find((option: any) => option._id === '')) {
      options.unshift({name: 'Select', _id: ''});
    }
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formSoil.sourceApprovalId}
            style={styles.picker}
            onValueChange={itemValue => handleInputChange(field, itemValue)}>
            {options.map((option, index) => (
              <Picker.Item key={index} label={option.name} value={option._id} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };
  const uploadInvoice = async () => {
    if (!fileRes) {
      return;
    }
    let urlOfS = `${appConfig.API_URL}/v1/auth/projects/${
      loggedInUser.projectId
    }/procurements/${
      !selectedProcurement ? addedProcurement._id : selectedProcurement._id
    }/upload`;
    if (fileRes.size < 5000000) {
      let data = new FormData();
      data.append('file', fileRes);
      try {
        const responseOfFileUpload = await fetch(urlOfS, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/formSoil-data',
            Authorization: appConfig.getToken(),
          },
          body: data,
        });
        console.log('===responseOfFileUpload====', responseOfFileUpload);
        if (responseOfFileUpload.status == 200) {
          let responseInJs = await responseOfFileUpload.json();
          console.log('===responseInJs====', responseInJs);
          let fileName = responseInJs.data.fileUrl; // file name which will be        sent from backend
          showSnackbar('Upload Succesfull');
          setFileRes(null);
        } else {
          showSnackbar('Upload Failed');
        }
      } catch (err) {
        console.log('========err==', err);
        showSnackbar('Upload Failed');
        console.log(err, 'error in upload');
      }
    } else {
      showSnackbar('File size should not exceed 4 MB');
    }
  };

  const addProcurementsForm = () => {
    if (materialType === TEST_MATERIALS_TYPES.REINFORCEMENT) {
      return (
        <View style={styles.reportFields}>
          <View>
            <View>
              <DropdownPicker
                label="Grade"
                items={GRADE_REINFORCEMENT}
                value={steelRForm.grade}
                onChange={(value: string) => handleInputChange('grade', value)}
              />
            </View>
            <View>
              <DropdownPicker
                label="Diameter"
                items={DIAMETER_REINFORCEMENT}
                value={steelRForm.diameter}
                onChange={(value: string) =>
                  handleInputChange('diameter', value)
                }
              />
            </View>
            <View>
              {renderSourceDetailsPickerBearing(
                'Source Detail',
                'sourceApprovalId',
                sourceApprovalsFiltered,
              )}
            </View>

            <View>
              <Input
                label="Qty (in Tonne)"
                value={'' + steelRForm.qtyInTonne}
                onChange={(value: string) =>
                  handleInputChange('qtyInTonne', value)
                }
                isRequired={true}
              />
            </View>
            <View>
              <CalendarPicker
                label="Date"
                value={steelRForm.procurementDateTime}
                onChange={date =>
                  handleInputChange('procurementDateTime', date)
                }
              />
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  display: 'flex',
                  gap: 10,
                }}>
                <View style={{width: '70%'}}>
                  <Input
                    label="Vehicle no."
                    value={steelRForm.vehicleNoTemp}
                    onChange={(value: string) =>
                      handleInputChange('vehicleNoTemp', value)
                    }
                  />
                </View>
                <View style={{justifyContent: 'center'}}>
                  <TouchableOpacity
                    style={styles.add_vehicle}
                    onPress={onAddVehicle}>
                    <Text style={styles.btnAddVehicle}>Add Vehicle</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{maxHeight: 400}}>
                <ScrollView>
                  <FlatList
                    data={vehicleNos}
                    renderItem={renderAddedVehicleItem}
                    keyExtractor={item => item}
                  />
                </ScrollView>
              </View>
            </View>
            <View>
              <Input
                label="Lot Number"
                value={'' + steelRForm.lotNo}
                onChange={(value: string) => handleInputChange('lotNo', value)}
                isRequired={true}
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.upload_container}
                  onPress={onDocumentPress}>
                  <Text style={styles.uploadBtn}>Upload Invoice</Text>
                </TouchableOpacity>
                {fileRes && <Text>{fileRes.name}</Text>}
              </View>
              {selectedProcurement?.invoiceFile && (
                <Image
                  source={{uri: selectedProcurement.invoiceFile}}
                  style={{width: 300, height: 200}}></Image>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.btnContainer} onPress={handleSubmit}>
            <Text style={styles.submitBtn}>Submit</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.reportFields}>
          <View>
            <View>
              <DropdownPicker
                label="Nominal Size"
                items={GRADE_STRUCTURE_STEEL}
                value={formSoil.grade}
                onChange={(value: string) => handleInputChange('grade', value)}
              />
            </View>
            <View>
              {renderSourceDetailsPickerBearing(
                'Source Detail',
                'sourceApprovalId',
                sourceApprovalsFiltered,
              )}
            </View>
            <View>
              <Input
                label="Qty (in Tonne)"
                value={'' + formSoil.qtyInTonne}
                onChange={(value: string) =>
                  handleInputChange('qtyInTonne', value)
                }
                isRequired={true}
              />
            </View>
            <View>
              <CalendarPicker
                label="Date"
                value={formSoil.procurementDateTime}
                onChange={date =>
                  handleInputChange('procurementDateTime', date)
                }
              />
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  display: 'flex',
                  gap: 10,
                }}>
                <View style={{width: '70%'}}>
                  <Input
                    label="Vehicle no."
                    value={formSoil.vehicleNoTemp}
                    onChange={(value: string) =>
                      handleInputChange('vehicleNoTemp', value)
                    }
                  />
                </View>
                <View style={{justifyContent: 'center'}}>
                  <TouchableOpacity
                    style={styles.add_vehicle}
                    onPress={onAddVehicle}>
                    <Text style={styles.btnAddVehicle}>Add Vehicle</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{maxHeight: 400}}>
                <ScrollView>
                  <FlatList
                    data={vehicleNos}
                    renderItem={renderAddedVehicleItem}
                    keyExtractor={item => item}
                  />
                </ScrollView>
              </View>
            </View>
            <View>
              <Input
                label="Lot Number"
                value={'' + formSoil.lotNo}
                onChange={(value: string) => handleInputChange('lotNo', value)}
                isRequired={true}
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.upload_container}
                  onPress={onDocumentPress}>
                  <Text style={styles.uploadBtn}>Upload Invoice</Text>
                </TouchableOpacity>
                {fileRes && <Text>{fileRes.name}</Text>}
              </View>
              {selectedProcurement?.invoiceFile && (
                <Image
                  source={{uri: selectedProcurement.invoiceFile}}
                  style={{width: 300, height: 200}}></Image>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.btnContainer} onPress={handleSubmit}>
            <Text style={styles.submitBtn}>Submit</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderPicker = (
    label: string,
    name: string,
    options = [{name: 'Select', _id: ''}].concat(sourceApprovals),
  ) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formSoil[name]}
            style={styles.picker}
            onValueChange={itemValue => handleInputChange(name, itemValue)}>
            {options.map((option, index) => (
              <Picker.Item
                key={index}
                label={option['name']}
                value={option['_id']}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const renderSourceDetailsPicker = (
    label: string,
    name: string,
    options = [{name: 'Select', _id: ''}].concat(sourceApprovalDetails),
  ) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formSoil[name]}
            style={styles.picker}
            onValueChange={itemValue => handleInputChange(name, itemValue)}>
            {options.map((option, index) => (
              <Picker.Item
                key={index}
                label={option['name']}
                value={option['_id']}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={[styles.itemContainer]}>
      <Text style={styles.itemText}>{item.sourceApprovalId.name}</Text>
      <View style={styles.iconContainer}>
        <Image
          style={styles.ActionIcon}
          tintColor={'#333'}
          onPress={() => handleEdit(item)}
          source={require('./../../../images/edit.png')}
        />
        <Image
          style={styles.ActionIcon}
          tintColor={'#333'}
          onPress={() => handleDelete(item)}
          source={require('./../../../images/trash.png')}
        />
      </View>
    </View>
  );

  const renderAddedVehicleItem = ({item}: {item: any}) => (
    <View style={styles.itemContainerVehicleList}>
      <Text style={styles.itemText}>{item}</Text>
      <View style={styles.iconContainer}>
        <Image
          style={styles.ActionIcon}
          tintColor={'#333'}
          onPress={() => handleDeleteAddedVehicle(item)}
          source={require('./../../../images/trash.png')}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.reportFields}>
          <View>
            <Text style={styles.AssignRoleText}>
              {testWorkCategoryName + ' > ' + testMaterialName}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => onAddProcurement()}>
              <Text style={styles.submitBtn}>Add/Edit procurement</Text>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </ScrollView>
          </View>
        </View>
      </View>
      {/* Add Source approvals */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={openProcurementsPopup}
        onRequestClose={() => {
          setOpenProcurementPopup(!openProcurementsPopup);
        }}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.AssignRoleText}>Add Procurement</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() =>
                    setOpenProcurementPopup(!openProcurementsPopup)
                  }>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <ScrollView style={{paddingTop: 10, height: '85%'}}>
                  {addProcurementsForm()}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <CustomAlert
        displayAlert={confirmationAlert}
        displayAlertIcon={false}
        alertTitleText={'Confirmation'}
        alertMessageText={'Want to delete?'}
        displayOkButton={true}
        okButtonText={'Ok'}
        displayCancelButton={true}
        cancelButtonText={'Cancel'}
        onPressOkButton={onPressAlertOkButton}
        onPressCancelButton={onPressAlertCancelButton}
      />

      <LoadingAnimation loading={loading}></LoadingAnimation>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  // container: {
  //     flex: 1,
  //     paddingTop: 40,
  //     paddingHorizontal: 20,
  //   },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 2,
    backgroundColor: '#f9f9f9',
  },
  itemContainerVehicleList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 2,
    backgroundColor: '#f9f9f9',
  },
  itemText: {
    fontSize: 14,
    maxWidth: 200,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 110,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  legends: {
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  approve: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#2BC267',
    color: '#fff',
    textAlign: 'center',
  },
  rejected: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#DD0303',
    color: '#fff',
    textAlign: 'center',
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
  legendContainer: {
    display: 'flex',
    gap: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  approveText: {
    color: '#2BC267',
  },
  rejectText: {
    color: '#DD0303',
  },
  centeredView: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 60,
  },
  PopHeader: {},
  modalView: {
    minHeight: 150,
  },
  ModalInnerContainer: {
    paddingHorizontal: 15,
  },
  CloseIcon: {
    width: 30,
    height: 30,
  },
  ActionIcon: {
    width: 20,
    height: 20,
  },
  ModalHeader: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
  },
  buttonClose: {
    position: 'absolute',
    right: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    width: '100%',
  },
  input_field: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    padding: 10,
    minWidth: 'auto',
    height: 44,
  },
  reportFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  width100: {
    '& dropdown': {
      minWidth: '100%',
    },
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15,
  },
  saveBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 25,
    minWidth: 100,
    textAlign: 'center',
  },
  submitBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#5A2AAF',
    minWidth: 100,
    textAlign: 'center',
  },
  upload_container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 25,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
    maxWidth: 300,
  },
  uploadBtn: {
    borderRadius: 33,
    borderWidth: 1,
    borderColor: '#1d7dea',
    color: '#1d7dea',
    paddingVertical: 15,
    paddingHorizontal: 20,
    textAlign: 'center',
    width: '100%',
    margin: 'auto',
  },
  addMoreContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  addMore: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#999',
    padding: 2,
    fontSize: 20,
    fontWeight: '500',
    width: 30,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAddVehicle: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1d7dea',
    color: '#1d7dea',
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    margin: 'auto',
  },
  add_vehicle: {
    borderRadius: 4,
    display: 'flex',
  },
  addmoreInput: {
    width: '90%',
  },
  AssignRoleText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
    marginLeft: 5,
  },
});

export default ProcurementsSteel;
