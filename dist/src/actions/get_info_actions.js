"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetSearchConditionAction = exports.search_condition_columns = exports.handleGetUserInfoAction = exports.user_info_locations = void 0;
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const config_1 = require("../data/config");
const users_columns = config_1.db_data.tables.users.columns;
exports.user_info_locations = [
    {
        table_name: config_1.db_data.tables.users.name,
        columns: {
            user_name: users_columns.user_name,
            user_name_kana: users_columns.user_name_kana,
            address_postal_code: users_columns.address_postal_code,
            address: users_columns.address,
            residence_category: users_columns.residence_category,
            email_address: users_columns.email_address,
            phone_number: users_columns.phone_number,
            workplace_name: users_columns.workplace_name,
            workplace_address: users_columns.workplace_address,
            workplace_position: users_columns.workplace_position,
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
        },
    },
];
const handleGetUserInfoAction = (user, text) => __awaiter(void 0, void 0, void 0, function* () {
    const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
    let user_info = null;
    try {
        if (user.user_id) {
            user_info = (yield dbc.getInfoByUserId(user.user_id, exports.user_info_locations));
        }
        else {
            throw new Error('User id is not found');
        }
    }
    catch (err) {
        console.error(err);
    }
    if (user_info) {
        user.response.message = [
            {
                type: 'text',
                text: `名前: ${user_info.user_name}\n名前(カナ): ${user_info.user_name_kana}\n郵便番号: ${user_info.address_postal_code}\n住所: ${user_info.address}\n居住形態: ${user_info.residence_category}\nメールアドレス: ${user_info.email_address}\n電話番号: ${user_info.phone_number}\n職場名: ${user_info.workplace_name}\n職場住所: ${user_info.workplace_address}\n職場部署: ${user_info.workplace_position}\n職種: ${user_info.workplace_job_category}\n勤続年数: ${user_info.workplace_years_of_service}年\n前年度収入: ${user_info.gross_salary_minus_1}万円\n前々年度収入: ${user_info.gross_salary_minus_2}万円\n前々々年度収入: ${user_info.gross_salary_minus_3}万円\n配偶者の有無: ${user_info.family_structure_spouse ? 'あり' : 'なし'}\n子供の人数: ${user_info.family_structure_children}人\n借入金: ${user_info.borrowed_money}万円\n預金: ${user_info.deposit}万円\nその他資産: ${user_info.other_assets}万円\n購入者区分: ${user_info.purchaser_category}`,
            },
        ];
    }
    else {
        throw new Error('No userinfo found');
    }
    return user;
});
exports.handleGetUserInfoAction = handleGetUserInfoAction;
exports.search_condition_columns = [
    {
        table_name: config_1.db_data.tables.users.name,
        columns: {
            desired_price: users_columns.desired_price,
            desired_target: users_columns.desired_target,
            desired_area: users_columns.desired_area,
            desired_yield: users_columns.desired_yield,
        },
    },
    {
        table_name: config_1.db_data.tables.user_desired_structures.name,
        columns: {
            desired_structure: config_1.db_data.tables.user_desired_structures.columns.desired_structure,
        },
    },
];
// const search_condition_columns: SearchCondition = ;
const handleGetSearchConditionAction = (user, text) => __awaiter(void 0, void 0, void 0, function* () {
    const dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
    let search_condition = null;
    try {
        if (user.user_id) {
            search_condition = (yield dbc.getInfoByUserId(user.user_id, exports.search_condition_columns));
        }
        else {
            throw new Error('User id is not found');
        }
    }
    catch (err) {
        console.error(err);
    }
    if (search_condition) {
        user.response.message = [
            {
                type: 'text',
                text: `希望価格: ${search_condition.desired_price}\nターゲット層: ${search_condition.desired_target}\n希望エリア: ${search_condition.desired_area}\n構造: ${search_condition.desired_structure.join('、')}\n希望利回り: ${search_condition.desired_yield}`,
            },
        ];
    }
    else {
        throw new Error('No userinfo found');
    }
    return user;
});
exports.handleGetSearchConditionAction = handleGetSearchConditionAction;
