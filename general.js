var windowRequest = 120;//seconds
var cache = function(key, value) {
	'use strict';
	if(value !== undefined && value !== null) {
		value = typeof value !== 'string'?JSON.stringify(value):value;
		return localStorage.setItem(key, value);
	}
	else if(value === null)
		return localStorage.removeItem(key);
	else
		return localStorage.getItem(key);
};

var badges = {
	unknown: function() {
		'use strict';
		chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,255]});
		chrome.browserAction.setBadgeText({text:'?'});
	},
	error: function() {
		'use strict';
		chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
		chrome.browserAction.setBadgeText({text:'E'});
	},
	clear: function() {
		'use strict';
		chrome.browserAction.setBadgeText({text:''});
	},
	get: function(callback) {
		'use strict';
		return chrome.browserAction.getBadgeText({}, callback);
	}
};

var getProjects = function(timer) {
	var date = new Date();

	if(!timer) {
		if(cache('last_request') && (date.getTime() - parseInt(cache('last_request'),10)) < windowRequest)
			return fromCache();
	}

	badges.clear();

	date = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
	var url = 'https://wakatime.com/api/v1/summary/daily?start=%&end=%'.replace(/%/g, date);
	var connection = new XMLHttpRequest();
	connection.open('GET', url, true);
	if(timer)
		connection.onreadystatechange = function() {
			if(this.status === 200 && this.readyState === 4) {
				var data = this.responseText;
				try {
					data = JSON.parse(data);
				}
				catch(e) {
					console.log(e);
					badges.error();
					return;
				}
				for(var i=0,ilen=data.data[0].projects.length;i<ilen;i++)
					if(data.data[0].projects[i].name.toLowerCase().indexOf('unknown') !== -1)
						return badges.unknown();
			}
			else if(this.status === 403)
				badges.error();
		};
	else
		connection.onreadystatechange = function() {
			if(this.status === 200 && this.readyState === 4) {
				var data = this.responseText;
				try {
					data = JSON.parse(data);
				}
				catch(e) {
					console.log(e);
					return;
				}
				showProjects(data.data[0].projects);

			}
			else if(this.status === 403) {
				document.querySelector('.login').style.display = 'block';
			}
			if(this.readyState === 4)
				document.querySelector('.loader').style.display = 'none';
		};
	if(!timer)
		cache('last_request', (new Date()).getTime() + '');
	connection.send(null);
};