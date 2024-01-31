import { User } from '../classes/User';
import { QuestionOption } from '../data/survey_content';

interface ValidResult {
    isValid: true;
}

interface InvalidResult {
    isValid: false;
    error_message: string;
}

type ValidationResult = ValidResult | InvalidResult;

interface ValidatorResponse {
    isValid: boolean;
    answer_text_revised: string;
    user_object: User;
    error_message: string | null;
}

function validateTextType(answer_text: string): ValidationResult {
    if (typeof answer_text !== 'string' || answer_text.trim() === '') {
        return {
            isValid: false,
            error_message: '回答が無効な形式です。文字列を入力してください。\n\n',
        };
    }
    return { isValid: true };
}

function validateSingleChoiceType(
    answer_text: string,
    options: QuestionOption[]
): ValidationResult {
    if (!options.some((option) => option.text === answer_text)) {
        return {
            isValid: false,
            error_message: '回答が無効な形式です。表示される選択肢の中から選択してください。\n\n',
        };
    }
    return { isValid: true };
}

function validateNumberType(answer_text: string): ValidationResult {
    if (isNaN(Number(answer_text)) || Number(answer_text) < 0) {
        return {
            isValid: false,
            error_message: '回答が無効な形式です。0以上の数字を入力してください。\n\n',
        };
    }
    return { isValid: true };
}

export function basicInfoValidator(user: User, answer_text: string): ValidatorResponse {
    if (user.current_question_id === null) {
        throw new Error('The current question is undefined.');
    }
    const validator_response: ValidatorResponse = {
        isValid: true,
        //TODO 回答のフォーマッタ関数実装！！！！
        answer_text_revised: answer_text,
        user_object: user,
        error_message: null,
    };

    let validationResult: ValidationResult;
    let current_question = user.getCurrentQuestion();
    switch (current_question.id) {
        case 'name_primary':
        case 'name_kana':
        case 'address':
        case 'email_address':
        case 'workplace_name':
        case 'workplace_address':
        case 'department':
        case 'job_category':
            validationResult = validateTextType(answer_text);
            break;
        case 'postal_code':
        case 'phone_number':
            const revisedAnswer = answer_text.replace(/\D/g, '');
            validationResult = validateTextType(revisedAnswer);
            if (validationResult.isValid) {
                validator_response.answer_text_revised = revisedAnswer;
            }
            break;
        case 'residence_category':
        case 'family_structure_spouse':
        case 'purchaser_category':
            if ('options' in current_question) {
                validationResult = validateSingleChoiceType(answer_text, current_question.options);
            } else {
                validationResult = { isValid: false, error_message: '選択肢が存在しません。\n\n' };
            }
            break;
        case 'years_of_service':
        case 'gross_salary_-1':
        case 'gross_salary_-2':
        case 'gross_salary_-3':
        case 'family_structure_children':
        case 'borrowed_money':
        case 'deposit':
        case 'other_assets':
            validationResult = validateNumberType(answer_text);
            break;
        default:
            console.log('The current question is not supported for validation.');
            validationResult = {
                isValid: false,
                error_message:
                    '問題が発生しました、お手数ですが担当にご連絡をお願いいたします。\n\n',
            };
    }

    if (!validationResult.isValid) {
        validator_response.isValid = false;
        validator_response.error_message = validationResult.error_message;
    }
    return validator_response;
}
