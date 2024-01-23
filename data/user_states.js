const basicInfoSurveyHandler = require('../basic_info_survey_handler');

const user_states = {
    major_states: [
        {
            state_id: "property_searching",
            minor_states: [
                {
                    state_id: "waiting",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "added"
                },
                {
                    state_id: "added",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "basic_info_registered"
                },
                {
                    state_id: "basic_info_registered",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "search_condition_added"
                },
                {
                    state_id: "search_condition_added",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "end"
                }
            ],
            next: "property_selected"
        },
        {
            state_id: "property_selected",
            minor_states: [
                {
                    state_id: "purchase_confirmation_prep",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "purchase_confirmation_ready"
                },
                {
                    state_id: "purchase_confirmation_ready",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "bank_sounding_prep"
                },
                {
                    state_id: "bank_sounding_prep",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "bank_sounding_ready"
                },
                {
                    state_id: "bank_sounding_ready",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "contract_prep"
                },
                {
                    state_id: "contract_prep",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "contract_ready"
                },
                {
                    state_id: "contract_ready",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "payment_prep"
                },
                {
                    state_id: "payment_prep",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "payment_ready"
                },
                {
                    state_id: "payment_ready",
                    actions_on_transition: {},
                    permitted_actions: {},
                    next: "end"
                }
            ],
            next: "end"
        }
    ]
    ,
    actions: [
        {
            action_id: "basic_info_registeration",
            survey_id: "basic_info",
            steps: [
                {
                    step_id: "name_primary",
                    next: "name_kana"
                },
                {
                    step_id: "name_kana",
                    next: "postal_code"
                },
                {
                    step_id: "postal_code",
                    next: "address"
                },
                {
                    step_id: "address",
                    next: "residence_category"
                },
                {
                    step_id: "residence_category",
                    next: "email_address"
                },
                {
                    step_id: "email_address",
                    next: "phone_number"
                },
                {
                    step_id: "phone_number",
                    next: "workplace_name"
                },
                {
                    step_id: "workplace_name",
                    next: "workplace_address"
                },
                {
                    step_id: "workplace_address",
                    next: "department"
                },
                {
                    step_id: "department",
                    next: "length_of_service"
                },
                {
                    step_id: "length_of_service",
                    next: "gross_salary_-1"
                },
                {
                    step_id: "gross_salary_-1",
                    next: "gross_salary_-2"
                },
                {
                    step_id: "gross_salary_-2",
                    next: "gross_salary_-3"
                },
                {
                    step_id: "gross_salary_-3",
                    next: "family_structure_spouse"
                },
                {
                    step_id: "family_structure_spouse",
                    next: "family_structure_children"
                },
                {
                    step_id: "family_structure_children",
                    next: "borrowed_money"
                },
                {
                    step_id: "borrowed_money",
                    next: "deposit"
                },
                {
                    step_id: "deposit",
                    next: "other_assets"
                },
                {
                    step_id: "other_assets",
                    next: "purchaser_category"
                },
                {
                    step_id: "purchaser_category",
                    next: "complete"
                },
                {
                    step_id: "complete",
                    next: "end",
                    text: "お客様情報の登録が完了いたしました、お疲れさまでした。"
                }
            ],
            trigger_text: ">お客様情報の登録/変更",
            handler: basicInfoSurveyHandler
        },
        {
            action_id: "basic_info_inquiry",
            trigger_text: ">お客様情報の照会"
        },
        {
            action_id: "search_condition",
            steps: [
                {
                    step_id: "price"
                },
                {
                    step_id: "target"
                },
                {
                    step_id: "area"
                },
                {
                    step_id: "structure"
                },
                {
                    step_id: "yield"
                },
                {
                    step_id: "complete"
                }
            ],
            trigger_text: ">希望物件条件の登録/更新"
        },
        {
            action_id: "search_condition_inquiry",
            trigger_text: ">希望物件条件の照会"
        },
        {
            action_id: "concierge_message",
            steps: [],
            trigger_text: ">担当者にメッセージ"
        },
        {
            action_id: "external_property",
            steps: [],
            trigger_text: ">他サイト物件を問い合わせる"
        },
        {
            action_id: "user_page",
            steps: [],
            trigger_text: ">"
        },
        {
            action_id: "purchase_confirmation",
            steps: [],
            trigger_text: ">"
        },
        {
            action_id: "bank_sounding",
            steps: [],
            trigger_text: ">"
        },
        {
            action_id: "contract",
            steps: [],
            trigger_text: ">"
        },
        {
            action_id: "payment_prep",
            steps: [],
            trigger_text: ">"
        }
    ]
}

module.exports = user_states