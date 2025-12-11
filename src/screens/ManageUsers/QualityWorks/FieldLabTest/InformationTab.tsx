import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import {getTestDetailsTab1, clearFormDetails} from './actions';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import DynamicTestForm from './DynamicTestForm';

const InformationTab = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const {tab1TestDetails, loading, error} = useSelector(
    (state: any) => state.FormDetails,
  );

  const formData = {
    mainTitle: 'Project & Material Testing',
    sections: [
      {
        title: 'Project Details & Safety Review (Mixed)',
        sectionInfo:
          'Fixed project data, regular checks, and radio controls combined.',
        type: 'expandable',
        items: [
          // --- Data Items (Rendered First) ---
          {label: 'Project Name', value: 'Elevated Expressway'},
          {label: 'Name of the Client', value: 'NHAI'},
          {
            label: 'Name of the Concessionaire',
            value: 'XYZ Infrastructure Ltd',
          },
          {
            label: 'Name of the EPC Contractor',
            value: 'PQR Constructions Pvt. Ltd',
          },
          // --- Regular Input Items (Rendered Second - None in this example, but they would go here) ---

          // --- Radio Input Items (Rendered Third) ---
          {
            id: 'trafficDiversionApproved',
            label: 'Traffic diversion plan approved',
            type: 'radio',
            value: 'Yes',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage: 'Traffic diversion status must be confirmed.',
            },
          },
          {
            id: 'safetyArrangements',
            label:
              'Whether all the safety arrangements including barricading are as per IRC SP 55',
            type: 'radio',
            value: 'NO',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage: 'Safety compliance must be confirmed.',
            },
          },
          {
            id: 'groundImprovementDone',
            label: 'Ground improvement is done if required',
            type: 'radio',
            value: 'NA',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage: 'Ground improvement status must be selected.',
            },
          },
          {
            id: 'gradeSurveyStakes1',
            label:
              'Adequate grade and survey stakes available for control of layer placement',
            type: 'radio',
            value: 'NO',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage:
                'Grade and survey stake availability must be checked.',
            },
          },
        ],
      },
      {
        title: 'Test Parameters & Results (Mixed)',
        sectionInfo: 'Contains only data and regular/radio inputs for testing.',
        type: 'expandable',
        items: [
          {
            id: 'inspectionConductedBy',
            label: 'Inspection conducted by',
            type: 'select',
            value: 'pending',
            placeholder: 'Select who conducted the inspection',
            validations: {
              required: true,
              type: 'string',
              minLength: null,
              maxLength: null,
              min: null,
              max: null,
              decimalPlaces: null,
              options: [
                {
                  label: 'Concessionaire',
                  key: 'Concessionaire',
                },
                {
                  label: 'Jointly',
                  key: 'Jointly',
                },
              ],
              errorMessage: 'Please select who conducted the inspection.',
            },
          },
          {
            id: 'dateOfInspection',
            label: 'Date of inspection',
            type: 'date',
            value: null,
            placeholder: 'YYYY-MM-DD',
            validations: {
              required: true,
              type: 'date',
              min: '2024-01-01',
              max: null,
              decimalPlaces: null,
              minLength: null,
              maxLength: null,
              options: null,
              errorMessage:
                'The date of inspection is required and must be after January 1st, 2024.',
            },
          },
          {
            title: 'A) Preparation of Area for Lifting at Stacking Yard',
          },
          {
            id: 'area_is_hard_barricaded_with_proper_signages',
            label: 'Area is hard barricaded with proper signages',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Area is hard barricaded with proper signages. This inspection checkpoint must be checked.',
              type: 'string',
            },
          },
          {
            id: 'temporary_lights_for_proper_illumination_of_the_erection_area_is_available_at_night',
            label:
              'Temporary lights for proper illumination of the erection area is available at night',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Temporary lights for proper illumination of the erection area is available at night. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'flag_manmarshal_available',
            label: 'Flag man/Marshal available',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Flag man/Marshal available. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'methodology_scheme_for_lifting_and_stacking_is_available_at_site',
            label:
              'Methodology & Scheme for lifting and stacking is available at site',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Methodology & Scheme for lifting and stacking is available at site. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            title: 'B) Tools and Tackles for lifting at Stacking Yard',
          },
          {
            id: 'de_shackles_and_slings_of_proper_capacity_and_their_test_certificate_by_third_party_is_available',
            label:
              'De-shackles and slings of proper capacity and their test certificate by third party is available',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'De-shackles and slings of proper capacity and their test certificate by third party is available. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'safety_color_code_present_on_the_de_shackles',
            label: 'Safety color code present on the de-shackles',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Safety color code present on the de-shackles. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'hydraulic_jacks_are_in_good_condition_with_proper_calibration_certificates',
            label:
              'Hydraulic jacks are in good condition with proper calibration certificates',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Hydraulic jacks are in good condition with proper calibration certificates. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'limit_switch_of_lifting_hoist_is_working_properly',
            label: 'Limit switch of lifting hoist is working properly',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Limit switch of lifting hoist is working properly. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'cotter_pin_are_placed_in_all_lifting_assembly',
            label: 'Cotter pin are placed in all lifting assembly',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Cotter pin are placed in all lifting assembly. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'macalloy_bars_pins_for_lifting_of_segments_in_proper_condition',
            label:
              'Macalloy Bars / pins for lifting of segments in proper condition',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Macalloy Bars / pins for lifting of segments in proper condition. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            title: 'C) Lifting of Segment at Stacking Yard',
          },
          {
            id: 'work_at_height_permit_obtained_from_ieconcerned_agency',
            label: 'Work at height permit obtained from IE/concerned agency',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Work at height permit obtained from IE/concerned agency. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'all_mac_alloy_bars_and_wire_rope_assemblies_have_valid_third_party_test_certificate',
            label:
              'All Mac-alloy bars and wire rope assemblies have valid third-party test certificate',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'All Mac-alloy bars and wire rope assemblies have valid third-party test certificate. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'lifting_sequence_as_per_the_approved_methodology_provided_at_site_for_counter',
            label:
              'Lifting sequence as per the approved methodology provided at site for counter',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Lifting sequence as per the approved methodology provided at site for counter. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'lifting_holes_are_in_proper_location_as_per_approved_drawing',
            label:
              'Lifting holes are in proper location as per approved drawing',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Lifting holes are in proper location as per approved drawing. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'lifting_arrangements_are_working_properly',
            label: 'Lifting arrangements are working properly',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Lifting arrangements are working properly. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'pre_stressing_duct_of_segments_are_clear_of_any_foreign_materials',
            label:
              'Pre-stressing duct of segments are clear of any foreign materials',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Pre-stressing duct of segments are clear of any foreign materials. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'comprehensive_strength_of_concrete_of_segments_are_gained_as_per_the_approved_drawing',
            label:
              'Comprehensive Strength of concrete of segments are gained as per the approved drawing',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Comprehensive Strength of concrete of segments are gained as per the approved drawing. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'slider_trolley_is_in_proper_position',
            label: 'Slider trolley is in proper position',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Slider trolley is in proper position. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            title: 'D) Segment dispatch and transportation',
          },
          {
            id: 'sand_blasting_on_match_cast_face_done',
            label: 'Sand blasting on match cast face done',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Sand blasting on match cast face done. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'repairing_if_necessary_finishing_done',
            label: 'Repairing (if necessary) & finishing done',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Repairing (if necessary) & finishing done. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'no_repairing_on_shearkey_gluing_location',
            label: 'No repairing on shearkey & gluing location',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'No repairing on shearkey & gluing location. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'bund_for_curing_at_top_removed_top_to_be_cleaned_by_broom',
            label:
              'Bund for curing at top removed & top to be cleaned by broom',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Bund for curing at top removed & top to be cleaned by broom. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'soffit_deck_top_cleaned_by_broomer',
            label: 'Soffit & deck top cleaned by broomer',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Soffit & deck top cleaned by broomer. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'sheathing_duct_is_cleaned_no_concrete_at_rubber_bunk_portion',
            label:
              'Sheathing duct is cleaned, no concrete at rubber bunk portion',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Sheathing duct is cleaned, no concrete at rubber bunk portion. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'sheathing_duct_alignment_ok_checked_by_drolly_passing',
            label: 'Sheathing duct alignment ok, checked by drolly passing',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Sheathing duct alignment ok, checked by drolly passing. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'temporary_stressing_hole_at_soffit_cleaned_dimension_checked',
            label:
              'Temporary stressing hole at soffit cleaned & dimension checked',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Temporary stressing hole at soffit cleaned & dimension checked. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'fitness_of_trailer_with_proper_calibration_certificate',
            label: 'Fitness of Trailer with proper calibration certificate',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Fitness of Trailer with proper calibration certificate. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'tyres_of_trailer_and_air_pressure_checked',
            label: 'Tyres of trailer and air pressure checked',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Tyres of trailer and air pressure checked. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            title: 'E) Preparation of Area for Lifting at Erection Site',
          },
          {
            id: 'ground_properly_leveled_for_placement_of_trailer',
            label: 'Ground properly leveled for placement of trailer',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Ground properly leveled for placement of trailer. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'area_is_hard_barricaded_with_proper_signages',
            label: 'Area is hard barricaded with proper signages',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Area is hard barricaded with proper signages. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'temporary_lights_for_proper_illumination_of_the_erection_area_is_available_at_night',
            label:
              'Temporary lights for proper illumination of the erection area is available at night',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Temporary lights for proper illumination of the erection area is available at night. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'flag_manmarshal_available',
            label: 'Flag man/Marshal available',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Flag man/Marshal available. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'methodology_scheme_for_lifting_and_stacking_is_available_at_site',
            label:
              'Methodology & Scheme for lifting and stacking is available at site',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Methodology & Scheme for lifting and stacking is available at site. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'crane_is_positioned_as_per_drawing',
            label: 'Crane is positioned as per drawing',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Crane is positioned as per drawing. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            title: 'F) Tools and Tackles for lifting at Erection Site',
          },
          {
            id: 'de_shackles_and_slings_of_proper_capacity_and_their_test_certificate_by_third_party_is_available',
            label:
              'De-shackles and slings of proper capacity and their test certificate by third party is available',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'De-shackles and slings of proper capacity and their test certificate by third party is available. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'safety_color_code_present_on_the_de_shackles',
            label: 'Safety color code present on the de-shackles',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Safety color code present on the de-shackles. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'hydraulic_jacks_are_in_good_condition_with_proper_calibration_certificates',
            label:
              'Hydraulic jacks are in good condition with proper calibration certificates',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Hydraulic jacks are in good condition with proper calibration certificates. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'limit_switch_of_lifting_hoist_is_working_properly',
            label: 'Limit switch of lifting hoist is working properly',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Limit switch of lifting hoist is working properly. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'cotter_pin_are_placed_in_all_lifting_assembly',
            label: 'Cotter pin are placed in all lifting assembly',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Cotter pin are placed in all lifting assembly. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'macalloy_bars_pins_for_lifting_of_wings_in_proper_condition',
            label:
              'Macalloy Bars / pins for lifting of Wings in proper condition',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Macalloy Bars / pins for lifting of Wings in proper condition. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'tpi_of_all_parts_of_cranes_slings_done',
            label: 'TPI of all parts of Cranes & Slings done',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'TPI of all parts of Cranes & Slings done. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'latest_tpi_certificates_of_all_parts_of_cranes_slings_available_at_site',
            label:
              'Latest TPI Certificates of all parts of Cranes & Slings available at Site',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Latest TPI Certificates of all parts of Cranes & Slings available at Site. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'counter_weights_are_available_placed_as_per_drawing',
            label: 'Counter-weights are available & placed as per drawing',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Counter-weights are available & placed as per drawing. This inspection checkpoint must be checked.',
              type: 'string',
            },
          },
          {
            title: 'G) Lifting and Positioning of segments',
          },
          {
            id: 'positioning_of_segment_marked',
            label: 'Positioning of segment marked',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Positioning of segment marked. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'traffic_properly_diverted_traffic_marshals_are_in_place',
            label: 'Traffic properly diverted & Traffic marshals are in place',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Traffic properly diverted & Traffic marshals are in place. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'safety_fitness_of_all_workers_working_at_height_checked_and_certified',
            label:
              'Safety & Fitness of all workers working at height checked and certified',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Safety & Fitness of all workers working at height checked and certified. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'all_safety_arrangements_are_placed_at_site',
            label: 'All Safety arrangements are placed at Site',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'All Safety arrangements are placed at Site. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'segments_positioned_at_the_specified_marked_location',
            label: 'Segments positioned at the specified / marked location',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Segments positioned at the specified / marked location. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
          {
            id: 'necessary_lateral_site_support_ensured_before_releasing_the_segment_by_cranes',
            label:
              'Necessary lateral / Site support ensured before releasing the segment by Cranes',
            type: 'radio',
            value: '',
            validations: {
              required: true,
              errorMessage:
                'Necessary lateral / Site support ensured before releasing the segment by Cranes. This inspection checkpoint must be checked.',
              type: 'string',
              options: [
                {
                  label: 'Y',
                  key: 'y',
                },
                {
                  label: 'N',
                  key: 'n',
                },
                {
                  label: 'NA',
                  key: 'na',
                },
              ],
            },
          },
        ],
      },
      {
        title: 'Inspection',
        sectionInfo: 'Contains only data and regular/radio inputs for testing.',
        type: 'expandable',
        items: [
          // --- Data Items (Rendered First - None in this list) ---

          // --- Regular Input Items (Rendered Second) ---
          {
            id: 'roomTemp',
            label: 'Room Temperature',
            type: 'number',
            value: '25.500',
            placeholder: 'Max 3 decimals',
            validations: {
              required: true,
              type: 'number',
              min: 15.0,
              max: 35.0,
              decimalPlaces: 3,
              errorMessage: 'Temperature is required.',
            },
          },
          {
            id: 'testType',
            label: 'Type of Test',
            type: 'select',
            value: 'ucs',
            placeholder: 'Select Test Type',
            validations: {
              required: true,
              type: 'string',
              options: [
                {key: 'ucs', label: 'UCS'},
                {key: 'flex', label: 'Flexural'},
              ],
              errorMessage: 'Test type required.',
            },
          },
          {
            id: 'humidity',
            label: 'Humidity (%)',
            type: 'number',
            value: '',
            placeholder: 'Enter humidity percentage',
            validations: {
              required: true,
              type: 'number',
              min: 0,
              max: 100,
              decimalPlaces: 0,
              errorMessage: 'Humidity required.',
            },
          },
          {
            id: 'testerName',
            label: 'Tested By (Name)',
            type: 'text',
            value: 'John Doe',
            placeholder: 'Enter full name',
            validations: {
              required: true,
              type: 'string',
              maxLength: 50,
              errorMessage: 'Name required.',
            },
          },
          // --- Radio Input Items (Rendered Third) ---
          {
            id: 'gradeSurveyStakes',
            label:
              'Adequate grade and survey stakes available for control of layer placement',
            type: 'radio',
            value: 'NO',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage: 'Stake availability must be checked.',
            },
          },
        ],
      },
      {
        title: 'Material Info (Data Only)',
        sectionInfo: 'Details about the materials used in the project.',
        type: 'info',
        items: [
          {label: 'Work category', value: 'Highway'},
          {label: 'Material Name', value: 'Fine Aggregate (Sand)'},
          {label: 'Material Category', value: 'Aggregate'},
          {label: 'Mix-design/ Source', value: 'River sand'},
        ],
      },
      // --- SUBSECTION 1 (Example of Nested Structure) ---
      {
        type: 'subSection',
        mainTitle: 'Sample 1',
        sections: [
          {
            title: 'General Info (Sample 1)',
            type: 'expandable',
            items: [
              {label: 'Sample ID', value: 'SAMP-001'},
              {label: 'Sample Location', value: 'Chainage 1+200'},
            ],
          },
          {
            title: 'Test Parameters & Results (Sample 1)',
            type: 'expandable',
            items: [
              {label: 'Project Name', value: 'Elevated Expressway'},
              {label: 'Name of the Client', value: 'NHAI'},
              {
                label: 'Name of the Concessionaire',
                value: 'XYZ Infrastructure Ltd',
              },
              {
                id: 'sample1_testerName',
                label: 'Tested By (Name)',
                type: 'text',
                value: 'Jane Doe',
                placeholder: 'Enter full name',
                validations: {
                  required: true,
                  type: 'string',
                  maxLength: 50,
                  errorMessage: 'Name required.',
                },
              },
              {
                id: 'sample1_resultValid',
                label: 'Sample Result Validated',
                type: 'radio',
                value: 'Yes',
                placeholder: 'Select Status',
                validations: {
                  required: true,
                  type: 'string',
                  errorMessage: 'Result status required.',
                },
              },
            ],
          },
        ],
      },
      // --- SUBSECTION 2 (Example of Nested Structure) ---
      {
        type: 'subSection',
        mainTitle: 'Sample 2',
        sections: [
          {
            title: 'General Info (Sample 2)',
            type: 'expandable',
            items: [
              {label: 'Sample ID', value: 'SAMP-002'},
              {label: 'Sample Location', value: 'Chainage 1+300'},
            ],
          },
        ],
      },
    ],
  };
  useEffect(() => {
    if (isFocused) {
      const payload = {
        projectId: '684181d57a306ccd976d8374',
        testWorkCategoryType: 'base-sub-base',
        materialType: 'ctb',
        testType: 'unconfined-compressive-strength',
        subTestTypes: '',
      };
      dispatch(getTestDetailsTab1(payload));
    }
    return () => {
      if (!isFocused) {
        dispatch(clearFormDetails());
      }
    };
  }, [isFocused, dispatch]);

  if (loading) {
    return (
      <View style={[styles.tabContent, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  } else {
    console.log('tab1TestDetails', tab1TestDetails);
  }

  if (error) {
    return (
      <View style={[styles.tabContent, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!tab1TestDetails || Object.keys(tab1TestDetails).length === 0) {
    return (
      <View style={[styles.tabContent, styles.centered]}>
        <Text style={styles.dataText}>No data available for this tab.</Text>
      </View>
    );
  }

  const {otherInfo, prebasicDetails} = tab1TestDetails.tab1;

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <View>
        <DynamicTestForm formData={formData} />
      </View>
      <Text style={styles.contentTitle}>Information Tab Content</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Information</Text>
        {otherInfo?.map((item: any, index: number) => (
          <Text key={index} style={styles.dataText}>
            {item.label}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pre-basic Details</Text>
        {prebasicDetails?.map((item: any, index: number) => (
          <Text key={index} style={styles.dataText}>
            {item.prebasicDetailsDisplayName || item.prebasicDetails}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  dataText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default InformationTab;
