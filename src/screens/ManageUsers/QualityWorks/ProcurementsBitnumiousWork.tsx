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
  Dimensions,
} from 'react-native';
import {useSnackbar} from '../../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../../components/UI/Input';
import {useIsFocused} from '@react-navigation/native';
import {
  CONCRETE_GRADE_LIST,
  HeaderItems,
  SOURCE_APPROVAL_STATUS,
  TEST_MATERIALS_TYPES,
  TEST_WORK_CATEGORY_TYPES,
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
import commonStyles from '../../Common/commonStyles';

const ProcurementsBitnumiousWork = ({
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
  const [vehicleNoTemp, setVehicleNoTemp]: any = useState([]);

  // use state form for Bituminous work
  // Details_Bitumen Form
  const [detailsBitumen, setDetailsBitumen]: any = useState({
    sourceApprovalId: '',
    sourceApprovalDetailId: '',
    gradeOfBitumen: '', // VG 30 / VG 40 / PMB
    vehicleNo: [],
    qtyInKg: '', // >0, up to 3 decimals, max limit 20
    uploadWeightSlip: '', // Image or PDF
    procurementDateTime: '',
    lotNo: '', // Combination of characters and numbers, max limit 100
  });

  // Details_FineAggregate Form
  const [detailsFineAggregate, setDetailsFineAggregate]: any = useState({
    sourceApprovalId: '',
    sourceApprovalDetailId: '',
    vehicleNo: [],
    qtyInKg: '', // >0, up to 3 decimals, max limit 20
    qtyInCum: '',
    uploadWeightSlip: '', // Image or PDF
    procurementDateTime: '',
    lotNo: '',
  });

  // Details_CoarseAggregate_SMA Form
  const [detailsCoarseAggregateSMA, setDetailsCoarseAggregateSMA]: any =
    useState({
      sourceApprovalId: '',
      sourceApprovalDetailId: '',
      nominalSize: '', // 37.5mm / 26.5mm / 19mm / 13.2mm
      vehicleNo: [],
      qtyInKg: '', // >0, up to 3 decimals, max limit 20
      qtyInCum: '',
      uploadWeightSlip: '', // Image or PDF
      procurementDateTime: '',
      lotNo: '',
    });

  // Details_CoarseAggregate_MicroSurfacing Form
  const [
    detailsCoarseAggregateMicroSurfacing,
    setDetailsCoarseAggregateMicroSurfacing,
  ]: any = useState({
    sourceApprovalId: '',
    sourceApprovalDetailId: '',
    nominalSize: '', // 37.5mm / 26.5mm / 19mm / 13.2mm
    vehicleNo: [], // Last 4 digits, numeric only
    qtyInKg: '', // >0, up to 3 decimals, max limit 20
    qtyInCum: '',
    uploadWeightSlip: '', // Image or PDF
    procurementDateTime: '',
    lotNo: '',
  });

  // Details_CoarseAggregate_DBMBC Form
  const [detailsCoarseAggregateDBMBC, setDetailsCoarseAggregateDBMBC]: any =
    useState({
      sourceApprovalId: '',
      sourceApprovalDetailId: '',
      nominalSize: '', // 37.5mm / 26.5mm / 19mm / 13.2mm
      vehicleNo: [],
      qtyInKg: '', // >0, up to 3 decimals, max limit 20
      qtyInCum: '',
      uploadWeightSlip: '', // Image or PDF
      procurementDateTime: '',
      lotNo: '',
    });

  // Details_Emulsion Form
  const [detailsEmulsion, setDetailsEmulsion]: any = useState({
    sourceApprovalId: '',
    sourceApprovalDetailId: '',
    gradeOfBitumen: '', // Listing as per the source approval sheet
    vehicleNo: [],
    qtyInKg: '', // >0, up to 3 decimals, max limit 20
    uploadWeightSlip: '', // Image or PDF
    lotNo: '',
    procurementDateTime: '',
  });

  const [data, setData]: any = useState([]);

  const [sourceApprovals, setSourceApprovals]: any[] = useState([]);
  const [sourceApprovalsFiltered, setSourceApprovalsFiltered]: any = useState(
    [],
  );
  const [sourceApprovalDetails, setSourceApprovalDetails] = useState([]);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.procurements);
  }

  const {showSnackbar} = useSnackbar();

  const dispatch = useDispatch();
  const { height } = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const calculatedFlatListHeight = height * 0.72;

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
      //setForm({...form});
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          setDetailsFineAggregate({
            ...detailsFineAggregate,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          setDetailsCoarseAggregateDBMBC({
            ...detailsCoarseAggregateDBMBC,
          });
          break;

        case TEST_MATERIALS_TYPES.BITUMEN:
          setDetailsBitumen({
            ...detailsBitumen,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          setDetailsCoarseAggregateMicroSurfacing({
            ...detailsCoarseAggregateMicroSurfacing,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          setDetailsCoarseAggregateSMA({
            ...detailsCoarseAggregateSMA,
          });
          break;

        case TEST_MATERIALS_TYPES.EMULSION:
          setDetailsEmulsion({
            ...detailsEmulsion,
          });
          break;

        default:
          console.error('Unknown material type for Bituminous Works');
          break;
      }
    }
  };

  const onAddProcurement = () => {
    setSelectedProcurement(null);
    setSourceApprovalDetails([]);
    setVehicleNos([]);
    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          setDetailsFineAggregate({
            sourceApprovalId: '',
            sourceApprovalDetailId: '',
            vehicleNo: [],
            lotNo: '',
            qtyInKg: '',
            qtyInCum: '',
            uploadWeightSlip: '',
            procurementDateTime: '',
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          setDetailsCoarseAggregateDBMBC({
            sourceApprovalId: '',
            sourceApprovalDetailId: '',
            nominalSize: '',
            vehicleNo: [],
            qtyInKg: '',
            qtyInCum: '',
            uploadWeightSlip: '',
            procurementDateTime: '',
            lotNo: '',
          });
          break;

        case TEST_MATERIALS_TYPES.BITUMEN:
          setDetailsBitumen({
            sourceApprovalId: '',
            sourceApprovalDetailId: '',
            gradeOfBitumen: '',
            vehicleNo: [],
            qtyInKg: '',
            uploadWeightSlip: '',
            lotNo: '',
            procurementDateTime: '',
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          setDetailsCoarseAggregateMicroSurfacing({
            sourceApprovalId: '',
            sourceApprovalDetailId: '',
            nominalSize: '',
            vehicleNo: [],
            qtyInKg: '',
            qtyInCum: '',
            uploadWeightSlip: '',
            procurementDateTime: '',
            lotNo: '',
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          setDetailsCoarseAggregateSMA({
            sourceApprovalId: '',
            sourceApprovalDetailId: '',
            nominalSize: '',
            vehicleNo: [],
            qtyInKg: '',
            qtyInCum: '',
            uploadWeightSlip: '',
            procurementDateTime: '',
            lotNo: '',
          });
          break;

        case TEST_MATERIALS_TYPES.EMULSION:
          setDetailsEmulsion({
            sourceApprovalId: '',
            sourceApprovalDetailId: '',
            gradeOfBitumen: '',
            lotNo: '',
            vehicleNo: [],
            qtyInKg: '',
            uploadWeightSlip: '',
            procurementDateTime: '',
          });
          break;

        default:
          console.error('Unknown material type for Bituminous Works');
      }
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

    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      console.log('=====MetaData====', item.metaData.qtyInKg);
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          setDetailsFineAggregate({
            sourceApprovalId: item.sourceApprovalId._id,
            sourceApprovalDetailId: item.sourceApprovalDetailId,
            lotNo: item.lotNo,
            vehicleNo: item.vehicleNo,
            qtyInKg: '' + item.metaData.qtyInKg,
            qtyInCum: '' + item.metaData.qtyInCum,
            uploadWeightSlip: item.uploadWeightSlip,
            procurementDateTime: getDisplayDate(item.procurementDateTime),
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          setDetailsCoarseAggregateDBMBC({
            sourceApprovalId: item.sourceApprovalId._id,
            sourceApprovalDetailId: item.sourceApprovalDetailId,
            nominalSize: item.metaData.nominalSize,
            lotNo: item.lotNo,
            vehicleNo: item.vehicleNo,
            qtyInKg: '' + item.metaData.qtyInKg,
            qtyInCum: '' + item.metaData.qtyInCum,
            uploadWeightSlip: item.uploadWeightSlip,
            procurementDateTime: getDisplayDate(item.procurementDateTime),
          });
          break;

        case TEST_MATERIALS_TYPES.BITUMEN:
          setDetailsBitumen({
            sourceApprovalId: item.sourceApprovalId._id,
            sourceApprovalDetailId: item.sourceApprovalDetailId,
            gradeOfBitumen: item.metaData.gradeOfBitumen,
            lotNo: item.lotNo,
            vehicleNo: item.vehicleNo,
            qtyInKg: '' + item.metaData.qtyInKg,
            uploadWeightSlip: item.uploadWeightSlip,
            procurementDateTime: getDisplayDate(item.procurementDateTime),
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          setDetailsCoarseAggregateMicroSurfacing({
            sourceApprovalId: item.sourceApprovalId._id,
            sourceApprovalDetailId: item.sourceApprovalDetailId,
            nominalSize: item.metaData.nominalSize,
            lotNo: item.lotNo,
            vehicleNo: item.vehicleNo,
            qtyInKg: '' + item.metaData.qtyInKg,
            qtyInCum: '' + item.metaData.qtyInCum,
            uploadWeightSlip: item.uploadWeightSlip,
            procurementDateTime: getDisplayDate(item.procurementDateTime),
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          setDetailsCoarseAggregateSMA({
            sourceApprovalId: item.sourceApprovalId._id,
            sourceApprovalDetailId: item.sourceApprovalDetailId,
            nominalSize: item.metaData.nominalSize,
            vehicleNo: item.vehicleNo,
            lotNo: item.lotNo,
            qtyInKg: '' + item.metaData.qtyInKg,
            qtyInCum: '' + item.metaData.qtyInCum,
            uploadWeightSlip: item.uploadWeightSlip,
            procurementDateTime: getDisplayDate(item.procurementDateTime),
          });
          break;

        case TEST_MATERIALS_TYPES.EMULSION:
          setDetailsEmulsion({
            sourceApprovalId: item.sourceApprovalId._id,
            sourceApprovalDetailId: item.sourceApprovalDetailId,
            gradeOfBitumen: item.metaData.gradeOfBitumen,
            vehicleNo: item.vehicleNo,
            qtyInKg: '' + item.metaData.qtyInKg,
            uploadWeightSlip: item.uploadWeightSlip,
            lotNo: item.lotNo,
            procurementDateTime: getDisplayDate(item.procurementDateTime),
          });
          break;

        default:
          console.error('Unknown material type for Bituminous Works');
      }
    }

    setOpenProcurementPopup(true);
  };

  const validateForm = () => {
    let isValid = true;
    let errorMessage = '';

    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          if (detailsFineAggregate.lotNo.length > 100) {
            isValid = false;
            errorMessage =
              'Lot No/Trip No/Invoice No cannot exceed 100 characters.';
          }
          if (
            isNaN(parseFloat(detailsFineAggregate.qtyInKg)) ||
            Number(detailsFineAggregate.qtyInKg) <= 0
          ) {
            isValid = false;
            errorMessage =
              'Quantity for Fine Aggregate must be greater than 0.';
          }
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          if (detailsCoarseAggregateDBMBC.lotNo.length > 100) {
            isValid = false;
            errorMessage =
              'Lot No/Trip No/Invoice No cannot exceed 100 characters.';
          }
          if (!detailsCoarseAggregateDBMBC.nominalSize) {
            isValid = false;
            errorMessage =
              'Nominal Size is required for Coarse Aggregate (DBM/BC).';
          }
          if (
            isNaN(parseFloat(detailsCoarseAggregateDBMBC.qtyInKg)) ||
            Number(detailsCoarseAggregateDBMBC.qtyInKg) <= 0
          ) {
            isValid = false;
            errorMessage =
              'Quantity for Coarse Aggregate (DBM/BC) must be greater than 0.';
          }
          break;

        case TEST_MATERIALS_TYPES.BITUMEN:
          if (detailsBitumen.lotNo.length > 100) {
            isValid = false;
            errorMessage =
              'Lot No/Trip No/Invoice No cannot exceed 100 characters.';
          }
          if (!detailsBitumen.gradeOfBitumen) {
            isValid = false;
            errorMessage = 'Grade of Bitumen is required.';
          }
          if (
            isNaN(parseFloat(detailsBitumen.qtyInKg)) ||
            Number(detailsBitumen.qtyInKg) <= 0
          ) {
            isValid = false;
            errorMessage = 'Quantity for Bitumen must be greater than 0.';
          }
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          if (detailsCoarseAggregateMicroSurfacing.lotNo.length > 100) {
            isValid = false;
            errorMessage =
              'Lot No/Trip No/Invoice No cannot exceed 100 characters.';
          }
          if (!detailsCoarseAggregateMicroSurfacing.nominalSize) {
            isValid = false;
            errorMessage =
              'Nominal Size is required for Coarse Aggregate (Micro Surfacing).';
          }
          if (
            isNaN(parseFloat(detailsCoarseAggregateMicroSurfacing.qtyInKg)) ||
            Number(detailsCoarseAggregateMicroSurfacing.qtyInKg) <= 0
          ) {
            isValid = false;
            errorMessage =
              'Quantity for Coarse Aggregate (Micro Surfacing) must be greater than 0.';
          }
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          if (detailsCoarseAggregateSMA.lotNo.length > 100) {
            isValid = false;
            errorMessage =
              'Lot No/Trip No/Invoice No cannot exceed 100 characters.';
          }
          if (!detailsCoarseAggregateSMA.nominalSize) {
            isValid = false;
            errorMessage =
              'Nominal Size is required for Coarse Aggregate (SMA).';
          }
          if (
            isNaN(parseFloat(detailsCoarseAggregateSMA.qtyInKg)) ||
            Number(detailsCoarseAggregateSMA.qtyInKg) <= 0
          ) {
            isValid = false;
            errorMessage =
              'Quantity for Coarse Aggregate (SMA) must be greater than 0.';
          }
          break;

        case TEST_MATERIALS_TYPES.EMULSION:
          if (detailsEmulsion.lotNo.length > 100) {
            isValid = false;
            errorMessage =
              'Lot No/Trip No/Invoice No cannot exceed 100 characters.';
          }
          if (
            isNaN(parseFloat(detailsEmulsion.qtyInKg)) ||
            Number(detailsEmulsion.qtyInKg) <= 0
          ) {
            isValid = false;
            errorMessage = 'Quantity for Emulsion must be greater than 0.';
          }
          break;

        default:
          console.error('Unknown material type for Bituminous Works');
      }
    }

    if (!isValid) {
      showSnackbar(errorMessage, 'error');
    }

    return isValid;
  };

  // change karna hai
  const handleInputChangeBituminousWork = (
    field: any,
    value: any,
    detail: any,
  ) => {
    if (detail === 'detailsBitumen') {
      setDetailsBitumen((prevState: any) => ({
        ...prevState,
        [field]: value,
      }));
    } else if (detail === 'detailsFineAggregate') {
      setDetailsFineAggregate((prevState: any) => ({
        ...prevState,
        [field]: value,
      }));
    } else if (detail === 'detailsCoarseAggregateSMA') {
      setDetailsCoarseAggregateSMA((prevState: any) => ({
        ...prevState,
        [field]: value,
      }));
    } else if (detail === 'detailsCoarseAggregateMicroSurfacing') {
      setDetailsCoarseAggregateMicroSurfacing((prevState: any) => ({
        ...prevState,
        [field]: value,
      }));
    } else if (detail === 'detailsCoarseAggregateDBMBC') {
      setDetailsCoarseAggregateDBMBC((prevState: any) => ({
        ...prevState,
        [field]: value,
      }));
    } else if (detail === 'detailsEmulsion') {
      setDetailsEmulsion((prevState: any) => ({
        ...prevState,
        [field]: value,
      }));
    } else {
      console.warn(`Unknown detail type: ${detail}`);
    }
    if (field === 'sourceApprovalId') {
      setSourceApprovalDetails(
        sourceApprovals.find((x: any) => x._id === value)
          ?.sourceApprovalDetails,
      );
    } else if (field === 'nominalSize' || field === 'gradeOfBitumen') {
      const filteredData = sourceApprovals.filter(
        (s: any) =>
          s.sourceApprovalDetails &&
          s.sourceApprovalDetails.find(
            (sd: any) => sd.metaData && sd.metaData[field] === value,
          ),
      );
      setSourceApprovalsFiltered(filteredData);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    console.log('===submit======');
    let materialSpecificFields: any = {};

    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          console.log(
            '====Source Id===',
            detailsFineAggregate.sourceApprovalId,
          );
          console.log(
            '====Source detail Id===',
            detailsFineAggregate.sourceApprovalDetailId,
          );
          materialSpecificFields = {
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            body: {
              sourceApprovalId: detailsFineAggregate.sourceApprovalId,
              sourceApprovalDetailId:
                detailsFineAggregate.sourceApprovalDetailId,
              vehicleNo: vehicleNos.length
                ? vehicleNos
                : [detailsFineAggregate.vehicleNo || ''],
              procurementDateTime: getDbDateFromDDMMYYYY(
                detailsFineAggregate.procurementDateTime,
              ),
              lotNo: detailsFineAggregate.lotNo,
              uploadWeightSlip: detailsFineAggregate.uploadWeightSlip,
              metaData: {
                qtyInKg: Number(detailsFineAggregate.qtyInKg),
                qtyInCum: Number(detailsFineAggregate.qtyInCum),
              },
            },
          };
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          materialSpecificFields = {
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            body: {
              sourceApprovalId: detailsCoarseAggregateDBMBC.sourceApprovalId,
              sourceApprovalDetailId:
                detailsCoarseAggregateDBMBC.sourceApprovalDetailId,
              vehicleNo: vehicleNos.length
                ? vehicleNos
                : [detailsCoarseAggregateDBMBC.vehicleNo || ''],
              procurementDateTime: getDbDateFromDDMMYYYY(
                detailsCoarseAggregateDBMBC.procurementDateTime,
              ),
              lotNo: detailsCoarseAggregateDBMBC.lotNo,
              uploadWeightSlip: detailsCoarseAggregateDBMBC.uploadWeightSlip,
              metaData: {
                qtyInKg: Number(detailsCoarseAggregateDBMBC.qtyInKg),
                qtyInCum: Number(detailsCoarseAggregateDBMBC.qtyInCum),
                nominalSize: detailsCoarseAggregateDBMBC.nominalSize,
              },
            },
          };
          break;

        case TEST_MATERIALS_TYPES.BITUMEN:
          materialSpecificFields = {
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            body: {
              sourceApprovalId: detailsBitumen.sourceApprovalId,
              sourceApprovalDetailId: detailsBitumen.sourceApprovalDetailId,
              vehicleNo: vehicleNos.length
                ? vehicleNos
                : [detailsBitumen.vehicleNo || ''],
              procurementDateTime: getDbDateFromDDMMYYYY(
                detailsBitumen.procurementDateTime,
              ),
              lotNo: detailsBitumen.lotNo,
              uploadWeightSlip: detailsBitumen.uploadWeightSlip,
              metaData: {
                gradeOfBitumen: detailsBitumen.gradeOfBitumen,
                qtyInKg: Number(detailsBitumen.qtyInKg),
              },
            },
          };
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          materialSpecificFields = {
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            body: {
              sourceApprovalId:
                detailsCoarseAggregateMicroSurfacing.sourceApprovalId,
              sourceApprovalDetailId:
                detailsCoarseAggregateMicroSurfacing.sourceApprovalDetailId,
              vehicleNo: vehicleNos.length
                ? vehicleNos
                : [detailsCoarseAggregateMicroSurfacing.vehicleNo || ''],
              procurementDateTime: getDbDateFromDDMMYYYY(
                detailsCoarseAggregateMicroSurfacing.procurementDateTime,
              ),
              lotNo: detailsCoarseAggregateMicroSurfacing.lotNo,
              uploadWeightSlip:
                detailsCoarseAggregateMicroSurfacing.uploadWeightSlip,
              metaData: {
                qtyInKg: Number(detailsCoarseAggregateMicroSurfacing.qtyInKg),
                qtyInCum: Number(detailsCoarseAggregateMicroSurfacing.qtyInCum),
                nominalSize: detailsCoarseAggregateMicroSurfacing.nominalSize,
              },
            },
          };
          console.log(
            '====COARSE_AGGREGATE_MICRO_SURFACING====',
            JSON.stringify(materialSpecificFields),
          );
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          console.log(
            '====detailsCoarseAggregateSMA====',
            JSON.stringify(detailsCoarseAggregateSMA),
          );
          materialSpecificFields = {
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            body: {
              sourceApprovalId: detailsCoarseAggregateSMA.sourceApprovalId,
              //sourceApprovalDetailId:
              //detailsCoarseAggregateSMA.sourceApprovalDetailId,
              vehicleNo: vehicleNos.length
                ? vehicleNos
                : [detailsCoarseAggregateSMA.vehicleNo || ''],
              procurementDateTime: getDbDateFromDDMMYYYY(
                detailsCoarseAggregateSMA.procurementDateTime,
              ),
              lotNo: detailsCoarseAggregateSMA.lotNo,
              uploadWeightSlip: detailsCoarseAggregateSMA.uploadWeightSlip,
              metaData: {
                qtyInKg: Number(detailsCoarseAggregateSMA.qtyInKg),
                qtyInCum: Number(detailsCoarseAggregateSMA.qtyInCum),
                nominalSize: detailsCoarseAggregateSMA.nominalSize,
              },
            },
          };
          break;

        case TEST_MATERIALS_TYPES.EMULSION:
          materialSpecificFields = {
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            body: {
              sourceApprovalId: detailsEmulsion.sourceApprovalId,
              sourceApprovalDetailId: detailsEmulsion.sourceApprovalDetailId,
              vehicleNo: vehicleNos.length
                ? vehicleNos
                : [detailsEmulsion.vehicleNo || ''],
              procurementDateTime: getDbDateFromDDMMYYYY(
                detailsEmulsion.procurementDateTime,
              ),
              lotNo: detailsEmulsion.lotNo,
              uploadWeightSlip: detailsEmulsion.uploadWeightSlip,
              metaData: {
                gradeOfBitumen: detailsEmulsion.gradeOfBitumen,
                qtyInKg: Number(detailsEmulsion.qtyInKg),
              },
            },
          };
          break;

        default:
          console.error('Unknown material type for Bituminous Works');
          return;
      }
    }

    materialSpecificFields.testWorkCategoryType = testWorkCategoryType;
    const requestBody = {
      ...materialSpecificFields,
    };

    if (!selectedProcurement) {
      dispatch(
        addProcurement({
          ...requestBody,
        }),
      );
    } else {
      dispatch(
        updateProcurement({
          ...requestBody,
          id: selectedProcurement._id,
        }),
      );
    }
  };

  useEffect(() => {
    if (addedProcurement) {
      setOpenProcurementPopup(false);
      showSnackbar('Procurement Added Successfully', 'success');
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
      showSnackbar('Procurement Updated Successfully', 'success');
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
      showSnackbar('Procurement Deleted Successfully', 'success');
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
    const vehicleNo = vehicleNoTemp;
    const vehicleNoRegex = /^\d{4}$/; // Validate it is exactly 4 digits

    if (vehicleNo && vehicleNoRegex.test(vehicleNo)) {
      // Initialize vehicleNos if undefined
      if (!vehicleNos) {
        setVehicleNos([]);
      }
      const index = vehicleNos.indexOf(vehicleNo);
      if (index === -1) {
        vehicleNos.push(vehicleNo);
        setVehicleNos([...vehicleNos]);
        setVehicleNoTemp('');
        if (
          testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS
        ) {
          switch (materialType) {
            case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
              setDetailsFineAggregate({
                ...detailsFineAggregate,
              });
              break;

            case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
              setDetailsCoarseAggregateDBMBC({
                ...detailsCoarseAggregateDBMBC,
              });
              break;

            case TEST_MATERIALS_TYPES.BITUMEN:
              setDetailsBitumen({
                ...detailsBitumen,
              });
              break;

            case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
              setDetailsCoarseAggregateMicroSurfacing({
                ...detailsCoarseAggregateMicroSurfacing,
              });
              break;

            case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
              setDetailsCoarseAggregateSMA({
                ...detailsCoarseAggregateSMA,
              });
              break;

            case TEST_MATERIALS_TYPES.EMULSION:
              setDetailsEmulsion({
                ...detailsEmulsion,
              });
              break;

            default:
              console.error('Unknown material type for Bituminous Works');
              break;
          }
        }
      }
    } else {
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
            'Content-Type': 'multipart/form-data',
            Authorization: appConfig.getToken(),
          },
          body: data,
        });
        console.log('===responseOfFileUpload====', responseOfFileUpload);
        if (responseOfFileUpload.status == 200) {
          let responseInJs = await responseOfFileUpload.json();
          console.log('===responseInJs====', responseInJs);
          let fileName = responseInJs.data.fileUrl;
          showSnackbar('Upload Succesfull');
          setFileRes(null);
        } else {
          showSnackbar('Upload Failed');
        }
      } catch (err) {
        console.log('==err==', err);
        showSnackbar('Upload Failed');
        console.log(err, 'error in upload');
      }
    } else {
      showSnackbar('File size should not exceed 4 MB');
    }
  };

  const addProcurementsForm = () => {
    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          return (
            <View style={styles.reportFields}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[{height: calculatedHeight}]}>
                <View style={commonStyles.procurementsInnerContainer}>
                  <View>
                    {renderPickerBituminousWork(
                      'Source',
                      'sourceApprovalId',
                      'detailsFineAggregate',
                    )}
                  </View>
                  <View>
                    {renderSourceDetailsPickerBituminousWork(
                      'Source Detail',
                      'sourceApprovalDetailId',
                      'detailsFineAggregate',
                    )}
                  </View>
                  <View>
                    <Input
                      label="Lot No/Trip No/Invoice No"
                      value={detailsFineAggregate.lotNo}
                      onChange={(value: string) =>
                        handleInputChangeBituminousWork(
                          'lotNo',
                          value,
                          'detailsFineAggregate',
                        )
                      }
                      isRequired={true}
                    />
                  </View>
                  <View>
                    <View style={commonStyles.addMoreVichleContainer}>
                      <View style={commonStyles.vichleWth}>
                        <Input
                          label="Vehicle no."
                          value={vehicleNoTemp}
                          onChange={(value: string) => setVehicleNoTemp(value)}
                        />
                      </View>
                      <View  style={commonStyles.paadingTop}>
                        <TouchableOpacity
                          style={commonStyles.add_vehicle}
                          onPress={onAddVehicle}>
                          <Text style={commonStyles.btnAddVehicle}>Add Vehicle</Text>
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
                      label="Quantity (in kg)"
                      value={detailsFineAggregate.qtyInKg}
                      onChange={(value: string) =>
                        handleInputChangeBituminousWork(
                          'qtyInKg',
                          value,
                          'detailsFineAggregate',
                        )
                      }
                      isRequired={true}
                    />
                  </View>
                  <View>
                    <CalendarPicker
                      label="Date"
                      value={detailsFineAggregate.procurementDateTime}
                      onChange={date =>
                        handleInputChangeBituminousWork(
                          'procurementDateTime',
                          date,
                          'detailsFineAggregate',
                        )
                      }
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
                        <Text style={styles.uploadBtn}>Upload Weight Slip</Text>
                      </TouchableOpacity>
                      {detailsFineAggregate.uploadWeightSlip && (
                        <Text>{detailsFineAggregate.uploadWeightSlip}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={handleSubmit}>
                <Text style={styles.submitBtn}>Submit</Text>
              </TouchableOpacity>
            </View>
          );

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          return (
            <View style={styles.reportFields}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[{height: calculatedHeight}]}>
                <View style={commonStyles.procurementsInnerContainer}>
                <View>
                  <DropdownPicker
                    label="Nominal Size"
                    items={[
                      {label: 'Select', value: ''},
                      {label: '37.5mm', value: '37.5mm'},
                      {label: '26.5mm', value: '26.5mm'},
                      {label: '19mm', value: '19mm'},
                      {label: '13.2mm', value: '13.2mm'},
                    ]}
                    value={detailsCoarseAggregateDBMBC.nominalSize}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'nominalSize',
                        value,
                        'detailsCoarseAggregateDBMBC',
                      )
                    }
                  />
                </View>
                <View>
                  {renderSourceDetailsPickerBituminousWork(
                    'Source Detail',
                    'sourceApprovalId',
                    'detailsCoarseAggregateDBMBC',
                    sourceApprovalsFiltered,
                  )}
                </View>
                <View>
                  <Input
                    label="Lot No/Trip No/Invoice No"
                    value={detailsCoarseAggregateDBMBC.lotNo}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'lotNo',
                        value,
                        'detailsCoarseAggregateDBMBC',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <View style={commonStyles.addMoreVichleContainer}>
                  <View style={commonStyles.vichleWth}>
                      <Input
                        label="Vehicle No. (Last 4 digits)"
                        value={vehicleNoTemp}
                        onChange={(value: string) => setVehicleNoTemp(value)}
                      />
                    </View>
                    <View style={commonStyles.paadingTop}>
                      <TouchableOpacity
                        style={commonStyles.add_vehicle}
                        onPress={onAddVehicle}>
                        <Text style={commonStyles.btnAddVehicle}>Add Vehicle</Text>
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
                    label="Quantity (in kg)"
                    value={detailsCoarseAggregateDBMBC.qtyInKg}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'qtyInKg',
                        value,
                        'detailsCoarseAggregateDBMBC',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <Input
                    label="Quantity (in cum)"
                    value={detailsCoarseAggregateDBMBC.qtyInCum}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'qtyInCum',
                        value,
                        'detailsCoarseAggregateDBMBC',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <CalendarPicker
                    label="Date"
                    value={detailsCoarseAggregateDBMBC.procurementDateTime}
                    onChange={date =>
                      handleInputChangeBituminousWork(
                        'procurementDateTime',
                        date,
                        'detailsCoarseAggregateDBMBC',
                      )
                    }
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
                      <Text style={styles.uploadBtn}>Upload Weight Slip</Text>
                    </TouchableOpacity>
                    {detailsCoarseAggregateDBMBC.uploadWeightSlip && (
                      <Text>
                        {detailsCoarseAggregateDBMBC.uploadWeightSlip}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={handleSubmit}>
                <Text style={styles.submitBtn}>Submit</Text>
              </TouchableOpacity>
            </View>
          );

        case TEST_MATERIALS_TYPES.BITUMEN:
          return (
            <View style={styles.reportFields}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[{height: calculatedHeight}]}>
                <View style={commonStyles.procurementsInnerContainer}>
                <View>
                  <DropdownPicker
                    label="Grade of Bitumen"
                    items={[
                      {label: 'Select', value: ''},
                      {label: 'VG 30', value: 'VG 30'},
                      {label: 'VG 40', value: 'VG 40'},
                      {label: 'PMB', value: 'PMB'},
                    ]}
                    value={detailsBitumen.gradeOfBitumen}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'gradeOfBitumen',
                        value,
                        'detailsBitumen',
                      )
                    }
                  />
                </View>
                <View>
                  {renderSourceDetailsPickerBituminousWork(
                    'Source Detail',
                    'sourceApprovalId',
                    'detailsBitumen',
                    sourceApprovalsFiltered,
                  )}
                </View>
                <View>
                  <Input
                    label="Lot No/Trip No/Invoice No"
                    value={detailsBitumen.lotNo}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'lotNo',
                        value,
                        'detailsBitumen',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <View style={commonStyles.addMoreVichleContainer}>
                    <View style={commonStyles.vichleWth}>
                      <Input
                        label="Vehicle No. (Last 4 digits)"
                        value={vehicleNoTemp}
                        onChange={(value: string) => setVehicleNoTemp(value)}
                      />
                    </View>
                    <View style={commonStyles.paadingTop}>
                      <TouchableOpacity
                        style={commonStyles.add_vehicle}
                        onPress={onAddVehicle}>
                        <Text style={commonStyles.btnAddVehicle}>Add Vehicle</Text>
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
                    label="Quantity (in kg)"
                    value={detailsBitumen.qtyInKg}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'qtyInKg',
                        value,
                        'detailsBitumen',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <CalendarPicker
                    label="Date"
                    value={detailsBitumen.procurementDateTime}
                    onChange={date =>
                      handleInputChangeBituminousWork(
                        'procurementDateTime',
                        date,
                        'detailsBitumen',
                      )
                    }
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
                      <Text style={styles.uploadBtn}>Upload Weight Slip</Text>
                    </TouchableOpacity>
                    {detailsBitumen.uploadWeightSlip && (
                      <Text>{detailsBitumen.uploadWeightSlip}</Text>
                    )}
                  </View>
                </View>
              </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={handleSubmit}>
                <Text style={styles.submitBtn}>Submit</Text>
              </TouchableOpacity>
            </View>
          );

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          return (
            <View style={styles.reportFields}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[{height: calculatedHeight}]}>
                <View style={commonStyles.procurementsInnerContainer}>
                <View>
                  <DropdownPicker
                    label="Nominal Size"
                    items={[
                      {label: 'Select', value: ''},
                      {label: '37.5mm', value: '37.5mm'},
                      {label: '26.5mm', value: '26.5mm'},
                      {label: '19mm', value: '19mm'},
                      {label: '13.2mm', value: '13.2mm'},
                    ]}
                    value={detailsCoarseAggregateMicroSurfacing.nominalSize}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'nominalSize',
                        value,
                        'detailsCoarseAggregateMicroSurfacing',
                      )
                    }
                  />
                </View>
                <View>
                  {renderSourceDetailsPickerBituminousWork(
                    'Source Detail',
                    'sourceApprovalId',
                    'detailsCoarseAggregateMicroSurfacing',
                    sourceApprovalsFiltered,
                  )}
                </View>
                <View>
                  <Input
                    label="Lot No/Trip No/Invoice No"
                    value={detailsCoarseAggregateMicroSurfacing.lotNo}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'lotNo',
                        value,
                        'detailsCoarseAggregateMicroSurfacing',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <View style={commonStyles.addMoreVichleContainer}>
                    <View style={commonStyles.vichleWth}>
                      <Input
                        label="Vehicle No. (Last 4 digits)"
                        value={vehicleNoTemp}
                        onChange={(value: string) => setVehicleNoTemp(value)}
                      />
                    </View>
                    <View style={commonStyles.paadingTop}>
                      <TouchableOpacity
                        style={commonStyles.add_vehicle}
                        onPress={onAddVehicle}>
                        <Text style={commonStyles.btnAddVehicle}>Add Vehicle</Text>
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
                    label="Quantity (in kg)"
                    value={detailsCoarseAggregateMicroSurfacing.qtyInKg}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'qtyInKg',
                        value,
                        'detailsCoarseAggregateMicroSurfacing',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <Input
                    label="Quantity (in cum)"
                    value={detailsCoarseAggregateMicroSurfacing.qtyInCum}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'qtyInCum',
                        value,
                        'detailsCoarseAggregateMicroSurfacing',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <CalendarPicker
                    label="Date"
                    value={
                      detailsCoarseAggregateMicroSurfacing.procurementDateTime
                    }
                    onChange={date =>
                      handleInputChangeBituminousWork(
                        'procurementDateTime',
                        date,
                        'detailsCoarseAggregateMicroSurfacing',
                      )
                    }
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
                      <Text style={styles.uploadBtn}>Upload Weight Slip</Text>
                    </TouchableOpacity>
                    {detailsCoarseAggregateMicroSurfacing.uploadWeightSlip && (
                      <Text>
                        {detailsCoarseAggregateMicroSurfacing.uploadWeightSlip}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={handleSubmit}>
                <Text style={styles.submitBtn}>Submit</Text>
              </TouchableOpacity>
            </View>
          );

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          return (
            <View style={styles.reportFields}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[{height: calculatedHeight}]}>
                <View style={commonStyles.procurementsInnerContainer}>
                <View>
                  <DropdownPicker
                    label="Nominal Size"
                    items={[
                      {label: 'Select', value: ''},
                      {label: '37.5mm', value: '37.5mm'},
                      {label: '26.5mm', value: '26.5mm'},
                      {label: '19mm', value: '19mm'},
                      {label: '13.2mm', value: '13.2mm'},
                    ]}
                    value={detailsCoarseAggregateSMA.nominalSize}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'nominalSize',
                        value,
                        'detailsCoarseAggregateSMA',
                      )
                    }
                  />
                </View>
                <View>
                  {renderSourceDetailsPickerBituminousWork(
                    'Source Detail',
                    'sourceApprovalId',
                    'detailsCoarseAggregateSMA',
                    sourceApprovalsFiltered,
                  )}
                </View>
                <View>
                  <Input
                    label="Lot No/Trip No/Invoice No"
                    value={detailsCoarseAggregateSMA.lotNo}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'lotNo',
                        value,
                        'detailsCoarseAggregateSMA',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <View style={commonStyles.addMoreVichleContainer}>
                    <View style={commonStyles.vichleWth}>
                      <Input
                        label="Vehicle No. (Last 4 digits)"
                        value={vehicleNoTemp}
                        onChange={(value: string) => setVehicleNoTemp(value)}
                      />
                    </View>
                    <View style={commonStyles.paadingTop}>
                      <TouchableOpacity
                        style={commonStyles.add_vehicle}
                        onPress={onAddVehicle}>
                        <Text style={commonStyles.btnAddVehicle}>Add Vehicle</Text>
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
                    label="Quantity (in kg)"
                    value={detailsCoarseAggregateSMA.qtyInKg}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'qtyInKg',
                        value,
                        'detailsCoarseAggregateSMA',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <Input
                    label="Quantity (in cum)"
                    value={detailsCoarseAggregateSMA.qtyInCum}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'qtyInCum',
                        value,
                        'detailsCoarseAggregateSMA',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <CalendarPicker
                    label="Date"
                    value={detailsCoarseAggregateSMA.procurementDateTime}
                    onChange={date =>
                      handleInputChangeBituminousWork(
                        'procurementDateTime',
                        date,
                        'detailsCoarseAggregateSMA',
                      )
                    }
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
                      <Text style={styles.uploadBtn}>Upload Weight Slip</Text>
                    </TouchableOpacity>
                    {detailsCoarseAggregateSMA.uploadWeightSlip && (
                      <Text>{detailsCoarseAggregateSMA.uploadWeightSlip}</Text>
                    )}
                  </View>
                </View>
              </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={handleSubmit}>
                <Text style={styles.submitBtn}>Submit</Text>
              </TouchableOpacity>
            </View>
          );

        case TEST_MATERIALS_TYPES.EMULSION:
          return (
            <View style={styles.reportFields}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[{height: calculatedHeight}]}>
                <View style={commonStyles.procurementsInnerContainer}>
                <View>
                  {/*Wrong dropdown it must fetch by backend*/}
                  <DropdownPicker
                    label="Grade of Bitumen"
                    items={[
                      {label: 'Select', value: ''},
                      {label: 'VG 30', value: 'VG 30'},
                      {label: 'VG 40', value: 'VG 40'},
                      {label: 'PMB', value: 'PMB'},
                    ]}
                    value={detailsEmulsion.gradeOfBitumen}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'gradeOfBitumen',
                        value,
                        'detailsEmulsion',
                      )
                    }
                  />
                </View>
                <View>
                  {renderSourceDetailsPickerBituminousWork(
                    'Source Detail',
                    'sourceApprovalId',
                    'detailsEmulsion',
                    sourceApprovalsFiltered,
                  )}
                </View>
                <View>
                  <Input
                    label="Lot No/Trip No/Invoice No"
                    value={detailsEmulsion.lotNo}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'lotNo',
                        value,
                        'detailsEmulsion',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <View style={commonStyles.addMoreVichleContainer}>
                    <View style={commonStyles.vichleWth}>
                      <Input
                        label="Vehicle No. (Last 4 digits)"
                        value={vehicleNoTemp}
                        onChange={(value: string) => setVehicleNoTemp(value)}
                      />
                    </View>
                    <View style={commonStyles.paadingTop}>
                      <TouchableOpacity
                        style={commonStyles.add_vehicle}
                        onPress={onAddVehicle}>
                        <Text style={commonStyles.btnAddVehicle}>Add Vehicle</Text>
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
                    label="Quantity (in kg)"
                    value={detailsEmulsion.qtyInKg}
                    onChange={(value: string) =>
                      handleInputChangeBituminousWork(
                        'qtyInKg',
                        value,
                        'detailsEmulsion',
                      )
                    }
                    isRequired={true}
                  />
                </View>
                <View>
                  <CalendarPicker
                    label="Date"
                    value={detailsEmulsion.procurementDateTime}
                    onChange={date =>
                      handleInputChangeBituminousWork(
                        'procurementDateTime',
                        date,
                        'detailsEmulsion',
                      )
                    }
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
                      <Text style={styles.uploadBtn}>Upload Weight Slip</Text>
                    </TouchableOpacity>
                    {detailsEmulsion.uploadWeightSlip && (
                      <Text>{detailsEmulsion.uploadWeightSlip}</Text>
                    )}
                  </View>
                </View>
              </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={handleSubmit}>
                <Text style={styles.submitBtn}>Submit</Text>
              </TouchableOpacity>
            </View>
          );
      }
    }
  };
  const renderPickerBituminousWork = (
    label: string,
    field: string,
    detail: string,
    data: any = sourceApprovals,
  ) => {
    const options = [{name: 'Select', _id: ''}].concat(data);
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={
              detail === 'detailsBitumen'
                ? detailsBitumen[field]
                : detail === 'detailsFineAggregate'
                ? detailsFineAggregate[field]
                : detail === 'detailsCoarseAggregateSMA'
                ? detailsCoarseAggregateSMA[field]
                : detail === 'detailsCoarseAggregateMicroSurfacing'
                ? detailsCoarseAggregateMicroSurfacing[field]
                : detail === 'detailsCoarseAggregateDBMBC'
                ? detailsCoarseAggregateDBMBC[field]
                : detail === 'detailsEmulsion'
                ? detailsEmulsion[field]
                : ''
            }
            style={styles.picker}
            onValueChange={itemValue => {
              handleInputChangeBituminousWork(field, itemValue, detail);
            }}>
            {options.map((option, index) => (
              <Picker.Item key={index} label={option.name} value={option._id} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };
  const renderSourceDetailsPickerBituminousWork = (
    label: string,
    field: string,
    detail: string,
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
            selectedValue={
              detail === 'detailsBitumen'
                ? detailsBitumen[field]
                : detail === 'detailsFineAggregate'
                ? detailsFineAggregate[field]
                : detail === 'detailsCoarseAggregateSMA'
                ? detailsCoarseAggregateSMA[field]
                : detail === 'detailsCoarseAggregateMicroSurfacing'
                ? detailsCoarseAggregateMicroSurfacing[field]
                : detail === 'detailsCoarseAggregateDBMBC'
                ? detailsCoarseAggregateDBMBC[field]
                : detail === 'detailsEmulsion'
                ? detailsEmulsion[field]
                : ''
            }
            style={styles.picker}
            onValueChange={itemValue =>
              handleInputChangeBituminousWork(field, itemValue, detail)
            }>
            {options.map((option, index) => (
              <Picker.Item key={index} label={option.name} value={option._id} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={[commonStyles.itemContainer]}>
      <Text style={commonStyles.itemText}>{item.lotNo}</Text>
      <View style={commonStyles.iconContainer}>
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
          <View  style={commonStyles.detailsSection}>
            <Text style={styles.AssignRoleText}>
              {testWorkCategoryName + ' > ' + testMaterialName}
            </Text>
          </View>
          <View style={commonStyles.rightAlignBtn}>
            <TouchableOpacity
              style={commonStyles.outLineBtn}
              onPress={() => onAddProcurement()}>
              <Image
                style={commonStyles.addSourceIcon}
                source={require('./../../../images/add-circle.png')}
              />
              <Text style={commonStyles.btnTextSize}>Add/Edit procurement</Text>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView howsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={[{height: calculatedFlatListHeight}]}>
              <View style={commonStyles.flatListContainer}>
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                />
              </View>
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
                {addProcurementsForm()}
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
    backgroundColor: '#1d7dea',
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

export default ProcurementsBitnumiousWork;
