(function () {
    'use strict';

    angular.module('bootstrapping', []).run(runBlock);

    runBlock.$inject = ['$q', 'detectDeviceTask', 'readSettingsTask', 'preloadHtmlTask', 'authenticationTask', 'fixIEScrollTask', 'publishModuleLoader'];

    function runBlock($q, detectDeviceTask, readSettingsTask, preloadHtmlTask, authenticationTask, fixIEScrollTask, publishModuleLoader) {
        var tasks = {
            'detectDeviceTask': detectDeviceTask,
            'fixIEScrollTask': fixIEScrollTask,
            'readSettings': readSettingsTask,
            'authenticationTask': authenticationTask,
            'preloadHtmlTask': preloadHtmlTask
        };

        $q.all(tasks).then(function (data) {
            var bootstrapModules = ['assessment'],
                settings = data.readSettings,
                publishSettings = settings.publishSettings,
                publishModules = publishSettings.modules,
                user = data.authenticationTask,
                preloadHtmls = data.preloadHtmlTask,
                promises = [];

            var hasLms = false;
            if (publishSettings && publishSettings.modules) {
                _.each(publishModules, function(module) {
                    !hasLms && (hasLms = module.name === 'lms');

                    promises.push(publishModuleLoader.load(module.name).then(function(moduleInstance) {
                        return moduleInstance;
                    }, function() {
                        throw 'Cannot load publish module "' + module.name + '".';
                    }));
                });
            }

            $q.all(promises).then(function(publishModules){
                angular.module('assessment').config(['$routeProvider', 'settingsProvider', 'htmlTemplatesCacheProvider', 'userProvider', '$translateProvider',
                    function ($routeProvider, settingsProvider, htmlTemplatesCacheProvider, userProvider, $translateProvider) {
                        settingsProvider.setSettings(settings.templateSettings);
                        userProvider.set(user);
                        if (publishModules && publishModules.length > 0) {
                            _.each(publishModules, function (module) {
                                if (_.isObject(module.userInfoProvider)) {
                                    userProvider.use(module.userInfoProvider);
                                }
                            });
                        }
                        htmlTemplatesCacheProvider.set(preloadHtmls);

                        $translateProvider
                            .translations('xx', settings.translations)
                            .preferredLanguage('xx');

                        window.WebFontLoader && WebFontLoader.load(settings.templateSettings.fonts, settings.manifest, publishSettings);
                        window.LessProcessor && LessProcessor.load(settings.templateSettings.colors, settings.templateSettings.fonts);
                    }]);

                if (!settings || !settings.templateSettings || _.isEmpty(settings.templateSettings) || (settings.templateSettings.xApi && settings.templateSettings.xApi.enabled)) {
                    bootstrapModules.push('assessment.xApi');
                }

                if (publishSettings) {
                    angular.module('assessment.publishSettings').config(['publishSettingsProvider', 'publishModulesProvider', function (publishSettingsProvider, publishModulesProvider) {
                        publishSettingsProvider.setSettings(publishSettings);
                        publishModulesProvider.set(publishModules);
                    }]);

                    bootstrapModules.push('assessment.publishSettings');
                }

                if (!hasLms) {
                    bootstrapModules.push('assessment.progressStorer');
                }

                angular.bootstrap(document, bootstrapModules);
            });
        });
    }    
}());
