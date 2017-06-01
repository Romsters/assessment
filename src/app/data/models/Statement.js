(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('Statement', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function Statement(data) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, data, _protected);

            that.options = data.answers;

            function answer(statements) {
                var correct = 0;

                statements.forEach(function (statement) {
                    if (_.find(that.options, function (option) {
                        return option.text === statement.text && option.isCorrect === statement.state;
                    })) {
                        correct++;
                    }
                });

                that.score = (correct === that.options.length) ? 100 : 0;
            }
        };
    }

}());