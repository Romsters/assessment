(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('ScenarioQuestion', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function ScenarioQuestion(data) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, data, _protected);

            that.embedCode = data.embedCode;

            that.embedUrl = data.embedUrl;

            that.projectId = data.projectId;

            that.masteryScore = data.masteryScore;

            function answer(score) {
                that.score = score >= that.masteryScore ? 100 : 0;
            }
        };

    }
}());