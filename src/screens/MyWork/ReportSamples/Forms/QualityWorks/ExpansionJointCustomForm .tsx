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
              {selectedTestSample &&
                (selectedTestSample.type ===
                TEST_TYPES.ANCHORAGE_PULL_OUT_TEST ? (
                  <View>
                    <Input
                      label="Drawing Number"
                      value={concreteSampleTestItems[0].otherInfo.drawingNumber}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'drawingNumber',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Number of anchorages per meter length"
                      value={concreteSampleTestItems[0].numberOfAnchorages}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'numberOfAnchorages',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Load to be applied on each anchorage MT (A)"
                      value={concreteSampleTestItems[0].loadToBeApplied}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'loadToBeApplied',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Effective ram area of pressure jack cm2 (B)"
                      value={concreteSampleTestItems[0].effectiveRamArea}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'effectiveRamArea',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Applied pressure gauge reading kg/cm2"
                      value={concreteSampleTestItems[0].appliedPressure}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'appliedPressure',
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
                                      width: 100,
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
                                      {value.slNo}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 200,
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
                                      fieldName={'component'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      fieldName={'value'}
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
                  TEST_TYPES.DERBIS_EXPULSION_TEST ? (
                  <View>
                    <Input
                      label="Drawing Number"
                      value={concreteSampleTestItems[0].otherInfo.drawingNumber}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'drawingNumber',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Weight of debris filled (kgs) (A)"
                      value={concreteSampleTestItems[0].weightOfDebrisFilled}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'weightOfDebrisFilled',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Weight of Debris expelled (kgs)"
                      value={concreteSampleTestItems[0].weightOfDebrisExpelled}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'weightOfDebrisExpelled',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Actual weight of debris expelled"
                      value={concreteSampleTestItems[0].effectiveRamArea}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'actualWeightOfDebris',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Number of cycle runs"
                      value={concreteSampleTestItems[0].numberOfCycleRuns}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'numberOfCycleRuns',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <DropdownPicker
                      label="Is debris expulsion more than 75% weight of debris filled in joint within 25 cycles?"
                      value={
                        concreteSampleTestItems[0].testLoadTimesOfDesignSLS
                      }
                      items={[
                        {label: 'Yes', value: 'Y'},
                        {label: 'No', value: 'N'},
                      ]}
                      onChange={(value: string) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'testLoadTimesOfDesignSLS',
                          value,
                        )
                      }
                    />
                  </View>
                ) : selectedTestSample.type ===
                  TEST_TYPES.DYE_PENETRATION_TEST ? (
                  <View>
                    <Input
                      label="Drawing Number"
                      value={concreteSampleTestItems[0].otherInfo.drawingNumber}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'drawingNumber',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Cleaner Used"
                      value={concreteSampleTestItems[0].cleanerUsed}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'cleanerUsed',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Penetrant used"
                      value={concreteSampleTestItems[0].penetrantUsed}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'penetrantUsed',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Developer used"
                      value={concreteSampleTestItems[0].developerUsed}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'developerUsed',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {/* Clock format */}
                    <Input
                      label="Penetrant Time (Min.)"
                      value={concreteSampleTestItems[0].penetrantTime}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'penetrantTime',
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
                                      width: 100,
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
                                      {value.slNo}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 200,
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
                                      fieldName={'observation'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      fieldName={'acceptance'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.PONDING_TEST ? (
                  <View>
                    <Input
                      label="Drawing Number"
                      value={concreteSampleTestItems[0].otherInfo.drawingNumber}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'drawingNumber',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Actual height of water filled(mm)"
                      value={concreteSampleTestItems[0].actualHeightOfWater}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'actualHeightOfWater',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {/* Clock format */}
                    <Input
                      label="Test Duration (Hr)"
                      value={concreteSampleTestItems[0].testDuration}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'testDuration',
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
                                      width: 100,
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
                                      {value.slNo}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 200,
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
                                      fieldName={'observation'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      fieldName={'acceptance'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.SEAL_PULL_TEST ? (
                  <View>
                    <Input
                      label="Drawing Number"
                      value={concreteSampleTestItems[0].otherInfo.drawingNumber}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'drawingNumber',
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
                                      width: 100,
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
                                      width: 200,
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
                                      fieldName={'from'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      fieldName={'to'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                    <Input
                      label="Actual extension before slippage"
                      value={concreteSampleTestItems[0].actualExtensionBefore}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'actualExtensionBefore',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <DropdownPicker
                      label="The seal should not slip not slip before 150% of maximum rated design movement."
                      value={concreteSampleTestItems[0].sealNotSlip}
                      items={[
                        {label: 'Yes', value: 'Y'},
                        {label: 'No', value: 'N'},
                      ]}
                      onChange={(value: string) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'sealNotSlip',
                          value,
                        )
                      }
                    />
                  </View>
                ) : selectedTestSample.type ===
                  TEST_TYPES.VISUAL_DIMENSION_TEST ? (
                  <View>
                    <Input
                      label="Drawing Number"
                      value={concreteSampleTestItems[0].otherInfo.drawingNumber}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'drawingNumber',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.detailsObs &&
                            item.detailsObs.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      width: 200,
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
                                      fieldName={'approved'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      fieldName={'observed'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                    <View>Visual Inspection on</View>
                    <Input
                      label="Welding"
                      value={concreteSampleTestItems[0].welding}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'welding',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Surface Finish"
                      value={concreteSampleTestItems[0].surfaceFinish}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'surfaceFinish',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    <Input
                      label="Strightness"
                      value={concreteSampleTestItems[0].strightness}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0],
                          'strightness',
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
                                      width: 100,
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
                                      width: 200,
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
                                      fieldName={'from'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      fieldName={'to'}
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
                  TEST_TYPES.CYCLIC_MOTION_TEST ? (
                  <View>
                    <Input
                      label="Drawing Number"
                      value={concreteSampleTestItems[0].otherInfo.drawingNumber}
                      onChange={(value: any) =>
                        handleInputChangeFineAggregate(
                          concreteSampleTestItems[0].otherInfo,
                          'drawingNumber',
                          value,
                        )
                      }
                      isRequired={true}
                    />
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.detailsObs &&
                            item.detailsObs.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      width: 200,
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
                                      fieldName={'approved'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      fieldName={'observed'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
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
                                      width: 100,
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
                                      width: 200,
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
                                      fieldName={'from'}
                                    />
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
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
                                      fieldName={'to'}
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
