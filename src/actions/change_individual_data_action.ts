import { type Message } from '@line/bot-sdk';
import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { type User } from '../classes/User';
import { db_data } from '../data/config';
import { flex_message_contents } from '../data/flex_message_content';
import { type Question } from '../data/survey_content';
import { errorHandler } from '../funcs/error_handler';
import { generateQuickReplyItems, organizeQRs } from '../funcs/message_helper';
import {
    type QuestionHandlerResult,
    handleMultipleChoiceQuestion,
    handleSingleChoiceQuestion,
    handleTextQuestion,
} from '../funcs/question_handler';
import { surveyValidator } from '../funcs/survey_validator';
import { Columns, user_info_locations, DataLocations } from './get_info_actions';
import { setQR, storeAnswerInDatabase } from './survey_actions';
import { invokeAction } from './action_handler';

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
                const column_key = Object.keys(table.data).find(
                    (key) => table.data[key].label_ja === text
                ) as keyof DataPropertyTable['data'];
                const column = table.data[column_key];
                let current_value: { [key: string]: string | number | boolean } = {};
                try {
                    const current_value_array: { [key: string]: string | number | boolean }[] =
                        await dbc.read(
                            table.table_name,
                            [column.data_location],
                            `user_id = \'${user.user_id}\'`
                        );
                    //TODO 二つ以上該当する場合があるよーーーーー
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
                    setQR(user, 'キャンセル', '>キャンセル');
                    organizeQRs(user);
                    console.log('Change the step ID to input_new_value');
                    //store the item name to update
                    user.current_step_id = String(column_key);
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
        case 'continue_or_not': {
            if (text === 'する') {
                user.current_step_id = null;
                user.current_answers = [];
                if (user.current_action_id) {
                    await invokeAction(user, '', user.current_action_id, false);
                } else {
                    user.response.message.push(
                        errorHandler('UNEXPECTED_ACTION_ID', 'INTERNAL_ERROR', user)
                    );
                }
            } else if (text === 'しない') {
                user.response.message.push({
                    type: 'text',
                    text: '情報の更新を終了します。',
                });
                user.current_action_id = null;
                user.current_step_id = null;
            } else {
                user.response.message.push(
                    errorHandler('INPUT_OUT_OF_OPTION', 'INPUT_OUT_OF_OPTION', user)
                );
            }
            break;
        }
        default: {
            let table: DataPropertyTable;
            switch (user.current_action_id) {
                case 'change_individual_user_property': {
                    table = user_properties[0];
                    break;
                }
                case 'change_individual_search_condition': {
                    table = user_properties[1];
                    break;
                }
                default:
                    user.response.message.push(
                        errorHandler('UNEXPECTED_ACTION_ID', 'INTERNAL_ERROR', user)
                    );
                    return user;
            }
            if (Object.keys(table.data).includes(user.current_step_id)) {
                console.log(
                    'Expecting that the user has input the new value, updating the database'
                );
                if (text === '>キャンセル') {
                    console.log('User is trying to cancel the update');
                    user.response.message.push({
                        type: 'text',
                        text: '変更をキャンセルしました。',
                    });
                    user.current_action_id = null;
                    user.current_step_id = null;
                    user.current_answers = [];
                } else {
                    const validation_result = surveyValidator(user, text);
                    user = validation_result.user_object;

                    if (validation_result.isValid) {
                        console.log('Validation is successful');

                        text = validation_result.answer_text_revised;

                        // Process the answer based on the question type.
                        let process_result: QuestionHandlerResult;
                        const question_type = user.getCurrentQuestion().type ?? null;
                        switch (question_type) {
                            case 'text':
                                console.log('Processing text question.'); // Log message
                                process_result = handleTextQuestion(user, text);
                                break;
                            case 'single-choice':
                                console.log('Processing single-choice question.'); // Log message
                                process_result = handleSingleChoiceQuestion(user, text);
                                break;
                            case 'multiple-choice':
                                console.log('Processing multiple-choice question.'); // Log message
                                process_result = handleMultipleChoiceQuestion(user, text);
                                break;
                            default:
                                throw new Error(`Invalid question type: ${question_type}`);
                        }
                        console.log(
                            '🚀 ~ file: change_individual_data_action.ts:413 ~ process_result:',
                            process_result
                        );

                        // If the answer needs to be stored in the database, connect to the database and update the user's information.
                        if (process_result.storeValueToDB) {
                            console.log('Storing answer to database.'); // Log message
                            try {
                                await storeAnswerInDatabase(user, text);
                            } catch (err) {
                                console.error('Error storing answer in database: ', err); // Log message
                                // Handle the error appropriately
                            }
                            console.log('Answer stored in database successfully.');
                        }
                        if (process_result.goToNextStep) {
                            console.log('Update complete');
                            user.response.message.push({
                                type: 'text',
                                text: '更新が完了しました。続けて更新しますか？',
                                quickReply: {
                                    items: [
                                        {
                                            type: 'action',
                                            action: {
                                                type: 'message',
                                                label: 'する',
                                                text: 'する',
                                            },
                                        },
                                        {
                                            type: 'action',
                                            action: {
                                                type: 'message',
                                                label: 'しない',
                                                text: 'しない',
                                            },
                                        },
                                    ],
                                },
                            });
                            user.current_step_id = 'continue_or_not';
                            user.current_answers = [];
                        } else {
                            //set the current question to the user response again, except deleting the already selected option from options.
                            const current_question = user.getCurrentQuestion();
                            if ('options' in current_question) {
                                //for multiple choice questions, delete the already selected option from options.
                                current_question.options = current_question.options.filter(
                                    (option) => option.text !== text
                                );
                                user.response.message = [
                                    {
                                        type: 'text',
                                        text: current_question.text,
                                        quickReply: {
                                            items: generateQuickReplyItems(
                                                current_question.options
                                            ),
                                        },
                                    },
                                ] as Message[];
                            }
                            setQR(user, 'キャンセル', '>キャンセル');
                        }
                    } else {
                        console.log('Validation failed');
                        user.response.message.push({
                            type: 'text',
                            text: validation_result.error_message,
                        });
                        setQuestionSecondary(user, user.getCurrentQuestion());
                        setQR(user, 'キャンセル', '>キャンセル');
                        return user;
                    }
                }
                break;
            } else {
                user.response.message.push(
                    errorHandler('UNEXPECTED_STEP_ID', 'INTERNAL_ERROR', user)
                );
                break;
            }
        }
    }
    return user;
};
