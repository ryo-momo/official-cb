"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.address_url = exports.db_data = void 0;
exports.db_data = {
    host: process.env.DB_HOST,
    user: process.env.DB_CLIENT_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    tables: {
        users: {
            name: 'users',
            columns: {
                user_id: 'user_id',
                user_line_id: 'user_line_id',
                user_name: 'user_name',
                user_name_kana: 'user_name_kana',
                address_postal_code: 'address_postal_code',
                // TODO in the future: Implement postal code to prefecture
                // address_prefecture: 'address_prefecture',
                // address_remain: 'address_remain',
                address: 'address',
                residence_category: 'residence_category',
                email_address: 'email_address',
                phone_number: 'phone_number',
                workplace_name: 'workplace_name',
                workplace_address: 'workplace_address',
                workplace_position: 'workplace_position',
                workplace_job_category: 'workplace_job_category',
                workplace_years_of_service: 'workplace_years_of_service',
                gross_salary_minus_1: 'gross_salary_minus_1',
                gross_salary_minus_2: 'gross_salary_minus_2',
                gross_salary_minus_3: 'gross_salary_minus_3',
                family_structure_spouse: 'family_structure_spouse',
                family_structure_children: 'family_structure_children',
                borrowed_money: 'borrowed_money',
                deposit: 'deposit',
                other_assets: 'other_assets',
                purchaser_category: 'purchaser_category',
                major_state_id: 'major_state_id',
                minor_state_id: 'minor_state_id',
                current_action_id: 'current_action_id',
                detour_action_id: 'detour_action_id',
                current_survey_id: 'current_survey_id',
                current_step_id: 'current_step_id',
                detour_step_id: 'detour_step_id',
                current_question_id: 'current_question_id',
                current_answers: 'current_answers',
                desired_price: 'desired_price',
                desired_target: 'desired_target',
                desired_area: 'desired_area',
                desired_yield: 'desired_yield',
            },
        },
        user_desired_structures: {
            name: 'user_desired_structures',
            columns: {
                user_id: 'user_id',
                desired_structure: 'desired_structure',
            },
        },
    },
};
exports.address_url = 'https://line.me/ti/p/HXmjosw19K';
