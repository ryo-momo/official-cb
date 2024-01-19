//Validates the answer_text for corresponding question
//It also revises the answer to certain format for some questions.
function basicInfoValidator(user, answer_text){
    const response = {
        isValid: true,
        answer_text_revised: answer_text,
        user_object: user
    }

    switch(user.current_question.id){
        case "name_primary":
        case "name_kana":
        case "address":
        case "email_address":
        case "workplace_name":
        case "workplace_address":
        case "department":
        case "job_category":
            // テキストタイプの質問に対するバリデーション
            if (typeof answer_text !== 'string' || answer_text.trim() === '') {
                response.isValid = false;
                response.user_object.current_question.text = "回答が無効な形式です。文字列を入力してください。\n\n" + response.user_object.current_question.text;
            }
            break;
        case "postal_code":
            // 郵便番号のバリデーション
            const revisedPostalCode = answer_text.replace(/\D/g, '');
            const postalCodePattern = /^\d{7}$/;
            if (!postalCodePattern.test(revisedPostalCode)) {
                response.isValid = false;
                response.user_object.current_question.text = "回答が無効な形式です。7桁の数字を入力してください。\n\n" + response.user_object.current_question.text;
            } else {
                response.answer_text_revised = revisedPostalCode;
            }
            break;
        case "phone_number":
            // 電話番号のバリデーション
            const revisedPhoneNumber = answer_text.replace(/\D/g, '');
            if (revisedPhoneNumber.length < 9) {
                response.isValid = false;
                response.user_object.current_question.text = "回答が無効な形式です。9桁以上の数字を入力してください。\n\n" + response.user_object.current_question.text;
            } else {
                response.answer_text_revised = revisedPhoneNumber;
            }
            break;
        case "residence_category":
        case "family_structure_spouse":
        case "purchaser_category":
            // 単一選択タイプの質問に対するバリデーション
            if (!user.current_question.options.some(option => option.text === answer_text)) {
                response.isValid = false;
                response.user_object.current_question.text = "回答が無効な形式です。表示される選択肢の中から選択してください。\n\n" + response.user_object.current_question.text;
            }
            break;
        case "years_of_service":
        case "gross_salary_-1":
        case "gross_salary_-2":
        case "gross_salary_-3":
        case "family_structure_children":
        case "borrowed_money":
        case "deposit":
        case "other_assets":
            // 数値タイプの質問に対するバリデーション
            if (isNaN(answer_text) || answer_text < 0) {
                response.isValid = false;
                response.user_object.current_question.text = "回答が無効な形式です。0以上の数字を入力してください。\n\n" + response.user_object.current_question.text;
            }
            break;
        default:
            response.isValid = false;
    }

    return response;
}