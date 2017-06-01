(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('FillInTheBlanks', factory);

    factory.$inject = ['$q', 'Question', 'htmlContentLoader'];

    function factory($q, Question, htmlContentLoader) {
        return function FillInTheBlanks(data) {
            var that = this,
                _protected = {
                    answer: answer,
                    load: loadContent
                };

            Question.call(that, data, _protected);

            that.content = null;
            that.hasContent = data.hasContent;
            that.groups = data.answerGroups;

            function loadContent() {
                var that = this;
                return $q.when(null, function () {
                    if (that.hasContent) {
                        return htmlContentLoader.load('content/' + that.sectionId + '/' + that.id + '/content.html').success(function(content) {
                            that.content = content;
                        });
                    }
                });
            }
            
            function answer(answers) {
                var correct = 0;
                _.each(that.groups, function (group) {
                    if (_.find(group.answers, function (answer) {
                        return answer.isCorrect &&
                            (answer.matchCase ? answers[group.id] === answer.text : answers[group.id].toLowerCase() === answer.text.toLowerCase());
                    })) {
                        correct++;
                    }
                });

                that.score = correct === that.groups.length ? 100 : 0;
            }
        };
    }
}());