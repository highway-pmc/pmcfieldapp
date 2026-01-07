import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropdownPicker from '../../../../../components/UI/DropdownPicker';
import {
  CEMENT_TYPE_LIST,
  CONCRETE_GRADE_LIST,
  RFI_STATUS,
  SEGMENT_TYPES_DISPLAY,
  TASK_TYPES,
  YES_NO_LIST,
  YES_NO_NA_LIST,
} from '../../../../../constants/constants';
import {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import TimePicker from '../../../../../components/UI/TimePicker';
import CalendarPicker from '../../../../../components/UI/CalenderPicker';
import * as ImagePicker from 'react-native-image-picker';
import Input from '../../../../../components/UI/Input';
import {Guid} from 'guid-typescript';
import {styles} from './Styles';
import {Validates} from './Validates';
import {Events} from './Events';
import TableCommonStyles from '../../../../Common/TableCommonStyles';
import {groupBy} from '../../../../../utils/Utils';
import LinearGradient from 'react-native-linear-gradient';
import {getWorkTypeColors} from '../../../../Common/CommonConstantsTypes';
import {useNavigation} from '@react-navigation/native';

export const CustomForms = (_v: any, workType: any, taskCategory: any) => {
  const _validation = Validates(_v);
  const _event = Events(_v);
  const showSnackbar = _v.showSnackbar;

  const workTypeColors = getWorkTypeColors(workType);

  const shouldRenderStartButton = (item: any) => {
    const {materialRequestParentData} = item;

    if (!materialRequestParentData) {
      return true; // Render if materialRequestParentData is null or undefined
    }

    const {isMaterialRequested, materialRequestStatus} =
      materialRequestParentData;

    if (isMaterialRequested === false) {
      return true; // Render if isMaterialRequested is false
    }

    if (isMaterialRequested === true && materialRequestStatus === 'completed') {
      return true; // Render if isMaterialRequested is true and materialRequestStatus is 'completed'
    }

    return false; // Do not render for all other cases
  };
  const shouldRenderMaterialRequestButton = (item: any) => {
    const {materialRequestParentData} = item;

    if (!materialRequestParentData) {
      return true; // Render if materialRequestParentData is null or undefined
    }

    // const {isMaterialRequested, materialRequestStatus} =
    //   materialRequestParentData;

    // if (isMaterialRequested === false) {
    //   return true; // Render if isMaterialRequested is false
    // }

    // if (isMaterialRequested === true && materialRequestStatus === 'completed') {
    //   return true; // Render if isMaterialRequested is true and materialRequestStatus is 'completed'
    // }

    return false; // Do not render for all other cases
  };

  const CustomTextInput = ({
    rowItem,
    fieldName,
  }: {
    rowItem: any;
    fieldName: any;
  }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (text: any) => {
      {
        rowItem[fieldName] = text;
      }
    };

    return (
      <TextInput
        style={styles.commonInputFiels}
        placeholder=""
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        underlineColorAndroid="#f000"
        blurOnSubmit={false}
        value={value}
        onChangeText={text => {
          setValue(text);
          updateValue(text);
        }}
      />
    );
  };
  const CustomTextInputValue = ({
    rowItem,
    fieldName,
    index,
    onChange,
  }: {
    rowItem: any;
    fieldName: string;
    index: number;
    onChange: (index: number, field: string, value: string) => void;
  }) => {
    const [value, setValue] = useState(rowItem[fieldName]);

    const handleChange = (text: string) => {
      setValue(text);
      onChange(index, fieldName, text);
    };

    return (
      <TextInput
        style={styles.commonInputFiels}
        placeholder=""
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        underlineColorAndroid="#f000"
        blurOnSubmit={false}
        value={value}
        onChangeText={handleChange}
      />
    );
  };

  const CustomDropdownPicker = ({
    items,
    rowItem,
    fieldName,
  }: {
    items: any;
    rowItem: any;
    fieldName: any;
  }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const [openList, setOpenList] = useState(false);
    const updateValue = () => {
      {
        rowItem[fieldName] = value;
      }
    };
    return (
      <DropDownPicker
        style={[styles.DropDownFiels, {minWidth: 110, maxWidth: 220}]}
        open={openList}
        value={value}
        items={items}
        setOpen={setOpenList}
        setValue={setValue}
        listMode="MODAL"
        closeAfterSelecting={true}
        onChangeValue={() => updateValue()}
      />
    );
  };

  const renderItemFoundation = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text>{rowData.index + 1}</Text>
      </View>
      <View style={styles.cell}>
        <DropdownPicker
          label="Source"
          items={CONCRETE_GRADE_LIST}
          value={rowData.item.gradeOfConcrete}
          onChange={(item: any) =>
            _validation.handleTextInputChangeFoundation(
              rowData.index,
              'gradeOfConcrete',
              item.value,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'slumpValue'}
          index={rowData.index}
          onChange={_validation.handleTextInputChangeFoundation}
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.concreteStartTime}
          onChange={time =>
            _validation.handleTimeChangeFoundation(
              rowData.index,
              'concreteStartTime',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'concretePoured'}
          index={rowData.index}
          onChange={_validation.handleTextInputChangeFoundation}
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.concreteFinishTime}
          onChange={time =>
            _validation.handleTimeChangeFoundation(
              rowData.index,
              'concreteFinishTime',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'totalFoundationCasted'}
          index={rowData.index}
          onChange={_validation.handleTextInputChangeFoundation}
        />
      </View>
      <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() =>
            deleteConstructionOfFoundationItem(rowData, rowData.item.key)
          }>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('../../../../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFoundationHeadings = () => (
    <View style={styles.rowContainer}>
      <Text style={styles.cellText}>Grade of Concrete</Text>
      <Text style={styles.cellText}>Slump Value (mm)</Text>
      <Text style={styles.cellText}>Concrete Start Time</Text>
      <Text style={styles.cellText}>Concrete Poured (cum)</Text>
      <Text style={styles.cellText}>Concrete Finish Time</Text>
      <Text style={styles.cellText}>Total Foundation Casted</Text>
    </View>
  );
  const renderItemBallast = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text>{rowData.index + 1}</Text>
      </View>
      <View style={styles.cell}>
        <DropdownPicker
          label="Source"
          items={CONCRETE_GRADE_LIST}
          value={rowData.item.gradeOfConcrete}
          onChange={(item: any) =>
            _validation.handleTextInputChangeBallast(
              rowData.index,
              'gradeOfConcrete',
              item.value,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'slumpValue'}
          index={rowData.index}
          onChange={_validation.handleTextInputChangeBallast}
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.concreteStartTime}
          onChange={time =>
            _validation.handleTimeChangeBallast(
              rowData.index,
              'concreteStartTime',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'concretePoured'}
          index={rowData.index}
          onChange={_validation.handleTextInputChangeBallast}
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.concreteFinishTime}
          onChange={time =>
            _validation.handleTimeChangeBallast(
              rowData.index,
              'concreteFinishTime',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'totalBallastCasted'}
          index={rowData.index}
          onChange={_validation.handleTextInputChangeBallast}
        />
      </View>
      <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => _v.deleteBallastItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('../../../../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBallastHeadings = () => (
    <View style={styles.rowContainer}>
      <Text style={styles.cellText}>Grade of Concrete</Text>
      <Text style={styles.cellText}>Slump Value (mm)</Text>
      <Text style={styles.cellText}>Concrete Start Time</Text>
      <Text style={styles.cellText}>Concrete Poured (cum)</Text>
      <Text style={styles.cellText}>Concrete Finish Time</Text>
      <Text style={styles.cellText}>Total Ballast Casted</Text>
    </View>
  );

  const renderLayingOfDlcHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={[styles.cell, {width: 70}]}>
        <Text style={styles.cellText}>S. No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Vehicle No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Total Qty of DLC</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Laying Start Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Laying End Time</Text>
      </View>
      <View style={[styles.cell, {paddingHorizontal: 40}]}>
        <Text style={styles.cellText}>Actions</Text>
      </View>
    </View>
  );
  const deleteLayingOfDlcItem = (rowMap: any, rowKey: any) => {
    _v.closeRow(rowMap, rowKey);
    const newData = [..._v.layingOfDlcTableData];
    const prevIndex = _v.layingOfDlcTableData.findIndex(
      item => item.key === rowKey,
    );
    newData.splice(prevIndex, 1);
    _v.setLayingOfDlcTableData(newData);
  };
  const deleteConstructionOfFoundationItem = (rowMap: any, rowKey: any) => {
    _v.closeRow(rowMap, rowKey);
    const newData = [..._v.foundationData];
    const prevIndex = _v.foundationData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    _v.setFoundationData(newData);
  };
  const renderItemLayingOfDlc = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={[styles.cell, {width: 70}]}>
        <Text>{rowData.index + 1}</Text>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'vehicleNo'}
          index={rowData.index}
          onChange={handleTextInputChangeLayingOfDlc}
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'totalQtyDlc'}
          index={rowData.index}
          onChange={handleTextInputChangeLayingOfDlc}
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label="Laying Start Time"
          value={rowData.item.layingStartTime}
          onChange={time =>
            handleTimeChangeLayingOfDlc(rowData.index, 'layingStartTime', time)
          }
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label="Laying End Time"
          value={rowData.item.layingEndTime}
          onChange={time =>
            handleTimeChangeLayingOfDlc(rowData.index, 'layingEndTime', time)
          }
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
        />
      </View>

      <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => deleteLayingOfDlcItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('../../../../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleTextInputChangeLayingOfDlc = (index, fieldName, value) => {
    _v.setLayingOfDlcTableData((prevData: any) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [fieldName]: value,
      };
      return newData;
    });
  };

  const handleTimeChangeLayingOfDlc = (index, fieldName, time) => {
    _v.setLayingOfDlcTableData((prevData: any) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [fieldName]: time,
      };
      return newData;
    });
  };

  /***************************************/
  const renderGlueingHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Joint No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Ambient Temp (°C)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Batch No Resin</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Batch No Hardener</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Mixing Start Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Mixing Finish Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Application Start Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Application Finish Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Segment Joining Time Closure</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Segment Joining Time Temporary PT Finish
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Segment Surface Area (SQM)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Epoxy Consumption Theoretical Resin (Kgs)
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Epoxy Consumption Theoretical Hardener (Kgs)
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Epoxy Consumption Actual Resin (Kgs)
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Epoxy Consumption Actual Hardener (Kgs)
        </Text>
      </View>
    </View>
  );
  const renderTemporaryPrestressingHeadings = () => (
    <View style={styles.rowContainer}>
      {/* <View style={[styles.cell, {width: 50}]}>
        <Text style={styles.cellText}>TM No.</Text>
      </View> */}
      <View style={styles.cell}>
        <Text style={styles.cellText}>Joint No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Calibration Done</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Stressing Sequence Drawing No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Date of Prestressing</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Time of Prestressing</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Max Jack Pressure (Kg/Cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Jack Pressure Applied (Kg/Cm²)</Text>
      </View>
      {/* <View style={[styles.cell, {paddingHorizontal: 40}]}>
        <Text style={styles.cellText}>Actions</Text>
      </View> */}
    </View>
  );
  const renderItemTemporaryPrestressing = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        {/* <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'jointNumbers'}
          index={rowData.index}
          onChange={
            handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue> */}
        <Text style={styles.cellText}>{rowData.item['jointNumbers']}</Text>
      </View>

      <View style={styles.cell}>
        {/* <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'calibrationDone'}
          index={rowData.index}
          onChange={
            handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue> */}

        <DropdownPicker
          label=""
          value={rowData.item.calibrationDone}
          items={YES_NO_NA_LIST}
          style={styles.marginBootomZero}
          onChange={(newValue: string) => {
            const newData = [..._v.temporaryPrestressingData];
            newData[rowData.index]['calibrationDone'] = newValue;
            _v.setTemporaryPrestressingData(newData);
          }}
          isRequired={true}
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'stressingSequenceDrawingNumber'}
          index={rowData.index}
          onChange={
            _v.handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CalendarPicker
          label=""
          value={rowData.item.dateOfPrestressing}
          onChange={date =>
            _v.handleTextInputChangeTemporaryPrestressing(
              rowData.index,
              'dateOfPrestressing',
              date,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.timeOfPrestressing}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            _v.handleTextInputChangeTemporaryPrestressing(
              rowData.index,
              'timeOfPrestressing',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'maxJackPressure'}
          index={rowData.index}
          onChange={
            _v.handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'jackPressureApplied'}
          index={rowData.index}
          onChange={
            _v.handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue>
      </View>

      {/* <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() =>
            deleteTemporaryPrestressingItem(rowData, rowData.item.key)
          }>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('../../../../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );

  const renderItemTorquing = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={[styles.cell, {width: 50}]}>
        <Text style={styles.cellText}>TM {rowData.index + 1}</Text>
      </View>

      <View style={styles.cell}>
        <CalendarPicker
          label=""
          value={rowData.item.date}
          onChange={date =>
            _validation.handleTextInputChangeTorquing(
              rowData.index,
              'date',
              date,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.date}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            _validation.handleTextInputChangeTorquing(
              rowData.index,
              'time',
              time,
            )
          }
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'component'}
          index={rowData.index}
          onChange={
            _validation.handleTextInputChangeTorquing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'detailsOfJoints'}
          index={rowData.index}
          onChange={
            _validation.handleTextInputChangeTorquing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'nosOfBolt'}
          index={rowData.index}
          onChange={
            _validation.handleTextInputChangeTorquing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'diaOfBoltInMm'}
          index={rowData.index}
          onChange={
            _validation.handleTextInputChangeTorquing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'sizeInMm'}
          index={rowData.index}
          onChange={
            _validation.handleTextInputChangeTorquing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'slNoOfInvoiceMTCFile'}
          index={rowData.index}
          onChange={
            _validation.handleTextInputChangeTorquing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'slNoOfTorqueWrench'}
          index={rowData.index}
          onChange={
            _validation.handleTextInputChangeTorquing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'torqueApplied'}
          index={rowData.index}
          onChange={
            _validation.handleTextInputChangeTorquing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <Text>{rowData.item.refusalsGauage3nos}</Text>
      </View>

      <View style={styles.cell}>
        <Text>{rowData.item.refusalsGauage4nos}</Text>
      </View>

      <View style={styles.cell}>
        <Text>{rowData.item.refusalsGauage5nos}</Text>
      </View>

      <View style={styles.cell}>
        <Text>{rowData.item.refusalsGauage6nos}</Text>
      </View>

      <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => _v.deleteTorquingItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('../../../../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTorquingHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={[styles.cell, {width: 50}]}>
        <Text style={styles.cellText}>Date</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Component</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Details of Joints</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Nos of Bolt</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Dia of Bolt (mm)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Size (mm)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Invoice/MTC File No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Torque Wrench Sl. No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Torque Applied</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Refusals (Gauage 3nos)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Refusals (Gauage 4nos)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Refusals (Gauage 5nos)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Refusals (Gauage 6nos)</Text>
      </View>
      <View style={[styles.cell, {paddingHorizontal: 40}]}>
        <Text style={styles.cellText}>Actions</Text>
      </View>
    </View>
  );

  const renderPrestressingHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Cable No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Stressing Sequence</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge A0 (100 Kg/cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge B0 (100 Kg/cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge A1 (200 Kg/cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge B1 (200 Kg/cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge A2 (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Pressure PA (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge B2 (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Pressure PB (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Slip SA0 (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Slip SB0 (Locking)</Text>
      </View>
    </View>
  );
  const renderItemPrestressing = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{rowData.item['cableNo']}</Text>
      </View>

      <View style={styles.cell}>
        <Text style={styles.cellText}>{rowData.item['stressingSequence']}</Text>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'A0'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'B0'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'A1'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'B1'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'A2'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'PA'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'B2'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'PB'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'SA0'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'SB0'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>
    </View>
  );

  const renderHeadings = () => (
    <View style={TableCommonStyles.tableHeaderContainer}>
      <View style={{width: 50, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>TM No.</Text>
      </View>

      <View style={{width: 100, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Vehicle No.</Text>
      </View>

      <View style={{width: 150, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Time of arrival</Text>
      </View>

      <View style={{width: 130, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Grade of Concrete</Text>
      </View>

      {_v.selectedTask.name === TASK_TYPES.CONCRETING && (
        <View style={{width: 130, ...TableCommonStyles.headerCell}}>
          <Text style={TableCommonStyles.headerText}>Concrete temp in C</Text>
        </View>
      )}

      {_v.selectedTask.name === TASK_TYPES.CONCRETING && (
        <View style={{width: 130, ...TableCommonStyles.headerCell}}>
          <Text style={TableCommonStyles.headerText}>Slump value in mm</Text>
        </View>
      )}

      <View style={{width: 150, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Concrete start time</Text>
      </View>

      <View style={{width: 150, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Concrete poured in cum</Text>
      </View>

      <View style={{width: 150, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Concrete finish time</Text>
      </View>

      <View style={{width: 80, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Actions</Text>
      </View>
    </View>
  );
  const renderHeadingsPQC = () => (
    <View style={TableCommonStyles.tableHeaderContainer}>
      <View style={{width: 50, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Sl. No.</Text>
      </View>
      <View style={{width: 100, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Vehicle No.</Text>
      </View>
      <View style={{width: 150, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>
          Total qty of PQC in cum
        </Text>
      </View>

      <View style={{width: 150, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Laying start time</Text>
      </View>
      <View style={{width: 150, ...TableCommonStyles.headerCell}}>
        <Text style={TableCommonStyles.headerText}>Laying end time</Text>
      </View>
    </View>
  );
  // Function to render each list item
  const handleTimeChange = (index: any, field: any, value: any) => {
    const newData = [..._v.concreteData];
    newData[index][field] = value;
    _v.setConcreteData(newData);
  };
  const handleTimeChangeTemporaryPrestressing = (
    index: any,
    field: any,
    value: any,
  ) => {
    const newData = [..._v.temporaryPrestressingData];
    newData[index][field] = value;
    _v.setTemporaryPrestressingData(newData);
  };
  const handleTimeChangeGlueing = (index: any, field: any, value: any) => {
    const newData = [..._v.glueingData];
    newData[index][field] = value;
    _v.setGlueingData(newData);
  };
  const handleInputChangeFormwork = (field: string, value: string) => {
    _v.setRemovalFormworkData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleTextInputChangePrestressing = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedData = [..._v.prestressingData];
    let isValid = true;
    let errorMessage = '';

    const readingValue = parseFloat(value);

    if (isNaN(readingValue) || readingValue <= 0 || readingValue > 500) {
      isValid = false;
      errorMessage =
        'Enter a valid number greater than 0 and less than or equal to 500';
    } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      isValid = false;
      errorMessage = 'Enter a number with up to 2 decimal places';
    }

    if (!isValid) {
      showSnackbar(errorMessage, 'error');
    }
    updatedData[index][field] = value;
    _v.setPrestressingData(updatedData);
  };

  const handleTextInputChangePQC = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newData = [..._v.concreteData];
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'vehicleNo':
        const vehicleNoRegex = /^\d{4}$/;
        if (!vehicleNoRegex.test(value)) {
          isValid = false;
          errorMessage = 'Enter only the last 4 digits of the vehicle number';
        }
        break;

      case 'totalPqc':
        const totalPqc = parseFloat(value);
        if (
          isNaN(totalPqc) ||
          totalPqc <= 0 ||
          totalPqc > 20 ||
          value.split('.')[1]?.length > 3
        ) {
          isValid = false;
          errorMessage =
            'Enter a value between 0 and 20 with up to 2 decimal places';
        }
        break;
    }

    if (isValid) {
      newData[index][field] = value;
      _v.setPqcData(newData);
    } else {
      newData[index][field] = value;
      _v.setPqcData(newData);
      showSnackbar(errorMessage, 'error');
    }
  };
  const handleTextInputChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newData = [..._v.concreteData];
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'vehicleNo':
        const vehicleNoRegex = /^\d{4}$/;
        if (!vehicleNoRegex.test(value)) {
          isValid = false;
          errorMessage = 'Enter only the last 4 digits of the vehicle number';
        }
        break;

      case 'concreteTemp':
        const tempValue = parseFloat(value);
        if (
          isNaN(tempValue) ||
          tempValue <= 0 ||
          tempValue > 60 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter a temperature between 0 and 60 with up to 2 decimal places';
        }
        break;

      case 'slumpValue':
        const slumpValue = parseInt(value);
        if (
          isNaN(slumpValue) ||
          slumpValue <= 0 ||
          slumpValue > 300 ||
          !Number.isInteger(slumpValue)
        ) {
          isValid = false;
          errorMessage = 'Enter an integer between 1 and 300 for slump value';
        }
        break;

      case 'concretePoured':
        const cubesValue = parseInt(value);
        if (
          isNaN(cubesValue) ||
          cubesValue <= 0 ||
          cubesValue > 100 ||
          !Number.isInteger(cubesValue)
        ) {
          isValid = false;
          errorMessage =
            'Enter an integer between 1 and 100 for number of cubes casted';
        }
        break;
    }

    if (isValid) {
      newData[index][field] = value;
      _v.setConcreteData(newData);
    } else {
      newData[index][field] = value;
      _v.setConcreteData(newData);
      showSnackbar(errorMessage, 'error');
    }
  };

  const renderDumpingHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Tm No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Vehicle No. (Last 4 digits)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Source (Y/N)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Qty Dumped (cum)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Approved Source (Y/N)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Boulders/ Unwanted Materials (Y/N)</Text>
      </View>
      <View style={[styles.cell, {paddingHorizontal: 40}]}>
        <Text style={styles.cellText}>Actions</Text>
      </View>
    </View>
  );

  const renderItemDumping = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text>TM {rowData.index + 1}</Text>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'vehicleNo'}
          index={rowData.index}
          onChange={_v.handleTextInputChangeDumping}
        />
      </View>

      <View style={styles.cell}>
        <DropdownPicker
          label="Source"
          value={rowData.item.source}
          items={YES_NO_LIST}
          onChange={(value: any) =>
            handleDropdownChangeDumping(rowData.index, 'source', value)
          }
          isRequired={true}
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'qtyDumped'}
          index={rowData.index}
          onChange={_v.handleTextInputChangeDumping}
        />
      </View>

      <View style={styles.cell}>
        <DropdownPicker
          label="Approved Source"
          value={rowData.item.approvedSource}
          items={YES_NO_LIST}
          onChange={(value: any) =>
            handleDropdownChangeDumping(rowData.index, 'approvedSource', value)
          }
          isRequired={true}
        />
      </View>

      <View style={styles.cell}>
        <DropdownPicker
          label="Boulders Present"
          value={rowData.item.bouldersPresent}
          items={YES_NO_LIST}
          onChange={(value: any) =>
            handleDropdownChangeDumping(rowData.index, 'bouldersPresent', value)
          }
          isRequired={true}
        />
      </View>

      <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => _v.deleteDumpingItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('../../../../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleDropdownChangeDumping = (
    index: number,
    fieldName: string,
    value: any,
  ) => {
    _v.setDumpingData((prevData: any) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [fieldName]: value,
      };
      return newData;
    });
  };

  const renderItemGlueing = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{rowData.item['jointNumbers']}</Text>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'ambientTemperature'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'batchNoResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'batchNoHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.mixingStartTime}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'mixingStartTime', time)
          }
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.mixingFinishTime}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'mixingFinishTime', time)
          }
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.applicationStartTime}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'applicationStartTime', time)
          }
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.applicationFinishTime}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'applicationFinishTime',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.segmentJoiningTimeClosure}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'segmentJoiningTimeClosure',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.segmentJoiningTimeTemporaryFinish}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'segmentJoiningTimeTemporaryFinish',
              time,
            )
          }
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'segmentSurfaceArea'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionTheoreticalResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionTheoreticalHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionActualResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionActualHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
    </View>
  );

  const handleTextInputChangeGlueing = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedData = [..._v.glueingData];
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'jointNumbers':
        if (value.length > 50) {
          isValid = false;
          errorMessage = 'Joint Numbers cannot exceed 50 characters';
        }
        break;

      case 'ambientTemperature':
        const tempValue = parseFloat(value);
        if (
          isNaN(tempValue) ||
          tempValue <= 0 ||
          tempValue > 100 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter a temperature between 0 and 100 with up to 2 decimal places';
        }
        break;

      case 'batchNoResin':
      case 'batchNoHardener':
        const batchNo = parseInt(value);
        if (
          isNaN(batchNo) ||
          batchNo <= 0 ||
          batchNo > 100 ||
          !Number.isInteger(batchNo)
        ) {
          isValid = false;
          errorMessage =
            'Enter a positive integer between 1 and 100 for batch number';
        }
        break;

      case 'segmentSurfaceArea':
        const surfaceArea = parseFloat(value);
        if (
          isNaN(surfaceArea) ||
          surfaceArea <= 0 ||
          surfaceArea > 1000 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter a surface area up to 1000 SQM with up to 2 decimal places';
        }
        break;

      case 'epoxyConsumptionTheoreticalResin':
      case 'epoxyConsumptionTheoreticalHardener':
      case 'epoxyConsumptionActualResin':
      case 'epoxyConsumptionActualHardener':
        const epoxyConsumption = parseFloat(value);
        if (
          isNaN(epoxyConsumption) ||
          epoxyConsumption <= 0 ||
          epoxyConsumption > 1000 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter epoxy consumption up to 1000 Kgs with up to 2 decimal places';
        }
        break;

      default:
        break;
    }

    if (isValid) {
      updatedData[index][field] = value;
      _v.setGlueingData(updatedData);
    } else {
      updatedData[index][field] = value; // To reflect changes even with an error
      _v.setGlueingData(updatedData);
      showSnackbar(errorMessage, 'error');
    }
  };

  const renderItemPQC = (rowData: any) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10,
      }}>
      <View style={{width: 50, alignItems: 'center'}}>
        <Text style={{fontWeight: '600', fontSize: 13}}>
          {rowData.index + 1}
        </Text>
      </View>
      <View style={{width: 100}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'vehicleNo'}
          index={rowData.index}
          onChange={handleTextInputChangePQC}></CustomTextInputValue>
      </View>
      <View style={{width: 100}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'totalPqc'}
          index={rowData.index}
          onChange={handleTextInputChangePQC}></CustomTextInputValue>
      </View>

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.startTime}
          style={styles.disPlayNone}
          styleCont={styles.marginBootomZero}
          onChange={time => handleTimeChange(rowData.index, 'startTime', time)}
        />
      </View>

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.finishTime}
          style={styles.disPlayNone}
          styleCont={styles.marginBootomZero}
          onChange={time => handleTimeChange(rowData.index, 'finishTime', time)}
        />
      </View>
      <View style={styles.hiddenContainer}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => _v.deleteItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('../../../../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderItem = (rowData: any) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10,
      }}>
      <View style={{width: 50, alignItems: 'center'}}>
        <Text style={{fontWeight: '600', fontSize: 13}}>
          TM {rowData.index + 1}
        </Text>
      </View>
      <View style={{width: 100}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'vehicleNo'}
          index={rowData.index}
          onChange={handleTextInputChange}></CustomTextInputValue>
      </View>
      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.timeOfArrival}
          style={styles.disPlayNone}
          styleCont={styles.marginBootomZero}
          onChange={time =>
            handleTimeChange(rowData.index, 'timeOfArrival', time)
          }
        />
      </View>
      <View style={{width: 130}}>
        <DropdownPicker
          label=""
          value={rowData.item.gradeOfConcrete}
          items={CONCRETE_GRADE_LIST}
          style={styles.marginBootomZero}
          onChange={(newValue: string) => {
            const newData = [..._v.concreteData];
            newData[rowData.index]['gradeOfConcrete'] = newValue;
            _v.setConcreteData(newData);
          }}
          isRequired={true}
        />
      </View>
      {_v.selectedTask.name === TASK_TYPES.CONCRETING && (
        <View style={{width: 130}}>
          <CustomTextInputValue
            rowItem={rowData.item}
            fieldName={'concreteTemp'}
            index={rowData.index}
            styles={styles}
            onChange={handleTextInputChange}></CustomTextInputValue>
        </View>
      )}

      {_v.selectedTask.name === TASK_TYPES.CONCRETING && (
        <View style={{width: 140}}>
          <CustomTextInputValue
            rowItem={rowData.item}
            fieldName={'slumpValue'}
            index={rowData.index}
            styles={styles}
            onChange={handleTextInputChange}></CustomTextInputValue>
        </View>
      )}

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.concreteStartTime}
          style={styles.disPlayNone}
          styleCont={styles.marginBootomZero}
          onChange={time =>
            handleTimeChange(rowData.index, 'concreteStartTime', time)
          }
        />
      </View>

      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'concretePoured'}
          index={rowData.index}
          onChange={handleTextInputChange}></CustomTextInputValue>
      </View>

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.concreteFinishTime}
          style={styles.disPlayNone}
          styleCont={styles.marginBootomZero}
          onChange={time =>
            handleTimeChange(rowData.index, 'concreteFinishTime', time)
          }
        />
      </View>
      <View style={styles.hiddenContainer}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => _v.deleteItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('../../../../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Function to render hidden swipe actions
  const renderHiddenItem = (rowData: any, rowMap: any) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity
        style={[styles.closeButton]}
        onPress={() => _v.closeRow(rowMap, rowData.item.key)}>
        {/* <Text style={styles.buttonText}>Close</Text>  */}
        <Image
          style={styles.CloseIcon}
          source={require('../../../../../images/menu/close-icon.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.deleteButton]}
        onPress={() => _v.deleteItem(rowMap, rowData.item.key)}>
        <Image
          style={[styles.CloseIcon, {tintColor: '#fff'}]}
          source={require('../../../../../images/menu/delete.png')}
        />
        {/* <Text style={styles.buttonText}>Delete</Text>  */}
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = (rowData: any) => {
    return (
      <View>
        <View>
          <Text>TM No.</Text>
        </View>
        <View>
          <Text>Last 4 digits of Vehicle No.</Text>
        </View>
        <View>
          <Text>Time of arrival</Text>
        </View>
        <View>
          <Text>Grade of Concrete</Text>
        </View>
        <View>
          <Text>Concrete temp in C</Text>
        </View>
        <View>
          <Text>Slump value in mm</Text>
        </View>
        <View>
          <Text>No of cubes casted</Text>
        </View>
        <View>
          <Text>Concrete start time</Text>
        </View>
        <View>
          <Text>Concrete poured in cum</Text>
        </View>
        <View>
          <Text>Concrete finish time</Text>
        </View>
      </View>
    );
  };

  const [enableScroll, setEnableScroll] = useState(true);
  const onSwipeValueChange = (data: any) => {
    if (data.value < 0) {
      setEnableScroll(false);
    } else {
      setEnableScroll(true);
    }
  };

  const renderFileData = () => {
    if (_v.imageObject.fileData) {
      return (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + _v.imageObject.fileData}}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image
          source={require('../../../../../images/dummy.png')} // ./assets/dummy.png
          style={styles.images}
        />
      );
    }
  };

  const renderFileUri = () => {
    if (_v.imageObject.fileUri) {
      return (
        <Image source={{uri: _v.imageObject.fileUri}} style={styles.images} />
      );
    } else {
      return (
        <Image
          source={require('../../../../../images/galeryImages.jpg')} // ./assets/galeryImages.jpg
          style={styles.images}
        />
      );
    }
  };

  const openCloseCalendar = () => {
    _v.setOpenCalendar(!_v.openCalendar);
    // if (!openCalendar) {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT + DEFAULT_CALENDAR_HEIGHT)
    // } else {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT)
    // }
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

        _v.setImageObject({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri,
        });
      }
    });
  };

  const launchImageLibrary = () => {
    let options = {
      includeBase64: true,
      maxWidth: 1024,
      maxHeight: 768,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response: any) => {
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

        _v.setImageObject({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri,
        });
      }
    });
  };

  const taskForm = (taskName: any) => {
    switch (taskName) {
      case TASK_TYPES.CONTROL_POINTS:
        return;
      case TASK_TYPES.CNG_AND_SETTING_OUT:
      case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
      case TASK_TYPES.POST_CONCRETE_CHECK:
      case TASK_TYPES.FIXING_OF_BEARING_SLEEVES:
        return (
          <View>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 14,
                paddingBottom: 10,
              }}>
              Pick Image from Camera & Gallery
            </Text>
            <View style={styles.ImageSections}>
              <View>
                {_v.imageObject?.fileData && renderFileData()}
                {/* <Text style={{ textAlign: 'center' }}>Base 64 String</Text> */}
              </View>
              {/* <View>
          {imageObject?.fileUri && renderFileUri()}
          <Text style={{ textAlign: 'center' }}>File Uri</Text>
        </View> */}
            </View>

            <View
              style={[
                styles.btnParentSection,
                {flexDirection: 'row', gap: 20, justifyContent: 'center'},
              ]}>
              <TouchableOpacity
                onPress={launchCamera}
                style={styles.btnSection}>
                <Image
                  style={styles.gallaryIconWidth}
                  source={require('../../../../../images/cameraIcon.png')}
                />
                <Text style={styles.btnText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={launchImageLibrary}
                style={styles.btnSection}>
                <Image
                  style={styles.gallaryIconWidth}
                  source={require('../../../../../images/gallaryIcon.png')}
                />
                <Text style={styles.btnText}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.FORM_WORK:
      case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
      case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Cleanliness and Oil application checked
              </Text>
              <View
                style={[
                  styles.SectionStyle,
                  {zIndex: 16, height: 50, borderColor: '#FF0000'},
                ]}>
                <DropDownPicker
                  open={_v.openCleanliness}
                  value={_v.cleanliness}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  style={styles.selectDropdown}
                  setOpen={_v.setOpenCleanliness}
                  setValue={_v.setCleanliness}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Formwork alignment checked</Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={_v.openFormworkAlignmentChecked}
                  value={_v.formworkAlignmentChecked}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenFormworkAlignmentChecked}
                  setValue={_v.setFormworkAlignmentChecked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Formwork tightness/sealing checked
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 14, height: 50}]}>
                <DropDownPicker
                  open={_v.openFormworkSealingChecked}
                  value={_v.formworkSealingChecked}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenFormworkSealingChecked}
                  setValue={_v.setFormworkSealingChecked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Required covers provided as per drawings checked
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 13, height: 50}]}>
                <DropDownPicker
                  open={_v.openFormworkdDrawingsChecked}
                  value={_v.formworkdDrawingsChecked}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenFormworkdDrawingsChecked}
                  setValue={_v.setFormworkdDrawingsChecked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Concrete finish level marked</Text>
              <View style={[styles.SectionStyle, {zIndex: 12, height: 50}]}>
                <DropDownPicker
                  open={_v.openConcreteFinishLevelMarked}
                  value={_v.concreteFinishLevelMarked}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenConcreteFinishLevelMarked}
                  setValue={_v.setConcreteFinishLevelMarked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Formwork properly supported</Text>
              <View style={[styles.SectionStyle, {zIndex: 11, height: 50}]}>
                <DropDownPicker
                  open={_v.openFormworkProperlySupported}
                  value={_v.formworkProperlySupported}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenFormworkProperlySupported}
                  setValue={_v.setFormworkProperlySupported}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Formwork fit for concreting</Text>
              <View style={[styles.SectionStyle, {zIndex: 10, height: 50}]}>
                <DropDownPicker
                  open={_v.openFormworkFitConcreting}
                  value={_v.formworkFitConcreting}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenFormworkFitConcreting}
                  setValue={_v.setFormworkFitConcreting}
                />
              </View>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.REINFORCEMENT:
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Rebar and dimension (dia,len and shape) checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <DropDownPicker
                  open={_v.openRebarAndDimensionGFC}
                  value={_v.rebarAndDimensionGFC}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenRebarAndDimensionGFC}
                  setValue={_v.setRebarAndDimensionGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Shaping, No and Length of Bars checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={_v.openShapingNoAndLengthOfBarsGFC}
                  value={_v.shapingNoAndLengthOfBarsGFC}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenShapingNoAndLengthOfBarsGFC}
                  setValue={_v.setShapingNoAndLengthOfBarsGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Rebars securely tightened/bound by tie bars
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 14, height: 50}]}>
                <DropDownPicker
                  open={_v.openRebarsSecurelyTightened}
                  value={_v.rebarsSecurelyTightened}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenRebarsSecurelyTightened}
                  setValue={_v.setRebarsSecurelyTightened}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Splice length and location checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 13, height: 50}]}>
                <DropDownPicker
                  open={_v.openSpliceLengthAndLocationGFC}
                  value={_v.spliceLengthAndLocationGFC}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenSpliceLengthAndLocationGFC}
                  setValue={_v.setSpliceLengthAndLocationGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Rebar within tolerance limit</Text>
              <View style={[styles.SectionStyle, {zIndex: 12, height: 50}]}>
                <DropDownPicker
                  open={_v.openRebarWithinToleranceLimit}
                  value={_v.rebarWithinToleranceLimit}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenRebarWithinToleranceLimit}
                  setValue={_v.setRebarWithinToleranceLimit}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Coupler arrangements within tolerance
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 11, height: 50}]}>
                <DropDownPicker
                  open={_v.openCouplerArrangementsWithinTolerance}
                  value={_v.couplerArrangementsWithinTolerance}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenCouplerArrangementsWithinTolerance}
                  setValue={_v.setCouplerArrangementsWithinTolerance}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Bar Bending schedule checked</Text>
              <View style={[styles.SectionStyle, {zIndex: 10, height: 50}]}>
                <DropDownPicker
                  open={_v.openBarBendingScheduleChecked}
                  value={_v.barBendingScheduleChecked}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenBarBendingScheduleChecked}
                  setValue={_v.setBarBendingScheduleChecked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Spacer bar checked as per GFC</Text>
              <View style={[styles.SectionStyle, {zIndex: 9, height: 50}]}>
                <DropDownPicker
                  open={_v.openSpacerBarCheckedGFC}
                  value={_v.spacerBarCheckedGFC}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenSpacerBarCheckedGFC}
                  setValue={_v.setSpacerBarCheckedGFC}
                />
              </View>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Rebar and dimension (dia,len and shape) checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <DropDownPicker
                  open={_v.openRebarAndDimensionGFC}
                  value={_v.rebarAndDimensionGFC}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenRebarAndDimensionGFC}
                  setValue={_v.setRebarAndDimensionGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Shaping, No and Length of Bars checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={_v.openShapingNoAndLengthOfBarsGFC}
                  value={_v.shapingNoAndLengthOfBarsGFC}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenShapingNoAndLengthOfBarsGFC}
                  setValue={_v.setShapingNoAndLengthOfBarsGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Rebars securely tightened/bound by tie bars
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 14, height: 50}]}>
                <DropDownPicker
                  open={_v.openRebarsSecurelyTightened}
                  value={_v.rebarsSecurelyTightened}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenRebarsSecurelyTightened}
                  setValue={_v.setRebarsSecurelyTightened}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Splice length and location checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 13, height: 50}]}>
                <DropDownPicker
                  open={_v.openSpliceLengthAndLocationGFC}
                  value={_v.spliceLengthAndLocationGFC}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenSpliceLengthAndLocationGFC}
                  setValue={_v.setSpliceLengthAndLocationGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Rebar within tolerance limit</Text>
              <View style={[styles.SectionStyle, {zIndex: 12, height: 50}]}>
                <DropDownPicker
                  open={_v.openRebarWithinToleranceLimit}
                  value={_v.rebarWithinToleranceLimit}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenRebarWithinToleranceLimit}
                  setValue={_v.setRebarWithinToleranceLimit}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Coupler arrangements within tolerance
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 11, height: 50}]}>
                <DropDownPicker
                  open={_v.openCouplerArrangementsWithinTolerance}
                  value={_v.couplerArrangementsWithinTolerance}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenCouplerArrangementsWithinTolerance}
                  setValue={_v.setCouplerArrangementsWithinTolerance}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Bar Bending schedule checked</Text>
              <View style={[styles.SectionStyle, {zIndex: 10, height: 50}]}>
                <DropDownPicker
                  open={_v.openBarBendingScheduleChecked}
                  value={_v.barBendingScheduleChecked}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenBarBendingScheduleChecked}
                  setValue={_v.setBarBendingScheduleChecked}
                />
              </View>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.EXCAVATION:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Qty of earth work excavated in cum
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <TextInput
                  style={styles.inputFieldsText}
                  placeholder="Quantity"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={'' + _v.quantity}
                  onChangeText={text => {
                    let exp = text.replace(/[^0-9.]/g, '');
                    if (!isNaN(parseFloat(exp))) {
                      if (exp.split('.').length > 4) {
                        exp = parseFloat(exp).toString();
                      }
                      _v.setQuantity(Number(exp));
                    } else {
                      _v.setQuantity(0);
                    }
                  }}
                />
              </View>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.REMOVAL_OF_SIDE_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_MIDDLIE_TOP_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_INNER_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_SHUTTER:
      case TASK_TYPES.REMOVAL_OF_SHUTTERS:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Whether concrete has achieved desired strength
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <DropDownPicker
                  open={_v.openConcreteHasAchievedDesiredStrength}
                  value={_v.concreteHasAchievedDesiredStrength}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenConcreteHasAchievedDesiredStrength}
                  setValue={_v.setConcreteHasAchievedDesiredStrength}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Whether minimum time has been attained
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={_v.openMinimumTimeHasBeenAttained}
                  value={_v.minimumTimeHasBeenAttained}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenMinimumTimeHasBeenAttained}
                  setValue={_v.setMinimumTimeHasBeenAttained}
                />
              </View>
            </View>
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.COMPACTION:
        const compactionProperties = [
          {
            title: 'Uniform Sprinkling of Water Done if Required',
            key: 'uniformSprinkling',
          },
          {
            title: 'Loose Thickness of Layer Checked',
            key: 'looseThicknessChecked',
          },
          {
            title: 'OMC is Maintained Before Commencement of Rolling',
            key: 'omcMaintained',
          },
          {
            title: 'Suitable Roller Available for Compaction',
            key: 'suitableRollerAvailable',
          },
          {
            title: 'Number of Passes, Speed, and Rolling Pattern Followed',
            key: 'passesSpeedPatternFollowed',
          },
          {
            title: 'Any Localized Wet, Soft, or Under Compacted Area Found',
            key: 'localizedWetSoftAreaFound',
          },
          {
            title: 'Layer is Free from Segregation',
            key: 'layerFreeFromSegregation',
          },
          {
            title: 'Arrangement for Protection of Finished Surface Available',
            key: 'protectionForFinishedSurface',
          },
          {
            title: 'Any Non-conformance/Non-compliance Found',
            key: 'nonConformanceFound',
          },
          {
            title: 'Finished Compacted Layer Thickness as Specified',
            key: 'compactedLayerThicknessSpecified',
          },
        ];

        return (
          <View>
            {compactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.compactionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setCompactionData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Finished Compacted Layer Thickness in mm"
              value={_v.compactionData.compactedLayerThickness}
              onChange={(value: any) =>
                _v.setCompactionData((prevData: any) => ({
                  ...prevData,
                  compactedLayerThickness: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={_v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CONSTRUCTION_OF_CONTROL_ROOM:
      case TASK_TYPES.COMPACTING_GROUND_SUPPORT_FOR_EMBANKMENT:
      case TASK_TYPES.DEWATERING:
      case TASK_TYPES.PLACING_OF_COVER:
      case TASK_TYPES.FIXING_OF_SHEET:
      case TASK_TYPES.GRADING:
      case TASK_TYPES.THREADING_OF_PRE_STRESSING_STRANDS:
        return (
          <View>
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.CAGE_LOWERING:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Plie shaft cleaned of all loose material or not
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <DropDownPicker
                  open={_v.openPlieShaftCleanedLooseMaterial}
                  value={_v.plieShaftCleanedLooseMaterial}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenPlieShaftCleanedLooseMaterial}
                  setValue={_v.setPlieShaftCleanedLooseMaterial}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Suitable spacer provided to maintain the required cover to steel{' '}
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={_v.openSuitableSpacerProvidedToMaintainCoverToSteel}
                  value={_v.suitableSpacerProvidedToMaintainCoverToSteel}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={
                    _v.setOpenSuitableSpacerProvidedToMaintainCoverToSteel
                  }
                  setValue={_v.setSuitableSpacerProvidedToMaintainCoverToSteel}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                No L bend at the bottom of the Cage checked or not{' '}
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={_v.openNoLBendBottomOfTheCageChecked}
                  value={_v.noLBendBottomOfTheCageChecked}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  textStyle={styles.dropDownTextStyle}
                  setOpen={_v.setOpenNoLBendBottomOfTheCageChecked}
                  setValue={_v.setNoLBendBottomOfTheCageChecked}
                />
              </View>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.BORING_OF_PILE:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Input
                label="Density of Polymer in gm/ml"
                value={_v.boringOfPileData.densityOfPolymer}
                onChange={(value: string) =>
                  _v.handleInputChangeBoringOfPile('densityOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Viscosity of Polymer in sec/liter"
                value={_v.boringOfPileData.viscosityOfPolymer}
                onChange={(value: string) =>
                  _v.handleInputChangeBoringOfPile('viscosityOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="pH value of Polymer"
                value={_v.boringOfPileData.valueOfPolymer}
                onChange={(value: string) =>
                  _v.handleInputChangeBoringOfPile('valueOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Sand content of Polymer in %"
                value={_v.boringOfPileData.contentOfPolymer}
                onChange={(value: string) =>
                  _v.handleInputChangeBoringOfPile('contentOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Depth of Bore in m"
                value={_v.boringOfPileData.depthOfBore}
                onChange={(value: string) =>
                  _v.handleInputChangeBoringOfPile('depthOfBore', value)
                }
              />
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.FLUSHING_OPERATIONS:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <TimePicker
                label="Start time of flushing"
                value={_v.flushingOperationsData.startTimeOfFlushing}
                onChange={time =>
                  _v.handleInputChangeFlushingOperations(
                    'startTimeOfFlushing',
                    time,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <TimePicker
                label="Finish time of flushing"
                value={_v.flushingOperationsData.finishTimeOfFlushing}
                onChange={time =>
                  _v.handleInputChangeFlushingOperations(
                    'finishTimeOfFlushing',
                    time,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Whether Pour cleared or not"
                value={_v.flushingOperationsData.whetherPourCleared}
                items={YES_NO_LIST}
                onChange={(newValue: string) => {
                  _v.handleInputChangeFlushingOperations(
                    'whetherPourCleared',
                    newValue,
                  );
                }}
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Density of Polymer in gm/ml"
                value={_v.boringOfPileData.densityOfPolymer}
                onChange={(value: string) =>
                  _v.handleInputChangeFlushingOperations(
                    'densityOfPolymer',
                    value,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Viscosity of Polymer in sec/liter"
                value={_v.boringOfPileData.viscosityOfPolymer}
                onChange={(value: string) =>
                  _v.handleInputChangeFlushingOperations(
                    'viscosityOfPolymer',
                    value,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="pH value of Polymer"
                value={_v.boringOfPileData.valueOfPolymer}
                onChange={(value: string) =>
                  _v.handleInputChangeFlushingOperations(
                    'valueOfPolymer',
                    value,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Sand content of Polymer in %"
                value={_v.boringOfPileData.contentOfPolymer}
                onChange={(value: string) =>
                  _v.handleInputChangeFlushingOperations(
                    'contentOfPolymer',
                    value,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Depth of Bore in m"
                value={_v.boringOfPileData.depthOfBore}
                onChange={(value: string) =>
                  _v.handleInputChangeFlushingOperations('depthOfBore', value)
                }
              />
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.CHIPPING_AND_REMOVAL_OF_CONCRETE_ABOVE_CUT_OFF_LEVEL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Input
                label="No. of days of chipping after casting of concrete"
                value={_v.chippingAndRemovalOfConcreteData.noOfDaysOfChipping}
                onChange={(value: string) =>
                  _v.handleInputChangeChippingAndRemovalOfConcrete(
                    'noOfDaysOfChipping',
                    value,
                  )
                }
              />
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.STITCH_CONCRETE:
        if (!_v.concreteData || !_v.concreteData.length) {
          _v.setConcreteData([
            {
              vehicleNo: '',
              timeOfArrival: '',
              gradeOfConcrete: '',
              concreteTemp: 0,
              slumpValue: 0,
              concretePoured: 0,
              concreteStartTime: '',
              concreteFinishTime: '',
              key: Guid.create(),
            },
          ]);
        }

        return (
          <View>
            <DropdownPicker
              label="Grade of Concrete (Reference approved drawing)"
              value={_v.stitchConcreteData.gradeOfConcrete}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('gradeOfConcrete', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Method statement is approved"
              value={_v.stitchConcreteData.methodStatementApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete(
                  'methodStatementApproved',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="All HT strands for all duct inserted before concreting"
              value={_v.stitchConcreteData.htStrandsInserted}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('htStrandsInserted', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Water, sand, coarse aggregate, cement, admixture approved by IE"
              value={_v.stitchConcreteData.materialsApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('materialsApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Formwork approved by IE"
              value={_v.stitchConcreteData.formworkApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('formworkApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Reinforcement cage approved"
              value={_v.stitchConcreteData.reinforcementCageApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete(
                  'reinforcementCageApproved',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Concreting equipment is in proper working condition"
              value={_v.stitchConcreteData.equipmentWorking}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('equipmentWorking', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Access provided"
              value={_v.stitchConcreteData.accessProvided}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('accessProvided', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Safety arrangements are adequate"
              value={_v.stitchConcreteData.safetyArrangements}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('safetyArrangements', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Heavy rainfall protection available"
              value={_v.stitchConcreteData.rainfallProtection}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('rainfallProtection', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Needle Vibrators status"
              value={_v.stitchConcreteData.needleVibratorStatus}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete(
                  'needleVibratorStatus',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Needles vibrator’s nos and status"
              value={_v.stitchConcreteData.needleVibratorNos}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('needleVibratorNos', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Slump cone apparatus and sufficient Cube moulds available"
              value={_v.stitchConcreteData.slumpConeApparatusAvailable}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete(
                  'slumpConeApparatusAvailable',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Start pre-stressing after getting strength 30 Mpa or 5 days"
              value={_v.stitchConcreteData.startPreStressing}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete('startPreStressing', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Pre-stressing & Grouting format followed as per Spine"
              value={_v.stitchConcreteData.groutingFormatFollowed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeStitchConcrete(
                  'groutingFormatFollowed',
                  value,
                )
              }
              isRequired={true}
            />
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewConcrete"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderHeadings()}
                  <FlatList
                    data={_v.concreteData}
                    renderItem={renderItem}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <TouchableOpacity
                style={{paddingVertical: 15, zIndex: 8}}
                onPress={() => _event.onAddMoreConcrete()}>
                <Text style={styles.AddMoreLink}>+ Add More</Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={_v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.COPING:
      case TASK_TYPES.CONCRETING:
      case TASK_TYPES.PCC_LEVELLING_COURSE:
        if (!_v.concreteData || !_v.concreteData.length) {
          _v.setConcreteData([
            {
              vehicleNo: '',
              timeOfArrival: '',
              gradeOfConcrete: '',
              concreteTemp: 0,
              slumpValue: 0,
              concretePoured: 0,
              concreteStartTime: '',
              concreteFinishTime: '',
              key: Guid.create(),
            },
          ]);
        }

        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewConcrete"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderHeadings()}
                  <FlatList
                    data={_v.concreteData}
                    renderItem={renderItem}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <TouchableOpacity
                style={{paddingVertical: 15, zIndex: 8}}
                onPress={() => _event.onAddMoreConcrete()}>
                <Text style={styles.AddMoreLink}>+ Add More</Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.TORQUING:
        if (!_v.torquingData || !_v.torquingData.length) {
          _v.setTorquingData([
            {
              date: '',
              time: '',
              component: '',
              detailsOfJoints: '',
              nosOfBolt: 0,
              diaOfBoltInMm: 0,
              sizeInMm: 0,
              slNoOfInvoiceMTCFile: '',
              slNoOfTorqueWrench: '',
              torqueApplied: 0,
              refusalsGauage3nos: 'Y',
              refusalsGauage4nos: 'Y',
              refusalsGauage5nos: 'Y',
              refusalsGauage6nos: 'Y',
              key: Guid.create(),
            },
          ]);
        }
        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewTorquing"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderTorquingHeadings()}
                  <FlatList
                    data={_v.torquingData}
                    renderItem={renderItemTorquing}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <TouchableOpacity
                style={{paddingVertical: 15, zIndex: 8}}
                onPress={() => _event.onAddMoreTorquing()}>
                <Text style={styles.AddMoreLink}>+ Add More</Text>
              </TouchableOpacity>
            </View>
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.GLUEING:
        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewGlueing"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderGlueingHeadings()}
                  <FlatList
                    data={_v.glueingData}
                    renderItem={renderItemGlueing}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.DUMPING:
        if (!_v.dumpingData || !_v.dumpingData.length) {
          _v.setDumpingData([
            {
              vehicleNo: '',
              source: 'Y',
              qtyDumped: 0,
              approvedSource: '',
              bouldersPresent: 'Y',
              key: Guid.create(),
            },
          ]);
        }

        return (
          <View>
            <ScrollView horizontal={true}>
              <View>
                {renderDumpingHeadings()}
                <FlatList
                  data={_v.dumpingData}
                  renderItem={renderItemDumping}
                  keyExtractor={item => item.key?.toString()}
                  automaticallyAdjustContentInsets={true}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => _event.onAddMoreDumping()}>
              <Text>+ Add More</Text>
            </TouchableOpacity>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.REMOVAL_OF_FORMWORK:
        return (
          <View style={styles.columnWiseData}>
            <Text style={styles.headerText}>Removal of Formwork</Text>
            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Whether concrete has achieved desired strength"
                value={_v.removalFormworkData.concreteStrengthAchieved}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFormwork('concreteStrengthAchieved', value)
                }
              />
            </View>
            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Whether minimum time has been attained"
                value={_v.removalFormworkData.minimumTimeAttained}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFormwork('minimumTimeAttained', value)
                }
              />
            </View>
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.FABRICATION_OF_BUS_SHELTER:
      case TASK_TYPES.FABRICATION_OF_MEMBERS:
      case TASK_TYPES.FABRICATION_OF_STEEL_GIRDERS:
        return (
          <View style={styles.columnWiseData}>
            <Text style={styles.headerText}>
              Fabrication of Steel Girders/Diaphragms
            </Text>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Is Steel inspection for surface condition (Twist, Straightness etc.)"
                value={_v.fabricationData.steelInspectionSurfaceCondition}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication(
                    'steelInspectionSurfaceCondition',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Is Section checked for dimension and checked as per GFC"
                value={_v.fabricationData.sectionCheckedForDimension}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication(
                    'sectionCheckedForDimension',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Is Material specification and checked as per GFC"
                value={_v.fabricationData.materialSpecificationChecked}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication(
                    'materialSpecificationChecked',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Is connection checked as per GFC"
                value={_v.fabricationData.connectionChecked}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication('connectionChecked', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Are bolt holes clean and to size?"
                value={_v.fabricationData.boltHolesClean}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication('boltHolesClean', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Only approved welders used"
                value={_v.fabricationData.approvedWeldersUsed}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication('approvedWeldersUsed', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Welds identified as per welder ID"
                value={_v.fabricationData.weldsIdentified}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication('weldsIdentified', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Welds inspected for dimension, shape, location, etc."
                value={_v.fabricationData.weldsInspected}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication('weldsInspected', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Welds repaired as required."
                value={_v.fabricationData.weldsRepaired}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication('weldsRepaired', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Shape edge burns, weld spatter removed."
                value={_v.fabricationData.shapeEdgeBurnsRemoved}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication(
                    'shapeEdgeBurnsRemoved',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Oil grease removed prior to final clean."
                value={_v.fabricationData.oilGreaseRemoved}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication('oilGreaseRemoved', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Steel cleaned and painted as per specification."
                value={_v.fabricationData.steelCleanedAndPainted}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication(
                    'steelCleanedAndPainted',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Final shop coat applied as per approve color."
                value={_v.fabricationData.finalShopCoatApplied}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication('finalShopCoatApplied', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Each member marked for erection as per scope"
                value={_v.fabricationData.memberMarkedForErection}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication(
                    'memberMarkedForErection',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Each member approved by inspector prior to shipment."
                value={_v.fabricationData.memberApprovedByInspector}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeFabrication(
                    'memberApprovedByInspector',
                    value,
                  )
                }
              />
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.TEMPORARY_PRESTRESSING:
        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewTemporaryPrestressing"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderTemporaryPrestressingHeadings()}
                  <FlatList
                    data={_v.temporaryPrestressingData}
                    renderItem={renderItemTemporaryPrestressing}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_USING_CRANES:
        const erectionUsingCranesProperties = [
          {
            label: 'Has any risk assessment been carried out',
            key: 'riskAssessmentCarriedOut',
          },
          {
            label: 'Is the crane on firm level bases',
            key: 'craneOnFirmLevelBases',
          },
          {
            label: 'Are all operators trained and competent',
            key: 'allOperatorsTrained',
          },
          {
            label: 'Is crane tested and operated',
            key: 'craneTestedAndOperated',
          },
          {
            label: 'Is there swing alarm installed and functioning',
            key: 'swingAlarmFunctioning',
          },
          {
            label: 'Does the crane have a current test certificate',
            key: 'craneTestCertificate',
          },
          {
            label: 'Boom of crane have a current test certificate',
            key: 'boomTestCertificate',
          },
          {label: 'Oil (leakage)', key: 'oilLeakage'},
          {label: 'Greasing', key: 'greasing'},
          {
            label: 'Outriggers (Fully extended)',
            key: 'outriggersFullyExtended',
          },
          {
            label: 'Level indicators (2 degree to 3 degree)',
            key: 'levelIndicators',
          },
          {
            label: 'Base plate under the outriggers',
            key: 'basePlateUnderOutriggers',
          },
          {label: 'Rigging (2 Nos) angles', key: 'riggingAngles'},
          {
            label:
              'Are all the examination and test carried out and certified by competent person',
            key: 'examinationCertified',
          },
          {
            label:
              'All lifting tools and tackles are being identified, checked and have valid register',
            key: 'liftingToolsChecked',
          },
          {
            label:
              'The person working at height are trained and lash with all fall protection devices',
            key: 'workersWithFallProtection',
          },
          {
            label: 'Workmen provided with all required PPE’s',
            key: 'ppeProvided',
          },
          {
            label:
              'Whether sufficient illumination is provided around the working area',
            key: 'sufficientIllumination',
          },
          {
            label: 'Is the SWL marked on all lifting tools & tackles',
            key: 'swlMarked',
          },
          {
            label:
              'All welding machine, electrical equipment’s & generators properly earthed',
            key: 'equipmentProperlyEarthed',
          },
          {
            label: 'Are the walkway maintained free from obstacle all the time',
            key: 'walkwayObstacleFree',
          },
          {
            label: 'Is safety latch/locking available',
            key: 'safetyLatchAvailable',
          },
          {
            label: 'Proper warning sign available at site',
            key: 'warningSignAvailable',
          },
          {label: 'Lifting arrangements', key: 'liftingArrangements'},
          {label: 'Ground leveling', key: 'groundLeveling'},
          {
            label: 'Is Structure set out to the required line and levels',
            key: 'structureSetOut',
          },
          {
            label:
              'For welding, is welder qualification and skill checked and certified',
            key: 'welderQualificationChecked',
          },
        ];

        return (
          <View>
            {erectionUsingCranesProperties.map(property => (
              <DropdownPicker
                label={property.label}
                value={_v.erectionUsingCranesData[property.key]}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeErectionUsingCranes(property.key, value)
                }
                isRequired={true}
              />
            ))}

            {/* Additional form elements */}
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.STACKING_IN_YARD:
        const stackingInYardProperties = [
          {
            title: 'Area Barricaded with Proper Signages',
            key: 'areaBarricaded',
          },
          {
            title: 'Temporary Lights Available at Night',
            key: 'temporaryLightsAvailable',
          },
          {title: 'Flag Man/Marshal Available', key: 'flagManAvailable'},
          {
            title: 'Methodology & Scheme for Lifting and Stacking Available',
            key: 'methodologyAvailable',
          },
          {
            title: 'De-shackles and Slings with Test Certificate',
            key: 'deShacklesAndSlings',
          },
          {
            title: 'Safety Color Code on De-shackles',
            key: 'safetyColorCode',
          },
          {
            title: 'Hydraulic Jacks in Good Condition',
            key: 'hydraulicJacksCondition',
          },
          {
            title: 'Limit Switch of Lifting Hoist Working',
            key: 'limitSwitchWorking',
          },
          {
            title: 'Cotter Pins in All Lifting Assemblies',
            key: 'cotterPinsInPlace',
          },
          {
            title: 'Macalloy Bars/Pins for Lifting in Proper Condition',
            key: 'macalloyBarsCondition',
          },
          {
            title: 'Work at Height Permit Obtained',
            key: 'workAtHeightPermit',
          },
          {
            title: 'All Macalloy Bars and Wire Rope Assemblies Certified',
            key: 'macalloyBarsCertificate',
          },
          {
            title: 'Lifting Sequence as per Approved Methodology',
            key: 'liftingSequenceProvided',
          },
          {
            title: 'Lifting Holes in Proper Location',
            key: 'liftingHolesLocation',
          },
          {
            title: 'Lifting Arrangements Working Properly',
            key: 'liftingArrangementsWorking',
          },
          {
            title: 'Pre-stressing Duct Clear of Foreign Materials',
            key: 'preStressingDuctClear',
          },
          {
            title: 'Concrete Strength as per Approved Drawing',
            key: 'concreteStrength',
          },
          {
            title: 'Slider Trolley in Proper Position',
            key: 'sliderTrolleyPosition',
          },
          {
            title: 'Methodology for Stacking Approved',
            key: 'methodologyForStackingApproved',
          },
          {
            title: 'Stacking Area Properly Located and Earmarked',
            key: 'stackingAreaLocation',
          },
          {
            title: 'Stacking Area Level and Supported',
            key: 'stackingAreaLevelSupport',
          },
        ];
        return (
          <View>
            {stackingInYardProperties.map(property => (
              <DropdownPicker
                key={property.key}
                label={property.title}
                value={_v.stackingInYardData[property.key]}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeStackingInYard(property.key, value)
                }
                isRequired={true}
              />
            ))}
            <View>
              {/* This should present irrespective of property */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="default"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.ASSEMBLING_OF_TRUSS:
        return (
          <View>
            <DropdownPicker
              label="Parts Accurately Assembled (GFC)"
              value={_v.assemblingOfTrussData.partsAccuratelyAssembled}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAssemblingOfTruss(
                  'partsAccuratelyAssembled',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="No Bent or Broken Parts During Handling"
              value={_v.assemblingOfTrussData.noBentOrBrokenParts}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAssemblingOfTruss(
                  'noBentOrBrokenParts',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Truss Span Laid on Blocks for Proper Camber"
              value={_v.assemblingOfTrussData.trussSpanOnBlocks}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAssemblingOfTruss(
                  'trussSpanOnBlocks',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="All Joint Surfaces Free from Dirt, Burrs"
              value={_v.assemblingOfTrussData.cleanJointSurfaces}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAssemblingOfTruss(
                  'cleanJointSurfaces',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="All Fasteners Have Washer Under Nut or Bolt"
              value={_v.assemblingOfTrussData.fastenersWithWashers}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAssemblingOfTruss(
                  'fastenersWithWashers',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Service Bolts Fully Tightened"
              value={_v.assemblingOfTrussData.serviceBoltsTightened}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAssemblingOfTruss(
                  'serviceBoltsTightened',
                  value,
                )
              }
              isRequired={true}
            />
            <View>
              {/* this should present irrespective of property */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.HACKING_OF_GIRDER:
        return (
          <View>
            <DropdownPicker
              label="Methodology Approved for Hacking by the Contractor"
              value={_v.hackingOfGirderData.methodologyApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeHackingOfGirder(
                  'methodologyApproved',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether the Surface Cleaned and Wet at Which Hacking is to be Done"
              value={_v.hackingOfGirderData.surfaceCleanedAndWet}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeHackingOfGirder(
                  'surfaceCleanedAndWet',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether the Personnel are Skilled"
              value={_v.hackingOfGirderData.skilledPersonnel}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeHackingOfGirder('skilledPersonnel', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether the Instrument Used for Hacking is Sharpened"
              value={_v.hackingOfGirderData.sharpenedInstruments}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeHackingOfGirder(
                  'sharpenedInstruments',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether the 300-400 Recess Cut Formed in Per Square Meter"
              value={_v.hackingOfGirderData.recessCutFormation}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeHackingOfGirder('recessCutFormation', value)
              }
              isRequired={true}
            />

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.DE_STRESSING_OF_GIRDER:
        return (
          <View>
            <DropdownPicker
              label="Girders and Segments Achieved Their Strength"
              value={_v.deStressingOfGirderData.strengthAchieved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeDeStressingOfGirder(
                  'strengthAchieved',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Diamond Bit Saw or Grinder Used to Cut the Strands"
              value={_v.deStressingOfGirderData.diamondBitSawUsed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeDeStressingOfGirder(
                  'diamondBitSawUsed',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Normal Gradual Uniform Transfer of Prestress to Girder"
              value={_v.deStressingOfGirderData.gradualUniformTransfer}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeDeStressingOfGirder(
                  'gradualUniformTransfer',
                  value,
                )
              }
              isRequired={true}
            />

            <View>
              {/* Additional common components */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_BEARING:
        return (
          <View>
            <DropdownPicker
              label="Bearing Placed as Per GFC Drawing"
              value={_v.fixingOfBearingData.bearingPlacedAsPerGFC}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'bearingPlacedAsPerGFC',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Bearing Surface Fully Contact with Girder"
              value={
                _v.fixingOfBearingData.bearingSurfaceFullyContactWithGirder
              }
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'bearingSurfaceFullyContactWithGirder',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Bearing Plates Set Horizontal in Both Directions"
              value={_v.fixingOfBearingData.bearingPlatesSetHorizontal}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'bearingPlatesSetHorizontal',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Bearing Pre-Set with Respect to Axis"
              value={_v.fixingOfBearingData.bearingPreSetWithAxis}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'bearingPreSetWithAxis',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Supports Provided to Hold Bearing in Position"
              value={_v.fixingOfBearingData.supportsProvidedToHoldBearing}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'supportsProvidedToHoldBearing',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Anchor Bolt Holes Matching"
              value={_v.fixingOfBearingData.anchorBoltHolesMatching}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'anchorBoltHolesMatching',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Void Beneath Bearing Filled with Bedding Material"
              value={_v.fixingOfBearingData.voidBeneathBearingFilled}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'voidBeneathBearingFilled',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Bearing Fixed with Metal Bedding Plate"
              value={_v.fixingOfBearingData.bearingFixedWithMetalBedding}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'bearingFixedWithMetalBedding',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Threaded Fastener Tightened Uniformly"
              value={_v.fixingOfBearingData.threadedFastenerTightenedUniformly}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfBearing(
                  'threadedFastenerTightenedUniformly',
                  value,
                )
              }
              isRequired={true}
            />

            {/* Common fields for Date, Time, Recommendations */}
            <View style={{flexDirection: 'column'}}>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
            </View>

            <View>
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
            </View>

            <View style={{flexDirection: 'column', paddingBottom: 20}}>
              <Text style={styles.Lable}>Recommendations</Text>
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.REMOVAL_OF_TEMPORARY_STRUCTURE:
        return (
          <View>
            <DropdownPicker
              label="Whether Concrete Has Achieved Desired Strength"
              value={
                _v.removalOfTemporaryStructureData.concreteAchievedStrength
              }
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeRemovalOfTemporaryStructure(
                  'concreteAchievedStrength',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether Minimum Time Has Been Attained"
              value={_v.removalOfTemporaryStructureData.minimumTimeAttained}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeRemovalOfTemporaryStructure(
                  'minimumTimeAttained',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether All Main Components Tightened and Fixed at Their Position"
              value={_v.removalOfTemporaryStructureData.allComponentsTightened}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeRemovalOfTemporaryStructure(
                  'allComponentsTightened',
                  value,
                )
              }
              isRequired={true}
            />

            <View>
              {/* this should present irrespective of property */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.INSTALLATION_OF_EXPANSION_JOINT:
        return (
          <View>
            <DropdownPicker
              label="Expansion Joint in the Right Position"
              value={
                _v.installationOfExpansionJointData
                  .expansionJointPositionCorrect
              }
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeInstallationOfExpansionJoint(
                  'expansionJointPositionCorrect',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Shipping Devices or Stabilizers Removed"
              value={_v.installationOfExpansionJointData.shippingDevicesRemoved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeInstallationOfExpansionJoint(
                  'shippingDevicesRemoved',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="No Foreign Objects Impending the Expansion Joint"
              value={_v.installationOfExpansionJointData.noForeignObjects}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeInstallationOfExpansionJoint(
                  'noForeignObjects',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Materials Flowing in the Right Direction"
              value={_v.installationOfExpansionJointData.materialsFlowProperly}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeInstallationOfExpansionJoint(
                  'materialsFlowProperly',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Anchors and Supports Match System Drawing"
              value={
                _v.installationOfExpansionJointData.anchorsAndSupportsMatched
              }
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeInstallationOfExpansionJoint(
                  'anchorsAndSupportsMatched',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Joints Properly Aligned"
              value={_v.installationOfExpansionJointData.jointsProperlyAligned}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeInstallationOfExpansionJoint(
                  'jointsProperlyAligned',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="No Damage Sustained During Shipping or Installation"
              value={_v.installationOfExpansionJointData.noDamageSustained}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeInstallationOfExpansionJoint(
                  'noDamageSustained',
                  value,
                )
              }
              isRequired={true}
            />

            <View>
              {/* Common components irrespective of property */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.PAINTING:
        return (
          <View>
            <DropdownPicker
              label="Painting System Including Materials and Color Shades Approved"
              value={_v.paintingData.paintingSystemApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('paintingSystemApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Method Statement, QCP, ITP & Risk Assessment Approved"
              value={_v.paintingData.documentsApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('documentsApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Surface Preparation Done as Per Approved Method Statement"
              value={_v.paintingData.surfacePreparationDone}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('surfacePreparationDone', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Defects in Substrate Corrected"
              value={_v.paintingData.defectsCorrected}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('defectsCorrected', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Moisture Content Checked"
              value={_v.paintingData.moistureContentChecked}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('moistureContentChecked', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Plaster Surfaces Rubbed Down with Rubbing Stone"
              value={_v.paintingData.plasterSurfacesRubbed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('plasterSurfacesRubbed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Material Thoroughly Stirred Prior to Application"
              value={_v.paintingData.materialStirred}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('materialStirred', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Filler Coat Applied Only After Curing Period of Primer"
              value={_v.paintingData.fillerCoatAfterPrimer}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('fillerCoatAfterPrimer', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Suction Spots Covered with Primer Prior to Filler Coat Application"
              value={_v.paintingData.suctionSpotsPrimed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('suctionSpotsPrimed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Filler Coat Applied Evenly and All Angles and Corners are Straight"
              value={_v.paintingData.fillerCoatAppliedEvenly}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('fillerCoatAppliedEvenly', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Sanding Done Between Coats"
              value={_v.paintingData.sandingBetweenCoats}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('sandingBetweenCoats', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Drying Time Allowed as Per Approved Method Statement"
              value={_v.paintingData.dryingTimeAllowed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('dryingTimeAllowed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Materials Mixed Properly"
              value={_v.paintingData.materialsMixedProperly}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('materialsMixedProperly', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="First Coat Applied by Roller Over the Whole Surface"
              value={_v.paintingData.firstCoatAppliedByRoller}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('firstCoatAppliedByRoller', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Roller Joints Checked"
              value={_v.paintingData.rollerJointsChecked}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('rollerJointsChecked', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Curing Period Allowed as Per Approved Method Statement"
              value={_v.paintingData.curingPeriodAllowed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('curingPeriodAllowed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Second Coat Applied After Touch Up on First Coat"
              value={_v.paintingData.secondCoatAfterTouchUp}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('secondCoatAfterTouchUp', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Final Coat Applied"
              value={_v.paintingData.finalCoatApplied}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('finalCoatApplied', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Cleaning and Protection of Adjacent Surfaces"
              value={_v.paintingData.cleaningAndProtection}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangePainting('cleaningAndProtection', value)
              }
              isRequired={true}
            />

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.AUTO_LAUNCHING:
        return (
          <View>
            <DropdownPicker
              label="First Span Lowering on Temporary Steel Stools Completed"
              value={_v.autoLaunchingData.firstSpanLowering}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('firstSpanLowering', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Slider as per Drawing/Methodology"
              value={_v.autoLaunchingData.sliderPerDrawing}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('sliderPerDrawing', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Middle Support Leveling & Alignment Completed"
              value={_v.autoLaunchingData.middleSupportLeveling}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'middleSupportLeveling',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Rear Support Leveling & Alignment Completed"
              value={_v.autoLaunchingData.rearSupportLeveling}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('rearSupportLeveling', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Check for Hydraulic Jacks at Mid & Rear Support (Alignment & Seating)"
              value={_v.autoLaunchingData.checkHydraulicJacks}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('checkHydraulicJacks', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure All Vertical Jacks at Mid Support are Connected to Single Power Pack"
              value={_v.autoLaunchingData.allVerticalJacksMidSupport}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'allVerticalJacksMidSupport',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure All Vertical Jacks at Rear Support are Connected to Single Power Pack"
              value={_v.autoLaunchingData.allVerticalJacksRearSupport}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'allVerticalJacksRearSupport',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Cleanliness and Application of Lubricant on Sliding Surfaces at Mid & Rear Support"
              value={_v.autoLaunchingData.cleanlinessAndApplicationLubricant}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'cleanlinessAndApplicationLubricant',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Physically Checked All Accessories of Launching (Rear Support, Middle Support, Anchoring Bolt)"
              value={_v.autoLaunchingData.physicallyCheckedAllAccessories}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'physicallyCheckedAllAccessories',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Pins Between Jack and Monorail are Properly Fixed & in Good Condition"
              value={_v.autoLaunchingData.jackAndMonorailProperlyFixed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'jackAndMonorailProperlyFixed',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Knuckle Bearing in Position"
              value={_v.autoLaunchingData.knuckleBearing}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('knuckleBearing', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Guide Rollers in Place and Functioning"
              value={_v.autoLaunchingData.guideRollers}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('guideRollers', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Macalloy Bars Stressed - Mid Support & Rear Support"
              value={_v.autoLaunchingData.macalloyBarsStressed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('macalloyBarsStressed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Front Support Telescopic Leg Closed Properly"
              value={_v.autoLaunchingData.frontSupportTelescopic}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'frontSupportTelescopic',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Lock Nuts Arrangement at Mid & Rear Support is Unlocked"
              value={_v.autoLaunchingData.lockNutsArrangement}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('lockNutsArrangement', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Check Pressure on Mid Support and Rear Support Jacks"
              value={_v.autoLaunchingData.pressureOnMidRearSupport}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'pressureOnMidRearSupport',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Gradient of Auto Launching Checked"
              value={_v.autoLaunchingData.gradient}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('gradient', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Check Alignment of Track Rail for Rear Trolley Movement"
              value={_v.autoLaunchingData.alignmentOfTrackRail}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('alignmentOfTrackRail', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Front Support is at Correct Position to Lower Legs as per Methodology Drawing"
              value={_v.autoLaunchingData.frontSupportCorrectPosition}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching(
                  'frontSupportCorrectPosition',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Front Support Pins are Properly Placed and Locked"
              value={_v.autoLaunchingData.frontSupportPins}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('frontSupportPins', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Inserts at Pier Cap are Tightened Properly"
              value={_v.autoLaunchingData.insertsPierCap}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('insertsPierCap', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Front Support is Engaged Properly"
              value={_v.autoLaunchingData.frontSupportEngaged}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('frontSupportEngaged', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Entire Area is Barricaded"
              value={_v.autoLaunchingData.entireAreaBarricaded}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeAutoLaunching('entireAreaBarricaded', value)
              }
              isRequired={true}
            />

            {/* Date, Time, and Comments Fields */}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.PROCUREMENT_OF_STRUCTURAL_STEEL:
        return (
          <View>
            <Input
              label="Total qty of steel procured in tonne"
              value={'' + _v.procurementOfSteelData.totalQtyOfSteelProcured}
              onChange={(value: string) =>
                _v.handleTextInputChangeProcurementOfSteel(
                  'totalQtyOfSteelProcured',
                  value,
                )
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.TRANSPORTATION_OF_MATERIAL:
        <View>
          <Input
            label="Transit Time in hrs"
            value={_v.transportationData.transitTime}
            onChange={(value: string) =>
              _v.handleTextInputChangeTransportation('transitTime', value)
            }
            isRequired={true}
          />
          <View>
            <CalendarPicker
              label="Date"
              value={_v.rfiDate}
              onChange={date => _v.setRFIDate(date)}
            />
            <TimePicker
              label="Time"
              value={'' + _v.rfiTime}
              onChange={time => _v.setRFITime(time)}
            />
            <View style={{flexDirection: 'column', paddingBottom: 20}}>
              <Text style={styles.Lable}>Recommendations</Text>
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => {
                  _v.setComments(text);
                }}
              />
            </View>
          </View>
        </View>;
      case TASK_TYPES.FIXING_OF_SHEATHING_JOINTS:
        return (
          <View>
            <DropdownPicker
              label="All Temporary Openings in Sheathing Satisfactory Plugged"
              value={_v.fixingOfSheathingJointsData.temporaryOpeningsPlugged}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfSheathingJoints(
                  'temporaryOpeningsPlugged',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Has Joint Water Tight"
              value={_v.fixingOfSheathingJointsData.jointWaterTight}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfSheathingJoints(
                  'jointWaterTight',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Sheathing Neatly Fitted at Joint without Internal Projection"
              value={_v.fixingOfSheathingJointsData.sheathingNeatlyFitted}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfSheathingJoints(
                  'sheathingNeatlyFitted',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Sheathing Tightly Fitted on Anchorage End and Sealed with Tape"
              value={_v.fixingOfSheathingJointsData.anchorageEndSealed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfSheathingJoints(
                  'anchorageEndSealed',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Coupler Tightly Screwed on Outer Side of Sheathing Duct"
              value={_v.fixingOfSheathingJointsData.couplerTightlyScrewed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfSheathingJoints(
                  'couplerTightlyScrewed',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Length of Coupler Not Less Than 150mm (Up to 200mm)"
              value={_v.fixingOfSheathingJointsData.couplerLengthSufficient}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfSheathingJoints(
                  'couplerLengthSufficient',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Joint Between Coupler End and Duct Sealed with Tape"
              value={_v.fixingOfSheathingJointsData.jointSealedWithTape}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfSheathingJoints(
                  'jointSealedWithTape',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Coupler of Adjacent Duct Staggered"
              value={_v.fixingOfSheathingJointsData.couplerStaggered}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeFixingOfSheathingJoints(
                  'couplerStaggered',
                  value,
                )
              }
              isRequired={true}
            />

            <View>
              {/* Common Date and Time Picker Section */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_GEO_GRID:
        const fixingOfGeoGridProperties = [
          {
            title: 'Material of Geo Grid Approved by Engineer',
            key: 'materialApprovedByEngineer',
          },
          {
            title: 'Specifications/Strength as per Approved Drawing',
            key: 'specificationsAsPerApprovedDrawing',
          },
          {
            title:
              'Underneath Soil Layer Compacted, Tested (Moisture & Density)',
            key: 'soilProperlyCompacted',
          },
          {
            title: 'Geo Grids Properly Anchored into Facia Panels',
            key: 'geoGridsAnchoredIntoFaciaPanels',
          },
          {
            title: 'Geo Grids Properly Tensioned and Nailed into Soil',
            key: 'geoGridsTensionedAndNailed',
          },
          {
            title: 'Minimum Length of Geo Grid as per Approved Drawing',
            key: 'minimumLengthAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfGeoGridProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfGeoGridData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfGeoGridData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* This section can remain the same for date, time, and recommendations */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_FRICTION_SLAB:
        const erectionOfFrictionSlabProperties = [
          {
            title: 'Friction Slab cum Crash Barrier has Sufficient Strength',
            key: 'sufficientStrength',
          },
          {
            title: 'Friction Slab cum Crash Barrier Not Damaged',
            key: 'notDamaged',
          },
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Vertical Slope as per Drawing',
            key: 'verticalSlopeAsPerDrawing',
          },
          {
            title: 'Soil Compacted & Geo Grids Fixed under Panels',
            key: 'soilCompactedAndGeoGridsFixed',
          },
          {
            title: 'Coping Done',
            key: 'copingDone',
          },
        ];

        return (
          <View>
            {erectionOfFrictionSlabProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionOfFrictionSlabData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionOfFrictionSlabData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_FACIA_PANELS:
        const erectionOfFaciaPanelsProperties = [
          {
            title: 'Facia Panels have Sufficient Strength',
            key: 'sufficientStrength',
          },
          {
            title: 'Facia Panels Not Damaged',
            key: 'notDamaged',
          },
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Male-Female Joints Checked',
            key: 'maleFemaleJointsChecked',
          },
          {
            title: 'Vertical Slope as per Drawing',
            key: 'verticalSlopeAsPerDrawing',
          },
          {
            title: 'Soil Compacted & Geo Grids Fixed under Panels',
            key: 'soilCompactedAndGeoGridsFixed',
          },
        ];

        return (
          <View>
            {erectionOfFaciaPanelsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionOfFaciaPanelsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionOfFaciaPanelsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_COLUMNS:
        const erectionOfColumnsProperties = [
          {
            title: 'Position Checked',
            key: 'positionChecked',
          },
          {
            title: 'Welding Done as per Approved Drawing',
            key: 'weldingAsPerDrawing',
          },
          {
            title: 'Columns are as per Approved Drawing',
            key: 'columnsAsPerDrawing',
          },
          {
            title: 'Necessary Support Provided',
            key: 'supportProvided',
          },
        ];

        return (
          <View>
            {erectionOfColumnsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionOfColumnsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionOfColumnsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.APPLICATION_OF_FILTER_MEDIA:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Filter Media is as per the approved drawing"
                value={_v.applicationOfFilterMediaData.filterMediaAsPerDrawing}
                items={YES_NO_LIST}
                onChange={(value: any) =>
                  _v.setApplicationOfFilterMediaData((prevData: any) => ({
                    ...prevData,
                    filterMediaAsPerDrawing: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            {/* Common Section for Date, Time, and Recommendations */}
            <View style={{flexDirection: 'column'}}>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
            </View>
            <View>
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
            </View>
            <View style={{flexDirection: 'column', paddingBottom: 20}}>
              <Text style={styles.Lable}>Recommendations</Text>
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                autoCapitalize="none"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_BRACINGS:
        const fixingOfBracingsProperties = [
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Welding Done as per Approved Drawing',
            key: 'weldingAsPerApprovedDrawing',
          },
          {
            title: 'Bracings are as per Approved Drawing',
            key: 'bracingsAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfBracingsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfBracingsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfBracingsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_RAILING:
        const fixingOfRailingProperties = [
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Railing is as per Approved Drawing',
            key: 'railingAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfRailingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfRailingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfRailingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.PROCUREMENT_OF_SHEET:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Input
                label="Total Sheet purchased (sqm)"
                value={'' + _v.procurementOfSheetData.totalSheetPurchased}
                onChange={(value: any) =>
                  _v.setProcurementOfSheetData((prevData: any) => ({
                    ...prevData,
                    totalSheetPurchased: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            <View>
              {/* This section can remain the same for date, time, and recommendations */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.DUMPING_OF_SOIL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Soil from Approved Source"
                value={_v.dumpingOfSoilData.soilApprovedSource}
                items={YES_NO_LIST}
                onChange={(value: any) =>
                  _v.setDumpingOfSoilData((prevData: any) => ({
                    ...prevData,
                    soilApprovedSource: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Soil without Unwanted Materials"
                value={_v.dumpingOfSoilData.soilWithoutUnwantedMaterials}
                items={YES_NO_LIST}
                onChange={(value: any) =>
                  _v.setDumpingOfSoilData((prevData: any) => ({
                    ...prevData,
                    soilWithoutUnwantedMaterials: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Quantity of Soil Dumped (cum)"
                value={_v.dumpingOfSoilData.quantityOfSoilDumped}
                onChange={(value: any) =>
                  _v.setDumpingOfSoilData((prevData: any) => ({
                    ...prevData,
                    quantityOfSoilDumped: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            {/* Date and Time */}
            <View style={{flexDirection: 'column'}}>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
            </View>
            <View>
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
            </View>

            {/* Recommendations */}
            <View style={{flexDirection: 'column', paddingBottom: 20}}>
              <Text style={styles.Lable}>Recommendations</Text>
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                autoCapitalize="none"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BORING_OF_DIAPHRAGM:
        return (
          <View>
            <View>
              {/* Density of Polymer */}
              <Input
                label="Density of Polymer (gm/ml)"
                value={'' + _v.boringOfDiaphragmData.densityOfPolymer}
                onChange={(value: string) =>
                  _v.handleBoringOfDiaphragmInputChange(
                    'densityOfPolymer',
                    value,
                  )
                }
                isRequired={true}
              />

              {/* Viscosity of Polymer */}
              <Input
                label="Viscosity of Polymer (sec/liter)"
                value={'' + _v.boringOfDiaphragmData.viscosityOfPolymer}
                onChange={(value: string) =>
                  _v.handleBoringOfDiaphragmInputChange(
                    'viscosityOfPolymer',
                    value,
                  )
                }
                isRequired={true}
              />

              {/* pH Value of Polymer */}
              <Input
                label="pH Value of Polymer"
                value={'' + _v.boringOfDiaphragmData.pHValueOfPolymer}
                onChange={(value: string) =>
                  _v.handleBoringOfDiaphragmInputChange(
                    'pHValueOfPolymer',
                    value,
                  )
                }
                isRequired={true}
              />

              {/* Sand Content of Polymer */}
              <Input
                label="Sand Content of Polymer (%)"
                value={'' + _v.boringOfDiaphragmData.sandContentOfPolymer}
                onChange={(value: string) =>
                  _v.handleBoringOfDiaphragmInputChange(
                    'sandContentOfPolymer',
                    value,
                  )
                }
                isRequired={true}
              />

              {/* Depth of Wall */}
              <Input
                label="Depth of Wall (mtr)"
                value={'' + _v.boringOfDiaphragmData.depthOfWall}
                onChange={(value: string) =>
                  _v.handleBoringOfDiaphragmInputChange('depthOfWall', value)
                }
                isRequired={true}
              />
            </View>
            <View>
              {/* Date, time, and recommendations remain the same */}
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.PRE_STRESSING:
        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewPrestressing"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderPrestressingHeadings()}
                  <FlatList
                    data={_v.prestressingData}
                    renderItem={renderItemPrestressing}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION:
        const erectionProperties = [
          {
            title: 'Ground properly leveled for trailer placement',
            key: 'groundLeveled',
          },
          {
            title: 'Area is barricaded with proper signages',
            key: 'areaBarricaded',
          },
          {
            title: 'Temporary lights for proper illumination at night',
            key: 'temporaryLights',
          },
          {title: 'Flag man/Marshal available', key: 'flagManAvailable'},
          {
            title: 'Methodology & Scheme available at site',
            key: 'methodologyAvailable',
          },
          {
            title: 'Crane positioned as per drawing',
            key: 'cranePositioned',
          },
          {title: 'De-shackles certified', key: 'deShacklesCertified'},
          {
            title: 'Safety color code present on de-shackles',
            key: 'safetyColorCode',
          },
          {
            title: 'Hydraulic jacks calibrated',
            key: 'hydraulicJacksCalibrated',
          },
          {
            title: 'Limit switch of hoist working properly',
            key: 'limitSwitchWorking',
          },
          {
            title: 'Cotter pins placed in lifting assembly',
            key: 'cotterPinPlaced',
          },
          {
            title: 'Macalloy bars in proper condition',
            key: 'macalloyBarsCondition',
          },
          {title: 'TPI of Cranes & Slings done', key: 'tpiDone'},
          {
            title: 'TPI certificates available',
            key: 'tpiCertificatesAvailable',
          },
          {
            title: 'Counter-weights placed as per drawing',
            key: 'counterWeightsPlaced',
          },
          {title: 'Positioning marked at site', key: 'positioningMarked'},
          {
            title: 'Traffic diverted & marshals in place',
            key: 'trafficDiverted',
          },
          {
            title: 'Workers safety certified',
            key: 'workersSafetyCertified',
          },
          {title: 'Safety arrangements at site', key: 'safetyArrangements'},
          {title: 'Positioned at marked location', key: 'sitePositioned'},
          {
            title: 'Lateral support ensured before release',
            key: 'lateralSupportEnsured',
          },
        ];
        return (
          <View>
            {erectionProperties.map(property => (
              <View key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.STRIPPING_AND_STORING_TOP_SOIL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Input
                label="Qty of Top Soil collected and stored (cum)"
                value={
                  '' + _v.strippingAndStoringTopSoilData.topSoilCollectedStored
                }
                onChange={(value: any) =>
                  _v.setStrippingAndStoringTopSoilData((prevData: any) => ({
                    ...prevData,
                    topSoilCollectedStored: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.SPREADING_AND_COMPACTION:
        const spreadingAndCompactionProperties = [
          {
            title: 'Source of material is approved',
            key: 'sourceOfMaterialApproved',
          },
          {
            title: 'Ground improvement is done if required',
            key: 'groundImprovementDone',
          },
          {
            title: 'Under laying layer is approved',
            key: 'underLayingLayerApproved',
          },
          {
            title:
              'Adequate grade and survey stakes available for control of layer placement',
            key: 'gradeSurveyStakesAvailable',
          },
          {
            title:
              'Adequate no. of grader available for spreading and levelling of fill',
            key: 'graderAvailable',
          },
          {
            title: 'Grading is done as per the required gradient and camber',
            key: 'gradingDoneAsPerRequirement',
          },
          {
            title:
              'Uniform sprinkling of water done on previous layer if required',
            key: 'uniformSprinklingDone',
          },
          {
            title: 'Dumping pattern is followed',
            key: 'dumpingPatternFollowed',
          },
          {
            title: 'Material free from deleterious material',
            key: 'materialFreeFromDeleterious',
          },
          {
            title: 'Material contains over size boulders/ stones',
            key: 'containsOverSizeBoulders',
          },
          {
            title: 'Loose thickness of layer checked',
            key: 'looseThicknessChecked',
          },
          {
            title: 'OMC is maintained before commencement of rolling',
            key: 'omcMaintained',
          },
          {
            title: 'Suitable roller available for compaction',
            key: 'suitableRollerAvailable',
          },
          {
            title: 'Number of passes, speed, and rolling pattern followed',
            key: 'rollingPatternFollowed',
          },
          {
            title: 'Finished compacted layer thickness is as specified',
            key: 'finishedLayerThicknessSpecified',
          },
          {
            title: 'Any localized wet, soft, and under compacted area found',
            key: 'localizedIssuesFound',
          },
          {
            title: 'Layer is free from segregation',
            key: 'layerFreeFromSegregation',
          },
          {
            title: 'Arrangement for protection of finished surface available',
            key: 'protectionOfFinishedSurfaceAvailable',
          },
          {
            title: 'Any non-conformance/ noncompliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {spreadingAndCompactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.spreadingAndCompactionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setSpreadingAndCompactionData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total qty spreaded (sqm)"
              value={'' + _v.spreadingAndCompactionData.totalQtySpreaded}
              onChange={(value: any) =>
                _v.setSpreadingAndCompactionData((prevData: any) => ({
                  ...prevData,
                  totalQtySpreaded: value,
                }))
              }
              isRequired={true}
            />

            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PRIME_COAT:
      case TASK_TYPES.TACK_COAT:
        const primeCoatProperties = [
          {
            title: 'Previous Layer Approved',
            key: 'previousLayerApproved',
          },
          {
            title: 'Surface Preparation Satisfactory (Surface Condition)',
            key: 'surfacePreparationSatisfactory',
          },
          {
            title: 'Grade of Material Approved',
            key: 'materialGradeApproved',
          },
          {
            title: 'Bituminous Emulsion Temperature Checked',
            key: 'bituminousEmulsionTemperatureChecked',
          },
          {
            title: 'Uniform Rate of Spray',
            key: 'uniformSprayRate',
          },
          {
            title: 'Non-Conformance/Non-Compliance Found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {primeCoatProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.primeCoatData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPrimeCoatData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Date and Time Pickers */}
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => _v.setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ROAD_MARKING:
        const roadMarkingProperties = [
          {
            title: 'Drawing & Method Statement Approved by Client',
            key: 'drawingAndMethodApproved',
          },
          {
            title: 'Thermoplastic Paint & Glass Bead Approved by Client',
            key: 'thermoplasticAndGlassBeadApproved',
          },
          {
            title: 'Heater Condition and Laying Checked',
            key: 'heaterConditionChecked',
          },
          {
            title: 'Thermometer of Heater Working Properly',
            key: 'thermometerWorking',
          },
          {
            title: 'Thermoplastic Material Heated to Specified Temperature',
            key: 'materialHeatedToSpecifiedTemperature',
          },
          {
            title: 'Surface is Free from Dust, Dirt, Grease, and Oil',
            key: 'surfaceClean',
          },
          {
            title: 'Marking Done Before Laying Thermoplastic',
            key: 'markingDoneBeforeLaying',
          },
          {
            title: 'Glass Beads Applied at Rate of 250gms/sqm',
            key: 'glassBeadsApplied',
          },
          {
            title: 'Thermoplastic Paint Laid in Molten State',
            key: 'paintLaidInMoltenState',
          },
          {
            title: 'Thermoplastic Paint Thickness Checked',
            key: 'paintThicknessChecked',
          },
          {
            title: 'Non-conformance/Non-compliance Found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {roadMarkingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.roadMarkingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setRoadMarkingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* This section for date, time, and recommendations remains the same */}
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_AND_COMPACTION:
        const layingAndCompactionProperties = [
          {
            title: 'All Safety Measures Taken as per Plan',
            key: 'safetyMeasuresTaken',
          },
          {
            title: 'Approved Methodology Available with Paving-in-Charge',
            key: 'approvedMethodologyAvailable',
          },
          {
            title: 'Prime Coat Cured and Cleaned Properly',
            key: 'primeCoatCured',
          },
          {
            title: 'Rate of Spray for Tact Coat Checked & Recorded',
            key: 'sprayRateChecked',
          },
          {
            title: 'Joint Trimmed & Prepared as per Method Statement',
            key: 'jointTrimmedPrepared',
          },
          {
            title: 'Program of Laying Conveyed to Plant and QA/QC',
            key: 'programConveyed',
          },
          {
            title: 'Thermometer Available at Laying Location',
            key: 'thermometerAvailable',
          },
          {
            title: 'Paver Sensors Set as per Requirement',
            key: 'paverSensorsSet',
          },
          {
            title: 'Alignment Marked with Lime Powder',
            key: 'alignmentMarked',
          },
          {
            title: 'Paver Placed & Skeed Cleaned at Laying Area',
            key: 'paverPlacedCleaned',
          },
          {
            title: 'Mix Transported with Tarpaulin Covering',
            key: 'mixTransported',
          },
          {
            title: 'Mix Temperature as per Table 500-2',
            key: 'mixTemperatureFound',
          },
          {
            title: 'Loose Thickness Checked for Required Compactness',
            key: 'looseThicknessChecked',
          },
          {
            title: 'Rolling Pattern Followed as per Trial Patch',
            key: 'rollingPatternFollowed',
          },
          {
            title: 'Surface Level Checked within Tolerance',
            key: 'surfaceLevelChecked',
          },
          {
            title: 'Transverse Joints Prepared as per Method Statement',
            key: 'transverseJointsPrepared',
          },
          {
            title: 'Non-conformance/Non-compliance Found',
            key: 'nonConformanceFound',
          },
        ];
        return (
          <View>
            {layingAndCompactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingAndCompactionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingAndCompactionData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Thickness of Layer Laid in mm"
              value={'' + _v.layingAndCompactionData.layerThickness}
              onChange={(value: any) =>
                _v.setLayingAndCompactionData((prevData: any) => ({
                  ...prevData,
                  layerThickness: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Material Qty Laid in Tonne"
              value={'' + _v.layingAndCompactionData.totalMaterialQtyLaid}
              onChange={(value: any) =>
                _v.setLayingAndCompactionData((prevData: any) => ({
                  ...prevData,
                  totalMaterialQtyLaid: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Material Qty in Sqm"
              value={'' + _v.layingAndCompactionData.totalMaterialQtySqm}
              onChange={(value: any) =>
                _v.setLayingAndCompactionData((prevData: any) => ({
                  ...prevData,
                  totalMaterialQtySqm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PIPE_LAYING_AND_JOINTING:
        const pipeLayingAndJointingProperties = [
          {
            title: 'Ensure all material as per GFC drawing',
            key: 'materialAsPerGFC',
          },
          {
            title: 'Check for availability of the latest GFC drawing',
            key: 'latestGFCAvailable',
          },
          {
            title: 'Location, levels, pipe size as per GFC',
            key: 'locationLevelsPipeSizeAsPerGFC',
          },
          {
            title: 'Check routing of pipe as per drawing',
            key: 'routingCheckedAsPerGFC',
          },
          {
            title: 'Check hanger & support spacing as per drawing',
            key: 'hangerSupportProperSpacing',
          },
          {
            title: 'Fastener & hanger rod as per drawing',
            key: 'fastenerHangerRodAsPerGFC',
          },
          {
            title: 'Joint preparation & fit-up proper',
            key: 'jointPreparationFitUp',
          },
          {
            title: 'Visual inspection of welded joints',
            key: 'visualInspectionOfWeldedJoints',
          },
          {
            title: 'Thread check for pipe joints',
            key: 'threadCheckForJoints',
          },
          {
            title: 'Threaded joints properly tightened',
            key: 'threadedJointsTightened',
          },
          {
            title:
              'Bituminous paint & polythene tape applied to underground GI piping',
            key: 'undergroundGIPipingTreatment',
          },
          {
            title: 'Threaded pipes aligned and straight',
            key: 'threadedPipesAlignedStraight',
          },
          {
            title: 'Installed pipes aligned properly',
            key: 'installedPipesAlignedProperly',
          },
        ];

        return (
          <View>
            {pipeLayingAndJointingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.pipeLayingAndJointingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPipeLayingAndJointingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Pipe Laid in Meters"
              value={'' + _v.pipeLayingAndJointingData.totalPipeLength}
              onChange={(value: any) =>
                _v.setPipeLayingAndJointingData((prevData: any) => ({
                  ...prevData,
                  totalPipeLength: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Number of Pipes Laid"
              value={'' + _v.pipeLayingAndJointingData.totalNumberOfPipes}
              onChange={(value: any) =>
                _v.setPipeLayingAndJointingData((prevData: any) => ({
                  ...prevData,
                  totalNumberOfPipes: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_METAL_BEAM:
        const fixingOfMetalBeamProperties = [
          {
            title:
              'Distance maintained between barrier and start of embankment slope',
            key: 'barrierToEmbankmentDistance',
          },
          {
            title:
              'Distance maintained between barrier and edge of carriageway',
            key: 'barrierToEdgeOfCarriagewayDistance',
          },
          {
            title:
              'At median, W-beam face is 100 mm away from carriageway face of median',
            key: 'medianWBeamFaceDistance',
          },
          {
            title: 'All spacers installed properly as per approved drawing',
            key: 'spacersInstalledProperly',
          },
          {
            title: 'All bolts are fixed and tightened properly',
            key: 'boltsFixedAndTightened',
          },
        ];

        return (
          <View>
            {fixingOfMetalBeamProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={'' + _v.fixingOfMetalBeamData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfMetalBeamData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Metal Beam Fixed in RM"
              value={_v.fixingOfMetalBeamData.totalLengthOfMetalBeamFixed}
              onChange={(value: any) =>
                _v.setFixingOfMetalBeamData((prevData: any) => ({
                  ...prevData,
                  totalLengthOfMetalBeamFixed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_VERTICAL_POST:
        const fixingVerticalPostProperties = [
          {
            title: 'Pits Dugged/Drilled to Depth Indicated on Plan',
            key: 'pitsDuggedToPlan',
          },
          {
            title:
              'Distance Maintained Between Barrier and Start of Embankment Slope',
            key: 'distanceMaintainedBarrierSlope',
          },
          {
            title:
              'Distance Maintained Between Barrier and Edge of Carriageway',
            key: 'distanceMaintainedBarrierCarriageway',
          },
          {
            title:
              'Posts Aligned Properly & Height Above Ground as per Approved Drawing',
            key: 'postsAlignedHeightAsPerDrawing',
          },
          {
            title: 'Steel Posts Placed as per Methodology',
            key: 'steelPostsPlacedMethodology',
          },
          {
            title: 'Total No. of Vertical Post Installed',
            key: 'totalVerticalPostInstalled',
          },
        ];

        return (
          <View>
            {fixingVerticalPostProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingVerticalPostData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingVerticalPostData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Vertical Post Installed"
              value={'' + _v.fixingVerticalPostData.totalVerticalPostInstalled}
              onChange={(value: any) =>
                _v.setFixingVerticalPostData((prevData: any) => ({
                  ...prevData,
                  totalVerticalPostInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CUTTING_OF_JOINTS:
        const cuttingOfJointsProperties = [
          {
            title: 'Is joints cut at desired intervals',
            key: 'jointsCutAtDesiredIntervals',
          },
          {
            title: 'Is joint cut at desired depth',
            key: 'jointsCutAtDesiredDepth',
          },
          {
            title: 'Is joint cut done properly',
            key: 'jointCutDoneProperly',
          },
        ];

        return (
          <View>
            {cuttingOfJointsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.cuttingOfJointsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setCuttingOfJointsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Length Completed in Km"
              value={'' + _v.cuttingOfJointsData.totalLengthCompleted}
              onChange={(value: any) =>
                _v.setCuttingOfJointsData((prevData: any) => ({
                  ...prevData,
                  totalLengthCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_PAVER_BLOCK:
        const layingOfPaverBlockProperties = [
          {
            title:
              'Top 150mm thick sub base layer spread levelled and compacted to 95% MMD?',
            key: 'subBaseCompacted',
          },
          {
            title:
              'Washed sand of appropriate thickness 50 mm as laying course?',
            key: 'sandLayingCourse',
          },
          {
            title: 'Paving Blocks from Approved Source',
            key: 'pavingBlocksApprovedSource',
          },
          {
            title:
              'Paving blocks dimension and finishing as per approved material submitted and shop drawing?',
            key: 'pavingBlocksDimension',
          },
          {
            title:
              'Paving blocks installation/ pattern done as per approved drawing',
            key: 'pavingBlocksInstallation',
          },
          {
            title:
              'Check Whether the plate compactor has been moved on laid paving blocks with dune sand spread over it?',
            key: 'plateCompactorMoved',
          },
          {
            title:
              'Check whether the joints between the paving blocks are as per method statement and joint filler spread on paving blocks and brushed between the blocks',
            key: 'jointsAsPerMethodStatement',
          },
          {
            title:
              'Location, Elevation, Level and Alignment of installed paver block are as per approved drawing and tolerances (+/- 6mm)',
            key: 'locationAlignmentCorrect',
          },
        ];

        return (
          <View>
            {layingOfPaverBlockProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfPaverBlockData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfPaverBlockData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Length of Paver Block Laid (RM)"
              value={'' + _v.layingOfPaverBlockData.totalLengthLaid}
              onChange={(value: any) =>
                _v.setLayingOfPaverBlockData((prevData: any) => ({
                  ...prevData,
                  totalLengthLaid: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total SQM of Paver Blocks Laid"
              value={'' + _v.layingOfPaverBlockData.totalSqmLaid}
              onChange={(value: any) =>
                _v.setLayingOfPaverBlockData((prevData: any) => ({
                  ...prevData,
                  totalSqmLaid: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Thickness of Paver Block Laid (mm)"
              value={'' + _v.layingOfPaverBlockData.thicknessPaverBlock}
              onChange={(value: any) =>
                _v.setLayingOfPaverBlockData((prevData: any) => ({
                  ...prevData,
                  thicknessPaverBlock: value,
                }))
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Grade of Concrete"
              value={_v.layingOfPaverBlockData.gradeOfConcrete}
              items={['M20', 'M25', 'M30', 'M35', 'M40']}
              onChange={(value: any) =>
                _v.setLayingOfPaverBlockData((prevData: any) => ({
                  ...prevData,
                  gradeOfConcrete: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_DLC:
        if (!_v.layingOfDlcTableData || !_v.layingOfDlcTableData.length) {
          _v.setLayingOfDlcTableData([
            {
              vehicleNo: '',
              totalQtyDlc: 0,
              layingStartTime: '',
              layingEndTime: '',
              key: Guid.create(),
            },
          ]);
        }
        const layingOfDLCProperties = [
          {
            title: 'Is the mix design of DLC approved?',
            key: 'mixDesignApproved',
          },
          {
            title: 'Is the under laying GSB layer approved?',
            key: 'gsbLayerApproved',
          },
          {
            title:
              'Are there adequate grade and survey stakes available for control of placement layers?',
            key: 'gradeSurveyStakesAvailable',
          },
          {
            title: 'Is the placing of material appropriate?',
            key: 'placingMaterialAppropriate',
          },
          {
            title: 'Is there paver available for the laying of DLC?',
            key: 'paverAvailable',
          },
          {
            title: 'Is the arrangement of curing available?',
            key: 'curingArrangementAvailable',
          },
          {
            title:
              'Are there adequate number of suitable rollers available for the compaction operation?',
            key: 'suitableRollersAvailable',
          },
          {
            title: 'Is the layer free from any segregation?',
            key: 'layersSegregationFree',
          },
          {
            title:
              'Is there any arrangement for protection of the finished surface?',
            key: 'surfaceProtectionArrangement',
          },
          {
            title: 'Is there adequate arrangement of light for night work?',
            key: 'lightArrangementForNightWork',
          },
          {
            title: 'Is the received batch slip as per approved mix design?',
            key: 'batchSlipAsPerMixDesign',
          },
          {
            title:
              'Whether the worker and staff have proper personal protection equipment (PPE)?',
            key: 'workerPPE',
          },
        ];

        return (
          <View>
            {layingOfDLCProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfDLCData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfDLCData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of DLC Laid in Mtr"
              value={'' + _v.layingOfDLCData.totalLengthDLC}
              onChange={(value: any) =>
                _v.setLayingOfDLCData((prevData: any) => ({
                  ...prevData,
                  totalLengthDLC: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Area of DLC Laid in Sqm"
              value={'' + _v.layingOfDLCData.totalAreaDLC}
              onChange={(value: any) =>
                _v.setLayingOfDLCData((prevData: any) => ({
                  ...prevData,
                  totalAreaDLC: value,
                }))
              }
              isRequired={true}
            />
            <ScrollView horizontal={true}>
              <View>
                {renderLayingOfDlcHeadings()}
                <FlatList
                  data={_v.layingOfDlcTableData}
                  renderItem={renderItemLayingOfDlc}
                  keyExtractor={item => item.key?.toString()}
                  automaticallyAdjustContentInsets={true}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => _v.onAddMoreLayingOfDlc()}>
              <Text>+ Add More</Text>
            </TouchableOpacity>
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.MACHINE_CUTTING_OF_JOINTS:
        const machineCuttingProperties = [
          {
            title: 'Is adequate no. of cutting saws available at site?',
            key: 'cuttingSawsAvailable',
          },
          {
            title:
              'Is adequate no. of diamond-edge saw blades available at site?',
            key: 'diamondSawBladesAvailable',
          },
          {
            title:
              'Is water tank with proper flexible hose and pump available at site?',
            key: 'waterTankAvailable',
          },
          {
            title:
              'Is machine cut started after 4-8 hr of initial setting time?',
            key: 'machineCutStartTimeCorrect',
          },
          {
            title: 'Is cutting done as per approved drawing?',
            key: 'cuttingAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {machineCuttingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.machineCuttingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setMachineCuttingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_TIE_BAR:
        const placingOfTieBarProperties = [
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the placing is done as per drawings',
            key: 'placingDoneAsPerDrawings',
          },
          {
            title: 'Whether the alignment done properly',
            key: 'alignmentDoneProperly',
          },
          {
            title: 'Was a Non-conformance/Non-compliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {placingOfTieBarProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.placingOfTieBarData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlacingOfTieBarData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_WIRE_ROPE:
        const fixingOfWireRopeProperties = [
          {
            title: 'Strands are from Approved Source',
            key: 'strandsFromApprovedSource',
          },
          {
            title: 'End Attachments Cracked/Deformed/Worn',
            key: 'endAttachmentsCondition',
          },
          {
            title: 'Evidence of Heat Damage',
            key: 'heatDamageEvidence',
          },
          {
            title:
              'Kinking, Crushing, Bird Caging, or Other Damage Rectification',
            key: 'ropeDamageRectification',
          },
          {
            title: 'Proper Alignment as per Drawing',
            key: 'alignedProperlyAsPerDrawing',
          },
          {
            title: 'Strand Tensioned Tightly at Ends',
            key: 'strandTensionedAtEnds',
          },
        ];

        return (
          <View>
            {fixingOfWireRopeProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfWireRopeData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfWireRopeData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.TEXTURING:
        const texturingProperties = [
          {
            title: 'Steel Tines/Brush Automatic Sensing & Control Devices',
            key: 'steelTinesBrushAutomatic',
          },
          {
            title: 'Texturing Time Limits for Temperature Conditions',
            key: 'texturingWithinTimeLimits',
          },
          {
            title: 'Tining Unit Pressure Adjusted',
            key: 'tiningUnitPressureAdjusted',
          },
          {
            title: 'Tining Rakers Cleaned Properly',
            key: 'tiningRakersCleaned',
          },
          {title: 'Tines Bent or Damaged', key: 'tinesBentOrDamaged'},
          {
            title: 'Tined Groove Dimensions (3mm Wide, 3-4mm Deep)',
            key: 'tinedGrooveDimensionsCorrect',
          },
          {title: 'Surface Bleeding Done', key: 'surfaceBleedingDone'},
          {
            title: 'Brush Applied in One Direction',
            key: 'brushAppliedOneDirection',
          },
          {
            title: 'Brush for Texturing as per Morth Specification',
            key: 'brushAsPerMorthSpecification',
          },
        ];

        return (
          <View>
            {texturingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.texturingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setTexturingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Texturing Done (sqmtr)"
              value={'' + _v.texturingData.totalTexturingDone}
              onChange={(value: any) =>
                _v.setTexturingData((prevData: any) => ({
                  ...prevData,
                  totalTexturingDone: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_DOWEL:
        const placingOfDowelProperties = [
          {
            title: 'Whether the PQC drawing approved',
            key: 'pqcDrawingApproved',
          },
          {
            title: 'Whether the dowel bars placed at the proper depth',
            key: 'dowelBarsPlacedProperDepth',
          },
          {
            title: 'Whether the bars are aligned properly',
            key: 'barsAlignedProperly',
          },
          {
            title: 'Is the dowel bar covered with plastic sheath',
            key: 'dowelBarCoveredWithPlasticSheath',
          },
          {title: 'Dia of the sheath in mm', key: 'sheathDia'},
          {
            title: 'Is sheath mouth closed properly',
            key: 'sheathMouthClosed',
          },
          {
            title: 'Is the Length of each dowel bar as per approved drawing',
            key: 'dowelBarLengthAsPerDrawing',
          },
          {title: 'Total number of dowel bars', key: 'totalDowelBars'},
        ];

        return (
          <View>
            {placingOfDowelProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.placingOfDowelData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlacingOfDowelData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Dia of Sheath (in mm)"
              value={'' + _v.placingOfDowelData.sheathDia}
              onChange={(value: any) =>
                _v.setPlacingOfDowelData((prevData: any) => ({
                  ...prevData,
                  sheathDia: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total number of dowel bars"
              value={'' + _v.placingOfDowelData.totalDowelBars}
              onChange={(value: any) =>
                _v.setPlacingOfDowelData((prevData: any) => ({
                  ...prevData,
                  totalDowelBars: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_FILLER_BOARD:
        const placingOfFillerBoardProperties = [
          {
            title: 'Is the source of filler board material approved',
            key: 'sourceApproved',
          },
          {
            title:
              'Is the joint surface free from dusts, flakes or other particles',
            key: 'surfaceFreeFromDust',
          },
          {
            title: 'Is filler board cut in proper shape and size',
            key: 'fillerBoardCutProperly',
          },
          {
            title: 'Is placing of filler board done properly',
            key: 'fillerBoardPlacedProperly',
          },
          {
            title: 'Is the filler board compressed to the desired level',
            key: 'fillerBoardCompressed',
          },
        ];

        return (
          <View>
            {placingOfFillerBoardProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.placingOfFillerBoardData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlacingOfFillerBoardData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Thickness of Filler Board in mm"
              value={'' + _v.placingOfFillerBoardData.fillerBoardThickness}
              onChange={(value: any) =>
                _v.setPlacingOfFillerBoardData((prevData: any) => ({
                  ...prevData,
                  fillerBoardThickness: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Filler Board Qty in Sqmm"
              value={'' + _v.placingOfFillerBoardData.totalFillerBoardQty}
              onChange={(value: any) =>
                _v.setPlacingOfFillerBoardData((prevData: any) => ({
                  ...prevData,
                  totalFillerBoardQty: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.SEALANT_FILING:
        const sealantFilingProperties = [
          {
            title: 'Is the sealant source approved',
            key: 'sealantSourceApproved',
          },
          {
            title: 'Is the joint face cleaned properly',
            key: 'jointFaceCleaned',
          },
          {
            title: 'Is the sealant placed at the proper depth',
            key: 'sealantPlacedProperDepth',
          },
          {title: 'Is the two-coat primer done', key: 'twoCoatPrimerDone'},
          {
            title: 'Is the tapping done at the edges of joint face',
            key: 'tappingDoneEdges',
          },
          {
            title: 'Is the sealant poured properly',
            key: 'sealantPouredProperly',
          },
          {
            title: 'Is the tape removed after tooling of sealant',
            key: 'tapeRemovedAfterTooling',
          },
          {
            title: 'Is the arrangement made for curing',
            key: 'arrangementForCuring',
          },
        ];

        return (
          <View>
            {sealantFilingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.sealantFilingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setSealantFilingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Quantity of Sealant Utilized (in liters)"
              value={'' + _v.sealantFilingData.sealantQtyUtilized}
              onChange={(value: any) =>
                _v.setSealantFilingData((prevData: any) => ({
                  ...prevData,
                  sealantQtyUtilized: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.MILLING_OF_FLEXIBLE_PAVEMENT:
        const millingProperties = [
          {
            title: 'Is the milled surface uniform in texture?',
            key: 'milledSurfaceUniform',
          },
          {
            title:
              'Is the finished milled surface within 6-8 mm in both longitudinal and transverse directions?',
            key: 'finishedSurfaceWithinTolerance',
          },
          {
            title: 'Is the texture surface safe for motorists?',
            key: 'textureSafeForMotorist',
          },
          {
            title: 'Depth of Milling in mm',
            key: 'depthOfMilling',
          },
          {
            title: 'Total Quantity of Milled Material (cm)',
            key: 'totalQtyMilledMaterial',
          },
          {
            title: 'Total Surface Area Milled (Sqmm)',
            key: 'totalSurfaceAreaMilled',
          },
        ];

        return (
          <View>
            {millingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.millingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setMillingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Depth of Milling (mm)"
              value={'' + _v.millingData.depthOfMilling}
              onChange={(value: any) =>
                _v.setMillingData((prevData: any) => ({
                  ...prevData,
                  depthOfMilling: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Quantity of Milled Material (cm)"
              value={'' + _v.millingData.totalQtyMilledMaterial}
              onChange={(value: any) =>
                _v.setMillingData((prevData: any) => ({
                  ...prevData,
                  totalQtyMilledMaterial: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Surface Area Milled (Sqmm)"
              value={'' + _v.millingData.totalSurfaceAreaMilled}
              onChange={(value: any) =>
                _v.setMillingData((prevData: any) => ({
                  ...prevData,
                  totalSurfaceAreaMilled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_SEPARATION_MEMBRANE:
        const layingOfSeparationMembraneProperties = [
          {
            title:
              'The subbase / DLC layer swept clean of extraneous materials using air compressor and sprinkled with water to bring down the temperature of the PQC',
            key: 'subbaseSweptClean',
          },
          {
            title:
              'If any undulations visible after cleaning & sprinkling of water, it should be leveled with Mix of 10mm down aggregate to avoid restraint of Panel movement',
            key: 'undulationsLeveled',
          },
          {
            title:
              'Separation membrane shall be tight, straight, wrinkle free & anchored on Sub-base',
            key: 'membraneTightStraight',
          },
          {title: 'Colour of Separation Membrane', key: 'colourOfMembrane'},
          {
            title: 'Thickness of Separation Membrane',
            key: 'thicknessOfMembrane',
          },
          {
            title:
              'Proper overlapping provided in case of membrane is laid in part width',
            key: 'properOverlappingProvided',
          },
          {
            title: 'Finished Compacted Layer Thickness in mm',
            key: 'finishedCompactedLayerThickness',
          },
          {
            title: 'Any non-conformance/non-compliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {layingOfSeparationMembraneProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfSeparationMembraneData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfSeparationMembraneData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Finished Compacted Layer Thickness in mm"
              value={
                '' +
                _v.layingOfSeparationMembraneData
                  .finishedCompactedLayerThickness
              }
              onChange={(value: any) =>
                _v.setLayingOfSeparationMembraneData((prevData: any) => ({
                  ...prevData,
                  finishedCompactedLayerThickness: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_PAVEMENT_QUALITY_CONCRETE:
        if (!_v.pqcData || !_v.pqcData.length) {
          _v.setPqcData([
            {
              vehicleNo: '',
              totalPqc: '',
              startTime: '',
              finishTime: '',
              key: Guid.create(),
            },
          ]);
        }
        const layingOfPQCProperties = [
          {
            title:
              'Is the trail patch done and approved by the Engineer In Charge',
            key: 'trailPatchApproved',
          },
          {
            title: 'Is the mix design of PQC approved?',
            key: 'mixDesignApproved',
          },
          {
            title: 'Is the under laying DLC layer approved?',
            key: 'dlcLayerApproved',
          },
          {
            title:
              'Are there adequate grade and survey stakes available for control of placement layers?',
            key: 'adequateGradeSurveyStakes',
          },
          {
            title:
              'The PQC material is being transported by covering the tippers with tarpaulin to protect from the weather',
            key: 'pqcTransportedWithTarpaulin',
          },
          {
            title: 'Is the sufficient no. of labours available at laying site',
            key: 'sufficientLaboursAvailable',
          },
          {
            title:
              'Separation membrane shall be tight, straight, wrinkle free & anchored on Sub Base',
            key: 'separationMembraneTight',
          },
          {
            title: 'Dowel bars in the joints covered by thin plastic sheath',
            key: 'dowelBarsCoveredWithSheath',
          },
          {
            title:
              'Backhoe bucket of JCB available to protect damaging of separation membrane',
            key: 'backhoeBucketAvailable',
          },
          {
            title: 'Is paver available for the laying of DLC?',
            key: 'paverAvailableForDLC',
          },
          {
            title: 'Is the functioning of Paver checked?',
            key: 'paverFunctioningChecked',
          },
          {
            title: 'Is the placing of material appropriate?',
            key: 'materialPlacedAppropriately',
          },
          {
            title: 'Is the arrangement of curing available?',
            key: 'curingArrangementAvailable',
          },
          {
            title: 'Is the layers free from any segregation?',
            key: 'layersSegregationFree',
          },
          {
            title:
              'Is there any arrangement for protection of the finished surface?',
            key: 'surfaceProtectionArranged',
          },
          {
            title: 'Is there adequate arrangement of light for night work?',
            key: 'lightArrangementForNightWork',
          },
          {
            title: 'Whether the worker and staff have proper PPE?',
            key: 'ppeAvailable',
          },
        ];

        return (
          <View>
            {layingOfPQCProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfPQCData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfPQCData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Lead of PQC Material (in Km)"
              value={'' + _v.layingOfPQCData.pqcLeadDistance}
              onChange={(value: any) =>
                _v.setLayingOfPQCData((prevData: any) => ({
                  ...prevData,
                  pqcLeadDistance: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of PQC Laid (in meters)"
              value={'' + _v.layingOfPQCData.totalPQCLaidLength}
              onChange={(value: any) =>
                _v.setLayingOfPQCData((prevData: any) => ({
                  ...prevData,
                  totalPQCLaidLength: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Area of PQC Laid (in sqm)"
              value={'' + _v.layingOfPQCData.totalPQCLaidArea}
              onChange={(value: any) =>
                _v.setLayingOfPQCData((prevData: any) => ({
                  ...prevData,
                  totalPQCLaidArea: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Thickness of PQC Laid (in mm)"
              value={'' + _v.layingOfPQCData.pqcThicknessLaid}
              onChange={(value: any) =>
                _v.setLayingOfPQCData((prevData: any) => ({
                  ...prevData,
                  pqcThicknessLaid: value,
                }))
              }
              isRequired={true}
            />
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewConcrete"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderHeadingsPQC()}
                  <FlatList
                    data={_v.concreteData}
                    renderItem={renderItemPQC}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>
            <View>
              <TouchableOpacity
                style={{paddingVertical: 15, zIndex: 8}}
                onPress={() => _event.onAddMorePQC()}>
                <Text style={styles.AddMoreLink}>+ Add More</Text>
              </TouchableOpacity>
            </View>
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BACKFILLING:
        const backfillingProperties = [
          {
            title: 'Verify area is clear of debris and formwork materials',
            key: 'areaClearOfDebris',
          },
          {
            title:
              'Ensure backfilling starts after 7 days or 60% strength of concrete',
            key: 'backfillingTimingAppropriate',
          },
          {
            title:
              'Confirm fill materials are approved and comply with specifications',
            key: 'approvedFillMaterials',
          },
          {
            title: 'Check layer thickness does not exceed 200mm',
            key: 'layerThicknessCheck',
          },
          {
            title: 'Check compaction degree (95% according to Proctor test)',
            key: 'compactionDegreeCheck',
          },
          {
            title: 'Check required tests for each 200mm compacted layer',
            key: 'layerTestsDone',
          },
          {
            title: 'Verify level and elevation are correct',
            key: 'levelAndElevationVerified',
          },
          {
            title:
              'Ensure bedding material is compacted in trenches for services',
            key: 'beddingMaterialCompacted',
          },
          {
            title: 'Ensure waterproofing membrane, if any, is undamaged',
            key: 'waterproofingMembraneProtected',
          },
          {
            title: 'Ensure backfilling is complete and area is clean and tidy',
            key: 'backfillingCompleteAndClean',
          },
        ];

        return (
          <View>
            {backfillingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.backfillingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setBackfillingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Quantity of Soil Used in cum"
              value={'' + _v.backfillingData.totalSoilQtyUsed}
              onChange={(value: any) =>
                _v.setBackfillingData((prevData: any) => ({
                  ...prevData,
                  totalSoilQtyUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BRICKS_WORK:
        const bricksWorkProperties = [
          {
            title: 'Are the latest "Good for Construction" drawings available',
            key: 'drawingsAvailable',
          },
          {
            title: 'Are the size and Class of bricks as per approved drawing',
            key: 'bricksSizeClassAsPerDrawing',
          },
          {
            title: 'Are the required number of blocks available',
            key: 'requiredBlocksAvailable',
          },
          {
            title:
              'Has the hacking at contact surfaces of columns and beams been done',
            key: 'hackingDone',
          },
          {
            title:
              'Has cement mortar slurry been applied over the hacked surface',
            key: 'cementMortarApplied',
          },
          {
            title:
              'Have aluminium templates been used for door/window openings',
            key: 'aluminiumTemplatesUsed',
          },
          {
            title: 'Are the required tools available',
            key: 'requiredToolsAvailable',
          },
          {
            title: 'Are there any specific requirements from the client',
            key: 'clientSpecificRequirements',
          },
          {
            title: 'Is Cement of the approved grade and less than 1 month old',
            key: 'cementApprovedGrade',
          },
          {
            title: 'Is sand medium gritty, clean, and silt-free',
            key: 'sandCleanGritty',
          },
          {
            title:
              'Is the finished floor level button marked on the structural slab',
            key: 'floorLevelMarked',
          },
          {
            title: 'Are the markings for reference lines on the pillar done',
            key: 'pillarMarkingsDone',
          },
          {
            title:
              'Is the brickwork checked in vertical and horizontal directions',
            key: 'brickworkChecked',
          },
        ];

        return (
          <View>
            {bricksWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.bricksWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setBricksWorkData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Area where Brick Work is to be done in Sqm"
              value={'' + _v.bricksWorkData.totalBrickWorkArea}
              onChange={(value: any) =>
                _v.setBricksWorkData((prevData: any) => ({
                  ...prevData,
                  totalBrickWorkArea: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Brick Work in Cum"
              value={'' + _v.bricksWorkData.totalBrickWorkCum}
              onChange={(value: any) =>
                _v.setBricksWorkData((prevData: any) => ({
                  ...prevData,
                  totalBrickWorkCum: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CUTTING_OF_SOIL:
        const cuttingOfSoilProperties = [
          {
            title:
              'Whether the proper safety measure taken at the site for cutting of soil?',
            key: 'safetyMeasuresTaken',
          },
          {
            title:
              'Whether all the equipment and tools are available at site at time of cutting of soil?',
            key: 'equipmentAvailable',
          },
          {
            title: 'Whether the excavation done at required depth?',
            key: 'excavationDone',
          },
        ];

        return (
          <View>
            {cuttingOfSoilProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.cuttingOfSoilData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setCuttingOfSoilData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of soil cut in cum"
              value={'' + _v.cuttingOfSoilData.totalSoilCutQty}
              onChange={(value: any) =>
                _v.setCuttingOfSoilData((prevData: any) => ({
                  ...prevData,
                  totalSoilCutQty: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_GEO_CELL:
        const fixingGeoCellProperties = [
          {title: 'Whether the source is approved', key: 'sourceApproved'},
          {
            title: 'Whether the method statement is approved',
            key: 'methodStatementApproved',
          },
          {
            title: 'Whether the slope is properly maintained',
            key: 'slopeMaintained',
          },
          {
            title: 'Whether the slope is properly compacted',
            key: 'slopeCompacted',
          },
          {
            title: 'Whether the Geo cell is laid as per approved drawing',
            key: 'geoCellLaidAsPerDrawing',
          },
          {
            title: 'Whether joints of geo cell are fixed properly',
            key: 'geoCellJointsFixedProperly',
          },
          {
            title: 'Whether the Geo cell size is as per approved drawing',
            key: 'geoCellSizeAsPerDrawing',
          },
        ];

        return (
          <View>
            {fixingGeoCellProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingGeoCellData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingGeoCellData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Area where Geo cell placed (Sqm)"
              value={'' + _v.fixingGeoCellData.totalGeoCellArea}
              onChange={(value: any) =>
                _v.setFixingGeoCellData((prevData: any) => ({
                  ...prevData,
                  totalGeoCellArea: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total consumption of Geo cell in Sqm"
              value={'' + _v.fixingGeoCellData.totalGeoCellConsumption}
              onChange={(value: any) =>
                _v.setFixingGeoCellData((prevData: any) => ({
                  ...prevData,
                  totalGeoCellConsumption: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_MESH:
        const fixingOfMeshProperties = [
          {
            title: 'Whether the source of approved',
            key: 'sourceApproved',
          },
          {
            title: 'Whether the size of mesh as per approved drawing',
            key: 'sizeAsPerDrawing',
          },
          {
            title: 'Check for the damage of the wire mesh after the opening',
            key: 'wireMeshDamageChecked',
          },
          {
            title:
              'Whether the unit shall be stretched for removal of fold/bend after opening',
            key: 'unitStretchedForFoldsRemoved',
          },
        ];

        return (
          <View>
            {fixingOfMeshProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfMeshData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfMeshData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Area of the Slope in Sqm"
              value={'' + _v.fixingOfMeshData.totalAreaSlope}
              onChange={(value: any) =>
                _v.setFixingOfMeshData((prevData: any) => ({
                  ...prevData,
                  totalAreaSlope: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Qty of Mesh in kg"
              value={'' + _v.fixingOfMeshData.totalQtyMesh}
              onChange={(value: any) =>
                _v.setFixingOfMeshData((prevData: any) => ({
                  ...prevData,
                  totalQtyMesh: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_GRASS_TURF:
        const layingOfGrassTurfProperties = [
          {
            title: 'Ensure turfs are cut and will be planted within 24 hours',
            key: 'turfsCutPlantedWithin24hrs',
          },
          {
            title: 'Check that the base area is well prepared',
            key: 'baseAreaPrepared',
          },
          {
            title: 'Verify correct topsoil thickness',
            key: 'topsoilThicknessVerified',
          },
          {
            title:
              'Check suitable material to be used for top dressing (no gaps)',
            key: 'suitableTopDressingMaterial',
          },
          {
            title:
              'Check the turfing level; fill any sunken or depressed areas',
            key: 'turfingLevelChecked',
          },
          {
            title: 'Ensure water is sprayed upon completion of turfing work',
            key: 'waterSprayedCompletion',
          },
          {
            title:
              'Check that wood nailing is used to hold the turves in position',
            key: 'woodNailingUsed',
          },
          {
            title: 'Check the turfing arrangement and nailing pattern',
            key: 'turfingArrangementChecked',
          },
          {
            title: 'Check that the overall turfing work is visually acceptable',
            key: 'overallTurfingWorkAccepted',
          },
          {
            title: 'Ensure no vehicles enter or trespass the turfed area',
            key: 'noVehiclesTrespass',
          },
          {
            title:
              'Ensure hydroseeding is carried out properly with the correct method',
            key: 'hydroseedingMethodVerified',
          },
          {
            title: 'Fibromat installation properly done and secured',
            key: 'fibromatInstalled',
          },
        ];

        return (
          <View>
            {layingOfGrassTurfProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfGrassTurfData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfGrassTurfData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Area Covered with Grass (sqm)"
              value={'' + _v.layingOfGrassTurfData.totalAreaCovered}
              onChange={(value: any) =>
                _v.setLayingOfGrassTurfData((prevData: any) => ({
                  ...prevData,
                  totalAreaCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_TOP_SOIL:
        const layingOfTopSoilProperties = [
          {
            title: 'Whether the soil is from approved source',
            key: 'approvedSource',
          },
          {
            title: 'Proper arrangement for vehicle movement',
            key: 'vehicleMovementArrangement',
          },
          {
            title: 'Proper machinery and equipment available',
            key: 'machineryAvailable',
          },
          {
            title: 'Marking done for the level of laying',
            key: 'markingDone',
          },
        ];

        return (
          <View>
            {layingOfTopSoilProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfTopSoilData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfTopSoilData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Area where Laying is Done (Sqm)"
              value={'' + _v.layingOfTopSoilData.totalAreaLaying}
              onChange={(value: any) =>
                _v.setLayingOfTopSoilData((prevData: any) => ({
                  ...prevData,
                  totalAreaLaying: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Quantity of Soil (cum)"
              value={'' + _v.layingOfTopSoilData.totalQtyOfSoil}
              onChange={(value: any) =>
                _v.setLayingOfTopSoilData((prevData: any) => ({
                  ...prevData,
                  totalQtyOfSoil: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_AND_JOINTING_CHUTE_MEMBERS:
        const chuteMembersProperties = [
          {
            title: 'Whether the bottom soil layer compacted properly',
            key: 'bottomSoilCompacted',
          },
          {
            title: 'Whether the slope properly maintained',
            key: 'slopeMaintained',
          },
          {
            title: 'Whether chute lining done properly',
            key: 'chuteLiningDone',
          },
          {
            title: 'Whether the support for chute shuttering done properly',
            key: 'supportForShutteringDone',
          },
          {
            title: 'Whether the joint done in line and level',
            key: 'jointInLineAndLevel',
          },
          {
            title: 'Whether the concrete placing arrangement done',
            key: 'concretePlacingArrangement',
          },
        ];

        return (
          <View>
            {chuteMembersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.chuteMembersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setChuteMembersData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Chute in mtr"
              value={'' + _v.chuteMembersData.totalChuteLength}
              onChange={(value: any) =>
                _v.setChuteMembersData((prevData: any) => ({
                  ...prevData,
                  totalChuteLength: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PIT_EXCAVATION:
        const pitExcavationProperties = [
          {
            title:
              'Are there any underground utilities like sewers, water pipelines, cables',
            key: 'undergroundUtilities',
          },
          {
            title:
              'Check whether the excavated pits are adequately shored/ timbered',
            key: 'pitsShoredTimbered',
          },
          {
            title: 'Are the excavated areas provided with fences/ barricades',
            key: 'fencesBarricadesProvided',
          },
          {
            title:
              'Are the excavated material kept from the edge of the pit/ trench by at least 1m',
            key: 'excavatedMaterialKeptAway',
          },
          {
            title:
              'Are the heavy equipment such as cranes, shovels, back toe loaders etc. kept away at least 6m from the edge of excavated pit',
            key: 'heavyEquipmentKeptAway',
          },
          {
            title: 'Are danger signs provided near the excavated area',
            key: 'dangerSignsProvided',
          },
          {
            title: 'Means of access and exit from the work area provided',
            key: 'accessExitProvided',
          },
          {
            title: 'Check Set out',
            key: 'setOutChecked',
          },
          {
            title: 'Check Excavation Size with Tolerance (offset)',
            key: 'excavationSizeChecked',
          },
          {
            title: 'Check for Loose materials / Loose soil',
            key: 'looseMaterialsChecked',
          },
          {
            title:
              'Check bottom of excavation (indicate proposed GL/Basement level with respect to existing road level)',
            key: 'bottomOfExcavationChecked',
          },
        ];

        return (
          <View>
            {pitExcavationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.pitExcavationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPitExcavationData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLANTING_GRASS:
        const plantingGrassProperties = [
          {
            title: 'Is grass seeding handled gently',
            key: 'grassSeedingHandledGently',
          },
          {
            title: 'Is grass seeding done after handling',
            key: 'grassSeedingDoneAfterHandling',
          },
          {
            title: 'Is the grass seeding protected from the sun and wind',
            key: 'grassSeedingProtectedFromSunWind',
          },
          {
            title: 'The grass seed kept moist',
            key: 'grassSeedKeptMoist',
          },
          {
            title: 'Is grass transport during cooler period',
            key: 'grassTransportDuringCoolerPeriod',
          },
          {
            title: 'Is seeding done as per approved drawing?',
            key: 'seedingDoneAsPerApprovedDrawing',
          },
          {
            title: 'Is the seeding watered properly for the growth',
            key: 'seedingWateredProperly',
          },
          {
            title: 'Control weeds near plantation',
            key: 'controlWeedsNearPlantation',
          },
        ];

        return (
          <View>
            {plantingGrassProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.plantingGrassData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlantingGrassData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Area Covered with Grass (sqm)"
              value={'' + _v.plantingGrassData.totalAreaCoveredWithGrass}
              onChange={(value: any) =>
                _v.setPlantingGrassData((prevData: any) => ({
                  ...prevData,
                  totalAreaCoveredWithGrass: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLANTING_TREES:
        const plantingTreesProperties = [
          {title: 'Is Plant Handle Gently?', key: 'handleGently'},
          {title: 'Is the Plant Root Kept in Moist?', key: 'rootKeptMoist'},
          {
            title: 'Is Planting Done as per Approved Drawing?',
            key: 'plantingDoneAsPerDrawing',
          },
          {
            title: 'Is the Watering Done Properly for Growth?',
            key: 'wateringDoneProperly',
          },
          {
            title: 'Control Weeds Near Plantation?',
            key: 'controlWeedsNearPlantation',
          },
          {title: 'Is Proper Barricading Done?', key: 'barricadingDone'},
          {
            title: 'Is the Height of the Plant as per Drawings?',
            key: 'heightAsPerDrawings',
          },
          {
            title: 'Is the Type of Plant as per Approved Drawings?',
            key: 'typeOfPlantAsPerDrawing',
          },
        ];
        return (
          <View>
            {plantingTreesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.plantingTreesData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlantingTreesData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Trees Planted"
              value={'' + _v.plantingTreesData.totalNoOfTreesPlanted}
              onChange={(value: any) =>
                _v.setPlantingTreesData((prevData: any) => ({
                  ...prevData,
                  totalNoOfTreesPlanted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PREPARATION_OF_SOIL:
        const preparationOfSoilProperties = [
          {
            title: 'Is the soil dumped in a 200mm layer?',
            key: 'soilDumpedInLayer',
          },
          {
            title:
              'Is the soil spread in the proper length as mentioned in drawing?',
            key: 'soilSpreadProperLength',
          },
          {
            title: 'Is the soil compacted properly?',
            key: 'soilCompactedProperly',
          },
        ];

        return (
          <View>
            {preparationOfSoilProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.preparationOfSoilData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPreparationOfSoilData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of soil prepared in cum"
              value={'' + _v.preparationOfSoilData.totalQtySoil}
              onChange={(value: any) =>
                _v.setPreparationOfSoilData((prevData: any) => ({
                  ...prevData,
                  totalQtySoil: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total surface area of soil laid in sqm"
              value={'' + _v.preparationOfSoilData.totalSurfaceArea}
              onChange={(value: any) =>
                _v.setPreparationOfSoilData((prevData: any) => ({
                  ...prevData,
                  totalSurfaceArea: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.SPREADING_OF_GRASS_SEEDS:
        const spreadingOfGrassSeedsProperties = [
          {
            title: 'Is the seed from an approved source?',
            key: 'seedApprovedSource',
          },
          {
            title: 'Is the surface free from garbage and plastic material?',
            key: 'surfaceFreeFromGarbage',
          },
          {
            title: 'Is the surface well prepared?',
            key: 'surfaceWellPrepared',
          },
        ];

        return (
          <View>
            {spreadingOfGrassSeedsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.spreadingOfGrassSeedsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setSpreadingOfGrassSeedsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.WATERING:
        const wateringProperties = [
          {title: 'Whether the water is clean?', key: 'waterClean'},
          {
            title: 'Whether the watering is done three times a day?',
            key: 'wateringThreeTimesADay',
          },
        ];

        return (
          <View>
            {wateringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.wateringData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setWateringData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Quantity of Water Used (in Litres)"
              value={'' + _v.wateringData.totalQtyWaterUsed}
              onChange={(value: any) =>
                _v.setWateringData((prevData: any) => ({
                  ...prevData,
                  totalQtyWaterUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLANTATION:
        const plantationProperties = [
          {title: 'Is seeding handled gently', key: 'seedingHandledGently'},
          {
            title: 'Is plant seeding done after handling',
            key: 'seedingDoneAfterHandling',
          },
          {
            title: 'Is the plant seeding protected from the sun and wind',
            key: 'protectedFromSunWind',
          },
          {title: 'The plant seed kept in moist', key: 'seedKeptMoist'},
          {
            title: 'Is seeding transport during cooler period',
            key: 'transportDuringCoolerPeriod',
          },
          {
            title: 'Is seeding done as per approved drawing?',
            key: 'seedingAsPerDrawing',
          },
          {
            title: 'Is the seeding water done properly for the growth',
            key: 'waterDoneForGrowth',
          },
          {title: 'Control weeds near plantation', key: 'controlWeeds'},
          {
            title:
              'Is proper barricading done around the plant to avoid animal damage',
            key: 'barricadingDone',
          },
        ];

        return (
          <View>
            {plantationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.plantationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlantationData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Number of Plants Planted"
              value={'' + _v.plantationData.totalPlantsPlanted}
              onChange={(value: any) =>
                _v.setPlantationData((prevData: any) => ({
                  ...prevData,
                  totalPlantsPlanted: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Area Covered in Sqm"
              value={'' + _v.plantationData.totalAreaCovered}
              onChange={(value: any) =>
                _v.setPlantationData((prevData: any) => ({
                  ...prevData,
                  totalAreaCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.STONE_PITCHING:
        const stonePitchingProperties = [
          {
            title:
              'All Construction Docs, Approvals, and Drawings are in Place',
            key: 'constructionDocsApproved',
          },
          {
            title: 'Work of Other Trades Completed and Accepted',
            key: 'workOfOtherTradesCompleted',
          },
          {title: 'Layer Compacted', key: 'layerCompacted'},
          {
            title: 'Stone Shape and Size as per Specification',
            key: 'stoneShapeAndSizeAsPerSpec',
          },
          {
            title: 'Mortar Bonding Material Ready at Work Area',
            key: 'mortarReady',
          },
          {
            title: 'Mortar Bonding with Stone Done Properly',
            key: 'mortarBondingDone',
          },
        ];
        return (
          <View>
            {stonePitchingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.stonePitchingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setStonePitchingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Surface Area of Stone Pitching (sqm)"
              value={'' + _v.stonePitchingData.totalSurfaceArea}
              onChange={(value: any) =>
                _v.setStonePitchingData((prevData: any) => ({
                  ...prevData,
                  totalSurfaceArea: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Material Laid (tonne)"
              value={'' + _v.stonePitchingData.totalMaterialLaid}
              onChange={(value: any) =>
                _v.setStonePitchingData((prevData: any) => ({
                  ...prevData,
                  totalMaterialLaid: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_INVERTER_INSTALLATION:
        const inverterInstallationProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether equipment inspected at site and factory dispatch clearance obtained',
            key: 'equipmentInspected',
          },
          {
            title:
              'Is there any damage to the equipment, if yes, informed to vendor',
            key: 'equipmentDamagedInformed',
          },
          {
            title: 'Whether foundation work is completed for installation',
            key: 'foundationWorkCompleted',
          },
          {
            title: 'Whether concrete components achieved desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation methodology approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Whether safety arrangements are in place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Whether sufficient machinery and manpower available',
            key: 'machineryAndManpowerAvailable',
          },
          {
            title: 'Installation completed as per approved methodology',
            key: 'installationCompletedAsPerMethodology',
          },
          {
            title:
              'All instructions from the manufacturer complied during installation',
            key: 'manufacturerInstructionsComplied',
          },
        ];

        return (
          <View>
            {inverterInstallationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.inverterInstallationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setInverterInstallationData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Number of Equipment Installed"
              value={'' + _v.inverterInstallationData.totalEquipmentInstalled}
              onChange={(value: any) =>
                _v.setInverterInstallationData((prevData: any) => ({
                  ...prevData,
                  totalEquipmentInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_DOUBLE_POLE_STRUCTURE:
        const erectionOfDoublePoleStructureProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the double pole structure is reached at site and ready for erection',
            key: 'doublePoleReadyForErection',
          },
          {
            title:
              'Whether the foundation work completed in all respect and ready for installation of double pole',
            key: 'foundationWorkCompleted',
          },
          {
            title:
              'Whether the concrete components of the foundations achieved desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation methodology approved',
            key: 'installationMethodologyApproved',
          },
          {
            title:
              'Whether all safety arrangements are in place prior to the installation',
            key: 'safetyArrangementsInPlace',
          },
          {
            title:
              'Whether sufficient machinery and manpower available at site',
            key: 'machineryAndManpowerAvailable',
          },
          {
            title: 'Erection completed as per the approved methodology',
            key: 'erectionCompleted',
          },
        ];

        return (
          <View>
            {erectionOfDoublePoleStructureProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionOfDoublePoleStructureData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionOfDoublePoleStructureData(
                      (prevData: any) => ({
                        ...prevData,
                        [property.key]: value,
                      }),
                    )
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of double pole structures erected"
              value={
                '' +
                _v.erectionOfDoublePoleStructureData.totalDoublePolesErected
              }
              onChange={(value: any) =>
                _v.setErectionOfDoublePoleStructureData((prevData: any) => ({
                  ...prevData,
                  totalDoublePolesErected: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );

      case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
        const fixingOfMC4Properties = [
          {
            title:
              'Whether all the cables are connected using the MC 4/ Y connectors',
            key: 'cablesConnected',
          },
          {
            title: 'All connection checked physical and found OK',
            key: 'connectionsChecked',
          },
        ];

        return (
          <View>
            {fixingOfMC4Properties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfMC4Data[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfMC4Data((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of Y connectors used"
              value={'' + _v.fixingOfMC4Data.totalYConnectorsUsed}
              onChange={(value: any) =>
                _v.setFixingOfMC4Data((prevData: any) => ({
                  ...prevData,
                  totalYConnectorsUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_MMS:
        const fixingOfMMSProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the material has been inspected at factory and dispatch clearance obtained',
            key: 'materialInspectedAndCleared',
          },
          {
            title:
              'Whether the material reached at site all ok and none of the part is damaged, damaged part informed to the contractor or not',
            key: 'materialReachedUndamaged',
          },
          {
            title:
              'Whether the foundation has been completed in all respect including the casting of column post in its alignment properly',
            key: 'foundationCompleted',
          },
          {
            title: 'Whether the concrete has achieved the desired strength',
            key: 'concreteAchievedStrength',
          },
          {
            title: 'The alignment of the MMS is as per the drawings or not',
            key: 'alignmentAsPerDrawings',
          },
          {
            title: 'Whether line / level checked or not',
            key: 'lineLevelChecked',
          },
          {
            title:
              'Whether the angle of the structure checked and found as per the drawings',
            key: 'structureAngleChecked',
          },
          {
            title:
              'Whether all the nut bolts are torqued properly and tested as per the specification',
            key: 'nutBoltsTorquedProperly',
          },
          {
            title:
              'Whether MMS installed appears to be fit in all respect visually',
            key: 'visualFitCheck',
          },
        ];

        return (
          <View>
            {fixingOfMMSProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfMMSData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfMMSData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of MMS Tables Erected"
              value={'' + _v.fixingOfMMSData.totalNoOfMMSTablesErected}
              onChange={(value: any) =>
                _v.setFixingOfMMSData((prevData: any) => ({
                  ...prevData,
                  totalNoOfMMSTablesErected: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of MMS Structure Completed in RM"
              value={'' + _v.fixingOfMMSData.totalLengthOfMMSCompleted}
              onChange={(value: any) =>
                _v.setFixingOfMMSData((prevData: any) => ({
                  ...prevData,
                  totalLengthOfMMSCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_MODULES:
        const fixingOfModulesProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the material has been inspected at factory and dispatch clearance obtained',
            key: 'materialInspectedFactory',
          },
          {
            title:
              'Whether the material reached at site all ok and none of the part is damaged, damaged part informed to the vendor and insurance company',
            key: 'materialReachedSiteOk',
          },
          {
            title:
              'Whether the installation of MMS has been completed in all respect including its alignment properly',
            key: 'mmsInstallationCompleted',
          },
          {
            title: 'The alignment of the Modules is as per the drawings or not',
            key: 'alignmentAsPerDrawings',
          },
          {
            title: 'Whether line / level checked or not',
            key: 'lineLevelChecked',
          },
          {
            title:
              'Whether the angle of the Modules checked and found as per the drawings',
            key: 'moduleAngleChecked',
          },
          {
            title:
              'Whether all the nut bolts are torqued properly and tested as per the specification',
            key: 'nutBoltsTorqued',
          },
          {
            title:
              'Whether Modules installed appears to be fit in all respect visually',
            key: 'modulesFitVisually',
          },
        ];

        return (
          <View>
            {fixingOfModulesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfModulesData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfModulesData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Modules Mounted"
              value={'' + _v.fixingOfModulesData.totalModulesMounted}
              onChange={(value: any) =>
                _v.setFixingOfModulesData((prevData: any) => ({
                  ...prevData,
                  totalModulesMounted: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of Modules Mounting Completed in RM"
              value={'' + _v.fixingOfModulesData.totalLengthMounted}
              onChange={(value: any) =>
                _v.setFixingOfModulesData((prevData: any) => ({
                  ...prevData,
                  totalLengthMounted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_CAUTION_TAPE:
        const layingCautionTapeProperties = [
          {
            title: 'Whether the Drawings Approved or Not',
            key: 'drawingsApproved',
          },
          {
            title: 'Size, Shape and Thickness as per Drawings',
            key: 'sizeShapeThicknessAsPerDrawings',
          },
          {
            title: 'Source of Material Approved',
            key: 'sourceMaterialApproved',
          },
          {
            title: 'Caution Tape Laid Properly',
            key: 'cautionTapeLaidProperly',
          },
          {
            title: 'Caution Tape Laid at Desired Depth/Clearance',
            key: 'cautionTapeLaidAtDesiredDepth',
          },
        ];
        return (
          <View>
            {layingCautionTapeProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingCautionTapeData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingCautionTapeData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Caution Tape Laid (RM)"
              value={'' + _v.layingCautionTapeData.totalCautionTapeLength}
              onChange={(value: any) =>
                _v.setLayingCautionTapeData((prevData: any) => ({
                  ...prevData,
                  totalCautionTapeLength: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ROUTE_MARKING:
        const routeMarkingProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Are the size and shape of the markers as per the approved drawings/specifications',
            key: 'markersSizeShapeAsPerApproved',
          },
          {
            title: 'Whether source of the material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the layout marked at site or not',
            key: 'layoutMarkedAtSite',
          },
          {
            title: 'Whether route markers are fixed properly',
            key: 'routeMarkersFixedProperly',
          },
          {
            title: 'Whether spacing is as per the specifications',
            key: 'spacingAsPerSpecifications',
          },
        ];

        return (
          <View>
            {routeMarkingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.routeMarkingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setRouteMarkingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Route Markers Installed at Site"
              value={'' + _v.routeMarkingData.totalRouteMarkersInstalled}
              onChange={(value: any) =>
                _v.setRouteMarkingData((prevData: any) => ({
                  ...prevData,
                  totalRouteMarkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length Covered in RM"
              value={'' + _v.routeMarkingData.totalLengthCoveredRM}
              onChange={(value: any) =>
                _v.setRouteMarkingData((prevData: any) => ({
                  ...prevData,
                  totalLengthCoveredRM: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BRICKS_LAYERING:
        const bricksLayeringProperties = [
          {
            title: 'Whether the Drawings Approved or Not',
            key: 'drawingsApproved',
          },
          {
            title: 'Are the Size and Class of Bricks as per Approved Drawing',
            key: 'bricksSizeClassApproved',
          },
        ];

        return (
          <View>
            {bricksLayeringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.bricksLayeringData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setBricksLayeringData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Area of Brick Layering Completed (sqm)"
              value={'' + _v.bricksLayeringData.totalAreaCompleted}
              onChange={(value: any) =>
                _v.setBricksLayeringData((prevData: any) => ({
                  ...prevData,
                  totalAreaCompleted: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total No. of Bricks Laid (No)"
              value={'' + _v.bricksLayeringData.totalBricksLaid}
              onChange={(value: any) =>
                _v.setBricksLayeringData((prevData: any) => ({
                  ...prevData,
                  totalBricksLaid: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Trench Completed (RM)"
              value={'' + _v.bricksLayeringData.totalLengthTrenchCompleted}
              onChange={(value: any) =>
                _v.setBricksLayeringData((prevData: any) => ({
                  ...prevData,
                  totalLengthTrenchCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CABLE_DRESSING:
        const cableDressingProperties = [
          {
            title:
              'Whether all the cables are tied properly to the MMS structure and no cables are hanging',
            key: 'cablesTiedProperly',
          },
          {
            title: 'No cable has been damaged found during the dressing',
            key: 'noCableDamaged',
          },
        ];

        return (
          <View>
            {cableDressingProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.cableDressingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setCableDressingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CABLE_TRENCH_DRESSING:
        const cableTrenchDressingProperties = [
          {
            title: 'Whether the proper safety measure taken at the site',
            key: 'safetyMeasuresTaken',
          },
          {
            title: 'Sufficient manpower available at site',
            key: 'manpowerAvailable',
          },
          {
            title: 'Line levels are checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Trench has been made free from undesirable material',
            key: 'trenchClearedUndesirableMaterial',
          },
          {
            title: 'Bottom of trench well compacted as per specifications',
            key: 'trenchCompacted',
          },
        ];
        return (
          <View>
            {cableTrenchDressingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.cableTrenchDressingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setCableTrenchDressingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Trench Dressed in RM"
              value={'' + _v.cableTrenchDressingData.totalTrenchDressed}
              onChange={(value: any) =>
                _v.setCableTrenchDressingData((prevData: any) => ({
                  ...prevData,
                  totalTrenchDressed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CONDUIT_LAYING:
        const conduitLayingProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Are the size and shape of the conduit as per the approved drawings/ specifications',
            key: 'conduitSizeShapeAsPerSpecs',
          },
          {
            title: 'Whether source of the material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the conduit pipe laid properly',
            key: 'conduitPipeLaidProperly',
          },
          {
            title: 'Whether jointing has been done properly',
            key: 'jointingDoneProperly',
          },
        ];

        return (
          <View>
            {conduitLayingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.conduitLayingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setConduitLayingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Conduit Laid in RM"
              value={_v.conduitLayingData.totalConduitLength}
              onChange={(value: any) =>
                _v.setConduitLayingData((prevData: any) => ({
                  ...prevData,
                  totalConduitLength: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CABLE_TRENCH_EXCAVATION:
        const cableTrenchExcavationProperties = [
          {
            title: 'Proper Safety Measures Taken Before Excavation',
            key: 'safetyMeasuresTaken',
          },
          {title: 'Drawings Approved', key: 'drawingsApproved'},
          {
            title: 'Alignment of Trench Marked at Site',
            key: 'alignmentMarked',
          },
          {title: 'Utility Infringement Shifted', key: 'utilitiesShifted'},
          {
            title: 'Excavation Done to Required Depth and Width',
            key: 'excavationDepthWidth',
          },
        ];

        return (
          <View>
            {cableTrenchExcavationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.cableTrenchExcavationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setCableTrenchExcavationData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Qty of Soil Excavated (in Cum)"
              value={'' + _v.cableTrenchExcavationData.totalSoilQtyExcavated}
              onChange={(value: any) =>
                _v.setCableTrenchExcavationData((prevData: any) => ({
                  ...prevData,
                  totalSoilQtyExcavated: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Trench Excavated (in RM)"
              value={'' + _v.cableTrenchExcavationData.totalTrenchExcavated}
              onChange={(value: any) =>
                _v.setCableTrenchExcavationData((prevData: any) => ({
                  ...prevData,
                  totalTrenchExcavated: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_LT_PANEL:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_SERVO:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_MCB:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_INVERTOR:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_HT_PANEL:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_TRANSFORMER:
        const fixingAndInstallationProperties = [
          {title: 'Drawings Approved', key: 'drawingsApproved'},
          {
            title: 'Equipment Inspected at Factory Dispatch',
            key: 'equipmentInspected',
          },
          {
            title: 'Damage to Equipment Informed to Vendor',
            key: 'equipmentDamageInformed',
          },
          {
            title: 'Foundation Work Completed and Ready',
            key: 'foundationReady',
          },
          {
            title: 'Concrete Strength Achieved',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation Methodology Approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Safety Arrangements in Place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient Machinery and Manpower Available',
            key: 'machineryManpowerAvailable',
          },
          {
            title: 'Installation Completed per Approved Methodology',
            key: 'installationCompleted',
          },
          {
            title: 'Manufacturer Instructions Complied with',
            key: 'manufacturerInstructionsComplied',
          },
        ];

        return (
          <View>
            {fixingAndInstallationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingAndInstallationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingAndInstallationData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of Equipment Installed"
              value={'' + _v.fixingAndInstallationData.totalEquipmentInstalled}
              onChange={(value: any) =>
                _v.setFixingAndInstallationData((prevData: any) => ({
                  ...prevData,
                  totalEquipmentInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_LT_PANEL:
        const fixingAndInstallationLTPanelProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the equipment reached at site has been inspected in factory dispatch clearance obtained',
            key: 'equipmentInspected',
          },
          {
            title:
              'Is there any damage to the equipment or not, if yes whether informed to the vendor',
            key: 'equipmentDamageInformed',
          },
          {
            title:
              'Whether the equipment foundation work completed in all respect and ready for installation of equipment',
            key: 'foundationReady',
          },
          {
            title:
              'Whether the concrete components of the foundations achieved desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation methodology approved',
            key: 'installationMethodologyApproved',
          },
          {
            title:
              'Whether all safety arrangements are in place prior to the installation',
            key: 'safetyArrangementsInPlace',
          },
          {
            title:
              'Whether sufficient machinery and manpower available at site',
            key: 'machineryManpowerAvailable',
          },
          {
            title: 'Installation completed as per the approved methodology',
            key: 'installationCompleted',
          },
          {
            title:
              'All instructions as informed by the manufacturer have been complied with during installation',
            key: 'manufacturerInstructionsComplied',
          },
        ];

        return (
          <View>
            {fixingAndInstallationLTPanelProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingAndInstallationLTPanelData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingAndInstallationLTPanelData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of Equipment Installed"
              value={
                '' + _v.fixingAndInstallationLTPanelData.totalEquipmentInstalled
              }
              onChange={(value: any) =>
                _v.setFixingAndInstallationLTPanelData((prevData: any) => ({
                  ...prevData,
                  totalEquipmentInstalled: value,
                }))
              }
              isRequired={true}
              keyboardType="numeric"
            />

            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      // case TASK_TYPES.HT_PANEL_INSTALLATION:
      //   const htPanelInstallationProperties = [
      //     {title: 'Whether the Drawings Approved', key: 'drawingsApproved'},
      //     {
      //       title: 'Equipment Inspected & Factory Dispatch Clearance Obtained',
      //       key: 'equipmentInspected',
      //     },
      //     {
      //       title: 'Equipment Damage Reported to Vendor',
      //       key: 'equipmentDamageReported',
      //     },
      //     {
      //       title: 'Foundation Work Completed and Ready for Installation',
      //       key: 'foundationWorkCompleted',
      //     },
      //     {
      //       title: 'Concrete Components Achieved Desired Strength',
      //       key: 'concreteStrengthAchieved',
      //     },
      //     {
      //       title: 'Installation Methodology Approved',
      //       key: 'installationMethodologyApproved',
      //     },
      //     {
      //       title: 'All Safety Arrangements in Place',
      //       key: 'safetyArrangementsInPlace',
      //     },
      //     {
      //       title: 'Sufficient Machinery and Manpower Available',
      //       key: 'machineryAndManpowerAvailable',
      //     },
      //     {
      //       title: 'Installation Completed as per Approved Methodology',
      //       key: 'installationCompleted',
      //     },
      //     {
      //       title: 'Manufacturer Instructions Followed during Installation',
      //       key: 'manufacturerInstructionsFollowed',
      //     },
      //   ];

      //   return (
      //     <View>
      //       {htPanelInstallationProperties.map(property => (
      //         <View style={{flexDirection: 'column'}} key={property.key}>
      //           <DropdownPicker
      //             label={property.title}
      //             value={htPanelInstallationData[property.key]}
      //             items={YES_NO_LIST}
      //             onChange={(value: any) =>
      //               setHtPanelInstallationData((prevData: any) => ({
      //                 ...prevData,
      //                 [property.key]: value,
      //               }))
      //             }
      //             isRequired={true}
      //           />
      //         </View>
      //       ))}
      //       <Input
      //         label="Total No. of Equipment Installed"
      //         value={htPanelInstallationData.totalEquipmentsInstalled}
      //         onChange={(value: any) =>
      //           setHtPanelInstallationData((prevData: any) => ({
      //             ...prevData,
      //             totalEquipmentsInstalled: value,
      //           }))
      //         }
      //         isRequired={true}
      //       />
      //     </View>
      //   );
      case TASK_TYPES.ERECTION_OF_STRUCTURE:
        const erectionOfStructureProperties = [
          {title: 'Whether the Position checked', key: 'positionChecked'},
          {
            title: 'Whether the Welding done as per the approved drawing',
            key: 'weldingDoneAsPerDrawing',
          },
          {
            title: 'Whether the Structure is as per approved drawing',
            key: 'structureAsPerDrawing',
          },
          {
            title: 'Whether the Necessary support provided',
            key: 'necessarySupportProvided',
          },
        ];

        return (
          <View>
            {erectionOfStructureProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionOfStructureData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionOfStructureData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FABRICATION_OF_STRUCTURE:
        const fabricationOfStructureProperties = [
          {
            title: 'Steel Inspection for Surface Condition',
            key: 'steelInspection',
          },
          {
            title: 'Section Checked for Dimension and GFC Compliance',
            key: 'sectionChecked',
          },
          {
            title: 'Material Specification Checked as per GFC',
            key: 'materialSpecificationChecked',
          },
          {
            title: 'Connection Checked as per GFC',
            key: 'connectionChecked',
          },
          {title: 'Bolt Holes Clean and to Size', key: 'boltHolesClean'},
          {title: 'Only Approved Welders Used', key: 'approvedWeldersUsed'},
          {
            title: 'Welds Identified with Welder ID',
            key: 'weldsIdentified',
          },
          {
            title: 'Welds Inspected for Dimension, Shape, Location',
            key: 'weldsInspected',
          },
          {title: 'Welds Repaired as Required', key: 'weldsRepaired'},
          {
            title: 'Shape Edge Burns/Weld Spatter Removed',
            key: 'shapeEdgeBurnsRemoved',
          },
          {
            title: 'Oil and Grease Removed before Final Cleaning',
            key: 'oilGreaseRemoved',
          },
          {
            title: 'Steel Cleaned and Painted as per Specification',
            key: 'steelCleanedAndPainted',
          },
          {
            title: 'Final Shop Coat Applied as per Approved Color',
            key: 'finalShopCoatApplied',
          },
          {
            title: 'Each Structure Marked for Erection as per Scope',
            key: 'structureMarkedForErection',
          },
          {
            title: 'Structure Approved by Inspector Before Shipment',
            key: 'structureApprovedPriorShipment',
          },
        ];

        return (
          <View>
            {fabricationOfStructureProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fabricationOfStructureData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFabricationOfStructureData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_PANELS:
        const fixingOfPanelsProperties = [
          {
            title: 'Is the bus shelter drawing approved',
            key: 'drawingApproved',
          },
          {
            title: 'Is the material source approved',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Is the shape and size of panel same as mentioned in drawing',
            key: 'panelShapeSizeAsDrawing',
          },
          {title: 'Are bolts and holes aligned', key: 'boltsAligned'},
          {title: 'Are the panels fixed in line', key: 'panelsFixedInLine'},
          {
            title: 'Are the all bolts fully torqued',
            key: 'boltsFullyTorqued',
          },
        ];

        return (
          <View>
            {fixingOfPanelsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfPanelsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfPanelsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Panels Installed"
              value={'' + _v.fixingOfPanelsData.totalPanelsInstalled}
              onChange={(value: any) =>
                _v.setFixingOfPanelsData((prevData: any) => ({
                  ...prevData,
                  totalPanelsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total No. of Bus Shelter Completed"
              value={'' + _v.fixingOfPanelsData.totalBusShelterCompleted}
              onChange={(value: any) =>
                _v.setFixingOfPanelsData((prevData: any) => ({
                  ...prevData,
                  totalBusShelterCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_PRECAST_COLUMN:
        const erectionPreCastColumnProperties = [
          {title: 'Is the Drawing Approved', key: 'drawingApproved'},
          {
            title: 'Pre-Cast Columns from Approved Source',
            key: 'columnsFromApprovedSource',
          },
          {title: 'Is Any Column Damaged', key: 'columnDamaged'},
          {
            title: 'Erection is as per the Drawing',
            key: 'erectionAsPerDrawing',
          },
          {
            title: 'Line and Level Checked Properly',
            key: 'lineLevelChecked',
          },
          {
            title: 'Dimensions of the Column are as per Drawing',
            key: 'dimensionsAsPerDrawing',
          },
          {
            title: 'Spacing of Columns is as per Approved Drawing',
            key: 'columnSpacingAsPerDrawing',
          },
        ];

        return (
          <View>
            {erectionPreCastColumnProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionPreCastColumnData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionPreCastColumnData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Columns Erected"
              value={'' + _v.erectionPreCastColumnData.totalNoOfColumnsErected}
              onChange={(value: any) =>
                _v.setErectionPreCastColumnData((prevData: any) => ({
                  ...prevData,
                  totalNoOfColumnsErected: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of B/Wall Covered (RM)"
              value={
                '' + _v.erectionPreCastColumnData.totalLengthOfBwallCovered
              }
              onChange={(value: any) =>
                _v.setErectionPreCastColumnData((prevData: any) => ({
                  ...prevData,
                  totalLengthOfBwallCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_BUS_SHELTER:
        const erectionOfBusShelterProperties = [
          {
            title: 'Whether source of material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the drawings approved',
            key: 'drawingsApproved',
          },
          {
            title: 'Is the supporting surface checked and found OK',
            key: 'supportingSurfaceChecked',
          },
          {
            title: 'Are sufficient safety arrangements in place at site',
            key: 'safetyArrangementsInPlace',
          },
        ];

        return (
          <View>
            {erectionOfBusShelterProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionOfBusShelterData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionOfBusShelterData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of Panels Installed"
              value={'' + _v.erectionOfBusShelterData.totalPanelsInstalled}
              onChange={(value: any) =>
                _v.setErectionOfBusShelterData((prevData: any) => ({
                  ...prevData,
                  totalPanelsInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total No. of Bus Stands Completed"
              value={'' + _v.erectionOfBusShelterData.totalBusStandsCompleted}
              onChange={(value: any) =>
                _v.setErectionOfBusShelterData((prevData: any) => ({
                  ...prevData,
                  totalBusStandsCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_ANGLE_SECTION:
        const erectionOfAngleSectionProperties = [
          {
            title: 'Check all the angles are from approved source',
            key: 'anglesFromApprovedSource',
          },
          {
            title:
              'Material inspection at factory done and clearance for dispatch obtained',
            key: 'materialInspectionClearance',
          },
          {
            title:
              'Whether any material reached at site is damaged, if yes, informed to supplier',
            key: 'materialDamagedInformed',
          },
          {
            title: 'Erection done as per approved drawing',
            key: 'erectionAsPerDrawing',
          },
          {
            title: 'Alignment, plumb, fixing, and temporary support all ok',
            key: 'alignmentSupportOk',
          },
          {title: 'Total column/angles erected', key: 'totalAnglesErected'},
        ];

        return (
          <View>
            {erectionOfAngleSectionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.erectionOfAngleSectionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionOfAngleSectionData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total column/angles erected"
              value={'' + _v.erectionOfAngleSectionData.totalAnglesErected}
              onChange={(value: any) =>
                _v.setErectionOfAngleSectionData((prevData: any) => ({
                  ...prevData,
                  totalAnglesErected: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_PRE_CAST_RCC_PANELS:
        const preCastRccPanelProperties = [
          {title: 'Whether drawing approved', key: 'drawingApproved'},
          {
            title: 'Check all the pre cast panels are from approved source',
            key: 'panelsFromApprovedSource',
          },
          {
            title:
              'Whether any panel found damaged, especially at the male-female joint',
            key: 'damagedPanelFound',
          },
          {
            title: 'Alignment, plumb, fixing, and temporary support',
            key: 'alignmentPlumbFixingSupport',
          },
        ];

        return (
          <View>
            {preCastRccPanelProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.preCastRccPanelData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPreCastRccPanelData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Panels Installed in Nos."
              value={'' + _v.preCastRccPanelData.totalPanelsInstalled}
              onChange={(value: any) =>
                _v.setPreCastRccPanelData((prevData: any) => ({
                  ...prevData,
                  totalPanelsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Area of Panels Installed in Sqm"
              value={'' + _v.preCastRccPanelData.totalAreaInstalled}
              onChange={(value: any) =>
                _v.setPreCastRccPanelData((prevData: any) => ({
                  ...prevData,
                  totalAreaInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_CHAIN_LINK:
        const placingChainLinkProperties = [
          {title: 'Is the drawing approved', key: 'drawingApproved'},
          {
            title: 'Is fencing installed in accordance with the plot plan?',
            key: 'fencingInstalledAsPerPlotPlan',
          },
          {
            title:
              'Are all fittings, caps, tension bars, hinges, and hardware installed properly?',
            key: 'fittingsCapsTensionBarsHingesHardwareInstalled',
          },
          {
            title: 'Are corner and end posts firmly anchored and supported?',
            key: 'cornerEndPostsAnchoredSupported',
          },
          {
            title: 'Are all fence components free from defects in workmanship?',
            key: 'fenceComponentsDefectFree',
          },
          {
            title:
              'Has the fence been installed at the correct height requirement?',
            key: 'fenceInstalledAtCorrectHeight',
          },
          {
            title: 'Does the fence end with a terminal post?',
            key: 'fenceEndsWithTerminalPost',
          },
          {
            title: 'Are appropriate fasteners used?',
            key: 'appropriateFastenersUsed',
          },
          {
            title: 'Is there damaged mesh, if yes informed to the supplier?',
            key: 'damagedMeshInformedSupplier',
          },
          {
            title:
              'Are there missing or damaged components such as the tension wire, tension bar, tension band, or ties?',
            key: 'missingDamagedComponents',
          },
          {
            title:
              'Is there too much movement on the top rail between end post, line post, and terminal post?',
            key: 'tooMuchMovementTopRail',
          },
          {
            title:
              'Has the right fencing material been used according to the detail?',
            key: 'rightFencingMaterialUsed',
          },
          {
            title:
              'Is the required fence gap present (from soil to the fence mesh)?',
            key: 'requiredFenceGapPresent',
          },
          {
            title: 'Is the mesh and tension wire/band too loose?',
            key: 'meshTensionWireLoose',
          },
        ];

        return (
          <View>
            {placingChainLinkProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.placingChainLinkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlacingChainLinkData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Sqm of Fence Installed"
              value={'' + _v.placingChainLinkData.totalSqmFenceInstalled}
              onChange={(value: any) =>
                _v.setPlacingChainLinkData((prevData: any) => ({
                  ...prevData,
                  totalSqmFenceInstalled: value,
                }))
              }
              isRequired={true}
              keyboardType="numeric"
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.MORTAR_CHECKLIST:
        const mortarChecklistProperties = [
          {
            title: 'Is the mortar mix uniform and of optimal workability?',
            key: 'mortarMixUniform',
          },
          {
            title:
              'Is there a sufficient quantity of mortar mixed for the next 30 minutes?',
            key: 'sufficientMortarQuantity',
          },
          {
            title: 'Is the block work in proper alignment and plumb?',
            key: 'blockAlignmentPlumb',
          },
          {
            title: 'Have all the joints been staggered and raked properly?',
            key: 'jointsStaggered',
          },
          {
            title:
              'Is mortar placed between the edge of the block and the column?',
            key: 'mortarBetweenBlockAndColumn',
          },
        ];

        return (
          <View>
            {mortarChecklistProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.mortarChecklistData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setMortarChecklistData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Cement Bag Consumed (in no.)"
              value={'' + _v.mortarChecklistData.totalCementBagsConsumed}
              onChange={(value: any) =>
                _v.setMortarChecklistData((prevData: any) => ({
                  ...prevData,
                  totalCementBagsConsumed: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Surface Area to be Plastered (in sqm)"
              value={'' + _v.mortarChecklistData.totalSurfaceAreaToBePlastered}
              onChange={(value: any) =>
                _v.setMortarChecklistData((prevData: any) => ({
                  ...prevData,
                  totalSurfaceAreaToBePlastered: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Quantity of Mortar Used (in cum)"
              value={'' + _v.mortarChecklistData.totalMortarUsed}
              onChange={(value: any) =>
                _v.setMortarChecklistData((prevData: any) => ({
                  ...prevData,
                  totalMortarUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FLOORING:
        const flooringProperties = [
          {
            title: 'Flooring Material Source Approved',
            key: 'flooringMaterialSourceApproved',
          },
          {
            title: 'Tiles/Other Material Free from Cracks',
            key: 'tilesCrackFree',
          },
          {
            title: 'Cracks, Holes or Uneven Surface Present',
            key: 'cracksHolesUnevenSurface',
          },
          {
            title: 'Joints at Transition Area are Smooth',
            key: 'jointsAtTransitionSmooth',
          },
          {
            title: 'Flooring Done at Entry/Exit Ramps',
            key: 'flooringDoneAtRamps',
          },
        ];

        return (
          <View>
            {flooringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.flooringData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFlooringData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Surface Area Flooring Done (Sqm)"
              value={'' + _v.flooringData.totalSurfaceArea}
              onChange={(value: any) =>
                _v.setFlooringData((prevData: any) => ({
                  ...prevData,
                  totalSurfaceArea: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Number of Tiles Used"
              value={'' + _v.flooringData.totalTilesUsed}
              onChange={(value: any) =>
                _v.setFlooringData((prevData: any) => ({
                  ...prevData,
                  totalTilesUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.SIGNAGE_LOCATION_IDENTIFICATION:
        const signageLocationProperties = [
          {
            title: 'Whether the drawing is approved',
            key: 'drawingApproved',
          },
          {
            title: 'Whether the location is marked using temporary arrangement',
            key: 'locationMarked',
          },
          {
            title: 'Whether the marked location is checked by engineer',
            key: 'locationCheckedByEngineer',
          },
          {
            title: 'Whether the location has no hindrance in installation',
            key: 'noHindranceInInstallation',
          },
        ];

        return (
          <View>
            {signageLocationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.signageLocationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setSignageLocationData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BACKFILL:
        const backfillProperties = [
          {
            title:
              'Verify that the excavated area to be backfilled is clear of debris and formwork materials',
            key: 'areaClearOfDebris',
          },
          {
            title:
              'Confirm that the fill materials are approved and test results comply with the specifications',
            key: 'fillMaterialsApproved',
          },
          {
            title:
              'Ensure avoidance of damage to the cables, caution tapes, or other things laid in the trench',
            key: 'noDamageToCables',
          },
          {
            title:
              'Ensure the backfilling is complete and the area is clean and tidy',
            key: 'backfillingComplete',
          },
        ];

        return (
          <View>
            {backfillProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.backfillData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setBackfillData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Qty of Soil Used in cum"
              value={'' + _v.backfillData.totalQtySoilUsed}
              onChange={(value: any) =>
                _v.setBackfillData((prevData: any) => ({
                  ...prevData,
                  totalQtySoilUsed: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Trench Backfilled in RM"
              value={'' + _v.backfillData.totalLengthTrenchBackfilled}
              onChange={(value: any) =>
                _v.setBackfillData((prevData: any) => ({
                  ...prevData,
                  totalLengthTrenchBackfilled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACEMENT_OF_SIGNAGE_SHEET:
        const placementOfSignageSheetProperties = [
          {
            title: 'Whether the material source is approved',
            key: 'materialSourceApproved',
          },
          {title: 'Whether the drawings approved', key: 'drawingsApproved'},
          {
            title: 'Whether the letter size is as per approved drawing',
            key: 'letterSizeAsPerDrawing',
          },
          {
            title: 'Whether riveted properly in the frame',
            key: 'rivetedProperlyInFrame',
          },
          {
            title: 'Whether placed as per approved drawing',
            key: 'placedAsPerDrawing',
          },
        ];
        return (
          <View>
            {placementOfSignageSheetProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.placementOfSignageSheetData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlacementOfSignageSheetData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Sheet Fixed in Sqm"
              value={'' + _v.placementOfSignageSheetData.totalSheetFixed}
              onChange={(value: any) =>
                _v.setPlacementOfSignageSheetData((prevData: any) => ({
                  ...prevData,
                  totalSheetFixed: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of Road Covered in Km"
              value={'' + _v.placementOfSignageSheetData.totalRoadLengthCovered}
              onChange={(value: any) =>
                _v.setPlacementOfSignageSheetData((prevData: any) => ({
                  ...prevData,
                  totalRoadLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_TRAFFIC_IMPACT_ATTENUATORS:
        const trafficImpactAttenuatorsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title: 'Whether the fixing methodology approved',
            key: 'fixingMethodologyApproved',
          },
          {
            title:
              'Whether attenuators fixed properly as per the approved method and drawings',
            key: 'attenuatorsFixedProperly',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {trafficImpactAttenuatorsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.trafficImpactAttenuatorsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setTrafficImpactAttenuatorsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Attenuators Installed"
              value={
                '' +
                _v.trafficImpactAttenuatorsData.totalNoOfAttenuatorsInstalled
              }
              onChange={(value: any) =>
                _v.setTrafficImpactAttenuatorsData((prevData: any) => ({
                  ...prevData,
                  totalNoOfAttenuatorsInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of Road Covered in Km"
              value={
                '' + _v.trafficImpactAttenuatorsData.totalLengthOfRoadCovered
              }
              onChange={(value: any) =>
                _v.setTrafficImpactAttenuatorsData((prevData: any) => ({
                  ...prevData,
                  totalLengthOfRoadCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_SPRING_POST:
        const fixingOfSpringPostProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title: 'Whether posts are fixed properly',
            key: 'postsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineAndLevelChecked',
          },
          {
            title: 'Whether the spacing between them are as per specifications',
            key: 'spacingAsPerSpecification',
          },
          {
            title: 'Whether items are properly cleaned and visible',
            key: 'itemsCleanedAndVisible',
          },
        ];

        return (
          <View>
            {fixingOfSpringPostProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfSpringPostData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfSpringPostData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of Spring Post Installed"
              value={'' + _v.fixingOfSpringPostData.springPostInstalled}
              onChange={(value: any) =>
                _v.setFixingOfSpringPostData((prevData: any) => ({
                  ...prevData,
                  springPostInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Road Covered in km"
              value={'' + _v.fixingOfSpringPostData.totalRoadLengthCovered}
              onChange={(value: any) =>
                _v.setFixingOfSpringPostData((prevData: any) => ({
                  ...prevData,
                  totalRoadLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_SOLAR_ROAD_STUDS:
        const fixingOfSolarRoadStudsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title:
              'Whether the color code and locations are as per specification',
            key: 'colorCodeAndLocationAsPerSpec',
          },
          {
            title: 'Whether studs are fixed properly',
            key: 'studsFixedProperly',
          },
          {
            title: 'Whether line checked properly',
            key: 'lineCheckedProperly',
          },
          {
            title: 'Whether the spacing is as per specifications',
            key: 'spacingAsPerSpecs',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
        ];

        return (
          <View>
            {fixingOfSolarRoadStudsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfSolarRoadStudsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfSolarRoadStudsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of Road Studs Installed"
              value={'' + _v.fixingOfSolarRoadStudsData.noOfRoadStuds}
              onChange={(value: any) =>
                _v.setFixingOfSolarRoadStudsData((prevData: any) => ({
                  ...prevData,
                  noOfRoadStuds: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Road Covered in Km"
              value={'' + _v.fixingOfSolarRoadStudsData.totalLengthCovered}
              onChange={(value: any) =>
                _v.setFixingOfSolarRoadStudsData((prevData: any) => ({
                  ...prevData,
                  totalLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_SOLAR_BLINKERS:
        const fixingOfSolarBlinkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title: 'Whether blinkers are in working condition',
            key: 'blinkersWorkingCondition',
          },
          {
            title: 'Whether blinkers are fixed properly?',
            key: 'blinkersFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelChecked',
          },
          {
            title: 'Whether items are properly cleaned and visible',
            key: 'itemsCleanedAndVisible',
          },
        ];

        return (
          <View>
            {fixingOfSolarBlinkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfSolarBlinkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfSolarBlinkersData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Blinkers Installed"
              value={'' + _v.fixingOfSolarBlinkersData.totalBlinkersInstalled}
              onChange={(value: any) =>
                _v.setFixingOfSolarBlinkersData((prevData: any) => ({
                  ...prevData,
                  totalBlinkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of Road Covered in Km"
              value={'' + _v.fixingOfSolarBlinkersData.totalRoadLengthCovered}
              onChange={(value: any) =>
                _v.setFixingOfSolarBlinkersData((prevData: any) => ({
                  ...prevData,
                  totalRoadLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_ROAD_STUDS:
        const fixingOfRoadStudsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size are as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title:
              'Whether the color code and locations are as per specification and approved drawings',
            key: 'colorCodeAndLocationAsPerSpecification',
          },
          {
            title: 'Whether studs are fixed properly',
            key: 'studsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineAndLevelChecked',
          },
          {
            title: 'Whether the spacing is as per the specification',
            key: 'spacingAsPerSpecification',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfRoadStudsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfRoadStudsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfRoadStudsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Number of Road Studs Installed"
              value={'' + _v.fixingOfRoadStudsData.roadStudsInstalled}
              onChange={(value: any) =>
                _v.setFixingOfRoadStudsData((prevData: any) => ({
                  ...prevData,
                  roadStudsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Road Covered (in Km)"
              value={'' + _v.fixingOfRoadStudsData.totalLengthCovered}
              onChange={(value: any) =>
                _v.setFixingOfRoadStudsData((prevData: any) => ({
                  ...prevData,
                  totalLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_ROAD_DELINEATORS:
        const fixingOfRoadDelineatorsProperties = [
          {
            title: 'Source Material Approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Drawing Approved', key: 'drawingApproved'},
          {
            title: 'Shape and Size as per Approved Drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title: 'Delineators Fixed Properly',
            key: 'delineatorsFixedProperly',
          },
          {
            title: 'Line and Level Checked Properly',
            key: 'lineLevelChecked',
          },
          {
            title: 'Spacing Between Delineators as per Specifications',
            key: 'spacingBetweenDelineators',
          },
        ];
        return (
          <View>
            {fixingOfRoadDelineatorsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfRoadDelineatorsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfRoadDelineatorsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of Delineators Installed"
              value={_v.fixingOfRoadDelineatorsData.nosOfDelineatorsInstalled}
              onChange={(value: any) =>
                _v.setFixingOfRoadDelineatorsData((prevData: any) => ({
                  ...prevData,
                  nosOfDelineatorsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length the Road Covered in Km"
              value={_v.fixingOfRoadDelineatorsData.totalLengthRoadCovered}
              onChange={(value: any) =>
                _v.setFixingOfRoadDelineatorsData((prevData: any) => ({
                  ...prevData,
                  totalLengthRoadCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={_v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_OBJECT_MARKERS:
        const fixingOfObjectMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the markers fixed properly?',
            key: 'markersFixedProperly',
          },
          {
            title: 'Whether line and levels checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfObjectMarkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfObjectMarkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfObjectMarkersData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of markers installed"
              value={'' + _v.fixingOfObjectMarkersData.totalMarkersInstalled}
              onChange={(value: any) =>
                _v.setFixingOfObjectMarkersData((prevData: any) => ({
                  ...prevData,
                  totalMarkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of highway covered in Km"
              value={'' + _v.fixingOfObjectMarkersData.totalLengthCoveredKm}
              onChange={(value: any) =>
                _v.setFixingOfObjectMarkersData((prevData: any) => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_NOISE_BARRIER:
        const fixingOfNoiseBarrierProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the posts fixed at crash barrier properly',
            key: 'postsFixedProperly',
          },
          {
            title: 'Whether posts are in proper line and level',
            key: 'postsLineLevelChecked',
          },
          {
            title:
              'Whether there is gap left between crash barrier and noise barrier',
            key: 'gapBetweenCrashAndNoiseBarrier',
          },
          {
            title: 'Whether the frame fixed tightly with posts',
            key: 'frameFixedTightly',
          },
        ];

        return (
          <View>
            {fixingOfNoiseBarrierProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfNoiseBarrierData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfNoiseBarrierData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of noise barrier panels installed"
              value={
                '' +
                _v.fixingOfNoiseBarrierData.totalNoiseBarrierPanelsInstalled
              }
              onChange={(value: any) =>
                _v.setFixingOfNoiseBarrierData((prevData: any) => ({
                  ...prevData,
                  totalNoiseBarrierPanelsInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of noise barrier fixed at crash barrier in RM"
              value={
                '' + _v.fixingOfNoiseBarrierData.totalLengthNoiseBarrierFixedRM
              }
              onChange={(value: any) =>
                _v.setFixingOfNoiseBarrierData((prevData: any) => ({
                  ...prevData,
                  totalLengthNoiseBarrierFixedRM: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_LED_TRAFFIC_BLINKERS:
        const fixingOfLEDTrafficBlinkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the items are in working condition',
            key: 'workingCondition',
          },
          {
            title: 'Whether items are fixed properly',
            key: 'itemsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelChecked',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfLEDTrafficBlinkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfLEDTrafficBlinkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfLEDTrafficBlinkersData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of blinkers installed"
              value={
                '' + _v.fixingOfLEDTrafficBlinkersData.totalBlinkersInstalled
              }
              onChange={(value: any) =>
                _v.setFixingOfLEDTrafficBlinkersData((prevData: any) => ({
                  ...prevData,
                  totalBlinkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of highway covered in Km"
              value={
                '' + _v.fixingOfLEDTrafficBlinkersData.totalHighwayLengthCovered
              }
              onChange={(value: any) =>
                _v.setFixingOfLEDTrafficBlinkersData((prevData: any) => ({
                  ...prevData,
                  totalHighwayLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_HAZARD_MARKERS:
        const fixingOfHazardMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawings',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the markers fixed properly?',
            key: 'markersFixedProperly',
          },
          {
            title: 'Whether line and level checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfHazardMarkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfHazardMarkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfHazardMarkersData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of hazard markers installed"
              value={'' + _v.fixingOfHazardMarkersData.totalMarkersInstalled}
              onChange={(value: any) =>
                _v.setFixingOfHazardMarkersData((prevData: any) => ({
                  ...prevData,
                  totalMarkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of highway covered in Km"
              value={'' + _v.fixingOfHazardMarkersData.totalLengthCoveredKm}
              onChange={(value: any) =>
                _v.setFixingOfHazardMarkersData((prevData: any) => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_FLEXIBLE_MEDIAN_MARKERS:
        const fixingOfFlexibleMedianMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the flexible median marker fixed properly',
            key: 'markersFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether the spacing is as per specifications',
            key: 'spacingAsPerSpecifications',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfFlexibleMedianMarkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfFlexibleMedianMarkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfFlexibleMedianMarkersData(
                      (prevData: any) => ({
                        ...prevData,
                        [property.key]: value,
                      }),
                    )
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of flexible median marker installed"
              value={
                '' + _v.fixingOfFlexibleMedianMarkersData.totalMarkersInstalled
              }
              onChange={(value: any) =>
                _v.setFixingOfFlexibleMedianMarkersData((prevData: any) => ({
                  ...prevData,
                  totalMarkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of the road covered in Km"
              value={
                '' + _v.fixingOfFlexibleMedianMarkersData.totalLengthCoveredKm
              }
              onChange={(value: any) =>
                _v.setFixingOfFlexibleMedianMarkersData((prevData: any) => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_CONVEX_MIRRORS:
        const fixingOfConvexMirrorsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether items are in working condition',
            key: 'workingCondition',
          },
          {
            title: 'Whether mirrors fixed properly at proper location',
            key: 'mirrorsFixedProperly',
          },
          {
            title: 'Whether line, level and angle checked properly',
            key: 'lineLevelAngleChecked',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
        ];

        return (
          <View>
            {fixingOfConvexMirrorsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfConvexMirrorsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfConvexMirrorsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of mirrors installed"
              value={'' + _v.fixingOfConvexMirrorsData.totalMirrorsInstalled}
              onChange={(value: any) =>
                _v.setFixingOfConvexMirrorsData((prevData: any) => ({
                  ...prevData,
                  totalMirrorsInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of highway covered in Km"
              value={'' + _v.fixingOfConvexMirrorsData.totalLengthCoveredKm}
              onChange={(value: any) =>
                _v.setFixingOfConvexMirrorsData((prevData: any) => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />

            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_ANTIGLARES:
        const fixingOfAntiglaresProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether items are fixed properly',
            key: 'itemsFixedProperly',
          },
          {
            title: 'Whether line and level checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether the spacing are as per specifications',
            key: 'spacingAsPerSpecifications',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
        ];

        return (
          <View>
            {fixingOfAntiglaresProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfAntiglaresData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfAntiglaresData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Nos of Antiglares installed"
              value={'' + _v.fixingOfAntiglaresData.totalAntiglaresInstalled}
              onChange={(value: any) =>
                _v.setFixingOfAntiglaresData((prevData: any) => ({
                  ...prevData,
                  totalAntiglaresInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of the road covered in Km"
              value={'' + _v.fixingOfAntiglaresData.totalLengthCoveredKm}
              onChange={(value: any) =>
                _v.setFixingOfAntiglaresData((prevData: any) => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_POLES:
        const erectionOfPolesProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the source approved or not',
            key: 'sourceApproved',
          },
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title:
              'Whether foundations are ready and concrete has achieved the desired strength',
            key: 'foundationsReady',
          },
          {
            title:
              'All the poles are erected properly with alignment as per drawings',
            key: 'polesAlignedProperly',
          },
          {
            title: 'All the nut bolts are tightened and checked properly',
            key: 'nutBoltsTightened',
          },
        ];

        return (
          <View>
            {erectionOfPolesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={'' + _v.erectionOfPolesData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setErectionOfPolesData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of poles erected"
              value={'' + _v.erectionOfPolesData.totalPolesErected}
              onChange={(value: any) =>
                _v.setErectionOfPolesData((prevData: any) => ({
                  ...prevData,
                  totalPolesErected: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={'' + _v.erectionOfPolesData.totalHighwayLengthCovered}
              onChange={(value: any) =>
                _v.setErectionOfPolesData((prevData: any) => ({
                  ...prevData,
                  totalHighwayLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_ARMS:
        const fixingOfArmsProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the source approved or not',
            key: 'sourceApproved',
          },
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title:
              'All the arms are fixed properly with alignment as per drawings',
            key: 'armsFixedProperly',
          },
          {
            title: 'All the nut bolts are tightened and checked properly',
            key: 'nutsBoltsTightened',
          },
        ];

        return (
          <View>
            {fixingOfArmsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfArmsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfArmsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of arms erected in no."
              value={'' + _v.fixingOfArmsData.totalQtyArmsErected}
              onChange={(value: any) =>
                _v.setFixingOfArmsData((prevData: any) => ({
                  ...prevData,
                  totalQtyArmsErected: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={'' + _v.fixingOfArmsData.totalHighwayLengthCoveredKm}
              onChange={(value: any) =>
                _v.setFixingOfArmsData((prevData: any) => ({
                  ...prevData,
                  totalHighwayLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.INSTALLATION_OF_LED_LIGHTS:
        const installationOfLEDLightsProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the source approved or not',
            key: 'sourceApproved',
          },
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'All the lights are tested before installation',
            key: 'lightsTestedBeforeInstallation',
          },
          {
            title: 'All the installed properly',
            key: 'lightsInstalledProperly',
          },
        ];

        return (
          <View>
            {installationOfLEDLightsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.installationOfLEDLightsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setInstallationOfLEDLightsData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of lights installed"
              value={
                '' + _v.installationOfLEDLightsData.totalQtyOfLightsInstalled
              }
              onChange={(value: any) =>
                _v.setInstallationOfLEDLightsData((prevData: any) => ({
                  ...prevData,
                  totalQtyOfLightsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={
                '' +
                _v.installationOfLEDLightsData.totalLengthOfHighwayCoveredKm
              }
              onChange={(value: any) =>
                _v.setInstallationOfLEDLightsData((prevData: any) => ({
                  ...prevData,
                  totalLengthOfHighwayCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_FLEXIBLE_CABLE:
        const layingOfFlexibleCableProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the source approved or not',
            key: 'sourceApproved',
          },
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'Whether the cable have been laid properly',
            key: 'cableLaidProperly',
          },
          {
            title:
              'Whether all the joints are made properly and junction boxes are as per specifications',
            key: 'jointsMadeProperly',
          },
          {
            title: 'Whether the end points are terminated properly',
            key: 'endpointsTerminatedProperly',
          },
          {
            title: 'Whether proper testing done and successful',
            key: 'testingSuccessful',
          },
        ];

        return (
          <View>
            {layingOfFlexibleCableProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfFlexibleCableData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfFlexibleCableData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total length of cable laid in RM"
              value={'' + _v.layingOfFlexibleCableData.totalCableLengthRM}
              onChange={(value: any) =>
                _v.setLayingOfFlexibleCableData((prevData: any) => ({
                  ...prevData,
                  totalCableLengthRM: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={'' + _v.layingOfFlexibleCableData.totalHighwayLengthKm}
              onChange={(value: any) =>
                _v.setLayingOfFlexibleCableData((prevData: any) => ({
                  ...prevData,
                  totalHighwayLengthKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_LT_CABLE:
        const layingOfLTCableProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the source approved or not',
            key: 'sourceApproved',
          },
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'Whether the cable have been laid properly',
            key: 'cableLaidProperly',
          },
          {
            title:
              'Whether all the joints are made properly as per the specifications or not',
            key: 'jointsMadeProperly',
          },
          {
            title: 'Whether the end points are terminated properly',
            key: 'endPointsTerminated',
          },
          {
            title: 'Whether proper testing done and successful',
            key: 'properTestingDone',
          },
        ];

        return (
          <View>
            {layingOfLTCableProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfLTCableData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfLTCableData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total length of cable laid in RM"
              value={'' + _v.layingOfLTCableData.totalCableLengthRM}
              onChange={(value: any) =>
                _v.setLayingOfLTCableData((prevData: any) => ({
                  ...prevData,
                  totalCableLengthRM: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={'' + _v.layingOfLTCableData.totalHighwayLengthKm}
              onChange={(value: any) =>
                _v.setLayingOfLTCableData((prevData: any) => ({
                  ...prevData,
                  totalHighwayLengthKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_STONE:
        const fixingOfStoneProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the stones are fixed properly',
            key: 'stonesFixedProperly',
          },
          {
            title:
              'Whether the project number, Terminal station & kilometrage etc. are mentioned',
            key: 'projectDetailsCorrect',
          },
          {
            title: 'Whether the items are properly cleaned and visible',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfStoneProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.fixingOfStoneData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFixingOfStoneData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of stones installed"
              value={'' + _v.fixingOfStoneData.totalStonesInstalled}
              onChange={(value: any) =>
                _v.setFixingOfStoneData((prevData: any) => ({
                  ...prevData,
                  totalStonesInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of road covered in Km"
              value={'' + _v.fixingOfStoneData.totalLengthCoveredKm}
              onChange={(value: any) =>
                _v.setFixingOfStoneData((prevData: any) => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLASTERING:
        const plasteringProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the cement source approved or not',
            key: 'cementSourceApproved',
          },
          {
            title:
              'Whether the source of other materials such as sand, water etc.',
            key: 'otherMaterialsSourceApproved',
          },
          {
            title:
              'Whether the plaster has been made in the proportions as per the specifications',
            key: 'proportionsAsPerSpecs',
          },
          {
            title:
              'Whether the thickness of plaster has been done as per the approved drawings',
            key: 'thicknessAsPerDrawings',
          },
          {
            title: 'Whether the surface finish is proper and uniform',
            key: 'surfaceFinishProper',
          },
        ];

        return (
          <View>
            {plasteringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.plasteringData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlasteringData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total plastering work done in sqft"
              value={'' + _v.plasteringData.totalPlasteringWorkSqft}
              onChange={(value: any) =>
                _v.setPlasteringData((prevData: any) => ({
                  ...prevData,
                  totalPlasteringWorkSqft: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PUTTY:
        const puttyProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether the plastered surface is dried properly and ready for putty',
            key: 'surfaceDriedReadyForPutty',
          },
          {
            title:
              'Whether the thickness of putty has been done as per the approved drawings',
            key: 'thicknessAsPerDrawing',
          },
          {
            title: 'Whether the surface finish is proper and uniform',
            key: 'surfaceFinishUniform',
          },
        ];

        return (
          <View>
            {puttyProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.puttyData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPuttyData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total putty work done in sqft"
              value={'' + _v.puttyData.totalPuttyWorkSqft}
              onChange={(value: any) =>
                _v.setPuttyData((prevData: any) => ({
                  ...prevData,
                  totalPuttyWorkSqft: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.HVAC_WORK:
        const hvacWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether inspection done and dispatch clearance obtained',
            key: 'inspectionAndDispatchCleared',
          },
          {
            title: 'Whether the site is ready prior to HVAC work',
            key: 'siteReadyForHVAC',
          },
          {
            title: 'Whether ducting is done as per the approved drawings',
            key: 'ductingAsPerDrawings',
          },
          {
            title:
              'Whether all the connection points are as per the approved drawings',
            key: 'connectionPointsAsPerDrawings',
          },
          {
            title: 'Whether AC fittings etc done as per the approved drawings',
            key: 'acFittingsAsPerDrawings',
          },
          {
            title:
              'Whether the entire system is tested properly and electrical certificate obtained',
            key: 'systemTestedAndCertified',
          },
        ];

        return (
          <View>
            {hvacWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.hvacWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setHvacWorkData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total sqft area covered under HVAC work"
              value={'' + _v.hvacWorkData.totalSqftAreaCovered}
              onChange={(value: any) =>
                _v.setHvacWorkData((prevData: any) => ({
                  ...prevData,
                  totalSqftAreaCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CEILING_WORK:
        const ceilingWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecifications',
          },
          {
            title: 'Whether the site is ready for ceiling work',
            key: 'siteReadyForCeilingWork',
          },
          {
            title:
              'Whether the finishing work of ceiling is proper and uniform',
            key: 'finishingWorkUniform',
          },
          {
            title:
              'Whether the ceiling work completed to the satisfaction of the site in charge',
            key: 'ceilingWorkCompletedToSatisfaction',
          },
        ];

        return (
          <View>
            {ceilingWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.ceilingWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setCeilingWorkData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total sqft area of ceiling work completed"
              value={'' + _v.ceilingWorkData.totalSqftAreaCompleted}
              onChange={(value: any) =>
                _v.setCeilingWorkData((prevData: any) => ({
                  ...prevData,
                  totalSqftAreaCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FURNITURE_WORK:
        const furnitureWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecs',
          },
          {
            title: 'Whether the site is ready for Furniture work',
            key: 'siteReadyForFurnitureWork',
          },
          {
            title: 'Whether the finishing furniture work is proper and uniform',
            key: 'finishingFurnitureProper',
          },
          {
            title:
              'Whether the furniture work completed to the satisfaction of the site in charge',
            key: 'workSatisfactoryToSiteInCharge',
          },
        ];

        return (
          <View>
            {furnitureWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.furnitureWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFurnitureWorkData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.DOOR_WORKS:
        const doorWorksProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpec',
          },
          {
            title: 'Whether the site is ready for Door work',
            key: 'siteReadyForDoorWork',
          },
          {
            title: 'Whether the finishing work is proper and uniform',
            key: 'finishingWorkProper',
          },
          {
            title:
              'Whether the work completed to the satisfaction of the site in charge',
            key: 'workSatisfactionAchieved',
          },
        ];

        return (
          <View>
            {doorWorksProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.doorWorksData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setDoorWorksData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.WINDOW_WORKS:
        const windowWorksProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecs',
          },
          {
            title: 'Whether the site is ready for Window work',
            key: 'siteReadyForWindowWork',
          },
          {
            title: 'Whether the finishing work is proper and uniform',
            key: 'finishingWorkProper',
          },
          {
            title:
              'Whether the work completed to the satisfaction of the site in charge',
            key: 'workCompletedToSatisfaction',
          },
        ];

        return (
          <View>
            {windowWorksProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.windowWorksData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setWindowWorksData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.GLASS_WORKS:
        const glassWorksProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecs',
          },
          {
            title:
              'Whether the quality and thickness of the glass is as per the desired specifications',
            key: 'glassQualityAndThicknessApproved',
          },
          {
            title: 'Whether the site is ready for Glass work',
            key: 'siteReadyForGlassWork',
          },
          {
            title: 'Whether the finishing work is proper and uniform',
            key: 'finishingWorkProper',
          },
          {
            title:
              'Whether the work completed to the satisfaction of the site in charge',
            key: 'workCompletedToSiteInChargeSatisfaction',
          },
        ];

        return (
          <View>
            {glassWorksProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.glassWorksData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setGlassWorksData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total glass work completed in sqft"
              value={'' + _v.glassWorksData.totalGlassWorkCompletedSqft}
              onChange={(value: any) =>
                _v.setGlassWorksData((prevData: any) => ({
                  ...prevData,
                  totalGlassWorkCompletedSqft: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ELECTRICAL_WORK:
        const electricalWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceived',
          },
          {
            title: 'Whether the site is ready for electrical work',
            key: 'siteReadyForWork',
          },
          {
            title: 'All safety arrangements are in place during the work',
            key: 'safetyArrangementsInPlace',
          },
          {
            title:
              'Whether the total no. of input/output points are given as per the drawings and Engineer’s decision',
            key: 'inputOutputPointsCorrect',
          },
          {
            title:
              'Whether the work completed to the satisfaction of the site in charge',
            key: 'workCompletedSatisfactorily',
          },
          {
            title:
              'Whether the work has been tested properly and certified by an authorized contractor',
            key: 'workTestedAndCertified',
          },
          {
            title:
              'Whether the copy of approved layout drawings placed in the building for future reference',
            key: 'layoutDrawingsPlacedForReference',
          },
        ];

        return (
          <View>
            {electricalWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.electricalWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setElectricalWorkData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total sqft area of the building completed"
              value={'' + _v.electricalWorkData.totalSqftCompleted}
              onChange={(value: any) =>
                _v.setElectricalWorkData((prevData: any) => ({
                  ...prevData,
                  totalSqftCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLUMBING_WORK:
        const plumbingWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceived',
          },
          {
            title: 'Whether the site is ready for Plumbing work',
            key: 'siteReady',
          },
          {
            title: 'All safety arrangements are in place during the work',
            key: 'safetyArrangementsInPlace',
          },
          {
            title:
              'Whether the total no. of input/ output points are given as per the drawings approved',
            key: 'inputOutputPointsGiven',
          },
          {
            title:
              'Whether the work completed to the satisfaction of the site in charge',
            key: 'workCompletedSatisfactorily',
          },
          {
            title: 'Whether the work has been tested properly',
            key: 'workTestedProperly',
          },
          {
            title:
              'Whether the copy of approved layout drawings placed in the building for future reference',
            key: 'approvedLayoutInBuilding',
          },
        ];

        return (
          <View>
            {plumbingWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.plumbingWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setPlumbingWorkData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total sqft area of the building completed"
              value={'' + _v.plumbingWorkData.totalSqftAreaCompleted}
              onChange={(value: any) =>
                _v.setPlumbingWorkData((prevData: any) => ({
                  ...prevData,
                  totalSqftAreaCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FLOORING_WORK:
        const flooringWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecs',
          },
          {
            title: 'Whether the site is ready for flooring work',
            key: 'siteReadyForFlooring',
          },
          {
            title:
              'Whether the finishing work of flooring work is proper and uniform',
            key: 'finishingWorkProper',
          },
          {
            title:
              'Whether slope is properly checked and is as per the requirement',
            key: 'slopeCheckedAsRequired',
          },
          {
            title:
              'Whether the flooring work completed to the satisfaction of the site in charge',
            key: 'workCompletedToSatisfaction',
          },
        ];

        return (
          <View>
            {flooringWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.flooringWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setFlooringWorkData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total sqft area of flooring work completed"
              value={'' + _v.flooringWorkData.totalSqftAreaCompleted}
              onChange={(value: any) =>
                _v.setFlooringWorkData((prevData: any) => ({
                  ...prevData,
                  totalSqftAreaCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.EXCAVATION_OF_TRENCH:
        const excavationProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the safety arrangements are in place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title:
              'Whether the layout marked at site for ensuring the alignment',
            key: 'layoutMarked',
          },
          {
            title:
              'It has been ensured that there is no utility in the alignment',
            key: 'noUtilityInAlignment',
          },
          {
            title: 'Whether the depth and width are as per drawings',
            key: 'depthWidthAsPerDrawing',
          },
          {
            title: 'Whether the excavated area has been covered properly',
            key: 'areaCoveredProperly',
          },
        ];

        return (
          <View>
            {excavationProperties.map(property => (
              <DropdownPicker
                label={property.title}
                value={_v.excavationOfTrenchData[property.key]}
                items={YES_NO_LIST}
                onChange={(value: any) =>
                  _v.setExcavationOfTrenchData(prev => ({
                    ...prev,
                    [property.key]: value,
                  }))
                }
                isRequired={true}
              />
            ))}
            <Input
              label="Total length of trench excavated properly"
              value={'' + _v.excavationOfTrenchData.totalLengthExcavated}
              onChange={(value: any) =>
                _v.setExcavationOfTrenchData(prev => ({
                  ...prev,
                  totalLengthExcavated: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total quantity of earth excavated"
              value={'' + _v.excavationOfTrenchData.totalQtyEarthExcavated}
              onChange={(value: any) =>
                _v.setExcavationOfTrenchData(prev => ({
                  ...prev,
                  totalQtyEarthExcavated: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_DUCT:
        const layingOfDuctProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the safety arrangements are in place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Whether the source of material obtained',
            key: 'sourceMaterialObtained',
          },
          {
            title:
              'Whether material reached at site is not damaged and as per the design specifications',
            key: 'materialNotDamaged',
          },
          {
            title:
              'Whether the ducts laid properly in the trench with all the safety precautions',
            key: 'ductsLaidProperly',
          },
          {
            title: 'Whether all joints are completed properly',
            key: 'jointsCompletedProperly',
          },
        ];

        return (
          <View>
            {layingOfDuctProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.layingOfDuctData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setLayingOfDuctData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total length of duct laid in RM"
              value={'' + _v.layingOfDuctData.totalLengthOfDuctLaid}
              onChange={(value: any) =>
                _v.setLayingOfDuctData((prevData: any) => ({
                  ...prevData,
                  totalLengthOfDuctLaid: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.HDD_CROSSING:
        const hddCrossingProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the safety arrangements are in place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title:
              'Whether the layout marked at site for ensuring the alignment of the HDD crossing',
            key: 'layoutMarkedAtSite',
          },
          {
            title: 'Whether the route marking device available at site',
            key: 'routeMarkingDeviceAvailable',
          },
          {
            title:
              'Whether the depth and alignment is as per the approved drawings',
            key: 'depthAlignmentAsPerDrawings',
          },
          {
            title: 'Whether the excavated area has been covered properly',
            key: 'excavatedAreaCoveredProperly',
          },
          {
            title: 'Whether the duct/pipe pulled successfully',
            key: 'ductPipePulledSuccessfully',
          },
        ];

        return (
          <View>
            {hddCrossingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.hddCrossingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setHddCrossingData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total length of HDD crossing"
              value={'' + _v.hddCrossingData.totalLengthOfHddCrossing}
              onChange={(value: any) =>
                _v.setHddCrossingData((prevData: any) => ({
                  ...prevData,
                  totalLengthOfHddCrossing: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CONSTRUCTION_OF_CHAMBER:
        const constructionOfChamberProperties = [
          {
            title: 'Are the latest "Good for Construction" drawings available',
            key: 'drawingsAvailable',
          },
          {
            title: 'Are the size and Class of bricks as per approved drawing',
            key: 'sizeClassOfBricksApproved',
          },
          {
            title: 'Are the required number of blocks available',
            key: 'requiredBlocksAvailable',
          },
          {
            title:
              'Has the hacking at contact surfaces of columns and beams been done',
            key: 'hackingDone',
          },
          {
            title: 'Has cement mortar slurry been applied and cured for 3 days',
            key: 'cementSlurryCured',
          },
          {
            title:
              'Have aluminium templates been used for door/window openings',
            key: 'aluminiumTemplatesUsed',
          },
          {
            title: 'Are the required tools available',
            key: 'requiredToolsAvailable',
          },
          {
            title: 'Are there any specific requirements from the client',
            key: 'specificClientRequirements',
          },
        ];

        return (
          <View>
            {constructionOfChamberProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.constructionOfChamberData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setConstructionOfChamberData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total area where brick work is to be done (Sqm)"
              value={'' + _v.constructionOfChamberData.totalBrickworkAreaSqm}
              onChange={(value: any) =>
                _v.setConstructionOfChamberData((prevData: any) => ({
                  ...prevData,
                  totalBrickworkAreaSqm: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total brick work in cum"
              value={'' + _v.constructionOfChamberData.totalBrickworkVolumeCum}
              onChange={(value: any) =>
                _v.setConstructionOfChamberData((prevData: any) => ({
                  ...prevData,
                  totalBrickworkVolumeCum: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.INSTALLATION_OF_EQUIPMENT:
        const installationOfEquipmentProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the equipment inspected at site with factory clearance',
            key: 'equipmentInspected',
          },
          {
            title:
              'Is there any damage to the equipment? If yes, informed to the vendor',
            key: 'damageReportedToVendor',
          },
          {
            title: 'Whether factory inspection done and clearance obtained',
            key: 'factoryInspectionCleared',
          },
          {
            title: 'Is the foundation work ready for installation?',
            key: 'foundationWorkReady',
          },
          {
            title: 'Have concrete components achieved required strength?',
            key: 'foundationStrengthAchieved',
          },
          {
            title: 'Installation methodology approved?',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Are all safety arrangements in place?',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Is there sufficient machinery and manpower available?',
            key: 'sufficientMachineryManpower',
          },
          {
            title: 'Installation completed as planned?',
            key: 'installationCompletedAsPlanned',
          },
          {
            title: 'All manufacturer instructions followed?',
            key: 'manufacturerInstructionsComplied',
          },
        ];

        return (
          <View>
            {installationOfEquipmentProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.installationOfEquipmentData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setInstallationOfEquipmentData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of equipment installed"
              value={
                '' + _v.installationOfEquipmentData.totalEquipmentInstalled
              }
              onChange={(value: any) =>
                _v.setInstallationOfEquipmentData((prevData: any) => ({
                  ...prevData,
                  totalEquipmentInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.INSTALLATION_OF_SOLAR_SYSTEM:
        const installationOfSolarSystemProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether all equipment inspected at the factory',
            key: 'equipmentInspectedAtFactory',
          },
          {
            title: 'Any damage to equipment, informed to vendor',
            key: 'damageReportedToVendor',
          },
          {
            title: 'Factory inspection done, dispatch clearance obtained',
            key: 'factoryInspectionAndDispatchClearance',
          },
          {
            title: 'Installation methodology approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'All safety arrangements in place prior to installation',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient machinery and manpower available',
            key: 'machineryAndManpowerAvailable',
          },
          {
            title: 'Installation completed as per methodology',
            key: 'installationCompleted',
          },
          {
            title: 'Manufacturer instructions complied during installation',
            key: 'manufacturerInstructionsComplied',
          },
        ];

        return (
          <View>
            {installationOfSolarSystemProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.installationOfSolarSystemData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setInstallationOfSolarSystemData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Number of Solar Systems Installed"
              value={
                '' + _v.installationOfSolarSystemData.totalSolarSystemsInstalled
              }
              onChange={(value: any) =>
                _v.setInstallationOfSolarSystemData((prevData: any) => ({
                  ...prevData,
                  totalSolarSystemsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.INSTALLATION_OF_NETWORK_DEVICES:
        const installationProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the devices inspected at the factory',
            key: 'devicesInspected',
          },
          {
            title:
              'Is there any damage to any device? If yes, informed vendor?',
            key: 'damageReported',
          },
          {
            title: 'Installation methodology approved',
            key: 'methodologyApproved',
          },
          {
            title: 'All safety arrangements in place before installation?',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient machinery and manpower available at site?',
            key: 'machineryAndManpowerAvailable',
          },
          {
            title: 'Installation completed as per the approved methodology',
            key: 'installationCompleted',
          },
          {
            title: 'Manufacturer’s instructions complied during installation',
            key: 'instructionsComplied',
          },
        ];

        return (
          <View>
            {installationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.installationOfNetworkDevicesData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setInstallationOfNetworkDevicesData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Number of Devices Installed"
              value={_v.installationOfNetworkDevicesData.devicesInstalled}
              onChange={(value: any) =>
                _v.setInstallationOfNetworkDevicesData((prevData: any) => ({
                  ...prevData,
                  devicesInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CONSTRUCTION_OF_FOUNDATION:
        if (!_v.foundationData || !_v.foundationData.length) {
          _v.setFoundationData([
            {
              gradeOfConcrete: '',
              slumpValue: 0,
              concreteStartTime: '',
              concretePoured: 0,
              concreteFinishTime: '',
              totalFoundationCasted: 0,
              key: Guid.create(),
            },
          ]);
        }
        const constructionOfFoundationProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the pit excavated at the approved location',
            key: 'pitExcavatedAtApprovedLocation',
          },
          {
            title:
              'Whether the pits have been excavated as per the approved drawings',
            key: 'pitsExcavatedAsPerDrawings',
          },
          {
            title:
              'Whether the reinforcement has been placed properly as per the approved BBS',
            key: 'reinforcementPlacedProperly',
          },
          {
            title: 'Whether the formwork/shuttering checked properly',
            key: 'formworkCheckedProperly',
          },
        ];

        return (
          <View>
            {constructionOfFoundationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.constructionOfFoundationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setConstructionOfFoundationData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total weight of reinforcement in Kg per foundation"
              value={
                '' + _v.constructionOfFoundationData.totalWeightReinforcementKg
              }
              onChange={(value: any) =>
                _v.setConstructionOfFoundationData((prevData: any) => ({
                  ...prevData,
                  totalWeightReinforcementKg: value,
                }))
              }
              isRequired={true}
            />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View>
                {renderFoundationHeadings()}
                <FlatList
                  data={_v.foundationData}
                  renderItem={renderItemFoundation}
                  keyExtractor={item => item.key.toString()}
                  style={{zIndex: 10}}
                  automaticallyAdjustContentInsets={true}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => _v.onAddComstructionOfFoundation()}>
              <Text>+ Add More</Text>
            </TouchableOpacity>
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CASTING_OF_BALLAST:
        if (!_v.ballastData || !_v.ballastData.length) {
          _v.setBallastData([
            {
              gradeOfConcrete: '',
              slumpValue: 0,
              concreteStartTime: '',
              concretePoured: 0,
              concreteFinishTime: '',
              totalBallastCasted: 0,
              key: Guid.create(),
            },
          ]);
        }

        const castingOfBallastProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the moulds are finished and ready for concreting',
            key: 'mouldsReady',
          },
          {
            title:
              'In case of reinforcement or mess in the ballast, the same has been tied in the mould properly',
            key: 'reinforcementTiedProperly',
          },
        ];

        return (
          <View>
            {castingOfBallastProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.castingOfBallastData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setCastingOfBallastData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total weight of reinforcement/mess in Kg per ballast"
              value={'' + _v.castingOfBallastData.totalReinforcementWeightKg}
              onChange={(value: any) =>
                _v.setCastingOfBallastData((prevData: any) => ({
                  ...prevData,
                  totalReinforcementWeightKg: value,
                }))
              }
              isRequired={true}
            />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View>
                {renderBallastHeadings()}
                <FlatList
                  data={_v.foundationData}
                  renderItem={renderItemBallast}
                  keyExtractor={item => item.key.toString()}
                  style={{zIndex: 10}}
                  automaticallyAdjustContentInsets={true}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => _v.onAddBallastItem()}>
              <Text>+ Add More</Text>
            </TouchableOpacity>
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.SAND_LAYER:
        const sandLayerProperties = [
          {title: 'Whether the drawings approved', key: 'drawingsApproved'},
          {
            title: 'Whether the safety arrangements are in place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Whether the source of sand approved',
            key: 'sourceOfSandApproved',
          },
          {
            title:
              'Whether the thickness of sand layer laid is as per the approved drawings',
            key: 'thicknessAsPerDrawings',
          },
          {
            title: 'Whether the excavated area has been covered properly',
            key: 'excavatedAreaCovered',
          },
        ];

        return (
          <View>
            {sandLayerProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={_v.sandLayerData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    _v.setSandLayerData((prevData: any) => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total length of trench covered by sand layer"
              value={'' + _v.sandLayerData.totalLengthTrenchCovered}
              onChange={(value: any) =>
                _v.setSandLayerData((prevData: any) => ({
                  ...prevData,
                  totalLengthTrenchCovered: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total quantity of sand filled in cum"
              value={'' + _v.sandLayerData.totalQtySandFilled}
              onChange={(value: any) =>
                _v.setSandLayerData((prevData: any) => ({
                  ...prevData,
                  totalQtySandFilled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={_v.rfiDate}
                onChange={date => _v.setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={'' + _v.rfiTime}
                onChange={time => _v.setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={_v.comments}
                onChangeText={text => _v.setComments(text)}
              />
            </View>
          </View>
        );

      case TASK_TYPES.LIFTING_LEFT:
      case TASK_TYPES.LIFTING_YARD:
      case TASK_TYPES.LIFTING_RIGHT:
      case TASK_TYPES.LIFTING_TRANSPORT_ERECTION:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <Text style={styles.headerText}>
                Preparation of Area for Lifting at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={_v.liftingCombinedLRData.areaBarricaded}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('areaBarricaded', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={_v.liftingCombinedLRData.temporaryLights}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('temporaryLights', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={_v.liftingCombinedLRData.flagManAvailable}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('flagManAvailable', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={_v.liftingCombinedLRData.liftingMethodology}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('liftingMethodology', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>
                Tools and Tackles for Lifting at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={_v.liftingCombinedLRData.deshacklesTestCertificate}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'deshacklesTestCertificate',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={_v.liftingCombinedLRData.safetyColorCode}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('safetyColorCode', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={_v.liftingCombinedLRData.hydraulicJacksCondition}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'hydraulicJacksCondition',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={_v.liftingCombinedLRData.hoistLimitSwitch}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('hoistLimitSwitch', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={_v.liftingCombinedLRData.cotterPinsPlaced}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('cotterPinsPlaced', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={_v.liftingCombinedLRData.macalloyBarsCondition}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('macalloyBarsCondition', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>
                Lifting of Segment at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Work at height permit obtained from IE/concerned agency"
                  value={_v.liftingCombinedLRData.heightPermitObtained}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('heightPermitObtained', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Mac-alloy bars and wire rope assemblies have valid third-party test certificate"
                  value={_v.liftingCombinedLRData.macalloyBarsTestCertificate}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'macalloyBarsTestCertificate',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting sequence as per the approved methodology provided at site for counter"
                  value={_v.liftingCombinedLRData.liftingSequence}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('liftingSequence', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting holes are in proper location as per approved drawing"
                  value={_v.liftingCombinedLRData.liftingHolesLocation}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('liftingHolesLocation', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements are working properly"
                  value={_v.liftingCombinedLRData.liftingArrangementsWorking}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'liftingArrangementsWorking',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Pre-stressing duct of segments are clear of any foreign materials"
                  value={_v.liftingCombinedLRData.preStressingDuctsClear}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('preStressingDuctsClear', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Comprehensive Strength of concrete of wings are gained as per the approved drawing"
                  value={_v.liftingCombinedLRData.concreteStrengthGained}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('concreteStrengthGained', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Slider trolley is in proper position"
                  value={_v.liftingCombinedLRData.sliderTrolleyPosition}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('sliderTrolleyPosition', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Segment Dispatch and Transportation
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sand blasting on match cast face done"
                  value={_v.liftingCombinedLRData.sandBlastingDone}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('sandBlastingDone', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Repairing (if necessary) & finishing done"
                  value={_v.liftingCombinedLRData.repairingFinished}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('repairingFinished', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="No repairing on shearkey & gluing location"
                  value={_v.liftingCombinedLRData.noRepairsOnShearkey}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('noRepairsOnShearkey', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Bund for curing at top removed & top to be cleaned by broom"
                  value={_v.liftingCombinedLRData.bundRemoved}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('bundRemoved', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Soffit & deck top cleaned by broomer"
                  value={_v.liftingCombinedLRData.soffitDeckCleaned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('soffitDeckCleaned', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct is cleaned, no concrete at rubber bunk portion"
                  value={_v.liftingCombinedLRData.sheathingDuctCleaned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('sheathingDuctCleaned', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct alignment ok, checked by drolly passing"
                  value={_v.liftingCombinedLRData.ductAlignmentChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('ductAlignmentChecked', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary stressing hole at soffit cleaned & dimension checked"
                  value={_v.liftingCombinedLRData.temporaryStressingHoleCleaned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('stressingHoleCleaned', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Fitness of Trailer with proper calibration certificate"
                  value={_v.liftingCombinedLRData.trailerFitnessChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('trailerFitnessChecked', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Tyres of trailer and air pressure checked"
                  value={_v.liftingCombinedLRData.trailerTyresChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('trailerTyresChecked', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Preparation of Area for Lifting at Erection Site
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground properly leveled for placement of trailer"
                  value={_v.liftingCombinedLRData.groundLeveled}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('groundLeveled', value)
                  }
                />
              </View>
              {/* E) Preparation of Area for Lifting at Erection Site */}
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground properly leveled for placement of trailer"
                  value={_v.liftingCombinedLRData.groundLeveled}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('groundLeveled', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={_v.liftingCombinedLRData.areaBarricadedErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'areaBarricadedErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={_v.liftingCombinedLRData.temporaryLightsErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'temporaryLightsErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={_v.liftingCombinedLRData.flagManAvailableErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'flagManAvailableErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={
                    _v.liftingCombinedLRData.liftingMethodologyErectionSite
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'liftingMethodologyErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Crane is positioned as per drawing"
                  value={_v.liftingCombinedLRData.cranePositioned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('cranePositioned', value)
                  }
                />
              </View>

              {/* F) Tools and Tackles for lifting at Erection Site */}
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={
                    _v.liftingCombinedLRData
                      .deshacklesTestCertificateErectionSite
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'deshacklesTestCertificateErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={_v.liftingCombinedLRData.safetyColorCodeErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'safetyColorCodeErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={
                    _v.liftingCombinedLRData.hydraulicJacksConditionErectionSite
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'hydraulicJacksConditionErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={_v.liftingCombinedLRData.hoistLimitSwitchErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'hoistLimitSwitchErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={_v.liftingCombinedLRData.cotterPinsPlacedErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'cotterPinsPlacedErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={
                    _v.liftingCombinedLRData.macalloyBarsConditionErectionSite
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'macalloyBarsConditionErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="TPI of all parts of Cranes & Slings done"
                  value={_v.liftingCombinedLRData.cranesTPICompleted}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('cranesTPICompleted', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Latest TPI Certificates of all parts of Cranes & Slings available at Site"
                  value={
                    _v.liftingCombinedLRData.cranesTPICertificatesAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'cranesTPICertificatesAvailable',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Counter-weights are available & placed as per drawing"
                  value={_v.liftingCombinedLRData.counterWeightsPlaced}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('counterWeightsPlaced', value)
                  }
                />
              </View>

              {/* G) Lifting and Positioning of segments */}
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Positioning of segment marked"
                  value={_v.liftingCombinedLRData.positioningOfSegmentMarked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'positioningOfSegmentMarked',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Traffic properly diverted & Traffic marshals are in place"
                  value={_v.liftingCombinedLRData.trafficDiverted}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('trafficDiverted', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety & Fitness of all workers working at height checked and certified"
                  value={_v.liftingCombinedLRData.workersSafetyChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('workersSafetyChecked', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Safety arrangements are placed at Site"
                  value={_v.liftingCombinedLRData.safetyArrangementsPlaced}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting(
                      'safetyArrangementsPlaced',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Segments positioned at the specified / marked location"
                  value={_v.liftingCombinedLRData.segmentPositioned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('segmentPositioned', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Necessary lateral / Site support ensured before releasing the segment by Cranes"
                  value={_v.liftingCombinedLRData.lateralSupportEnsured}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleInputChangeLifting('lateralSupportEnsured', value)
                  }
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <View style={{flexDirection: 'column'}}>
                  <CalendarPicker
                    label="Date"
                    value={_v.rfiDate}
                    onChange={date => _v.setRFIDate(date)}
                  />
                </View>
                <View>
                  <TimePicker
                    label="Time"
                    value={'' + _v.rfiTime}
                    onChange={time => _v.setRFITime(time)}
                  />
                </View>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        );
      case TASK_TYPES.GROUTING:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Inlet free of blockage"
                value={_v.groutingData.inletFree}
                items={YES_NO_NA_LIST}
                onChange={(newValue: string) => {
                  _v.handleInputChangeGrouting('inletFree', newValue);
                }}
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Outlet free of blockage"
                value={_v.groutingData.outletFree}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeGrouting('outletFree', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Vents free of blockage"
                value={_v.groutingData.ventsFree}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeGrouting('ventsFree', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Cable Duct free of blockage"
                value={_v.groutingData.cableDuctFree}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeGrouting('cableDuctFree', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Leakage observed"
                value={_v.groutingData.leakageObserved}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeGrouting('leakageObserved', value)
                }
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Sealed"
                value={_v.groutingData.sealed}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeGrouting('sealed', value)
                }
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="If cable duct blocked remedial measures taken"
                value={_v.groutingData.remedialMeasures}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  _v.handleInputChangeGrouting('remedialMeasures', value)
                }
              />
            </View>
            <Text style={styles.HeadText}>Details of Grouting</Text>
            <CalendarPicker
              label="Last Date of prestressing"
              value={_v.groutingData.prestressingDate}
              onChange={date =>
                _v.handleInputChangeGrouting('prestressingDate', date)
              }
            />
            <CalendarPicker
              label="Date of Grouting"
              value={_v.groutingData.groutingDate}
              onChange={date =>
                _v.handleInputChangeGrouting('groutingDate', date)
              }
            />
            <DropdownPicker
              label="Type of cement"
              value={_v.groutingData.cementType}
              items={CEMENT_TYPE_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('cementType', value)
              }
            />
            <Input
              label="W/c Ratio"
              value={'' + _v.groutingData.wcRatio}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('wcRatio', value)
              }
              isRequired={true}
            />
            <Input
              label="Temperature of mixing water (°C)"
              value={'' + _v.groutingData.mixingWaterTemp}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('mixingWaterTemp', value)
              }
              isRequired={true}
            />
            <Input
              label="Temperature of Grout (°C)"
              value={'' + _v.groutingData.groutTemp}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('groutTemp', value)
              }
              isRequired={true}
            />
            <TimePicker
              label="Start Time"
              value={'' + _v.groutingData.startTime}
              onChange={time => _v.handleInputChangeGrouting('startTime', time)}
            />
            <TimePicker
              label="Finish Time"
              value={'' + _v.groutingData.finishTime}
              onChange={time =>
                _v.handleInputChangeGrouting('finishTime', time)
              }
            />
            <Input
              label="Volume of Grout (Ltr)"
              value={'' + _v.groutingData.volumeOfGrout}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('volumeOfGrout', value)
              }
              isRequired={true}
            />
            <Input
              label="Grouting Pressure (Kg/cm²)"
              value={'' + _v.groutingData.groutingPressure}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('groutingPressure', value)
              }
              isRequired={true}
            />
            <Input
              label="Cement consumption theoretical"
              value={'' + _v.groutingData.cementConsumptionTheoretical}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting(
                  'cementConsumptionTheoretical',
                  value,
                )
              }
              isRequired={true}
            />
            <Input
              label="Cement consumption actual"
              value={'' + _v.groutingData.cementConsumptionActual}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('cementConsumptionActual', value)
              }
              isRequired={true}
            />
            <DropdownPicker
              label="Passage of grout through vents"
              value={_v.groutingData.passageThroughVents}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('passageThroughVents', value)
              }
            />
            <DropdownPicker
              label="Passage of grout through outlet"
              value={_v.groutingData.passageThroughOutlet}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('passageThroughOutlet', value)
              }
            />
            <DropdownPicker
              label="Any equipment failure"
              value={_v.groutingData.equipmentFailure}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('equipmentFailure', value)
              }
            />
            <DropdownPicker
              label="Probing by Stiffwire"
              value={_v.groutingData.probingByStiffwire}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                _v.handleInputChangeGrouting('probingByStiffwire', value)
              }
            />

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.CURING:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Water used for curing is free from oil, salt, acid and organic minerals."
                  value={_v.curingData.waterUsedForCuring}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleCuring('waterUsedForCuring', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="pH value of water not be less than 6."
                  value={_v.curingData.waterUsedForCuring}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleCuring('phValueOfWater', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <Input
                  label="Consumption of water in Kilo liter"
                  value={'' + _v.curingData.consumptionOfWater}
                  onChange={(value: string) =>
                    _v.handleCuring('consumptionOfWater', value)
                  }
                />
              </View>
              <View>
                <View style={{flexDirection: 'column'}}>
                  <CalendarPicker
                    label="Date"
                    value={_v.rfiDate}
                    onChange={date => _v.setRFIDate(date)}
                  />
                </View>
                <View>
                  <TimePicker
                    label="Time"
                    value={'' + _v.rfiTime}
                    onChange={time => _v.setRFITime(time)}
                  />
                </View>

                <View style={{flexDirection: 'column', paddingBottom: 20}}>
                  <Text style={styles.Lable}>Recommendations</Text>
                  <TextInput
                    style={styles.commonInputFiels}
                    placeholder="Recommendations"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    underlineColorAndroid="#f000"
                    multiline={true}
                    numberOfLines={4}
                    blurOnSubmit={false}
                    value={_v.comments}
                    onChangeText={text => {
                      _v.setComments(text);
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case TASK_TYPES.FIXING_OF_SHUTTER:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Shuttering material is New"
                  value={_v.fixingShutterData.shutterMaterial}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('shutterMaterial', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Repairs are ok"
                  value={_v.fixingShutterData.repairsAreOf}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('repairsAreOf', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cleanliness of shuttering"
                  value={_v.fixingShutterData.cleanlinessOfShutter}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('cleanlinessOfShutter', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Oiling of shuttering"
                  value={_v.fixingShutterData.oilingOfShutter}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('oilingOfShutter', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Shuttering design, ok? (Dimension, Diagonal, Sunken portion etc.)"
                  value={_v.fixingShutterData.shutterDesignOk}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('shutterDesignOk', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Alignments /levels /rigidity, ok"
                  value={_v.fixingShutterData.alignmentLevelsRigidity}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('alignmentLevelsRigidity', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Check props are they ok"
                  value={_v.fixingShutterData.checkPropsAreTheyOk}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('checkPropsAreTheyOk', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Check acrow span. Are they ok"
                  value={_v.fixingShutterData.checkAcrowSapnAreTheyOk}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('checkAcrowSapnAreTheyOk', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Check braces. Are they ok"
                  value={_v.fixingShutterData.checkBracesAreTheyOk}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('checkBracesAreTheyOk', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Check sealing joints/holes, ok"
                  value={_v.fixingShutterData.checkSealingJointsHoles}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleFixingShutter('checkSealingJointsHoles', value)
                  }
                />
              </View>
              <View>
                <View style={{flexDirection: 'column'}}>
                  <CalendarPicker
                    label="Date"
                    value={_v.rfiDate}
                    onChange={date => _v.setRFIDate(date)}
                  />
                </View>
                <View>
                  <TimePicker
                    label="Time"
                    value={'' + _v.rfiTime}
                    onChange={time => _v.setRFITime(time)}
                  />
                </View>

                <View style={{flexDirection: 'column', paddingBottom: 20}}>
                  <Text style={styles.Lable}>Recommendations</Text>
                  <TextInput
                    style={styles.commonInputFiels}
                    placeholder="Recommendations"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    underlineColorAndroid="#f000"
                    multiline={true}
                    numberOfLines={4}
                    blurOnSubmit={false}
                    value={_v.comments}
                    onChangeText={text => {
                      _v.setComments(text);
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case TASK_TYPES.ERECTION_OF_TEMPORARY_STRUCTURE:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Has any risk assessment been carried out"
                  value={_v.erectionOfTemporaryStructure.hasAnyRiskAssessment}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'hasAnyRiskAssessment',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the crane/hydra on firm level bases"
                  value={_v.erectionOfTemporaryStructure.craneHydraLevelBase}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'craneHydraLevelBase',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are all operation trained and competent"
                  value={_v.erectionOfTemporaryStructure.areAllOperationTrained}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'areAllOperationTrained',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is crane tested and operated"
                  value={_v.erectionOfTemporaryStructure.isCraneTested}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'isCraneTested',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Does the crane have a current test certificate"
                  value={
                    _v.erectionOfTemporaryStructure.doesTheCraneCertificate
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'doesTheCraneCertificate',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All lifting tools and tackles are being identified, checked and have valid resister"
                  value={
                    _v.erectionOfTemporaryStructure.allLiftingToolsAndTackles
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'allLiftingToolsAndTackles',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="The person working at height are trained and lash with all fall protection devices"
                  value={_v.erectionOfTemporaryStructure.protectionDevices}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'protectionDevices',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Structure on which columns / beams erected have attained their strength"
                  value={_v.erectionOfTemporaryStructure.atteainedTheirStrength}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'atteainedTheirStrength',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Workmen provided with all required PPE’s"
                  value={_v.erectionOfTemporaryStructure.workmenProvided}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'workmenProvided',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Whether sufficient illumination is provided around the working area"
                  value={_v.erectionOfTemporaryStructure.whetherSufficient}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'whetherSufficient',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the SWL marked on all lifting tools & tackles"
                  value={_v.erectionOfTemporaryStructure.liftingToolsTackles}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'liftingToolsTackles',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All wielding machine, electrical equipment’s & generators properly earthed."
                  value={
                    _v.erectionOfTemporaryStructure
                      .equipmentsGeneratorsProperlyEarthed
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'equipmentsGeneratorsProperlyEarthed',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the walkway maintained free from obstacle all the time."
                  value={
                    _v.erectionOfTemporaryStructure.walkwayMaintainedFreeForm
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'walkwayMaintainedFreeForm',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is safety latch/locking available"
                  value={
                    _v.erectionOfTemporaryStructure.safetyLatchLockingAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'safetyLatchLockingAvailable',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Proper warning sign available at site."
                  value={_v.erectionOfTemporaryStructure.properWarningSign}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'properWarningSign',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements are approved by competent person"
                  value={
                    _v.erectionOfTemporaryStructure
                      .liftingArrangementsAreApproved
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'liftingArrangementsAreApproved',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is footing above temp. structure fixed achieve their compressive strength"
                  value={
                    _v.erectionOfTemporaryStructure
                      .achieveTheirCompressiveStrength
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'achieveTheirCompressiveStrength',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground leveling"
                  value={_v.erectionOfTemporaryStructure.groundLeveling}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'groundLeveling',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is Structure set out to the required line and levels."
                  value={
                    _v.erectionOfTemporaryStructure.structureSetOutToTheLevels
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'structureSetOutToTheLevels',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="For welding, is welder qualification and skilled checked and certified"
                  value={
                    _v.erectionOfTemporaryStructure
                      .aualificationAndSkilledCheckedAndCertified
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleErectionOfTemporaryStructure(
                      'aualificationAndSkilledCheckedAndCertified',
                      value,
                    )
                  }
                />
              </View>
              <View>
                <View style={{flexDirection: 'column'}}>
                  <CalendarPicker
                    label="Date"
                    value={_v.rfiDate}
                    onChange={date => _v.setRFIDate(date)}
                  />
                </View>
                <View>
                  <TimePicker
                    label="Time"
                    value={'' + _v.rfiTime}
                    onChange={time => _v.setRFITime(time)}
                  />
                </View>

                <View style={{flexDirection: 'column', paddingBottom: 20}}>
                  <Text style={styles.Lable}>Recommendations</Text>
                  <TextInput
                    style={styles.commonInputFiels}
                    placeholder="Recommendations"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    underlineColorAndroid="#f000"
                    multiline={true}
                    numberOfLines={4}
                    blurOnSubmit={false}
                    value={_v.comments}
                    onChangeText={text => {
                      _v.setComments(text);
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case TASK_TYPES.PAINTING_OF_STEEL_GIRDERS_DIAPHRAGMS:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is equipment regular inspected"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.hasAnyRiskAssessment
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'hasAnyRiskAssessment',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the worker worn Personal Protective Equipment"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .isWorkerWarnPersonalProtective
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'isWorkerWarnPersonalProtective',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the personal present at the Blasting Pot and compressor at all times"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.presentAtBlastingPot
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'presentAtBlastingPot',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is every structural member released for painting having identification Tag"
                  value={_v.paintingOfSteelGirdersDiaphragms.identificationTag}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'identificationTag',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the surface checking prior to blasting for mechanical damages (like spatters, slag’s etc.)"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .surfaceCheckPriorBlasting
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'surfaceCheckPriorBlasting',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the surface free from oil, grease and other contamination"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .surfaceFreeFromContamination
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'surfaceFreeFromContamination',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the weather and temperature suitable for blasting"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .suitableWeatherForBlasting
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'suitableWeatherForBlasting',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the compressed air free from water, oil etc."
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.compressedAirQuality
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'compressedAirQuality',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the areas of member protected that not to be blasted"
                  value={_v.paintingOfSteelGirdersDiaphragms.protectedAreas}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'protectedAreas',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is there high-pressure water used to remove salt and other contaminations"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.highPressureWaterUsage
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'highPressureWaterUsage',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the abrasive used as per the required specification (No reuse of abrasives in open Blast condition)"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.abrasiveSpecification
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'abrasiveSpecification',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the copy of batch certificate of abrasive used available at the factory"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .batchCertificateAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'batchCertificateAvailable',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Blasting Nozzle Pressure checked"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.nozzlePressureChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'nozzlePressureChecked',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the all-blasted surface inspected for proper cleaning"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.inspectedForCleaning
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'inspectedForCleaning',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Visually checked for any mechanical damage/ lamination"
                  value={_v.paintingOfSteelGirdersDiaphragms.visualCheckDamage}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'visualCheckDamage',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Blasted structural member shifted carefully without damage"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.shiftedWithoutDamage
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'shiftedWithoutDamage',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the surrounding areas covered to prevent overspray"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.surroundingAreaCovered
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'surroundingAreaCovered',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the painting system as per specification"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .paintingSystemSpecification
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'paintingSystemSpecification',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Paint mixed and prepared in accordance with the approved manufacturer instructions"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .paintMixedAsPerInstructions
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'paintMixedAsPerInstructions',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the TIP size and spraying procedure adhered"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.tipSizeSprayingProcedure
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'tipSizeSprayingProcedure',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Solvent dilution accordance with the manufacturer instruction and recommendation"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .solventDilutionAccordance
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'solventDilutionAccordance',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the required areas striped before applying paints"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .areasStripedBeforePainting
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'areasStripedBeforePainting',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the paints, curing agent, Thinner used of within the shelf life and from the same manufacturer"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.materialsWithinShelfLife
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'materialsWithinShelfLife',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the weather condition checked prior to painting"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.weatherConditionChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'weatherConditionChecked',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the paint applied as per specification and related paint system"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .paintAppliedPerSpecification
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'paintAppliedPerSpecification',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the paint mixed, agitated and applied within the specified pot life"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.paintMixedWithinPotLife
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'paintMixedWithinPotLife',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the paint applied having even coating thickness at the overlapping passes to achieve the specified dry film thickness"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.evenCoatingThickness
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'evenCoatingThickness',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the WFT checked for required DFT"
                  value={_v.paintingOfSteelGirdersDiaphragms.wftCheckedForDft}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'wftCheckedForDft',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the overcoating interval maintained as per requirement"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .overcoatingIntervalMaintained
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'overcoatingIntervalMaintained',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the proper coating system applied during intervals"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms
                      .properCoatingSystemApplied
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'properCoatingSystemApplied',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the paint surface visually good and free from runs, sags, wrinkles etc.…"
                  value={
                    _v.paintingOfSteelGirdersDiaphragms.paintSurfaceQuality
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'paintSurfaceQuality',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the record maintained of painting"
                  value={_v.paintingOfSteelGirdersDiaphragms.recordMaintained}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePaintingOfSteelGirdersDiaphragms(
                      'recordMaintained',
                      value,
                    )
                  }
                />
              </View>

              <View>
                <View style={{flexDirection: 'column'}}>
                  <CalendarPicker
                    label="Date"
                    value={_v.rfiDate}
                    onChange={date => _v.setRFIDate(date)}
                  />
                </View>
                <View>
                  <TimePicker
                    label="Time"
                    value={'' + _v.rfiTime}
                    onChange={time => _v.setRFITime(time)}
                  />
                </View>

                <View style={{flexDirection: 'column', paddingBottom: 20}}>
                  <Text style={styles.Lable}>Recommendations</Text>
                  <TextInput
                    style={styles.commonInputFiels}
                    placeholder="Recommendations"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    underlineColorAndroid="#f000"
                    multiline={true}
                    numberOfLines={4}
                    blurOnSubmit={false}
                    value={_v.comments}
                    onChangeText={text => {
                      _v.setComments(text);
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Rebar and dimension (dia, len, and shape) checked as per GFC"
                  value={_v.placementOfReinforcementCage.rebarDimensionChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePlacementOfReinforcementCage(
                      'rebarDimensionChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Shaping, No and Length of Bars checked as per GFC"
                  value={_v.placementOfReinforcementCage.shapingCheckedAsPerGFC}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePlacementOfReinforcementCage(
                      'shapingCheckedAsPerGFC',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Rebars securely tightened/bound by tie bars"
                  value={_v.placementOfReinforcementCage.rebarsSecurelyBound}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePlacementOfReinforcementCage(
                      'rebarsSecurelyBound',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Splice length and location checked as per GFC"
                  value={_v.placementOfReinforcementCage.spliceLengthChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePlacementOfReinforcementCage(
                      'spliceLengthChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Rebar within tolerance limit"
                  value={_v.placementOfReinforcementCage.rebarWithinTolerance}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePlacementOfReinforcementCage(
                      'rebarWithinTolerance',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Coupler arrangements within tolerance"
                  value={
                    _v.placementOfReinforcementCage
                      .couplerArrangementsWithinTolerance
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePlacementOfReinforcementCage(
                      'couplerArrangementsWithinTolerance',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Bar Bending schedule checked"
                  value={
                    _v.placementOfReinforcementCage.barBendingScheduleChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handlePlacementOfReinforcementCage(
                      'barBendingScheduleChecked',
                      value,
                    )
                  }
                />
              </View>
            </View>
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        );
      case TASK_TYPES.TRANSPORTATION_OF_STEEL_GIRDERS_DIAPHRAGMS_ERECTION_AT_SITE:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Whether safe access to workplace is provided?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms.safeAccessProvided
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'safeAccessProvided',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the working platform fully onboarded on the deck?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .workingPlatformOnBoarded
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'workingPlatformOnBoarded',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All guard rails are firmly attached with mould (at 1m with mid rails and toe board)?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms.guardRailsAttached
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'guardRailsAttached',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Adequate fall protection arrangement made (static line, double lanyard harness, fall arrestor)?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .fallProtectionArrangement
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'fallProtectionArrangement',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Whether hand tools and handling material secure against accidental fall?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .toolsSecuredAgainstFall
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'toolsSecuredAgainstFall',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Has any risk assessment been carried out?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .riskAssessmentCarriedOut
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'riskAssessmentCarriedOut',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the crane on firm level bases?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .craneOnFirmLevelBases
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'craneOnFirmLevelBases',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are all operators trained and competent?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .operatorsTrainedAndCompetent
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'operatorsTrainedAndCompetent',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the crane tested and operated?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .craneTestedAndOperated
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'craneTestedAndOperated',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is there a swing alarm installed and functioning?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .swingAlarmInstalled
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'swingAlarmInstalled',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Does the crane have a current test certificate?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .craneTestCertificateCurrent
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'craneTestCertificateCurrent',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Does the boom of the crane have a current test certificate?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .craneBoomTestCertificateCurrent
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'craneBoomTestCertificateCurrent',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Oil (leakage)"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms.oilLeakageChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'oilLeakageChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Greasing"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms.greasingChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'greasingChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Outriggers (Fully extended)"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .outriggersFullyExtended
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'outriggersFullyExtended',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Level indicators (2 degree to 3 degree)"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .levelIndicatorsWithinLimit
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'levelIndicatorsWithinLimit',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Base plate under the outriggers"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .basePlateUnderOutriggers
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'basePlateUnderOutriggers',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Rigging (2 Nos) angles"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .riggingAnglesChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'riggingAnglesChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are all the examination and tests carried out and certified by a competent person?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .examsAndTestsCertified
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'examsAndTestsCertified',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All lifting tools and tackles are being identified, checked, and have a valid register?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .liftingToolsCheckedAndValid
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'liftingToolsCheckedAndValid',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are personnel working at height trained and equipped with all fall protection devices?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .personnelTrainedAndProtected
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'personnelTrainedAndProtected',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are workmen provided with all required PPEs?"
                  value={_v.transportationOfSteelGirdersDiaphragms.ppeProvided}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'ppeProvided',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Whether sufficient illumination is provided around the working area?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .sufficientIlluminationProvided
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'sufficientIlluminationProvided',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the SWL marked on all lifting tools & tackles?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms.swlMarkedOnTools
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'swlMarkedOnTools',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All welding machines, electrical equipment, and generators properly earthed?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .equipmentProperlyEarthed
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'equipmentProperlyEarthed',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the walkways maintained free from obstacles at all times?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .walkwaysFreeFromObstacles
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'walkwaysFreeFromObstacles',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is safety latch/locking available?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .safetyLatchAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'safetyLatchAvailable',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are proper warning signs available at the site?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .warningSignsAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'warningSignsAvailable',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements checked?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .liftingArrangementsChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'liftingArrangementsChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground leveling done?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms.groundLevelingDone
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'groundLevelingDone',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the structure set out to the required line and levels?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .structureSetOutCorrectly
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'structureSetOutCorrectly',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="For welding, is welder qualification and skill checked and certified?"
                  value={
                    _v.transportationOfSteelGirdersDiaphragms
                      .welderQualifiedAndCertified
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    _v.handleTransportationOfSteelGirdersDiaphragms(
                      'welderQualifiedAndCertified',
                      value,
                    )
                  }
                />
              </View>
            </View>
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={_v.rfiDate}
                  onChange={date => _v.setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={'' + _v.rfiTime}
                  onChange={time => _v.setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={_v.comments}
                  onChangeText={text => {
                    _v.setComments(text);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        );
      default:
        return (
          <View>
            <Text>TODO</Text>
          </View>
        );
    }
  };

  const tasksListing = (_v: any) => {
    return _v.currentTasksData
      .filter((task: any) => {
        if (_v.searchText && task?.taskId?.displayName) {
          return task?.taskId?.displayName
            .toLowerCase()
            .includes(_v.searchText.toLowerCase());
        } else {
          return true;
        }
      })
      .map((item: any, index: number) => (
        <View>
          <LinearGradient
            colors={['#FFFFFF', '#E0E7FF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.gradientContainer, styles.taskBorderColor]}>
            <View style={styles.leftBorderForTask} />
            <View style={styles.FlexRowCenter}>
              <View>
                <Text style={styles.colorForText}>
                  {item?.taskId?.displayName}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
              {item.rfiStatus === RFI_STATUS.GENERATED ? (
                <View style={styles.taskButtonContainer}>
                  {shouldRenderMaterialRequestButton(item) ? (
                    <TouchableOpacity
                      style={[styles.materialReqstBtn]}
                      onPress={() => {
                        console.log('Task Information', item);
                        navigation.navigate('MaterialRequestComponent', {
                          taskId: item.taskId._id,
                        });
                      }}>
                      <Text
                        style={[
                          styles.CtaStartText,
                          styles.CtaRequestTextColor,
                        ]}>
                        Material Request
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text>Material Requested</Text>
                  )}
                  {shouldRenderStartButton(item) ? (
                    <TouchableOpacity
                      style={[styles.MyWorkCta, styles.StartBorder]}
                      onPress={() => {
                        console.log('Task Information', item);
                        navigation.navigate('TaskForm', {taskData: item});
                        //_event.getRFIDataByWorkAssignmentId(item);
                      }}>
                      <Image
                        style={styles.WorkIcon}
                        source={require('../../../../../images/play-icon.png')}
                      />
                      <Text
                        style={[styles.CtaStartText, styles.CtaStartTextColor]}>
                        Start
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              ) : null}

              {item.rfiStatus === RFI_STATUS.RE_GENERATED ? (
                <View style={styles.taskButtonContainer}>
                  {shouldRenderMaterialRequestButton(item) ? (
                    <TouchableOpacity
                      style={[styles.materialReqstBtn]}
                      onPress={() => {
                        console.log('Task Information', item);
                        navigation.navigate('MaterialRequestComponent', {
                          taskId: item.taskId._id,
                        });
                      }}>
                      <Text
                        style={[
                          styles.CtaStartText,
                          styles.CtaRequestTextColor,
                        ]}>
                        Material Request
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text>Material Requested</Text>
                  )}
                  {shouldRenderStartButton(item) ? (
                    <TouchableOpacity
                      style={[styles.MyWorkCta, styles.StartBorder]}
                      onPress={() => {
                        console.log('Task Information', item);
                        navigation.navigate('TaskForm', {taskData: item});
                        //_event.getRFIDataByWorkAssignmentId(item);
                      }}>
                      <Image
                        style={styles.WorkIcon}
                        source={require('../../../../../images/play-icon.png')}
                      />
                      <Text
                        style={[styles.CtaStartText, styles.CtaStartTextColor]}>
                        Re-Start
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              ) : null}

              {item.rfiStatus === RFI_STATUS.REJECTED ||
              item.rfiStatus === RFI_STATUS.CANCELLED ? (
                <TouchableOpacity
                  style={[styles.MyWorkCta, styles.StartRejectBorder]}>
                  {/* <Image style={styles.WorkIcon} source={require('../../../../../images/play-icon.png')} /> */}
                  <Text
                    style={[styles.CtaStartText, styles.CtaRejectTextColor]}>
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
                    // _event.getRFIDataByWorkAssignmentId(item);

                    console.log('Task Information', item);
                    navigation.navigate('TaskForm', {taskData: item});
                  }}>
                  <Image
                    style={styles.WorkIcon}
                    source={require('../../../../../images/inprogress.png')}
                  />
                  <Text
                    style={[
                      styles.CtaStartText,
                      styles.CtaInProgressTextColor,
                    ]}>
                    In Progress
                  </Text>
                </TouchableOpacity>
              ) : null}
              {item.rfiStatus === RFI_STATUS.CORRECTION_REQUEST ? (
                <TouchableOpacity
                  style={[styles.MyWorkCta, styles.StartInProgressBorder]}
                  onPress={() => {
                    // _event.getRFIDataByWorkAssignmentId(item);

                    console.log('Task Information', item);
                    navigation.navigate('TaskForm', {taskData: item});
                  }}>
                  <Image
                    style={styles.WorkIcon}
                    source={require('../../../../../images/inprogress.png')}
                  />
                  <Text
                    style={[
                      styles.CtaStartText,
                      styles.CtaInProgressTextColor,
                    ]}>
                    Correction Request
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
                  <Text
                    style={[styles.CtaStartText, styles.CtaReviewTextColor]}>
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
                  <Text
                    style={[styles.CtaStartText, styles.CtaCompleteTextColor]}>
                    Completed
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </LinearGradient>
        </View>
      ));
  };

  const projectModuleListing = (_v: any, getMyWorksData: Function) => {
    return _v.myWorksData
      .filter((item: any) => {
        if (_v.searchText && item.name) {
          return item.name.toLowerCase().includes(_v.searchText.toLowerCase());
        } else {
          return true;
        }
      })
      .map((projModuleItem: any, projModuleIndex: number) => {
        return (
          <TouchableOpacity
            onPress={() => {
              _v.setCurrentLevel(2);
              _v.setSelectedProjectModuleData(projModuleItem);
              getMyWorksData(2, projModuleItem.id);
            }}>
            <LinearGradient
              colors={workTypeColors.gradientColors}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[
                styles.gradientContainer,
                {borderColor: workTypeColors.borderColor},
              ]}>
              <View
                style={[
                  styles.leftBorder,
                  {backgroundColor: workTypeColors.leftBorderColor},
                ]}
              />
              <View style={styles.FlexColumnCenter}>
                <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                <View style={styles.TaskDetails}>
                  <Text style={[styles.SubHeadingText, styles.BoldText]}>
                    Assigned:
                  </Text>
                  <Text style={[styles.SubHeadingText, styles.SubActive]}>
                    {projModuleItem.name}
                  </Text>
                </View>
              </View>
              <View></View>
            </LinearGradient>
          </TouchableOpacity>
        );
      });
  };

  const segmentGroupListing = (_v: any) => {
    const onSegmentTypeClick = (item: any) => {
      const breadcrumbData = _v.breadcrumbData;
      breadcrumbData[_v.breadcrumbData.length - 1] = {
        name: SEGMENT_TYPES_DISPLAY[item],
        level: 2,
        segmentView: 0,
      };

      breadcrumbData.push({
        name: 'Segments',
        level: 0,
        active: false,
      });
      _v.setBreadcrumbData(breadcrumbData);
      _v.setSelectedSegmentType(item);
      _v.setSegmentView(1);
    };
    if (_v.segmentsByGroupOnType) {
      return Object.keys(_v.segmentsByGroupOnType)
        .filter((item: any) => {
          if (_v.searchText && item) {
            return item.toLowerCase().includes(_v.searchText.toLowerCase());
          } else {
            return true;
          }
        })
        .map(item => {
          return (
            <TouchableOpacity
              onPress={() => {
                onSegmentTypeClick(item);
              }}>
              <LinearGradient
                colors={workTypeColors.gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.gradientContainer,
                  {borderColor: workTypeColors.borderColor},
                ]}>
                <View
                  style={[
                    styles.leftBorder,
                    {backgroundColor: workTypeColors.leftBorderColor},
                  ]}
                />
                <View style={styles.FlexRowCenter}>
                  <View>
                    <Text style={styles.HeadingText}>
                      {SEGMENT_TYPES_DISPLAY[item]}
                    </Text>
                  </View>
                  <View style={styles.countArrowRow}>
                    <View style={styles.numberCircle}>
                      <Text
                        style={[
                          styles.numberText,
                          {color: workTypeColors.leftBorderColor},
                        ]}>
                        {_v.segmentsByGroupOnType[item].length}
                      </Text>
                    </View>
                    <View>
                      <Image
                        style={styles.CloseIcon}
                        source={require('./../../../../../images/right-arrow.png')}
                      />
                    </View>
                  </View>
                </View>
                <View></View>
              </LinearGradient>
            </TouchableOpacity>
          );
        });
    }
  };

  const navigation = useNavigation<any>();

  const segmentListing = (_v: any, getMyWorksData: Function) => {
    if (_v.selectedProjectModuleData?.segmentsData?.length) {
      return _v.segmentsByGroupOnType[_v.selectedSegmentType]
        ?.filter((item: any) => {
          if (_v.searchText && item.name) {
            return item.name
              .toLowerCase()
              .includes(_v.searchText.toLowerCase());
          } else {
            return true;
          }
        })
        .map((item: any, index: number) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  _v.setCurrentLevel(3);
                  _v.setSelectedSegmentData(item);
                  getMyWorksData(3, '', item._id);
                }}>
                <LinearGradient
                  colors={workTypeColors.gradientColors}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[
                    styles.gradientContainer,
                    {borderColor: workTypeColors.borderColor},
                  ]}>
                  <View
                    style={[
                      styles.leftBorder,
                      {backgroundColor: workTypeColors.leftBorderColor},
                    ]}
                  />
                  <View style={styles.FlexColumnCenter}>
                    <Text style={styles.HeadingText}>{item.name}</Text>
                    {/* <View style={styles.TaskDetails}>
                <Text style={[styles.SubHeadingText, styles.BoldText]}>
                  Assigned:
                </Text>
                <Text style={[styles.SubHeadingText, styles.SubActive]}>
                  {item.name}
                </Text>
              </View> */}
                  </View>
                  <View></View>
                </LinearGradient>
              </TouchableOpacity>
            </>
          );
        });
    }
  };

  const componentListing = (_v: any, getMyWorksData: Function) => {
    if (_v.selectedSegmentData?.componentsData?.length) {
      return _v.selectedSegmentData?.componentsData
        ?.filter((item: any) => {
          if (_v.searchText && item.name) {
            return item.name
              .toLowerCase()
              .includes(_v.searchText.toLowerCase());
          } else {
            return true;
          }
        })
        .map((item: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                _v.setSelectedComponentData(item);
                if (item.hasSubComponent) {
                  _v.setCurrentLevel(4);
                  getMyWorksData(4, '', '', item.id);
                } else {
                  _v.setCurrentLevel(5);
                  getMyWorksData(5, '', '', item.id);
                }
              }}>
              <LinearGradient
                colors={workTypeColors.gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.gradientContainer,
                  {borderColor: workTypeColors.borderColor},
                ]}>
                <View
                  style={[
                    styles.leftBorder,
                    {backgroundColor: workTypeColors.leftBorderColor},
                  ]}
                />
                <View style={styles.FlexColumnCenter}>
                  <Text style={styles.HeadingText}>{item.name}</Text>
                  {/* <View style={styles.TaskDetails}>
                <Text style={[styles.SubHeadingText, styles.BoldText]}>
                  Assigned:
                </Text>
                <Text style={[styles.SubHeadingText, styles.SubActive]}>
                  {item.name}
                </Text>
              </View> */}
                </View>
                <View></View>
              </LinearGradient>
            </TouchableOpacity>
          );
        });
    }
  };

  const subComponentListing = (_v: any, getMyWorksData: Function) => {
    if (_v.selectedComponentData?.subComponentsData?.length) {
      return _v.selectedComponentData?.subComponentsData
        ?.filter((item: any) => {
          if (_v.searchText && item.name) {
            return item.name
              .toLowerCase()
              .includes(_v.searchText.toLowerCase());
          } else {
            return true;
          }
        })
        .map((item: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                _v.setCurrentLevel(5);
                _v.setSelectedSubComponentData(item);
                getMyWorksData(5, '', '', '', item.id);
              }}>
              <LinearGradient
                colors={workTypeColors.gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.gradientContainer,
                  {borderColor: workTypeColors.borderColor},
                ]}>
                <View
                  style={[
                    styles.leftBorder,
                    {backgroundColor: workTypeColors.leftBorderColor},
                  ]}
                />
                <View style={styles.FlexColumnCenter}>
                  <Text style={styles.HeadingText}>{item.name}</Text>
                  {/* <View style={styles.TaskDetails}>
                <Text style={[styles.SubHeadingText, styles.BoldText]}>
                  Assigned:
                </Text>
                <Text style={[styles.SubHeadingText, styles.SubActive]}>
                  {item.name}
                </Text>
              </View> */}
                </View>
                <View></View>
              </LinearGradient>
            </TouchableOpacity>
          );
        });
    }
  };

  return {
    CustomTextInput,
    CustomTextInputValue,
    CustomDropdownPicker,
    renderItemFoundation,
    renderFoundationHeadings,
    renderItemBallast,
    renderBallastHeadings,
    renderLayingOfDlcHeadings,
    deleteLayingOfDlcItem,
    deleteConstructionOfFoundationItem,
    renderItemLayingOfDlc,
    handleTextInputChangeLayingOfDlc,
    handleTimeChangeLayingOfDlc,
    taskForm,
    tasksListing,
    projectModuleListing,
    segmentGroupListing,
    segmentListing,
    componentListing,
    subComponentListing,
  };
};
