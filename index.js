var q = require('q');
var log = function() {};
 // var log = console.log;

var deferredDictionary = {};

function runOnceResolveAll(operationMethod, operationKey) {
    if (deferredDictionary[operationKey]) {
        log('pre-existing queue for ' + operationKey);
        return deferredDictionary[operationKey].promise;
    }

    var deferred;
    deferred = q.defer();
    log('creating ' + operationKey + ' queue');
    deferredDictionary[operationKey] = deferred;

    var promise = operationMethod();

    if (!promise.then) {
        promise = q.when(promise);
    } 
    promise.then(function(result) {
        log('resolving deferred for ' + operationKey);
        deferred.resolve(result);
	    delete deferredDictionary[operationKey];
    }, function(err) {
        log('rejecting deferred for ' + operationKey);
        deferred.reject(err);
	    delete deferredDictionary[operationKey];
    });
    return deferred.promise;
}

module.exports.runOnceResolveAll = runOnceResolveAll;
