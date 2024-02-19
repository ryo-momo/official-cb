import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { type User } from '../classes/User';
import { db_data } from '../data/config';
import { flex_message_contents } from '../data/flex_message_content';
import { errorHandler } from '../funcs/error_handler';
import { Columns, user_info_locations, DataLocations } from './get_info_actions';

export interface DataPropertyTable {
    table_name: string;
    data: { [key: string]: DataPropertyItem };
}

export interface DataPropertyItem {
    label_ja: string;
    data_location: string;
    representation: DataRepresentation;
    unit: string;
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
    value: string | number | boolean
): string => {
    switch (data_property.representation.type) {
        case 'string':
            return `${data_property.label_ja}: ${data_property.representation.prefix}${value}${data_property.representation.suffix}`;
        case 'number':
            return `${data_property.label_ja}: ${data_property.representation.prefix}${value}${data_property.representation.suffix}`;
        case 'boolean':
            return `${data_property.label_ja}: ${data_property.representation.prefix}${value ? data_property.representation.true_label : data_property.representation.false_label}${data_property.representation.suffix}`;
    }
    return '';
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
            },
            user_name_kana: {
                label_ja: '氏名（カナ）',
                data_location: user_info_locations[0].columns.user_name_kana,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            address_postal_code: {
                label_ja: '郵便番号',
                data_location: user_info_locations[0].columns.address_postal_code,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            address: {
                label_ja: '住所',
                data_location: user_info_locations[0].columns.address,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            residence_category: {
                label_ja: '住居区分',
                data_location: user_info_locations[0].columns.residence_category,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            email_address: {
                label_ja: 'メールアドレス',
                data_location: user_info_locations[0].columns.email_address,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            phone_number: {
                label_ja: '電話番号',
                data_location: user_info_locations[0].columns.phone_number,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            workplace_name: {
                label_ja: '勤務先名',
                data_location: user_info_locations[0].columns.workplace_name,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            workplace_address: {
                label_ja: '勤務先住所',
                data_location: user_info_locations[0].columns.workplace_address,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            workplace_position: {
                label_ja: '役職',
                data_location: user_info_locations[0].columns.workplace_position,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            workplace_job_category: {
                label_ja: '職種',
                data_location: user_info_locations[0].columns.workplace_job_category,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
            workplace_years_of_service: {
                label_ja: '勤続年数',
                data_location: user_info_locations[0].columns.workplace_years_of_service,
                representation: { type: 'number', prefix: '', suffix: '年' },
                unit: '',
            },
            gross_salary_minus_1: {
                label_ja: 'R5年 額面給与',
                data_location: user_info_locations[0].columns.gross_salary_minus_1,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
            },
            gross_salary_minus_2: {
                label_ja: 'R4年 額面給与',
                data_location: user_info_locations[0].columns.gross_salary_minus_2,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
            },
            gross_salary_minus_3: {
                label_ja: 'R3年 額面給与',
                data_location: user_info_locations[0].columns.gross_salary_minus_3,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
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
            },
            family_structure_children: {
                label_ja: '子供の人数',
                data_location: user_info_locations[0].columns.family_structure_children,
                representation: { type: 'number', prefix: '', suffix: '人' },
                unit: '',
            },
            borrowed_money: {
                label_ja: '借入総額',
                data_location: user_info_locations[0].columns.borrowed_money,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
            },
            deposit: {
                label_ja: '預金総額',
                data_location: user_info_locations[0].columns.deposit,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
            },
            other_assets: {
                label_ja: 'その他資産',
                data_location: user_info_locations[0].columns.other_assets,
                representation: { type: 'number', prefix: '', suffix: '万円' },
                unit: '',
            },
            purchaser_category: {
                label_ja: '購入名義',
                data_location: user_info_locations[0].columns.purchaser_category,
                representation: { type: 'string', prefix: '', suffix: '' },
                unit: '',
            },
        },
    },
];

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
                try {
                    const current_value_array: { [key: string]: string | number | boolean }[] =
                        await dbc.read(
                            table.table_name,
                            [column.data_location],
                            `user_id = \'${user.user_id}\'`
                        );
                    const current_value = current_value_array[0];
                    if (current_value) {
                        user.response.message.push({
                            type: 'text',
                            text: `新規の値を入力してください。\n現在の値：${getDataRepresentation(column, current_value[column.data_location])}`,
                        });
                        console.log('Change the step ID to input_new_value');
                        user.current_step_id = 'input_new_value';
                        //store the item name to update
                        user.current_answers = [column.data_location];
                    } else {
                        user.response.message.push(
                            errorHandler('DATABASE_READ_FAILED', 'INTERNAL_ERROR', user)
                        );
                    }
                } catch (err) {
                    user.response.message.push(
                        errorHandler('DATABASE_READ_FAILED', 'INTERNAL_ERROR', user, err)
                    );
                } finally {
                    void dbc.disconnect();
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
            const data_loc = user.current_answers.pop();
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
            break;
        }
        default: {
            user.response.message.push(errorHandler('UNEXPECTED_STEP_ID', 'INTERNAL_ERROR', user));
            break;
        }
    }
    return user;
};
