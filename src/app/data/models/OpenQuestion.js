(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('OpenQuestion', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function OpenQuestion(data) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, data, _protected);

            function answer(answers) {
                that.score = answers ? 100 : 0;
            }
        };

    }
}());