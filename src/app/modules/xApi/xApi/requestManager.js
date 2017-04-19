(function () {
    'use strict';

    angular.module('assessment.xApi')
        .factory('xApiRequestManager', xApiRequestManager);

    xApiRequestManager.$inject = ['$q', 'StatementsStorage', 'errorsHandler'];

    function xApiRequestManager($q, statementsStorage, errorsHandler) {
        var xApi = null,
            defers = [];

        return {
            sendStatements: sendStatements,
            init: init
        };

        function init(xapi) {
            xApi = xapi;
        }

        function sendStatements() {
            send();
            return $q.all(defers);
        }

        function send() {
            var tempArray = [],
                stmts = statementsStorage.shift();

            if (stmts.length !== 0) {
                _.each(stmts, function (stmt) {
					tempArray.push(stmt.item);
                });
					
				while(tempArray.length) {
					var defer = $q.defer();
					defers.push(defer.promise);
						
					xApi.sendStatements(tempArray.splice(0,5), function (errors) {
						_.each(errors, function (error) {
							if (error.err != null) {
								errorsHandler.handleError();
							}
						});
						defer.resolve();
					});
				}
			} 
        }
    }

}());
