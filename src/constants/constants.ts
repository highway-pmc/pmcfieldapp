export const HeaderItems = {
  dashboard: {showBack: false, title: 'Dashboard'},
  myWork: {showBack: true, title: 'My Work'},
  myWork2: {showBack: true, title: 'My Work 2'},
  myWork3: {showBack: true, title: 'My Work 3'},
  myTask: {showBack: false, title: 'My Task'},
  manageUsers: {showBack: false, title: 'Manage Users'},
  changePassword: {showBack: false, title: 'Change Password'},
  assignTask: {showBack: true, title: 'Assign Task'},
  flyoverDetails: {showBack: true, title: 'Flyover Details'},
  manageWork: {showBack: true, title: 'Manage Works'},
  myWorkType: {showBack: false, title: 'My Work'},
  assignWork: {showBack: true, title: 'Assign Works'},
  segmentsList: {showBack: true, title: 'Assign Works - Segment'},
  componentsList: {showBack: true, title: 'Assign Works - Component'},
  subComponentsList: {showBack: true, title: 'Assign Works - Sub Component'},
  assignTasks: {showBack: true, title: 'Assign Works - Tasks'},
  assignedWorkType: {showBack: false, title: 'My Work'},
  assignedMyWork: {showBack: true, title: 'Assigned Works'},
  assignedSegments: {showBack: true, title: 'Assigned Works - Segment'},
  assignedComponents: {showBack: true, title: 'Assigned Works - Component'},
  assignedTasks: {showBack: true, title: 'Assigned Work - Tasks'},
  notifications: {showBack: false, title: 'Notifications'},
  progress: {showBack: false, title: 'Progress Dashboard'},
  reportDashboard: {showBack: true, title: 'Reports'},
  reports: {showBack: false, title: 'Reports'},
  rfisHome: {showBack: false, title: 'RFIs'},
  rfisDashboard: {showBack: true, title: 'RFIs'},
  rfisGenerateTaskListing: {showBack: true, title: 'Generate RFIs'},
  rfisClosedTaskListing: {showBack: true, title: 'Closed RFIs'},
  rfisApprovedTaskListing: {showBack: true, title: 'Approved RFIs'},
  rfisRejectedTaskListing: {showBack: true, title: 'Rejected/Cancelled RFIs'},
  projectInfo: {showBack: false, title: 'Project Info'},
  myQualityWorks: {showBack: false, title: 'Quality Works'},
  profile: {showBack: false, title: 'Edit Profile'},

  assignTestClassification: {
    showBack: true,
    title: 'Assign Test Classification',
  },
  assignTestWorkCategory: {showBack: true, title: 'Assign Test Work Category'},
  selectTestWorkCategory: {showBack: true, title: 'Select Test Work Category'},
  assignTestMaterials: {showBack: true, title: 'Assign Test Materials'},
  assignTestTypes: {showBack: true, title: 'Assign Test Types'},
  sourceApprovals: {showBack: true, title: 'Source Approvals'},
  procurements: {showBack: true, title: 'Procurements'},
  mixDesignListing: {showBack: false, title: 'Mix Design'},
  mixDesignInfo: {showBack: true, title: 'Mix Design'},
};

export const UserRoles = {
  'super-admin': 'Super admin',
  'project-head': 'Project Head',
  'structure-head': 'Stucture Head',
  'highway-head': 'Highway Head',
  'other-work-head': 'Other-Work Head',
  'quality-head': 'Quality Head',
  'quality-users': 'Quality Users',
  user: 'Normal User',
};

export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  PROJECT_HEAD: 'project-head',
  STRUCTURE_HEAD: 'structure-head',
  HIGHWAY_HEAD: 'highway-head',
  OTHER_WORF_HEAD: 'other-work-head',
  QUALITY_HEAD: 'quality-head',
  QUALITY_USERS: 'quality-users',
  USER: 'user',
};

export const Dashboard_MENU = [
  {
    id: '1',
    icon: require('./../images/dashboard/my-work-icon.png'),
    iconMenu: require('./../images/menu/manage-icon.png'),
    title: 'My Work',
    subTitle: 'Check your task',
    route: 'MyWorkType',
    permissions: [
      'project-head',
      'structure-head',
      'highway-head',
      'other-work-head',
    ],
    categories: ['structure-work', 'highway-work', 'other-work'],
  },
  {
    id: '2',
    icon: require('./../images/dashboard/my-work-icon.png'),
    iconMenu: require('./../images/menu/mywork-icon.png'),
    title: 'Quality Work',
    subTitle: 'Quality Work',
    route: 'MyQualityWorks',
    permissions: ['project-head', 'quality-head'],
    categories: ['quality-work'],
  },
  {
    id: '3',
    icon: require('./../images/dashboard/my-work-icon.png'),
    iconMenu: require('./../images/menu/mywork-icon.png'),
    title: 'Mix Design',
    subTitle: 'Mix Design',
    route: 'MixDesignList',
    permissions: ['project-head', 'quality-head'],
    categories: ['quality-work'],
  },
  {
    id: '4',
    icon: require('./../images/dashboard/my-work-icon.png'),
    iconMenu: require('./../images/menu/mywork-icon.png'),
    title: 'My Task',
    subTitle: 'Check your task',
    route: 'MyTask',
    permissions: [],
  },
  {
    id: '5',
    icon: require('./../images/dashboard/manage-user-icon.png'),
    iconMenu: require('./../images/menu/manage-icon.png'),
    title: 'Manage User',
    subTitle: 'Check user',
    route: 'ManageUsers',
    permissions: [
      'project-head',
      'structure-head',
      'highway-head',
      'other-work-head',
      'quality-head',
    ],
  },
  {
    id: '6',
    icon: require('./../images/dashboard/manage-rfi-icon.png'),
    iconMenu: require('./../images/menu/manage-rfi-icom.png'),
    title: 'Manage RFIs',
    subTitle: 'RFI',
    route: 'RFIsHome',
    permissions: [
      'project-head',
      'structure-head',
      'highway-head',
      'other-work-head',
      'quality-head',
    ],
  },
  {
    id: '7',
    icon: require('./../images/dashboard/my-work-icon.png'),
    iconMenu: require('./../images/menu/mywork-icon.png'),
    title: 'Project Info',
    subTitle: 'Project Info',
    route: 'ProjectInfo',
    permissions: [
      'project-head',
      'structure-head',
      'highway-head',
      'other-work-head',
      'quality-head',
      'user',
    ],
  },
  {
    id: '8',
    icon: require('./../images/dashboard/progress-icon.png'),
    iconMenu: require('./../images/menu/progress-dash-icon.png'),
    title: 'Progress Dashboard',
    subTitle: 'Progress',
    route: 'Progress',
    permissions: [
      'project-head',
      'structure-head',
      'highway-head',
      'other-work-head',
      'quality-head',
      'user',
    ],
  },
  {
    id: '9',
    icon: require('./../images/dashboard/report-list-icon.png'),
    iconMenu: require('./../images/menu/report-menu-icon.png'),
    title: 'Report',
    subTitle: 'Report',
    route: 'ReportsDashboard',
    permissions: [
      'project-head',
      'structure-head',
      'highway-head',
      'other-work-head',
      'quality-head',
      'user',
    ],
  },
];

export const MARITAL_STATUS = [
  {
    label: 'Single',
    value: 'single',
  },
  {
    label: 'Married',
    value: 'married',
  },
  {
    label: 'Divorced',
    value: 'divorced',
  },
];

export const GENDER = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Trans',
    value: 'trans',
  },
];

export const LANGUAGE = [
  {
    label: 'Hindi',
    value: 'hindi',
  },
  {
    label: 'English',
    value: 'english',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

export const NATIONALITY = [
  {
    label: 'Indian',
    value: 'indian',
  },
  {
    label: 'NRI',
    value: 'nri',
  },
  {
    label: 'Foreigner',
    value: 'foreigner',
  },
];

export const BLOOD_GROUP = [
  {
    label: 'A+',
    value: 'A+',
  },
  {
    label: 'O+',
    value: 'O+',
  },
  {
    label: 'B+',
    value: 'B+',
  },
  {
    label: 'AB+',
    value: 'AB+',
  },
  {
    label: 'A-',
    value: 'A-',
  },
  {
    label: 'O-',
    value: 'O-',
  },
  {
    label: 'B-',
    value: 'B-',
  },
  {
    label: 'AB-',
    value: 'AB-',
  },
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
    label: 'Structure Work',
    value: USER_CATEGORY.STRUCTURE_WORK,
    isChecked: false,
  },
  {
    label: 'Highway Work',
    value: USER_CATEGORY.HIGHWAY_WORK,
    isChecked: false,
  },
  {
    label: 'Other Work',
    value: USER_CATEGORY.OTHER_WORK,
    isChecked: false,
  },
  {
    label: 'Quality Work',
    value: USER_CATEGORY.QUALITY_WORK,
    isChecked: false,
  },
];

export const PROJECT_TYPE = {
  STRUCTURE_WORK: 'structure-work',
  HIGHWAY_WORK: 'highway-work',
  OTHER_WORK: 'other-work',
  QUALITY_WORK: 'quality-work',
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

export const SEGMENT_TYPES_DISPLAY: any = {
  foundations: 'Foundations',
  'sub-structures': 'Sub Structures',
  'super-structure': 'Super Structure',
  bearings: 'Bearings',
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
  chambers: 'Chambers',

  'rcc-box-drain': 'RCC Box Drain',

  'reinforced-earth-wall': 'RE Wall',
  're-wall': 'RE Wall',

  'pipe-culvert': 'Pipe Culvert',
  'head-wall': 'Head Wall',
  'stone-pitching': 'Stone Pitching',
  'longitudinal-drain': 'Longitudinal Drain',
  pavement: 'Pavement',
  kerb: 'Kerb',
  embankment: 'Embankment',
  'crash-barrier': 'Crash Barrier',
  'transverse-pipe-drain': 'Transverse Pipe Drain',
  median: 'Madian',
};

export const RFIs_TYPE = {
  GENERATE: 'generate',
  CLOSED: 'closed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'inProgress',
};

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
    label: 'Select',
    value: 'pending',
  },
  {
    label: 'Prepared',
    value: 'prepared',
  },
  {
    label: 'Not Prepared',
    value: 'notPrepared',
  },
];

export const TEST_SAMPLE_CONCRETE_CATEGORY = {
  C_7TH_DAYS: '7thdays',
  C_28TH_DAYS: '28thdays',
  CORE_TEST: 'core-test',
};

export const WORK_TYPE = {
  SITE_WORK: 'Site Work',
  LAB_WORK: 'Lab Work',
};

export const WORK_ASSIGNMENT_LEVEL = {
  LEVEL1: 'Project Module',
  LEVEL2: 'Segment',
  LEVEL3: 'Component',
  LEVEL4: 'Sub component',
  LEVEL5: 'Task',
};

export const TEST_ASSIGNMENT_LEVEL = {
  LEVEL1: 'Classifications',
  LEVEL2: 'Work Category',
  LEVEL3: 'Materials',
  LEVEL4: 'Test Type',
};

export const TASK_TYPES = {
  CNG_AND_SETTING_OUT: 'cng-and-setting-out',
  POST_CONCRETE_CHECK: 'post-concrete-check',
  FIXING_OF_BEARING_SLEEVES: 'fixing-of-bearing-sleeves',
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
  CONCRETING: 'concreting',
  PCC_LEVELLING_COURSE: 'pcc-levelling-course',
  BORING_OF_PILE: 'boring-of-pile',
  FLUSHING_OPERATIONS: 'flushing-operations',
  CHIPPING_AND_REMOVAL_OF_CONCRETE_ABOVE_CUT_OFF_LEVEL:
    'chipping-and-removal-of-concrete-above-cut-off-level',
  GROUTING: 'grouting',
  GLUEING: 'gluing',
  LIFTING_LEFT: 'lifting-transportation-to-site-and-erection-of-left-segment',
  LIFTING_RIGHT: 'lifting-transportation-to-site-and-erection-of-right-segment',
  LIFTING_TRANSPORT_ERECTION: 'lifting-transportation-and-erection-at-site',
  LIFTING_YARD: 'lifting-of-segment-and-stacking-in-yard',
  REMOVAL_OF_FORMWORK: 'removal-of-formwork',
  TEMPORARY_PRESTRESSING: 'temporary-pre-stressing',
  FABRICATION_OF_STEEL_GIRDERS: 'fabrication-of-steel-girders-diaphragms',
  FABRICATION_OF_MEMBERS: 'fabrication-of-members',
  CURING: 'curing',
  FIXING_OF_SHUTTER: 'fixing-of-shutter',
  ERECTION_OF_TEMPORARY_STRUCTURE: 'erection-of-temporary-structure',
  PAINTING_OF_STEEL_GIRDERS_DIAPHRAGMS: 'painting-of-steel-girders-diaphragms',
  TRANSPORTATION_OF_STEEL_GIRDERS_DIAPHRAGMS_ERECTION_AT_SITE:
    'transportation-of-steel-girders-diaphragms-erection-at-site',
  ASSEMBLING_OF_TRUSS: 'assembling-of-truss',
  ERECTION_USING_CRANES: 'erection-using-cranes',
  STACKING_IN_YARD: 'stacking-in-yard',
  HACKING_OF_GIRDER: 'hacking-of-girder',
  DE_STRESSING_OF_GIRDER: 'de-stressing-of-girders',
  REMOVAL_OF_SIDE_SHUTTERS: 'removal-of-side-shutters',
  REMOVAL_OF_MIDDLIE_TOP_SHUTTERS: 'removal-of-middle-and-top-shutters',
  REMOVAL_OF_INNER_SHUTTERS: 'removal-of-inner-shutters',
  FIXING_OF_BEARING: 'fixing-of-bearing',
  INSTALLATION_OF_EXPANSION_JOINT: 'installation-of-expansion-joint',
  REMOVAL_OF_TEMPORARY_STRUCTURE: 'removal-of-temporary-structure',
  PAINTING: 'painting',
  STITCH_CONCRETE: 'stitch-concrete',
  AUTO_LAUNCHING: 'auto-launching',
  PROCUREMENT_OF_STRUCTURAL_STEEL: 'procurement-of-structural-steel',
  TRANSPORTATION_OF_MATERIAL: 'transportation-of-material-at-site',
  FIXING_OF_SHEATHING_JOINTS: 'fixing-of-sheathing-joints',
  TORQUING: 'torquing',
  FIXING_OF_GEO_GRID: 'fixing-of-geo-grid',
  ERECTION: 'erection',
  ERECTION_OF_FRICTION_SLAB: 'erection-of-friction-slab',
  ERECTION_OF_FACIA_PANELS: 'erection-of-facia-panels',
  ERECTION_OF_COLUMNS: 'erection-of-columns',
  APPLICATION_OF_FILTER_MEDIA: 'application-of-filter-media',
  FIXING_OF_BRACINGS: 'fixing-of-bracings',
  FIXING_OF_RAILING: 'fixing-of-railing',
  PLACING_OF_COVER: 'placing-of-cover',
  COMPACTION: 'compaction',
  FIXING_OF_SHEET: 'fixing-of-sheet',
  GRADING: 'grading',
  PRE_STRESSING: 'pre-stressing',
  PROCUREMENT_OF_SHEET: 'procurement-of-sheet',
  DUMPING_OF_SOIL: 'dumping-of-soil',
  DUMPING: 'dumping',
  BORING_OF_DIAPHRAGM: 'boring-of-diaphragm',
  COPING: 'coping',
  COMPACTING_GROUND_SUPPORT_FOR_EMBANKMENT:
    'compacting-ground-support-for-embankment',
  DEWATERING: 'dewatering',
  STRIPPING_AND_STORING_TOP_SOIL: 'stripping-storing-top-soil',
  SPREADING_AND_COMPACTION: 'spreading-and-compaction', //start here
  PRIME_COAT: 'applying-prime-coat',
  TACK_COAT: 'applying-tack-coat',
  ROAD_MARKING: 'road-marking',
  LAYING_AND_COMPACTION: 'laying-and-compaction',
  PIPE_LAYING_AND_JOINTING: 'pipe-laying-jointing',
  FIXING_OF_METAL_BEAM: 'fixing-of-metal-beam',
  FIXING_VERTICAL_POST: 'fixing-of-vertiacal-post',
  CUTTING_OF_JOINTS: 'cutting-of-joints',
  LAYING_OF_PAVER_BLOCK: 'laying-of-paver-block',
  LAYING_OF_DLC: 'laying-of-dlc',
  MACHINE_CUTTING_OF_JOINTS: 'machine-cutting-of-joints',
  PLACING_OF_TIE_BAR: 'placing-of-tie-bar',
  FIXING_OF_WIRE_ROPE: 'fixing-of-wire-rope',
  TEXTURING: 'texturing',
  PLACING_OF_DOWEL: 'placing-of-dowel',
  PLACING_OF_FILLER_BOARD: 'placing-of-filler-board',
  SEALANT_FILING: 'sealant-filing',
  MILLING_OF_FLEXIBLE_PAVEMENT: 'milling-of-flexible-pavement',
  LAYING_OF_SEPARATION_MEMBRANE: 'laying-of-separation-membrane',
  LAYING_OF_PAVEMENT_QUALITY_CONCRETE: 'laying-of-pavement-quality-concrete',
  BACKFILLING: 'backfilling',
  BRICKS_WORK: 'bricks-work',
  CUTTING_OF_SOIL: 'cutting-of-soil',
  FIXING_GEO_CELL: 'fixing-geo-cell',
  FIXING_OF_MESH: 'fixing-of-mesh',
  LAYING_OF_GRASS_TURF: 'laying-of-grass-turf',
  LAYING_OF_TOP_SOIL: 'laying-of-top-soil',
  PLACING_AND_JOINTING_OF_CHUTE_MEMBERS:
    'placing-and-jointing-of-chute-members',
  PIT_EXCAVATION: 'pit-exacavtion',
  PLANTING_GRASS: 'planting-grass',
  PLANTING_TREES: 'planting-trees',
  PREPARATION_OF_SOIL: 'preparation-of-soil',
  SPREADING_OF_GRASS_SEEDS: 'spreading-of-grass-seeds',
  WATERING: 'watering',
  PLANTATION: 'plantation',
  STONE_PITCHING: 'stone-pitching',
  //other work form
  FIXING_INVERTER_INSTALLATION: 'fixing-inverter-installation',
  ERECTION_OF_DOUBLE_POLE_STRUCTURE: 'erection-of-double-pole-structure',
  FIXING_OF_MC4_Y_CONNECTOR: 'fixing-of-mc4-y-connector',
  FIXING_OF_MMS: 'fixing-of-mms',
  FIXING_OF_MODULES: 'fixing-of-modules',
  LAYING_OF_CAUTION_TAPE: 'laying-of-caution-tape',
  ROUTE_MARKING: 'route-marking',
  BRICKS_LAYERING: 'bricks-layering',
  CABLE_DRESSING: 'cable-dressing',
  CABLE_TRENCH_DRESSING: 'cable-trench-dressing',
  CONDUIT_LAYING: 'conduit-laying',
  CABLE_TRENCH_EXCAVATION: 'cable-trench-excavation',
  FIXING_AND_INSTALLATION_OF_TRANSFORMER:
    'fixing-and-installation-of-transformer',
  FIXING_AND_INSTALLATION_OF_LT_PANEL: 'fixing-and-installation-of-lt-panel',
  FIXING_AND_INSTALLATION_OF_SERVO: 'fixing-and-installation-of-servo',
  FIXING_AND_INSTALLATION_OF_MCB: 'fixing-and-installation-of-mcb',
  FIXING_AND_INSTALLATION_OF_INVERTOR: 'fixing-and-installation-of-invertor',
  FIXING_AND_INSTALLATION_OF_HT_PANEL: 'fixing-and-installation-of-ht-panel',
  //HT_PANEL_INSTALLATION: 'fixing-and-installation-of-ht-panel', //to-be-updated
  ERECTION_OF_STRUCTURE: 'erection-of-structure',
  FABRICATION_OF_STRUCTURE: 'fabrication-of-structure',
  FIXING_OF_PANELS: 'fixing-of-panels',
  ERECTION_OF_PRECAST_COLUMN: 'erection-of-pre-cast-column',
  ERECTION_OF_BUS_SHELTER: 'erection-of-bus-shelter',
  ERECTION_OF_ANGLE_SECTION: 'erection-of-angle-sections',
  PLACING_OF_PRE_CAST_RCC_PANELS: 'placing-of-precast-rcc-panels',
  PLACING_OF_CHAIN_LINK: 'placing-of-chain-link',
  MORTAR_CHECKLIST: 'mortar',
  FLOORING: 'flooring',
  SIGNAGE_LOCATION_IDENTIFICATION: 'signage-location-identification',
  BACKFILL: 'backfill',
  PLACEMENT_OF_SIGNAGE_SHEET: 'placement-of-signage-sheet',
  FIXING_OF_TRAFFIC_IMPACT_ATTENUATORS: 'fixing-of-traffic-impact-attenuators',
  FIXING_OF_SPRING_POST: 'fixing-of-spring-posts',
  FIXING_OF_SOLAR_ROAD_STUDS: 'fixing-of-solar-road-studs',
  FIXING_OF_SOLAR_BLINKERS: 'fixing-of-solar-blinkers',
  FIXING_OF_ROAD_STUDS: 'fixing-of-road-studs',
  FIXING_OF_ROAD_DELINEATORS: 'fixing-of-road-delineator',
  FIXING_OF_OBJECT_MARKERS: 'fixing-of-object-markers',
  FIXING_OF_NOISE_BARRIER: 'fixing-of-noise-barrier',
  FIXING_OF_LED_TRAFFIC_BLINKERS: 'fixing-of-led-traffic-blinkers',
  FIXING_OF_HAZARD_MARKERS: 'fixing-of-hazard-markers',
  FIXING_OF_FLEXIBLE_MEDIAN_MARKERS: 'fixing-of-flexible-median-markers',
  FIXING_OF_CONVEX_MIRRORS: 'fixing-of-convex-mirrors',
  FIXING_OF_ANTIGLARES: 'fixing-of-antiglares',
  FABRICATION_OF_BUS_SHELTER: 'fabrication-of-bus-shelter',
  ERECTION_OF_POLES: 'erection-of-pole',
  FIXING_OF_ARMS: 'fixing-of-arm',
  INSTALLATION_OF_LED_LIGHTS: 'installation-of-led-light',
  LAYING_OF_FLEXIBLE_CABLE: 'laying-of-flexible-cable',
  LAYING_OF_LT_CABLE: 'laying-of-lt-cable',
  FIXING_OF_STONE: 'fixing-of-stone',
  PLASTERING: 'plastering',
  PUTTY: 'putty',
  HVAC_WORK: 'havc-work',
  CEILING_WORK: 'ceiling-work',
  FURNITURE_WORK: 'furniture-work',
  DOOR_WORKS: 'doors-work',
  WINDOW_WORKS: 'windows-work',
  GLASS_WORKS: 'glass-work',
  ELECTRICAL_WORK: 'electrical-work',
  PLUMBING_WORK: 'plumbing-work',
  FLOORING_WORK: 'flooring-work',
  EXCAVATION_OF_TRENCH: 'excavation-of-trench',
  LAYING_OF_DUCT: 'laying-of-duct',
  HDD_CROSSING: 'hdd-crossing',
  CONSTRUCTION_OF_CHAMBER: 'construction-of-chamber',
  INSTALLATION_OF_EQUIPMENT: 'installation-of-equipment',
  INSTALLATION_OF_SOLAR_SYSTEM: 'installation-of-solar-system',
  INSTALLATION_OF_NETWORK_DEVICES: 'installation-of-network-devices',
  CONSTRUCTION_OF_CONTROL_ROOM: 'construction-of-control-room',
  CONSTRUCTION_OF_FOUNDATION: 'construction-of-foundation',
  CASTING_OF_BALLAST: 'casting-of-ballast',
  SAND_LAYER: 'sand-layer',
  PLACING_AND_JOINTING_CHUTE_MEMBERS: 'placing-and-jointing-ofchute-members',
  LAYING_OF_PQC: 'N/A',
};

export const TEST_CLASSIFICATION_TYPES = {
  THIRD_PARTY_LAB_TEST: 'third-party-lab-test',
  FIELD_LAB_TEST: 'field-lab-test',
  PROCUREMENT_DETAILS: 'procurement-details',
  MIX_DESIGN: 'mix-design',
  SOURCE_APPROVALS: 'source-approvals',
  UPLOAD_MTC: 'upload-mtc',
  EQUIPMENT_CALIBRATION: 'equipment-calibration',
};

export const TEST_WORK_CATEGORY_TYPES = {
  CONCRETE_STRUCTURE: 'concrete-structure',
  CONCRETE_RIGID_PAVEMENT: 'concrete-rigid-pavement',
  BITUMINOUS_WORKS: 'bituminous-works',
  EARTH_WORKS: 'earth-work',
  SUB_BASE: 'sub-base',
  BASE_SUB_BASE: 'base-sub-base',
  STEEL: 'steel',
  BEARING: 'bearings',
  EXPANSION_JOINT: 'expansion-joints',
  PRESTRESSING: 'prestressing',
};

export const TEST_MATERIALS_TYPES = {
  COARSE_AGGREGATE_DBM_BC: 'coarse-aggregate-dbm-bc',
  BITUMEN: 'bitumen',
  COARSE_AGGREGATE_MICRO_SURFACING: 'coarse-aggregate-micro-surfacing',
  COARSE_AGGREGATE_SMA: 'coarse-aggregate-sma',
  EMULSION: 'emulsion',
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
  SMA: 'sma',
  MICRO_SURFACING: 'micro-surfacing',
  DBM_RAP_DBM: 'dbm-rap-dbm',
  BC: 'bc',
  SOIL: 'soil',
  FLY_ASH: 'fly-ash',
  CTSB: 'ctsb',
  GSB: 'gsb',
  COARSE_AGGREGATE_WMM: 'coarse-aggregate-wmm',
  FINE_AGGREGATE_WMM: 'fine-aggregate-wmm',
  WMM: 'wmm',
  STRUCTURAL_STEEL: 'structural-steel',
  BEARING: 'bearing',
  EXPANSION_JOINT: 'expansion-joints',
  REINFORCEMENT: 'reinforcement',
  DLC: 'dlc',
  PQC: 'pqc',
  SHEATHING_DUCT: 'sheathing-duct',
  STRANDS: 'strands',
};

export const TEST_TYPES = {
  CORE_TEST: 'core-test',
  CUBE_TEST: 'cube-test',
  FLEXURAL_STRENGTH: 'flexural-strength',
  SLUMP_TEST: 'slump-test',
  UPV_TEST: 'upv-test',
  REBOUND_HAMMER_TEST: 'rebound-hammer-test',
  COMPRESSIVE_STRENGTH: 'compressive-strength',
  SOUNDNESS: 'soundness',
  NATURAL_MOISTURE_CONTENT: 'natural-moisture-content',
  SILT_CONTENT: 'silt-content',
  GRADATION: 'gradation',
  PETROGRAPHIC_EXAMINATION: 'petrographic-examination',
  AGGREGATE_IMPACT_VALUE: 'aggregate-impact-value',
  SPECIFIC_GRAVITY_AND_WATER_ABSORPTION:
    'specific-gravity-and-water-absorption',
  FI_EI: 'fi-ei',
  LOS_ANGELES_ABRATION: 'los-angeles-abration',
  ALKALI_AGGREGATE_REACTIVITY: 'alkali-aggregate-reactivity',
  POLISHED_STONE_VALUE: 'polished-stone-value',
  SAND_EQUIVALENT_VALUE: 'sand-equivalent-value',
  STRIPPING_VALUE_TEST: 'stripping-value-test',
  FINENESS_CONSISTENCY_INITIAL_AND_FINAL_SETTING_TIME:
    'fineness-consistency-initial-and-final-setting-time',
  //Bituminous work
  BINDER_CONTENT: 'binder-content',
  DENSITY_OF_COMPACTED_LAYER: 'density-of-compacted-layer',
  STABILITY_AND_VOID_ANALYSIS:
    'stability-and-void-analysis-of-mix-including-theoretical-maximum-specific-of-loose-mix',
  MIX_GRADING: 'mix-grading',
  BC_MIX_GRADE_1: 'bc-mix-grade_1',
  BC_MIX_GRADE_2: 'bc-mix-grade_2',
  DBM_MIX_GRADING_1: 'dbm-mix-grading-1',
  DBM_MIX_GRADING_2: 'dbm-mix-grading-2',
  SOFTENING_POINT: 'sofetning-point',
  FLASH_FIRE_POINTS: 'flash-and-fire-point',
  DUCTILITY_TEST: 'ductility-test',
  PENETRATION_TEST: 'penetration-test',
  WATER_ABSORPTION: 'water-absorption',
  WATER_ABSORPTION_OF_AGGREGATES: 'water-absorption-of-aggregates',
  MICRO_SURFACING_GRADATION: 'micro-surfacing-gradation',
  SAND_EQUIVALENT: 'sand-equivalent-test',
  PERCENTAGE_OF_FRACTURE_FACE: 'percentage-of-fracture-face',
  //EarthWork
  MOISTURE_CONTENT: 'moisture-content-prior-compaction',
  FREE_SWELL_INDEX: 'free-swell-index-test',
  GRAIN_SIZE_ANALYSIS: 'grain-size-analysis',
  PROCTOR_DENSITY_TEST: 'proctor-density-test',
  FIELD_DRY_DENSITY: 'field-dry-density',
  CBR_TEST: 'cbr-test',
  PLASTICITY_INDEX: 'plasticity-index',
  //SubBase && Base_SubBase
  ATTERBEG_LIMIT_TEST: 'atterberg-limit-test',
  GRADING_OF_AGGREGATE: 'grading-aggregate',
  //Bearing
  ULTRASONIC_TEST: 'ultra-sonic-test',
  SURFACE_FINISH_OF_SS_PLATE: 'surface-finish-of-s.s.-plate',
  PISTON_ROUGHNESS: 'piston-roughness',
  PHYSICAL_VISUAL_DIMENSIONS: 'physical-visual-and-dimensions-test',
  PAINT_THICKNESS_TEST: 'paint-thickness',
  COMPRESSION_VERTICAL_LOAD: 'compression-vertical-load-test',
  COMBINED_VERTICAL_HORIZONTAL_LOAD:
    'combined-vertical-and-horizontal-load-test',
  CHROME_THICKNESS_TEST: 'chrome-thickness',
  //Expansion Joint
  ANCHORAGE_PULL_OUT_TEST: 'anchorage-pull-out-test',
  DERBIS_EXPULSION_TEST: 'debris-expulsion-test',
  DYE_PENETRATION_TEST: 'dye-penetration-test',
  PONDING_TEST: 'ponding-test',
  SEAL_PULL_TEST: 'seal-pull-test',
  CYCLIC_MOTION_TEST: 'cyclic-motion-test',
  VISUAL_DIMENSION_TEST: 'visual-and-dimension-test',
};

export const YES_NO_LIST = [
  {
    label: 'Yes',
    value: 'Y',
  },
  {
    label: 'No',
    value: 'N',
  },
  {
    label: 'NA',
    value: 'NA',
  },
];
export const BEARING_TYPE_LIST = [
  {
    label: 'Elastomeric Bearing',
    value: 'elastomeric-bearing',
  },
  {
    label: 'Pot Bearing - Free',
    value: 'pot-bearing-free',
  },
  {
    label: 'Pot Bearing - Fixed',
    value: 'pot-bearing-fixed',
  },
  {
    label: 'Pot Bearing - Lateral Guided',
    value: 'pot-bearing-lateral-guided',
  },
  {
    label: 'Pot Bearing - Horizontal Guided',
    value: 'pot-bearing-horizontal-guided',
  },
  {
    label: 'Spherical Bearing - Free',
    value: 'spherical-bearing-free',
  },
  {
    label: 'Spherical Bearing - Fixed',
    value: 'spherical-bearing-fixed',
  },
  {
    label: 'Spherical Bearing - Lateral Guided',
    value: 'spherical-bearing-lateral-guided',
  },
  {
    label: 'Spherical Bearing - Horizontal Guided',
    value: 'spherical-bearing-horizontal-guided',
  },
];
export const EXPANSION_JOINT_TYPE_LIST = [
  {
    label: 'Reinforced Elastomeric Joint',
    value: 'reinforced-elastomeric-joint',
  },
  {
    label: 'Single Strip Seal Joint',
    value: 'single-strip-seal-joint',
  },
  {
    label: 'Single Box Seal Joint',
    value: 'single-box-seal-joint',
  },
  {
    label: 'Modular Strip Seal Expansion Joints',
    value: 'modular-strip-seal-expansion-joints',
  },
  {
    label: 'Modular Box Seal Expansion Joints',
    value: 'modular-box-seal-expansion-joints',
  },
  {
    label: 'Asphaltic Plug Joint',
    value: 'asphaltic-plug-joint',
  },
  {
    label: 'Compression Seal Joint',
    value: 'compression-seal-joint',
  },
];
export const DIAMETER_REINFORCEMENT = [
  {
    label: '8',
    value: '8',
  },
  {
    label: '10',
    value: '10',
  },
  {
    label: '12',
    value: '12',
  },
  {
    label: '16',
    value: '16',
  },
  {
    label: '20',
    value: '20',
  },
  {
    label: '25',
    value: '25',
  },
  {
    label: '32',
    value: '32',
  },
  {
    label: '36',
    value: '36',
  },
];
export const GRADE_REINFORCEMENT = [
  {
    label: 'Fe 415',
    value: 'Fe 415',
  },
  {
    label: 'Fe 500',
    value: 'Fe 500',
  },
  {
    label: 'Fe 500 D',
    value: 'Fe 500 D',
  },
  {
    label: 'Fe 550 D',
    value: 'Fe 550 D',
  },
  {
    label: 'Fe 600',
    value: 'Fe 600',
  },
];
export const GRADE_STRUCTURE_STEEL = [
  {
    label: 'MS',
    value: 'MS',
  },
  {
    label: 'E 350',
    value: 'E 350',
  },
  {
    label: 'E450',
    value: 'E450',
  },
];
export const YES_NO_NA_LIST = [
  {
    label: 'Yes',
    value: 'Y',
  },
  {
    label: 'No',
    value: 'N',
  },
  {
    label: 'NA',
    value: 'NA',
  },
];

export const SAMPLE_BY_LIST = [
  {
    label: 'Concessionaire',
    value: 'Concessionaire',
  },
  {
    label: 'Jointly',
    value: 'Jointly',
  },
];

export const SAMPLE_BY_LIST_THIRD_PARTY = [
  {
    label: 'Concessionaire',
    value: 'Concessionaire',
  },
  {
    label: 'Jointly',
    value: 'Jointly',
  },
  {
    label: 'Third Party',
    value: 'Third Party',
  },
];

export const TEST_CONDUCTED_BY_LIST = [
  {
    label: 'Concessionaire',
    value: 'Concessionaire',
  },
  {
    label: 'Jointly',
    value: 'Jointly',
  },
];

export const TYPE_OF_CONCRETE_SURFACE_LIST = [
  {
    label: 'Wearing surface',
    value: 'Wearing surface',
  },
  {
    label: 'Other concrete works',
    value: 'Other concrete works',
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
    label: 'M20',
    value: 'M20',
  },
  {
    label: 'M25',
    value: 'M25',
  },
  {
    label: 'M30',
    value: 'M30',
  },
  {
    label: 'M35',
    value: 'M35',
  },
  {
    label: 'M40',
    value: 'M40',
  },
  {
    label: 'M45',
    value: 'M45',
  },
  {
    label: 'M50',
    value: 'M50',
  },
  {
    label: 'M55',
    value: 'M55',
  },
  {
    label: 'M60',
    value: 'M60',
  },
  {
    label: 'M65',
    value: 'M65',
  },
  {
    label: 'M70',
    value: 'M70',
  },
  {
    label: 'M75',
    value: 'M75',
  },
  {
    label: 'M80',
    value: 'M80',
  },
];

export const CEMENT_GRADE_LIST = [
  {
    label: 'OPC 43',
    value: 'OPC43',
  },
  {
    label: 'OPC 53',
    value: 'OPC53',
  },
];

export const CEMENT_TYPE_LIST = [
  {
    label: 'OPC',
    value: 'OPC',
  },
  {
    label: 'II ISOPC',
    value: 'II ISOPC',
  },
];
