(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('Question', factory);

    factory.$inject = ['$q', '$http', '$rootScope', 'ContentBlock'];

    function factory($q, $http, $rootScope, ContentBlock) {
        return function Question(data, _protected) {
            var that = this;
            that.id = data.id;
            that.sectionId = data.sectionId;
            that.title = data.title;
            
            that.affectProgress = true;

            if (typeof data.isSurvey !== 'undefined') {
                that.isSurvey = data.isSurvey;
                that.affectProgress = !that.isSurvey;
            }

            that.learningContents = data.learningContents.map(function (contentBlock) {
                var contentBlockUrl = 'content/' + that.sectionId + '/' + that.id + '/' + contentBlock.id + '.html';
                return new ContentBlock(contentBlock.id, contentBlockUrl);
            });

            that.instructions = data.questionInstructions.map(function (contentBlock) {
                var contentBlockUrl = 'content/' + that.sectionId + '/' + that.id + '/' + contentBlock.id + '.html';
                return new ContentBlock(contentBlock.id, contentBlockUrl);
            });

            that.type = data.type;
            that.score = 0;

            that.answer = function () {
                _protected.answer.apply(this, arguments);

                $rootScope.$emit('question:answered', {
                    question: that,
                    answers: arguments[0]
                });
            };

            that.learningContentsExperienced = function (time) {
                $rootScope.$emit('learningContent:experienced', {
                    question: that,
                    time: time
                });
            };

            that.load = function () {
                return $q.when(null, function () {
                    var promises = [];
                    _.each(that.instructions, function (contentBlock) {
                        promises.push($http.get(contentBlock.contentUrl, { dataType: 'html' }).success(function (response) {
                            contentBlock.content = response;
                        }));
                    });

                    return $q.all(promises).then(function() {
                        if (!_.isNull(_protected) && _.isFunction(_protected.load)) {
                            return _protected.load.apply(that);
                        }
                    });
                });
            };
        };
    }

} ());