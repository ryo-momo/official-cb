import { User } from '../classes/User';
import { SingleChoiceQuestion, MultipleChoiceQuestion } from '../data/survey_content';

interface QuestionHandlerResult {
    user_object: User;
    storeValueToDB: boolean;
    goToNextStep: boolean;
}

export function handleTextQuestion(user: User, answer_text: string): QuestionHandlerResult {
    return {
        user_object: user,
        storeValueToDB: true,
        goToNextStep: true,
    };
}

export function handleSingleChoiceQuestion(user: User, answer_text: string): QuestionHandlerResult {
    return {
        user_object: user,
        storeValueToDB: true,
        goToNextStep: true,
    };
}

export function handleMultipleChoiceQuestion(
    user: User,
    answer_text: string
): QuestionHandlerResult {
    const current_question = user.getCurrentQuestion();
    if (user.current_answers && current_question) {
        //add the answer to the current answer array
        user.current_answers.push(answer_text);
        if (current_question && 'choices_allowed' in current_question) {
            //delete the selected option from the current option array
            current_question.options = current_question.options.filter(
                (option) => option.text !== answer_text
            );
        } else {
            throw new Error('ERROR: current_question.options is null');
        }

        const answers_to_go = current_question.choices_allowed - user.current_answers.length;
        const answers_in_text = user.current_answers.join('\n');

        //if the number of the answers reach the maximum, store those to DB
        //if not, have the user select another answer
        if (answers_to_go === 0) {
            return {
                user_object: user,
                storeValueToDB: true,
                goToNextStep: true,
            };
        } else if (answers_to_go > 0) {
            current_question.text = `${current_question.text}\n\n残り選択数：${answers_to_go}個\n既に選んだもの：\n${answers_in_text}`;
            return {
                user_object: user,
                storeValueToDB: false,
                goToNextStep: false,
            };
        } else {
            throw new Error('ERROR: answers_to_go has gone less than zero');
        }
    } else {
        throw new Error('ERROR: current_question is null');
    }
}
