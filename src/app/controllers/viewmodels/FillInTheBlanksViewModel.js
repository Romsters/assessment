﻿(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('FillInTheBlanksViewModel', ['QuestionViewModel', function (QuestionViewModel) {

            return function FillInTheBlanksViewModel(question) {
                QuestionViewModel.call(this, question);

                var that = this;

                that.templateUrl = question.contentUrl;
                delete that.contentUrl;

                that.getType = function () {
                    return 'fillInTheBlanks';
                };

                that.groups = question.groups.map(function (group) {
                    return {
                        groupId: group.id,
                        answer: null,
                        answers: group.answers.map(function (answer) {
                            return {
                                text: answer.text
                            };
                        })
                    };
                });

                that.submit = function () {
                    question.answer(_.chain(that.groups)
                        .map(function (group) {
                            return {
                                groupId: group.groupId,
                                answer: group.answer
                            };
                        })
                        .reduce(function (obj, ctx) {
                            obj[ctx.groupId] = ctx.answer;
                            return obj;
                        }, {})
                        .value());
                };
            };

        }]);

}());