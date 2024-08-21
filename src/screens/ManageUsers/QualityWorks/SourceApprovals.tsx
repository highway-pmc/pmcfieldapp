import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, NativeEventEmitter, View, TouchableOpacity, Modal, ScrollView, FlatList, Alert } from 'react-native';
import { useSnackbar } from '../../../context/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../components/UI/Input';
import { useIsFocused } from '@react-navigation/native';
import { CEMENT_GRADE_LIST, CONCRETE_GRADE_LIST, HeaderItems, SOURCE_APPROVAL_STATUS, TEST_MATERIALS_TYPES } from '../../../constants/constants';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingAnimation from '../../Common/LoadingAnimation';
import { Picker } from '@react-native-picker/picker';
import { addSourceApproval, addSourceDetail, clearSourceApprovals, deleteSourceApproval, deleteSourceDetail, getSourceApprovals, patchSourceApproval, updateSourceApproval, updateSourceDetail } from '../actions';
import CustomAlert from '../../Common/CustomAlert';

const SourceApprovals = ({ route, navigation }: { route: any, navigation: any }) => {

    const { testWorkCategoryName, testMaterialName, materialType, testMaterialId } = route.params;
    const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
    const { sourceApprovals, sourceApprovalsByStatus, addedSourceApproval, patchedSourceApproval,
        updatedSourceApproval, deletedSourceApproval, addedSourceDetail, updatedSourceDetail, deletedSourceDetail,
        loading, error } = useSelector((state: any) => state.SourceApprovals);
    const [openSourceApprovalsPopup, setOpenSourceApprovalsPopup] = useState(false);
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

    const { showSnackbar } = useSnackbar();

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
                label: 'Grade Of Concrete'
            });
            setGradeList(CONCRETE_GRADE_LIST);
        } else if (materialType === TEST_MATERIALS_TYPES.CEMENT) {
            setGradeField({
                name: 'gradeOfCement',
                label: 'Grade Of Cement'
            });
            setGradeList(CEMENT_GRADE_LIST);
        }
        dispatch(getSourceApprovals({
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId
        }));
    }, []);

    // unmount
    useEffect(() => () => {
        dispatch(clearSourceApprovals());
    }, []);

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

    const [sourceDetailForm, setSourceDetailForm]: any = useState<FormSourceDetailState>({
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
            dispatch(deleteSourceApproval({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId,
                id: selectedSource._id,
            }));
        } else {
            dispatch(deleteSourceDetail({
                projectId: loggedInUser.projectId,
                sourceApprovalId: selectedSource._id,
                id: selectedSourceDetail._id,
            }));
        }
    }

    const onPressAlertCancelButton = () => {
        if (selectedSourceDetail === null) {
            setSelectedSource(null);
        } else {
            setSelectedSourceDetail(null);
        }
        setConfirmationAlert(false);
    }

    const handleEdit = (item: any) => {
        setSelectedSource(item);
        setSourceForm({
            name: item.name,
            location: item.location,
            vendorName: item.vendorName,
            comments: item.comments,
            status: item.status
        });
        setOpenSourceApprovalsPopup(true);
    };

    const handleAdd = (item: any) => {
        setSelectedSource(item);
        setSelectedSourceDetail(null);
        setSourceApprovalDetails(item.sourceApprovalDetails || []);
        setSourceDetailForm({
            sourceApprovalId: item._id,
            [gradeField.name]: '',
            ratePerCum: 0,
        });
        setOpenSourceDetailsPopup(true)
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

    const handleInputChange = (
      name: keyof FormState,
      value: string | number,
    ) => {
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

    const handleSourceDetailInputChange = (name: keyof FormSourceDetailState, value: string | number) => {
        setSourceDetailForm({ ...sourceDetailForm, [name]: value });
    };

    const handleSubmit = () => {
        if (selectedSource == null) {
            dispatch(addSourceApproval({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId,
                body: sourceForm
            }));
        } else {
            dispatch(updateSourceApproval({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId,
                id: selectedSource._id,
                body: sourceForm
            }));
        }
    };

    const onSourceStatusChanged = (item: any, status: any) => {
        dispatch(patchSourceApproval({
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            id: item._id,
            body: {
                status: status
            }
        }));
    }

    useEffect(() => {
        if (patchedSourceApproval) {
            setOpenSourceApprovalsPopup(false);
            showSnackbar('Source status updated successfully', 'success'); // Show success snackbar
            dispatch(getSourceApprovals({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId
            }));
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
        dispatch(getSourceApprovals({
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId
        }));
    }

    const addSourceDetailsSubmit = () => {
        if (selectedSourceDetail === null) {
            dispatch(addSourceDetail({
                projectId: loggedInUser.projectId,
                sourceApprovalId: selectedSource._id,
                body: {
                    name: sourceDetailForm[gradeField.name],
                    metaData: {
                        [gradeField.name]: sourceDetailForm[gradeField.name],
                        ratePerCum: Number(sourceDetailForm.ratePerCum),
                    }
                }
            }));
        } else {
            dispatch(updateSourceDetail({
                projectId: loggedInUser.projectId,
                sourceApprovalId: selectedSource._id,
                id: selectedSourceDetail._id,
                body: {
                    name: sourceDetailForm[gradeField.name],
                    metaData: {
                        [gradeField.name]: sourceDetailForm[gradeField.name],
                        ratePerCum: Number(sourceDetailForm.ratePerCum),
                    }
                }
            }));
        }
    };

    useEffect(() => {
        if (addedSourceDetail) {
            setSourceApprovalDetails([addedSourceDetail, ...sourceApprovalDetails]);
            setSourceDetailForm({
                sourceApprovalId: selectedSource._id,
                [gradeField.name]: '',
                ratePerCum: 0,
            });
            onSuccess('Source Details Added Successfully');
        } else if (error) {
            showSnackbar(error, 'error');
        }
    }, [addedSourceDetail, error]);

    useEffect(() => {
        if (updatedSourceDetail && selectedSourceDetail) {
            const list = [...sourceApprovalDetails];
            const editedObj = list.find((item: any) => item._id === selectedSourceDetail._id);
            if (editedObj) {
                editedObj.name = sourceDetailForm[gradeField.name];
                editedObj.metaData[gradeField.name] = sourceDetailForm[gradeField.name];
                editedObj.metaData.ratePerCum = sourceDetailForm.ratePerCum;
                setSourceApprovalDetails(list);
            }

            setSourceDetailForm({
                sourceApprovalId: selectedSource._id,
                [gradeField.name]: '',
                ratePerCum: 0,
            });
            onSuccess('Source Details Updated Successfully');
            setSelectedSourceDetail(null);
        } else if (error) {
            showSnackbar(error, 'error');
        }
    }, [updatedSourceDetail, error]);

    useEffect(() => {
        if (deletedSourceDetail) {
            setSourceApprovalDetails(sourceApprovalDetails.filter((x: any) => x._id != selectedSourceDetail._id));
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
        setSourceDetailForm({
            [gradeField.name]: item.metaData?.[gradeField.name],
            ratePerCum: '' + item.metaData?.ratePerCum,
            sourceApprovalId: item.sourceApprovalId,
        });
        
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
    }

    const addSourceApprovalsForm = () => {
        return (
            <View style={styles.reportFields}>
                <View>
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
                </View>
                <TouchableOpacity style={styles.btnContainer} onPress={handleSubmit}>
                    <Text style={styles.submitBtn}>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const addSourceDetailsForm = () => {
        return (
            <View style={styles.reportFields}>
                <View>
                    <View>
                        {renderPicker(gradeField.label, gradeField.name)}
                    </View>
                    <View>
                        <Input
                            label="Rate per cum"
                            value={sourceDetailForm.ratePerCum}
                            onChange={(value: string) => handleSourceDetailInputChange('ratePerCum', value)}
                            isRequired={true}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.btnContainer} onPress={addSourceDetailsSubmit}>
                    <Text style={styles.submitBtn}>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderPicker = (
        label: string,
        name: keyof FormSourceDetailState | any,
        options = [{ label: 'Select', value: '' }].concat(gradeList),
    ) => {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={sourceDetailForm[name]}
                        style={styles.picker}
                        onValueChange={itemValue => handleSourceDetailInputChange(name, itemValue)}>
                        {options.map((option, index) => (
                            <Picker.Item key={index} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
            </View>
        );
    }

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.itemContainer, { borderLeftColor: getBorderColor(item.status) }]}>
            <Text style={styles.itemText}>{item.name}</Text>
            {/* <Text style={styles.itemText}>{item.status}</Text> */}
            <View style={{ flexDirection: 'column' }}>
                {
                    item.status !== SOURCE_APPROVAL_STATUS.APPROVED &&
                    <View style={styles.iconContainer}>
                        <Image style={styles.ActionIcon}
                            tintColor={'#333'} onPress={() => handleAdd(item)}
                            source={require('./../../../images/add-square.png')}
                        />
                        <Image style={styles.ActionIcon}
                            tintColor={'#333'} onPress={() => handleEdit(item)}
                            source={require('./../../../images/edit.png')} />
                        <Image style={styles.ActionIcon}
                            tintColor={'#333'} onPress={() => handleDelete(item)}
                            source={require('./../../../images/trash.png')}
                        />
                    </View>
                }
                {
                    item.status === SOURCE_APPROVAL_STATUS.PENDING ?
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                            <Text onPress={() => onSourceStatusChanged(item, SOURCE_APPROVAL_STATUS.APPROVED)}>Approve</Text>
                            <Text onPress={() => onSourceStatusChanged(item, SOURCE_APPROVAL_STATUS.REJECTED)}>Reject</Text>
                        </View>
                        :
                        item.status === SOURCE_APPROVAL_STATUS.REJECTED &&
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                            <Text onPress={() => onSourceStatusChanged(item, SOURCE_APPROVAL_STATUS.APPROVED)}>Approve</Text>
                        </View>
                }
            </View>
        </View>
    );

    const renderSourceDetailItem = ({ item }: { item: any }) => (
        <View style={[styles.itemContainerSourceDetailList]}>
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.iconContainer}>
                <Image style={styles.ActionIcon}
                    tintColor={'#333'} onPress={() => handleSourceDetailEdit(item)}
                    source={require('./../../../images/edit.png')}
                />
                <Image style={styles.ActionIcon}
                    tintColor={'#333'} onPress={() => handleSourceDetailDelete(item)}
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
                        <Text style={styles.AssignRoleText}>{testWorkCategoryName + ' > ' + testMaterialName}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.btnContainer} onPress={() => handleAddSource()}>
                            <Text style={styles.submitBtn}>Add Source</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <ScrollView>
                            <View style={styles.legends}>
                                <View style={styles.legendContainer}>
                                    <Text style={styles.approve}></Text>
                                    <Text style={styles.approveText}>Approved</Text>
                                </View>
                                <View style={styles.legendContainer}>
                                    <Text style={styles.rejected}></Text>
                                    <Text style={styles.rejectText}>Rejected</Text>
                                </View>
                            </View>
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
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.ModalHeader}>
                                <Text style={styles.AssignRoleText}>Add/Edit Source</Text>
                                <TouchableOpacity
                                    style={styles.buttonClose}
                                    onPress={() => {setOpenSourceApprovalsPopup(!openSourceApprovalsPopup); setSelectedSource(null)}}>
                                    <Image style={styles.CloseIcon}
                                        tintColor={'#333'}
                                        source={require('./../../../images/menu/close-icon.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalInnerContainer}>
                                <ScrollView style={{ paddingTop: 10, height: '85%' }}>
                                    {
                                        addSourceApprovalsForm()
                                    }
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
                {
                    selectedSource && <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={styles.ModalHeader}>
                                    <Text style={styles.AssignRoleText}>Add/Edit Source Details ({selectedSource.name})</Text>
                                    <TouchableOpacity
                                        style={styles.buttonClose}
                                        onPress={() => {setOpenSourceDetailsPopup(!openSourceDetailsPopup); setSelectedSourceDetail(null)}}>
                                        <Image style={styles.CloseIcon}
                                            tintColor={'#333'}
                                            source={require('./../../../images/menu/close-icon.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.ModalInnerContainer}>
                                    <ScrollView style={{ paddingTop: 10, height: '85%' }}>
                                        {
                                            addSourceDetailsForm()
                                        }
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
                }

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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
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
        textAlign: 'center'
    },
    rejected: {
        width: 20,
        height: 20,
        borderRadius: 100,
        backgroundColor: '#DD0303',
        color: '#fff',
        textAlign: 'center'
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
        flexDirection: 'row'
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
        fontWeight: "500",
        color: '#333',
        marginBottom: 5,
        width: '100%'
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
            minWidth: '100%'
        }
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
    },
    saveBtn: {
        fontSize: 14,
        fontWeight: "600",
        color: 'white',
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 25,
        minWidth: 100,
        textAlign: 'center'
    },
    submitBtn: {
        fontSize: 14,
        fontWeight: "600",
        color: 'white',
        padding: 12,
        borderRadius: 25,
        backgroundColor: '#1d7dea',
        minWidth: 100,
        textAlign: 'center'
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
        width: '100%'
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
        margin: 'auto'
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
        alignItems: 'center'
    },
    addmoreInput: {
        width: '90%'
    },
    AssignRoleText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#27272A',
        marginLeft: 5,
    },
});

export default SourceApprovals;
