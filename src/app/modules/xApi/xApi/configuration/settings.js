(function () {
    'use strict';

    angular.module('assessment.xApi')
        .factory('xApiSettings', xApiSettings);

    xApiSettings.$inject = ['settings', 'publishSettings'];

    function xApiSettings(settingsProvider, publishSettingsProvider) {
        var settings = {
            xApi: {
                allowedVerbs: [],
                version: '1.0.0'
            },
            init: init
        };

        var host = window.location.host;
        var lrsHost = publishSettingsProvider.defaultLRSUrl || 'reports.easygenerator.com';

        var defaultSettings = {
            lrs: {
                uri: '//' + lrsHost + '/xApi/statements',
                authenticationRequired: false,
                credentials: {
                    username: '',
                    password: ''
                }
            },
            allowedVerbs: ['started', 'stopped', 'experienced', 'mastered', 'answered', 'passed', 'failed']
        };

        return settings;

        function init() {
            if (settingsProvider.xApi.selectedLrs !== 'default') {
                $.extend(settings.xApi, settingsProvider.xApi);
            } else {
                $.extend(settings.xApi, defaultSettings);
            }
        }
    }
}());