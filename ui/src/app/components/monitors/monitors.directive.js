(function() {
  'use strict';

  angular
    .module('ui')
    .directive('mnMonitors', mnMonitors);

  /** @ngInject */
  function mnMonitors() {

    var directive = {
      restrict: 'E',
      scope: {
      },
      templateUrl: 'app/components/monitors/monitors.html',
      controller: MonitorsController,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function MonitorsController($log, monitorService) {
      var vm = this;

      vm.monitors = [];

      activate();

      function activate() {
        return getMonitors().then(function() {
          $log.info('Activated Monitors View');
        });
      }

      function getMonitors() {
        return monitorService.getMonitors().then(function(data) {
          vm.monitors = data;
          $log.info('Monitors', vm.monitors);
          return vm.monitors;
        });
      }
    }

  }

})();
