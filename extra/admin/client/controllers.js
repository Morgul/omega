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

    $scope.delete = function(modelID)
    {
        $http.delete(adminUrl('/models/' + modelName + '/' + modelID))
            .success(function(data, status)
            {
                var instance = _.find($scope.instances, function(instance){ return instance.model.id == modelID; });
                $scope.instances = _.without($scope.instances, instance);
            })
            .error(function(data, status)
            {
                console.error('Error occurred:', data, 'status:', status);

            });
    }; // end delete
});

//----------------------------------------------------------------------------------------------------------------------

Controllers.controller("InstanceCtrl", function($scope, $routeParams, $http, $location, $dialog)
{
    var modelID = $routeParams.instance;
    var modelName = $routeParams.model;
    $scope.model = _.find($scope.models, function(model){ return model.name == modelName; });
    $scope.foobar = [1];

    if(!$scope.instances)
    {
        getInstances($scope, $http, modelName, function(error)
        {
            if(!error)
            {
                // Get the current instance
                $scope.instance = _.find($scope.instances, function(instance){ return instance.model.id == modelID; });

                // Filter the fields object for display
                filterFields($scope);

                // Build up the relations for display
                buildRelations($scope, $http);
            } // end if
        });
    } // end if

    //------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------

    $scope.getName = getName;

    $scope.cancel = function()
    {
        $location.path('/' + modelName);
    }; // end cancel

    $scope.save = function(stay)
    {
        $http.post(adminUrl('/models/' + modelName + '/' + modelID),
            { model: $scope.instance.model, associations:$scope.instance.associations })
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

    $scope.new = function(modelName, association)
    {
        var dialog = $dialog.dialog(
            {
                resolve: {
                    model: function()
                    {
                        return _.find($scope.models, function(model){ return model.name == modelName; });
                    },
                    association: function()
                    {
                        return association;
                    },
                    parent: function()
                    {
                        return $scope;
                    }
                }
            });

        dialog.open(partialUrl('new_instance.html'), 'NewModalCtrl');
    }; // end new
});

//----------------------------------------------------------------------------------------------------------------------

Controllers.controller("NewInstanceCtrl", function($scope, $routeParams, $http, $location, $dialog)
{
    var modelName = $routeParams.model;
    $scope.model = _.find($scope.models, function(model){ return model.name == modelName; });

    $scope.instance = {model: {}, associations: {}, options: {}};

    //------------------------------------------------------------------------------------------------------

    // Filter the fields object for display
    filterFields($scope);

    // Build up the relations for display
    buildRelations($scope, $http);

    //------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------

    $scope.getName = getName;

    $scope.cancel = function()
    {
        $location.path('/' + modelName);
    }; // end cancel

    $scope.save = function(stay)
    {
        $http.post(adminUrl('/models/' + modelName),
            { model: $scope.instance.model, associations:$scope.instance.associations })
            .success(function(data, status)
            {
                if(!stay)
                {
                    $location.path('/' + modelName);
                }
                else
                {
                    $location.path('/' + modelName + '/' + data.model.id);
                } // end if
            })
            .error(function(data, status)
            {
                console.error('Error occurred:', data, 'status:', status);
            });
    }; // end save

    $scope.new = function(modelName, association)
    {
        var dialog = $dialog.dialog(
            {
                resolve: {
                    model: function()
                    {
                        return _.find($scope.models, function(model){ return model.name == modelName; });
                    },
                    association: function()
                    {
                        return association;
                    },
                    parent: function()
                    {
                        return $scope;
                    }
                }
            });

        dialog.open(partialUrl('new_instance.html'), 'NewModalCtrl');
    }; // end new
}); // end NewInstanceCtrl

//----------------------------------------------------------------------------------------------------------------------

Controllers.controller("NewModalCtrl", function($scope, $http, dialog, model, parent, association)
{
    $scope.model = model;
    $scope.instance = {model: {}, options: {}};
    $scope.inModal = true;

    // Filter the fields object for display
    filterFields($scope);

    // Build up the relations for display
    buildRelations($scope, $http);

    $scope.close = function()
    {
        dialog.close();
    };

    $scope.save = function()
    {
        $http.post(adminUrl('/models/' + model.name),
            { model: $scope.instance.model, associations:$scope.instance.associations })
            .success(function(data, status)
            {
                buildRelations(parent, $http);
                parent.instance.associations[association].push(data.model.id);
                dialog.close();
            })
            .error(function(data, status)
            {
                console.error('Error occurred:', data, 'status:', status);
                dialog.close();
            });
    }; // end save
}); // end NewModalCtrl

//----------------------------------------------------------------------------------------------------------------------

function filterFields($scope)
{
    // Filter out fields that we shouldn't show.
    var skipFields = _.filter(_.keys($scope.model.fields), function(field)
    {
        // If we're an autoIncrement field, or don't have a fieldIndex, don't show us.
        return $scope.model.fields[field].autoIncrement || !($scope.model.fields[field].fieldIndex)
    });

    // Remove the filtered fields
    var fields = _.omit($scope.model.fields, skipFields);

    // Split into key/value pairs so we can sort.
    fields = _.pairs(fields);

    // Sort fields
    $scope.fields = _.sortBy(fields, "fieldIndex");
} // end filterFields

function buildRelations($scope, $http)
{
    $scope.relations = {};

    _.each($scope.model.relations, function(relation)
    {
        $http.get(adminUrl('/models/' + relation.target.name))
            .success(function(data, status)
            {
                data.forEach(function(model, index)
                {
                    data[index].name = getName(model, relation.target.name);
                });

                relation.targetInstances = data;
                $scope.relations[relation.name] = relation;
            })
            .error(function(data, status)
            {
                console.error('Error occurred getting target instances:', data, 'status:', status);
            });
    });
} // end buildRelations

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

function getName(instance, modelName)
    {
        if(instance)
        {
            var name = "";

            if(modelName)
            {
                // Something kinda generic
                name = "[" + modelName + " Object " + instance.model.id + "]";
            }
            else
            {
                // Default to something super generic
                name = "[Object " + instance.model.id + "]";
            }

            // Check to see if this is a new object.
            if(instance.model.id == undefined)
            {
                if(modelName)
                {
                    name = "New " + modelName;
                }
                else
                {
                    name = "New Object";
                } // end if
            } // end if

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


