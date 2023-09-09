import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity,   } from 'react-native'
import React, {useEffect, useState} from 'react'
import CalendarPicker from 'react-native-calendar-picker';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import moment from 'moment';

const Profile = () => {
  const [isEditProfile, saveEditFunction] = useState(false);
  const {userProfileInfo, userProfileUpdated, loading, error} = useSelector((state: any) => state.UserProfile);
  const [higherEdu, setHigherEdu] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dob, setDOB] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [experience, setExperience] = useState(0);
  const [fatherName, setFatherName] = useState('');
  const [language, setLanguage] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [nationality, setNationality] = useState('');
  const [previousFirm, setPreviousFirm] = useState('');
  const [projectsUndertaken, setProjectsUndertaken] = useState('');
  const [keySkills, setKeySkills] = useState('');
  const [cityId, setCityId] = useState('');

  const dispatch = useDispatch()

  const getUserProfileData = () => {
    saveEditFunction(false);
    dispatch(getUserProfile());
  }

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.profile);
  }

  useEffect(() => {
    if (userProfileInfo) {

    }
  }, [userProfileInfo, error]);

  useEffect(() => {
    if (userProfileUpdated) {
      Alert.alert("Profile updated successfully.");
      getUserProfileData();
    }
  }, [userProfileUpdated, error]);

  useEffect(() => {
    getUserProfileData();
  }, []);

  const onSubmit = () => {
    if (!isEditProfile) {

      setCityId(userProfileInfo.userProfile.cityId);
      setGender(userProfileInfo.userProfile.gender);
      setHigherEdu(userProfileInfo.userProfile.higherEdu);
      setExperience(userProfileInfo.userProfile.experience);
      setKeySkills(userProfileInfo.userProfile.keySkills);
      setProjectsUndertaken(userProfileInfo.userProfile.projectsUndertaken);
      setPreviousFirm(userProfileInfo.userProfile.previousFirm);
      setFatherName(userProfileInfo.userProfile.fatherName);
      setDOB(moment(new Date(userProfileInfo.userProfile.dob)).format('YYYY-MM-DD'));
      setLanguage(userProfileInfo.userProfile.language);
      setNationality(userProfileInfo.userProfile.nationality);
      setMaritalStatus(userProfileInfo.userProfile.maritalStatus);
      setBloodGroup(userProfileInfo.userProfile.bloodGroup);
      setEmergencyPhone(userProfileInfo.userProfile.emergencyPhone);
      setAddress(userProfileInfo.userProfile.address);

      saveEditFunction(!isEditProfile)
      return;
    }

    const req = {
      cityId: cityId,
      gender: gender,
      higherEdu: higherEdu,
      experience: experience,
      keySkills: keySkills,
      projectsUndertaken: projectsUndertaken,
      previousFirm: previousFirm,
      fatherName: fatherName,
      dob: dob,
      language: language,
      nationality: nationality,
      maritalStatus: maritalStatus,
      bloodGroup: bloodGroup,
      emergencyPhone: emergencyPhone,
      address: address
    }

    dispatch(updateUserProfile(req));
  }


  return (
      <View style={isEditProfile ? styles.Container : styles.BgColorGray}>
        <View style={isEditProfile ? styles.InnerContainer : styles.ViewProfile}>
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
            { isEditProfile ?
            <View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Name</Text>
              <Text style={styles.LabelSubText}>{userProfileInfo?.name}</Text>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Contact No.</Text>
              <Text style={styles.LabelSubText}>{userProfileInfo?.phone}</Text>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Designation</Text>
              <Text style={styles.LabelSubText}>{userProfileInfo?.designation}</Text>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Email Address</Text>
              <Text style={styles.LabelSubText}>{userProfileInfo?.email}</Text>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Current Firm</Text>
              <Text style={styles.LabelSubText}>--</Text>
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
                  value={cityId}
                  onChangeText={(text) => {
                    setCityId(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Higher Education</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Higher Education"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={higherEdu}
                  onChangeText={(text) => {
                    setHigherEdu(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Key Skills</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Key Skills"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={keySkills}
                  onChangeText={(text) => {
                    setKeySkills(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Experience in year</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Experience in year"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={''+experience}
                  onChangeText={(text) => {
                    setExperience(Number(text));
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Project Undertaken</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Project Undertaken"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={projectsUndertaken}
                  onChangeText={(text) => {
                    setProjectsUndertaken(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Previous Firm</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Previous Firm"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={previousFirm}
                  onChangeText={(text) => {
                    setPreviousFirm(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Personal Details</Text>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Father's Name</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Father's Name"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={fatherName}
                  onChangeText={(text) => {
                    setFatherName(text);
                  }}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Date of birth</Text>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Date of birth"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={dob}
                  onChangeText={(text) => {
                    setDOB(text);
                  }}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Gender</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Gender"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={gender}
                  onChangeText={(text) => {
                    setGender(text);
                  }}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Language</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Language"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={language}
                  onChangeText={(text) => {
                    setLanguage(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Marital Status</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Marital Status"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={maritalStatus}
                  onChangeText={(text) => {
                    setMaritalStatus(text);
                  }}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Blood Group</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Blood Group"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={bloodGroup}
                  onChangeText={(text) => {
                    setBloodGroup(text);
                  }}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Emergency Contact No.</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Emergency Contact No."
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={emergencyPhone}
                  onChangeText={(text) => {
                    setEmergencyPhone(text);
                  }}
                />
              </View>
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Address</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Address"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={address}
                  onChangeText={(text) => {
                    setAddress(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Nationality</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Nationality"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={nationality}
                  onChangeText={(text) => {
                    setNationality(text);
                  }}
                />
              </View>
            </View>

            </View>
            :
            /* View Profile Details */
            <View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Name</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.name}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Designation</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.designation}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Email Address</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.email}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Mobile</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.phone}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Location</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.cityName + ', '}{userProfileInfo?.userProfile?.stateName}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Higher Education</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.higherEdu}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Key Skills</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.keySkills}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Experience in year</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.experience ? userProfileInfo?.userProfile?.experience + ' Year' : ''}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Project Undertaken</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.projectsUndertaken}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Current Firm</Text>
                <Text style={styles.LabelSubText}>--</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Previous Firm</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.previousFirm}</Text>
              </View>

              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Personal Details</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Father's Name</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.fatherName}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Date of Birth</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.dob ? moment(new Date(userProfileInfo.userProfile.dob)).format('DD MMMM YYYY') : '--'}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Blood Group</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.bloodGroup}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Gender</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.gender}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Language Known</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.language ? userProfileInfo.userProfile.language.split(',').join(', ') : '--'}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Marital Status</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.maritalStatus}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Emergency Phone</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.emergencyPhone}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Address</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.address}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Nationality</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.nationality}</Text>
              </View>
            </View>
            }
          </ScrollView>
        </View>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress={() => onSubmit()} style={styles.assignTagButoon}>
                <Text style={styles.assignTagButoonText}>{isEditProfile ? 'Save Profile' : 'Edit Profile'}</Text>
            </TouchableOpacity>
          </View>

          <LoadingAnimation loading={loading}></LoadingAnimation>
      </View>
  )
}

const styles = StyleSheet.create({
  dpContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
  },
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