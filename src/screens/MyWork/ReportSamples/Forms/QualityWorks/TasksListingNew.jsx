import React, { useMemo, useState } from 'react'
import DropdownPicker from '../../../../../components/UI/DropdownPicker';
import TimePicker from '../../../../../components/UI/TimePicker';
import {Text, TouchableOpacity, View, Image, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {
  RFI_STATUS,
  SAMPLE_BY_LIST,
  TEST_CLASSIFICATION_TYPES,
  TEST_CONDUCTED_BY_LIST,
  TEST_MATERIALS_TYPES,
  TEST_TYPES,
  TYPE_OF_CONCRETE_SURFACE_LIST,
  YES_NO_LIST,
} from '../../../../../constants/constants';
import CalendarPicker from '../../../../../components/UI/CalenderPicker';
import Input from '../../../../../components/UI/Input';
import LinearGradient from 'react-native-linear-gradient';

const TasksListingNew = ({
  currentTestTypesData,
  searchText,
  getStyle,
  styles,
  onOpenSamplePreparePopup,
  testClassificationData,
}) => {

    const {height} = Dimensions.get('window');
    const calculatedHeight = height * 0.78;

    const STATUS_GROUPS = {
      PENDING_SAMPLE_PREP: 'Pending for sample preps',
      PENDING_TESTING: 'Pending for testing',
      IN_PROGRESS: 'Testing in progress',
      IN_REVIEW: 'Pending for approvals',
      REJECTED: 'Rejected',
    };
    
    const getStatusGroup = (item: any) => {
      if (
        item.testRfiData?.samplePrepRequired === 'Yes' &&
        !item.samplePrepared &&
        item.rfiStatus === RFI_STATUS.GENERATED
      ) {
        return STATUS_GROUPS.PENDING_SAMPLE_PREP;
      }
    
      if (item.rfiStatus === RFI_STATUS.GENERATED && item.samplePrepared) {
        return STATUS_GROUPS.PENDING_TESTING;
      }
    
      if (item.rfiStatus === RFI_STATUS.IN_PROGRESS) {
        return STATUS_GROUPS.IN_PROGRESS;
      }
    
      if (item.rfiStatus === RFI_STATUS.IN_REVIEW) {
        return STATUS_GROUPS.IN_REVIEW;
      }
    
      if (
        item.rfiStatus === RFI_STATUS.REJECTED ||
        item.rfiStatus === RFI_STATUS.CANCELLED
      ) {
        return STATUS_GROUPS.REJECTED;
      }
    
      return null;
    };

    const [activeStatusTab, setActiveStatusTab] = useState(
        STATUS_GROUPS.PENDING_SAMPLE_PREP
      );
    
      /* -------- Filter by status + search -------- */
    
      const filteredData = useMemo(() => {
        return currentTestTypesData
          ?.filter((item: any) => getStatusGroup(item) === activeStatusTab)
          ?.filter((task: any) => {
            if (searchText && task.name) {
              return task.name
                .toLowerCase()
                .includes(searchText.toLowerCase());
            }
            return true;
          });
      }, [currentTestTypesData, searchText, activeStatusTab]);
    
      /* -------- Group by material type -------- */
    
      const groupedData = useMemo(() => {
        return filteredData?.reduce((acc: any, item: any) => {
          const key = item.testMaterialType?.[0] || 'Others';
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});
      }, [filteredData]);
    
      return (
        <>
        <View style={{ flex: 1 }}>
          <View style={style.tabBarContainer}>
            <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={style.tabBar}
          contentContainerStyle={style.tabBarContent}>
              {Object.values(STATUS_GROUPS).map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    style.tabItem,
                    activeStatusTab === tab && style.activeTab,
                  ]}
                  onPress={() => setActiveStatusTab(tab)}
                >
                  <Text
                    style={[
                      style.activeTabText,
                      activeStatusTab === tab && style.activeFontColor,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
    
          {/* -------- Empty State -------- */}
          {Object.keys(groupedData || {}).length === 0 && (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#6B7280' }}>
              No data available
            </Text>
          )}
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView
            showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}
    style={{ flex: 1, height: calculatedHeight }}>
                {Object.entries(groupedData || {}).map(([groupName, items]: any) => (
                        <View key={groupName} style={style.groupContainer}>
                            <Text style={style.groupHeader}>
                            {groupName.replace(/-/g, ' ').toUpperCase()}
                            </Text>
                            {items.map((item: any) => (
                            <View key={item._id}>
                                <LinearGradient
                                colors={['#FFFFFF', '#E0E7FF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[style.requestCard]}
                                >
                                <View style={[style.leftBorder]} />
                
                                <View>
                                    <View style={style.cardContent}>
                                    <Text style={styles.HeadText}>{item.name}</Text>
                                    <Text style={styles.HeadText}>
                                        {item.testRfiData?.displayName}
                                    </Text>
                                    </View>
                
                                    <View style={style.divider} />
                
                                    <View style={style.cardFooter}>
                                    <View />
                                    <View style={style.footerButton}>
                                        {item.rfiStatus === RFI_STATUS.GENERATED && item.samplePrepared && (
                                        <TouchableOpacity
                                            style={[styles.MyWorkCta, styles.StartBorder]}
                                            disabled={!item.samplePrepared}
                                            onPress={() => getRFIDataByWorkAssignmentId(item)}
                                        >
                                            <Image
                                            style={styles.WorkIcon}
                                            source={require('../../../../../images/play-icon.png')}
                                            />
                                            <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>
                                            {testClassificationData.type ===
                                            TEST_CLASSIFICATION_TYPES.THIRD_PARTY_LAB_TEST
                                                ? 'Upload'
                                                : 'Start'}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                
                                        {(item.testRfiData?.samplePrepRequired === 'Yes' &&
                                        !item.samplePrepared &&
                                        testClassificationData.type !==
                                            TEST_CLASSIFICATION_TYPES.THIRD_PARTY_LAB_TEST) ? (
                                        <TouchableOpacity
                                            style={[style.MyCtaContainer, style.StartBorder]}
                                            onPress={() => onOpenSamplePreparePopup(item)}
                                        >
                                            <Text style={[style.CtaTextColor]}>
                                            Sample Prepare
                                            </Text>
                                        </TouchableOpacity>
                                        ) : (
                                        testClassificationData.type !==
                                            TEST_CLASSIFICATION_TYPES.THIRD_PARTY_LAB_TEST &&
                                        item.testRfiData?.samplePrepRequired === 'Yes' && (
                                            <Text style={{ fontWeight: '600', color: 'green' }}>
                                            Sample Prepared
                                            </Text>
                                        )
                                        )}
                
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
                                    </View>
                                </View>
                                </LinearGradient>
                            </View>
                            ))}
                        </View>
                ))}
            </ScrollView>
          </View>
        </>
      )
}

export default TasksListingNew;

const style = StyleSheet.create({
  requestCard: {
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  footerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center'
  },
  MyCtaContainer: {
    borderRadius: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  CtaTextColor: {
    color: '#1C58C0',
    fontWeight: '600',
  },
  StartBorder: {
    borderColor: '#1C58C0',
    backgroundColor: '#fff'
  },
  pendingAcceptanceCard: {
    borderColor: '#FF9800',
  },
  pendingApprovalCard: {
    borderColor: '#FF9800',
  },
  pendingDispatchCard: {
    borderColor: '#5A7EF8',
  },
  rejectedCard: {
    borderColor: '#FF4747',
  },
  dispatchedCard: {
    borderColor: '#28A745',
  },
  defaultCard: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCCCCC',
  },
  cardContent: {
    padding: 15,
  },
  // Generic styles for rows to keep it clean
  rowLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rowValue: {
    color: '#000',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 15,
  },
  cardFooter: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  pendingAcceptanceStatus: {
    color: '#FF8C00',
  },
  pendingApprovalStatus: {
    color: '#FF8C00',
  },
  pendingDispatchStatus: {
    color: '#007BFF',
  },
  rejectedStatus: {
    color: '#FF4444',
  },
  defaultStatus: {
    color: '#666',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  acceptButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  rejectButton: {
    borderColor: '#DC3545',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rejectButtonText: {
    color: '#DC3545',
    fontSize: 12,
    fontWeight: '500',
  },
  approvalButton: {
    borderColor: '#FF9800',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  approvalButtonText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  dispatchButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dispatchButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  newRequestButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newRequestButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  leftBorder: {
    paddingVertical: 3,
    position: 'absolute',
    left: 0,
    top: '15%',
    bottom: '15%',
    zIndex: 100,
    width: 2,
  },
  groupHeader: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
    marginLeft: -10,
    marginRight: -10,
    color: '#333',
  },
  groupContainer: {
    // paddingHorizontal: 10,
    paddingBottom: 5,
    marginBottom: 0,
    // borderWidth: 1,
    // borderRadius: 10,
    // borderColor: '#1E3A8A',
    overflow: 'hidden'
  },

  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
  },

  activeTab: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },

  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  



  tabBarContainer: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#D2C5FF',
    borderRadius: 10,
    paddingVertical: 8,
  },
  tabBar: {
    flexGrow: 0,
  },
  tabBarContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    minWidth: 100,
  },
  activeTab: {
    backgroundColor: '#F1F1FE',
    borderRadius: 10,
  },
  activeFontColor: {
    color: '#4E36A3',
  },
  activeTabText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabContent: {
    flex: 1, // This is the corrected style
  },
});