import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"

const Profile = () => {
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.profile);
  }

  const [isViewProfile, saveEditFunction] = useState(false);

  return (
      <View style={isViewProfile ? styles.Container : styles.BgColorGray}>
        <View style={isViewProfile ? styles.InnerContainer : styles.ViewProfile}>
          <View style={styles.ProfileImageContainer}>
            <View style={styles.ProfileImage}>
              <Image
                source={require('./../../images/avtar.png')}
                style={styles.UserImage}
              />
            </View>
          </View>
          <ScrollView>
            {/* Edit Profile Details */}
            { isViewProfile ?
            <View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Fullname</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter Name"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Contact No.</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter Mobile No"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Designation</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Project Manager"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Email Address</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Email address"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Location</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Higher Education</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Key Skills</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Experience in year</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Project Undertaken</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Current Firm</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Previous Firm</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Current Firm</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Personal Details</Text>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Father’s Name</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Date of birth</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Gender</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Language</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Nationality</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Marital Status</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Location"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            </View>
            :
            /* View Profile Details */
            <View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Full Name</Text>
                <Text style={styles.LabelSubText}>Rishi Kant</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Designation</Text>
                <Text style={styles.LabelSubText}>Project manager</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Email Address</Text>
                <Text style={styles.LabelSubText}>abc@gmail.com</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Location</Text>
                <Text style={styles.LabelSubText}>Delhi</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Higher Education</Text>
                <Text style={styles.LabelSubText}>Post Graduate</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Key Skills</Text>
                <Text style={styles.LabelSubText}>asdf</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Experience in year</Text>
                <Text style={styles.LabelSubText}>5 Year</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Project Undertaken</Text>
                <Text style={styles.LabelSubText}>5</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Current Firm</Text>
                <Text style={styles.LabelSubText}>Abc</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Previous Firm</Text>
                <Text style={styles.LabelSubText}>QWERT</Text>
              </View>
            </View>
            }
          </ScrollView>
        </View>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress={() => saveEditFunction(!isViewProfile)} style={styles.assignTagButoon}>
                <Text style={styles.assignTagButoonText}>{isViewProfile ? 'Save Profile' : 'Edit Profile'}</Text>
            </TouchableOpacity>
          </View>
      </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    flex: 1
  },
  BgColorGray: {
    backgroundColor: '#F2F2F2',
    flex: 1,
    paddingHorizontal: 15,
  },
  InnerContainer: {
    backgroundColor: '#F2F2F2',
    marginTop: 120,
    flex: 1,
    paddingHorizontal: 15
  },
  ViewProfile: {
    backgroundColor: '#fff',
    marginTop: 120,
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  ProfileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  ProfileImage: {
    width: 148,
    height: 148,
    backgroundColor: '#fff',
    borderRadius: 74,
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    marginTop: -70,
    zIndex: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  UserImage: {
    width: '100%',
    height: '100%'
  },
  inputStyle: {
    flex: 1,
    color: '#2c2c2c',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E1E1E1',
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 10,
    height: 45
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    marginTop: 5,
  },
  FormGroup: {
    marginVertical: 7,
  },
  LabelText: {
    fontSize: 16,
    color: '#150A33',
    fontWeight: '500'
  },
  LabelSubText: {
    fontSize: 14,
    color: '#AAA6B9',
    fontWeight: '500'
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
  ButtonContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15
  }
});

export default Profile;