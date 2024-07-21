import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, NativeEventEmitter, View, TouchableOpacity, Modal, ScrollView, FlatList, Alert } from 'react-native';
import { useSnackbar } from '../../../context/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../components/UI/Input';
import { useIsFocused } from '@react-navigation/native';
import { CONCRETE_GRADE_LIST, HeaderItems, SOURCE_APPROVAL_STATUS } from '../../../constants/constants';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingAnimation from '../../Common/LoadingAnimation';
import { Picker } from '@react-native-picker/picker';
import CalendarPicker from '../../../components/UI/CalenderPicker';
import { addProcurement, clearProcurements, getProcurements, getSourceApprovalsByStatus } from '../actions';

const Procurements = ({ route, navigation }: { route: any, navigation: any }) => {

    const { testWorkCategoryName, testMaterialName, testMaterialId } = route.params;
    const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
    const { procurements, addedProcurement, updatedProcurement, deletedProcurement,
        loading, error} = useSelector((state: any) => state.Procurements);
    const { sourceApprovalsByStatus,
        } = useSelector((state: any) => state.SourceApprovals);
    const [openProcurementsPopup, setOpenProcurementPopup] = useState(false);

    type FormState = {
        // projectId: string;
         sourceApprovalId: string;
         lotNo: string,
         qtyOfConcrete: number;
         procurementDateTime: string;
         vehicleNo: any[];
         vehicleNoTemp: any;
         invoiceFile: string;
     };
     const [vehicleNos, setVehicleNos]: any = useState([]);
     const [form, setForm] = useState<FormState>({
        // projectId: loggedInUser.projectId,
         sourceApprovalId: '',
         lotNo: '',
         qtyOfConcrete: 0,
         procurementDateTime: '',
         vehicleNo: [],
         vehicleNoTemp: '',
         invoiceFile: '',
     });
 
     const [data, setData]: any = useState([]);

     const [sourceApprovals, setSourceApprovals] = useState([]);

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
    useEffect( () => () => {
        dispatch(clearProcurements());
    }, [] );

      const handleDelete = (id: any) => {
        setData(data.filter((item: any) => item.id !== id));
      };

      const handleDeleteAddedVehicle = (vehicleNo: any) => {
        const index = vehicleNos.indexOf(vehicleNo);
        if (index != -1) {
            vehicleNos.splice(index, 1);
            setVehicleNos([...vehicleNos]);
            setForm({...form});
        }
      };
    
      const handleEdit = (id: any) => {
        // Edit logic here
        Alert.alert('Edit ' + id);
      };

    const handleInputChange = (name: keyof FormState, value: string | number | []) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        //showSnackbar('Updated Successfully', 'success', 'done'); // Show success snackbar
        const dateTimeArray = form.procurementDateTime?.split('/');
        dispatch(addProcurement({
            projectId: loggedInUser.projectId,
            testMaterialId: testMaterialId,
            body: {
                sourceApprovalId: form.sourceApprovalId,
                lotNo: form.lotNo,
                procurementDateTime: (dateTimeArray[2]+'-'+dateTimeArray[1]+'-'+dateTimeArray[0]),
                vehicleNo: vehicleNos.length ? vehicleNos : [form.vehicleNo || ''],
                invoiceFile: form.invoiceFile,
                metaData: {
                    qtyOfConcrete: Number(form.qtyOfConcrete)
                }
        }
        }));
    };

    useEffect(() => {
        if (addedProcurement) {
            setOpenProcurementPopup(false);
            showSnackbar('Procurement Added Successfully', 'success'); // Show success snackbar
            dispatch(getProcurements({
                projectId: loggedInUser.projectId,
                testMaterialId: testMaterialId
            }));
        }
      }, [addedProcurement, error]);

    const onAddVehicle = () => {
        if (form.vehicleNoTemp) {
            if (!vehicleNos) {
                setVehicleNos([]);
            }
            const index = vehicleNos.indexOf(form.vehicleNoTemp);
            if (index === -1) {
                vehicleNos.push(form.vehicleNoTemp);
                form.vehicleNoTemp = '';
                setVehicleNos([...vehicleNos]);
                setForm({...form});
            }
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
                            value={form.qtyOfConcrete}
                            onChange={(value: string) => handleInputChange('qtyOfConcrete', value)}
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
                        <View style={{flexDirection: 'row', width: '100%', display: 'flex', gap: 10}}>
                            <View style={{width: '70%'}}>
                                <Input
                                    label="Vehicle no."
                                    value={form.vehicleNoTemp}
                                    onChange={(value: string) => handleInputChange('vehicleNoTemp', value)}
                                />
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <TouchableOpacity style={styles.add_vehicle} onPress={onAddVehicle}>
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
                    <TouchableOpacity style={styles.upload_container}>
                        <Text style={styles.uploadBtn}>Upload Invoice</Text>
                    </TouchableOpacity>
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
        options = sourceApprovals,
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
      
    const renderItem = ({ item }: {item: any}) => (
        <View style={[styles.itemContainer]}>
          <Text style={styles.itemText}>{item.lotNo}</Text>
          <View style={styles.iconContainer}>
            <Icon.Button 
              style={styles.icon} 
              name="edit" 
              backgroundColor="transparent"
              color="green"
              onPress={() => handleEdit(item.id)}
            >
            </Icon.Button>
            <Icon.Button 
              style={styles.icon} 
              name="trash" 
              backgroundColor="transparent"
              color="red"
              onPress={() => handleDelete(item.id)}
            >
            </Icon.Button>
          </View>
        </View>
      );

      const renderAddedVehicleItem = ({ item }: {item: any}) => (
        <View style={styles.itemContainerVehicleList}>
          <Text style={styles.itemText}>{item}</Text>
          <View style={styles.iconContainer}>
            <Icon.Button 
              style={styles.icon} 
              name="trash" 
              backgroundColor="transparent"
              color="red"
              onPress={() => handleDeleteAddedVehicle(item)}
            >
            </Icon.Button>
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
                        <TouchableOpacity style={styles.btnContainer} onPress={() => setOpenProcurementPopup(true)}>
                            <Text style={styles.submitBtn}>Add procurement</Text>
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
            <LoadingAnimation loading={/*loading || loadingUsers || loadingTestWorkCategory*/ false}></LoadingAnimation>
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
      legends:{
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
      },
      approve:{
        width: 20,
        height: 20,
        borderRadius: 100,
        backgroundColor: '#2BC267',
        color: '#fff',
        textAlign: 'center'
      },
      rejected:{
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
      legendContainer:{
        display: 'flex',
        gap: 5,
        alignItems: 'center',
        flexDirection: 'row'
      },
      approveText:{
        color: '#2BC267',
      },
      rejectText:{
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
    add_vehicle:{
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
