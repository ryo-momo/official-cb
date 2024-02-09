import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { db_data } from '../data/config';
import {
    handleTextQuestion,
    handleSingleChoiceQuestion,
    handleMultipleChoiceQuestion,
} from '../funcs/question_handler';
import { surveyValidator } from '../funcs/survey_validator';
import { User } from '../classes/User';
import { Step, user_states } from '../data/user_states';
import { generateQuickReplyItems } from '../funcs/message_helper';
import { Message, FlexMessage } from '@line/bot-sdk';
import { Question, Survey } from '../data/survey_content';

// This function validates the user's answer, stores the answer to the database, and returns the modified User instance.
export async function basicInfoSurveyHandler(user: User, answer_text: string): Promise<User> {
    if (user.isInInitialStep()) {
        return await handleInitialStep(user);
    } else {
        try {
            return await handleSubsequentSteps(user, answer_text);
        } catch (err) {
            throw new Error(`Error handling subsequent steps: ${err}`);
            // Handle the error appropriately
        }
    }
}

export async function searchConditionSurveyHandler(user: User, answer_text: string): Promise<User> {
    if (user.isInInitialStep()) {
        return await handleInitialStep(user);
    } else {
        try {
            console.log(
                '🚀 ~ file: survey_actions.ts:40 ~ searchConditionSurveyHandler ~ user:',
                user.current_question_id
            );
            return await handleSubsequentSteps(user, answer_text);
        } catch (err) {
            throw new Error(`Error handling subsequent steps: ${err}`);
            // Handle the error appropriately
        }
    }
}

async function handleInitialStep(user: User): Promise<User> {
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
        } else {
            throw new Error('Next step not found.');
        }
        console.log(`Updated the user's step to ${user.current_step_id}`);
        return user;
    } else {
        throw new Error('User is in initial step, but current action is not a survey action.');
    }
}

async function handleSubsequentSteps(user: User, answer_text: string): Promise<User> {
    let validation_result = surveyValidator(user, answer_text);
    user = validation_result.user_object;
    console.log(
        '🚀 ~ file: survey_actions.ts:68 ~ handleSubsequentSteps ~ user:',
        user.current_question_id
    );
    if (validation_result.isValid) {
        console.log('Answer is valid.'); // Log message
        answer_text = validation_result.answer_text_revised;

        // Process the answer based on the question type.
        let process_result;
        const question_type = user.getCurrentQuestion().type ?? null;
        switch (question_type) {
            case 'text':
                console.log('Processing text question.'); // Log message
                process_result = handleTextQuestion(user, answer_text);
                break;
            case 'single-choice':
                console.log('Processing single-choice question.'); // Log message
                process_result = handleSingleChoiceQuestion(user, answer_text);
                break;
            case 'multiple-choice':
                console.log('Processing multiple-choice question.'); // Log message
                process_result = handleMultipleChoiceQuestion(user, answer_text);
                break;
            default:
                throw new Error(`Invalid question type: ${question_type}`);
        }

        // If the answer needs to be stored in the database, connect to the database and update the user's information.
        if (process_result.storeValueToDB) {
            console.log('Storing answer to database.'); // Log message
            try {
                await storeAnswerInDatabase(user, answer_text);
            } catch (err) {
                console.error('Error storing answer in database: ', err); // Log message
                // Handle the error appropriately
            }
            console.log('Answer stored in database successfully.');
        } // Log message
        if (process_result.goToNextStep) {
            handleNextStep(user, answer_text);
        } else {
            //set the current question to the user response again, except deleting the already selected option from options.
            const current_question = user.getCurrentQuestion();
            if ('options' in current_question) {
                //for multiple choice questions, delete the already selected option from options.
                current_question.options = current_question.options.filter(
                    (option) => option.text !== answer_text
                );
                user.response.message = [
                    {
                        type: 'text',
                        text: current_question.text,
                        quickReply: {
                            items: generateQuickReplyItems(current_question.options),
                        },
                    },
                ] as Message[];
            }
        }
        return user;
    } else {
        console.log('Answer is not valid. Returning user object from validator.'); // Log message
        const current_question = user.getCurrentQuestion();
        console.log(
            '🚀 ~ file: survey_actions.ts:137 ~ handleSubsequentSteps ~ user:',
            user.current_question_id
        );
        // Initialize message explicitly
        let message: Message[] | FlexMessage[];
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
        } else {
            //text message question
            message = [
                {
                    type: 'text',
                    text:
                        validation_result.error_message + '\n\n' + current_question.text ||
                        '問題が発生しました、お手数ですが担当にお問い合わせください。(e001)',
                    ...('options' in current_question && {
                        // 型ガードを使用してoptionsの存在をチェック
                        quickReply: {
                            items: generateQuickReplyItems(current_question.options),
                        },
                    }),
                },
            ];
        }
        user.response.message = message;
        return user;
    }
}

function handleNextStep(user: User, answer_text: string) {
    const current_action = user.getCurrentAction();
    const current_survey = user.getCurrentSurvey();
    const current_question = user.getCurrentQuestion();
    let next_question = getNextQuestion(answer_text, current_question, current_survey);

    if (!next_question) {
        //it was the last question
        console.log('This was the last step, ending the action'); // Log message
        endAction(user, current_survey.id);
    } else {
        //there's more question to go.
        console.log('Going to next step.'); // Log message
        if ('steps' in current_action) {
            const next_step = current_action.steps.find(
                (step: Step) => step.step_id == user.getCurrentStep().next
            );
            if (!next_question) {
                throw new Error('Next question not found.');
            }
            if (next_step) {
                user.current_step_id = next_step.step_id;
                user.current_question_id = next_question.id;
                setQuestion(user, next_question);
            }
            user.current_answers = null;
            console.log(`Updated the user's step to ${user.current_step_id}`);
        } else {
            throw new Error('Current action does not have steps.');
        }
    }
}

async function storeAnswerInDatabase(user: User, answer_text: string) {
    let dbc = new DatabaseCommunicator(db_data);
    await dbc.connect();
    const current_question = user.getCurrentQuestion();
    console.log('現在の質問：', user.current_question_id); // Log message in English
    try {
        if (current_question.type === 'multiple-choice') {
            const userDesiredStructuresTableName = db_data.tables.user_desired_structures.name;
            // Add condition to check for matching answer_text in the related column
            const relatedColumnName = current_question.related_column;
            if (user.current_answers !== null && user.current_answers.length >= 2) {
                for (const current_answer of user.current_answers) {
                    const checkExistenceSql = `SELECT * FROM \`${userDesiredStructuresTableName}\` WHERE user_id = ? AND \`${relatedColumnName}\` = ?`;
                    const checkExistenceArgs = [user.user_id, current_answer];
                    const existingRecords = (await dbc.query(
                        checkExistenceSql,
                        checkExistenceArgs
                    )) as object[];
                    if (existingRecords.length === 0) {
                        const insertSql = `INSERT INTO \`${userDesiredStructuresTableName}\` (user_id, desired_structure) VALUES (?, ?)`;
                        const insertArgs = [user.user_id, current_answer];
                        await dbc.query(insertSql, insertArgs);
                        console.log(
                            'Inserted a new record into the database for user_id:',
                            user.user_id
                        ); // Log message in English
                    }
                }
            } else {
                console.log('user.current_answers', user.current_answers);
                throw new Error('current_answers is null or has less than 2 elements');
            }
        } else {
            await dbc.update(
                current_question.related_table,
                { [current_question.related_column]: answer_text },
                'user_id = "' + user.user_id + '"'
            );
        }
        console.log('Answer save successful'); // Log message in English
    } catch (err) {
        console.error('Error updating user column: ', err); // Log error message in English
        throw err;
    } finally {
        await dbc.disconnect();
    }
}

function endAction(user: User, current_survey_id: string) {
    //--------いずれminor_state遷移のトリガー処理を追加！！
    switch (current_survey_id) {
        case 'basic_info':
            user.minor_state_id = 'basic_info_registered';
            break;
        case 'property_conditions':
            user.minor_state_id = 'search_condition_added';
            break;
        default:
    }
    //--------------------------------------------------------
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
    ] as Message[];
}

function setQuestion(user: User, current_question: Question) {
    // Initialize message explicitly
    let message: Message[] | FlexMessage[];

    if (current_question.design) {
        // Flex message
        message = [
            {
                type: 'flex',
                altText: '次の質問をご確認ください。',
                contents: current_question.design,
            },
        ];
    } else {
        // Text message with conditional quickReply, using type guard
        message = [
            {
                type: 'text',
                text: current_question.text || '質問のテキストが設定されていません。',
                ...('options' in current_question && {
                    // 型ガードを使用してoptionsの存在をチェック
                    quickReply: {
                        items: generateQuickReplyItems(current_question.options),
                    },
                }),
            },
        ];
    }

    // update user response
    user.response.message = message;
}

function getNextQuestion(
    answer_text: string,
    current_question: Question,
    current_survey: Survey
): Question | undefined {
    let next_question;
    // Check if current_question.next is a string or an object
    if (current_question.type !== 'single-choice') {
        next_question = current_survey?.questions.find(
            (question) => question.id === current_question.next
        );
    } else {
        // Find the option that matches the answer_text
        const selected_option = current_question.options.find(
            (option) => option.text === answer_text
        );
        if (selected_option) {
            // Find the question that matches the id in current_question.next
            next_question = current_survey?.questions.find(
                (question) => question.id === current_question.next[selected_option.id]
            );
        }
    }
    return next_question;
}
