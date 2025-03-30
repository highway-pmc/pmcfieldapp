import { useState } from 'react';
import DropdownPicker from '../../../../../components/UI/DropdownPicker';
import TimePicker from '../../../../../components/UI/TimePicker';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import CalendarPicker from '../../../../../components/UI/CalenderPicker';
import Input from '../../../../../components/UI/Input';
import DocumentPicker from 'react-native-document-picker';
import { useSnackbar } from '../../../../../context/SnackbarContext';
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

export const thirdPartySampleTest = (
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
  const [thirdParty, setThirdParty] = useState({
    dateOfSample: '',
    dateOfTesting: '',
    sampleBy: '',
    file: null,
    recommendation: '',
    result: '',
  });
  const [fileRes, setFileRes]: any = useState(null);
  const { showSnackbar } = useSnackbar();
  const handleInputChange = (name: string, value: string | number | []) => {
    setThirdParty({
      ...thirdParty,
      [name]: value,
    });
  };
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

        setFileRes({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri,
        });
      }
    });
  };
  const onDocumentPress = async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      const res = result[0];
      setFileRes(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        showSnackbar('No document selected');
      } else {
        throw err;
      }
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'column',
          paddingBottom: 40,
          paddingTop: 10,
        }}>
        <View style={{ flexDirection: 'column' }}>
          <CalendarPicker
            label="Date of Sampling"
            value={thirdParty.dateOfTesting}
            onChange={date => handleInputChange('dateOfTesting', date)}
          />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <CalendarPicker
            label="Date of Testing"
            value={thirdParty.dateOfTesting}
            onChange={date => handleInputChange('dateOfTesting', date)}
          />
        </View>

        <View style={{ flexDirection: 'column' }}>
          <DropdownPicker
            value={thirdParty.sampleBy}
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
            onChange={(value: string) => handleInputChange('sampleBy', value)}
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
        {fileRes && (
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <Text>Selected File: {fileRes.name || 'Image Captured'}</Text>
          </View>
        )}
        <View style={{ flexDirection: 'column' }}>
          <DropdownPicker
            value={thirdParty.sampleBy}
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
            onChange={(value: string) => handleInputChange('result', value)}
          />
        </View>
        <Input
          label="Recommendation"
          value={thirdParty.recommendation}
          onChange={(value: string) =>
            handleInputChange('recommendation', value)
          }
          isRequired={true}
        />
      </View>
    </View>
  );
};
