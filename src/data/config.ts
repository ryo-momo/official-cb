export interface UserTableColumns {
    user_id: string;
    user_line_id: string;
    user_name: string;
    user_name_kana: string;
    address_postal_code: string;
    address: string;
    residence_category: string;
    email_address: string;
    phone_number: string;
    workplace_name: string;
    workplace_address: string;
    workplace_department: string;
    workplace_job_category: string;
    workplace_years_of_service: string;
    gross_salary_minus_1: string;
    gross_salary_minus_2: string;
    gross_salary_minus_3: string;
    family_structure_spouse: string;
    family_structure_children: string;
    borrowed_money: string;
    deposit: string;
    other_assets: string;
    purchaser_category: string;
    major_state_id: string;
    minor_state_id: string;
    current_action_id: string;
    current_survey_id: string;
    current_step_id: string;
    current_question_id: string;
    current_answers: string;
    desired_price: string;
    desired_target: string;
    desired_area: string;
    desired_yield: string;
}

export interface UserDesiredStructuresTableColumns {
    user_id: string;
    desired_structure: string;
}

export interface UserDesiredStructuresTable {
    name: string;
    columns: { user_id: string; desired_structure: string };
}

export interface UsersTable {
    name: string;
    columns: UserTableColumns;
}

export interface Tables {
    users: UsersTable;
    user_desired_structures: UserDesiredStructuresTable;
}

export interface DbData {
    host: string;
    user: string;
    password: string;
    database: string;
    tables: Tables;
}

export const db_data: DbData = {
    // host: process.env.DB_HOST,
    // user: process.env.DB_CLIENT_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,

    //-----for test--------------------------------------
    host: 'database-1.cb4ycsccwg4y.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: '7VtOtxEN22FEfHHiP6Pe',
    database: 'official_cb_staging',
    //-------------------------------------------------

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
                workplace_department: 'workplace_department',
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
                current_survey_id: 'current_survey_id',
                current_step_id: 'current_step_id',
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

export const address_url = 'https://www.google.com';
