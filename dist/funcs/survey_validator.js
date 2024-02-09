"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.surveyValidator = void 0;
const ERROR_MESSAGES = {
    INVALID_TEXT: '回答が無効な形式です。文字列を入力してください。',
    INVALID_CHOICE: '回答が無効な形式です。表示される選択肢の中から選択してください。',
    INVALID_NUMBER: '回答が無効な形式です。0以上の数字を入力してください。',
    NO_OPTIONS: '選択肢が存在しません。',
    UNSUPPORTED_QUESTION: '問題が発生しました、お手数ですが担当にご連絡をお願いいたします。',
};
function validateTextType(answer_text) {
    if (typeof answer_text !== 'string' || answer_text.trim() === '') {
        return {
            isValid: false,
            error_message: ERROR_MESSAGES.INVALID_TEXT,
        };
    }
    return { isValid: true, answer_text_revised: answer_text };
}
function validateChoiceType(answer_text, options) {
    if (!options.some((option) => option.text === answer_text)) {
        return {
            isValid: false,
            error_message: ERROR_MESSAGES.INVALID_CHOICE,
        };
    }
    return { isValid: true, answer_text_revised: answer_text };
}
function validateNumberType(answer_text) {
    if (isNaN(Number(answer_text)) || Number(answer_text) < 0) {
        return {
            isValid: false,
            error_message: ERROR_MESSAGES.INVALID_NUMBER,
        };
    }
    return { isValid: true, answer_text_revised: answer_text };
}
function surveyValidator(user, answer_text) {
    if (user.current_question_id === null) {
        throw new Error('The current question is undefined.');
    }
    let validationResult;
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
            validationResult = validateTextType(answer_text);
            break;
        case 'residence_category':
        case 'family_structure_spouse':
        case 'purchaser_category':
            if ('options' in current_question) {
                validationResult = validateChoiceType(answer_text, current_question.options);
            }
            else {
                validationResult = { isValid: false, error_message: ERROR_MESSAGES.NO_OPTIONS };
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
            validationResult = validateNumberType(answer_text);
            break;
        //property_conditions survey
        case 'price':
        case 'target':
        case 'area':
        case 'structure':
        case 'yield':
            if ('options' in current_question) {
                validationResult = validateChoiceType(answer_text, current_question.options.filter((option) => { var _a; return !((_a = user.current_answers) === null || _a === void 0 ? void 0 : _a.includes(option.text)); }));
            }
            else {
                validationResult = { isValid: false, error_message: ERROR_MESSAGES.NO_OPTIONS };
            }
            break;
        default:
            console.log('The current question is not supported for validation.');
            validationResult = {
                isValid: false,
                error_message: ERROR_MESSAGES.UNSUPPORTED_QUESTION,
            };
    }
    if (!validationResult.isValid) {
        return {
            isValid: false,
            error_message: validationResult.error_message,
            user_object: user,
        };
    }
    else {
        return {
            isValid: true,
            answer_text_revised: answer_text,
            user_object: user,
        };
    }
}
exports.surveyValidator = surveyValidator;
