import React, {useEffect, useState} from 'react';
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
  CEMENT_GRADE_LIST,
  CONCRETE_GRADE_LIST,
  HeaderItems,
  SOURCE_APPROVAL_STATUS,
  TEST_MATERIALS_TYPES,
  TEST_WORK_CATEGORY_TYPES,
} from '../../../constants/constants';
import {Image} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingAnimation from '../../Common/LoadingAnimation';
import {Picker} from '@react-native-picker/picker';
import {
  addSourceApproval,
  addSourceDetail,
  clearSourceApprovals,
  deleteSourceApproval,
  deleteSourceDetail,
  getSourceApprovals,
  patchSourceApproval,
  updateSourceApproval,
  updateSourceDetail,
} from '../actions';
import CustomAlert from '../../Common/CustomAlert';
import DropdownPicker from '../../../components/UI/DropdownPicker';
import {number} from 'prop-types';
import commonStyles from '../../Common/commonStyles';

const SourceApprovals = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {
    testWorkCategoryName,
    testMaterialName,
    testWorkCategoryType,
    materialType,
    testMaterialId,
  } = route.params;
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    sourceApprovals,
    sourceApprovalsByStatus,
    addedSourceApproval,
    patchedSourceApproval,
    updatedSourceApproval,
    deletedSourceApproval,
    addedSourceDetail,
    updatedSourceDetail,
    deletedSourceDetail,
    loading,
    error,
  } = useSelector((state: any) => state.SourceApprovals);
  const [openSourceApprovalsPopup, setOpenSourceApprovalsPopup] =
    useState(false);
  const [openSourceDetailsPopup, setOpenSourceDetailsPopup] = useState(false);
  const [selectedSource, setSelectedSource]: any = useState(null);

  const [sourceApprovalDetails, setSourceApprovalDetails]: any = useState();
  const [selectedSourceDetail, setSelectedSourceDetail]: any = useState(null);
  const [confirmationAlert, setConfirmationAlert] = useState(false);

  const [data, setData] = useState([]);

  const [gradeList, setGradeList]: any = useState([]);

  const [gradeField, setGradeField]: any = useState({});

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.sourceApprovals);
  }

  const {showSnackbar} = useSnackbar();

  const dispatch = useDispatch();

  useEffect(() => {
    if (sourceApprovals) {
      setData(sourceApprovals);
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [sourceApprovals, error]);

  // mount
  useEffect(() => {
    if (materialType === TEST_MATERIALS_TYPES.CONCRETE) {
      setGradeField({
        name: 'gradeOfConcrete',
        label: 'Grade Of Concrete',
      });
      setGradeList(CONCRETE_GRADE_LIST);
    } else if (materialType === TEST_MATERIALS_TYPES.CEMENT) {
      setGradeField({
        name: 'gradeOfCement',
        label: 'Grade Of Cement',
      });
      setGradeList(CEMENT_GRADE_LIST);
    } else if (materialType === TEST_MATERIALS_TYPES.BITUMEN) {
      setGradeField({
        name: 'gradeOfBitumen',
        label: 'Grade Of Bitumen',
      });
      setGradeList([
        {label: 'VG 30', value: 'VG 30'},
        {label: 'VG 40', value: 'VG 40'},
        {label: 'PMB', value: 'PMB'},
      ]);
    }
    dispatch(
      getSourceApprovals({
        projectId: loggedInUser.projectId,
        testMaterialId: testMaterialId,
      }),
    );
  }, []);

  // unmount
  useEffect(
    () => () => {
      dispatch(clearSourceApprovals());
    },
    [],
  );

  type FormState = {
    name: string;
    location: string;
    vendorName: string;
    comments: string;
    status: string;
  };

  type FormSourceDetailState = {
    sourceApprovalId: string;
    ratePerCum: number;
  };

  const [sourceForm, setSourceForm] = useState<FormState>({
    name: '',
    location: '',
    vendorName: '',
    comments: '',
    status: SOURCE_APPROVAL_STATUS.PENDING,
  });
  //Bitumious work source approval form
  // Fine Aggregate
  const [fineAggregate, setFineAggregate] = useState({
    sourceApprovalId: '',
    ratePerKG: 0, // (3 decimal, >0, 100000)
  });

  //Emulsion
  const [emulsion, setEmulsion] = useState({
    sourceApprovalId: '',
    gradeOfEmulsion: '', // characters, max limit 100
    ratePerMT: 0.0, // (3 decimal, >0, 100000)
    emulsionBrand: '', // characters, max limit 100
  });

  //Coarse Aggregate (SMA)
  const [coarseAggregateSMA, setCoarseAggregateSMA] = useState({
    sourceApprovalId: '',
    nominalSize: '37.5mm', // 37.5mm / 26.5mm / 19mm / 13.2mm
    ratePerKG: 0.0, // (3 decimal, >0, 100000)
  });

  //Coarse Aggregate (Micro Surfacing)
  const [coarseAggregateMicro, setCoarseAggregateMicro] = useState({
    sourceApprovalId: '',
    nominalSize: '37.5mm', // 37.5mm / 26.5mm / 19mm / 13.2mm
    ratePerKG: 0.0, // (3 decimal, >0, 100000)
  });

  //Bitumen
  const [bitumen, setBitumen] = useState({
    sourceApprovalId: '',
    gradeOfBitumen: 'VG 30', // VG 30 / VG 40 / PMB
    ratePerMT: 0.0, // (3 decimal, >0, 100000)
    bitumenBrand: '', // characters, max limit 100
  });

  //Coarse Aggregate (DBM/BC)
  const [coarseAggregateDBMBC, setCoarseAggregateDBMBC] = useState({
    sourceApprovalId: '',
    nominalSize: '37.5mm', // 37.5mm / 26.5mm / 19mm / 13.2mm / 10mm / 20mm
    ratePerKG: 0.0, // (3 decimal, >0, 100000)
  });
  // EarthWork
  const [sourceDetailEarthWork, setSourceDetailEarthWork]: any ={
    sourceApprovalId: '',
    ratePerCum: 0,
  }
  const [sourceDetailForm, setSourceDetailForm]: any =
    useState<FormSourceDetailState>({
      sourceApprovalId: '',
      [gradeField.name]: '',
      ratePerCum: 0,
    });

  const handleDelete = (item: any) => {
    setSelectedSource(item);
    setConfirmationAlert(true);
  };

  const onPressAlertOkButton = () => {
    if (selectedSourceDetail == null) {
      dispatch(
        deleteSourceApproval({
          projectId: loggedInUser.projectId,
          testMaterialId: testMaterialId,
          id: selectedSource._id,
        }),
      );
    } else {
      dispatch(
        deleteSourceDetail({
          projectId: loggedInUser.projectId,
          sourceApprovalId: selectedSource._id,
          id: selectedSourceDetail._id,
        }),
      );
    }
  };

  const onPressAlertCancelButton = () => {
    if (selectedSourceDetail === null) {
      setSelectedSource(null);
    } else {
      setSelectedSourceDetail(null);
    }
    setConfirmationAlert(false);
  };

  const handleEdit = (item: any) => {
    setSelectedSource(item);
    setSourceForm({
      name: item.name,
      location: item.location,
      vendorName: item.vendorName,
      comments: item.comments,
      status: item.status,
    });
    setSelectedSource(item);
    setOpenSourceApprovalsPopup(true);
  };

  const handleAdd = (item: any) => {
    setSelectedSource(item);
    setSelectedSourceDetail(null);
    setSourceApprovalDetails(item.sourceApprovalDetails || []);
    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          setFineAggregate({
            sourceApprovalId: item._id,
            ratePerKG: item.ratePerKG,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          setCoarseAggregateDBMBC({
            sourceApprovalId: item._id,
            nominalSize: item.nominalSize,
            ratePerKG: item.ratePerKG,
          });
          break;

        case TEST_MATERIALS_TYPES.BITUMEN:
          setBitumen({
            sourceApprovalId: item._id,
            gradeOfBitumen: item.gradeOfBitumen,
            ratePerMT: item.ratePerMT,
            bitumenBrand: item.bitumenBrand,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          setCoarseAggregateMicro({
            sourceApprovalId: item._id,
            nominalSize: item.nominalSize,
            ratePerKG: item.ratePerKG,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          setCoarseAggregateSMA({
            sourceApprovalId: item._id,
            nominalSize: item.nominalSize, // 37.5mm /26.5mm/19mm /13.2mm
            ratePerKG: item.ratePerKG, // (3 decimal, >0, 100000)
          });
          break;

        case TEST_MATERIALS_TYPES.EMULSION:
          setEmulsion({
            sourceApprovalId: item._id,
            gradeOfEmulsion: item.gradeOfEmulsion, // characters, max limit 100
            ratePerMT: item.ratePerMT, // (3 decimal, >0, 100000)
            emulsionBrand: item.emulsionBrand, // characters, max limit 100
          });
          break;
      }
    } else {
      setSourceDetailForm({
        sourceApprovalId: item._id,
        [gradeField.name]: '',
        ratePerCum: 0,
      });
    }

    setOpenSourceDetailsPopup(true);
  };

  const getBorderColor = (type: any) => {
    switch (type?.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleFineAggregateInputChange = (
    name: keyof typeof fineAggregate,
    value: string | number,
  ) => {
    setFineAggregate({...fineAggregate, [name]: value});
  };

  const handleCoarseAggregateDBMBCInputChange = (
    name: keyof typeof coarseAggregateDBMBC,
    value: string | number,
  ) => {
    setCoarseAggregateDBMBC({...coarseAggregateDBMBC, [name]: value});
  };

  const handleBitumenInputChange = (
    name: keyof typeof bitumen,
    value: string | number,
  ) => {
    setBitumen({...bitumen, [name]: value});
  };

  const handleCoarseAggregateMicroInputChange = (
    name: keyof typeof coarseAggregateMicro,
    value: string | number,
  ) => {
    setCoarseAggregateMicro({...coarseAggregateMicro, [name]: value});
  };

  const handleCoarseAggregateSMAInputChange = (
    name: keyof typeof coarseAggregateSMA,
    value: string | number,
  ) => {
    setCoarseAggregateSMA({...coarseAggregateSMA, [name]: value});
  };

  const handleEmulsionInputChange = (
    name: keyof typeof emulsion,
    value: string | number,
  ) => {
    setEmulsion({...emulsion, [name]: value});
  };
  const handleSourceDetailInputChange = (
    name: keyof FormSourceDetailState,
    value: string | number,
  ) => {
    setSourceDetailForm({...sourceDetailForm, [name]: value});
  };
  const handleSourceDetailEarthWorkInputChange = (
    name: keyof FormSourceDetailState,
    value: string | number,
  ) => {
    setSourceDetailEarthWork({...sourceDetailEarthWork, [name]: value});
  };
  const handleInputChange = (name: keyof FormState, value: string | number) => {
    let isValid = true;
    let message = '';

    switch (name) {
      case 'name':
      case 'location':
      case 'vendorName':
        if (typeof value === 'string' && value.length > 100) {
          isValid = false;
          message = `${name} should be less than 100 characters.`;
        }
        break;
      case 'comments':
        if (typeof value === 'string' && value.length > 500) {
          isValid = false;
          message = 'Comments should be less than 500 characters.';
        }
        break;
      default:
        break;
    }

    if (isValid) {
      setSourceForm({...sourceForm, [name]: value});
    } else {
      showSnackbar(message, 'error');
    }
  };

  const handleSubmit = () => {
    if (selectedSource == null) {
      dispatch(
        addSourceApproval({
          projectId: loggedInUser.projectId,
          testCategoryType: testWorkCategoryType,
          testMaterialId: testMaterialId,
          body: sourceForm,
        }),
      );
    } else {
      dispatch(
        updateSourceApproval({
          projectId: loggedInUser.projectId,
          testCategoryType: testWorkCategoryType,
          testMaterialId: testMaterialId,
          id: selectedSource._id,
          body: sourceForm,
        }),
      );
    }
  };

  const onSourceStatusChanged = (item: any, status: any) => {
    dispatch(
      patchSourceApproval({
        projectId: loggedInUser.projectId,
        testCategoryType: testWorkCategoryType,
        testMaterialId: testMaterialId,
        id: item._id,
        body: {
          status: status,
        },
      }),
    );
  };

  useEffect(() => {
    if (patchedSourceApproval) {
      setOpenSourceApprovalsPopup(false);
      showSnackbar('Source status updated successfully', 'success'); // Show success snackbar
      dispatch(
        getSourceApprovals({
          projectId: loggedInUser.projectId,
          testMaterialId: testMaterialId,
        }),
      );
    } else if (error) {
      setOpenSourceApprovalsPopup(false);
      showSnackbar(error, 'error');
    }
  }, [patchedSourceApproval, error]);

  useEffect(() => {
    if (addedSourceApproval) {
      setOpenSourceApprovalsPopup(false);
      onSuccess('Source Added Successfully');
    } else if (error) {
      setOpenSourceApprovalsPopup(false);
      showSnackbar(error, 'error');
    }
  }, [addedSourceApproval, error]);

  useEffect(() => {
    if (updatedSourceApproval) {
      setOpenSourceApprovalsPopup(false);
      onSuccess('Source Updated Successfully');
    } else if (error) {
      setOpenSourceApprovalsPopup(false);
      showSnackbar(error, 'error');
    }
  }, [updatedSourceApproval, error]);

  useEffect(() => {
    if (deletedSourceApproval) {
      onSuccess('Source Removed Successfully');
      onPressAlertCancelButton();
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [deletedSourceApproval, error]);

  const onSuccess = (message: string) => {
    showSnackbar(message, 'success'); // Show success snackbar
    dispatch(
      getSourceApprovals({
        projectId: loggedInUser.projectId,
        testMaterialId: testMaterialId,
      }),
    );
  };
  const validateSourceDetail = () => {
    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE: {
          const ratePerKG = Number(fineAggregate.ratePerKG);
          if (
            ratePerKG > 100000 ||
            !/^\d+(\.\d{1,3})?$/.test(ratePerKG.toString())
          ) {
            showSnackbar(
              'Rate per KG must be less than 100,000 and up to 3 decimal places.',
              'error',
            );
            return false;
          }
          break;
        }

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC: {
          const ratePerKG = Number(coarseAggregateDBMBC.ratePerKG);
          if (
            ratePerKG > 100000 ||
            !/^\d+(\.\d{1,3})?$/.test(ratePerKG.toString())
          ) {
            showSnackbar(
              'Rate per KG must be less than 100,000 and up to 3 decimal places.',
              'error',
            );
            return false;
          }
          if (
            !['37.5mm', '26.5mm', '19mm', '13.2mm', '10mm', '20mm'].includes(
              coarseAggregateDBMBC.nominalSize,
            )
          ) {
            showSnackbar(
              'Invalid nominal size for Coarse Aggregate (DBM/BC).',
              'error',
            );
            return false;
          }
          break;
        }

        case TEST_MATERIALS_TYPES.BITUMEN: {
          const ratePerMT = Number(bitumen.ratePerMT);
          if (
            ratePerMT > 100000 ||
            !/^\d+(\.\d{1,3})?$/.test(ratePerMT.toString())
          ) {
            showSnackbar(
              'Rate per MT must be less than 100,000 and up to 3 decimal places.',
              'error',
            );
            return false;
          }
          if (!['VG 30', 'VG 40', 'PMB'].includes(bitumen.gradeOfBitumen)) {
            showSnackbar('Invalid grade of Bitumen.', 'error');
            return false;
          }
          if (bitumen.bitumenBrand.length > 100) {
            showSnackbar(
              'Bitumen Brand must be less than 100 characters.',
              'error',
            );
            return false;
          }
          break;
        }

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING: {
          const ratePerKG = Number(coarseAggregateMicro.ratePerKG);
          if (
            ratePerKG > 100000 ||
            !/^\d+(\.\d{1,3})?$/.test(ratePerKG.toString())
          ) {
            showSnackbar(
              'Rate per KG must be less than 100,000 and up to 3 decimal places.',
              'error',
            );
            return false;
          }
          if (
            !['37.5mm', '26.5mm', '19mm', '13.2mm'].includes(
              coarseAggregateMicro.nominalSize,
            )
          ) {
            showSnackbar(
              'Invalid nominal size for Coarse Aggregate (Micro Surfacing).',
              'error',
            );
            return false;
          }
          break;
        }

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA: {
          const ratePerKG = Number(coarseAggregateSMA.ratePerKG);
          if (
            ratePerKG > 100000 ||
            !/^\d+(\.\d{1,3})?$/.test(ratePerKG.toString())
          ) {
            showSnackbar(
              'Rate per KG must be less than 100,000 and up to 3 decimal places.',
              'error',
            );
            return false;
          }
          if (
            !['37.5mm', '26.5mm', '19mm', '13.2mm'].includes(
              coarseAggregateSMA.nominalSize,
            )
          ) {
            showSnackbar(
              'Invalid nominal size for Coarse Aggregate (SMA).',
              'error',
            );
            return false;
          }
          break;
        }

        case TEST_MATERIALS_TYPES.EMULSION: {
          const ratePerMT = Number(emulsion.ratePerMT);
          if (
            ratePerMT > 100000 ||
            !/^\d+(\.\d{1,3})?$/.test(ratePerMT.toString())
          ) {
            showSnackbar(
              'Rate per MT must be less than 100,000 and up to 3 decimal places.',
              'error',
            );
            return false;
          }
          if (emulsion.gradeOfEmulsion.length > 100) {
            showSnackbar(
              'Grade of Emulsion must be less than 100 characters.',
              'error',
            );
            return false;
          }
          if (emulsion.emulsionBrand.length > 100) {
            showSnackbar(
              'Emulsion Brand must be less than 100 characters.',
              'error',
            );
            return false;
          }
          break;
        }

        default:
          showSnackbar('Unknown material type for Bituminous Works.', 'error');
          return false;
      }
    }else if(testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.EARTH_WORKS){
      const ratePerCum = Number(sourceDetailEarthWork.ratePerCum);
      if (
        ratePerCum > 100000 ||
        !/^\d+(\.\d{1,3})?$/.test(ratePerCum.toString())
      ) {
        showSnackbar(
          'Rate per Cum must be less than 100,000 and up to 3 decimal places.',
          'error',
        );
        return false;
    } else {
      // Validation for non-bituminous works
      const ratePerCum = Number(sourceDetailForm.ratePerCum);
      if (
        ratePerCum > 100000 ||
        !/^\d+(\.\d{1,3})?$/.test(ratePerCum.toString())
      ) {
        showSnackbar(
          'Rate per Cum must be less than 100,000 and up to 3 decimal places.',
          'error',
        );
        return false;
      }
    }

    return true;
  };

  //Need to change function logic
  const addSourceDetailsSubmit = () => {
    if (!validateSourceDetail()) return;
    let body;

    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          body = {
            name: fineAggregate.ratePerKG,
            metaData: {
              ratePerKG: Number(fineAggregate.ratePerKG),
            },
          };
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          body = {
            name: coarseAggregateDBMBC.nominalSize,
            metaData: {
              nominalSize: coarseAggregateDBMBC.nominalSize,
              ratePerKG: Number(coarseAggregateDBMBC.ratePerKG),
            },
          };
          break;

        case TEST_MATERIALS_TYPES.BITUMEN:
          body = {
            name: bitumen.gradeOfBitumen,
            metaData: {
              ratePerMT: Number(bitumen.ratePerMT),
              gradeOfBitumen: bitumen.gradeOfBitumen,
              bitumenBrand: bitumen.bitumenBrand,
            },
          };
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          body = {
            name: coarseAggregateMicro.nominalSize,
            metaData: {
              nominalSize: coarseAggregateMicro.nominalSize,
              ratePerKG: Number(coarseAggregateMicro.ratePerKG),
            },
          };
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          body = {
            name: coarseAggregateSMA.nominalSize,
            metaData: {
              nominalSize: coarseAggregateSMA.nominalSize,
              ratePerKG: Number(coarseAggregateSMA.ratePerKG),
            },
          };
          break;

        case TEST_MATERIALS_TYPES.EMULSION:
          body = {
            name: emulsion.gradeOfEmulsion,
            metaData: {
              ratePerMT: Number(emulsion.ratePerMT),
              gradeOfEmulsion: emulsion.gradeOfEmulsion,
              emulsionBrand: emulsion.emulsionBrand,
            },
          };
          break;

        default:
          console.error('Unknown material type for Bituminous Works');
          return;
      }
    }else if(testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.EARTH_WORKS){
      body = {
        name: sourceDetailEarthWork.ratePerCum,
        metaData: {
          ratePerCum: Number(sourceDetailEarthWork.ratePerCum),
        },
      };
    } else {
      body = {
        name: sourceDetailForm[gradeField.name],
        metaData: {
          [gradeField.name]: sourceDetailForm[gradeField.name],
          ratePerCum: Number(sourceDetailForm.ratePerCum),
        },
      };
    }

    if (selectedSourceDetail === null) {
      dispatch(
        addSourceDetail({
          projectId: loggedInUser.projectId,
          sourceApprovalId: selectedSource._id,
          body,
        }),
      );
    } else {
      dispatch(
        updateSourceDetail({
          projectId: loggedInUser.projectId,
          sourceApprovalId: selectedSource._id,
          id: selectedSourceDetail._id,
          body,
        }),
      );
    }
  };
  useEffect(() => {
    if (addedSourceDetail) {
      const updatedSourceDetails = [
        addedSourceDetail,
        ...sourceApprovalDetails,
      ];

      // Handle form reset based on material type
      if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
        switch (materialType) {
          case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
            setFineAggregate({
              sourceApprovalId: selectedSource._id,
              ratePerKG: 0.0,
            });
            break;

          case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
            setCoarseAggregateDBMBC({
              sourceApprovalId: selectedSource._id,
              nominalSize: '37.5mm',
              ratePerKG: 0.0,
            });
            break;

          case TEST_MATERIALS_TYPES.BITUMEN:
            setBitumen({
              sourceApprovalId: selectedSource._id,
              gradeOfBitumen: '',
              ratePerMT: 0.0,
              bitumenBrand: '',
            });
            break;

          case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
            setCoarseAggregateMicro({
              sourceApprovalId: selectedSource._id,
              nominalSize: '37.5mm',
              ratePerKG: 0.0,
            });
            break;

          case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
            setCoarseAggregateSMA({
              sourceApprovalId: selectedSource._id,
              nominalSize: '37.5mm',
              ratePerKG: 0.0,
            });
            break;

          case TEST_MATERIALS_TYPES.EMULSION:
            setEmulsion({
              sourceApprovalId: selectedSource._id,
              gradeOfEmulsion: 'VG 30',
              ratePerMT: 0.0,
              emulsionBrand: '',
            });
            break;

          default:
            console.warn(`Unknown material type: ${materialType}`);
        }
      } else {
        setSourceDetailForm({
          sourceApprovalId: selectedSource._id,
          [gradeField.name]: '',
          ratePerCum: 0,
        });
      }

      setSourceApprovalDetails(updatedSourceDetails);
      onSuccess('Source Details Added Successfully');
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [addedSourceDetail, error]);

  useEffect(() => {
    if (updatedSourceDetail && selectedSourceDetail) {
      const list = [...sourceApprovalDetails];
      const editedObj = list.find(
        (item: any) => item._id === selectedSourceDetail._id,
      );

      if (editedObj) {
        // Update object based on material type
        if (
          testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS
        ) {
          switch (materialType) {
            case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
              editedObj.name = fineAggregate.ratePerKG;
              editedObj.metaData.ratePerKG = fineAggregate.ratePerKG;
              break;

            case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
              editedObj.name = coarseAggregateDBMBC.nominalSize;
              editedObj.metaData.nominalSize = coarseAggregateDBMBC.nominalSize;
              editedObj.metaData.ratePerKG = coarseAggregateDBMBC.ratePerKG;
              break;

            case TEST_MATERIALS_TYPES.BITUMEN:
              editedObj.name = bitumen.gradeOfBitumen;
              editedObj.metaData.gradeOfBitumen = bitumen.gradeOfBitumen;
              editedObj.metaData.ratePerMT = bitumen.ratePerMT;
              editedObj.metaData.bitumenBrand = bitumen.bitumenBrand;
              break;

            case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
              editedObj.name = coarseAggregateMicro.nominalSize;
              editedObj.metaData.nominalSize = coarseAggregateMicro.nominalSize;
              editedObj.metaData.ratePerKG = coarseAggregateMicro.ratePerKG;
              break;

            case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
              editedObj.name = coarseAggregateSMA.nominalSize;
              editedObj.metaData.nominalSize = coarseAggregateSMA.nominalSize;
              editedObj.metaData.ratePerKG = coarseAggregateSMA.ratePerKG;
              break;

            case TEST_MATERIALS_TYPES.EMULSION:
              editedObj.name = sourceDetailForm.nominalSize;
              editedObj.metaData.gradeOfEmulsion = emulsion.gradeOfEmulsion;
              editedObj.metaData.ratePerMT = emulsion.ratePerMT;
              editedObj.metaData.emulsionBrand = emulsion.emulsionBrand;
              break;

            default:
              // Default logic for non-bituminous works
              console.error('Material type Not Found');
          }
        }else if(testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.EARTH_WORKS){
          editedObj.name = sourceDetailEarthWork.ratePerCum;
          editedObj.metaData.ratePerCum = sourceDetailEarthWork.ratePerCum;
        } else {
          editedObj.name = sourceDetailForm[gradeField.name];
          editedObj.metaData[gradeField.name] =
            sourceDetailForm[gradeField.name];
          editedObj.metaData.ratePerCum = sourceDetailForm.ratePerCum;
          setSourceApprovalDetails(list);
        }

        setSourceApprovalDetails(list);
      }

      // Reset form based on material type
      if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
        // Reset logic for bituminous materials (same as above in addedSourceDetail)
        switch (materialType) {
          case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
            setFineAggregate({
              sourceApprovalId: selectedSource._id,
              ratePerKG: 0.0,
            });
            break;

          case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
            setCoarseAggregateDBMBC({
              sourceApprovalId: selectedSource._id,
              nominalSize: '37.5mm',
              ratePerKG: 0.0,
            });
            break;

          case TEST_MATERIALS_TYPES.BITUMEN:
            setBitumen({
              sourceApprovalId: selectedSource._id,
              gradeOfBitumen: '',
              ratePerMT: 0.0,
              bitumenBrand: '',
            });
            break;

          case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
            setCoarseAggregateMicro({
              sourceApprovalId: selectedSource._id,
              nominalSize: '37.5mm',
              ratePerKG: 0.0,
            });
            break;

          case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
            setCoarseAggregateSMA({
              sourceApprovalId: selectedSource._id,
              nominalSize: '37.5mm',
              ratePerKG: 0.0,
            });
            break;

          case TEST_MATERIALS_TYPES.EMULSION:
            setEmulsion({
              sourceApprovalId: selectedSource._id,
              gradeOfEmulsion: 'VG 30',
              ratePerMT: 0.0,
              emulsionBrand: '',
            });
            break;

          default:
            console.warn(`Unknown material type: ${materialType}`);
        }
      } else {
        setSourceDetailForm({
          sourceApprovalId: selectedSource._id,
          [gradeField.name]: '',
          ratePerCum: 0,
        });
      }

      onSuccess('Source Details Updated Successfully');
      setSelectedSourceDetail(null);
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [updatedSourceDetail, error]);

  // useEffect(() => {
  //   if (addedSourceDetail) {
  //     setSourceApprovalDetails([addedSourceDetail, ...sourceApprovalDetails]);
  //     setSourceDetailForm({
  //       sourceApprovalId: selectedSource._id,
  //       [gradeField.name]: '',
  //       ratePerCum: 0,
  //     });
  //     onSuccess('Source Details Added Successfully');
  //   } else if (error) {
  //     showSnackbar(error, 'error');
  //   }
  // }, [addedSourceDetail, error]);
  // // Need to ask what it do

  // useEffect(() => {
  //   if (updatedSourceDetail && selectedSourceDetail) {
  //     const list = [...sourceApprovalDetails];
  //     const editedObj = list.find(
  //       (item: any) => item._id === selectedSourceDetail._id,
  //     );
  //     if (editedObj) {
  //       editedObj.name = sourceDetailForm[gradeField.name];
  //       editedObj.metaData[gradeField.name] = sourceDetailForm[gradeField.name];
  //       editedObj.metaData.ratePerCum = sourceDetailForm.ratePerCum;
  //       setSourceApprovalDetails(list);
  //     }

  //     setSourceDetailForm({
  //       sourceApprovalId: selectedSource._id,
  //       [gradeField.name]: '',
  //       ratePerCum: 0,
  //     });
  //     onSuccess('Source Details Updated Successfully');
  //     setSelectedSourceDetail(null);
  //   } else if (error) {
  //     showSnackbar(error, 'error');
  //   }
  // }, [updatedSourceDetail, error]);

  useEffect(() => {
    if (deletedSourceDetail) {
      setSourceApprovalDetails(
        sourceApprovalDetails.filter(
          (x: any) => x._id != selectedSourceDetail._id,
        ),
      );
      onSuccess('Source Details Removed Successfully');
      onPressAlertCancelButton();
      setSelectedSourceDetail(null);
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [deletedSourceDetail, error]);

  const handleSourceDetailDelete = (item: any) => {
    setSelectedSourceDetail(item);
    setConfirmationAlert(true);
  };

  const handleSourceDetailEdit = (item: any) => {
    setSelectedSourceDetail(item);
    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      switch (materialType) {
        case TEST_MATERIALS_TYPES.FINE_AGGREGATE:
          setFineAggregate({
            sourceApprovalId: item.sourceApprovalId,
            ratePerKG: item.metaData?.ratePerKG,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC:
          setCoarseAggregateDBMBC({
            sourceApprovalId: item.sourceApprovalId,
            nominalSize: item.metaData?.nominalSize,
            ratePerKG: item.metaData?.ratePerKG,
          });
          break;

        case TEST_MATERIALS_TYPES.BITUMEN:
          setBitumen({
            sourceApprovalId: item.sourceApprovalId,
            gradeOfBitumen: item.metaData?.gradeOfBitumen,
            ratePerMT: item.metaData?.ratePerMT,
            bitumenBrand: item.metaData?.bitumenBrand,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING:
          setCoarseAggregateMicro({
            sourceApprovalId: item.sourceApprovalId,
            nominalSize: item.metaData?.nominalSize,
            ratePerKG: item.metaData?.ratePerKG,
          });
          break;

        case TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA:
          setCoarseAggregateSMA({
            sourceApprovalId: item.sourceApprovalId,
            nominalSize: item.metaData?.nominalSize,
            ratePerKG: item.metaData?.ratePerKG,
          });
          break;

        case TEST_MATERIALS_TYPES.EMULSION:
          setEmulsion({
            sourceApprovalId: item.sourceApprovalId,
            gradeOfEmulsion: item.metaData?.gradeOfEmulsion,
            ratePerMT: item.metaData?.ratePerMT,
            emulsionBrand: item.metaData?.emulsionBrand,
          });
          break;

        default:
          console.warn(`Unknown material type: ${materialType}`);
      }
    } else {
      setSourceDetailForm({
        [gradeField.name]: item.metaData?.[gradeField.name],
        ratePerCum: '' + item.metaData?.ratePerCum,
        sourceApprovalId: item.sourceApprovalId,
      });
    }
  };

  const handleAddSource = () => {
    setSourceForm({
      name: '',
      location: '',
      vendorName: '',
      comments: '',
      status: SOURCE_APPROVAL_STATUS.PENDING,
    });
    setOpenSourceApprovalsPopup(true);
    setSelectedSource(null);
  };

  const addSourceApprovalsForm = () => {
    return (
      <View style={styles.reportFields}>
        <View>
          <Input
            label="Source Name"
            value={sourceForm.name}
            onChange={(value: string) => handleInputChange('name', value)}
            isRequired={true}
          />
        </View>
        <View>
          <Input
            label="Location"
            value={sourceForm.location}
            onChange={(value: string) => handleInputChange('location', value)}
            isRequired={true}
          />
        </View>
        <View>
          <Input
            label="Name of the Vendor"
            value={sourceForm.vendorName}
            onChange={(value: string) => handleInputChange('vendorName', value)}
            isRequired={true}
          />
        </View>
        <View>
          <Input
            label="Comments"
            value={sourceForm.comments}
            onChange={(value: string) => handleInputChange('comments', value)}
          />
        </View>
        <TouchableOpacity style={styles.btnContainer} onPress={handleSubmit}>
          <Text style={styles.submitBtn}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const addSourceDetailsForm = () => {
    if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
      if (materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE) {
        return (
          <View style={styles.reportFields}>
            <View>
              <Input
                label="Rate per KG"
                value={fineAggregate.ratePerKG}
                onChange={(value: number) =>
                  handleFineAggregateInputChange('ratePerKG', value)
                }
                isRequired={true}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={addSourceDetailsSubmit}>
              <Text style={styles.submitBtn}>Submit</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (materialType === TEST_MATERIALS_TYPES.EMULSION) {
        return (
          <View style={styles.reportFields}>
            <View>
              <Input
                label="Grade of Emulsion"
                value={emulsion.gradeOfEmulsion}
                onChange={(value: string) =>
                  handleEmulsionInputChange('gradeOfEmulsion', value)
                }
                isRequired={true}
              />
            </View>
            <View>
              <Input
                label="Rate per MT"
                value={emulsion.ratePerMT}
                onChange={(value: number) =>
                  handleEmulsionInputChange('ratePerMT', value)
                }
                isRequired={true}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Input
                label="Emulsion Brand"
                value={emulsion.emulsionBrand}
                onChange={(value: string) =>
                  handleEmulsionInputChange('emulsionBrand', value)
                }
                isRequired={true}
              />
            </View>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={addSourceDetailsSubmit}>
              <Text style={styles.submitBtn}>Submit</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (
        materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC
      ) {
        return (
          <View style={styles.reportFields}>
            <View>
              <DropdownPicker
                label="Nominal Size"
                items={[
                  {label: '37.5mm', value: '37.5mm'},
                  {label: '26.5mm', value: '26.5mm'},
                  {label: '19mm', value: '19mm'},
                  {label: '13.2mm', value: '13.2mm'},
                  {label: '10mm', value: '10mm'},
                  {label: '20mm', value: '20mm'},
                ]}
                value={coarseAggregateDBMBC.nominalSize}
                onChange={(value: string) =>
                  handleCoarseAggregateDBMBCInputChange('nominalSize', value)
                }
              />
            </View>
            <View>
              <Input
                label="Rate per KG"
                value={coarseAggregateDBMBC.ratePerKG}
                onChange={(value: number) =>
                  handleCoarseAggregateDBMBCInputChange('ratePerKG', value)
                }
                isRequired={true}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={addSourceDetailsSubmit}>
              <Text style={styles.submitBtn}>Submit</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (
        materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING
      ) {
        return (
          <View style={styles.reportFields}>
            <View>
              <DropdownPicker
                label="Nominal Size"
                items={[
                  {label: '37.5mm', value: '37.5mm'},
                  {label: '26.5mm', value: '26.5mm'},
                  {label: '19mm', value: '19mm'},
                  {label: '13.2mm', value: '13.2mm'},
                ]}
                value={coarseAggregateMicro.nominalSize}
                onChange={(value: string) =>
                  handleCoarseAggregateMicroInputChange('nominalSize', value)
                }
              />
            </View>
            <View>
              <Input
                label="Rate per KG"
                value={coarseAggregateMicro.ratePerKG}
                onChange={(value: number) =>
                  handleCoarseAggregateMicroInputChange('ratePerKG', value)
                }
                isRequired={true}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={addSourceDetailsSubmit}>
              <Text style={styles.submitBtn}>Submit</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA) {
        return (
          <View style={styles.reportFields}>
            <View>
              <DropdownPicker
                label="Nominal Size"
                items={[
                  {label: '37.5mm', value: '37.5mm'},
                  {label: '26.5mm', value: '26.5mm'},
                  {label: '19mm', value: '19mm'},
                  {label: '13.2mm', value: '13.2mm'},
                ]}
                value={coarseAggregateSMA.nominalSize}
                onChange={(value: string) =>
                  handleCoarseAggregateSMAInputChange('nominalSize', value)
                }
              />
            </View>
            <View>
              <Input
                label="Rate per KG"
                value={coarseAggregateSMA.ratePerKG}
                onChange={(value: number) =>
                  handleCoarseAggregateSMAInputChange('ratePerKG', value)
                }
                isRequired={true}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={addSourceDetailsSubmit}>
              <Text style={styles.submitBtn}>Submit</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (materialType === TEST_MATERIALS_TYPES.BITUMEN) {
        return (
          <View style={styles.reportFields}>
            <View>
              <DropdownPicker
                label="Grade of Bitumen"
                items={[
                  {label: 'VG 30', value: 'VG 30'},
                  {label: 'VG 40', value: 'VG 40'},
                  {label: 'PMB', value: 'PMB'},
                ]}
                value={bitumen.gradeOfBitumen}
                onChange={(value: string) =>
                  handleBitumenInputChange('gradeOfBitumen', value)
                }
              />
            </View>
            <View>
              <Input
                label="Rate per MT"
                value={bitumen.ratePerMT}
                onChange={(value: number) =>
                  handleBitumenInputChange('ratePerMT', value)
                }
                isRequired={true}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Input
                label="Bitumen Brand"
                value={bitumen.bitumenBrand}
                onChange={(value: string) =>
                  handleBitumenInputChange('bitumenBrand', value)
                }
                isRequired={true}
              />
            </View>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={addSourceDetailsSubmit}>
              <Text style={styles.submitBtn}>Submit</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }else if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
    }else if(testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.EARTH_WORKS){
      return (
        <View style={styles.reportFields}>
          <View>
            <View>
              <Input
                label="Rate per cum"
                value={sourceDetailEarthWork.ratePerCum}
                onChange={(value: number) =>
                  handleSourceDetailEarthWorkInputChange('ratePerCum', value)
                }
                isRequired={true}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={addSourceDetailsSubmit}>
            <Text style={styles.submitBtn}>Submit</Text>
          </TouchableOpacity>
        </View>
      );

    } else {
      return (
        <View style={styles.reportFields}>
          <View>
            <View>{renderPicker(gradeField.label, gradeField.name)}</View>
            <View>
              <Input
                label="Rate per cum"
                value={sourceDetailForm.ratePerCum}
                onChange={(value: number) =>
                  handleSourceDetailInputChange('ratePerCum', value)
                }
                isRequired={true}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={addSourceDetailsSubmit}>
            <Text style={styles.submitBtn}>Submit</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderPicker = (
    label: string,
    name: keyof FormSourceDetailState | any,
    options = [{label: 'Select', value: ''}].concat(gradeList),
  ) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sourceDetailForm[name]}
            style={styles.picker}
            onValueChange={itemValue =>
              handleSourceDetailInputChange(name, itemValue)
            }>
            {options.map((option, index) => (
              <Picker.Item
                key={index}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  const renderItem = ({item}: {item: any}) => (
    <>
    <View style={[commonStyles.sourceApprovalsBox, {borderColor: getBorderColor(item.status)}]}>
      <View style={commonStyles.boxRowWithBtn}>
      {item.status === SOURCE_APPROVAL_STATUS.APPROVED && 
      <View>
        <Image style={commonStyles.actionTypeIcon}
        source={require('./../../../images/Check_fill.png')} />
      </View>
      }
      {item.status === SOURCE_APPROVAL_STATUS.REJECTED && 
      <View>
        <Image style={commonStyles.actionTypeIcon}
        source={require('./../../../images/Close_round_fill.png')} />
      </View>
      }
        <View style={commonStyles.sourceContent}>
          <Text style={commonStyles.sourceContentSize}>{item.name}</Text>
        </View>
        <View style={commonStyles.editAddDeleteContainer}>
        {item.status !== SOURCE_APPROVAL_STATUS.APPROVED && (
          <>
          <Image
              style={commonStyles.editAddDeleteIcons}
              onPress={() => handleAdd(item)}
              source={require('./../../../images/plus.png')}
            />
            <Image
              style={commonStyles.editAddDeleteIcons}
              onPress={() => handleEdit(item)}
              source={require('./../../../images/edit-source.png')}
            />
            <Image
              style={commonStyles.editAddDeleteIcons}
              onPress={() => handleDelete(item)}
              source={require('./../../../images/delete.png')}
            />
            </>
          )}
          {item.status === SOURCE_APPROVAL_STATUS.APPROVED && <Text style={commonStyles.approveText}>Approved</Text>}
          {/* {item.status === SOURCE_APPROVAL_STATUS.REJECTED && <Text style={commonStyles.rejectText}>Rejected</Text>} */}
        </View>
      </View>
      {item.status === SOURCE_APPROVAL_STATUS.PENDING && (
      <>
      <View style={commonStyles.approvalRejectedContainer}>
        <TouchableOpacity onPress={() => onSourceStatusChanged(item, SOURCE_APPROVAL_STATUS.APPROVED)} 
          style={commonStyles.subActionRow}>
            <Image
                style={commonStyles.actionTypeIcon}
                source={require('./../../../images/Check_fill.png')} /> 
            <Text style={commonStyles.approveText}>
                Approve
            </Text>
        </TouchableOpacity> 
        <TouchableOpacity onPress={() => onSourceStatusChanged(item, SOURCE_APPROVAL_STATUS.REJECTED)} 
          style={commonStyles.subActionRow}>
          <Image
            style={commonStyles.actionTypeIcon}
            source={require('./../../../images/Close_round_fill.png')} />
          <Text style={commonStyles.rejectText}>
            Reject
          </Text>
        </TouchableOpacity>
      </View>
      </>
      )}
      {item.status === SOURCE_APPROVAL_STATUS.REJECTED && (
      <>
      <View style={commonStyles.approvalRejectedContainer}>
        <View style={commonStyles.subActionRow}>
            <Image
                style={commonStyles.actionTypeIcon}
                source={require('./../../../images/Check_fill.png')} /> 
            <Text style={commonStyles.approveText}>
                Approve
            </Text>
        </View>
      </View>
      </>
      )}
    </View>
    </>
  );

  const renderSourceDetailItem = ({item}: {item: any}) => (
    <View style={[styles.itemContainerSourceDetailList]}>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.iconContainer}>
        <Image
          style={styles.ActionIcon}
          tintColor={'#333'}
          onPress={() => handleSourceDetailEdit(item)}
          source={require('./../../../images/edit.png')}
        />
        <Image
          style={styles.ActionIcon}
          tintColor={'#333'}
          onPress={() => handleSourceDetailDelete(item)}
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
          <View style={commonStyles.rightAlignBtn}>
            <TouchableOpacity
              style={commonStyles.outLineBtn}
              onPress={() => handleAddSource()}>
              <Image style={commonStyles.addSourceIcon} source={require('./../../../images/add-circle.png')} />
              <Text style={commonStyles.btnTextSize}>Add Source</Text>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item._id}
              />
            </ScrollView>
          </View>
        </View>
      </View>
      {/* Add Source approvals */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={openSourceApprovalsPopup}
        onRequestClose={() => {
          setOpenSourceApprovalsPopup(!openSourceApprovalsPopup);
        }}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.AssignRoleText}>Add/Edit Source</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => {
                    setOpenSourceApprovalsPopup(!openSourceApprovalsPopup);
                    setSelectedSource(null);
                  }}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <ScrollView style={{paddingTop: 10, height: '85%'}}>
                  {addSourceApprovalsForm()}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Source details */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={openSourceDetailsPopup}
        onRequestClose={() => {
          setSelectedSource(null);
          setOpenSourceDetailsPopup(!openSourceDetailsPopup);
        }}>
        {selectedSource && (
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.ModalHeader}>
                  <Text style={styles.AssignRoleText}>
                    Add/Edit Source Details ({selectedSource.name})
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonClose}
                    onPress={() => {
                      setOpenSourceDetailsPopup(!openSourceDetailsPopup);
                      setSelectedSourceDetail(null);
                    }}>
                    <Image
                      style={styles.CloseIcon}
                      tintColor={'#333'}
                      source={require('./../../../images/menu/close-icon.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.ModalInnerContainer}>
                  <ScrollView style={{paddingTop: 10, height: '85%'}}>
                    {addSourceDetailsForm()}
                    <View>
                      <FlatList
                        data={sourceApprovalDetails}
                        renderItem={renderSourceDetailItem}
                        keyExtractor={item => item._id}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        )}
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
    padding: 15,
    backgroundColor: '#F1F6FF'
  },
  ActionIcon: {
    width: 20,
    height: 20,
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
    borderRadius: 4,
    borderLeftWidth: 8,
  },
  itemContainerSourceDetailList: {
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
    width: '100%',
  },
  uploadBtn: {
    borderRadius: 33,
    borderWidth: 1,
    borderColor: '#1d7dea',
    color: '#1d7dea',
    paddingVertical: 15,
    paddingHorizontal: 20,
    textAlign: 'center',
    maxWidth: 180,
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

export default SourceApprovals;
