import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import {useSnackbar} from '../../context/SnackbarContext';
import React, {Fragment, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderItems,
  PROJECT_TYPE,
  RFI_STATUS,
  SEGMENT_TYPES_DISPLAY,
  TASK_TYPES,
  YES_NO_LIST,
  YES_NO_NA_LIST,
  CONCRETE_GRADE_LIST,
  CEMENT_GRADE_LIST,
  CEMENT_TYPE_LIST,
} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMyWorksEvent,
  fillRFIsChecklist,
  getMyWorks,
  getRFIByWaId,
} from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import {
  getDbDate,
  getDbDateFromDDMMYYYY,
  getDisplayDate,
  getDisplayTime,
  groupBy,
} from '../../utils/Utils';

import DropDownPicker from 'react-native-dropdown-picker';
import DropdownPicker from '../../components/UI/DropdownPicker';
import CalendarPicker from '../../components/UI/CalenderPicker';
import TimePicker from '../../components/UI/TimePicker';
import moment from 'moment';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Guid} from 'guid-typescript';
import {FlatList} from 'react-native-gesture-handler';
import Input from '../../components/UI/Input';
import { initRfiData } from './ReportSamples/Forms/MyWorks/initialize';
import { styles } from './ReportSamples/Forms/MyWorks/Styles';
import { Variables } from './ReportSamples/Forms/MyWorks/Variables';
import { Events } from './ReportSamples/Forms/MyWorks/Events';
import { CustomForms } from './ReportSamples/Forms/MyWorks/CustomForms';
import commonStyles from '../Common/commonStyles';

const MyWork = ({route, navigation}: {route: any; navigation: any}) => {

  const _v = Variables();

  const _event = Events(_v);

  const _customForms = CustomForms(_v);

  const {workType} = route.params;

  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myWork);
      _v.setCurrentLevel(1);
      _v.setMyWorksData([]);
      _v.setCurrentSegmentsData([]);
      _v.setCurrentComponentsData([]);
      _v.setCurrentSubComponentsData([]);
      _v.setCurrentTasksData([]);
      _v.setBreadcrumbData([]);
      getMyWorksData();
      _v.setSearchText('');
      _v.setOpenPopup(false);
    }
  }, [focus]);

  const getMyWorksData = () => {
    _v.dispatch(
      getMyWorks({
        projectId: _v.loggedInUser.projectId,
        workType: workType,
      }),
    );
  };

  useEffect(() => {
    if (_v.myWorks) {
      _v.setMyWorksData(_v.myWorks);
    }

    if (_v.rfiData) {
      initRfiData(_v);
    }

    if (_v.rfiChecklistSaved) {
      _v.setOpenPopup(false);
      Alert.alert('RFIs checklist saved.');
      _v.setCurrentLevel(1);
      _v.setImageObject(_v.imageObjectEmpty);
      _v.dispatch(clearMyWorksEvent());
      getMyWorksData();
    }
  }, [_v.myWorks, _v.rfiData, _v.rfiChecklistSaved, _v.error]);

  // unmount
  useEffect(
    () => () => {
      _v.dispatch(clearMyWorksEvent());
      _v.setCurrentLevel(1);
      _v.setMyWorksData([]);
      _v.setCurrentSegmentsData([]);
      _v.setCurrentComponentsData([]);
      _v.setCurrentSubComponentsData([]);
      _v.setCurrentTasksData([]);
      _v.setBreadcrumbData([]);
      _v.setSearchText('');
    },
    [],
  );




  // const onAddMoreGlueing = () => {
  //   setGlueingData([
  //     ...glueingData,
  //     {
  //       jointNumbers: '',
  //       ambientTemperature: 0,
  //       batchNoResin: 0,
  //       batchNoHardener: 0,
  //       mixingStartTime: '',
  //       mixingFinishTime: '',
  //       applicationStartTime: '',
  //       applicationFinishTime: '',
  //       segmentJoiningTimeClosure: '',
  //       segmentJoiningTimeTemporaryFinish: '',
  //       segmentSurfaceArea: 0,
  //       epoxyConsumptionTheoreticalResin: 0,
  //       epoxyConsumptionTheoreticalHardener: 0,
  //       epoxyConsumptionActualResin: 0,
  //       epoxyConsumptionActualHardener: 0,
  //       key: Guid.create(),
  //     },
  //   ]);
  // };



  return (
    <View style={styles.Container}>
      {_v.breadcrumbData.length ? (
        <View style={styles.BreadcrumbContainer}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.scrollView}>
            {_v.breadcrumbData.map((item: any, index) => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {index == 0 ? (
                  <Text
                    style={styles.BreadcrumbPrevTextUnderline}
                    onPress={() =>
                      index === 0 &&
                      (_v.setCurrentLevel(1), _v.setBreadcrumbData([]))
                    }>
                    {item.name}
                  </Text>
                ) : index === _v.breadcrumbData.length - 1 ? (
                  <Text style={styles.BreadcrumbCurrentText}>{item.name}</Text>
                ) : (
                  <Text style={styles.BreadcrumbPrevText}>{item.name}</Text>
                )}
                {index < _v.breadcrumbData.length - 1 ? (
                  <Image
                    style={styles.ArrowIcon}
                    source={require('../../images/right-arrow-icon.png')}
                  />
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
      {_v.currentLevel !== 1 && _v.currentLevel !== 5 ? (
        <View style={styles.SearchBox}>
          <Image
            source={require('./../../images/search-icon.png')}
            style={styles.ImageSearch}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Search"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            value={_v.searchText}
            onChangeText={text => {
              _v.setSearchText(text);
            }}
          />
        </View>
      ) : null}
      <ScrollView style={styles.Height100}>
        {_v.currentLevel === 1
          ? _v.myWorksData.map((projModuleItem: any, projModuleIndex) =>
              projModuleItem.assignmentLevel === 1 ? (
                <TouchableOpacity
                  style={styles.MyWorkCard}
                  onPress={() =>
                    _event.onClick(
                      2,
                      projModuleItem.assignmentLevel,
                      projModuleIndex,
                    )
                  }>
                  <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                  <View style={styles.TaskDetails}>
                    <Text style={[styles.SubHeadingText, styles.BoldText]}>
                      Assigned:
                    </Text>
                    <Text style={[styles.SubHeadingText, styles.SubActive]}>
                      {projModuleItem.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                projModuleItem.segmentsData?.map(
                  (segItem: any, segIndex: any) =>
                    segItem.assignmentLevel === 2 ? (
                      projModuleItem.segmentsData?.filter(
                        (segItem: any) => segItem.assignmentLevel == 2,
                      ).length === 1 ? (
                        <TouchableOpacity
                          style={styles.MyWorkCard}
                          onPress={() =>
                            _event.onClick(
                              3,
                              segItem.assignmentLevel,
                              projModuleIndex,
                              projModuleItem.segmentsData?.findIndex(
                                (segItem: any) => segItem.assignmentLevel == 2,
                              ),
                            )
                          }>
                          <View style={styles.ContentContainer}>
                            <Text style={styles.HeadingText}>
                              {projModuleItem.name}
                            </Text>
                            <View style={styles.TaskDetails}>
                              <Text
                                style={[
                                  styles.SubHeadingText,
                                  styles.BoldText,
                                ]}>
                                Assigned:
                              </Text>
                            </View>
                            <View style={styles.TaskDetails}>
                              <Text style={styles.SubHeadingText}>
                                {SEGMENT_TYPES_DISPLAY[segItem.type]} /
                              </Text>
                              <Text style={styles.SubHeadingText}>
                                {segItem.name} /
                              </Text>
                            </View>
                            <View style={styles.TaskDetails}>
                              <Text
                                style={[
                                  styles.SubHeadingText,
                                  styles.SubActive,
                                ]}>
                                {
                                  projModuleItem.segmentsData?.filter(
                                    (segItem: any) =>
                                      segItem.assignmentLevel == 2,
                                  )[0].name
                                }
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        Object.keys(groupBy([segItem], 'type')).map(
                          (segType: any, index: any) => (
                            <TouchableOpacity
                              style={styles.MyWorkCard}
                              onPress={() =>
                                _event.onClick(
                                  2,
                                  segItem.assignmentLevel,
                                  projModuleIndex,
                                  -1,
                                  -1,
                                  -1,
                                  -1,
                                  segType,
                                )
                              }>
                              <View style={styles.ContentContainer}>
                                <Text style={styles.HeadingText}>
                                  {projModuleItem.name}
                                </Text>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.BoldText,
                                    ]}>
                                    Assigned: {'' + index}
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.SubActive,
                                    ]}>
                                    {SEGMENT_TYPES_DISPLAY[segType]}{' '}
                                    {
                                      projModuleItem.segmentsData?.filter(
                                        (segItem: any) =>
                                          segItem.type == segType &&
                                          segItem.assignmentLevel == 2,
                                      ).length
                                    }
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ),
                        )
                      )
                    ) : segItem.componentsData &&
                      segItem.componentsData.length ? (
                      segItem.componentsData?.map(
                        (componentItem: any, componentIndex: number) =>
                          componentItem.assignmentLevel === 3 ? (
                            <TouchableOpacity
                              style={styles.MyWorkCard}
                              onPress={() =>
                                _event.onClick(
                                  4,
                                  componentItem.assignmentLevel,
                                  projModuleIndex,
                                  segIndex,
                                  componentIndex,
                                )
                              }>
                              <View style={styles.ContentContainer}>
                                <Text style={styles.HeadingText}>
                                  {projModuleItem.name}
                                </Text>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.BoldText,
                                    ]}>
                                    Assigned:
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text style={styles.SubHeadingText}>
                                    {SEGMENT_TYPES_DISPLAY[segItem.type]} /
                                  </Text>
                                  <Text style={styles.SubHeadingText}>
                                    {segItem.name} /
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text style={styles.SubHeadingText}>
                                    {componentItem.name}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ) : componentItem.subComponentsData &&
                            componentItem.subComponentsData.length ? (
                            componentItem.subComponentsData.map(
                              (subComponentItem: any, subCompIndex: number) =>
                                subComponentItem.assignmentLevel === 4 ? (
                                  <TouchableOpacity
                                    style={styles.MyWorkCard}
                                    onPress={() =>
                                      _event.onClick(
                                        5,
                                        subComponentItem.assignmentLevel,
                                        projModuleIndex,
                                        segIndex,
                                        componentIndex,
                                        subCompIndex,
                                      )
                                    }>
                                    <View style={styles.ContentContainer}>
                                      <Text style={styles.HeadingText}>
                                        {projModuleItem.name}
                                      </Text>
                                      <View style={styles.TaskDetails}>
                                        <Text
                                          style={[
                                            styles.SubHeadingText,
                                            styles.BoldText,
                                          ]}>
                                          Assigned To:
                                        </Text>
                                      </View>
                                      <View style={styles.TaskDetails}>
                                        <Text style={styles.SubHeadingText}>
                                          {SEGMENT_TYPES_DISPLAY[segItem.type]}{' '}
                                          /
                                        </Text>
                                        <Text style={styles.SubHeadingText}>
                                          {segItem.name} /
                                        </Text>
                                        <Text style={styles.SubHeadingText}>
                                          {componentItem.name} /
                                        </Text>
                                      </View>
                                      <View style={styles.TaskDetails}>
                                        <Text
                                          style={[
                                            styles.SubHeadingText,
                                            styles.SubActive,
                                          ]}>
                                          {subComponentItem.displayName}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  subComponentItem.tasksData?.map(
                                    (taskItem: any, taskIndex: number) =>
                                      taskItem.assignmentLevel === 5 && (
                                        <TouchableOpacity
                                          style={styles.MyWorkCard}
                                          onPress={() =>
                                            _event.onClick(
                                              6,
                                              taskItem.assignmentLevel,
                                              projModuleIndex,
                                              segIndex,
                                              componentIndex,
                                              subCompIndex,
                                              taskIndex,
                                            )
                                          }>
                                          <View style={styles.ContentContainer}>
                                            <Text style={styles.HeadingText}>
                                              {projModuleItem.name}
                                            </Text>
                                            <View style={styles.TaskDetails}>
                                              <Text
                                                style={[
                                                  styles.SubHeadingText,
                                                  styles.BoldText,
                                                ]}>
                                                Assigned To:
                                              </Text>
                                            </View>
                                            <View style={styles.TaskDetails}>
                                              <Text
                                                style={styles.SubHeadingText}>
                                                {
                                                  SEGMENT_TYPES_DISPLAY[
                                                    segItem.type
                                                  ]
                                                }{' '}
                                                /
                                              </Text>
                                              <Text
                                                style={styles.SubHeadingText}>
                                                {componentItem.name} /
                                              </Text>
                                              <Text
                                                style={styles.SubHeadingText}>
                                                {subComponentItem.name} /
                                              </Text>
                                            </View>
                                            <View style={styles.TaskDetails}>
                                              <Text
                                                style={[
                                                  styles.SubHeadingText,
                                                  styles.SubActive,
                                                ]}>
                                                {taskItem.displayName}
                                              </Text>
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ),
                                  )
                                ),
                            )
                          ) : (
                            componentItem.tasksData?.map(
                              (taskItem: any, taskIndex: number) =>
                                taskItem.assignmentLevel === 5 && (
                                  <TouchableOpacity
                                    style={styles.MyWorkCard}
                                    onPress={() =>
                                      _event.onClick(
                                        6,
                                        taskItem.assignmentLevel,
                                        projModuleIndex,
                                        segIndex,
                                        componentIndex,
                                        -1,
                                        taskIndex,
                                      )
                                    }>
                                    <View style={styles.ContentContainer}>
                                      <Text style={styles.HeadingText}>
                                        {projModuleItem.name}
                                      </Text>
                                      <View style={styles.TaskDetails}>
                                        <Text
                                          style={[
                                            styles.SubHeadingText,
                                            styles.BoldText,
                                          ]}>
                                          Assigned To:
                                        </Text>
                                      </View>
                                      <View style={styles.TaskDetails}>
                                        <Text style={styles.SubHeadingText}>
                                          {SEGMENT_TYPES_DISPLAY[segItem.type]}{' '}
                                          /
                                        </Text>
                                        <Text style={styles.SubHeadingText}>
                                          {segItem.name} /
                                        </Text>
                                        <Text style={styles.SubHeadingText}>
                                          {componentItem.name} /
                                        </Text>
                                      </View>
                                      <View style={styles.TaskDetails}>
                                        <Text
                                          style={[
                                            styles.SubHeadingText,
                                            styles.SubActive,
                                          ]}>
                                          {taskItem.displayName}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ),
                            )
                          ),
                      )
                    ) : (
                      segItem.tasksData?.map(
                        (taskItem: any, taskIndex: number) =>
                          taskItem.assignmentLevel === 5 && (
                            <TouchableOpacity
                              style={styles.MyWorkCard}
                              onPress={() =>
                                _event.onClick(
                                  6,
                                  taskItem.assignmentLevel,
                                  projModuleIndex,
                                  segIndex,
                                  -1,
                                  -1,
                                  taskIndex,
                                )
                              }>
                              <View style={styles.ContentContainer}>
                                <Text style={styles.HeadingText}>
                                  {projModuleItem.name}
                                </Text>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.BoldText,
                                    ]}>
                                    Assigned To:
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text style={styles.SubHeadingText}>
                                    {SEGMENT_TYPES_DISPLAY[segItem.type]} /
                                  </Text>
                                  <Text style={styles.SubHeadingText}>
                                    {segItem.name} /
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.SubActive,
                                    ]}>
                                    {taskItem.displayName}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ),
                      )
                    ),
                )
              ),
            )
          : null}
        {_v.currentLevel === 7 &&
        _v.segmentsByGroupOnType &&
        Object.keys(_v.segmentsByGroupOnType).length
          ? Object.keys(_v.segmentsByGroupOnType).map(item => (
              <TouchableOpacity
                style={[styles.StartWorkCard, styles.StartBorder]}
                onPress={() => _event.onSegmentTypeClick(item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>
                    {_v.segmentsByGroupOnType[item].length}
                  </Text>
                  <Text style={styles.MyWorkSubHead}>
                    {SEGMENT_TYPES_DISPLAY[item]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          : null}
        {_v.currentLevel === 2
          ? _v.currentSegmentsData
              .filter((seg: any) => {
                if (_v.searchText && seg.name) {
                  return seg.name
                    .toLowerCase()
                    .includes(_v.searchText.toLowerCase());
                } else {
                  return true;
                }
              })
              .map((item: any, index) => (
                <TouchableOpacity
                  style={_event.getStyle(item)}
                  onPress={() => _event.onClickNested(3, item)}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.HeadText}>{item.name}</Text>
                    {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
                  </View>
                </TouchableOpacity>
              ))
          : null}
        {_v.currentLevel === 3
          ? _v.currentComponentsData && _v.currentComponentsData.length
            ? _v.currentComponentsData
                .filter((subSeg: any) => {
                  if (_v.searchText && subSeg.name) {
                    return subSeg.name
                      .toLowerCase()
                      .includes(_v.searchText.toLowerCase());
                  } else {
                    return true;
                  }
                })
                .map((item: any, index) => (
                  <TouchableOpacity
                    style={_event.getStyle(item)}
                    onPress={() => _event.onClickNested(4, item)}>
                    <View style={styles.leftContainer}>
                      <Text style={styles.HeadText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
            : _customForms.tasksListing(_v)
          : null}
        {_v.currentLevel === 4
          ? _v.currentSubComponentsData && _v.currentSubComponentsData.length
            ? _v.currentSubComponentsData
                .filter((subComponent: any) => {
                  if (_v.searchText && subComponent.name) {
                    return subComponent.name
                      .toLowerCase()
                      .includes(_v.searchText.toLowerCase());
                  } else {
                    return true;
                  }
                })
                .map((item: any, index) => (
                  <TouchableOpacity
                    style={_event.getStyle(item)}
                    onPress={() => _event.onClickNested(5, item)}>
                    <View style={styles.leftContainer}>
                      <Text style={styles.HeadText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
            : _customForms.tasksListing(_v)
          : null}
        {_v.currentLevel === 5 || _v.currentLevel === 6
          ? _customForms.tasksListing(_v)
          : null}
        {/* No Data Found */}
        {!_v.loading && !_v.myWorksData.length ? (
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
            {/* {(searchText && <Text style={styles.NodataSubText}>
              Please try to search another keywork...
            </Text>
            )} */}
          </View>
        ) : null}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={_v.openPopup}
        onRequestClose={() => {
          _v.setOpenPopup(!_v.openPopup);
        }}>
        <View style={styles.bodyPopup}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>RFIs</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => _v.setOpenPopup(!_v.openPopup)}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <View style={styles.taskAddContainer}>
                  <Text style={styles.Lable}>
                    Task:{' '}
                    <Text style={{fontWeight: '600', color: '#5A2AAF'}}>
                      {_v.selectedTask?.displayName}
                    </Text>
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{minHeight: 100, maxHeight: 500}}>
                  <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView>
                      {_customForms.taskForm(_v.selectedTask?.name)}
                    </SafeAreaView>
                  </Fragment>
                </ScrollView>

                <View
                  style={[
                    styles.btnParentSection,
                    {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 20,
                      marginBottom: -65,
                      backgroundColor: '#F7F3FF',
                      paddingVertical: 10,
                      marginHorizontal: -15,
                    },
                  ]}>
                  <TouchableOpacity
                    style={[styles.submitButton, styles.saveButtonColor]}
                    onPress={() =>
                      _event.onFillChecklist(RFI_STATUS.IN_PROGRESS)
                    }>
                    <Text style={[styles.submitButtonText, {color: '#5A2AAF'}]}>
                      Save
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() =>
                      _event.onFillChecklist(RFI_STATUS.IN_REVIEW)
                    }>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingAnimation loading={_v.loading}></LoadingAnimation>
    </View>
  );
};


export default MyWork;
