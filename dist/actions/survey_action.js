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
exports.searchConditionSurveyHandler = exports.basicInfoSurveyHandler = void 0;
const DatabaseCommunicator_1 = require("../classes/DatabaseCommunicator");
const config_1 = require("../data/config");
const question_handler_1 = require("../funcs/question_handler");
const survey_validator_1 = require("../funcs/survey_validator");
const message_helper_1 = require("../funcs/message_helper");
// This function validates the user's answer, stores the answer to the database, and returns the modified User instance.
function basicInfoSurveyHandler(user, answer_text) {
    return __awaiter(this, void 0, void 0, function* () {
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
}
exports.basicInfoSurveyHandler = basicInfoSurveyHandler;
function searchConditionSurveyHandler(user, answer_text) {
    return __awaiter(this, void 0, void 0, function* () {
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
}
exports.searchConditionSurveyHandler = searchConditionSurveyHandler;
function handleInitialStep(user) {
    return __awaiter(this, void 0, void 0, function* () {
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
                setNextQuestion(user, current_question);
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
}
function handleSubsequentSteps(user, answer_text) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
            }
            return user;
        }
        else {
            console.log('Answer is not valid. Returning user object from validator.'); // Log message
            const current_question = user.getCurrentQuestion();
            const messageContent = {
                type: 'text',
                text: validation_result.error_message + current_question.text,
            };
            if ('options' in current_question) {
                messageContent.quickReply = {
                    items: (0, message_helper_1.generateQuickReplyItems)(current_question.options),
                };
            }
            user.response.message = [messageContent];
            return user;
        }
    });
}
function handleNextStep(user, answer_text) {
    const current_action = user.getCurrentAction();
    const current_survey = user.getCurrentSurvey();
    const current_question = user.getCurrentQuestion();
    let next_question = getNextQuestion(answer_text, current_question, current_survey);
    if (!next_question) {
        //it was the last question
        console.log('This was the last step, ending the action'); // Log message
        endAction(user);
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
                setNextQuestion(user, next_question);
            }
            user.current_answers = null;
            console.log(`Updated the user's step to ${user.current_step_id}`);
        }
        else {
            throw new Error('Current action does not have steps.');
        }
    }
}
function storeAnswerInDatabase(user, answer_text) {
    return __awaiter(this, void 0, void 0, function* () {
        let dbc = new DatabaseCommunicator_1.DatabaseCommunicator(config_1.db_data);
        yield dbc.connect();
        const current_question = user.getCurrentQuestion();
        console.log('現在の質問：', user.current_question_id); // Log message in English
        try {
            if (current_question.type === 'multiple-choice') {
                const userDesiredStructuresTableName = config_1.db_data.tables.user_desired_structures.name;
                // Add condition to check for matching answer_text in the related column
                const relatedColumnName = current_question.related_column;
                if (user.current_answers !== null && user.current_answers.length >= 2) {
                    for (const current_answer of user.current_answers) {
                        const checkExistenceSql = `SELECT * FROM \`${userDesiredStructuresTableName}\` WHERE user_id = ? AND \`${relatedColumnName}\` = ?`;
                        const checkExistenceArgs = [user.user_id, current_answer];
                        const existingRecords = (yield dbc.query(checkExistenceSql, checkExistenceArgs));
                        if (existingRecords.length === 0) {
                            const insertSql = `INSERT INTO \`${userDesiredStructuresTableName}\` (user_id, desired_structure) VALUES (?, ?)`;
                            const insertArgs = [user.user_id, current_answer];
                            yield dbc.query(insertSql, insertArgs);
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
                yield dbc.update(current_question.related_table, { [current_question.related_column]: answer_text }, 'user_id = "' + user.user_id + '"');
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
}
function endAction(user) {
    user.current_action_id = null;
    user.current_survey_id = null;
    user.current_step_id = null;
    user.current_question_id = null;
    user.current_answers = null;
    user.response.shouldReply = true;
    user.response.message = [
        {
            type: 'text',
            text: '質問は以上です、お疲れさまでした！担当が対応いたしますのでしばらくお待ちくださいませ。',
        },
    ];
}
function setNextQuestion(user, current_question) {
    // Initialize message explicitly
    let message;
    if (current_question.design) {
        // Flex message
        message = [
            Object.assign({ type: 'flex', altText: '次の質問をご確認ください。', contents: current_question.design }, ('options' in current_question && {
                // 型ガードを使用してoptionsの存在をチェック
                quickReply: {
                    items: (0, message_helper_1.generateQuickReplyItems)(current_question.options),
                },
            })),
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
}
function getNextQuestion(answer_text, current_question, current_survey) {
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
}
