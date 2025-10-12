import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 8,
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ABBEFD',
    overflow: 'hidden',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ABBEFD',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandCollapseIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionsContainer: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  sectionContent: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    marginVertical: 3,
    marginHorizontal: 5,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 12,
  },
  inputGridItem: {
    width: '100%',
    marginBottom: 12,
  },
  // --- UPDATED FOR CONSISTENCY: inputLabel and dataLabel styles are merged ---
  // The 'dataLabel' style is updated to match the 'inputLabel' (bold/semiblod and color)
  inputLabel: {
    fontSize: 14,
    fontWeight: '600', // Made this slightly bolder for consistency
    color: '#333',
    marginBottom: 3,
    // fontStyle: 'italic',
  },
  dataLabel: {
    fontSize: 13,
    fontWeight: '600', // MATCHES inputLabel
    color: '#333', // MATCHES inputLabel
    marginBottom: 3,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400', // Kept value less bold than label
  },
  // --------------------------------------------------------------------------
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 2,
  },
  // --- RADIO STYLES ---
  radioInputsContainer: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 0,
    marginTop: 5,
  },
  radioComponentContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  radioLabelWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  // NOTE: radioLabelText is removed as inputLabel is used directly in YesNoRadioInput
  radioGroupRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 35,
  },
  radioButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: '100%',
    borderRadius: 6,
    borderWidth: 1,
  },
  unselectedRadioButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0D0D0',
  },
  radioTextUnselected: {
    color: '#666',
    fontWeight: '500',
    fontSize: 13,
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  radioErrorOuterBorder: {},
  // --- DROPDOWN STYLES ---
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  dropdownValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  inputErrorBorder: {
    borderColor: 'red',
    borderWidth: 2,
  },
  notesText: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionInfoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic',
    marginRight: 5,
  },
  nestedScroll: {
    flexGrow: 0,
    paddingVertical: 0,
  },
  recursiveContainer: {
    marginHorizontal: 0,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#C0C6FF',
  },
  nonExpandableSection: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    overflow: 'hidden',
  },
  nonExpandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
  },
  expandableSectionContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    overflow: 'hidden',
  },
  mainInfoContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: '#e0e0e0',
  },
  mainInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 10,
    marginBottom: 8,
    width: '100%',
  },
});

export default styles;
