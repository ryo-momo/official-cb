import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { type User } from '../classes/User';
import { db_data } from '../data/config';
import { flex_message_contents } from '../data/flex_message_content';
import { type Question } from '../data/survey_content';
import { errorHandler } from '../funcs/error_handler';
import { generateQuickReplyItems, organizeQRs } from '../funcs/message_helper';
import { Columns, user_info_locations, DataLocations } from './get_info_actions';
import { setQR } from './survey_actions';

export interface DataPropertyTable {
    table_name: string;
    data: { [key: string]: DataPropertyItem };
}

export interface DataPropertyItem {
    label_ja: string;
    data_location: string;
    representation: DataRepresentation;
    unit: string;
    question_id: string;
}

interface DataRepresentationBase {
    type: 'string' | 'number' | 'boolean';
    prefix: string;
    suffix: string;
}

interface StringRepresentation extends DataRepresentationBase {
    type: 'string';
}

interface NumberRepresentation extends DataRepresentationBase {
    type: 'number';
}

interface BooleanRepresentation extends DataRepresentationBase {
    type: 'boolean';
    true_label: string;
    false_label: string;
}

export type DataRepresentation =
    | StringRepresentation
    | NumberRepresentation
    | BooleanRepresentation;

const getDataRepresentation = (
    data_property: DataPropertyItem,
    value: string | number | boolean,
    includeLabel: boolean
): string => {
    switch (data_property.representation.type) {
        case 'string':
            return `${includeLabel ? `${data_property.label_ja}: ` : ''}${data_property.representation.prefix}${value}${data_property.representation.suffix}`;
        case 'number':
            return `${includeLabel ? `${data_property.label_ja}: ` : ''}${data_property.representation.prefix}${value}${data_property.representation.suffix}`;
        case 'boolean':
            return `${includeLabel ? `${data_property.label_ja}: ` : ''}${data_property.representation.prefix}${value ? data_property.representation.true_label : data_property.representation.false_label}${data_property.representation.suffix}`;
    }
};
const user_properties: DataPropertyTable[] = [
    {
        table_name: user_info_locations[0].table_name,
        data: {
            user_name: {
                label_ja: '氏名',
                data_location: user_info_locations[0].columns.user_name,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'name_primary',
            },
            user_name_kana: {
                label_ja: '氏名（カナ）',
                data_location: user_info_locations[0].columns.user_name_kana,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'name_kana',
            },
            address_postal_code: {
                label_ja: '郵便番号',
                data_location: user_info_locations[0].columns.address_postal_code,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'postal_code',
            },
            address: {
                label_ja: '住所',
                data_location: user_info_locations[0].columns.address,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'address',
            },
            residence_category: {
                label_ja: '住居区分',
                data_location: user_info_locations[0].columns.residence_category,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'residence_category',
            },
            email_address: {
                label_ja: 'メールアドレス',
                data_location: user_info_locations[0].columns.email_address,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'email_address',
            },
            phone_number: {
                label_ja: '電話番号',
                data_location: user_info_locations[0].columns.phone_number,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'phone_number',
            },
            workplace_name: {
                label_ja: '勤務先名',
                data_location: user_info_locations[0].columns.workplace_name,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'workplace_name',
            },
            workplace_address: {
                label_ja: '勤務先住所',
                data_location: user_info_locations[0].columns.workplace_address,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'workplace_address',
            },
            workplace_position: {
                label_ja: '役職',
                data_location: user_info_locations[0].columns.workplace_position,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'position',
            },
            workplace_job_category: {
                label_ja: '職種',
                data_location: user_info_locations[0].columns.workplace_job_category,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'job_category',
            },
            workplace_years_of_service: {
                label_ja: '勤続年数',
                data_location: user_info_locations[0].columns.workplace_years_of_service,
                representation: { type: 'number', prefix: '', suffix: '年' },
                unit: '',
                question_id: 'years_of_service',
            },
            gross_salary_minus_1: {
                label_ja: 'R5年 額面給与',
                data_location: user_info_locations[0].columns.gross_salary_minus_1,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
                question_id: 'gross_salary_minus_1',
            },
            gross_salary_minus_2: {
                label_ja: 'R4年 額面給与',
                data_location: user_info_locations[0].columns.gross_salary_minus_2,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
                question_id: 'gross_salary_minus_2',
            },
            gross_salary_minus_3: {
                label_ja: 'R3年 額面給与',
                data_location: user_info_locations[0].columns.gross_salary_minus_3,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
                question_id: 'gross_salary_minus_3',
            },
            family_structure_spouse: {
                label_ja: '配偶者の有無',
                data_location: user_info_locations[0].columns.family_structure_spouse,
                representation: {
                    type: 'boolean',
                    prefix: '',
                    suffix: '',
                    true_label: '有',
                    false_label: '無',
                },
                unit: '',
                question_id: 'family_structure_spouse',
            },
            family_structure_children: {
                label_ja: '子供の人数',
                data_location: user_info_locations[0].columns.family_structure_children,
                representation: { type: 'number', prefix: '', suffix: '人' },
                unit: '',
                question_id: 'family_structure_children',
            },
            borrowed_money: {
                label_ja: '借入総額',
                data_location: user_info_locations[0].columns.borrowed_money,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
                question_id: 'borrowed_money',
            },
            deposit: {
                label_ja: '預金総額',
                data_location: user_info_locations[0].columns.deposit,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
                question_id: 'deposit',
            },
            other_assets: {
                label_ja: 'その他資産',
                data_location: user_info_locations[0].columns.other_assets,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
                question_id: 'other_assets',
            },
            purchaser_category: {
                label_ja: '購入名義',
                data_location: user_info_locations[0].columns.purchaser_category,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
                question_id: 'purchaser_category',
            },
        },
    },
];

const setQuestionSecondary = (user: User, current_question: Question): void => {
    if (current_question.design) {
        user.response.message.push({
            type: 'flex',
            altText: '質問をご確認ください。',
            contents: current_question.design,
        });
    } else {
        if (current_question.text_secondary === undefined && current_question.text === undefined) {
            user.response.message.push(
                errorHandler('INVALID_QUESTION_FORMAT', 'INTERNAL_ERROR', user)
            );
        } else {
            user.response.message.push({
                type: 'text',
                text: current_question.text_secondary || current_question.text || '',
                ...('options' in current_question && {
                    // 型ガードを使用してoptionsの存在をチェック
                    quickReply: {
                        items: generateQuickReplyItems(current_question.options),
                    },
                }),
            });
        }
    }
};

export const changeIndividualUserPropertyAction = async (
    user: User,
    text: string
): Promise<User> => {
    switch (user.current_step_id) {
        case null: {
            console.log('Step ID is null, processing the initial step');
            const flex_message_design = flex_message_contents.find(
                (content) => content.id === 'change_user_property_by_item'
            )?.design;
            if (flex_message_design) {
                user.response.message.push(
                    { type: 'text', text: '変更したい項目を以下からご選択下さい。' },
                    {
                        type: 'flex',
                        altText: 'こちらからご選択ください。',
                        contents: flex_message_design,
                    }
                );
            } else {
                user.response.message.push(
                    errorHandler('FLEX_MESSAGE_DESIGN_NOT_FOUND', 'INTERNAL_ERROR', user)
                );
            }
            console.log('Change the step ID to specify_property_to_change');
            user.current_step_id = 'specify_property_to_change';
            break;
        }
        case 'specify_property_to_change': {
            console.log('Expecting that the user has specified the property to change');
            const dbc = new DatabaseCommunicator(db_data);
            const table = user_properties.find((table) =>
                Object.keys(table.data)
                    .map((key) => table.data[key].label_ja)
                    .includes(text)
            );
            if (table) {
                console.log(
                    'User has specified a valid property, getting the current value and prompt for update'
                );
                await dbc.connect();
                const column =
                    table.data[
                        Object.keys(table.data).find(
                            (key) => table.data[key].label_ja === text
                        ) as keyof DataPropertyTable['data']
                    ];
                let current_value: { [key: string]: string | number | boolean } = {};
                try {
                    const current_value_array: { [key: string]: string | number | boolean }[] =
                        await dbc.read(
                            table.table_name,
                            [column.data_location],
                            `user_id = \'${user.user_id}\'`
                        );
                    current_value = current_value_array[0];
                } catch (err) {
                    user.response.message.push(
                        errorHandler('DATABASE_READ_FAILED', 'INTERNAL_ERROR', user, err)
                    );
                } finally {
                    void dbc.disconnect();
                }
                if (current_value) {
                    switch (user.current_action_id) {
                        case 'change_individual_user_property': {
                            user.current_survey_id = 'basic_info';
                            break;
                        }
                        case 'change_individual_search_condition': {
                            user.current_survey_id = 'property_conditions';
                            break;
                        }
                        default:
                            user.response.message.push(
                                errorHandler('UNEXPECTED_ACTION_ID', 'INTERNAL_ERROR', user)
                            );
                            break;
                    }
                    user.current_question_id = column.question_id;
                    setQuestionSecondary(user, user.getCurrentQuestion());
                    user.response.message.push({
                        type: 'text',
                        text: `現在の値: ${getDataRepresentation(column, current_value[column.data_location], false)}`,
                    });
                    setQR(user, 'キャンセル');
                    organizeQRs(user);
                    console.log('Change the step ID to input_new_value');
                    user.current_step_id = 'input_new_value';
                    //store the item name to update
                    user.current_answers = [column.data_location];
                } else {
                    user.response.message.push(
                        errorHandler('DATABASE_READ_FAILED', 'INTERNAL_ERROR', user)
                    );
                }
            } else {
                user.response.message.push(
                    errorHandler('INPUT_OUT_OF_OPTION', 'INPUT_OUT_OF_OPTION', user)
                );
            }
            break;
        }
        case 'input_new_value': {
            console.log('Expecting that the user has input the new value, updating the database');
            if (text === 'キャンセル') {
                console.log('User is trying to cancel the update');
                user.response.message.push({
                    type: 'text',
                    text: '変更をキャンセルしました。',
                });
                user.current_action_id = null;
                user.current_step_id = null;
                user.current_answers = [];
            } else {
                const data_loc = user.current_answers.pop();
                //TODO:validationを行う
                if (data_loc) {
                    const table = user_properties.find((table) =>
                        Object.keys(table.data)
                            .map((key) => table.data[key].data_location)
                            .includes(data_loc)
                    );
                    if (table) {
                        const dbc = new DatabaseCommunicator(db_data);
                        await dbc.connect();
                        try {
                            await dbc.update(
                                table.table_name,
                                { [data_loc]: text },
                                `user_id = \'${user.user_id}\'`
                            );
                        } catch (err) {
                            user.response.message.push(
                                errorHandler('DATABASE_UPDATE_FAILED', 'INTERNAL_ERROR', user, err)
                            );
                        } finally {
                            void dbc.disconnect();
                        }
                        console.log('Update complete with value: ', text);
                        user.response.message.push({
                            type: 'text',
                            text: '更新が完了しました。',
                        });
                        user.current_action_id = null;
                        user.current_step_id = null;
                        user.current_answers = [];
                    } else {
                        user.response.message.push(
                            errorHandler('TABLE_NOT_FOUND', 'INTERNAL_ERROR', user)
                        );
                    }
                } else {
                    user.response.message.push(
                        errorHandler('UNEXPECTED_ANSWERS_LENGTH', 'INTERNAL_ERROR', user)
                    );
                }
            }
            break;
        }
        default: {
            user.response.message.push(errorHandler('UNEXPECTED_STEP_ID', 'INTERNAL_ERROR', user));
            break;
        }
    }
    return user;
};
