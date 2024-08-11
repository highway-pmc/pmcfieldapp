import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardTypeOptions,
  NativeEventEmitter,
  FlatList,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CalendarPicker from '../../components/UI/CalenderPicker';
import DropdownPicker from '../../components/UI/DropdownPicker';
import DropDownPicker from 'react-native-dropdown-picker';
import LoadingAnimation from '../Common/LoadingAnimation';
import {
  BLOOD_GROUP,
  GENDER,
  LANGUAGE,
  MARITAL_STATUS,
  NATIONALITY,
  HeaderItems,
} from '../../constants/constants';
import {
  clearUserProfile,
  getStates,
  getUserProfile,
  updateUserProfile,
} from './actions';
import {fieldRequired} from '../../utils/Validations';
import {getDbDate, getDisplayDate} from '../../utils/Utils';

type FormState = {
  cityId: string;
  gender: string;
  higherEdu: string;
  experience: string;
  keySkills: string;
  projectsUndertaken: string;
  previousFirm: string;
  fatherName: string;
  dob: string;
  language: string[];
  nationality: string;
  maritalStatus: string;
  bloodGroup: string;
  emergencyPhone: string;
  address: string;
};

type DropdownState = {
  openMaritalStatus: boolean;
  openLanguage: boolean;
  openGender: boolean;
  openBloodGroup: boolean;
  openNationality: boolean;
  openState: boolean;
  openCity: boolean;
};

const Profile = () => {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    cityId: '',
    gender: '',
    higherEdu: '',
    experience: '',
    keySkills: '',
    projectsUndertaken: '',
    previousFirm: '',
    fatherName: '',
    dob: '',
    language: [],
    nationality: '',
    maritalStatus: '',
    bloodGroup: '',
    emergencyPhone: '',
    address: '',
  });
  const [dropdownState, setDropdownState] = useState<DropdownState>({
    openMaritalStatus: false,
    openLanguage: false,
    openGender: false,
    openBloodGroup: false,
    openNationality: false,
    openState: false,
    openCity: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const dispatch = useDispatch();
  const {userProfileInfo, userProfileUpdated, states, loading, error} =
    useSelector((state: any) => state.UserProfile);
  const isFocused = useIsFocused();

  useEffect(() => {
    getUserProfileData();
  }, []);

  useEffect(() => {
    if (userProfileInfo) {
      setFormState(prevState => ({
        ...prevState,
        ...userProfileInfo.userProfile,
        language: userProfileInfo.userProfile.language
          ? userProfileInfo.userProfile.language.split(',')
          : [],
      }));
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
      Alert.alert('Success', 'Profile updated successfully.');
      getUserProfileData();
    } else if (error) {
      setApiError(error);
    }
  }, [userProfileUpdated, error]);

  const getUserProfileData = () => {
    setApiError('');
    setIsEditProfile(false);
    dispatch(getUserProfile());
    dispatch(getStates());
  };
  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.profile);
    }
  }, [isFocused]);
  const onSubmit = () => {
    if (!isEditProfile) {
      setIsEditProfile(true);

      return;
    }

    setFormSubmitted(true);
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    // More comprehensive validation
    newErrors.higherEdu = fieldRequired(
      formState.higherEdu,
      'Higher Education',
    );
    newErrors.gender = fieldRequired(formState.gender, 'Gender');
    newErrors.keySkills = fieldRequired(formState.keySkills, 'Key Skills');
    newErrors.fatherName = fieldRequired(formState.fatherName, "Father's Name");
    newErrors.dob = fieldRequired(formState.dob, 'Date of Birth');
    newErrors.language = fieldRequired(formState.language, 'Language');
    newErrors.maritalStatus = fieldRequired(
      formState.maritalStatus,
      'Marital Status',
    );
    newErrors.bloodGroup = fieldRequired(formState.bloodGroup, 'Blood Group');
    newErrors.emergencyPhone = fieldRequired(
      formState.emergencyPhone,
      'Emergency contact',
    );
    newErrors.address = fieldRequired(formState.address, 'Permanent Address');
    newErrors.nationality = fieldRequired(formState.nationality, 'Nationality');

    //Remove any undefined errors
    Object.keys(newErrors).forEach(
      key => newErrors[key] === undefined && delete newErrors[key],
    );

    setErrors(newErrors);
    //console.log('Error', errors);
    if (Object.keys(newErrors).length === 0) {
      //console.log(formState);
      const req = {
        cityId: formState.cityId,
        gender: formState.gender,
        higherEdu: formState.higherEdu,
        experience: isNaN(parseFloat(formState.experience))
          ? 0
          : parseFloat(formState.experience),
        keySkills: formState.keySkills,
        projectsUndertaken: formState.projectsUndertaken || '',
        previousFirm: formState.previousFirm || '',
        fatherName: formState.fatherName,
        dob: formState.dob,
        language: Array.isArray(formState.language)
          ? formState.language.join(',')
          : '',
        nationality: formState.nationality,
        maritalStatus: formState.maritalStatus,
        bloodGroup: formState.bloodGroup,
        emergencyPhone: formState.emergencyPhone,
        address: formState.address,
      };

      // Dispatch the update action
      dispatch(updateUserProfile(req));
      //setIsEditProfile(false);
    }
  };

  const renderFormField = (
    label: string,
    key: keyof FormState,
    multiline = false,
    keyboardType: KeyboardTypeOptions = 'default',
  ) => (
    <View style={styles.FormGroup}>
      <Text style={styles.LabelText}>{label}</Text>
      <View style={styles.SectionStyle}>
        <TextInput
          style={multiline ? styles.inputMultilineStyle : styles.inputStyle}
          placeholder={label}
          value={formState[key].toString()}
          onChangeText={text => setFormState(prev => ({...prev, [key]: text}))}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
        />
      </View>
      {errors[key] && formSubmitted && (
        <View style={styles.ErrorSectionStyle}>
          <Text style={styles.errorText}>{errors[key]}</Text>
        </View>
      )}
    </View>
  );

  const renderDropdown = (
    label: string,
    key: keyof FormState,
    items: any[],
  ) => {
    
    return (
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>{label}</Text>
        <View style={[styles.SectionStyle, {zIndex: 3}]}>
          <DropdownPicker
            label=""
            value={formState[key] as string}
            items={items}
            onChange={(newValue: string | string[]) => {
              setFormState(prev => ({...prev, [key]: newValue as string}));
            }}
            isRequired={true}
            style={{width: '100%'}}
          />
        </View>
        {errors[key] && formSubmitted && (
          <View style={styles.ErrorSectionStyle}>
            <Text style={styles.errorText}>{errors[key]}</Text>
          </View>
        )}
      </View>
    );
  };
  const renderProfileView = () => (
    <View>
      {apiError && (
        <View style={styles.ErrorSectionStyle}>
          <Text style={styles.errorText}>{apiError}</Text>
        </View>
      )}
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
        {userProfileInfo?.userProfile?.cityName ? (
          <Text style={styles.LabelSubText}>
            {userProfileInfo?.userProfile?.cityName + ', '}
            {userProfileInfo?.userProfile?.stateName}
          </Text>
        ) : (
          <Text style={styles.LabelSubText}>--</Text>
        )}
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Higher Education</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.higherEdu}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Key Skills</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.keySkills}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Experience in year</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.experience
            ? userProfileInfo?.userProfile?.experience + ' Year'
            : ''}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Project Undertaken</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.projectsUndertaken}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Current Firm</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.currentFirm}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Previous Firm</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.previousFirm}
        </Text>
      </View>

      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Personal Details</Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Father's Name</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.fatherName}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Date of Birth</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.dob
            ? getDisplayDate(userProfileInfo.userProfile.dob)
            : '--'}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Blood Group</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.bloodGroup}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Gender</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.gender
            ? GENDER.find(
                item => item.value === userProfileInfo.userProfile.gender,
              )?.label
            : '--'}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Language Known</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.language
            ? userProfileInfo.userProfile.language
                ?.split(',')
                .map((lang: any) => {
                  return LANGUAGE.find(item => item.value === lang)?.label;
                })
                .join(', ')
            : '--'}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Marital Status</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.maritalStatus
            ? MARITAL_STATUS.find(
                item =>
                  item.value === userProfileInfo.userProfile.maritalStatus,
              )?.label
            : '--'}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Emergency Phone</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.emergencyPhone}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Permanent Address</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.address}
        </Text>
      </View>
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Nationality</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.nationality
            ? NATIONALITY.find(
                item => item.value === userProfileInfo.userProfile.nationality,
              )?.label
            : '--'}
        </Text>
      </View>
    </View>
  );

  const renderEditProfileView = () => (
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
        <Text style={styles.LabelText}>Current Firm</Text>
        <Text style={styles.LabelSubText}>
          {userProfileInfo?.userProfile?.currentFirm}
        </Text>
      </View>
      {renderFormField('Higher Education', 'higherEdu')}
      {renderFormField('Key Skills', 'keySkills')}
      {renderFormField('Experience in years', 'experience', false, 'numeric')}
      {renderFormField('Project Undertaken', 'projectsUndertaken', true)}
      {renderFormField('Previous Firm', 'previousFirm')}
      <Text style={styles.LabelText}>Personal Details</Text>
      {renderFormField("Father's Name", 'fatherName')}
      <CalendarPicker
        label="Date of Birth"
        value={formState.dob}
        onChange={date => setFormState(prev => ({...prev, dob: date}))}
      />
      {renderDropdown('Gender', 'gender', GENDER)}
      <View style={styles.FormGroup}>
        <Text style={styles.LabelText}>Language</Text>
        <View style={[styles.SectionStyle, {zIndex: 4}]}>
          <DropDownPicker
            open={dropdownState.openLanguage}
            value={formState.language}
            items={LANGUAGE}
            setOpen={open =>
              setDropdownState(prev => ({...prev, openLanguage: open}))
            }
            setValue={(callback: any) => {
              const newValue = callback(formState.language);
              setFormState(prev => ({...prev, language: newValue}));
            }}
            multiple={true}
          />
        </View>
        {errors.language && formSubmitted && (
          <View style={styles.ErrorSectionStyle}>
            <Text style={styles.errorText}>{errors.language}</Text>
          </View>
        )}
      </View>
      {renderDropdown('Marital Status', 'maritalStatus', MARITAL_STATUS)}
      {renderDropdown('Blood Group', 'bloodGroup', BLOOD_GROUP)}
      {renderFormField(
        'Emergency Contact No.',
        'emergencyPhone',
        false,
        'phone-pad',
      )}
      {renderFormField('Permanent Address', 'address', true)}
      {renderDropdown('Nationality', 'nationality', NATIONALITY)}
    </View>
  );
  const sections = [
    {id: 'profile', render: renderProfileView}, // For view mode
    {id: 'editProfile', render: renderEditProfileView}, // For edit mode
  ];
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
        <FlatList
          data={
            isEditProfile
              ? [{id: 'editProfile', render: renderEditProfileView}]
              : [{id: 'profile', render: renderProfileView}]
          }
          renderItem={({item}) => item.render()}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.ButtonContainer}>
        <TouchableOpacity onPress={onSubmit} style={styles.assignTagButoon}>
          <Text style={styles.assignTagButoonText}>
            {isEditProfile ? 'Save Profile' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>
      <LoadingAnimation loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  CalendarImage: {
    width: 30,
    position: 'absolute',
    top: 11,
    right: 5,
  },
  WorkIconTask: {
    width: 24,
    height: 24,
  },
  previousIcon: {
    width: 24,
    height: 24,
    transform: [{rotate: '180deg'}],
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
    flex: 1,
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
    paddingHorizontal: 15,
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
    justifyContent: 'center',
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
    justifyContent: 'center',
  },
  UserImage: {
    width: '100%',
    height: '100%',
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
    height: 45,
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
    height: 45,
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
    fontWeight: '500',
  },
  LabelSubText: {
    fontSize: 14,
    color: '#AAA6B9',
    fontWeight: '500',
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
    paddingHorizontal: 15,
  },
});

export default Profile;
