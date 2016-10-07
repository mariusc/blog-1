NEB.ServiceWorkerRegistration = (function() {
	
	let isAlreadyRegistered = false;
	
	const URL = '/service-worker.js';
	const SCOPE = '/';
	
	const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
		// [::1] is the IPv6 localhost address.
		window.location.hostname === '[::1]' ||
		// 127.0.0.1/8 is considered localhost for IPv4.
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
		)
	);
	
	const register = function() {
		if(!isAlreadyRegistered) {
			
			isAlreadyRegistered = true;
			
			if('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
				navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).then(function(registration) {
					
					registration.onupdatefound = function() {
						const installingWorker = registration.installing;
						
						installingWorker.onstatechange = function() {
							switch (installingWorker.state) {
								case 'installed':
									if(!navigator.serviceWorker.controller) {
										var siteCachedToast = new NEB.Toast('#swCachedToast', {timeout: 4000});
										siteCachedToast.enter();
									}
									break;
								
								case 'redundant':
									throw Error('The installing service worker became reduntant.');
									break;
							}
						};
					};
					
				}).catch(function(e) {
					console.error('Service worker registration failed:', e);
				});
			}
			
		}
	};
	
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		navigator.serviceWorker.controller.onstatechange = function(event) {
			if(event.target.state === 'redundant') {
				var siteCacheUpdatedToast = new NEB.Toast('#swCacheExpiredToast', {
					timeout: -1,
					onClose: () => {
						window.location.reload();
					}
				});
				siteCacheUpdatedToast.enter();
			}
		};
	}
	
	return {
		register
	};
	
})();