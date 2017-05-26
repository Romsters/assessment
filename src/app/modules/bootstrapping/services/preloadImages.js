(function () {
    'use strict';

    angular.module('bootstrapping')
        .service('preloadImagesService', preloadImagesService);

    preloadImagesService.$inject = ['$q'];

    function preloadImagesService($q) {
        var that = this;

        that.preloadImage = function(key, img) {
            var defer = $q.defer(),
                image = new Image();

            img.hasOwnProperty('attributes') && img.attributes.forEach(function (attr) {
                image.setAttribute(attr.key, attr.value);
            });

            image.onload = function() {
                defer.resolve({key: key, image: image});
            }

            image.onerror = function() {
                defer.resolve({key: key, image: image});
            }

            image.src = img.src;

            return defer.promise;
        }

        that.preloadImages = function(images) {
            var promises = [],
                defer = $q.defer();

            for(var key in images) {
                promises.push(that.preloadImage(key, images[key]));
            }

            $q.all(promises).then(function(imagesArr){
                var result = {};

                for(var i = 0; i < imagesArr.length; i++) {
                    result[imagesArr[i].key] = imagesArr[i].image;
                }

                defer.resolve(result);
            })

            return defer.promise;
        }
    }
})();