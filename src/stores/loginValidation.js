import {Store} from 'flummox';
import URLs from '../../config/entrypoints.json';
import {parseCaptchaSetup} from '../../config/apiHelpers';

const submitLabelKeys = {
    loading: 'loading',
    missingUsername: 'missingUsername',
    missingPassword: 'missingPassword',
    missingTos: 'missingTos',
    missingCaptcha: 'missingCaptcha',
    access: 'access'
};

class LoginValidationStore extends Store {
    constructor(flux) {
        super();
        const loginValidationActions = flux.getActions('loginValidation');
        const sessionActions = flux.getActions('session');
        this.register(loginValidationActions.captchaAnswered, this.changeCaptchaAnswerIndex);
        this.register(sessionActions.signOut, this.fetchCaptcha);
        this.state = {
            captchaQuestion: null,
            captchaQuestionID: null,
            captchaAnswers: [],
            selectedAnswerIndex: null,
            submitLabelKey: submitLabelKeys.access,
            canSubmit: false
        };
        this.userStore = flux.getStore('user');
        this.userStore.addListener('change', this.validate.bind(this));
        this.validate();
        this.fetchCaptcha();
    }
    validate() {
        let userData = this.userStore.state;
        if (userData.username.trim().length === 0){
            this.setState({
                canSubmit: false,
                submitLabelKey: submitLabelKeys.missingUsername
            });
        } else if (userData.password.trim().length === 0){
            this.setState({
                canSubmit: false,
                submitLabelKey: submitLabelKeys.missingPassword
            });
        } else if (userData.captchaAnswer === null){
            this.setState({
                canSubmit: false,
                submitLabelKey: submitLabelKeys.missingCaptcha
            });
        } else if (userData.tosAgree === false){
            this.setState({
                canSubmit: false,
                submitLabelKey: submitLabelKeys.missingTos
            });
        }else {
            this.setState({
                canSubmit: true,
                submitLabelKey: submitLabelKeys.access
            });
        }
    }
    fetchCaptcha() {
        //clear previous answer selection
        this.setState({
            selectedAnswerIndex: null
        });
        let store = this;
        /* global fetch */
        /* comes from the polyfill https://github.com/github/fetch */
        fetch(URLs.baseUrl + URLs.validation.captcha)
        .then(function(response) {
            let contentType = response.headers.get('Content-Type'),
                isJSON = (contentType.indexOf('application/json') > -1);
            if (isJSON) {
                return response.json();
            } else {
                console.warn(`got ${contentType} instead of application/json`);
                return response.text();
            }
        })
        .then(function(payload) {
            let options = parseCaptchaSetup(payload);
            store.setState({
                captchaQuestionID: options.questionID,
                captchaQuestion: options.question,
                captchaAnswers: options.answers
            });
        }).catch(function(ex) {
            console.log('parsing failed', ex);
        });
    }
    changeCaptchaAnswerIndex(answer){
        let answerIndex = null;
        this.state.captchaAnswers.forEach(function(a, index) {
            if (a.toString() === answer){
                answerIndex = index;
            }
        });
        this.setState({
            selectedAnswerIndex: answerIndex
        });
    }
}

export default LoginValidationStore;
