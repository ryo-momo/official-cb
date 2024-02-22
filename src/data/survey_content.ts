import { type FlexContainer } from '@line/bot-sdk';
import { db_data } from './config';
import { flex_message_contents } from './flex_message_content';

export interface QuestionOption {
    id: number;
    text: string;
}

export interface BaseQuestion {
    id: string;
    text?: string;
    text_secondary?: string;
    type: string;
    next: string | { [key: number]: string };
    related_table: string;
    related_column: string;
    design?: FlexContainer;
}

export interface TextQuestion extends BaseQuestion {
    type: 'text';
    next: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
    type: 'single-choice';
    options: QuestionOption[];
    next: { [key: number]: string };
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple-choice';
    options: QuestionOption[];
    choices_allowed: number;
    next: string;
}

export type Question = TextQuestion | SingleChoiceQuestion | MultipleChoiceQuestion;

export interface Survey {
    id: string;
    questions: Question[];
}

export interface SurveyContents {
    surveys: Survey[];
}

const user_columns = db_data.tables.users.columns;
const reiwa_year = 6;
export const survey_contents: SurveyContents = {
    surveys: [
        {
            id: 'basic_info',
            questions: [
                {
                    id: 'name_primary',
                    text: 'お客様のフルネームをお教えください。',
                    type: 'text',
                    next: 'name_kana',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.user_name,
                },
                {
                    id: 'name_kana',
                    text: 'お客様のフルネームをカタカナでお教えください。',
                    type: 'text',
                    next: 'postal_code',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.user_name_kana,
                },
                {
                    id: 'postal_code',
                    text: 'お客様のお住まいの郵便番号をお教えください。（数字のみ）',
                    type: 'text',
                    next: 'address',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.address_postal_code,
                },
                {
                    id: 'address',
                    text: 'お客様の住所をお教えください。',
                    type: 'text',
                    next: 'residence_category',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.address,
                },
                {
                    id: 'residence_category',
                    text: 'お客様の住居区分を以下からお選びください。',
                    type: 'single-choice',
                    options: [
                        {
                            id: 1,
                            text: '賃貸',
                        },
                        {
                            id: 2,
                            text: '持ち家',
                        },
                        {
                            id: 3,
                            text: '社宅',
                        },
                    ],
                    next: {
                        1: 'email_address',
                        2: 'email_address',
                        3: 'email_address',
                    },
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.residence_category,
                },
                {
                    id: 'email_address',
                    text: 'お客様のEメールアドレスをお教えください。',
                    type: 'text',
                    next: 'phone_number',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.email_address,
                },
                {
                    id: 'phone_number',
                    text: 'お客様の電話番号をお教えください。（数字のみ）',
                    type: 'text',
                    next: 'workplace_name',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.phone_number,
                },
                {
                    id: 'workplace_name',
                    text: 'お客様の職業についてお聞きします。まず、勤務先会社名をお教えください。',
                    type: 'text',
                    next: 'workplace_address',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.workplace_name,
                },
                {
                    id: 'workplace_address',
                    text: 'お客様の勤務先住所をお教えください。',
                    type: 'text',
                    next: 'position',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.workplace_address,
                },
                {
                    id: 'position',
                    text: 'お客様の役職をお教えください。',
                    type: 'text',
                    next: 'job_category',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.workplace_position,
                },
                {
                    id: 'job_category',
                    text: 'お客様の職種をお教えください。',
                    type: 'text',
                    next: 'years_of_service',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.workplace_job_category,
                },
                {
                    id: 'years_of_service',
                    text: 'お客様の現在の勤続年数をお教えください。（数字のみ）',
                    type: 'text',
                    next: 'gross_salary_minus_1',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.workplace_years_of_service,
                },
                {
                    id: 'gross_salary_minus_1',
                    text: `お客様の過去三年の額面給与額をお聞きします。\nまず、令和${
                        reiwa_year - 1
                    }年度の額面給与額（万円）をお教えください。`,
                    text_secondary: `令和${
                        reiwa_year - 1
                    }年度の額面給与額（万円）をお教えください。`,
                    type: 'text',
                    next: 'gross_salary_minus_2',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.gross_salary_minus_1,
                },
                {
                    id: 'gross_salary_minus_2',
                    text: `次に、令和${reiwa_year - 2}年度の額面給与額（万円）をお教えください。`,
                    text_secondary: `令和${reiwa_year - 2}年度の額面給与額（万円）をお教えください。`,
                    type: 'text',
                    next: 'gross_salary_minus_3',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.gross_salary_minus_2,
                },
                {
                    id: 'gross_salary_minus_3',
                    text: `最後に、令和${reiwa_year - 3}年度の額面給与額（万円）をお教えください。`,
                    text_secondary: `令和${reiwa_year - 3}年度の額面給与額（万円）をお教えください。`,
                    type: 'text',
                    next: 'family_structure_spouse',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.gross_salary_minus_3,
                },
                {
                    id: 'family_structure_spouse',
                    text: '次に、家族構成についてお聞きします。現在、配偶者はいらっしゃいますか？',
                    text_secondary: '配偶者の有無をお選びください。',
                    type: 'single-choice',
                    options: [
                        {
                            id: 1,
                            text: 'はい',
                        },
                        {
                            id: 2,
                            text: 'いいえ',
                        },
                    ],
                    next: {
                        1: 'family_structure_children',
                        2: 'family_structure_children',
                    },
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.family_structure_spouse,
                },
                {
                    id: 'family_structure_children',
                    text: 'お子様の人数をお教えください。',
                    type: 'text',
                    next: 'borrowed_money',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.family_structure_children,
                },
                {
                    id: 'borrowed_money',
                    text: 'お客様の保有する資産についてお聞きします。まず、現在の借入総額（万円）をお教えください。',
                    text_secondary: '現在の借入総額（万円）をお教えください。',
                    type: 'text',
                    next: 'deposit',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.borrowed_money,
                },
                {
                    id: 'deposit',
                    text: '現在の預金総額（万円）をお教えください。',
                    type: 'text',
                    next: 'other_assets',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.deposit,
                },
                {
                    id: 'other_assets',
                    text: 'その他の資産総額（万円）をお教えください。',
                    type: 'text',
                    next: 'purchaser_category',
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.other_assets,
                },
                {
                    id: 'purchaser_category',
                    text: '最後に、不動産を購入される際の名義を以下からお選びください。',
                    text_secondary: '不動産を購入される際の名義をお選びください。',
                    type: 'single-choice',
                    options: [
                        {
                            id: 1,
                            text: '個人',
                        },
                        {
                            id: 2,
                            text: '新設法人',
                        },
                        {
                            id: 3,
                            text: '既存法人',
                        },
                    ],
                    next: {
                        1: 'end',
                        2: 'end',
                        3: 'end',
                    },
                    related_table: db_data.tables.users.name, // Added related_table property
                    related_column: user_columns.purchaser_category,
                },
            ],
        },
        {
            id: 'property_conditions',
            questions: [
                {
                    id: 'price',
                    type: 'single-choice',
                    related_table: db_data.tables.users.name,
                    related_column: db_data.tables.users.columns.desired_price,
                    design: flex_message_contents.find(
                        (flex_message_content) =>
                            flex_message_content.id === 'property_conditions_price'
                    )?.design,
                    options: [
                        {
                            id: 1,
                            text: '3000～5000万円',
                        },
                        {
                            id: 2,
                            text: '5000～7500万円',
                        },
                        {
                            id: 3,
                            text: '7500万～1億円',
                        },
                        {
                            id: 4,
                            text: '1億～1億5000万円',
                        },
                        {
                            id: 5,
                            text: '1億5000万～2億円',
                        },
                        {
                            id: 6,
                            text: '2億円～3億円',
                        },
                        {
                            id: 7,
                            text: '3億～5億円',
                        },
                        {
                            id: 8,
                            text: '5億円以上',
                        },
                    ],
                    next: {
                        1: 'target',
                        2: 'target',
                        3: 'target',
                        4: 'target',
                        5: 'target',
                        6: 'target',
                        7: 'target',
                        8: 'target',
                    },
                },
                {
                    id: 'target',
                    text: '次に、お客様の希望する物件のターゲット層をお教えください。 \n※単身者/カップル向け（1R,1K,1DK,1LDK中心）\n※ファミリー向け（2DK以上）',
                    text_secondary:
                        'お客様の希望する物件のターゲット層をお選びください。 \n※単身者/カップル向け（1R,1K,1DK,1LDK中心）\n※ファミリー向け（2DK以上）',
                    type: 'single-choice',
                    related_table: db_data.tables.users.name,
                    related_column: db_data.tables.users.columns.desired_target,
                    options: [
                        {
                            id: 1,
                            text: '単身者/カップル向け',
                        },
                        {
                            id: 2,
                            text: 'ファミリー向け',
                        },
                    ],
                    next: {
                        1: 'area',
                        2: 'area',
                    },
                },
                {
                    id: 'area',
                    type: 'single-choice',
                    related_table: db_data.tables.users.name,
                    related_column: db_data.tables.users.columns.desired_area,
                    design: flex_message_contents.find(
                        (flex_message_content) =>
                            flex_message_content.id === 'property_conditions_area'
                    )?.design,
                    options: [
                        {
                            id: 1,
                            text: '東京都（城北エリア）',
                        },
                        {
                            id: 2,
                            text: '東京都（城南エリア）',
                        },
                        {
                            id: 3,
                            text: '東京都（城西エリア）',
                        },
                        {
                            id: 4,
                            text: '東京都（城東エリア）',
                        },
                        {
                            id: 5,
                            text: '東京都（23区外）',
                        },
                        {
                            id: 6,
                            text: '埼玉県（さいたま市）',
                        },
                        {
                            id: 7,
                            text: '埼玉県（さいたま市以外）',
                        },
                        {
                            id: 8,
                            text: '神奈川県（横浜市）',
                        },
                        {
                            id: 9,
                            text: '神奈川県（横浜市以外）',
                        },
                        {
                            id: 10,
                            text: '千葉県（千葉市、船橋市）',
                        },
                        {
                            id: 11,
                            text: '千葉県（千葉市、船橋市以外）',
                        },
                    ],
                    next: {
                        1: 'structure',
                        2: 'structure',
                        3: 'structure',
                        4: 'structure',
                        5: 'structure',
                        6: 'structure',
                        7: 'structure',
                        8: 'structure',
                        9: 'structure',
                        10: 'structure',
                        11: 'structure',
                    },
                },
                {
                    id: 'structure',
                    text: '次に、お客様の希望する物件の構造をお教えください。（2つ選択）',
                    text_secondary: 'お客様の希望する物件の構造をお教えください。（2つ選択）',
                    type: 'multiple-choice',
                    related_table: db_data.tables.user_desired_structures.name,
                    related_column:
                        db_data.tables.user_desired_structures.columns.desired_structure,
                    choices_allowed: 2,
                    options: [
                        {
                            id: 1,
                            text: '木造・軽量鉄骨造',
                        },
                        {
                            id: 2,
                            text: '鉄骨造',
                        },
                        {
                            id: 3,
                            text: 'RC造',
                        },
                    ],
                    next: 'yield',
                },
                {
                    id: 'yield',
                    type: 'single-choice',
                    related_table: db_data.tables.users.name,
                    related_column: db_data.tables.users.columns.desired_yield,
                    design: flex_message_contents.find(
                        (flex_message_content) =>
                            flex_message_content.id === 'property_conditions_yield'
                    )?.design,
                    options: [
                        {
                            id: 1,
                            text: '4％～（RC造 築浅中心）',
                        },
                        {
                            id: 2,
                            text: '5％～（RC/重量鉄骨造 築浅中心）',
                        },
                        {
                            id: 3,
                            text: '6％～（重量/軽量鉄骨造 中心）',
                        },
                        {
                            id: 4,
                            text: '7％～（軽量鉄骨造/木造 中心）',
                        },
                        {
                            id: 5,
                            text: '8％～（木造/耐用年数越え）',
                        },
                    ],
                    next: {
                        1: 'end',
                        2: 'end',
                        3: 'end',
                        4: 'end',
                        5: 'end',
                    },
                },
            ],
        },
    ],
};
