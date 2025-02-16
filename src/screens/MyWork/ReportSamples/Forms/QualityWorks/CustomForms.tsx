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

  /*const onBlur = () => {
    if (fieldName === 'testArea' || fieldName === 'failureLoad') {
      if (Number(rowItem['testArea']).toString() !== 'NaN' && Number(rowItem['failureLoad']).toString() !== 'NaN') {
        const testArea = Number(rowItem['testArea']);
        const failureLoad = Number(rowItem['failureLoad']);
        if (testArea && failureLoad) {
          rowItem['compressiveStrength'] = Number((failureLoad * 1000 / testArea).toFixed(2));
        } else {
          rowItem['compressiveStrength'] = 0;
        }
      } else {
        rowItem['compressiveStrength'] = 0;
      }
      const total = concreteSampleTestItems[0].details.values.map((item: any) => Number(item.compressiveStrength)).reduce((prev: any, next: any) => prev + next, 0) || 0;
      const avg = Number((total / 3).toFixed(2));
      concreteSampleTestItems[0].avgStrength.value = avg;

      // Remark
      if (avg) { // Sample discarded
        const cubeNo1 = (Number(concreteSampleTestItems[0].details.values[0].compressiveStrength) - avg) / avg;
        const cubeNo1Pass = (avg <= (cubeNo1 + 15) && avg >= (cubeNo1 - 15));

        const cubeNo2 = (Number(concreteSampleTestItems[0].details.values[1].compressiveStrength) - avg) / avg;
        const cubeNo2Pass = (avg <= (cubeNo2 + 15) && avg >= (cubeNo2 - 15));

        const cubeNo3 = (Number(concreteSampleTestItems[0].details.values[2].compressiveStrength) - avg) / avg;
        const cubeNo3Pass = (avg <= (cubeNo3 + 15) && avg >= (cubeNo3 - 15));
        
        concreteSampleTestItems[0].remarks.value = '';
        if (!cubeNo1Pass || !cubeNo2Pass || !cubeNo3Pass) {
          concreteSampleTestItems[0].remarks.value = 'Sample discarded';
        } else { // Recheck
          const gradeOfConcrete = Number(selectedTestSample.name.substring(selectedTestSample.name.indexOf('Grade-M') + 7, selectedTestSample.name.lastIndexOf('/')))
          const recheck = !((0.67 * gradeOfConcrete) > avg);
          if (recheck) {
            concreteSampleTestItems[0].remarks.value = 'Recheck';
          } else {
            concreteSampleTestItems[0].remarks.value = 'Pass';
          }
        }
      }

      const concreteSampleTestItemsTemp = [...concreteSampleTestItems];

      setConcreteSampleTestItems(concreteSampleTestItemsTemp);
      
    }
  }*/

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

export const testSampleForm = (
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
  console.log('currentTestMaterialData', JSON.stringify(currentTestMaterialData));
  console.log('selectedTestSample.type :', selectedTestSample.type);
  console.log('materialType', materialType);
  if (
    !materialType ||
    materialType === TEST_MATERIALS_TYPES.CONCRETE ||
    materialType === TEST_MATERIALS_TYPES.CEMENT ||
    materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE ||
    materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE
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
          {currentTestMaterialData.materialType ===
            TEST_MATERIALS_TYPES.COARSE_AGGREGATE &&
            selectedTestSample.type === TEST_TYPES.LOS_ANGELES_ABRATION && (
              <View style={{flexDirection: 'column'}}>
                <DropdownPicker
                  value={'' + formSampleTest7thOr28thDay.typeOfConcreteSurface}
                  label="Test Conducted By"
                  items={TYPE_OF_CONCRETE_SURFACE_LIST}
                  onChange={(value: string) =>
                    handleInputChange('typeOfConcreteSurface', value)
                  }
                />
              </View>
            )}

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
                TEST_MATERIALS_TYPES.CONCRETE && (
                <View>
                  {concreteSampleTestItems.map((item: any, index: any) => (
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flexDirection: 'column', width: 80}}>
                        <View style={index === 0 && {height: 40}}>
                          {index === 0 && (
                            <Text style={{fontWeight: '700'}}>
                              {item.sampleNo.title}
                            </Text>
                          )}
                        </View>
                        <View>
                          <Text style={{textAlign: 'center'}}>
                            {item.sampleNo.value}
                          </Text>
                        </View>
                      </View>

                      <View style={{flexDirection: 'column'}}>
                        {/* <View style={{flexDirection: 'row'}}>
                            {
                              item.details.titles.map((title: any) => (
                                <View style={{flexDirection: 'column'}}>
                                <Text>{title}</Text>
                              </View>
                              ))
                            }
                            </View> */}
                        {/* <View> */}
                        {item.details.values.map(
                          (value: any, indexDetails: number) => (
                            <View style={{flexDirection: 'row'}}>
                              {/* <View style={{flexDirection: 'column', width: 60}}>
                                    {
                                      index === 0 ? 
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>{item.details.titles[0]}</Text>
                                    </View> : null
                                    }
                                    <Text style={[styles.textStyle2, {textAlign: 'center'}]}>{value.cubeNo}</Text>
                                  </View> */}

                              <View
                                style={{flexDirection: 'column', width: 120}}>
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
                                  fieldName={'wtCube'}></CustomTextInput>
                              </View>

                              <View
                                style={{flexDirection: 'column', width: 120}}>
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
                                  fieldName={'volOfCube'}></CustomTextInput>
                              </View>

                              <View
                                style={{flexDirection: 'column', width: 120}}>
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
                                  fieldName={'testArea'}></CustomTextInput>
                              </View>

                              <View
                                style={{flexDirection: 'column', width: 120}}>
                                {index === 0 && indexDetails === 0 ? (
                                  <View style={{height: 40}}>
                                    <Text style={{fontWeight: '700'}}>
                                      {item.details.titles[4]}
                                    </Text>
                                  </View>
                                ) : null}
                                <CustomTextInput
                                  rowItem={value}
                                  tempProp={false}
                                  styleName={styles.inputStyle3}
                                  styles={styles}
                                  fieldName={'failureLoad'}></CustomTextInput>
                              </View>

                              {/* <View style={{flexDirection: 'column', width: 120}}>
                                  {
                                      index === 0 ? 
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>{item.details.titles[5]}</Text>
                                    </View> : null
                                    }
                                    <Text style={[styles.textStyle, {textAlign: 'center'}]}>{value.compressiveStrength}</Text>
                                  </View> */}
                            </View>
                          ),
                        )}
                        {/* </View> */}
                      </View>
                      {/* <View style={{flexDirection: 'column', width: 120}}>
                            <View style={{height: 40}}>
                              <Text style={{fontWeight: '700'}}>{item.avgStrength.title}</Text>
                            </View>
                            <View style={styles.textStyle}>
                              <Text style={{textAlign: 'center'}}>{item.avgStrength.value}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'column', width: 120}}>
                          <View style={{height: 40}}>
                            <Text style={{fontWeight: '700'}}>{item.remarks.title}</Text>
                          </View>
                          <View style={styles.textStyle}>
                            <Text style={[{textAlign: 'center'}]}>{item.remarks.value}</Text>
                          </View>
                        </View> */}
                    </View>
                  ))}
                </View>
              )}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.CEMENT &&
                // selectedTestSample.type === TEST_TYPES.COMPRESSIVE_STRENGTH ?
                (selectedTestSample.type === TEST_TYPES.SOUNDNESS ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details.values.map(
                            (value: any, indexDetails: number) => (
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
                                    {value.slNo}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: 150,
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
                                    styleName={styles.inputStyle4}
                                    styles={styles}
                                    fieldName={
                                      'beforePuttingInBoilingWater'
                                    }></CustomTextInput>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: 150,
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
                                    styleName={styles.inputStyle4}
                                    styles={styles}
                                    fieldName={
                                      'afterPuttingInBoilingWater'
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
                  TEST_TYPES.FINENESS_CONSISTENCY_INITIAL_AND_FINAL_SETTING_TIME ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                          <View style={{height: 40}}>
                            <Text style={{fontWeight: '700'}}>
                              {item.sampleNo.value}
                            </Text>
                          </View>
                          {index === 0
                            ? item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
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
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.trainNo}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {indexDetails === 0 ? (
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
                                        {value.isSieve}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
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
                                        fieldName={
                                          'weightOfSample'
                                        }></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
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
                                        fieldName={
                                          'weightOfCementRetained'
                                        }></CustomTextInput>
                                    </View>
                                  </View>
                                ),
                              )
                            : index === 1
                            ? item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
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
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.trainNo}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
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
                                        fieldName={
                                          'weightOfCement'
                                        }></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
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
                                        fieldName={
                                          'weightOfWater'
                                        }></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
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
                                        fieldName={
                                          'penetrationOfPlunger'
                                        }></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[4]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomDropdownPicker
                                        rowItem={value}
                                        tempProp={false}
                                        items={YES_NO_LIST}
                                        fieldName={
                                          'penetrationBetween5To7'
                                        }></CustomDropdownPicker>
                                    </View>
                                  </View>
                                ),
                              )
                            : // 3
                              item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {indexDetails === 0 && (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      )}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.trainNo}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
                                      }}>
                                      {indexDetails === 0 && (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      )}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        styles={styles}
                                        fieldName={
                                          'weightOfCement'
                                        }></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTimePicker
                                        rowItem={value}
                                        fieldName={
                                          'timeOfAddingWater'
                                        }></CustomTimePicker>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[4]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTimePicker
                                        rowItem={value}
                                        fieldName={
                                          'timeWhenNeedleFails'
                                        }></CustomTimePicker>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
                                      }}>
                                      {indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[5]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTimePicker
                                        rowItem={value}
                                        fieldName={
                                          'timeWhenNeedleMakes'
                                        }></CustomTimePicker>
                                    </View>
                                  </View>
                                ),
                              )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  // ===
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}}>
                        {/* <View style={{ flexDirection: 'column', width: 80 }}>
                          <View style={index === 0 && { height: 40 }}>
                            {
                              index === 0 && <Text style={{ fontWeight: '700' }}>{item.sampleNo.title}</Text>
                            }
                          </View>
                          <View>
                            <Text style={{ textAlign: 'center' }}>{item.sampleNo.value}</Text>
                          </View>
                        </View> */}

                        <View style={{flexDirection: 'column'}}>
                          {/* <View style={{flexDirection: 'row'}}>
                              {
                                item.details.titles.map((title: any) => (
                                  <View style={{flexDirection: 'column'}}>
                                  <Text>{title}</Text>
                                </View>
                                ))
                              }
                              </View> */}
                          {/* <View> */}
                          {item.details.values.map(
                            (value: any, indexDetails: number) => (
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: 60,
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
                                    fieldName={'wtCube'}></CustomTextInput>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: 120,
                                  }}>
                                  {index === 0 && indexDetails === 0 ? (
                                    <View style={{height: 40}}>
                                      <Text style={{fontWeight: '700'}}>
                                        {item.details.titles[4]}
                                      </Text>
                                    </View>
                                  ) : null}
                                  <CustomTextInput
                                    rowItem={value}
                                    tempProp={false}
                                    styleName={styles.inputStyle3}
                                    styles={styles}
                                    fieldName={'failureLoad'}></CustomTextInput>
                                </View>

                                {/* <View style={{flexDirection: 'column', width: 120}}>
                                    {
                                        index === 0 ? 
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>{item.details.titles[5]}</Text>
                                      </View> : null
                                      }
                                      <Text style={[styles.textStyle, {textAlign: 'center'}]}>{value.compressiveStrength}</Text>
                                    </View> */}
                              </View>
                            ),
                          )}
                          {/* </View> */}
                        </View>
                        {/* <View style={{flexDirection: 'column', width: 120}}>
                              <View style={{height: 40}}>
                                <Text style={{fontWeight: '700'}}>{item.avgStrength.title}</Text>
                              </View>
                              <View style={styles.textStyle}>
                                <Text style={{textAlign: 'center'}}>{item.avgStrength.value}</Text>
                              </View>
                          </View>*/}
                      </View>
                    ))}
                  </View>
                ))}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.FINE_AGGREGATE &&
                (selectedTestSample.type === TEST_TYPES.GRADATION ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm (T)"
                        value={concreteSampleTestItems[0].weightOfSample}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'weightOfSample',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details.values.map(
                            (value: any, indexDetails: number) => (
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
                                    {value.sieveSize}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: 150,
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
                                    styleName={styles.inputStyle4}
                                    styles={styles}
                                    fieldName={
                                      'weightRetainedInGm'
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
                  TEST_TYPES.NATURAL_MOISTURE_CONTENT ? (
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
                ) : selectedTestSample.type ===
                  TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION ? (
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
                ) : null)}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.COARSE_AGGREGATE &&
                (selectedTestSample.type === TEST_TYPES.GRADATION ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm (T)"
                        value={concreteSampleTestItems[0].weightOfSample}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'weightOfSample',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                          <View style={{height: 40}}>
                            <Text style={{fontWeight: '700'}}>
                              {item.sampleNo.value}
                            </Text>
                          </View>
                          {item.details.values.map(
                            (value: any, indexDetails: number) => (
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
                                    {value.sieveSize}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: 150,
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
                                    styleName={styles.inputStyle4}
                                    styles={styles}
                                    fieldName={
                                      'weightRetainedInGm'
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
                  TEST_TYPES.LOS_ANGELES_ABRATION ? (
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
                ) : selectedTestSample.type ===
                  TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION ? (
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
                ) : selectedTestSample.type ===
                  TEST_TYPES.NATURAL_MOISTURE_CONTENT ? (
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
                ) : selectedTestSample.type === TEST_TYPES.FI_EI ? (
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
                                      {value.sizeFraction}
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
                                      {value.sizeFractionOfAggregateRetained}
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
                                      fieldName={
                                        'totalWeightOfAggregateRetained'
                                      }></CustomTextInput>
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
                                      fieldName={
                                        'weightPassingFlakinessGauge'
                                      }></CustomTextInput>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[4]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={
                                        'weightRetainedFlakinessGauge'
                                      }></CustomTextInput>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[5]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={
                                        'weightRetainedElongationGauge'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.PENETRATION_TEST ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Pouring Temperature (°C)"
                        value={concreteSampleTestItems[0].pouringTemp}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'pouringTemp',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Atmosphere (minutes)"
                        value={concreteSampleTestItems[0].periodCoolingTemp}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'periodCoolingTemp',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Water Bath (minutes)"
                        value={concreteSampleTestItems[0].periodCoolingInWater}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'periodCoolingInWater',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    {concreteSampleTestItems.map((item: any, index: any) => (
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
                                      {value.testNumber}
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
                                      fieldName={'initialDialReading'}
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
                                      fieldName={'finalDialReading'}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.DUCTILITY_TEST ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Air (min)"
                        value={concreteSampleTestItems[0].pouringOfCoolingAir}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'pouringOfCoolingAir',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Water Bath Before Trimming (min)"
                        value={
                          concreteSampleTestItems[0].periodCoolintBeforeTrimming
                        }
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'periodCoolintBeforeTrimming',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Water Bath After Trimming (min)"
                        value={
                          concreteSampleTestItems[0].periodCoolingAfterTriming
                        }
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'periodCoolingAfterTriming',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

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
                                      width: 150,
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
                                      width: 100,
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
                                      fieldName={'test2'}
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
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.FLASH_FIRE_POINTS ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values
                              .filter((value: any) => !value.hide)
                              .map((value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
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
                                      width: 80,
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
                                      width: 80,
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
                                      width: 80,
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
                ) : selectedTestSample.type === TEST_TYPES.SOFTENING_POINT ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Pouring Temp (C)"
                        value={concreteSampleTestItems[0].pouringTemp}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'pouringTemp',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

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
                                      {value.timeInMin}
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
                                        'ballNumber1Temp'
                                      }></CustomTextInput>
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
                                      fieldName={
                                        'ballNumber2Temp'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.DBM_MIX_GRADING_2 ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm (T)"
                        value={concreteSampleTestItems[0].totalInGram}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'totalInGram',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View>
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
                                        {value.sieveSize}
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
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.DBM_MIX_GRADING_1 ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm (T)"
                        value={concreteSampleTestItems[0].totalInGram}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'totalInGram',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View key={index} style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  key={indexDetails}
                                  style={{
                                    flexDirection: 'row',
                                    marginVertical: 8,
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
                                      alignItems: 'center',
                                    }}>
                                    {index === 0 && indexDetails === 0 && (
                                      <Text
                                        style={{
                                          fontWeight: '700',
                                          marginBottom: 8,
                                        }}>
                                        {item.details.titles[0]}
                                      </Text>
                                    )}
                                    <Text style={styles.textStyle2}>
                                      {value.sieveSize}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 140,
                                      alignItems: 'center',
                                    }}>
                                    {index === 0 && indexDetails === 0 && (
                                      <Text
                                        style={{
                                          fontWeight: '700',
                                          marginBottom: 8,
                                        }}>
                                        {item.details.titles[1]}
                                      </Text>
                                    )}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
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
                ) : selectedTestSample.type === TEST_TYPES.BC_MIX_GRADE_2 ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values
                              .filter((value: any) => !value.hide)
                              .map((value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={`${index}-${indexDetails}`}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
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
                                      {value.sieveSize}
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
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.BC_MIX_GRADE_1 ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginBottom: 10}}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  key={indexDetails}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                  }}>
                                  {/* Sieve Size Column */}
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text
                                          style={{
                                            fontWeight: '700',
                                            textAlign: 'center',
                                          }}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {
                                          textAlign: 'center',
                                          marginVertical: 5,
                                        },
                                      ]}>
                                      {value.sieveSize}
                                    </Text>
                                  </View>

                                  {/* Weight Retained Column */}
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text
                                          style={{
                                            fontWeight: '700',
                                            textAlign: 'center',
                                          }}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
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
                ) : selectedTestSample.type ===
                  TEST_TYPES.DENSITY_OF_COMPACTED_LAYER ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values
                              .filter((value: any) => !value.hide)
                              .map((value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 180,
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

                                  {['test1', 'test2', 'test3'].map(
                                    (fieldName, testIndex) => (
                                      <View
                                        key={testIndex}
                                        style={{
                                          flexDirection: 'column',
                                          width: 120,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {
                                                item.details.titles[
                                                  testIndex + 1
                                                ]
                                              }
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle3}
                                          styles={styles}
                                          fieldName={
                                            fieldName
                                          }></CustomTextInput>
                                      </View>
                                    ),
                                  )}
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.BINDER_CONTENT ? (
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
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginBottom: 10}}>
                        <View style={{flexDirection: 'column', flex: 1}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  key={indexDetails}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                  }}>
                                  {/* Description */}
                                  <View style={{flex: 1, paddingHorizontal: 5}}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[0]}
                                      </Text>
                                    ) : null}
                                    <Text style={styles.textStyle}>
                                      {value.description}
                                    </Text>
                                  </View>

                                  {/* Test 1 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[1]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test1"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>

                                  {/* Test 2 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[2]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test2"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>

                                  {/* Test 3 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[3]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test3"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.WATER_ABSORPTION ? (
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
                  TEST_TYPES.PERCENTAGE_OF_FRACTURE_FACE ? (
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
                  TEST_TYPES.MICRO_SURFACING_GRADATION ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm (T)"
                        value={concreteSampleTestItems[0].totalInGram}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'totalInGram',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
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
                                      {value.sieveSize}
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
                ) : selectedTestSample.type === TEST_TYPES.SAND_EQUIVALENT ? (
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
                ) : null)}
              {/*1.Material Type: SMA */}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.SMA &&
                (selectedTestSample.type === TEST_TYPES.MIX_GRADING ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm (T)"
                        value={concreteSampleTestItems[0].totalInGram}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'totalInGram',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginBottom: 10}}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  key={indexDetails}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                  }}>
                                  {/* Sieve Size Column */}
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text
                                          style={{
                                            fontWeight: '700',
                                            textAlign: 'center',
                                          }}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {
                                          textAlign: 'center',
                                          marginVertical: 5,
                                        },
                                      ]}>
                                      {value.sieveSize}
                                    </Text>
                                  </View>

                                  {/* Weight Retained Column */}
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text
                                          style={{
                                            fontWeight: '700',
                                            textAlign: 'center',
                                          }}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
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
                ) : selectedTestSample.type === TEST_TYPES.BINDER_CONTENT ? (
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
                  TEST_TYPES.DENSITY_OF_COMPACTED_LAYER ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values
                              .filter((value: any) => !value.hide)
                              .map((value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 180,
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

                                  {['test1', 'test2', 'test3'].map(
                                    (fieldName, testIndex) => (
                                      <View
                                        key={testIndex}
                                        style={{
                                          flexDirection: 'column',
                                          width: 120,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {
                                                item.details.titles[
                                                  testIndex + 1
                                                ]
                                              }
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle3}
                                          styles={styles}
                                          fieldName={
                                            fieldName
                                          }></CustomTextInput>
                                      </View>
                                    ),
                                  )}
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type ===
                  TEST_TYPES.STABILITY_AND_VOID_ANALYSIS ? (
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
                ) : null)}
              {/* 2.Material Type: Micro Surfacing */}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.MICRO_SURFACING &&
                (selectedTestSample.type === TEST_TYPES.BINDER_CONTENT ? (
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
                ) : null)}
              {/* 3.Material Type: DBM RAP DBM(isme 2 grading hai aur task me sirf
              ek hai mix grading) */}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.DBM_RAP_DBM &&
                (selectedTestSample.type === TEST_TYPES.BINDER_CONTENT ? (
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
                ) : selectedTestSample.type === TEST_TYPES.MIX_GRADING ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm "
                        value={concreteSampleTestItems[0].totalInGram}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'totalInGram',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginBottom: 10}}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  key={indexDetails}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                  }}>
                                  {/* Sieve Size Column */}
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text
                                          style={{
                                            fontWeight: '700',
                                            textAlign: 'center',
                                          }}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {
                                          textAlign: 'center',
                                          marginVertical: 5,
                                        },
                                      ]}>
                                      {value.sieveSize}
                                    </Text>
                                  </View>

                                  {/* Weight Retained Column */}
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 100,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text
                                          style={{
                                            fontWeight: '700',
                                            textAlign: 'center',
                                          }}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
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
                ) : selectedTestSample.type ===
                  TEST_TYPES.STABILITY_AND_VOID_ANALYSIS ? (
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
                  TEST_TYPES.DENSITY_OF_COMPACTED_LAYER ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values
                              .filter((value: any) => !value.hide)
                              .map((value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 180,
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

                                  {['test1', 'test2', 'test3'].map(
                                    (fieldName, testIndex) => (
                                      <View
                                        key={testIndex}
                                        style={{
                                          flexDirection: 'column',
                                          width: 120,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {
                                                item.details.titles[
                                                  testIndex + 1
                                                ]
                                              }
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle3}
                                          styles={styles}
                                          fieldName={
                                            fieldName
                                          }></CustomTextInput>
                                      </View>
                                    ),
                                  )}
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null)}
              {/* 4.Material Type: Corce Aggregate(Micro Surfacing) */}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING &&
                (selectedTestSample.type === TEST_TYPES.GRADATION ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm (T)"
                        value={concreteSampleTestItems[0].totalInGram}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'totalInGram',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                          <View style={{height: 40}}>
                            <Text style={{fontWeight: '700'}}>
                              {item.sampleNo.value}
                            </Text>
                          </View>
                          {item.details.values.map(
                            (value: any, indexDetails: number) => (
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
                                    {value.sieveSize}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'column',
                                    width: 150,
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
                                    styleName={styles.inputStyle4}
                                    styles={styles}
                                    fieldName={
                                      'weightRetainedInGm'
                                    }></CustomTextInput>
                                </View>
                              </View>
                            ),
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.WATER_ABSORPTION ? (
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
                ) : null)}
              {/* 5.Material Type: Corce Aggregate(SMA) */}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING &&
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
                  TEST_TYPES.PERCENTAGE_OF_FRACTURE_FACE ? (
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
                  TEST_TYPES.AGGREGATE_IMPACT_VALUE ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginBottom: 10}}>
                        <View style={{flexDirection: 'column', flex: 1}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  key={indexDetails}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                  }}>
                                  {/* Description */}
                                  <View style={{flex: 1, paddingHorizontal: 5}}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[0]}
                                      </Text>
                                    ) : null}
                                    <Text style={styles.textStyle}>
                                      {value.description}
                                    </Text>
                                  </View>

                                  {/* Test 1 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[1]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test1"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>

                                  {/* Test 2 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[2]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test2"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>

                                  {/* Test 3 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[3]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test3"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.FI_EI ? (
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
                                      {value.sizeFraction}
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
                                      {value.sizeFractionOfAggregateRetained}
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
                                      fieldName={
                                        'totalWeightOfAggregateRetained'
                                      }></CustomTextInput>
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
                                      fieldName={
                                        'weightPassingFlakinessGauge'
                                      }></CustomTextInput>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[4]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={
                                        'weightRetainedFlakinessGauge'
                                      }></CustomTextInput>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[5]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={
                                        'weightRetainedElongationGauge'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null)}
              {/* 6.Material Type: Corce Aggregate dbm bc dbm */}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC &&
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
                  TEST_TYPES.PERCENTAGE_OF_FRACTURE_FACE ? (
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
                  TEST_TYPES.AGGREGATE_IMPACT_VALUE ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: number) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginBottom: 10}}>
                        <View style={{flexDirection: 'column', flex: 1}}>
                          {item.details &&
                            item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View
                                  key={indexDetails}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                  }}>
                                  {/* Description */}
                                  <View style={{flex: 1, paddingHorizontal: 5}}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[0]}
                                      </Text>
                                    ) : null}
                                    <Text style={styles.textStyle}>
                                      {value.description}
                                    </Text>
                                  </View>

                                  {/* Test 1 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[1]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test1"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>

                                  {/* Test 2 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[2]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test2"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>

                                  {/* Test 3 */}
                                  <View
                                    style={{
                                      flex: 0.8,
                                      paddingHorizontal: 5,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          marginBottom: 5,
                                        }}>
                                        {item.details.titles[3]}
                                      </Text>
                                    ) : null}
                                    <CustomTextInput
                                      tempProp={false}
                                      rowItem={value}
                                      fieldName="test3"
                                      styleName={styles.inputStyle}
                                      styles={styles}
                                    />
                                  </View>
                                </View>
                              ),
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.FI_EI ? (
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
                                      {value.sizeFraction}
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
                                      {value.sizeFractionOfAggregateRetained}
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
                                      fieldName={
                                        'totalWeightOfAggregateRetained'
                                      }></CustomTextInput>
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
                                      fieldName={
                                        'weightPassingFlakinessGauge'
                                      }></CustomTextInput>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[4]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={
                                        'weightRetainedFlakinessGauge'
                                      }></CustomTextInput>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[5]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      styles={styles}
                                      fieldName={
                                        'weightRetainedElongationGauge'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null)}
              {/* 7.Material Type: Bitumen */}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.BITUMEN &&
                (selectedTestSample.type === TEST_TYPES.SOFTENING_POINT ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Pouring Temp (C)"
                        value={concreteSampleTestItems[0].pouringTemp}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'pouringTemp',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

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
                                      {value.timeInMin}
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
                                        'ballNumber1Temp'
                                      }></CustomTextInput>
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
                                      fieldName={
                                        'ballNumber2Temp'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.FLASH_FIRE_POINTS ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values
                              .filter((value: any) => !value.hide)
                              .map((value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
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
                                      width: 80,
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
                                      width: 80,
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
                                      width: 80,
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
                ) : selectedTestSample.type === TEST_TYPES.DUCTILITY_TEST ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Air (min)"
                        value={concreteSampleTestItems[0].pouringOfCoolingAir}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'pouringOfCoolingAir',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Water Bath Before Trimming (min)"
                        value={
                          concreteSampleTestItems[0].periodCoolintBeforeTrimming
                        }
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'periodCoolintBeforeTrimming',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Water Bath After Trimming (min)"
                        value={
                          concreteSampleTestItems[0].periodCoolingAfterTriming
                        }
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'periodCoolingAfterTriming',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

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
                                      width: 150,
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
                                      width: 100,
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
                                      fieldName={'test2'}
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
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type === TEST_TYPES.PENETRATION_TEST ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Pouring Temperature (°C)"
                        value={concreteSampleTestItems[0].pouringTemp}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'pouringTemp',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Atmosphere (minutes)"
                        value={concreteSampleTestItems[0].periodCoolingTemp}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'periodCoolingTemp',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Period of Cooling in Water Bath (minutes)"
                        value={concreteSampleTestItems[0].periodCoolingInWater}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'periodCoolingInWater',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>

                    {concreteSampleTestItems.map((item: any, index: any) => (
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
                                      {value.testNumber}
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
                                      fieldName={'initialDialReading'}
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
                                      fieldName={'finalDialReading'}
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
              {/* 8.Material Type: BC */}
              {currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.BC &&
                (selectedTestSample.type === TEST_TYPES.BINDER_CONTENT ? (
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
                ) : selectedTestSample.type === TEST_TYPES.MIX_GRADING ? (
                  <View>
                    <View style={{flexDirection: 'column'}}>
                      <Input
                        label="Total weight of Sample in gm"
                        value={concreteSampleTestItems[0].totalInGram}
                        onChange={(value: any) =>
                          handleInputChangeFineAggregate(
                            concreteSampleTestItems[0],
                            'totalInGram',
                            value,
                          )
                        }
                        isRequired={true}
                      />
                    </View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View>
                        <View
                          key={index}
                          style={{flexDirection: 'row', marginBottom: 10}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View
                                    key={indexDetails}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 5,
                                    }}>
                                    {/* Sieve Size Column */}
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text
                                            style={{
                                              fontWeight: '700',
                                              textAlign: 'center',
                                            }}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {
                                            textAlign: 'center',
                                            marginVertical: 5,
                                          },
                                        ]}>
                                        {value.sieveSize}
                                      </Text>
                                    </View>

                                    {/* Weight Retained Column */}
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text
                                            style={{
                                              fontWeight: '700',
                                              textAlign: 'center',
                                            }}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        styles={styles}
                                        fieldName={'weightRetained'}
                                      />
                                    </View>
                                  </View>
                                ),
                              )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : selectedTestSample.type ===
                  TEST_TYPES.STABILITY_AND_VOID_ANALYSIS ? (
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
                  TEST_TYPES.DENSITY_OF_COMPACTED_LAYER ? (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}} key={index}>
                        <View style={{flexDirection: 'column'}}>
                          {item.details &&
                            item.details.values
                              .filter((value: any) => !value.hide)
                              .map((value: any, indexDetails: number) => (
                                <View
                                  style={{flexDirection: 'row'}}
                                  key={indexDetails}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 180,
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

                                  {['test1', 'test2', 'test3'].map(
                                    (fieldName, testIndex) => (
                                      <View
                                        key={testIndex}
                                        style={{
                                          flexDirection: 'column',
                                          width: 120,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {
                                                item.details.titles[
                                                  testIndex + 1
                                                ]
                                              }
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle3}
                                          styles={styles}
                                          fieldName={
                                            fieldName
                                          }></CustomTextInput>
                                      </View>
                                    ),
                                  )}
                                </View>
                              ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null)}
              {/* 9.Material Type: Micro Surfacing */}
              {currentTestMaterialData.materialType ===
                (TEST_MATERIALS_TYPES.MICRO_SURFACING &&
                selectedTestSample.type === TEST_TYPES.SAND_EQUIVALENT ? (
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
                ) : null)}
              {/* 10.Material Type: Emulsion(No form available)*/}
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
