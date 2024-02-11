import { type User } from '../classes/User';
import { type QuestionOption } from '../data/survey_content';

interface ValidationResultBase {
    isValid: boolean;
}

interface ValidResult extends ValidationResultBase {
    isValid: true;
    answer_text_revised: string;
}

interface ValidResponse extends ValidResult {
    user_object: User;
}

interface InvalidResult extends ValidationResultBase {
    isValid: false;
    error_message: string;
}

interface InvalidResponse extends InvalidResult {
    user_object: User;
}

type ValidationResult = ValidResult | InvalidResult;
type ValidationResponse = ValidResponse | InvalidResponse;

const ERROR_MESSAGES = {
    INVALID_TEXT: '回答が無効な形式です。文字列を入力してください。',
    INVALID_CHOICE: '回答が無効な形式です。表示される選択肢の中から選択してください。',
    INVALID_NUMBER: '回答が無効な形式です。0以上の数字を入力してください。',
    NO_OPTIONS: '選択肢が存在しません。',
    UNSUPPORTED_QUESTION: '問題が発生しました、お手数ですが担当にご連絡をお願いいたします。',
};

const validateTextType = (answer_text: string): ValidationResult => {
    if (typeof answer_text !== 'string' || answer_text.trim() === '') {
        return {
            isValid: false,
            error_message: ERROR_MESSAGES.INVALID_TEXT,
        };
    }
    return { isValid: true, answer_text_revised: answer_text };
};

const validateChoiceType = (answer_text: string, options: QuestionOption[]): ValidationResult => {
    if (!options.some((option) => option.text === answer_text)) {
        return {
            isValid: false,
            error_message: ERROR_MESSAGES.INVALID_CHOICE,
        };
    }
    return { isValid: true, answer_text_revised: answer_text };
};

const validateNumberType = (answer_text: string): ValidationResult => {
    if (Number.isNaN(Number(answer_text)) || Number(answer_text) < 0) {
        return {
            isValid: false,
            error_message: ERROR_MESSAGES.INVALID_NUMBER,
        };
    }
    return { isValid: true, answer_text_revised: answer_text };
};

export const surveyValidator = (user: User, answer_text: string): ValidationResponse => {
    if (user.current_question_id === null) {
        throw new Error('The current question is undefined.');
    }

    let validation_result: ValidationResult;
    let current_question = user.getCurrentQuestion();

    switch (current_question.id) {
        //basic_info survey
        case 'name_primary':
        case 'name_kana':
        case 'address':
        case 'email_address':
        case 'workplace_name':
        case 'workplace_address':
        case 'department':
        case 'job_category':
            validation_result = validateTextType(answer_text);
            break;
        case 'residence_category':
        case 'family_structure_spouse':
        case 'purchaser_category':
            if ('options' in current_question) {
                validation_result = validateChoiceType(answer_text, current_question.options);
            } else {
                validation_result = { isValid: false, error_message: ERROR_MESSAGES.NO_OPTIONS };
            }
            break;
        case 'years_of_service':
        case 'gross_salary_minus_1':
        case 'gross_salary_minus_2':
        case 'gross_salary_minus_3':
        case 'family_structure_children':
        case 'borrowed_money':
        case 'deposit':
        case 'other_assets':
        case 'postal_code':
        case 'phone_number':
            validation_result = validateNumberType(answer_text);
            break;
        //property_conditions survey
        case 'price':
        case 'target':
        case 'area':
        case 'structure':
        case 'yield':
            if ('options' in current_question) {
                validation_result = validateChoiceType(
                    answer_text,
                    current_question.options.filter(
                        (option) => !user.current_answers?.includes(option.text)
                    )
                );
            } else {
                validation_result = { isValid: false, error_message: ERROR_MESSAGES.NO_OPTIONS };
            }
            break;
        default:
            console.log('The current question is not supported for validation.');
            validation_result = {
                isValid: false,
                error_message: ERROR_MESSAGES.UNSUPPORTED_QUESTION,
            };
    }

    if (!validation_result.isValid) {
        return {
            isValid: false,
            error_message: validation_result.error_message,
            user_object: user,
        };
    } else {
        return {
            isValid: true,
            answer_text_revised: answer_text, // または validationResult.answer_text_revised に基づいて調整する
            user_object: user,
        };
    }
};
