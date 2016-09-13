(function() {
  'use strict';

  angular
    .module('ui')
    .factory('monitorService', monitorService);

  /** @ngInject */
  function monitorService($log, $http) {

    var apiHost = 'http://localhost:3000/api';

    var service = {
      apiHost: apiHost,
      getMonitors: getMonitors
    };

    return service;

    function getMonitors() {

      return $http.get(apiHost + '/monitors')
        .then(getMonitorsComplete)
        .catch(getMonitorsFailed);

      function getMonitorsComplete(response) {
        return response.data.data;
      }

      function getMonitorsFailed(error) {
        $log.error('XHR Failed for getMonitors.\n' + angular.toJson(error.data, true));
      }
    }

  }
})();
