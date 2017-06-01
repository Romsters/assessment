(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('SingleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function SingleSelectText(data) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, data, _protected);

            that.options = data.answers;

            function answer(id) {
                that.score = 0;
                that.options.forEach(function (option) {
                    if (option.id === id && option.isCorrect) {
                        that.score = 100;
                    }
                });
            }
        };

    }

}());