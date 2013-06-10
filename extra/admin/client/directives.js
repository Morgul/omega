//----------------------------------------------------------------------------------------------------------------------
// Directives for omega admin section.
//
// @module directives
//----------------------------------------------------------------------------------------------------------------------

var Directives = angular.module('omega.admin.directives', []);

//----------------------------------------------------------------------------------------------------------------------

Directives.controller('SlugifyController', ['$scope', '$attrs', '$element', '$parse', function($scope, $attrs, $element, $parse)
{
    var modelFunc = $parse($attrs.ngModel);

    $scope.$watch($attrs.slugify, function(newVal)
    {
        modelFunc.assign($scope, _slugify(newVal));
    });
}]); // end SlugifyController

function _slugify(s)
{
    if (!s) { return ""; }

    var ascii = [];
    var c;
    for (var i = 0; i < s.length; i++)
    {
        if ((c = s.charCodeAt(i)) < 0x80)
        {
            ascii.push(String.fromCharCode(c));
        } // end if
    } // end for

    s = ascii.join("");
    s = s.replace(/[^\w\s-]/g, "").trim().toLowerCase();
    return s.replace(/[-\s]+/g, "-");
} // end _slugify

//----------------------------------------------------------------------------------------------------------------------

Directives.directive('slugify', function()
{
    return {
        restrict: 'A',
        controller: 'SlugifyController'
    }
});

//----------------------------------------------------------------------------------------------------------------------

