/**
 * Validates a text type answer.
 * @param {string} answer_text - The answer text to validate.
 * @returns {object} A response object. If the answer is valid, isValid is set to true. If not, isValid is set to false and an error message is included.
 */
function validateTextType(answer_text) {
    if (typeof answer_text !== 'string' || answer_text.trim() === '') {
        return {
            isValid: false,
            errorMessage: "回答が無効な形式です。文字列を入力してください。\n\n"
        };
    }
    return { isValid: true };
}

/**
 * Validates a single choice type answer.
 * @param {string} answer_text - The answer text to validate.
 * @param {array} options - The options to validate against.
 * @returns {object} A response object. If the answer is valid, isValid is set to true. If not, isValid is set to false and an error message is included.
 */
function validateSingleChoiceType(answer_text, options) {
    if (!options.some(option => option.text === answer_text)) {
        return {
            isValid: false,
            errorMessage: "回答が無効な形式です。表示される選択肢の中から選択してください。\n\n"
        };
    }
    return { isValid: true };
}

/**
 * Validates a number type answer.
 * @param {string} answer_text - The answer text to validate.
 * @returns {object} A response object. If the answer is valid, isValid is set to true. If not, isValid is set to false and an error message is included.
 */
function validateNumberType(answer_text) {
    if (isNaN(answer_text) || answer_text < 0) {
        return {
            isValid: false,
            errorMessage: "回答が無効な形式です。0以上の数字を入力してください。\n\n"
        };
    }
    return { isValid: true };
}

/**
 * Validates a user's answer based on the type of the current question.
 * @param {object} user - The user object.
 * @param {string} answer_text - The answer text to validate.
 * @returns {object} A response object. If the answer is valid, isValid is set to true and the revised answer text is included. If not, isValid is set to false and an error message is included.
 */
function basicInfoValidator(user, answer_text){
    const response = {
        isValid: true,
        answer_text_revised: answer_text,
        user_object: user
    }

    let validationResult;
    switch(user.current_question.id){
        case "name_primary":
        case "name_kana":
        case "address":
        case "email_address":
        case "workplace_name":
        case "workplace_address":
        case "department":
        case "job_category":
            validationResult = validateTextType(answer_text);
            break;
        case "postal_code":
        case "phone_number":
            const revisedAnswer = answer_text.replace(/\D/g, '');
            validationResult = validateTextType(revisedAnswer);
            if (validationResult.isValid) {
                response.answer_text_revised = revisedAnswer;
            }
            break;
        case "residence_category":
        case "family_structure_spouse":
        case "purchaser_category":
            validationResult = validateSingleChoiceType(answer_text, user.current_question.options);
            break;
        case "years_of_service":
        case "gross_salary_-1":
        case "gross_salary_-2":
        case "gross_salary_-3":
        case "family_structure_children":
        case "borrowed_money":
        case "deposit":
        case "other_assets":
            validationResult = validateNumberType(answer_text);
            break;
        default:
            validationResult = { isValid: false };
    }

    if (!validationResult.isValid) {
        response.isValid = false;
        response.user_object.current_question.text = validationResult.errorMessage + response.user_object.current_question.text;
    }

    return response;
}

module.exports = basicInfoValidator

