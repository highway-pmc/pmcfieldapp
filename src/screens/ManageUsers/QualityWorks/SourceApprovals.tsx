import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, NativeEventEmitter, View, TouchableOpacity, Modal, ScrollView, FlatList, Alert } from 'react-native';
import { useSnackbar } from '../../../context/SnackbarContext';
import { useSelector } from 'react-redux';
import Input from '../../../components/UI/Input';
import { useIsFocused } from '@react-navigation/native';
import { CONCRETE_GRADE_LIST, HeaderItems, SOURCE_APPROVAL_STATUS } from '../../../constants/constants';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoadingAnimation from '../../Common/LoadingAnimation';
import { Picker } from '@react-native-picker/picker';

const SourceApprovals = ({ route, navigation }: { route: any, navigation: any }) => {

    const { testWorkCategoryName, testMaterialName, testMaterialId } = route.params;
    const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
    const [openSourceApprovalsPopup, setOpenSourceApprovalsPopup] = useState(false);
    const [openSourceDetailsPopup, setOpenSourceDetailsPopup] = useState(false);

    if (useIsFocused()) {
        const eventEmitter = new NativeEventEmitter();
        eventEmitter.emit('headerEvent', HeaderItems.sourceApprovals);
    }

    const { showSnackbar } = useSnackbar();

    type FormState = {
        projectId: string;
        testMaterialId: string;
        name: string;
        location: string;
        vendorName: string;
        comments: string;
        status: string;
        ratePerCum: number;
    };

    const [form, setForm] = useState<FormState>({
        projectId: loggedInUser.projectId,
        testMaterialId: testMaterialId,
        name: '',
        location: '',
        vendorName: '',
        comments: '',
        status: SOURCE_APPROVAL_STATUS.PENDING,
        ratePerCum: 0
    });

    const initialData = [
        { id: '1', name: 'Item 1', type: 'approve' },
        { id: '2', name: 'Item 2', type: 'reject' },
        { id: '3', name: 'Item 3', type: 'approve' },
      ];

      const [data, setData] = useState(initialData);

      const handleDelete = (id: any) => {
        setData(data.filter(item => item.id !== id));
      };
    
      const handleEdit = (id: any) => {
        // Edit logic here
        Alert.alert('Edit ' + id);
      };
    
      const handleAdd = (id: any) => {
        setOpenSourceDetailsPopup(!openSourceDetailsPopup)
      };
    
      const getBorderColor = (type: any) => {
        switch (type) {
          case 'approve':
            return 'green';
          case 'reject':
            return 'red';
          default:
            return 'gray';
        }
      };

    const handleInputChange = (name: keyof FormState, value: string | number) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        console.log('Form Submitted', form);
        showSnackbar('Updated Successfully', 'success', 'done'); // Show success snackbar
    };

    const addSourceDetailsSubmit = () => {
        console.log('Form Submitted', form);
        showSnackbar('Updated Successfully', 'success', 'done'); // Show success snackbar
    };

    const addSourceApprovalsForm = () => {
        return (
            <View style={styles.reportFields}>
                <View>
                    <View>
                        <Input
                            label="Source Name"
                            value={form.name}
                            onChange={(value: string) => handleInputChange('name', value)}
                            isRequired={true}
                        />
                    </View>
                    <View>
                        <Input
                            label="Location"
                            value={form.location}
                            onChange={(value: string) => handleInputChange('location', value)}
                            isRequired={true}
                        />
                    </View>
                    <View>
                        <Input
                            label="Name of the Vendor"
                            value={form.vendorName}
                            onChange={(value: string) => handleInputChange('vendorName', value)}
                            isRequired={true}
                        />
                    </View>
                    <View>
                        <Input
                            label="Comments"
                            value={form.comments}
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
                        {renderPicker('Grade of Concrete', 'name')}
                    </View>
                    <View>
                        <Input
                            label="Rate per cum"
                            value={form.ratePerCum}
                            onChange={(value: string) => handleInputChange('ratePerCum', value)}
                            isRequired={true}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.btnContainer} onPress={addSourceDetailsSubmit}>
                    <Text style={styles.submitBtn}>Add source details</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderPicker = (
        label: string,
        name: keyof FormState,
        options = CONCRETE_GRADE_LIST,
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
                  <Picker.Item key={index} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>
        );
      }
      
    const renderItem = ({ item }: {item: any}) => (
        <View style={[styles.itemContainer, { borderLeftColor: getBorderColor(item.type) }]}>
          <Text style={styles.itemText}>{item.name}</Text>
          <View style={styles.iconContainer}>
            <Icon.Button 
              style={styles.icon} 
              name="plus-square-o" 
              backgroundColor="transparent"
              color="black"
              onPress={() => handleAdd(item.id)}
            >
            </Icon.Button>
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

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.reportFields}>
                    <View>
                        <Text style={styles.AssignRoleText}>{testWorkCategoryName + ' > ' + testMaterialName}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.btnContainer} onPress={() => setOpenSourceApprovalsPopup(true)}>
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
                visible={openSourceApprovalsPopup}
                onRequestClose={() => {
                    setOpenSourceApprovalsPopup(!openSourceApprovalsPopup);
                }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.ModalHeader}>
                                <Text style={styles.AssignRoleText}>Add Source</Text>
                                <TouchableOpacity
                                    style={styles.buttonClose}
                                    onPress={() => setOpenSourceApprovalsPopup(!openSourceApprovalsPopup)}>
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
                    setOpenSourceDetailsPopup(!openSourceDetailsPopup);
                }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.ModalHeader}>
                                <Text style={styles.AssignRoleText}>Add Source Details</Text>
                                <TouchableOpacity
                                    style={styles.buttonClose}
                                    onPress={() => setOpenSourceDetailsPopup(!openSourceDetailsPopup)}>
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
        borderRadius: 4,
        borderLeftWidth: 5,
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
