import { DatabaseCommunicator } from '../classes/DatabaseCommunicator';
import { db_data } from '../data/config';
import {
    handleTextQuestion,
    handleSingleChoiceQuestion,
    handleMultipleChoiceQuestion,
} from './question_handler';
import { basicInfoValidator } from './survey_validator';
import { User } from '../classes/User';
import { Step } from '../data/user_states';
import { Message, FlexMessage, generateQuickReplyItems } from './message_helper';
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
            setNextQuestion(user, current_question);
        } else {
            throw new Error('Next step not found.');
        }
        console.log(`Updated the user's step to ${user.current_step_id}`);
        console.log('Storing the user to database.'); // Log message
        try {
            updateUserInDatabase(user);
        } catch (err) {
            console.error('Error updating user in database: ', err);
            // Handle the error appropriately
        }
        return user;
    } else {
        throw new Error('User is in initial step, but current action is not a survey action.');
    }
}

// 他のupdateUserInDatabaseを呼び出している関数も同様に修正します。

async function handleSubsequentSteps(user: User, answer_text: string): Promise<User> {
    let validation_result = basicInfoValidator(user, answer_text);
    user = validation_result.user_object;
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
        console.log('Storing answer to database.'); // Log message
        try {
            await storeAnswerInDatabase(user, answer_text);
        } catch (err) {
            console.error('Error storing answer in database: ', err); // Log message
            // Handle the error appropriately
        }
        console.log('Answer stored in database successfully.'); // Log message
        if (process_result.goToNextStep) {
            handleNextStep(user, answer_text);
        }
        return user;
    } else {
        console.log('Answer is not valid. Returning user object from validator.'); // Log message
        user.response.message = {
            type: 'text',
            text: validation_result.error_message,
        } as Message;
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
        endAction(user);
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
                setNextQuestion(user, next_question);
            }
            console.log(`Updated the user's step to ${user.current_step_id}`);
        } else {
            throw new Error('Current action does not have steps.');
        }
    }
    console.log('Storing the user to database.'); // Log message
    try {
        updateUserInDatabase(user);
    } catch (err) {
        console.error('Error updating user in database: ', err);
        // Handle the error appropriately
    }
}

// Rewrite the function to use async/await
async function updateUserInDatabase(user: User) {
    let dbc = new DatabaseCommunicator(db_data);
    try {
        await dbc.connect();
        await dbc.updateUser(user);
        console.log('User Update successful'); // Log message
    } catch (err) {
        console.error('Error updating user column: ', err); // Log error message
        throw err;
    } finally {
        await dbc.disconnect();
    }
}

async function storeAnswerInDatabase(user: User, answer_text: string) {
    let dbc = new DatabaseCommunicator(db_data);
    await dbc.connect();
    const current_question = user.getCurrentQuestion();
    console.log('現在の質問：', user.current_question_id); // Log message in English
    try {
        await dbc.update(
            current_question.related_table,
            { [current_question.related_column]: answer_text },
            'user_id = "' + user.user_id + '"'
        );
        console.log('Answer save successful'); // Log message in English
    } catch (err) {
        console.error('Error updating user column: ', err); // Log error message in English
        throw err;
    } finally {
        await dbc.disconnect();
    }
}

function endAction(user: User) {
    user.current_action_id = null;
    user.current_survey_id = null;
    user.current_step_id = null;
    user.current_question_id = null;
    user.current_answers = null;
    user.response.shouldReply = true;
    user.response.message = {
        type: 'text',
        text: '質問は以上です、お疲れさまでした！担当が対応いたしますのでしばらくお待ちくださいませ。',
    } as Message;
}

function setNextQuestion(user: User, current_question: Question) {
    // Initialize message explicitly
    let message: Message | FlexMessage;

    if (current_question.design) {
        // Flex message
        message = {
            type: 'flex',
            altText: '次の質問をご確認ください。',
            contents: current_question.design,
            ...('options' in current_question && {
                // 型ガードを使用してoptionsの存在をチェック
                quickReply: {
                    items: generateQuickReplyItems(current_question.options),
                },
            }),
        } as FlexMessage;
    } else {
        // Text message with conditional quickReply, using type guard
        message = {
            type: 'text',
            text: current_question.text || '質問のテキストが設定されていません。',
            ...('options' in current_question && {
                // 型ガードを使用してoptionsの存在をチェック
                quickReply: {
                    items: generateQuickReplyItems(current_question.options),
                },
            }),
        } as Message;
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
