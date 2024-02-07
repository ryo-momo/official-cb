import { basicInfoSurveyHandler, searchConditionSurveyHandler } from '../actions/survey_action';
import {
    handleGetUserInfoAction,
    handleGetSearchConditionAction,
} from '../actions/get_info_action';
import { externalPropertyAction, messageToConcierge } from '../actions/general_action';

export interface MinorState {
    state_id: string;
    actions_on_transition: string[];
    permitted_actions: string[];
    next: string;
}

export interface MajorState {
    state_id: string;
    minor_states: MinorState[];
    next: string;
}

export interface Step {
    step_id: string;
    next: string;
    text?: string;
}

export interface BaseAction {
    action_id: string;
    trigger_text: string;
    handler?: Function;
}

export interface SurveyAction extends BaseAction {
    survey_id: string;
    steps: Step[];
    handler: Function;
}

export type Action = BaseAction | SurveyAction;

export interface UserStates {
    major_states: MajorState[];
    actions: Action[];
}

export const user_states: UserStates = {
    major_states: [
        {
            state_id: 'property_searching',
            minor_states: [
                {
                    state_id: 'added',
                    actions_on_transition: [],
                    permitted_actions: ['basic_info_registration', 'concierge_message'],
                    next: 'basic_info_registered',
                },
                {
                    state_id: 'basic_info_registered',
                    actions_on_transition: [],
                    permitted_actions: [
                        'basic_info_inquiry',
                        'search_condition',
                        'external_property',
                        'concierge_message',
                    ],
                    next: 'search_condition_added',
                },
                {
                    state_id: 'search_condition_added',
                    actions_on_transition: [],
                    permitted_actions: [
                        'search_condition_inquiry',
                        'external_property',
                        'concierge_message',
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
                    next: 'department',
                },
                {
                    step_id: 'department',
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
                    text: 'お客様情報の登録が完了いたしました、お疲れさまでした。',
                },
            ],
            trigger_text: '>お客様情報の登録/変更',
            handler: basicInfoSurveyHandler,
        },
        {
            action_id: 'basic_info_inquiry',
            trigger_text: '>お客様情報の照会',
            handler: handleGetUserInfoAction,
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
                },
            ],
            trigger_text: '>希望物件条件の登録/更新',
            handler: searchConditionSurveyHandler,
        },
        {
            action_id: 'search_condition_inquiry',
            trigger_text: '>希望物件条件の照会',
            handler: handleGetSearchConditionAction,
        },
        {
            action_id: 'concierge_message',
            steps: [],
            trigger_text: '>担当者にメッセージ',
            handler: messageToConcierge,
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
            trigger_text: '>他サイト物件を問い合わせる',
            handler: externalPropertyAction,
        },
        {
            action_id: 'user_page',
            steps: [],
            trigger_text: '>',
        },
        {
            action_id: 'purchase_confirmation',
            steps: [],
            trigger_text: '>',
        },
        {
            action_id: 'bank_sounding',
            steps: [],
            trigger_text: '>',
        },
        {
            action_id: 'contract',
            steps: [],
            trigger_text: '>',
        },
        {
            action_id: 'payment_prep',
            steps: [],
            trigger_text: '>',
        },
    ],
};
