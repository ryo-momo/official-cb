import user_states from '../data/user_states';
import surveys from '../data/survey_content';
import User from '../User';

// User class test cases
describe('User class tests', () => {
    let user;
    let user_property;

    beforeEach(() => {
        user_property = {
            user_id: 'test_user_id',
            user_line_id: 'test_user_line_id',
            major_state_id: 'property_searching',
            minor_state_id: 'added',
            current_action_id: 'basic_info_registeration',
            current_survey_id: 'basic_info',
            current_step_id: 'name_primary',
            current_question: 'お客様のフルネームをお教えください。'
        };
        user = new User(user_property);
    });

    test('User is in initial step when current_step_id is null', () => {
        user.current_step_id = null;
        expect(user.isInInitialStep()).toBe(true);
    });

    test('User is not in initial step when current_step_id is not null', () => {
        expect(user.isInInitialStep()).toBe(false);
    });

    test('getCurrentMajorState returns the correct major state object', () => {
        const majorState = user.getCurrentMajorState();
        expect(majorState).toEqual(user_states.major_states.find(major_state => major_state.state_id === user.major_state_id));
    });

    test('getCurrentMinorState returns the correct minor state object', () => {
        const minorState = user.getCurrentMinorState();
        expect(minorState).toEqual(user_states.major_states.find(major_state => major_state.state_id === user.major_state_id).minor_states.find(minor_state => minor_state.state_id === user.minor_state_id));
    });

    test('getCurrentAction returns the correct action object', () => {
        const action = user.getCurrentAction();
        expect(action).toEqual(user_states.actions.find(action => action.action_id === user.current_action_id));
    });

    test('getCurrentStep returns the correct step object', () => {
        const step = user.getCurrentStep();
        expect(step).toEqual(user_states.actions.find(action => action.action_id === user.current_action_id).steps.find(step => step.step_id === user.current_step_id));
    });

    test('getCurrentSurvey returns the correct survey object or null if an error occurs', () => {
        // Assuming surveys is imported or accessible in the test environment
        const survey = user.getCurrentSurvey();
        if (survey) {
            expect(survey).toEqual(surveys.surveys.find(survey => survey.id === user.current_survey_id));
        } else {
            expect(survey).toBeNull();
        }
    });
});