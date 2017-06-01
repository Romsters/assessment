(function () {
	"use strict";

    angular.module('assessment')
		.factory('questionsFactory', questionsFactory);

	questionsFactory.$inject = [
		'SingleSelectText',
		'MultipleSelectText',
		'TextMatching',
		'DragAndDropText',
		'Statement',
		'SingleSelectImage',
		'FillInTheBlanks',
		'Hotspot',
		'OpenQuestion',
        'ScenarioQuestion',
        'RankingText'
	];

	function questionsFactory (
		SingleSelectText,
		MultipleSelectText,
		TextMatching,
		DragAndDropText,
		Statement,
		SingleSelectImage,
		FillInTheBlanks,
		Hotspot,
		OpenQuestion,
        ScenarioQuestion,
        RankingText
	) {
			
		var models = {
			singleSelectText: 	function (data) { return new SingleSelectText(data); },
			statement: 			function (data) { return new Statement(data); },
			singleSelectImage: 	function (data) { return new SingleSelectImage(data); },
			dragAndDropText: 	function (data) { return new DragAndDropText(data); },
			textMatching: 		function (data) { return new TextMatching(data); },
			fillInTheBlank:		function (data) { return new FillInTheBlanks(data); },
			hotspot: 			function (data) { return new Hotspot(data); },
			multipleSelect: 	function (data) { return new MultipleSelectText(data); },
			openQuestion: 		function (data) { return new OpenQuestion(data); },
			scenario:           function (data) { return new ScenarioQuestion(data) },
			rankingText:        function (data) { return new RankingText(data) }
		};
		
		return {
			createQuestion: function (sectionId, questionData) {
				questionData.sectionId = sectionId;
				
				if (!_.isFunction(models[questionData.type])) {
					return null;
                } else {
					return models[questionData.type](questionData);
				}
			}
		};
	}

})();