const db_data = {
    // host: process.env.DB_HOST,
    // user: process.env.DB_CLIENT_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,

//-----for test--------------------------------------
    host: "database-1.cb4ycsccwg4y.ap-northeast-1.rds.amazonaws.com",
    user: "admin",
    password: "7VtOtxEN22FEfHHiP6Pe",
    database: "official_cb_staging",
//-------------------------------------------------

    tables: {
        users: {
            name: "users",
            columns: {
                user_id: 'user_id',
                user_line_id: 'user_line_id',
                user_name: 'user_name',
                user_name_kana: 'user_name_kana',
                address_postal_code: 'address_postal_code',
                // TODO in the future: Implement postal code to prefecture
                // address_prefecture: 'address_prefecture',
                // address_remain: 'address_remain',
                address:'address',
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
                purchaser_category: 'purchaser_category'
            }
        }
    }
}

module.exports = db_data