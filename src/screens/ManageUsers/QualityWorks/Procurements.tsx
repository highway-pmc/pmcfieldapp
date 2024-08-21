import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, NativeEventEmitter, View, TouchableOpacity, Modal, ScrollView, FlatList, Alert } from 'react-native';
import { useSnackbar } from '../../../context/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../components/UI/Input';
import { useIsFocused } from '@react-navigation/native';
import { CONCRETE_GRADE_LIST, HeaderItems, SOURCE_APPROVAL_STATUS, TEST_MATERIALS_TYPES } from '../../../constants/constants';
import { Image } from 'react-native-elements';
import LoadingAnimation from '../../Common/LoadingAnimation';
import { Picker } from '@react-native-picker/picker';
import CalendarPicker from '../../../components/UI/CalenderPicker';
import { addProcurement, clearProcurements, deleteProcurement, getProcurements, getSourceApprovalsByStatus, updateProcurement } from '../actions';
import CustomAlert from '../../Common/CustomAlert';
import { getDbDate, getDbDateFromDDMMYYYY, getDisplayDate } from '../../../utils/Utils';
import DocumentPicker from 'react-native-document-picker';
import appConfig from '../../../common/app.config';

const Procurements = ({ route, navigation }: { route: any, navigation: any }) => {

    const { testWorkCategoryName, testMaterialName, materialType, testMaterialId } = route.params;
    const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
    const { procurements, addedProcurement, updatedProcurement, deletedProcurement,
        loading, error } = useSelector((state: any) => state.Procurements);
    const { sourceApprovalsByStatus,
    } = useSelector((state: any) => state.SourceApprovals);
    const [openProcurementsPopup, setOpenProcurementPopup] = useState(false);
    const [selectedProcurement, setSelectedProcurement]: any = useState(null);
    const [confirmationAlert, setConfirmationAlert] = useState(false);
    const [gradeField, setGradeField]: any = useState({});

    type FormState = {
        // projectId: string;
        sourceApprovalId: string;
        sourceApprovalDetailId: string;
        lotNo: string,
        procurementDateTime: string;
        vehicleNo: any[];
        vehicleNoTemp: any;
        invoiceFile: string;
    };
    const [vehicleNos, setVehicleNos]: any = useState([]);
    const [form, setForm]: any = useState<FormState>({
        // projectId: loggedInUser.projectId,
        sourceApprovalId: '',
        sourceApprovalDetailId: '',
        lotNo: '',
        [gradeField.name]: 0,
        procurementDateTime: '',
        vehicleNo: [],
        vehicleNoTemp: '',
        invoiceFile: '',
    });

    const [data, setData]: any = useState([]);

    const [sourceApprovals, setSourceApprovals]: any = useState([]);
    const [sourceApprovalDetails, setSourceApprovalDetails] = useState([]);

    if (useIsFocused()) {
        const eventEmitter = new NativeEventEmitter();
        eventEmitter.emit('headerEvent', HeaderItems.procurements);
    }

    const { showSnackbar } = useSnackbar();

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
                label: 'Grade Of Concrete'
            });
        } else if (materialType === TEST_MATERIALS_TYPES.CEMENT) {
            setGradeField({
                name: 'gradeOfCement',
                label: 'Grade Of Cement'
            });
        }
        dispatch(getProcurements({
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId
        }));

        dispatch(getSourceApprovalsByStatus({
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            status: SOURCE_APPROVAL_STATUS.APPROVED
        }));
    }, []);

    // unmount
    useEffect(() => () => {
        dispatch(clearProcurements());
    }, []);

    const handleDeleteAddedVehicle = (vehicleNo: any) => {
        const index = vehicleNos.indexOf(vehicleNo);
        if (index != -1) {
            vehicleNos.splice(index, 1);
            setVehicleNos([...vehicleNos]);
            setForm({ ...form });
        }
    };

    const onAddProcurement = () => {
        setSelectedProcurement(null);
        setSourceApprovalDetails([])
        setVehicleNos([]);
        setForm({
            sourceApprovalId: '',
            sourceApprovalDetailId: '',
            lotNo: '',
            [gradeField.name]: 0,
            procurementDateTime: '',
            vehicleNo: [],
            vehicleNoTemp: '',
            invoiceFile: '',
        });
        setOpenProcurementPopup(true);
    }

    const handleDelete = (item: any) => {
        setSelectedProcurement(item);
        setConfirmationAlert(true);
    };

    const onPressAlertOkButton = () => {
        dispatch(deleteProcurement({
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            id: selectedProcurement._id,
        }));
    }

    const onPressAlertCancelButton = () => {
        setSelectedProcurement(null);
        setConfirmationAlert(false);
    }

    const handleEdit = (item: any) => {
        setSelectedProcurement(item);
        setSourceApprovalDetails(sourceApprovals.find((x: any) => x._id === item.sourceApprovalId._id)?.sourceApprovalDetails)
        setVehicleNos(item.vehicleNo || []);
        setForm({
            sourceApprovalId: item.sourceApprovalId._id,
            sourceApprovalDetailId: item.sourceApprovalDetailId,
            lotNo: item.lotNo,
            [gradeField.name]: item.metaData[gradeField.name],
            procurementDateTime: getDisplayDate(item.procurementDateTime),
            vehicleNo: item.vehicleNo,
            vehicleNoTemp: '',
            invoiceFile: item.invoiceFile,
        });

        setOpenProcurementPopup(true);
    };

    const handleInputChange = (
      name: keyof FormState,
      value: string | number | [],
    ) => {
      let isValid = true;
      let errorMessage = '';

      if (name === 'vehicleNoTemp') {
        const vehicleNoRegex = /^\d{4}$/;
        if (!vehicleNoRegex.test(value as string)) {
          isValid = false;
          errorMessage = 'Last 4 digit of Vehicle number only';
        }
      }

      if (name === gradeField.name) {
        const quantityValue = parseFloat(value as string);
        if (
          isNaN(quantityValue) ||
          quantityValue <= 0 ||
          quantityValue > 20 ||
          value.toString().split('.')[1]?.length > 3
        ) {
          isValid = false;
          errorMessage =
            'Quantity must be between 0 and 20 with up to 3 decimal places.';
        }
      }
      setForm({...form, [name]: value});
      if (name === 'sourceApprovalId') {
        setSourceApprovalDetails(
          sourceApprovals.find((x: any) => x._id === value)
            ?.sourceApprovalDetails,
        );
      }
      if (!isValid) {
        showSnackbar(errorMessage, 'error');
      }
    };


    const handleSubmit = () => {
        
        if (!selectedProcurement) {
            dispatch(addProcurement({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId,
                body: {
                    sourceApprovalId: form.sourceApprovalId,
                    sourceApprovalDetailId: form.sourceApprovalDetailId,
                    lotNo: form.lotNo,
                    procurementDateTime: getDbDateFromDDMMYYYY(form.procurementDateTime),
                    vehicleNo: vehicleNos.length ? vehicleNos : [form.vehicleNo || ''],
                    invoiceFile: form.invoiceFile,
                    metaData: {
                        [gradeField.name]: Number(form[gradeField.name])
                    }
                }
            }));
        } else {
            dispatch(updateProcurement({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId,
                id: selectedProcurement._id,
                body: {
                    sourceApprovalId: form.sourceApprovalId,
                    sourceApprovalDetailId: form.sourceApprovalDetailId,
                    lotNo: form.lotNo,
                    procurementDateTime: getDbDateFromDDMMYYYY(form.procurementDateTime),
                    vehicleNo: vehicleNos.length ? vehicleNos : [form.vehicleNo || ''],
                    invoiceFile: form.invoiceFile,
                    metaData: {
                        [gradeField.name]: Number(form[gradeField.name])
                    }
                }
            }));
        }
        
    };

    useEffect(() => {
        if (addedProcurement) {
            setOpenProcurementPopup(false);
            showSnackbar('Procurement Added Successfully', 'success'); // Show success snackbar
            dispatch(getProcurements({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId
            }));
            uploadInvoice();
        } else if (error) {
            showSnackbar(error, 'error');
        }
    }, [addedProcurement, error]);

    useEffect(() => {
        if (updatedProcurement) {
            setOpenProcurementPopup(false);
            showSnackbar('Procurement Updated Successfully', 'success'); // Show success snackbar
            dispatch(getProcurements({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId
            }));
            uploadInvoice();
        } else if (error) {
            showSnackbar(error, 'error');
        }
    }, [updatedProcurement, error]);

    useEffect(() => {
        if (deletedProcurement) {
            showSnackbar('Procurement Deleted Successfully', 'success'); // Show success snackbar
            dispatch(getProcurements({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId
            }));
            onPressAlertCancelButton();
        } else if (error) {
            showSnackbar(error, 'error');
        }
    }, [deletedProcurement, error]);

    const onAddVehicle = () => {
      const vehicleNoTemp = form.vehicleNoTemp.trim();
      const vehicleNoRegex = /^\d{4}$/;

      if (vehicleNoTemp && vehicleNoRegex.test(vehicleNoTemp)) {
        if (!vehicleNos) {
          setVehicleNos([]);
        }

        const index = vehicleNos.indexOf(vehicleNoTemp);
        if (index === -1) {
          vehicleNos.push(vehicleNoTemp);
          form.vehicleNoTemp = '';
          setVehicleNos([...vehicleNos]);
          setForm({...form});
        }
        } else {
            // Show an error message using Snackbar or any other method
            showSnackbar('Vehicle number must be exactly 4 digits.', 'error');
        }
    }
    
    const [fileRes, setFileRes]: any = useState(null);

    const onDocumentPress = async () => {
        try {
            const result: any = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
                allowMultiSelection: false
            });
            const res = result[0];
            console.log('==res===', res)
            setFileRes(res);
        } catch (err) {
            console.log('======err2===', err)
            if (DocumentPicker.isCancel(err)) {
                showSnackbar('No document selected');
            } else {
                throw err;
            }
        }
    };

    const uploadInvoice = async() => {
        if (!fileRes) {
            return;
        }
        let urlOfS = `${appConfig.API_URL}/v1/auth/projects/${loggedInUser.projectId}/procurements/${!selectedProcurement? addedProcurement._id: selectedProcurement._id}/upload`;
        if (fileRes.size < 5000000) {
            let data = new FormData();
            data.append('file', fileRes);
            try {
                const responseOfFileUpload = await fetch(urlOfS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': appConfig.getToken()
                    },
                    body: data,
                });
                console.log('===responseOfFileUpload====', responseOfFileUpload)
                if (responseOfFileUpload.status == 200) {
                    let responseInJs = await responseOfFileUpload.json();
                    console.log('===responseInJs====', responseInJs)
                    let fileName = responseInJs.data.fileUrl; // file name which will be        sent from backend
                    showSnackbar('Upload Succesfull');
                    setFileRes(null);
                } else {
                    showSnackbar('Upload Failed');
                }
            } catch (err) {
                console.log('========err==', err)
                showSnackbar('Upload Failed');
                console.log(err, 'error in upload');
            }
        } else {
            showSnackbar('File size should not exceed 4 MB');
        }
    }

    const addProcurementsForm = () => {
        return (
            <View style={styles.reportFields}>
                <View>
                    <View>
                        {renderPicker('Select source', 'sourceApprovalId')}
                    </View>
                    <View>
                        {renderSourceDetailsPicker('Select source details', 'sourceApprovalDetailId')}
                    </View>
                    <View>
                        <Input
                            label="Lot No/Trip No/Invoice No"
                            value={form.lotNo}
                            onChange={(value: string) => handleInputChange('lotNo', value)}
                            isRequired={true}
                        />
                    </View>
                    <View>
                        <Input
                            label="Qty (in cum)"
                            value={''+form[gradeField.name]}
                            onChange={(value: string) => handleInputChange(gradeField.name, value)}
                            isRequired={true}
                        />
                    </View>
                    <View>
                        <CalendarPicker
                            label="Date"
                            value={form.procurementDateTime}
                            onChange={date => handleInputChange('procurementDateTime', date)}
                        />
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', width: '100%', display: 'flex', gap: 10 }}>
                            <View style={{ width: '70%' }}>
                                <Input
                                    label="Vehicle no."
                                    value={form.vehicleNoTemp}
                                    onChange={(value: string) => handleInputChange('vehicleNoTemp', value)}
                                />
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity style={styles.add_vehicle} onPress={onAddVehicle}>
                                    <Text style={styles.btnAddVehicle}>Add Vehicle</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ maxHeight: 400 }}>
                            <ScrollView>
                                <FlatList
                                    data={vehicleNos}
                                    renderItem={renderAddedVehicleItem}
                                    keyExtractor={item => item}
                                />
                            </ScrollView>
                        </View>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity style={styles.upload_container} onPress={onDocumentPress}>
                                    <Text style={styles.uploadBtn}>Upload Invoice</Text>
                                </TouchableOpacity>
                                {fileRes && <Text>{fileRes.name}</Text>}
                        </View>
                        {
                            selectedProcurement?.invoiceFile && <Image source={{uri: selectedProcurement.invoiceFile}} style={{width: 300, height: 200}}></Image>
                        }
                    </View>
                </View>
                <TouchableOpacity style={styles.btnContainer} onPress={handleSubmit}>
                    <Text style={styles.submitBtn}>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderPicker = (
        label: string,
        name: keyof FormState,
        options = [{ name: 'Select', _id: '' }].concat(sourceApprovals),
    ) => {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={form[name]}
                        style={styles.picker}
                        onValueChange={itemValue => handleInputChange(name, itemValue)}>
                        {options.map((option, index) => (
                            <Picker.Item key={index} label={option['name']} value={option['_id']} />
                        ))}
                    </Picker>
                </View>
            </View>
        );
    }

    const renderSourceDetailsPicker = (
        label: string,
        name: keyof FormState,
        options = [{ name: 'Select', _id: '' }].concat(sourceApprovalDetails),
    ) => {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={form[name]}
                        style={styles.picker}
                        onValueChange={itemValue => handleInputChange(name, itemValue)}>
                        {options.map((option, index) => (
                            <Picker.Item key={index} label={option['name']} value={option['_id']} />
                        ))}
                    </Picker>
                </View>
            </View>
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.itemContainer]}>
            <Text style={styles.itemText}>{item.lotNo}</Text>
            <View style={styles.iconContainer}>
                <Image style={styles.ActionIcon}
                    tintColor={'#333'} onPress={() => handleEdit(item)}
                    source={require('./../../../images/edit.png')}
                />
                <Image style={styles.ActionIcon}
                    tintColor={'#333'} onPress={() => handleDelete(item)}
                    source={require('./../../../images/trash.png')}
                />
            </View>
        </View>
    );

    const renderAddedVehicleItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainerVehicleList}>
            <Text style={styles.itemText}>{item}</Text>
            <View style={styles.iconContainer}>
                <Image style={styles.ActionIcon}
                    tintColor={'#333'} onPress={() => handleDeleteAddedVehicle(item)}
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
                        <TouchableOpacity style={styles.btnContainer} onPress={() => onAddProcurement()}>
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
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.ModalHeader}>
                                <Text style={styles.AssignRoleText}>Add Procurement</Text>
                                <TouchableOpacity
                                    style={styles.buttonClose}
                                    onPress={() => setOpenProcurementPopup(!openProcurementsPopup)}>
                                    <Image style={styles.CloseIcon}
                                        tintColor={'#333'}
                                        source={require('./../../../images/menu/close-icon.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalInnerContainer}>
                                <ScrollView style={{ paddingTop: 10, height: '85%' }}>
                                    {
                                        addProcurementsForm()
                                    }
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
}

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
        width: 210
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
        margin: 'auto'
    },
    add_vehicle: {
        borderRadius: 4,
        display: 'flex',
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

export default Procurements;
