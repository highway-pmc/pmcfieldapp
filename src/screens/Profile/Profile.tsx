import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity,   } from 'react-native'
import React, {useEffect, useState} from 'react'
import CalendarPicker from 'react-native-calendar-picker';

import { useIsFocused } from '@react-navigation/native';
import { BLOOD_GROUP, GENDER, HeaderItems, LANGUAGE, MARITAL_STATUS, NATIONALITY } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearUserProfile, getStates, getUserProfile, updateUserProfile } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import { fieldRequired } from '../../utils/Validations';
import DropDownPicker from 'react-native-dropdown-picker';
import { getDbDate, getDisplayDate } from '../../utils/Utils';

const Profile = () => {
  const [isEditProfile, saveEditFunction] = useState(false);
  const {userProfileInfo, userProfileUpdated, states, loading, error} = useSelector((state: any) => state.UserProfile);
  const [higherEdu, setHigherEdu] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dob, setDOB] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [language, setLanguage] = useState([]);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [nationality, setNationality] = useState('');
  const [previousFirm, setPreviousFirm] = useState('');
  const [projectsUndertaken, setProjectsUndertaken] = useState('');
  const [keySkills, setKeySkills] = useState('');
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');

  //dropdown
  const [openMaritalStatus, setOpenMaritalStatus] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openBloodGroup, setOpenBloodGroup] = useState(false);
  const [openNationality, setOpenNationality] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  // calendar
  const [openCalendar, setOpenCalendar] = useState(false);

  // error
  const [higherEduError, setHigherEduError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [bloodGroupError, setBloodGroupError] = useState('');
  const [dobError, setDOBError] = useState('');
  const [emergencyPhoneError, setEmergencyPhoneError] = useState('');
  const [experienceError, setExperienceError] = useState('');
  const [fatherNameError, setFatherNameError] = useState('');
  const [languageError, setLanguageError] = useState('');
  const [maritalStatusError, setMaritalStatusError] = useState('');
  const [nationalityError, setNationalityError] = useState('');
  const [keySkillsError, setKeySkillsError] = useState('');
  const [cityIdError, setCityIdError] = useState('');
  const [apiError, setApiError] = useState('');

  const [formSubmitted, setFormSubmitted] = useState(false)

  const dispatch = useDispatch()

  const getUserProfileData = () => {
    setApiError('');
    saveEditFunction(false);
    dispatch(getUserProfile());
    dispatch(getStates());
  }

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.profile);
  }

  useEffect(() => {
    if (userProfileInfo) {

    } else if (error) {
      setApiError(error);
    }
  }, [userProfileInfo, error]);

  useEffect(() => {
    if (states) {
    } else if (error) {
      setApiError(error);
    }
  }, [states, error]);

  useEffect(() => {
    if (userProfileUpdated) {
      Alert.alert("Success", "Profile updated successfully.");
      getUserProfileData();
    } else if (error) {
      setAddressError(error);
    }
  }, [userProfileUpdated, error]);

  useEffect(() => {
    getUserProfileData();
  }, []);

  const onSubmit = () => {
    if (!isEditProfile) {
      if (userProfileInfo.userProfile?.stateId) {
        setStateId(userProfileInfo.userProfile.stateId)
        //setCity(states?.find((item: any) => item._id === userProfileInfo.userProfile.stateId)?.city)
      } else {
        setStateId(states[0]?._id)
       // setCity(states[0].city)
        setCityId(states[0].city[0]?._id);
      }

      if (userProfileInfo.userProfile?.cityId) {
        setCityId(userProfileInfo.userProfile.cityId);
      }
      
      setGender(userProfileInfo.userProfile?.gender);
      setHigherEdu(userProfileInfo.userProfile?.higherEdu);
      if (userProfileInfo.userProfile?.experience) {
        setExperience(''+userProfileInfo.userProfile.experience);
      }
      setKeySkills(userProfileInfo.userProfile?.keySkills);
      setProjectsUndertaken(userProfileInfo.userProfile?.projectsUndertaken);
      setPreviousFirm(userProfileInfo.userProfile?.previousFirm);
      setFatherName(userProfileInfo.userProfile?.fatherName);
      if (userProfileInfo.userProfile?.dob) {
        setDOB(getDbDate(userProfileInfo.userProfile.dob));
      }
      setLanguage(userProfileInfo.userProfile?.language?.split(','));
      setNationality(userProfileInfo.userProfile?.nationality);
      setMaritalStatus(userProfileInfo.userProfile?.maritalStatus);
      setBloodGroup(userProfileInfo.userProfile?.bloodGroup);
      setEmergencyPhone(userProfileInfo.userProfile?.emergencyPhone);
      setAddress(userProfileInfo.userProfile?.address);

      saveEditFunction(!isEditProfile)
      return;
    }
    setApiError('');
    setHigherEduError('');
    setGenderError('');
    setAddressError('');
    setBloodGroupError('');
    setDOBError('');
    setEmergencyPhoneError('');
    setExperienceError('');
    setFatherNameError('');
    setLanguageError('');
    setMaritalStatusError('');
    setNationalityError('');
    setKeySkillsError('');
    setCityIdError('');

    setFormSubmitted(true);
    const higherEduErrorMgs = fieldRequired(higherEdu, "Higher edu");
    const genderErrorMgs = fieldRequired(gender, "Gender");
    const addressErrorMgs = fieldRequired(address, "Permanent Address");
    const bloodGroupErrorMgs = fieldRequired(bloodGroup, "Blood group");
    const dobErrorMgs = fieldRequired(dob, "Date of birth");
    const emergencyPhoneErrorMgs = fieldRequired(emergencyPhone, "Emergency contact");
    //const experienceErrorMgs = fieldRequired(experience, "Experience");
    const fatherNameErrorMgs = fieldRequired(fatherName, "Father's name");
    const languageErrorMgs = fieldRequired(language, "Language");

    const maritalStatusErrorMgs = fieldRequired(maritalStatus, "Marital status");
    const nationalityErrorMgs = fieldRequired(nationality, "Nationality");
    const keySkillsErrorMgs = fieldRequired(keySkills, "Key skills");
    const cityIdErrorMgs = fieldRequired(cityId, "City");

    if (higherEduErrorMgs) {
      setHigherEduError(higherEduErrorMgs);
    }

    if (genderErrorMgs) {
      setGenderError(genderErrorMgs);
    }

    if (addressErrorMgs) {
      setAddressError(addressErrorMgs);
    }

    if (bloodGroupErrorMgs) {
      setBloodGroupError(bloodGroupErrorMgs);
    }

    if (dobErrorMgs) {
      setDOBError(dobErrorMgs);
    }

    if (emergencyPhoneErrorMgs) {
      setEmergencyPhoneError(emergencyPhoneErrorMgs);
    }

    // if (higherEduErrorMgs) {
    //   setExperienceError(higherEduErrorMgs);
    // }

    if (fatherNameErrorMgs) {
      setFatherNameError(fatherNameErrorMgs);
    }

    if (languageErrorMgs) {
      setLanguageError(languageErrorMgs);
    }

    if (maritalStatusErrorMgs) {
      setMaritalStatusError(maritalStatusErrorMgs);
    }

    if (nationalityErrorMgs) {
      setNationalityError(nationalityErrorMgs);
    }

    if (keySkillsErrorMgs) {
      setKeySkillsError(keySkillsErrorMgs);
    }

    if (cityIdErrorMgs) {
      setCityIdError(cityIdErrorMgs);
    }

    if (higherEduErrorMgs || genderErrorMgs || addressErrorMgs || bloodGroupErrorMgs || dobErrorMgs || emergencyPhoneErrorMgs || fatherNameErrorMgs ||
      languageErrorMgs || maritalStatusErrorMgs || nationalityErrorMgs || keySkillsErrorMgs || cityIdErrorMgs) {
        return false;
    }

    const req = {
      cityId: cityId,
      gender: gender,
      higherEdu: higherEdu,
      experience: isNaN(parseFloat(experience)) ? 0 : parseFloat(experience),
      keySkills: keySkills,
      projectsUndertaken: projectsUndertaken || '',
      previousFirm: previousFirm || '',
      fatherName: fatherName,
      dob: dob,
      language: language.join(','),
      nationality: nationality,
      maritalStatus: maritalStatus,
      bloodGroup: bloodGroup,
      emergencyPhone: emergencyPhone,
      address: address
    }

    dispatch(updateUserProfile(req));
  }

  useEffect( () => () => {
    dispatch(clearUserProfile());
  }, [] );


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
              <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.currentFirm}</Text>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Select State</Text>
              <View style={[styles.SectionStyle, {zIndex: 8}]}> 
                <DropDownPicker
                  schema={{
                    label: 'name',
                    value: '_id'
                  }}
                  open={openState}
                  onOpen={() => {
                    setOpenCity(false)
                  }}
                  value={stateId}
                  items={states}
                  setOpen={setOpenState}
                  setValue={setStateId}
                  onSelectItem={(value) => {
                    setCityId('')
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Select City</Text>
              <View style={[styles.SectionStyle, {zIndex: 7}]}> 
                <DropDownPicker
                  schema={{
                    label: 'name',
                    value: '_id'
                  }}
                  open={openCity}
                  onOpen={() => {
                    setOpenState(false)
                  }}
                  value={cityId}
                  items={states?.find((item: any) => item._id === stateId)?.city}
                  setOpen={setOpenCity}
                  setValue={setCityId}
                />
              </View>
              {(cityIdError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{cityIdError}</Text>
              </View>}
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Higher Education</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  maxLength={500}
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
              {(higherEduError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{higherEduError}</Text>
              </View>}
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Key Skills</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Key Skills"
                  maxLength={200}
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
              {(keySkillsError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{keySkillsError}</Text>
              </View>}
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Experience in year</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Experience in year"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={experience}
                  onChangeText={(text) => {
                    let exp = text.replace(/[^0-9.]/g, '')
                    if(!isNaN(parseFloat(exp))) {
                      if (exp.split('.').length > 2) {
                        exp = parseFloat(exp).toString();
                      }
                      setExperience(exp);
                    } else {
                      setExperience('');
                    }
                  }}
                />
              </View>
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Project Undertaken</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputMultilineStyle}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={1000}
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
              {(fatherNameError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{fatherNameError}</Text>
              </View>}
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Date of birth</Text>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                      style={styles.inputStyle}
                      placeholder="Date of birth (YYYY-MM-DD)"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="next"
                      underlineColorAndroid="#f000"
                      blurOnSubmit={false}
                      value={dob ? getDbDate(dob) : ''}
                      editable={false}
                    />
                  <TouchableOpacity onPress={() => setOpenCalendar(!openCalendar)} style={styles.CalendarImage}>
                    <Image style={styles.WorkIconTask} source={require('../../images/date-icon.png')} />
                  </TouchableOpacity>
              </View>
                {openCalendar && (
                  <View style={{flex: 1, backgroundColor: "#fff", zIndex: 6}}>
                  <CalendarPicker
                    initialDate={dob ? new Date(dob) : new Date()}
                    onDateChange={(date) => {
                      setDOB(date.format("YYYY-MM-DD"));
                      setOpenCalendar(false)
                    }}
                    previousComponent = {<Image style={styles.previousIcon} source={require('../../images/right-arrow.png')} />}
                    nextComponent = {<Image style={styles.WorkIconTask} source={require('../../images/right-arrow.png')} />}
                  />
                  </View>
                )}
                
              </View>
              {(dobError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{dobError}</Text>
              </View>}
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Gender</Text>
              <View style={[styles.SectionStyle, {zIndex: 5}]}> 
                <DropDownPicker
                  open={openGender}
                  value={gender}
                  items={GENDER}
                  setOpen={setOpenGender}
                  setValue={setGender}
                />
              </View>
              {(genderError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{genderError}</Text>
              </View>}
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Language</Text>
              <View style={[styles.SectionStyle, {zIndex: 4}]}> 
              <DropDownPicker
                multiple={true}
                open={openLanguage}
                value={language}
                items={LANGUAGE}
                setOpen={setOpenLanguage}
                setValue={setLanguage}
              />
              </View>
              {(languageError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{languageError}</Text>
              </View>}
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Marital Status</Text>
              <View style={[styles.SectionStyle, {zIndex: 3}]}> 
                <DropDownPicker
                  open={openMaritalStatus}
                  value={maritalStatus}
                  items={MARITAL_STATUS}
                  setOpen={setOpenMaritalStatus}
                  setValue={setMaritalStatus}
                />
              </View>
              {(maritalStatusError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{maritalStatusError}</Text>
              </View>}
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Blood Group</Text>
              <View style={[styles.SectionStyle, {zIndex: 2}]}> 
                <DropDownPicker
                  open={openBloodGroup}
                  value={bloodGroup}
                  items={BLOOD_GROUP}
                  setOpen={setOpenBloodGroup}
                  setValue={setBloodGroup}
                />
              </View>
              {(bloodGroupError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{bloodGroupError}</Text>
              </View>}
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Emergency Contact No.</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputStyle}
                  maxLength={10}
                  placeholder="10 digits mobile number"
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
              {(emergencyPhoneError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{emergencyPhoneError}</Text>
              </View>}
            </View>

            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Permanent Address</Text>
              <View style={styles.SectionStyle}> 
                <TextInput
                  style={styles.inputMultilineStyle}
                  multiline={true}
                  numberOfLines={3}
                  placeholder="Permanent Address"
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
              {(addressError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{addressError}</Text>
              </View>}
            </View>
            <View style={styles.FormGroup}>
              <Text style={styles.LabelText}>Nationality</Text>
              <View style={[styles.SectionStyle, {zIndex: 1}]}> 
                <DropDownPicker
                  open={openNationality}
                  value={nationality}
                  items={NATIONALITY}
                  setOpen={setOpenNationality}
                  setValue={setNationality}
                />
              </View>
              {(nationalityError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{nationalityError}</Text>
              </View>}
            </View>

            </View>
            :
            /* View Profile Details */
            <View>
              {(apiError) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{apiError}</Text>
              </View>}
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
                {userProfileInfo?.userProfile?.cityName ? 
                  <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.cityName + ', '}{userProfileInfo?.userProfile?.stateName}</Text>
                  :
                  <Text style={styles.LabelSubText}>--</Text>
                }
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
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.currentFirm}</Text>
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
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.dob ? getDisplayDate(userProfileInfo.userProfile.dob) : '--'}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Blood Group</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.bloodGroup}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Gender</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.gender ? GENDER.find(item => item.value === userProfileInfo.userProfile.gender)?.label : '--'}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Language Known</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.language ? userProfileInfo.userProfile.language?.split(',').map((lang: any) => {
                  return LANGUAGE.find(item => item.value === lang)?.label
                }).join(', ') : '--'}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Marital Status</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.maritalStatus ? MARITAL_STATUS.find(item => item.value === userProfileInfo.userProfile.maritalStatus)?.label : '--'}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Emergency Phone</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.emergencyPhone}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Permanent Address</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.address}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Nationality</Text>
                <Text style={styles.LabelSubText}>{userProfileInfo?.userProfile?.nationality ? NATIONALITY.find(item => item.value === userProfileInfo.userProfile.nationality)?.label : '--'}</Text>
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
  CalendarImage: {
    width: 30, position: 'absolute', top: 11, right: 5
  },
  WorkIconTask: {
    width: 24,
    height: 24
  },
  previousIcon: {
    width: 24,
    height: 24,
    transform: [{ rotate: '180deg' }]
  },
  ErrorSectionStyle: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  errorText: {
    color: '#f11f1f',
  },
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
  inputMultilineStyle: {
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