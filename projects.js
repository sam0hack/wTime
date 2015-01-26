var showProjects = function(data) {
	'use strict';
	var html;
	if(!data.projects.length && !data.grand_total.total_seconds) {
		console.log(data);
		cache('html', null);
		html = '<p class="noprojects">You don\'t worked today, yet.<br> <a href="https://wakatime.com/dashboard" target="_blank">You can check all your data at wakatime.com</a>.</p>';
		document.querySelector('.loader').style.display = 'none';
		document.querySelector('.container').innerHTML = html;
		return;
	}
	html = '<ul>' + data.projects.sort(function(a, b) {
		return a.name.toLowerCase().charCodeAt(0) - b.name.toLowerCase().charCodeAt(0);
	}).map(function(project) {
		var name = project.name,
			hours = project.hours,
			minutes = project.minutes,
			result = '<span class="name">' + name + ':</span> <span class="time">',
			projectLink = encodeURIComponent(name);

		if(hours)
			result += hours + 'h';

		result += minutes + 'm</span>';

		result = '<a href="https://wakatime.com/project/' + projectLink + '" target="_blank">' +
			result;

		if(name.toLowerCase().indexOf('unknown') !== -1) {
			badges.unknown();
			result = '<li class="alert">' + result;
		}
		else
			result = '<li>' + result;

		result += '</a></li>';

		return result;
	}).join('') + '</ul>';

	cache('html', html);

	document.querySelector('.container').innerHTML = html;
};

var fromCache = function() {
	document.querySelector('.loader').style.display = 'none';
	document.querySelector('.container').innerHTML = cache('html');
};

getProjects();