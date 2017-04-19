(function () {
    'use strict';

    angular.module('assessment.xApi').factory('textMatchingDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
			var sources = _.pluck(question.answers, 'key'),
				targets = _.uniq(_.pluck(question.answers, 'value'));
				
            var response = _.map(answers, function (value) {
                return _.indexOf(sources, value.key) + '[.]' + (value.value ? _.indexOf(targets, value.value) : '');
            }).join('[,]');

            var correctResponsesPattern = [_.map(question.answers, function (answer, index) {
                    return index.toString() + '[.]' + _.indexOf(targets, answer.value);
                }).join('[,]')];

            var source = _.map(sources, function (answer, index) {
                return {
                    id: index.toString(),
                    description: {
                        'en-US': answer
                    }
                };
            });

            var target = _.map(targets, function (answer, index) {
                return {
                    id: index.toString(),
                    description: {
                        'en-US': answer
                    }
                };
            });

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: question.score / 100
                }),
                response: response
            });

            var activity = new TinCan.Activity({
                id: questionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    },
                    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    interactionType: interactionTypes.matching,
                    correctResponsesPattern: correctResponsesPattern,
                    source: source,
                    target: target
                })
            });

            return {
                object: activity,
                result: result
            };
        };
    }
}());