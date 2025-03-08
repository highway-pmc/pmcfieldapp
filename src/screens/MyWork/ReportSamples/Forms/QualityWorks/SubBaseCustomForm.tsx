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

export const testSampleFormSubBase = (
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
  if (
    !materialType ||
    materialType === TEST_MATERIALS_TYPES.GSB ||
    materialType === TEST_MATERIALS_TYPES.CTSB
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
              {currentTestMaterialData.materialType &&
                (selectedTestSample.type ===
                TEST_TYPES.WATER_ABSORPTION_OF_AGGREGATES ? (
                  <View>
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
                                      {value.testProperty}
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
                                      fieldName={'test1'}></CustomTextInput>
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
                                      fieldName={'test2'}></CustomTextInput>
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
                                      fieldName={'test3'}></CustomTextInput>
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type ===
                  TEST_TYPES.AGGREGATE_IMPACT_VALUE ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values
                              .filter((value: any) => !value.hide)
                              .map((value: any, indexDetails: number) => (
                                <View style={{flexDirection: 'row'}}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 80,
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
                                      {value.description}
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
                                      fieldName={'test1'}></CustomTextInput>
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
                                      fieldName={'test2'}></CustomTextInput>
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
                                      fieldName={'test3'}></CustomTextInput>
                                  </View>
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.FIELD_DRY_DENSITY ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View key={index} style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                          <View style={{height: 40}}>
                            <Text style={{fontWeight: '700'}}>
                              {item.sampleNo.value}
                            </Text>
                            <Input
                              label="Bulk Density of sand (Ys) in gmm/cc"
                              value={
                                concreteSampleTestItems[0].otherInfo
                                  .bulkDensitySand
                              }
                              onChange={(value: any) =>
                                handleInputChangeFineAggregate(
                                  concreteSampleTestItems[0].otherInfo,
                                  'bulkDensitySand',
                                  value,
                                )
                              }
                              isRequired={true}
                            />
                            <Input
                              label="Test Pit chainage"
                              value={
                                concreteSampleTestItems[0].otherInfo
                                  .testPitChainage
                              }
                              onChange={(value: any) =>
                                handleInputChangeFineAggregate(
                                  concreteSampleTestItems[0].otherInfo,
                                  'testPitChainage',
                                  value,
                                )
                              }
                              isRequired={true}
                            />
                            <DropdownPicker
                              label="Side (LHS/RHS)"
                              items={[
                                {label: 'Select', value: ''},
                                {label: 'LHS', value: 'LHS'},
                                {label: 'RHS', value: 'RHS'},
                              ]}
                              value={
                                concreteSampleTestItems[0].otherInfo.sideLhsRhs
                              }
                              onChange={(value: string) =>
                                handleInputChangeFineAggregate(
                                  concreteSampleTestItems[0].otherInfo,
                                  'bulkDensitySand',
                                  value,
                                )
                              }
                            />
                            <Input
                              label="Offset from Centre line (m)"
                              value={
                                concreteSampleTestItems[0].otherInfo
                                  .offsetCentreLine
                              }
                              onChange={(value: any) =>
                                handleInputChangeFineAggregate(
                                  concreteSampleTestItems[0].otherInfo,
                                  'offsetCentreLine',
                                  value,
                                )
                              }
                              isRequired={true}
                            />
                          </View>
                          {index === 0
                            ? item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View
                                    key={indexDetails}
                                    style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 180,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'left'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        styles={styles}
                                        fieldName={'test1'}
                                      />
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        styles={styles}
                                        fieldName={'test2'}
                                      />
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        styles={styles}
                                        fieldName={'test3'}
                                      />
                                    </View>
                                  </View>
                                ),
                              )
                            : index === 1
                            ? item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View
                                    key={indexDetails}
                                    style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 180,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'left'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        styles={styles}
                                        fieldName={'test1'}
                                      />
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        styles={styles}
                                        fieldName={'test2'}
                                      />
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        styles={styles}
                                        fieldName={'test3'}
                                      />
                                    </View>
                                  </View>
                                ),
                              )
                            : null}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.MOISTURE_CONTENT ? (
                  <View>
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
                                      {value.description}
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
                                      fieldName={'test1'}
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
                                          {item.details.titles[2]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={'test2'}
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
                                      fieldName={'test3'}
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
                    TEST_TYPES.GRADING_OF_AGGREGATE &&
                  currentTestMaterialData.materialType ===
                    TEST_MATERIALS_TYPES.CTSB ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          <DropdownPicker
                            label="Type"
                            items={[
                              {label: 'Select', value: ''},
                              {
                                label: 'Calcium Carbide',
                                value: 'Calcium Carbide',
                              },
                              {label: 'Oven dried', value: 'Oven dried'},
                            ]}
                            value={
                              concreteSampleTestItems[0].otherInfo.methodUsed
                            }
                            onChange={(value: string) =>
                              handleInputChangeFineAggregate(
                                concreteSampleTestItems[0].otherInfo,
                                'methodUsed ',
                                value,
                              )
                            }
                          />
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
                                      {value.isSieveSize}
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
                                      fieldName={
                                        'weightRetained'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type ===
                  TEST_TYPES.ATTERBEG_LIMIT_TEST ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details.values.map(
                            (value: any, indexDetails: number) => (
                              <View
                                style={{flexDirection: 'row'}}
                                key={indexDetails}>
                                <View
                                  style={{flexDirection: 'column', width: 80}}>
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
                                    {value.isSieveSize}
                                  </Text>
                                </View>

                                <View
                                  style={{flexDirection: 'column', width: 150}}>
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
                                    styleName={styles.inputStyle4}
                                    styles={styles}
                                    fieldName={'weightRetained'}
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
