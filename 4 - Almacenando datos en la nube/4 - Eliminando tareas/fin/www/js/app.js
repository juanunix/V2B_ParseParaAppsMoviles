angular.module('appTareas', ['ui.router', 'ngTouch'])
    .config(function($stateProvider, $urlRouterProvider) {
        Parse.initialize("8vaD9Mydf72cf23H4huORs2Y56Ro9MX8suEojbO8", "Lgfou4zL0S2uoWLLf7cxew745iaRraE2yOY8nQYz")



        $stateProvider
            .state('alta', {
                url: '/alta',
                templateUrl: 'views/alta.html',
                controller: 'ctrlAlta'
            })
            .state('editar', {
                url: '/editar',
                templateUrl: 'views/editar.html',
                controller: 'ctrlEditar'
            });

        $urlRouterProvider.otherwise('alta');
    })
    .factory('comun', function() {
        var comun = {};

        comun.tareas = [];

        comun.tarea = {};

        comun.hasRemoteData = false;

        comun.lookupData = {};

        

        comun.Tareas = Parse.Object.extend("Tareas");
        comun.pTareas = new comun.Tareas();
        comun.queryTareas = new Parse.Query(comun.Tareas);

      

         comun.eliminar = function(tarea) {
            var DelTarea = Parse.Object.extend("Tareas");
            var delTarea = new DelTarea();
            delTarea.id = tarea.id;

            delTarea.destroy({
                success: function(){
                    var indice = comun.tareas.indexOf(comun.lookup(delTarea.id));
                    comun.tareas.splice(indice, 1); 
                },
                error: function() {
                    console.log("Error: " + error.code + " " + error.message);
                }
            })
        }

        comun.lookup = function(id) {
            for (var i = 0, len = comun.tareas.length; i < len; i++) {
                comun.lookupData[comun.tareas[i].id] = comun.tareas[i];
            }
            return comun.lookupData[id]
        }

        return comun;
    })
    .controller('ctrlAlta', function($scope, $state, comun) {
        $scope.tarea = {}
        $scope.tareas = comun.tareas;
        $scope.prioridades = ['Baja', 'Normal', 'Alta'];

        $scope.listar = function() {
            comun.queryTareas.find({
                success: function(tareas) {
                    angular.copy(tareas, $scope.tareas);
                    comun.hasRemoteData = true;
                    $scope.$apply();
                }
            }, {
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        }

        if (!comun.hasRemoteData) {
            $scope.listar();
        }

        $scope.agregar = function() {
            comun.pTareas.save({
                nombre: $scope.tarea.nombre,
                prioridad: parseInt($scope.tarea.prioridad)
            }, {
                success: function(tarea) {
                    $scope.tareas.push(tarea)
                    $scope.$apply();
                }
            }, {
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }

            })

            $scope.tarea.nombre = '';
            $scope.tarea.prioridad = '';
        }

        $scope.masPrioridad = function(tarea) {
            tarea.attributes.prioridad += 1;
        }

        $scope.menosPrioridad = function(tarea) {
            tarea.attributes.prioridad -= 1;
        }

        $scope.eliminar = function(tarea) {
            comun.eliminar(tarea)
        }

        $scope.procesaObjeto = function(tarea) {
            angular.copy(tarea, comun.tarea);
            $state.go('editar');
        }

    })
    .controller('ctrlEditar', function($scope, $state, comun) {
        $scope.tarea = comun.tarea;

        var ActTarea = Parse.Object.extend("Tareas");
        var actTarea = new ActTarea();

        $scope.actualizar = function() {
            actTarea.id = $scope.tarea.id;

            actTarea.set("nombre", $scope.tarea.attributes.nombre)
            actTarea.set("prioridad", parseInt($scope.tarea.attributes.prioridad))

            actTarea.save(null, {
                success: function(actTarea) {
                    var indice = comun.tareas.indexOf(comun.lookup(actTarea.id));
                    comun.tareas[indice] = actTarea;
                    $state.go('alta');
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        }

        $scope.eliminar = function() {
            comun.eliminar($scope.tarea);
            $state.go('alta');
        }
    })
