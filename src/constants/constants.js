export const HeaderItems = {
    dashboard: { showBack: false, title: 'Dashboard' },
    myWork: { showBack: false, title: 'My Work' },
    myWork2: { showBack: true, title: 'My Work 2' },
    myWork3: { showBack: true, title: 'My Work 3' },
    myTask: { showBack: false, title: 'My Task' },
    manageUsers: { showBack: false, title: 'Manage Users' },
    changePassword: { showBack: false, title: 'Change Password' },
    assignTask: { showBack: true, title: 'Assign Task' },
    flyoverDetails: { showBack: true, title: 'Flyover Details' },
    assignWork: { showBack: true, title: 'Assign Work' },
    segmentsList: { showBack: true, title: 'Segment List' },
    subSegmentsList: { showBack: true, title: 'Sub-segment List' },
    notifications: { showBack: false, title: 'Notifications' },
    progress: { showBack: false, title: 'Progress Dashboard' },
    reports: { showBack: false, title: 'Reports' },
    rfis: { showBack: false, title: 'RFIs' },
    projectInfo: { showBack: false, title: 'Project Info' },
    myTest: { showBack: false, title: 'My Test' },
    profile: { showBack: false, title: 'Edit Profile' }
};

export const UserRoles = {
    "super-admin": "Super admin",
    "project-head": "Project Head",
    "structure-head": "Stucture Head",
    "highway-head": "Highway Head",
    "other-work-head": "Other-Work Head",
    "quality-head": "Quality Head",
    "quality-users": "Quality Users",
    "user": "Normal User",
}

export const Dashboard_MENU = [
    {
        id: "1",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/manage-icon.png"),
        title: "My Work",
        subTitle: "Check your task",
        route: 'MyWork',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head"],
        categories: ["structure-work", "highway-work", "other-work"]
    },
    {
        id: "2",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/mywork-icon.png"),
        title: "My Test",
        subTitle: "My Test",
        route: 'MyTest',
        permissions: ["project-head", "quality-head"],
        categories: ["quality-work"]
    },
    {
        id: "3",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/mywork-icon.png"),
        title: "My Task",
        subTitle: "Check your task",
        route: 'MyTask',
        permissions: []
    },
    {
        id: "4",
        icon: require("./../images/dashboard/manage-user-icon.png"),
        iconMenu: require("./../images/menu/manage-icon.png"),
        title: "Manage User",
        subTitle: "Check user",
        route: 'ManageUsers',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head"]
    },
    {
        id: "5",
        icon: require("./../images/dashboard/manage-rfi-icon.png"),
        iconMenu: require("./../images/menu/manage-rfi-icom.png"),
        title: "Manage RFIs",
        subTitle: "RFI",
        route: 'RFIs',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head"]
    },
    {
        id: "6",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/mywork-icon.png"),
        title: "Project Info",
        subTitle: "Project Info",
        route: 'ProjectInfo',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head", "user"]
    },
    {
        id: "7",
        icon: require("./../images/dashboard/progress-icon.png"),
        iconMenu: require("./../images/menu/progress-dash-icon.png"),
        title: "Progress Dashboard",
        subTitle: "Progress",
        route: 'Progress',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head", "user"]
    },
    {
        id: "8",
        icon: require("./../images/dashboard/report-list-icon.png"),
        iconMenu: require("./../images/menu/report-menu-icon.png"),
        title: "Report",
        subTitle: "Report",
        route: 'Reports',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head", "user"]
    },
];

export const MARITAL_STATUS = [
    {
        label: 'Single', value: 'single'
    },
    {
        label: 'Married', value: 'married'
    },
    {
        label: 'Divorced', value: 'divorced'
    }
];

export const GENDER = [
    {
        label: 'Male', value: 'male'
    },
    {
        label: 'Female', value: 'female'
    },
    {
        label: 'Trans', value: 'trans'
    }
];

export const LANGUAGE = [
    {
        label: 'Hindi', value: 'hindi'
    },
    {
        label: 'English', value: 'english'
    },
    {
        label: 'Other', value: 'other'
    }
];

export const NATIONALITY = [
    {
        label: 'Indian', value: 'indian'
    },
    {
        label: 'NRI', value: 'nri'
    },
    {
        label: 'Foreigner', value: 'foreigner'
    }
];

export const BLOOD_GROUP = [
    {
        label: 'A+', value: 'A+'
    },
    {
        label: 'O+', value: 'O+'
    },
    {
        label: 'B+', value: 'B+'
    },
    {
        label: 'AB+', value: 'AB+'
    },
    {
        label: 'A-', value: 'A-'
    },
    {
        label: 'O-', value: 'O-'
    },
    {
        label: 'B-', value: 'B-'
    },
    {
        label: 'AB-', value: 'AB-'
    }
];

export const USER_CATEGORY = {
    STRUCTURE_WORK: 'structure-work',
    HIGHWAY_WORK: 'highway-work',
    OTHER_WORK: 'other-work',
    QUALITY_WORK: 'quality-work',
};

export const USER_CATEGORIES = [
    {
        label: "Structure Work", value: USER_CATEGORY.STRUCTURE_WORK, isChecked: false
    },
    {
        label: "Highway Work", value: USER_CATEGORY.HIGHWAY_WORK, isChecked: false
    },
    {
        label: "Other Work", value: USER_CATEGORY.OTHER_WORK, isChecked: false

    },
    {
        label: "Quality Work", value: USER_CATEGORY.QUALITY_WORK, isChecked: false
    }
];


