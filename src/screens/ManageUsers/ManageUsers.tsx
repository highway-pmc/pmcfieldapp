import {
  View,
  Text,
  NativeEventEmitter,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {HeaderItems} from '../../constants/constants';
import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-paper';

const ManageUsers = ({navigation}) => {
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.manageUsers);
  }

  const Assign_Category = [
    {
      id: '1',
      icon: require('./../../images/avtar.png'),
      title: 'Ravi Prakash',
      subTitle: 'Project Manager',
    },
    {
      id: '2',
      icon: require('./../../images/avtar.png'),
      title: 'Pradeep kumar',
      subTitle: 'Lead Engineer',
    },
    {
      id: '3',
      icon: require('./../../images/avtar.png'),
      title: 'Rishi Kant',
      subTitle: 'UI Module Lead',
    },
    {
      id: '4',
      icon: require('./../../images/avtar.png'),
      title: 'Shubham Varma',
      subTitle: 'Node Module Lead',
    },
    {
      id: '5',
      icon: require('./../../images/avtar.png'),
      title: 'Rajiv Ranjan',
      subTitle: 'Module Lead',
    },
  ];
  
  const [checked, setChecked] = useState('');

  const handleRadioChange = (value: any) => {
    setChecked(value);
  };
  const [isSelected, setSelection] = useState(false);
  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const [isRoleSelected, getRoleSelecte] = useState(false);

  return (
    <View style={styles.Container}>
      <View style={styles.TopHeaderFixed}>
        {/* <View style={styles.TopButtonContainer}>
          <TouchableOpacity style={styles.ButtonStyle}>
            <Text style={styles.TextStyle}>Assign Category</Text>
          </TouchableOpacity> 
          <TouchableOpacity style={styles.ButtonStyle}>
            <Text style={styles.TextStyle}>Assign Role</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.SectionStyle}>
          <Image
            source={require('./../../images/search-icon.png')}
            style={styles.ImageSearch}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Search user"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
        </View>
      </View>
      <ScrollView style={styles.Height80}>
      <RadioButton.Group onValueChange={handleRadioChange} value={checked}>
        {Assign_Category.map((item, index) => (
          <View style={styles.UserCategory}>
            <View style={styles.FlexRowCenter}>
              <Image
                source={item.icon}
                style={styles.UserImage}
              />
              <View>
                <View style={styles.FlexRowCenter}>
                  <Text style={styles.UserName}>{item.title}</Text>
                  {/* <View style={styles.assignTag}>
                    <Text style={styles.assignTagText}>{item.title}</Text>
                  </View> */}
                </View>
                <Text style={styles.UserRole}>{item.subTitle}</Text>
              </View>
            </View>
            <View>
              <RadioButton
                value={item.title}
                color="#1C58C0"
                uncheckedColor="gray"
              />
            </View>
          </View>
        ))}
      </RadioButton.Group>
        {/* No Data Found */}
        {!Assign_Category.length && 
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
            <Text style={styles.NodataSubText}>
              Please try to search another keywork...
            </Text>
          </View>
        }
      </ScrollView>

      {/* Footer Assign CTA Start */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: -15,
          backgroundColor: '#1C58C0',
        }}>
        <Pressable
          style={[
            !checked ? styles.DisabledButton : styles.buttonAssign,
            styles.SeperatorBorder,
          ]}
          disabled={!checked}
          onPress={() => openAssignPopup(true)}>
          <Text style={styles.textStyle}>Assign Category</Text>
        </Pressable>

        <Pressable
          style={[styles.buttonAssign]} onPress={() => navigation.navigate("AssignTask")}>
          <Text style={styles.textStyle}>Assign Task</Text>
        </Pressable>
      </View>

      {/* Modal Start */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAssignPopOpen}
        onRequestClose={() => {
          openAssignPopup(!isAssignPopOpen);
        }}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>Assign Category</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => openAssignPopup(!isAssignPopOpen)}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <View style={styles.CategoryType}>
                  <View style={styles.FlexRowCenter}>
                    <CheckBox
                      value={isRoleSelected}
                      onValueChange={getRoleSelecte}
                      style={styles.checkbox}
                      tintColors={{true: '#0F56B3', false: '#818181'}}
                    />
                    <View>
                      <Text style={styles.AssignRoleText}>Structure Work</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.CategoryType}>
                  <View style={styles.FlexRowCenter}>
                    <CheckBox
                      value={isRoleSelected}
                      onValueChange={getRoleSelecte}
                      style={styles.checkbox}
                      tintColors={{true: '#0F56B3', false: '#818181'}}
                    />
                    <View>
                      <Text style={styles.AssignRoleText}>Highway Work</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.CategoryType}>
                  <View style={styles.FlexRowCenter}>
                    <CheckBox
                      value={isRoleSelected}
                      onValueChange={getRoleSelecte}
                      style={styles.checkbox}
                      tintColors={{true: '#0F56B3', false: '#818181'}}
                    />
                    <View>
                      <Text style={styles.AssignRoleText}>Other Work</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.CategoryType}>
                  <View style={styles.FlexRowCenter}>
                    <CheckBox
                      value={isRoleSelected}
                      onValueChange={getRoleSelecte}
                      style={styles.checkbox}
                      tintColors={{true: '#0F56B3', false: '#818181'}}
                    />
                    <View>
                      <Text style={styles.AssignRoleText}>Quality Work</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.assignTagButoon}>
                  <Text style={styles.assignTagButoonText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
  },
  NoDataContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '30%',
  },
  WthHeight: {
    width: 150,
    height: 150
  },
  NodataHeadText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
  },
  NodataSubText: {
    fontSize: 16,
    color: '#27272A',
  },
  FlexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignTag: {
    backgroundColor: '#1C58C0',
    borderRadius: 15,
    color: '#fff',
    paddingHorizontal: 10,
    paddingTop: 2,
    paddingBottom: 3,
    marginLeft: 10,
  },
  assignTagText: {
    fontSize: 12,
    color: '#fff',
  },
  TopHeaderFixed: {
    marginBottom: 15,
  },
  TopButtonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 10,
    justifyContent: 'flex-end',
    gap: 10,
  },
  ButtonStyle: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#333',
  },
  TextStyle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  inputStyle: {
    flex: 1,
    color: '#2c2c2c',
    paddingLeft: 40,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 5,
    height: 45,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    marginTop: 5,
    position: 'relative',
  },
  ImageSearch: {
    position: 'absolute',
    width: 24,
    height: 24,
    zIndex: 9,
    left: 10,
    top: '27%',
  },
  UserCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#BECADA',
    borderStyle: 'solid',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkbox: {
    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
  },
  label: {
    margin: 8,
  },
  UserImage: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: '#BECADA',
    borderStyle: 'solid',
    borderRadius: 36,
    marginRight: 15,
  },
  UserName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#27272A',
  },
  UserRole: {
    fontSize: 16,
    fontWeight: '400',
    color: '#808089',
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
  button: {
    borderRadius: 4,
    borderBottomEndRadius: 0,
    paddingVertical: 20,
    marginHorizontal: -15,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonAssign: {
    backgroundColor: '#1C58C0',
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '50%'
  },
  SeperatorBorder: {
    borderRightWidth: 1,
    borderColor: '#fff'
  },
  DisabledButton: {
    opacity: .5,
    backgroundColor: '#1C58C0',
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '50%'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
    textAlign: 'center',
  },
  Height80: {
    height: '87%',
  },
  Height100: {
    height: '100%',
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
  CategoryType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    paddingVertical: 10,
  },
  AssignRoleText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
    marginLeft: 5,
  },
  assignTagButoon: {
    backgroundColor: '#1C58C0',
    borderRadius: 30,
    color: '#fff',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  assignTagButoonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default ManageUsers;
