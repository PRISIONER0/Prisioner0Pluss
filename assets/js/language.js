// assets/js/language.js
(function() {
    if (!localStorage.getItem('user_language')) {
        let userLang = navigator.language || navigator.userLanguage;
        if (userLang && userLang.toLowerCase().startsWith('pt')) {
            localStorage.setItem('user_language', 'pt');
        } else {
            localStorage.setItem('user_language', 'es');
        }
    }
})();