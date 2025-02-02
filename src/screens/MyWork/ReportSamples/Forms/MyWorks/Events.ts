import { Guid } from "guid-typescript";
import { RFI_STATUS, SEGMENT_TYPES_DISPLAY } from "../../../../../constants/constants";
import { Alert } from "react-native";
import { getDbDateFromDDMMYYYY, groupBy } from "../../../../../utils/Utils";
import { onFillChecklistData } from "./FillChecklist";
import { fillRFIsChecklist, getRFIByWaId } from "../../../actions";
import { styles } from "./Styles";

export const Events = (_v: any) => {
    const onAddMoreConcrete = () => {
        _v.setConcreteData([
            ..._v.concreteData,
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
    };
    const onAddMoreTorquing = () => {
        _v.setTorquingData([
            ..._v.torquingData,
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
    };
    const onAddMoreDumping = () => {
        _v.setDumpingData([
            ..._v.dumpingData,
            {
                vehicleNo: '',
                source: 'Y',
                qtyDumped: 0,
                approvedSource: '',
                bouldersPresent: 'Y',
                key: Guid.create(),
            },
        ]);
    };

    const getStyle = (item: any) => {
        if (item.rfiStatus) {
            if (
                item.rfiStatus === RFI_STATUS.GENERATED ||
                item.rfiStatus === RFI_STATUS.RE_GENERATED
            ) {
                return [styles.StartWorkCard, styles.StartBorder];
            } else if (
                item.rfiStatus === RFI_STATUS.REJECTED ||
                item.rfiStatus === RFI_STATUS.CANCELLED
            ) {
                return [styles.StartWorkCard, styles.StartRejectBorder];
            } else if (item.rfiStatus === RFI_STATUS.IN_PROGRESS) {
                return [styles.StartWorkCard, styles.StartInProgressBorder];
            } else if (item.rfiStatus === RFI_STATUS.IN_REVIEW) {
                return [styles.StartWorkCard, styles.StartReviewBorder];
            } else if (item.rfiStatus === RFI_STATUS.APPROVED) {
                return [styles.StartWorkCard, styles.StartCompleteBorder];
            }
        }
        return [styles.StartWorkCardDisabled, styles.DisabledBorder];
    };

    const onClick = (
        level: number,
        assignmentLevel: number,
        projectModuleIndex: number,
        segIndex: number = -1,
        componentIndex: number = -1,
        subComponentIndex: number = -1,
        taskIndex: number = -1,
        segmentType = 0,
    ) => {
        _v.setSearchText('');
        _v.setCurrentLevel(level);
        _v.setBreadcrumbData([]);
        _v.setCurrentTasksData([]);
        if (level === 2) {
            if (assignmentLevel === 1) {
                _v.setCurrentLevel(7);
                const gbSegmentTypes = groupBy(
                    _v.myWorksData[projectModuleIndex].segmentsData,
                    'type',
                );
                _v.setSegmentsByGroupOnType(gbSegmentTypes);
                _v.setBreadcrumbData([
                    {
                        name: _v.myWorksData[projectModuleIndex].name,
                        projectModuleIndex: projectModuleIndex,
                        segIndex: segIndex,
                        componentIndex: componentIndex,
                        subComponentIndex: subComponentIndex,
                        taskIndex: taskIndex,
                        level: 2,
                        assignmentLevel: assignmentLevel,
                        active: true,
                    },
                    {
                        name: 'Segment Types',
                        projectModuleIndex: projectModuleIndex,
                        segIndex: segIndex,
                        componentIndex: componentIndex,
                        subComponentIndex: subComponentIndex,
                        taskIndex: taskIndex,
                        level: 0,
                        assignmentLevel: assignmentLevel,
                        active: false,
                    },
                ]);
            } else if (assignmentLevel == -1) {
                _v.setCurrentSegmentsData(_v.segmentsByGroupOnType[segmentType]);
                _v.setBreadcrumbData([
                    {
                        name: _v.myWorksData[projectModuleIndex].name,
                        projectModuleIndex: projectModuleIndex,
                        segIndex: segIndex,
                        componentIndex: componentIndex,
                        subComponentIndex: subComponentIndex,
                        taskIndex: taskIndex,
                        level: 2,
                        assignmentLevel: assignmentLevel,
                        active: true,
                    },
                    {
                        name: SEGMENT_TYPES_DISPLAY[segmentType],
                        projectModuleIndex: projectModuleIndex,
                        segIndex: segIndex,
                        componentIndex: componentIndex,
                        subComponentIndex: subComponentIndex,
                        taskIndex: taskIndex,
                        level: 0,
                        assignmentLevel: assignmentLevel,
                        active: false,
                    },
                ]);
            } else {
                const segmentsData = _v.myWorksData[
                    projectModuleIndex
                ].segmentsData.filter((seg: any) => seg.type == segmentType);
                _v.setCurrentSegmentsData(segmentsData);
                _v.setBreadcrumbData([
                    {
                        name: _v.myWorksData[projectModuleIndex].name,
                        projectModuleIndex: projectModuleIndex,
                        segIndex: segIndex,
                        componentIndex: componentIndex,
                        subComponentIndex: subComponentIndex,
                        taskIndex: taskIndex,
                        level: 2,
                        assignmentLevel: assignmentLevel,
                        active: true,
                    },
                    {
                        //name: "Foundation", // todo - dynamic
                        name: SEGMENT_TYPES_DISPLAY[segmentsData[0].type] || 'Foundation', // todo - dynamic
                        projectModuleIndex: projectModuleIndex,
                        segIndex: segIndex,
                        componentIndex: componentIndex,
                        subComponentIndex: subComponentIndex,
                        taskIndex: taskIndex,
                        level: 0,
                        assignmentLevel: assignmentLevel,
                        active: false,
                    },
                ]);
            }
        } else if (level === 3 && segIndex != -1) {
            const segmentData =
            _v.myWorksData[projectModuleIndex].segmentsData[segIndex];
            if (segmentData.componentsData && segmentData.componentsData.length) {
                _v.setCurrentTasksData([]);
                _v.setCurrentComponentsData(segmentData.componentsData);
            } else {
                _v.setCurrentLevel(6);
                _v.setCurrentComponentsData([]);
                _v.setCurrentTasksData(segmentData.tasksData);
            }
            _v.setBreadcrumbData([
                {
                    name: _v.myWorksData[projectModuleIndex].name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 2,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
                {
                    name:
                        SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 0,
                    assignmentLevel: assignmentLevel,
                    active: false,
                },
            ]);
        } else if (level === 4 && segIndex != -1 && componentIndex != -1) {
            const segmentData =
            _v.myWorksData[projectModuleIndex].segmentsData[segIndex];
            const componentData = segmentData.componentsData[componentIndex];
            if (
                componentData.subComponentsData &&
                componentData.subComponentsData.length
            ) {
                _v.setCurrentTasksData([]);
                _v.setCurrentLevel(4);
                _v.setCurrentSubComponentsData(componentData.subComponentsData);
            } else {
                _v.setCurrentSubComponentsData([]);
                _v.setCurrentLevel(6);
                _v.setCurrentTasksData(componentData.tasksData);
            }
            _v.setBreadcrumbData([
                {
                    name: _v.myWorksData[projectModuleIndex].name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 2,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
                {
                    name: SEGMENT_TYPES_DISPLAY[segmentData.type] + '' + segmentData.name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 0,
                    assignmentLevel: assignmentLevel,
                    active: false,
                },
                {
                    name: componentData.name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 3,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
            ]);
        } else if (
            level === 5 &&
            segIndex != -1 &&
            componentIndex != -1 &&
            subComponentIndex != -1
        ) {
            const segmentData =
            _v.myWorksData[projectModuleIndex].segmentsData[segIndex];
            const componentData: any = segmentData.componentsData[componentIndex];
            const subComponentData: any =
                componentData.subComponentsData[subComponentIndex];
                _v.setProjectModuleId(segmentData.projectModuleId);
                _v.setCurrentTasksData(subComponentData.tasksData);

                _v.setBreadcrumbData([
                {
                    name: _v.myWorksData[projectModuleIndex].name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 2,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
                {
                    name:
                        SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 0,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
                {
                    name: componentData.name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 3,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
                {
                    name: subComponentData.name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 4,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
            ]);
        } else if (level === 6 && taskIndex != -1) {
            const segmentData =
            _v.myWorksData[projectModuleIndex].segmentsData[segIndex];
            const breadcrumbItems = [
                {
                    name: _v.myWorksData[projectModuleIndex].name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 2,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
                {
                    name:
                        SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 0,
                    assignmentLevel: assignmentLevel,
                    active: true,
                },
            ];
            if (componentIndex != -1 && subComponentIndex != -1) {
                const componentData: any = segmentData.componentsData[componentIndex];
                const subComponentData =
                    componentData.subComponentsData[subComponentIndex];
                const taskData: any = [subComponentData.tasksData[taskIndex]];
                _v.setProjectModuleId(segmentData.projectModuleId);
                _v.setCurrentTasksData(taskData);
                breadcrumbItems.push(
                    ...[
                        {
                            name: componentData.name,
                            projectModuleIndex: projectModuleIndex,
                            segIndex: segIndex,
                            componentIndex: componentIndex,
                            subComponentIndex: subComponentIndex,
                            taskIndex: taskIndex,
                            level: 3,
                            assignmentLevel: assignmentLevel,
                            active: true,
                        },
                        {
                            name: subComponentData.name,
                            projectModuleIndex: projectModuleIndex,
                            segIndex: segIndex,
                            componentIndex: componentIndex,
                            subComponentIndex: subComponentIndex,
                            taskIndex: taskIndex,
                            level: 4,
                            assignmentLevel: assignmentLevel,
                            active: true,
                        },
                    ],
                );
            } else if (componentIndex != -1) {
                const componentData: any = segmentData.componentsData[componentIndex];
                const taskData: any = [componentData.tasksData[taskIndex]];
                _v.setProjectModuleId(segmentData.projectModuleId);
                _v.setCurrentTasksData(taskData);
                breadcrumbItems.push({
                    name: componentData.name,
                    projectModuleIndex: projectModuleIndex,
                    segIndex: segIndex,
                    componentIndex: componentIndex,
                    subComponentIndex: subComponentIndex,
                    taskIndex: taskIndex,
                    level: 3,
                    assignmentLevel: assignmentLevel,
                    active: true,
                });
            } else if (segIndex != -1) {
                _v.setProjectModuleId(segmentData.projectModuleId);
                const taskData: any = [segmentData.tasksData[taskIndex]];
                _v.setCurrentTasksData(taskData);
            }

            breadcrumbItems.push({
                name: 'Tasks',
                projectModuleIndex: projectModuleIndex,
                segIndex: segIndex,
                componentIndex: componentIndex,
                subComponentIndex: subComponentIndex,
                taskIndex: taskIndex,
                level: 0,
                assignmentLevel: assignmentLevel,
                active: false,
            });
            _v.setBreadcrumbData(breadcrumbItems);
        }
    };

    const onClickNested = (level: number, data: any) => {
        _v.setSearchText('');
        if (data.projectModuleId) {
            _v.setProjectModuleId(data.projectModuleId);
        }
        _v.setCurrentLevel(level);
        if (level === 3) {
            _v.setCurrentComponentsData(data.componentsData);
            const beadcrumb = _v.breadcrumbData[1];
            beadcrumb.name = SEGMENT_TYPES_DISPLAY[data.type] + ' ' + data.name;
        } else if (level === 4) {
            _v.setProjectModuleId(data.projectModuleId);
            const bcrubm = {
                name: data.name,
                projectModuleIndex: _v.breadcrumbData[0].projectModuleIndex,
                segIndex: _v.breadcrumbData[1].segIndex,
                componentIndex: _v.breadcrumbData[2]?.componentIndex || -1,
                subComponentIndex: _v.breadcrumbData[3]?.subComponentIndex || -1,
                taskIndex: 0,
                level: 0,
                assignmentLevel: 0,
                active: false,
            };
            _v.breadcrumbData.push(bcrubm);
            if (data.subComponentsData && data.subComponentsData.length) {
                _v.setCurrentSubComponentsData(data.subComponentsData);
            } else {
                _v.setCurrentTasksData(data.tasksData);
                _v.breadcrumbData.push({
                    name: 'Tasks',
                    projectModuleIndex: _v.breadcrumbData[0].projectModuleIndex,
                    segIndex: _v.breadcrumbData[1].segIndex,
                    componentIndex: _v.breadcrumbData[2]?.componentIndex || -1,
                    subComponentIndex: _v.breadcrumbData[3]?.subComponentIndex || -1,
                    taskIndex: 0,
                    level: 0,
                    assignmentLevel: 0,
                    active: false,
                });
            }
        } else if (level === 5) {
            _v.setCurrentTasksData(data.tasksData);
            const bcrubm = {
                name: data.name,
                projectModuleIndex: _v.breadcrumbData[0].projectModuleIndex,
                segIndex: _v.breadcrumbData[1].segIndex,
                componentIndex: _v.breadcrumbData[2]?.componentIndex || -1,
                subComponentIndex: _v.breadcrumbData[3]?.subComponentIndex || -1,
                taskIndex: 0,
                level: 0,
                assignmentLevel: 0,
                active: false,
            };
            _v.breadcrumbData.push(bcrubm);
            _v.breadcrumbData.push({
                name: 'Tasks',
                projectModuleIndex: _v.breadcrumbData[0].projectModuleIndex,
                segIndex: _v.breadcrumbData[1].segIndex,
                componentIndex: _v.breadcrumbData[2]?.componentIndex || -1,
                subComponentIndex: _v.breadcrumbData[3]?.subComponentIndex || -1,
                taskIndex: 0,
                level: 0,
                assignmentLevel: 0,
                active: false,
            });
        }
    };

    const onFillChecklist = (rfiStatus: string) => {
        if (!_v.rfiDate) {
            Alert.alert('Error', 'Date is required.');
            return false;
        }

        if (!_v.comments) {
            Alert.alert('Error', 'Recommendations is required.');
            return false;
        }
        //return;
        let rfiSubmitDateTime = `${getDbDateFromDDMMYYYY(_v.rfiDate)} ${_v.rfiTime}:00`;
        let checkList = {};

        onFillChecklistData(_v, checkList);

        _v.dispatch(
            fillRFIsChecklist({
                projectId: _v.loggedInUser.projectId,
                projectModuleId: _v.projectModuleId,
                rfiId: _v.rfiId,
                status: rfiStatus,
                body: {
                    checkList: checkList,
                    additionalData: {
                        comments: _v.comments,
                        rfiSubmitDateTime: rfiSubmitDateTime,
                    },
                },
            }),
        );
    };

    const onSegmentTypeClick = (type: any) => {
        if (_v.segmentsByGroupOnType) {
            onClick(
                2,
                -1,
                _v.breadcrumbData[0].projectModuleIndex,
                -1,
                -1,
                -1,
                -1,
                type,
            );
        }
    };

    const getRFIDataByWorkAssignmentId = (task: any) => {
        _v.setRFIDate('');
        _v.setComments('');
        _v.setImageObject(_v.imageObjectEmpty);
        _v.setSelectedTask(task);
        _v.dispatch(
            getRFIByWaId({
                projectId: _v.loggedInUser.projectId,
                projectModuleId: _v.projectModuleId,
                waId: task.workAssignmentId,
            }),
        );
    };

    return {
        onAddMoreConcrete,
        onAddMoreTorquing,
        onAddMoreDumping,
        getStyle,
        onClick,
        onClickNested,
        onFillChecklist,
        onSegmentTypeClick,
        getRFIDataByWorkAssignmentId
    }

}