import {useState} from 'react';
import DropdownPicker from '../../../../../components/UI/DropdownPicker';
import TimePicker from '../../../../../components/UI/TimePicker';
import {Text, TouchableOpacity, View, Image, ScrollView} from 'react-native';
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

export const testSampleFormOtherWork = (
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
  if (!materialType) {
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
              {currentTestMaterialData.materialType ===
                (TEST_MATERIALS_TYPES.SIGN_BOARDS &&
                selectedTestSample.type ===
                  TEST_TYPES.RETRO_REFLECTION_SIGN_BOARD ? (
                  <View>
                    <Input
                      label="No. of Test"
                      value={concreteSampleTestItems[0].otherInfo.noOfTest}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'noOfTest',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Type of sign board"
                      value={concreteSampleTestItems[0].typeOfSignBoard}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'typeOfSignBoard',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Chainage"
                      value={concreteSampleTestItems[0].chainage}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'chainage',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <DropdownPicker
                      value={concreteSampleTestItems[0].side}
                      label="Side"
                      items={[
                        {label: 'Select', value: ''},
                        {label: 'LHS', value: 'LHS'},
                        {label: 'LHS', value: 'LHS'},
                      ]}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'side',
                          value,
                        )
                      }
                    />
                    <DropdownPicker
                      value={concreteSampleTestItems[0].sheetType}
                      label="Sheet Type"
                      items={[
                        {label: 'Select', value: ''},
                        {label: 'III', value: 'III'},
                        {label: 'IV', value: 'IV'},
                        {label: 'VIII', value: 'VIII'},
                        {label: 'XI', value: 'XI'},
                      ]}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'sheetType',
                          value,
                        )
                      }
                    />
                    {/*TODO*/}
                    <Input
                      label="Observation Angle"
                      value={concreteSampleTestItems[0].observationAngle}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'observationAngle',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Entrance Angle"
                      value={concreteSampleTestItems[0].entranceAngle}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'entranceAngle',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <DropdownPicker
                      value={concreteSampleTestItems[0].color}
                      label="Color"
                      items={[
                        {label: 'Select', value: ''},
                        {label: 'White', value: 'White'},
                        {label: 'Yellow', value: 'Yellow'},
                        {label: 'Orange', value: 'Orange'},
                        {label: 'Green', value: 'Green'},
                        {label: 'Red', value: 'Red'},
                        {label: 'Blue', value: 'Blue'},
                        {label: 'Brown', value: 'Brown'},
                      ]}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'sheetType',
                          value,
                        )
                      }
                    />
                    <Input
                      label="Measured Lux"
                      value={concreteSampleTestItems[0].measuredLux}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'measuredLux',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Condition Of Sign Board Surface"
                      value={
                        concreteSampleTestItems[0].conditionOfSignBoardSurface
                      }
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'conditionOfSignBoardSurface',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Visibility Condition At Night"
                      value={
                        concreteSampleTestItems[0].visibilityConditionAtNight
                      }
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'visibilityConditionAtNight',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Cleanliness Of Board"
                      value={concreteSampleTestItems[0].cleanlinessOfBoard}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'cleanlinessOfBoard',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Any Damage Or Obstruction"
                      value={concreteSampleTestItems[0].anyDamageOrObstruction}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'anyDamageOrObstruction',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Meets MoRTH Retro Reflectivity Standards"
                      value={
                        concreteSampleTestItems[0]
                          .meetsMoRTHRetroReflectivityStandards
                      }
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'meetsMoRTHRetroReflectivityStandards',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                  </View>
                ) : selectedTestSample.type ===
                  TEST_TYPES.DIMENSION_OF_SIGN_BOARD ? (
                  <View>
                    <Input
                      label="No. of Test"
                      value={concreteSampleTestItems[0].otherInfo.noOfTest}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'noOfTest',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 200,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.sNo}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.parameter}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[2]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'specifiedDimension'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[3]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'measuredDimension'}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[3]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'remark'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null)}
              {currentTestMaterialData.materialType ===
                (TEST_MATERIALS_TYPES.ROAD_MAKING &&
                selectedTestSample.type ===
                  TEST_TYPES.SOFTENING_POINT_THERMOPLAST_PAINT ? (
                  <View>
                    <Input
                      label="Material Type"
                      value={concreteSampleTestItems[0].otherInfo.materialType}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'materialType',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 200,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.trial}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'temp'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type ===
                  TEST_TYPES.REFLECTIVITY_THERMOPLAST_PAINT ? (
                  <View>
                    <Input
                      label="No. of Test"
                      value={concreteSampleTestItems[0].otherInfo.noOfTest}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'noOfTest',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 200,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.sNo}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.parameter}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[2]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'specifiedDimension'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[3]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'measuredDimension'}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[3]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'remark'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null)}

              {currentTestMaterialData.materialType ===
                (TEST_MATERIALS_TYPES.ROAD_MAKING &&
                selectedTestSample.type ===
                  TEST_TYPES.SOFTENING_POINT_THERMOPLAST_PAINT ? (
                  <View>
                    <Input
                      label="Material Type"
                      value={concreteSampleTestItems[0].otherInfo.materialType}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'materialType',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 200,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'trial'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'trial'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null)}
              {currentTestMaterialData.materialType ===
                (TEST_MATERIALS_TYPES.PILE &&
                selectedTestSample.type === TEST_TYPES.PILE_STATE_LOAD_TEST ? (
                  <View>
                    <DropdownPicker
                      value={concreteSampleTestItems[0].typeOfLoading}
                      label="Type Of Loading"
                      items={[
                        {label: 'Select', value: ''},
                        {label: 'Static', value: 'Static'},
                        {label: 'Dynamic', value: 'Dynamic'},
                      ]}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'typeOfLoading',
                          value,
                        )
                      }
                    />
                    <DropdownPicker
                      value={concreteSampleTestItems[0].typeOfTesting}
                      label="Side"
                      items={[
                        {label: 'Select', value: ''},
                        {label: 'Initial', value: 'Initial'},
                        {label: 'Routine', value: 'Routine'},
                      ]}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'typeOfTesting',
                          value,
                        )
                      }
                    />
                    <DropdownPicker
                      value={concreteSampleTestItems[0].side}
                      label="Side"
                      items={[
                        {label: 'Select', value: ''},
                        {label: 'Kentledge', value: 'Kentledge'},
                        {label: 'Reaction Beams', value: 'Reaction Beams'},
                        {label: 'Anchor Piles', value: 'Anchor Piles'},
                      ]}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'side',
                          value,
                        )
                      }
                    />
                    <Input
                      label="Design Safe Load"
                      value={concreteSampleTestItems[0].designSafeLoad}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'designSafeLoad',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Maximum Test Load"
                      value={concreteSampleTestItems[0].materialType}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'maximumTestLoad',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 200,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'loadApplied'}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'settlementReading'}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'displacment'}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'timeOfReading'}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'remark'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null)}
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

const getRFIDataByWorkAssignmentId = (task: any) => {
  // setSelectedTask(task);
  // dispatch(getRFIByWaId({
  //   projectId: loggedInUser.projectId,
  //   projectModuleId: projectModuleId,
  //   waId: task.workAssignmentId,
  // }));
};

const getObjectKeys = (item: any, styles: any): any => {
  const keys = Object.keys(item);
  const view = (
    <View
      style={{
        flexDirection: 'row',
      }}>
      {keys.map((keyName: any) => {
        return keyName.indexOf('desc') != -1 ? (
          <View style={{flexDirection: 'row', height: 40}} key={keyName}>
            <Text style={{fontWeight: '700'}}>{item[keyName]}</Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row', height: 40}}>
            <CustomTextInput
              rowItem={item}
              tempProp={false}
              styleName={styles.inputStyle4}
              styles={styles}
              fieldName={keyName}
              key={keyName}
            />
          </View>
        );
      })}
    </View>
  );

  return view;
};
