"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_states = exports.globally_permitted_actions = void 0;
const survey_actions_1 = require("../actions/survey_actions");
const get_info_actions_1 = require("../actions/get_info_actions");
const general_actions_1 = require("../actions/general_actions");
const change_individual_data_action_1 = require("../actions/change_individual_data_action");
exports.globally_permitted_actions = ['terminate_action'];
const user_states_base = {
    major_states: [
        {
            state_id: 'property_searching',
            minor_states: [
                {
                    state_id: 'added',
                    actions_on_transition: [],
                    permitted_actions: [
                        'basic_info_update_or_reference',
                        'basic_info_registration',
                        'concierge_message',
                    ],
                    next: 'basic_info_registered',
                },
                {
                    state_id: 'basic_info_registered',
                    actions_on_transition: [],
                    permitted_actions: [
                        'basic_info_update_or_reference',
                        'basic_info_registration',
                        'basic_info_inquiry',
                        'search_condition_update_or_reference',
                        'search_condition',
                        'external_property',
                        'concierge_message',
                        'change_individual_user_property',
                    ],
                    next: 'search_condition_added',
                },
                {
                    state_id: 'search_condition_added',
                    actions_on_transition: [],
                    permitted_actions: [
                        'basic_info_update_or_reference',
                        'basic_info_registration',
                        'basic_info_inquiry',
                        'search_condition_update_or_reference',
                        'search_condition',
                        'search_condition_inquiry',
                        'external_property',
                        'concierge_message',
                        'change_individual_user_property',
                    ],
                    next: 'end',
                },
            ],
            next: 'property_selected',
        },
        {
            state_id: 'property_selected',
            minor_states: [
                {
                    state_id: 'purchase_confirmation_prep',
                    actions_on_transition: [],
                    permitted_actions: [],
                    next: 'purchase_confirmation_ready',
                },
                {
                    state_id: 'purchase_confirmation_ready',
                    actions_on_transition: [],
                    permitted_actions: [],
                    next: 'bank_sounding_prep',
                },
                {
                    state_id: 'bank_sounding_prep',
                    actions_on_transition: [],
                    permitted_actions: [],
                    next: 'bank_sounding_ready',
                },
                {
                    state_id: 'bank_sounding_ready',
                    actions_on_transition: [],
                    permitted_actions: [],
                    next: 'contract_prep',
                },
                {
                    state_id: 'contract_prep',
                    actions_on_transition: [],
                    permitted_actions: [],
                    next: 'contract_ready',
                },
                {
                    state_id: 'contract_ready',
                    actions_on_transition: [],
                    permitted_actions: [],
                    next: 'payment_prep',
                },
                {
                    state_id: 'payment_prep',
                    actions_on_transition: [],
                    permitted_actions: [],
                    next: 'payment_ready',
                },
                {
                    state_id: 'payment_ready',
                    actions_on_transition: [],
                    permitted_actions: [],
                    next: 'end',
                },
            ],
            next: 'end',
        },
    ],
    actions: [
        {
            action_id: 'terminate_action',
            trigger_text: ['>キャンセル'],
            handler: general_actions_1.terminateAction,
        },
        {
            action_id: 'error_terminate_action',
            steps: [
                {
                    step_id: 'terminate_or_continue',
                    next: 'end',
                },
            ],
            handler: general_actions_1.errorTerminateAction,
        },
        {
            action_id: 'basic_info_update_or_reference',
            steps: [
                {
                    step_id: 'update_or_reference',
                    next: 'end',
                },
            ],
            trigger_text: ['>お客様情報'],
            handler: survey_actions_1.handleBasicInfoUpdateOrReference, // `user`は適切な`User`型の変数に置き換えてください。
        },
        {
            action_id: 'basic_info_registration',
            survey_id: 'basic_info',
            steps: [
                {
                    step_id: 'name_primary',
                    next: 'name_kana',
                },
                {
                    step_id: 'name_kana',
                    next: 'postal_code',
                },
                {
                    step_id: 'postal_code',
                    next: 'address',
                },
                {
                    step_id: 'address',
                    next: 'residence_category',
                },
                {
                    step_id: 'residence_category',
                    next: 'email_address',
                },
                {
                    step_id: 'email_address',
                    next: 'phone_number',
                },
                {
                    step_id: 'phone_number',
                    next: 'workplace_name',
                },
                {
                    step_id: 'workplace_name',
                    next: 'workplace_address',
                },
                {
                    step_id: 'workplace_address',
                    next: 'position',
                },
                {
                    step_id: 'position',
                    next: 'job_category',
                },
                {
                    step_id: 'job_category',
                    next: 'length_of_service',
                },
                {
                    step_id: 'length_of_service',
                    next: 'gross_salary_-1',
                },
                {
                    step_id: 'gross_salary_-1',
                    next: 'gross_salary_-2',
                },
                {
                    step_id: 'gross_salary_-2',
                    next: 'gross_salary_-3',
                },
                {
                    step_id: 'gross_salary_-3',
                    next: 'family_structure_spouse',
                },
                {
                    step_id: 'family_structure_spouse',
                    next: 'family_structure_children',
                },
                {
                    step_id: 'family_structure_children',
                    next: 'borrowed_money',
                },
                {
                    step_id: 'borrowed_money',
                    next: 'deposit',
                },
                {
                    step_id: 'deposit',
                    next: 'other_assets',
                },
                {
                    step_id: 'other_assets',
                    next: 'purchaser_category',
                },
                {
                    step_id: 'purchaser_category',
                    next: 'complete',
                },
                {
                    step_id: 'complete',
                    next: 'end',
                    text: 'お疲れさまでした、お客様情報の登録が完了いたしました。まだの場合は、希望物件条件の登録にお進みください。',
                },
                {
                    step_id: 'quit_confirmation',
                    next: 'unknown',
                },
            ],
            handler: survey_actions_1.basicInfoSurveyHandler,
        },
        {
            action_id: 'basic_info_inquiry',
            handler: get_info_actions_1.handleGetUserInfoAction,
        },
        {
            action_id: 'change_individual_user_property',
            steps: [
                {
                    step_id: 'specify_property_to_change',
                    next: 'input_new_value',
                },
                {
                    step_id: 'input_new_value',
                    next: 'end',
                },
            ],
            trigger_text: ['>お客様情報の更新'],
            handler: change_individual_data_action_1.changeIndividualUserPropertyAction,
        },
        {
            action_id: 'search_condition_update_or_reference',
            steps: [
                {
                    step_id: 'update_or_reference',
                    next: 'end',
                },
            ],
            trigger_text: ['>希望物件条件'],
            handler: survey_actions_1.handleSearchConditionUpdateOrReference,
        },
        {
            action_id: 'search_condition',
            survey_id: 'property_conditions',
            steps: [
                {
                    step_id: 'price',
                    next: 'target',
                },
                {
                    step_id: 'target',
                    next: 'area',
                },
                {
                    step_id: 'area',
                    next: 'structure',
                },
                {
                    step_id: 'structure',
                    next: 'yield',
                },
                {
                    step_id: 'yield',
                    next: 'complete',
                },
                {
                    step_id: 'complete',
                    next: 'end',
                    text: 'お疲れさまでした、希望物件条件の登録が完了いたしました。担当が確認次第対応いたしますので今しばらくお待ちください。',
                },
                {
                    step_id: 'quit_confirmation',
                    next: 'unknown',
                },
            ],
            handler: survey_actions_1.searchConditionSurveyHandler,
        },
        {
            action_id: 'search_condition_inquiry',
            handler: get_info_actions_1.handleGetSearchConditionAction,
        },
        //TODO 次これ実装
        // {
        //     action_id: 'change_individual_search_condition',
        //     steps: [
        //         {
        //             step_id: 'specify_property_to_change',
        //             next: 'input_new_value',
        //         },
        //         {
        //             step_id: 'input_new_value',
        //             next: 'end',
        //         },
        //     ],
        //     trigger_text: ['>希望物件条件の変更'],
        //     handler: changeIndividualUserPropertyAction,
        // },
        {
            action_id: 'concierge_message',
            steps: [],
            trigger_text: ['>担当者にメッセージ'],
            handler: general_actions_1.messageToConcierge,
        },
        {
            action_id: 'external_property',
            steps: [
                {
                    step_id: 'select_method',
                    next: 'unknown',
                },
                {
                    step_id: 'send_url',
                    next: 'complete',
                },
                {
                    step_id: 'send_image',
                    next: 'complete',
                },
                {
                    step_id: 'send_pdf',
                    next: 'complete',
                },
                {
                    step_id: 'complete',
                    next: 'end',
                },
            ],
            trigger_text: ['>他サイト物件を問い合わせる'],
            handler: general_actions_1.externalPropertyAction,
        },
        {
            action_id: 'user_page',
            steps: [],
            trigger_text: ['>'],
        },
        {
            action_id: 'purchase_confirmation',
            steps: [],
            trigger_text: ['>'],
        },
        {
            action_id: 'bank_sounding',
            steps: [],
            trigger_text: ['>'],
        },
        {
            action_id: 'contract',
            steps: [],
            trigger_text: ['>'],
        },
        {
            action_id: 'payment_prep',
            steps: [],
            trigger_text: ['>'],
        },
    ],
};
const getUserStates = () => {
    user_states_base.major_states.forEach((major_state) => {
        major_state.minor_states.forEach((minor_state) => {
            minor_state.permitted_actions = minor_state.permitted_actions.concat(exports.globally_permitted_actions);
        });
    });
    return user_states_base;
};
exports.user_states = getUserStates();
