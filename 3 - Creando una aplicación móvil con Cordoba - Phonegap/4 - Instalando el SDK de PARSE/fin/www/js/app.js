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
        var comun = {}

        comun.tareas = [{
            nombre: 'Comprar comida',
            prioridad: 1
        }, {
            nombre: 'Pasear al perro',
            prioridad: 2
        }, {
            nombre: 'Ir al cine',
            prioridad: 0
        }]

        comun.tarea = {};

        comun.eliminar = function(tarea) {
            var indice = comun.tareas.indexOf(tarea);
            comun.tareas.splice(indice, 1);
        }

        return comun;
    })
    .controller('ctrlAlta', function($scope, $state, comun) {
        $scope.tarea = {}
            // $scope.tareas = [];

        $scope.tareas = comun.tareas;

        $scope.prioridades = ['Baja', 'Normal', 'Alta'];

        var Tareas = Parse.Object.extend("Tareas");
        var pTareas = new Tareas();

        pTareas.save({
            nombre: "Ir a correr",
            prioridad: 2
        },{
            success: function(tarea){
                console.log(tarea)
            }
        })


        $scope.agregar = function() {
            $scope.tareas.push({
                nombre: $scope.tarea.nombre,
                prioridad: parseInt($scope.tarea.prioridad)
            })

            $scope.tarea.nombre = '';
            $scope.tarea.prioridad = '';
        }

        $scope.masPrioridad = function(tarea) {
            tarea.prioridad += 1;
        }

        $scope.menosPrioridad = function(tarea) {
            tarea.prioridad -= 1;
        }

        $scope.eliminar = function(tarea) {
            comun.eliminar(tarea)
        }

        $scope.procesaObjeto = function(tarea) {
            comun.tarea = tarea;
            $state.go('editar');
        }

    })
    .controller('ctrlEditar', function($scope, $state, comun) {
        $scope.tarea = comun.tarea;

        $scope.actualizar = function() {
            $scope.tarea.prioridad = parseInt($scope.tarea.prioridad)
            var indice = comun.tareas.indexOf(comun.tarea);
            comun.tareas[indice] = $scope.tarea;
            $state.go('alta');
        }

        $scope.eliminar = function(){
            comun.eliminar($scope.tarea);
            $state.go('alta');
        }
    })
