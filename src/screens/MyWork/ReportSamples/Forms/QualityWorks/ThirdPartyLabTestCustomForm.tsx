import {useState} from 'react';
import DropdownPicker from '../../../../../components/UI/DropdownPicker';
import TimePicker from '../../../../../components/UI/TimePicker';
import {Text, TouchableOpacity, View, Image, ScrollView, Alert} from 'react-native';
import {
  RFI_STATUS,
  SAMPLE_BY_LIST,
  TEST_CONDUCTED_BY_LIST,
  TEST_MATERIALS_TYPES,
  TEST_TYPES,
  TYPE_OF_CONCRETE_SURFACE_LIST,
  YES_NO_LIST,
} from '../../../../../constants/constants';
import CalendarPicker from '../../../../../components/UI/CalenderPicker';
import Input from '../../../../../components/UI/Input';
import DocumentPicker from 'react-native-document-picker';
import {useSnackbar} from '../../../../../context/SnackbarContext';
import ImagePicker from 'react-native-image-picker';
export const CustomDropdownPicker = ({
  items,
  rowItem,
  fieldName,
  tempProp,
}: {
  items: any;
  rowItem: any;
  fieldName: any;
  tempProp: boolean;
}) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const updateValue = (value: any) => {
    setValue(value);
    {
      rowItem[fieldName + (tempProp ? '_TEMP' : '')] = value;
    }
  };
  return (
    // style={{ width: 110, height: 30, zIndex: 10 }}
    <DropdownPicker
      value={value}
      label=""
      items={items}
      onChange={(value: string) => updateValue(value)}
    />
  );
};

export const CustomTimePicker = ({
  rowItem,
  fieldName,
}: {
  rowItem: any;
  fieldName: any;
}) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const updateValue = (value: any) => {
    setValue(value);
    {
      rowItem[fieldName] = value;
    }
  };
  return (
    <TimePicker
      value={value}
      label=""
      onChange={(time: string) => updateValue(time)}
    />
  );
};

export const CustomTextInput = ({
  rowItem,
  fieldName,
  tempProp = false,
  styleName = {},
  styles,
}: {
  rowItem: any;
  fieldName: any;
  tempProp: boolean;
  styleName: any;
  styles: any;
}) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const updateValue = (text: any) => {
    {
      rowItem[fieldName + (tempProp ? '_TEMP' : '')] = text;
    }
  };

  return (
    <Input
      style={styleName || styles.inputStyle3}
      placeholder=""
      label={''}
      marginBottom={false}
      autoCapitalize="none"
      keyboardType="email-address"
      returnKeyType="next"
      underlineColorAndroid="#f000"
      blurOnSubmit={false}
      value={value}
      onChange={(value: string) => {
        setValue(value);
        updateValue(value);
      }}
      //onBlur={() => onBlur()}
    />
  );
};

export const CustomCalendarPicker = ({
  rowItem,
  fieldName,
  tempProp = false,
}: {
  rowItem: any;
  fieldName: any;
  tempProp: boolean;
}) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const updateValue = (text: any) => {
    rowItem[fieldName + (tempProp ? '_TEMP' : '')] = text;
  };

  return (
    <CalendarPicker
      value={value}
      onChange={date => {
        setValue(date);
        updateValue(date);
      }}
    />
  );
};

let formSampleTest7thOr28thDay: any,
  setFormSampleTest7thOr28thDay: any,
  currentTestMaterialData: any,
  selectedTestSample: any,
  concreteSampleTestItems: any;

export const testSampleFormEarthwork = (
  styles: any,
  materialType: any,
  _formSampleTest7thOr28thDay: any,
  _setFormSampleTest7thOr28thDay: any,
  _currentTestMaterialData: any,
  _selectedTestSample: any,
  _concreteSampleTestItems: any,
) => {
  formSampleTest7thOr28thDay = _formSampleTest7thOr28thDay;
  setFormSampleTest7thOr28thDay = _setFormSampleTest7thOr28thDay;
  currentTestMaterialData = _currentTestMaterialData;
  selectedTestSample = _selectedTestSample;
  concreteSampleTestItems = _concreteSampleTestItems;
  console.log('Earthwork currentTestMaterialData', currentTestMaterialData);
  console.log('Earthwork selectedTestSample.type :', selectedTestSample.type);
  const {showSnackbar} = useSnackbar();
  const launchCamera = () => {
    let options = {
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        const responseImage = response.assets?.length
          ? response.assets[0]
          : response.assets
          ? response.assets
          : response;
        handleInputChangeFineAggregate(
          concreteSampleTestItems[0].sampleData,
          'base64Image',
          responseImage,
        );}
    });
  };
  const onDocumentPress = async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      const res = result[0];
      handleInputChangeFineAggregate(
        concreteSampleTestItems[0].sampleData,
        'base64Image',
        res,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        showSnackbar('No document selected');
      } else {
        throw err;
      }
    }
  };
  if (
    !materialType ||
    materialType === TEST_MATERIALS_TYPES.SOIL ||
    materialType === TEST_MATERIALS_TYPES.FLY_ASH
  ) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'column',
            paddingBottom: 40,
            paddingTop: 10,
          }}>
          <View style={{flexDirection: 'column'}}>
            <CalendarPicker
              label="Date of Testing"
              value={formSampleTest7thOr28thDay.dateOfTesting}
              onChange={date => handleInputChange('dateOfTesting', date)}
            />
          </View>

          <View style={{flexDirection: 'column'}}>
            <DropdownPicker
              value={formSampleTest7thOr28thDay.sampleBy}
              label="Sampled By"
              items={SAMPLE_BY_LIST}
              onChange={(value: string) => handleInputChange('sampleBy', value)}
            />
          </View>

          <View style={{flexDirection: 'column'}}>
            <DropdownPicker
              value={formSampleTest7thOr28thDay.testConductedBy}
              label="Test Conducted By"
              items={TEST_CONDUCTED_BY_LIST}
              onChange={(value: string) =>
                handleInputChange('testConductedBy', value)
              }
            />
          </View>

          <View style={{flexDirection: 'column'}}>
            <Input
              label="Room Temperature/ Atmospheric Temperature (in C)"
              value={'' + formSampleTest7thOr28thDay.roomTemperature}
              onChange={(value: string) =>
                handleInputChange('roomTemperature', value)
              }
              isRequired={true}
            />
          </View>

          <View style={{flexDirection: 'column'}}>
            <Input
              label="Humidity in %"
              value={'' + formSampleTest7thOr28thDay.humidity}
              onChange={(value: string) => handleInputChange('humidity', value)}
              isRequired={true}
            />
          </View>

          <View style={{flexDirection: 'column'}}>
            <Text style={styles.GenerateRFIFieldLabel}>Observations:</Text>
            <ScrollView style={styles.Width100} horizontal={true}>
              <View
                style={{
                  flexDirection: 'column',
                  paddingBottom: 40,
                  paddingTop: 10,
                }}>
                <View style={{flexDirection: 'column'}}>
                  <CalendarPicker
                    label="Date of Sampling"
                    value={concreteSampleTestItems[0].sampleData.dateOfSampling}
                    onChange={(value: any) =>
                      handleInputChangeFineAggregate(
                        concreteSampleTestItems[0].sampleData,
                        'dateOfSampling',
                        value,
                      )
                    }
                  />
                </View>
                <View style={{flexDirection: 'column'}}>
                  <CalendarPicker
                    label="Date of Testing"
                    value={concreteSampleTestItems[0].sampleData.dateOfTesting}
                    onChange={(value: any) =>
                      handleInputChangeFineAggregate(
                        concreteSampleTestItems[0].sampleData,
                        'dateOfTesting',
                        value,
                      )
                    }
                  />
                </View>

                <View style={{flexDirection: 'column'}}>
                  <DropdownPicker
                    value={concreteSampleTestItems[0].sampleData.sampleBy}
                    label="Sampled By"
                    items={[
                      {
                        label: 'Concessionaire',
                        value: 'Concessionaire',
                      },
                      {
                        label: 'Jointly',
                        value: 'Jointly',
                      },
                      {
                        label: 'Jointly',
                        value: 'Jointly',
                      },
                    ]}
                    onChange={(value: any) =>
                      handleInputChangeFineAggregate(
                        concreteSampleTestItems[0].sampleData,
                        'sampleBy',
                        value,
                      )
                    }
                  />
                </View>

                {/* File Upload Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#007bff',
                      padding: 10,
                      borderRadius: 5,
                      flex: 0.45,
                    }}
                    onPress={launchCamera}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Capture Image
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: '#28a745',
                      padding: 10,
                      borderRadius: 5,
                      flex: 0.45,
                    }}
                    onPress={onDocumentPress}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Upload Document
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Optional: Display selected file name */}
                {concreteSampleTestItems[0].sampleData.base64Image && (
                  <View style={{marginTop: 10, alignItems: 'center'}}>
                    <Text>
                      Selected File:{' '}
                      {concreteSampleTestItems[0].sampleData.base64Image ||
                        'Image Captured'}
                    </Text>
                  </View>
                )}
                <View style={{flexDirection: 'column'}}>
                  <DropdownPicker
                    value={concreteSampleTestItems[0].sampleData.result}
                    label="Result"
                    items={[
                      {
                        label: 'Pass',
                        value: 'Pass',
                      },
                      {
                        label: 'Fail',
                        value: 'Fail',
                      },
                    ]}
                    onChange={(value: any) =>
                      handleInputChangeFineAggregate(
                        concreteSampleTestItems[0].sampleData,
                        'result',
                        value,
                      )
                    }
                  />
                </View>
                <Input
                  label="Recommendation"
                  value={concreteSampleTestItems[0].additionalData.comments}
                  onChange={(value: any) =>
                    handleInputChangeFineAggregate(
                      concreteSampleTestItems[0].sampleData,
                      'comments',
                      value,
                    )
                  }
                  isRequired={true}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
};

export const tasksListing = (
  currentTestTypesData: any,
  searchText: any,
  getStyle: any,
  styles: any,
) => {
  return currentTestTypesData
    .filter((task: any) => {
      if (searchText && task.name) {
        return task.name.toLowerCase().includes(searchText.toLowerCase());
      } else {
        return true;
      }
    })
    .map((item: any, index: any) => (
      <View style={getStyle(item)}>
        <View style={styles.leftContainer}>
          <Text style={styles.HeadText}>{item.name}</Text>
          {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
        </View>
        {item.rfiStatus === RFI_STATUS.GENERATED ? (
          <TouchableOpacity
            style={[styles.MyWorkCta, styles.StartBorder]}
            onPress={() => {
              getRFIDataByWorkAssignmentId(item);
            }}>
            <Image
              style={styles.WorkIcon}
              source={require('../../../../../images/play-icon.png')}
            />
            <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>
              Start
            </Text>
          </TouchableOpacity>
        ) : null}

        {item.rfiStatus === RFI_STATUS.RE_GENERATED ? (
          <TouchableOpacity
            style={[styles.MyWorkCta, styles.StartBorder]}
            onPress={() => {
              getRFIDataByWorkAssignmentId(item);
            }}>
            <Image
              style={styles.WorkIcon}
              source={require('../../../../../images/play-icon.png')}
            />
            <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>
              Re-start
            </Text>
          </TouchableOpacity>
        ) : null}

        {item.rfiStatus === RFI_STATUS.REJECTED ||
        item.rfiStatus === RFI_STATUS.CANCELLED ? (
          <TouchableOpacity
            style={[styles.MyWorkCta, styles.StartRejectBorder]}>
            {/* <Image style={styles.WorkIcon} source={require('../../../../../images/play-icon.png')} /> */}
            <Text style={[styles.CtaStartText, styles.CtaRejectTextColor]}>
              {item.rfiStatus === RFI_STATUS.CANCELLED
                ? 'Cancelled'
                : 'Rejected'}
            </Text>
          </TouchableOpacity>
        ) : null}

        {item.rfiStatus === RFI_STATUS.IN_PROGRESS ? (
          <TouchableOpacity
            style={[styles.MyWorkCta, styles.StartInProgressBorder]}
            onPress={() => {
              getRFIDataByWorkAssignmentId(item);
            }}>
            <Image
              style={styles.WorkIcon}
              source={require('../../../../../images/inprogress.png')}
            />
            <Text style={[styles.CtaStartText, styles.CtaInProgressTextColor]}>
              In Progress
            </Text>
          </TouchableOpacity>
        ) : null}

        {item.rfiStatus === RFI_STATUS.IN_REVIEW ? (
          <TouchableOpacity
            style={[styles.MyWorkCta, styles.StartReviewBorder]}>
            <Image
              style={styles.WorkIcon}
              source={require('../../../../../images/review-icon.png')}
            />
            <Text style={[styles.CtaStartText, styles.CtaReviewTextColor]}>
              Under Review
            </Text>
          </TouchableOpacity>
        ) : null}

        {item.rfiStatus === RFI_STATUS.APPROVED ? (
          <TouchableOpacity
            style={[styles.MyWorkCta, styles.StartCompleteBorder]}>
            <Image
              style={styles.WorkIcon}
              source={require('../../../../../images/complete-icon.png')}
            />
            <Text style={[styles.CtaStartText, styles.CtaCompleteTextColor]}>
              Completed
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    ));
};

export type FormSampleTest7thOr28thDayState = {
  dateOfTesting: string;
  sampleBy: string;
  testConductedBy: string;
  roomTemperature: number;
  humidity: number;
  typeOfConcreteSurface?: string;
  observations?: any[];
};

const handleInputChange = (
  name: keyof FormSampleTest7thOr28thDayState,
  value: string | number | [],
) => {
  setFormSampleTest7thOr28thDay({
    ...formSampleTest7thOr28thDay,
    [name]: value,
  });
};

const handleInputChangeFineAggregate = (
  item: any,
  name: any,
  value: string | number | [],
) => {
  item[name] = value;
  setFormSampleTest7thOr28thDay({...formSampleTest7thOr28thDay});
};
