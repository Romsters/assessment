(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('MultipleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function MultipleSelectText(data) {
            var that = this,
                _protected = {
                    answer: answer
                };
            Question.call(that, data, _protected);

            that.options = data.answers;

            function answer(answers) {
                that.score = 100;
                that.options.forEach(function (option) {
                    if (_.contains(answers, option.id) !== option.isCorrect) {
                        that.score = 0;
                    }
                });
            }
        };
    }

}());