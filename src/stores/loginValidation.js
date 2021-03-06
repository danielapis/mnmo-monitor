import {Store} from 'flummox';
import URLs from '../../config/endpoints.js';
import {
    chooseTextOrJSON,
    parseCaptchaSetup,
    languageNames
} from '../../config/apiHelpers';

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
        this.register(sessionActions.signIn, this.sessionStart);
        this.state = {
            captchaQuestion: null,
            captchaQuestionID: null,
            captchaAnswers: [],
            selectedAnswerIndex: null,
            submitLabelKey: submitLabelKeys.access,
            canSubmit: false
        };
        this.userStore = flux.getStore('user');
        this.flux = flux;
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
        let store = this,
            url = URLs.baseUrl + URLs.validation.captcha + '?' +
                URLs.session.loginLanguageParam + '=' +
                (languageNames[this.userStore.state.languageID || 0]);
        // console.log('GET', url);
        fetch(url)
        .then(chooseTextOrJSON)
        .then(function(payload) {
            // console.log('OK', URLs.validation.captcha);
            let languageStore = store.flux.getStore('language');
            let questionTemplate = languageStore.state.messages.login.question;
            let options = parseCaptchaSetup(payload, questionTemplate);
            store.setState({
                captchaQuestionID: options.questionID,
                captchaQuestion: options.question,
                captchaAnswers: options.answers
            });
        }).catch(function(ex) {
            console.log('parsing failed ' + URLs.validation.captcha, ex); // eslint-disable-line
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
    sessionStart(){
        this.setState({
            canSubmit: false,
            submitLabelKey: submitLabelKeys.loading
        });
    }
}

export default LoginValidationStore;
