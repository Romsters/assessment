(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('TextMatching', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function TextMatching(data) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, data, _protected);

            that.answers = data.answers;

            function answer(pairs) {
                var correct = 0;

                pairs.forEach(function (pair) {
                    if (_.find(that.answers, function (item) {
                        return item.key === pair.key && item.value === pair.value;
                    })) {
                        correct++;
                    }
                });

                that.score = (correct === that.answers.length) ? 100 : 0;
            }
        };
    }

}());