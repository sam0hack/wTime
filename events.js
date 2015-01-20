chrome.runtime.onInstalled.addListener(function() {
	'use strict';
	cache('html', null);
	cache('last_request', null);

	chrome.alarms.clearAll();
	chrome.alarms.create('checkProjects', {periodInMinutes:30, delayInMinutes:0.1});
});



chrome.alarms.onAlarm.addListener(function(alarm) {
	'use strict';
	if(alarm.name === 'checkProjects') {
		getProjects(true);
	}
});