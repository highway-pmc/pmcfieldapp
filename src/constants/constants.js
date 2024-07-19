export const HeaderItems = {
    dashboard: { showBack: false, title: 'Dashboard' },
    myWork: { showBack: true, title: 'My Work' },
    myWork2: { showBack: true, title: 'My Work 2' },
    myWork3: { showBack: true, title: 'My Work 3' },
    myTask: { showBack: false, title: 'My Task' },
    manageUsers: { showBack: false, title: 'Manage Users' },
    changePassword: { showBack: false, title: 'Change Password' },
    assignTask: { showBack: true, title: 'Assign Task' },
    flyoverDetails: { showBack: true, title: 'Flyover Details' },
    manageWork: { showBack: true, title: 'Manage Works' },
    myWorkType: { showBack: false, title: 'My Work' },
    assignWork: { showBack: true, title: 'Assign Works' },
    segmentsList: { showBack: true, title: 'Assign Works - Segment' },
    componentsList: { showBack: true, title: 'Assign Works - Component' },
    subComponentsList: { showBack: true, title: 'Assign Works - Sub Component' },
    assignTasks: { showBack: true, title: 'Assign Works - Tasks' },
    assignedWorkType: { showBack: false, title: 'My Work' },
    assignedMyWork: { showBack: true, title: 'Assigned Works' },
    assignedSegments: { showBack: true, title: 'Assigned Works - Segment' },
    assignedComponents: { showBack: true, title: 'Assigned Works - Component' },
    assignedTasks: { showBack: true, title: 'Assigned Work - Tasks' },
    notifications: { showBack: false, title: 'Notifications' },
    progress: { showBack: false, title: 'Progress Dashboard' },
    reports: { showBack: false, title: 'Reports' },
    rfisHome: { showBack: false, title: 'RFIs' },
    rfisDashboard: { showBack: true, title: 'RFIs' },
    rfisGenerateTaskListing: { showBack: true, title: 'Generate RFIs' },
    rfisClosedTaskListing: { showBack: true, title: 'Closed RFIs' },
    rfisApprovedTaskListing: { showBack: true, title: 'Approved RFIs' },
    rfisRejectedTaskListing: { showBack: true, title: 'Rejected/Cancelled RFIs' },
    projectInfo: { showBack: false, title: 'Project Info' },
    myQualityWorks: { showBack: false, title: 'Quality Works' },
    profile: { showBack: false, title: 'Edit Profile' },

    assignTestClassification: { showBack: true, title: 'Assign Test Classification' },
    assignTestWorkCategory: { showBack: true, title: 'Assign Test Work Category' },
    assignTestMaterials: { showBack: true, title: 'Assign Test Materials' },
    assignTestTypes: { showBack: true, title: 'Assign Test Types' },
    sourceApprovals: { showBack: true, title: 'Source Approvals' },
    procurements: { showBack: true, title: 'Procurements' },
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

export const ROLES = {
    SUPER_ADMIN: "super-admin",
    PROJECT_HEAD: "project-head",
    STRUCTURE_HEAD:"structure-head",
    HIGHWAY_HEAD: "highway-head",
    OTHER_WORF_HEAD: "other-work-head",
    QUALITY_HEAD: "quality-head",
    QUALITY_USERS: "quality-users",
    USER: "user"
}

export const Dashboard_MENU = [
    {
        id: "1",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/manage-icon.png"),
        title: "My Work",
        subTitle: "Check your task",
        route: 'MyWorkType',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head"],
        categories: ["structure-work", "highway-work", "other-work"]
    },
    {
        id: "2",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/mywork-icon.png"),
        title: "Quality Work",
        subTitle: "Quality Work",
        route: 'MyQualityWorks',
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
        route: 'RFIsHome',
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

export const USER_CATEGORY_DISPLAY = {
    STRUCTURE: 'Structure',
    HIGHWAY: 'Highway',
    OTHER: 'Other',
    QUALITY: 'Quality',
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

export const PROJECT_TYPE = {
    STRUCTURE_WORK: 'structure-work',
    HIGHWAY_WORK: 'highway-work',
    OTHER_WORK: 'other-work',
    QUALITY_WORK: 'quality-work'
};

export const SEGMENT_TYPES = {
    FOUNDATIONS: 'foundations',
    SUB_STRUCTURES: 'sub-structures',
    BEARINGS: 'bearings',
    SUPER_STRUCTURE: 'super-structure',
    EXPANSION_JOINTS: 'expansion-joints',
    DIRT_WALL: 'dirt-wall',
    GAP_SLAB: 'gap-slab',
    APPROACH_SLAB: 'approach-slab',
};

export const SEGMENT_TYPES_DISPLAY = {
    'foundations': 'Foundations',
    'sub-structures': 'Sub Structures',
    'super-structure': 'Super Structure',
    'bearings': 'Bearings',
    'expansion-joints': 'Expansion Joints',
    'dirt-wall': 'Dirt Wall',
    'gap-slab': 'Gap Slab',
    'approach-slab': 'Approach Slab',

    'main-foundations': 'Foundations Main',
    'main-sub-structures': 'Sub Structures Main',
    'main-super-structures': 'Super Structures Main',
    'main-truss-roof': 'Truss Roof Main',
    'lhs-stair-foundations': 'Foundations LHS Stairs',
    'lhs-stair-sub-structure': 'Sub Structures LHS Stairs',
    'lhs-stair-super-structure': 'Super Structures LHS Stairs',
    'lhs-stair-truss-roof': 'Truss Roof LHS Stairs',
    'rhs-stair-foundations': 'Foundations RHS Stairs',
    'rhs-stair-sub-structure': 'Sub Structures RHS Stairs',
    'rhs-stair-super-structure': 'Super Structures RHS Stairs',
    'rhs-stair-truss-roof': 'Truss Roof RHS Stairs',
    'lhs-ramp-foundations': 'Foundations LHS Ramp',
    'lhs-ramp-sub-structure': 'Sub Structures LHS Ramp',
    'lhs-ramp-super-structure': 'Super Structures LHS Ramp',
    'lhs-ramp-truss-roof': 'Truss Roof LHS Ramp',
    'rhs-ramp-foundations': 'Foundations RHS Ramp',
    'rhs-ramp-sub-structure': 'Sub Structures RHS Ramp',
    'rhs-ramp-super-structure': 'Super Structures RHS Ramp',
    'rhs-ramp-truss-roof': 'Truss Roof RHS Ramp',

    'counter-forts': 'Counter Forts',

    'rcc-box-culvert': 'RCC Box Culvert',
    'chambers': 'Chambers',

    'rcc-box-drain': 'RCC Box Drain',

    'reinforced-earth-wall': 'RE Wall',
    're-wall': 'RE Wall',

    'pipe-culvert': 'Pipe Culvert',
    'head-wall': 'Head Wall',
    'stone-pitching': 'Stone Pitching',
    'longitudinal-drain': 'Longitudinal Drain'

};

export const RFIs_TYPE = {
    GENERATE: "generate",
    CLOSED: "closed",
    APPROVED:"approved",
    REJECTED: "rejected",
    IN_PROGRESS: "inProgress",
}

export const RFI_STATUS = {
    PENDING: 'pending',
    GENERATED: 'generated',
    RE_GENERATED: 'regenerated',
    IN_PROGRESS: 'inProgress',
    IN_REVIEW: 'inReview',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    APPROVED: 'approved',
};

export const TEST_SAMPLE_STATUS = {
    PENDING: 'pending',
    PREPARED: 'prepared',
    NOT_PREPARED: 'notPrepared',
};

export const TEST_SAMPLE_STATUS_LIST = [
    {
        label: 'Select', value: 'pending'
    },
    {
        label: 'Prepared', value: 'prepared'
    },
    {
        label: 'Not Prepared', value: 'notPrepared'
    }
];

export const WORK_TYPE = {
    SITE_WORK: "Site Work",
    LAB_WORK: "Lab Work"
}

export const WORK_ASSIGNMENT_LEVEL = {
    LEVEL1: 'Project Module',
    LEVEL2: 'Segment',
    LEVEL3: 'Component',
    LEVEL4: 'Sub component',
    LEVEL5: 'Task',
}

export const TEST_ASSIGNMENT_LEVEL = {
    LEVEL1: 'Classifications',
    LEVEL2: 'Work Category',
    LEVEL3: 'Materials',
    LEVEL4: 'Test Type',
}

export const TASK_TYPES = {
    CNG_AND_SETTING_OUT: 'cng-and-setting-out',
    FORM_WORK: 'form-work',
    EXCAVATION: 'excavation',
    REINFORCEMENT: 'reinforcement',
    REINFORCEMENT_PREPARATION: 'reinforcement-preparation',
    REMOVAL_OF_SHUTTER: 'removal-of-shutter',
    REMOVAL_OF_SHUTTERS: 'removal-of-shutters',
    PLACEMENT_OF_INNER_SHUTTERS: 'placement-of-inner-shutters',
    PLACEMENT_OF_SIDE_SHUTTERS: 'placement-of-side-shutters',
    PLACEMENT_OF_BOTTOM_SHUTTER: 'placement-of-bottom-shutter',
    PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER: 'placement-of-middle-and-top-shutter',
    PLACEMENT_OF_REINFORCEMENT_CAGE: 'placement-of-reinforcement-cage',
    CAGE_LOWERING: 'cage-lowering',
    PLACING_OF_SHEATHING_DUCT: 'placing-of-sheathing-duct',
    THREADING_OF_PRE_STRESSING_STRANDS: 'threading-of-pre-stressing-strands',
    CONCRETING: 'concreting'
}

export const TEST_MATERIALS_TYPES = {
    WATER: 'water',
    FINE_AGGREGATE: 'fine-aggregate',
    GRANULATED_SLAG: 'granulated-slag',
    FLYASH: 'flyash',
    MICRO_SILIKA: 'micro-silika',
    BENTONITE: 'bentonite',
    CONCRETE: 'concrete',
    COARSE_AGGREGATE: 'coarse-aggregate',
    CEMENT: 'cement',
    ADMIXTURE: 'admixture',
    SILICA_FUME: 'silica-fume',
  };

export const YES_NO_LIST = [
    {
        label: 'Yes', value: 'Y'
    },
    {
        label: 'No', value: 'N'
    },
];

export const YES_NO_NA_LIST = [
    {
        label: 'Yes', value: 'Y'
    },
    {
        label: 'No', value: 'N'
    },
    {
        label: 'NA', value: 'NA'
    },
];

export const SAMPLE_BY_LIST = [
    {
        label: 'Concessionaire', value: 'Concessionaire'
    },
    {
        label: 'Jointly', value: 'Jointly'
    },
];

export const TEST_CONDUCTED_BY_LIST = [
    {
        label: 'Concessionaire', value: 'Concessionaire'
    },
    {
        label: 'Jointly', value: 'Jointly'
    },
];

export const SOURCE_APPROVAL_STATUS = {
    PENDING: 'pending',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    APPROVED: 'approved',
  };

export const CONCRETE_GRADE_LIST = [
    {
        label: 'M20', value: 'M20'
    },
    {
        label: 'M25', value: 'M25'
    },
    {
        label: 'M30', value: 'M30'
    },
    {
        label: 'M35', value: 'M35'
    },
    {
        label: 'M40', value: 'M40'
    },
    {
        label: 'M45', value: 'M45'
    },
    {
        label: 'M50', value: 'M50'
    },
    {
        label: 'M55', value: 'M55'
    },
    {
        label: 'M60', value: 'M60'
    },
    {
        label: 'M65', value: 'M65'
    },
    {
        label: 'M70', value: 'M70'
    },
    {
        label: 'M75', value: 'M20'
    },
];