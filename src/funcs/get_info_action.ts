import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { User } from '../classes/User';
import { db_data } from '../data/config';
import { Message } from './message_helper';

export interface UserInfo {
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
    workplace_years_of_service: number;
    gross_salary_minus_1: number;
    gross_salary_minus_2: number;
    gross_salary_minus_3: number;
    family_structure_spouse: number;
    family_structure_children: number;
    borrowed_money: number;
    deposit: number;
    other_assets: number;
    purchaser_category: string;
}

interface UserInfoColumns {
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
}

interface SearchCondition {
    desired_price: string;
    desired_target: string;
    desired_area: string;
    desired_structure: string[];
    desired_yield: string;
}

const users_columns = db_data.tables.users.columns;
export const user_info_columns: UserInfoColumns = {
    user_name: users_columns.user_name,
    user_name_kana: users_columns.user_name_kana,
    address_postal_code: users_columns.address_postal_code,
    address: users_columns.address,
    residence_category: users_columns.residence_category,
    email_address: users_columns.email_address,
    phone_number: users_columns.phone_number,
    workplace_name: users_columns.workplace_name,
    workplace_address: users_columns.workplace_address,
    workplace_department: users_columns.workplace_department,
    workplace_job_category: users_columns.workplace_job_category,
    workplace_years_of_service: users_columns.workplace_years_of_service,
    gross_salary_minus_1: users_columns.gross_salary_minus_1,
    gross_salary_minus_2: users_columns.gross_salary_minus_2,
    gross_salary_minus_3: users_columns.gross_salary_minus_3,
    family_structure_spouse: users_columns.family_structure_spouse,
    family_structure_children: users_columns.family_structure_children,
    borrowed_money: users_columns.borrowed_money,
    deposit: users_columns.deposit,
    other_assets: users_columns.other_assets,
    purchaser_category: users_columns.purchaser_category,
};

export async function handleGetUserInfoAction(user: User, text: string) {
    const dbc = new DatabaseCommunicator(db_data);
    let user_info: UserInfo | null = null;
    try {
        user_info = await dbc.getUserInfo(user.user_line_id);
    } catch (err) {
        console.error(err);
    }
    if (user_info) {
        user.response.message = {
            type: 'text',
            text: `名前: ${user_info.user_name}\n名前(カナ): ${
                user_info.user_name_kana
            }\n郵便番号: ${user_info.address_postal_code}\n住所: ${user_info.address}\n居住形態: ${
                user_info.residence_category
            }\nメールアドレス: ${user_info.email_address}\n電話番号: ${
                user_info.phone_number
            }\n職場名: ${user_info.workplace_name}\n職場住所: ${
                user_info.workplace_address
            }\n職場部署: ${user_info.workplace_department}\n職種: ${
                user_info.workplace_job_category
            }\n勤続年数: ${user_info.workplace_years_of_service}年\n前年度収入: ${
                user_info.gross_salary_minus_1
            }万円\n前々年度収入: ${user_info.gross_salary_minus_2}万円\n前々々年度収入: ${
                user_info.gross_salary_minus_3
            }万円\n配偶者の有無: ${
                user_info.family_structure_spouse ? 'あり' : 'なし'
            }\n子供の人数: ${user_info.family_structure_children}人\n借入金: ${
                user_info.borrowed_money
            }万円\n預金: ${user_info.deposit}万円\nその他資産: ${
                user_info.other_assets
            }万円\n購入者区分: ${user_info.purchaser_category}\n`,
        } as Message;
    } else {
        throw new Error('No userinfo found');
    }
    return user;
}

// const search_condition_columns: SearchCondition = ;

export function handleGetSearchConditionAction(user: User, text: string) {
    user.response.message = {
        type: 'text',
        text: '検索条件を入力してください',
    } as Message;
    return user;
}
