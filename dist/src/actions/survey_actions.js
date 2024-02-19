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
exports.handleSearchConditionUpdateOrReference = exports.handleBasicInfoUpdateOrReference = exports.searchConditionSurveyHandler = exports.basicInfoSurveyHandler = void 0;
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const config_1 = require("../data/config");
const question_handler_1 = require("../funcs/question_handler");
const survey_validator_1 = require("../funcs/survey_validator");
const user_states_1 = require("../data/user_states");
const message_helper_1 = require("../funcs/message_helper");
const action_handler_1 = require("./action_handler");
const error_handler_1 = require("../funcs/error_handler");
// This function validates the user's answer, stores the answer to the database, and returns the modified User instance.
const basicInfoSurveyHandler = (user, answer_text) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.isInInitialStep()) {
        return yield handleInitialStep(user);
    }
    else {
        try {
            return yield handleSubsequentSteps(user, answer_text);
        }
        catch (err) {
            throw new Error(`Error handling subsequent steps: ${err}`);
            // Handle the error appropriately
        }
    }
});
exports.basicInfoSurveyHandler = basicInfoSurveyHandler;
const searchConditionSurveyHandler = (user, answer_text) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.isInInitialStep()) {
        return yield handleInitialStep(user);
    }
    else {
        try {
            return yield handleSubsequentSteps(user, answer_text);
        }
        catch (err) {
            throw new Error(`Error handling subsequent steps: ${err}`);
            // Handle the error appropriately
        }
    }
});
exports.searchConditionSurveyHandler = searchConditionSurveyHandler;
const handleInitialStep = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let current_action = user.getCurrentAction();
    if ('survey_id' in current_action) {
        console.log('User is in initial step. Setting current survey and question.'); // Log message
        user.current_step_id = current_action.steps[0].step_id;
        user.current_survey_id = current_action.survey_id;
        user.current_question_id = user.getCurrentSurvey().questions[0].id;
        const current_step = user.getCurrentStep();
        const current_question = user.getCurrentQuestion();
        if (current_step) {
            user.current_step_id = current_step.step_id;
            user.current_question_id = current_question.id;
            setQuestion(user, current_question);
        }
        else {
            throw new Error('Next step not found.');
        }
        console.log(`Updated the user's step to ${user.current_step_id}`);
        return user;
    }
    else {
        throw new Error('User is in initial step, but current action is not a survey action.');
    }
});
const handleSubsequentSteps = (user, answer_text) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (answer_text === '中断') {
        console.log('User is trying to quit the survey'); // Log message
        user.current_step_id = 'quit_confirmation';
        user.response.message = [
            {
                type: 'text',
                text: '中断しますか？※進行状況は保存されません。',
                quickReply: {
                    items: [
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: 'はい',
                                text: 'はい',
                            },
                        },
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: 'いいえ',
                                text: 'いいえ',
                            },
                        },
                    ],
                },
            },
        ];
        return user;
    }
    else {
        if (user.current_step_id === 'quit_confirmation') {
            if (answer_text === 'はい') {
                console.log('The user has confirmed to quit');
                user.current_action_id = 'terminate_action';
                return yield (0, action_handler_1.actionHandler)(user, answer_text, user.getCurrentAction());
            }
            else if (answer_text === 'いいえ') {
                console.log('User decided to continue the survey');
                user.current_step_id = user.current_question_id;
                setQuestion(user, user.getCurrentQuestion());
                return user;
            }
            else {
                user.response.message.push((0, error_handler_1.errorHandler)('INPUT_OUT_OF_OPTION', 'INPUT_OUT_OF_OPTION', user));
            }
            return user;
        }
    }
    //validate the answer
    let validation_result = (0, survey_validator_1.surveyValidator)(user, answer_text);
    user = validation_result.user_object;
    if (validation_result.isValid) {
        console.log('Answer is valid.'); // Log message
        answer_text = validation_result.answer_text_revised;
        // Process the answer based on the question type.
        let process_result;
        const question_type = (_a = user.getCurrentQuestion().type) !== null && _a !== void 0 ? _a : null;
        switch (question_type) {
            case 'text':
                console.log('Processing text question.'); // Log message
                process_result = (0, question_handler_1.handleTextQuestion)(user, answer_text);
                break;
            case 'single-choice':
                console.log('Processing single-choice question.'); // Log message
                process_result = (0, question_handler_1.handleSingleChoiceQuestion)(user, answer_text);
                break;
            case 'multiple-choice':
                console.log('Processing multiple-choice question.'); // Log message
                process_result = (0, question_handler_1.handleMultipleChoiceQuestion)(user, answer_text);
                break;
            default:
                throw new Error(`Invalid question type: ${question_type}`);
        }
        // If the answer needs to be stored in the database, connect to the database and update the user's information.
        if (process_result.storeValueToDB) {
            console.log('Storing answer to database.'); // Log message
            try {
                yield storeAnswerInDatabase(user, answer_text);
            }
            catch (err) {
                console.error('Error storing answer in database: ', err); // Log message
                // Handle the error appropriately
            }
            console.log('Answer stored in database successfully.');
        } // Log message
        if (process_result.goToNextStep) {
            handleNextStep(user, answer_text);
        }
        else {
            //set the current question to the user response again, except deleting the already selected option from options.
            const current_question = user.getCurrentQuestion();
            if ('options' in current_question) {
                //for multiple choice questions, delete the already selected option from options.
                current_question.options = current_question.options.filter((option) => option.text !== answer_text);
                user.response.message = [
                    {
                        type: 'text',
                        text: current_question.text,
                        quickReply: {
                            items: (0, message_helper_1.generateQuickReplyItems)(current_question.options),
                        },
                    },
                ];
            }
            setCancel(user);
        }
        return user;
    }
    else {
        console.log('Answer is not valid. Returning user object from validator.'); // Log message
        const current_question = user.getCurrentQuestion();
        // Initialize message explicitly
        let message;
        if (current_question.design) {
            //flex message question
            message = [
                {
                    type: 'text',
                    text: validation_result.error_message,
                },
                {
                    type: 'flex',
                    altText: '次の質問をご確認ください。',
                    contents: current_question.design,
                },
            ];
        }
        else {
            //text message question
            message = [
                Object.assign({ type: 'text', text: `${validation_result.error_message}\n\n${current_question.text}` ||
                        '問題が発生しました、お手数ですが担当にお問い合わせください。(e001)' }, ('options' in current_question && {
                    // 型ガードを使用してoptionsの存在をチェック
                    quickReply: {
                        items: (0, message_helper_1.generateQuickReplyItems)(current_question.options),
                    },
                })),
            ];
        }
        setCancel(user);
        user.response.message = message;
        return user;
    }
});
const handleBasicInfoUpdateOrReference = (user, text) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.current_step_id === null) {
        user.response.message = [
            {
                type: 'text',
                text: '行いたい操作を選択してください。',
                quickReply: {
                    items: [
                        //TODO ユーザーのminor_stateによって表示するものを変更！！！！
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: 'お客様情報の登録/更新',
                                text: 'お客様情報の登録/更新',
                            },
                        },
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: 'お客様情報の参照',
                                text: 'お客様情報の参照',
                            },
                        },
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: 'キャンセル',
                                text: '>キャンセル',
                            },
                        },
                    ],
                },
            },
        ];
        user.current_action_id = 'basic_info_update_or_reference';
        user.current_step_id = 'update_or_reference';
    }
    else {
        if (user.current_step_id === 'update_or_reference') {
            switch (text) {
                case 'お客様情報の登録/更新':
                    user.current_action_id = 'basic_info_registration';
                    break;
                case 'お客様情報の参照':
                    user.current_action_id = 'basic_info_inquiry';
                    break;
                case '>キャンセル':
                    user.current_action_id = 'terminate_action';
                    break;
                default:
                    user.response.message.push((0, error_handler_1.errorHandler)('INPUT_OUT_OF_OPTION', 'INPUT_OUT_OF_OPTION', user));
            }
            user.current_step_id = null;
            user = yield (0, action_handler_1.actionHandler)(user, text, user.getCurrentAction());
        }
        else {
            user.response.message.push((0, error_handler_1.errorHandler)('INVALID_CURRENT_STEP', 'INTERNAL_ERROR', user));
        }
    }
    return user;
});
exports.handleBasicInfoUpdateOrReference = handleBasicInfoUpdateOrReference;
const handleSearchConditionUpdateOrReference = (user, text) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.current_step_id === null) {
        user.response.message = [
            {
                type: 'text',
                text: '行いたい操作を選択してください。',
                quickReply: {
                    items: [
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: '希望物件条件の登録/更新',
                                text: '希望物件条件の登録/更新',
                            },
                        },
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: '希望物件条件の参照',
                                text: '希望物件条件の参照',
                            },
                        },
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: 'キャンセル',
                                text: '>キャンセル',
                            },
                        },
                    ],
                },
            },
        ];
        user.current_action_id = 'search_condition_update_or_reference';
        user.current_step_id = 'update_or_reference';
    }
    else {
        if (user.current_step_id === 'update_or_reference') {
            switch (text) {
                case '希望物件条件の登録/更新':
                    user.current_action_id = 'search_condition_registration';
                    break;
                case '希望物件条件の参照':
                    user.current_action_id = 'search_condition_inquiry';
                    break;
                case '>キャンセル':
                    user.current_action_id = 'terminate_action';
                    break;
                default:
                    user.response.message.push((0, error_handler_1.errorHandler)('INPUT_OUT_OF_OPTION', 'INPUT_OUT_OF_OPTION', user));
            }
            user.current_step_id = null;
            user = yield (0, action_handler_1.actionHandler)(user, text, user.getCurrentAction());
        }
        else {
            user.response.message.push((0, error_handler_1.errorHandler)('INVALID_CURRENT_STEP', 'INTERNAL_ERROR', user));
        }
    }
    return user;
});
exports.handleSearchConditionUpdateOrReference = handleSearchConditionUpdateOrReference;
const handleNextStep = (user, answer_text) => {
    const current_action = user.getCurrentAction();
    const current_survey = user.getCurrentSurvey();
    const current_question = user.getCurrentQuestion();
    let next_question = getNextQuestion(answer_text, current_question, current_survey);
    if (!next_question) {
        //it was the last question
        console.log('This was the last step, ending the action'); // Log message
        endSurveyAction(user, current_survey.id);
    }
    else {
        //there's more question to go.
        console.log('Going to next step.'); // Log message
        if ('steps' in current_action) {
            const next_step = current_action.steps.find((step) => step.step_id == user.getCurrentStep().next);
            if (!next_question) {
                throw new Error('Next question not found.');
            }
            if (next_step) {
                user.current_step_id = next_step.step_id;
                user.current_question_id = next_question.id;
                setQuestion(user, next_question);
            }
            user.current_answers = [];
            console.log(`Updated the user's step to ${user.current_step_id}`);
        }
        else {
            throw new Error('Current action does not have steps.');
        }
    }
};
const storeAnswerInDatabase = (user, answer_text) => __awaiter(void 0, void 0, void 0, function* () {
    let dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
    yield dbc.connect();
    const current_question = user.getCurrentQuestion();
    console.log('Current question id:', user.current_question_id); // Log message in English
    try {
        if (current_question.type === 'multiple-choice') {
            const user_desired_structures_table_name = config_1.db_data.tables.user_desired_structures.name;
            // Add condition to check for matching answer_text in the related column
            const related_column_name = current_question.related_column;
            if (user.current_answers !== null && user.current_answers.length >= 2) {
                for (const current_answer of user.current_answers) {
                    const check_existence_sql = `SELECT * FROM \`${user_desired_structures_table_name}\` WHERE user_id = ? AND \`${related_column_name}\` = ?`;
                    const check_existence_args = [user.user_id, current_answer];
                    const existing_records = (yield dbc.query(check_existence_sql, check_existence_args));
                    if (existing_records.length === 0) {
                        const insert_sql = `INSERT INTO \`${user_desired_structures_table_name}\` (user_id, desired_structure) VALUES (?, ?)`;
                        const insert_args = [user.user_id, current_answer];
                        yield dbc.query(insert_sql, insert_args);
                        console.log('Inserted a new record into the database for user_id:', user.user_id); // Log message in English
                    }
                }
            }
            else {
                console.log('user.current_answers', user.current_answers);
                throw new Error('current_answers is null or has less than 2 elements');
            }
        }
        else {
            yield dbc.update(current_question.related_table, { [current_question.related_column]: answer_text }, `user_id = "${user.user_id}"`);
        }
        console.log('Answer save successful'); // Log message in English
    }
    catch (err) {
        console.error('Error updating user column: ', err); // Log error message in English
        throw err;
    }
    finally {
        yield dbc.disconnect();
    }
});
const endSurveyAction = (user, current_survey_id) => {
    switch (current_survey_id) {
        case 'basic_info':
            user.minor_state_id = 'basic_info_registered';
            break;
        case 'property_conditions':
            user.minor_state_id = 'search_condition_added';
            break;
        default:
    }
    const current_action = user_states_1.user_states.actions.find((action) => action.action_id === user.current_action_id);
    if (current_action) {
        if ('survey_id' in current_action) {
            const end_step = current_action.steps.find((step) => step.step_id === 'end');
            if (end_step) {
                user.response.message.push({
                    type: 'text',
                    text: end_step.text ||
                        '以上です、お疲れさまでした！担当が対応いたしますのでお待ちください。',
                });
            }
            else {
                user.response.message.push((0, error_handler_1.errorHandler)('END_STEP_NOT_FOUND', 'INTERNAL_ERROR', user));
            }
        }
        else {
            user.response.message.push((0, error_handler_1.errorHandler)('ACTION_NOT_A_SURVEY', 'INTERNAL_ERROR', user));
        }
    }
    user.current_action_id = null;
    user.current_survey_id = null;
    user.current_step_id = null;
    user.current_question_id = null;
    user.current_answers = [];
};
const setQuestion = (user, current_question) => {
    // Initialize message explicitly
    let message;
    if (current_question.design) {
        // Flex message
        message = [
            {
                type: 'flex',
                altText: '次の質問をご確認ください。',
                contents: current_question.design,
            },
        ];
    }
    else {
        // Text message with conditional quickReply, using type guard
        message = [
            Object.assign({ type: 'text', text: current_question.text || '質問のテキストが設定されていません。' }, ('options' in current_question && {
                // 型ガードを使用してoptionsの存在をチェック
                quickReply: {
                    items: (0, message_helper_1.generateQuickReplyItems)(current_question.options),
                },
            })),
        ];
    }
    // update user response
    user.response.message = message;
    setCancel(user);
};
const setCancel = (user) => {
    const message = user.response.message[user.response.message.length - 1];
    const quit_quick_reply = {
        type: 'action',
        action: {
            type: 'message',
            label: '中断',
            text: '中断',
        },
    };
    if ('quickReply' in message) {
        if (message.quickReply !== undefined) {
            message.quickReply.items.push(quit_quick_reply);
        }
        else {
            message.quickReply = {
                items: [quit_quick_reply],
            };
        }
    }
    else {
        message.quickReply = {
            items: [quit_quick_reply],
        };
    }
};
const getNextQuestion = (answer_text, current_question, current_survey) => {
    let next_question;
    // Check if current_question.next is a string or an object
    if (current_question.type !== 'single-choice') {
        next_question = current_survey === null || current_survey === void 0 ? void 0 : current_survey.questions.find((question) => question.id === current_question.next);
    }
    else {
        // Find the option that matches the answer_text
        const selected_option = current_question.options.find((option) => option.text === answer_text);
        if (selected_option) {
            // Find the question that matches the id in current_question.next
            next_question = current_survey === null || current_survey === void 0 ? void 0 : current_survey.questions.find((question) => question.id === current_question.next[selected_option.id]);
        }
    }
    return next_question;
};
