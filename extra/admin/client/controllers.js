//----------------------------------------------------------------------------------------------------------------------
// Angular Controllers for the omega admin section.
//
// @module controllers.js
//----------------------------------------------------------------------------------------------------------------------

var Controllers = angular.module('omega.admin.controllers', []);

//----------------------------------------------------------------------------------------------------------------------

Controllers.controller("IndexCtrl", function($scope)
{
});

//----------------------------------------------------------------------------------------------------------------------

Controllers.controller("ModelCtrl", function($scope, $routeParams, $http, $location)
{
    var modelName = $routeParams.model;
    $scope.model = _.find($scope.models, function(model){ return model.name == modelName; });
    getInstances($scope, $http, modelName);

    $scope.getName = getName;

    $scope.back = function()
    {
        $location.path('/');
    }; // end cancel
});

//----------------------------------------------------------------------------------------------------------------------

Controllers.controller("InstanceCtrl", function($scope, $routeParams, $http, $location)
{
    var modelID = $routeParams.instance;
    var modelName = $routeParams.model;
    $scope.model = _.find($scope.models, function(model){ return model.name == modelName; });

    if(!$scope.instances)
    {
        getInstances($scope, $http, modelName, function(error)
        {
            if(!error)
            {
                // Get the current instance
                $scope.instance = _.find($scope.instances, function(instance){ return instance.model.id == modelID; });

                // Filter out fields that we shouldn't show.
                var skipFields = _.filter(_.keys($scope.model.fields), function(field)
                {
                    return $scope.model.fields[field].autoIncrement
                });

                // Skip auto-generated fields
                skipFields.push('createdAt');
                skipFields.push('updatedAt');

                $scope.model.fields = _.omit($scope.model.fields, skipFields);

                // Normalize values so they're all in object format.
                _.each($scope.model.fields, function(value, key, list)
                {
                    if(!_.isObject(value))
                    {
                        $scope.model.fields[key] = {type: value};
                    } // end if
                });
            } // end if
        });
    } // end if

    $scope.getName = getName;

    $scope.cancel = function()
    {
        $location.path('/' + modelName);
    }; // end cancel

    $scope.save = function(stay)
    {
        $http.post(adminUrl('/models/' + modelName + '/' + modelID), $scope.instance.model)
            .success(function(data, status)
            {
                if(!stay)
                {
                    $location.path('/' + modelName);
                } // end if
            })
            .error(function(data, status)
            {
                console.error('Error occurred:', data, 'status:', status);
            });
    }; // end save
});

//----------------------------------------------------------------------------------------------------------------------

function getInstances($scope, $http, modelName, callback)
{
    callback = callback || function(){};

    $http.get(adminUrl('/models/' + modelName))
        .success(function(data, status)
        {
            $scope.instances = data;
            callback(null);
        })
        .error(function(data, status)
        {
            $scope.instances = [];
            console.error('Error occurred:', data, 'status:', status);
            callback(data);
        });
} // getInstances

function getName(instance)
    {
        if(instance)
        {
            // Default to something super generic
            var name = "[Object " + instance.model.id + "]";

            // Check to see if we have a displayField option set.
            if(instance.options.displayName)
            {
                return instance.model[instance.options.displayName];
            } // end if

            // Check to see if we have a displayField option set.
            if(instance.options.displayField)
            {
                return instance.model[instance.options.displayField];
            } // end if

            // Check to see if the model has a 'name' field. Good chance that's usable for display.
            if(instance.model.name)
            {
                return instance.model.name;
            } // end if

            // Well, we tried. Return the super generic name.
            return name;
        } // end if
    } // end getName
//----------------------------------------------------------------------------------------------------------------------


