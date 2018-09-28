(function(){
	var user_id = '1111';
	var user_fullname = 'John Smith';
	var lng = -122.08;
	var lat = 37.38;
	
	init();
	
	function init() {
		var nearbyBtn = document.getElementById('nearby-btn');
		nearbyBtn.addEventListener('click', loadNearbyItems); // addEventListener to click item: callback function

		initGeoLocation();
	}
	
	function validateSession() {
		   // The request parameters
		   var url = 'http://34.222.78.188/TitanAuth/login';
		   var req = JSON.stringify({});

		   // display loading message
		   console.log('Validating session...');

		   // make AJAX call
		   ajax('GET', url, req,
		       // session is still valid
		   function(res) {
			   var result = JSON.parse(res);
		       if (result.status === 'OK') {
		    	   onSessionValid(result);
		       }
		   },
		   onSessionInvalid, true);
		}
	
	function onSessionInvalid() {
		var loginForm = $('login-form');
	   	var itemNav = $('item-nav');
		var itemList = $('item-list');
		var avatar = $('avatar');
		var welcomeMsg = $('welcome-msg');
		//var logoutBtn = $('logout-link');
		
		hideElement(itemNav);
		hideElement(itemList);
		hideElement(avatar);
		hideElement(welcomeMsg);
		//hideElement(logoutBtn);

		showElement(loginForm);

	}
	
	function onSessionValid(result) {
		   user_id = result.user_id;
		   user_fullname = result.name;

		   var loginForm = $('login-form');
		   var itemNav = $('item-nav');
		   var itemList = $('item-list');
		   var avatar = $('avatar');
		   var welcomeMsg = $('welcome-msg');
		   //var logoutBtn = $('logout-link');
		   
		   showElement(itemNav);
		   showElement(itemList);
		   showElement(avatar);
		   showElement(welcomeMsg);
		   //showElement(logoutBtn, 'inline-block');
		   hideElement(loginForm);
		   
		   initGeoLocation();

		}
	
	function showElement(element, style) {
		   var displayStyle = style ? style : 'block';
		   element.style.display = displayStyle;
		}
	function hideElement(element) {
		   element.style.display = 'none';
		}


               

	
	function initGeoLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onPositionUpdated,
					onLoadPositionFailed, {
						maximumAge : 60000
					});
			showLoadingMessage('Retrieving your location...');
		} else {
			onLoadPositionFailed();
		}


		
		
		function onPositionUpdated(position) {
			lat = position.coords.latitude;
			lng = position.coords.longitude;

//			console.log('lat --- ' + lat);
//			console.log('lng --- ' + lng);

			loadNearbyItems();
		}
		
		function loadNearbyItems() {
			console.log('loading nearby items');

			// active button 
			activeBtn('nearby-btn');
			
			
			// The request parameters
			var url = './search';
			var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;
			var req = JSON.stringify({});
			
			console.log(req);
			
			// display loading message
			console.log('Loading nearby items...');
			
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url + '?' + params, true);
			xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
			xhr.send(req);
			
			xhr.onload = function() {
				console.log('res is ok...');
			
				if(xhr.status === 200) {
					var items = JSON.parse(xhr.responseText);
					if (!items || items.length === 0) {
//						showWarningMessage('No nearby item.');
						console.log('No nearby item');
					} else {
						listItems(items);
						console.log(items);
					}
				} else if(xhr.status === 403) {
					console.log('invalid session');
				} else {
					console.log('error');
				}
				}
			
			xhr.onerror = function() {
				console.error("The request couldn't be completed.");
//				showErrorMessage("The request couldn't be completed.");
			};
		}
		
		function listItems (items){
			var itemList = document.getElementById('item-list');
			itemList.innerHTML = '';

			for (var i = 0; i < items.length; i++) {
				addItem(itemList, items[i]);
			}
		}
		
		
		
		function addItem(itemList, item) {
			var item_id = item.item_id;
			
			// create the <li> tag and specify the id and class attributes
			var li = document.createElement('li');
			li.setAttribute('id', 'item-' + item_id);
			li.setAttribute('class', 'item');
			
			// set the data attribute
			li.dataset.item_id = item_id;
			li.dataset.favorite = item.favorite;
			
			// item image
			var image = document.createElement('img');
			image.setAttribute('src', item.image_url);
			if (item.image_url) {
				image.setAttribute('src', item.image_url);
			} else {
				image.setAttribute('src', 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png');
			}
			li.appendChild(image);
			
			// section
			var section = document.createElement('div');
			
			// title
			var title = document.createElement('a');
			title.setAttribute('href', item.url);
			title.setAttribute('target', '_blank');
			title.setAttribute('class', 'item-name');
			title.innerHTML = item.name;
			section.appendChild(title);
			
			// category
			var category = document.createElement('p');
			category.setAttribute('class', item-category);
			category.innerHTML = 'Category: ' + item.categories.join(', ');
			section.appendChild(category);
			
			li.appendChild(section);
			
			// address
			var address = document.createElement('p');
			category.setAttribute('class', item-address);
			address.innerHTML = item.address.replace(/,/g, '<br/>').replace(/\"/g,
					'');
			li.appendChild(address);

			// favorite link
			var favLink = document.createElement('p');
			favLink.setAttribute('class', 'fav-link');

			var extra = document.createElement('i');
			extra.setAttribute('id', 'fav-icon-' + item_id);
			extra.setAttribute('class', item.favorite ? 'fa fa-heart' : 'fa fa-heart-o');
			
			favLink.appendChild(extra);

			li.appendChild(favLink);

			itemList.appendChild(li);
		}


		
		function activeBtn(btnId) {
			var btns = document.getElementsByClassName('main-nav-btn');
			
			// deactivate all navigation buttons
			for (var i = 0; i < btns.length; i++) {
				btns[i].className = btns[i].className.replace(/\bactive\b/, '');
			}
			
			// active the one that has id = btnId
			var btn = document.getElementById(btnId);
			btn.className += ' active';
		}
		
		function getLocationFromIP() {
			// Get location from http://ipinfo.io/json
			var url = 'http://ipinfo.io/json'
			var req = null;
			
			var xhr = new XMLHttpRequest();
			
			xhr.open('GET', url, true);
			xhr.send();
			
			xhr.onload = function() {
				if(xhr.status === 200) {
					var result = JSON.parse(xhr.responseText);
					if ('loc' in result) {
						var loc = result.loc.split(',');
						lat = loc[0];
						lng = loc[1];
					} else {
						console.warn('Getting location by IP failed.');
					}
					loadNearbyItems();
				} else if(xhr.status === 403) {
					console.log('invalid session');
				} else {
					console.log('error');
				}
			}
			
			xhr.onerror = function() {
				console.error("The request couldn't be completed.");
				showErrorMessage("The request couldn't be completed.");
			};
		}

		
		function onLoadPositionFailed() {
			console.warn('navigator.geolocation is not available');
			getLocationFromIP();
		}
		
		
		function login() {
			var username = $('username').value;
			var password = $('password').value;
			password = md5(username + md5(password));

			// The request parameters
			var url = 'http://34.211.21.63/EventAuth/login';
			var req = JSON.stringify({
				user_id : username,
				password : password,
			});

			ajax('POST', url, req,
			// successful callback
			function(res) {
				var result = JSON.parse(res);

				// successfully logged in
				if (result.status === 'OK') {
					onSessionValid(result);
				}
			},

			// error
			function() {
				showLoginError();
			}, 
			true);
		}

		function showLoginError() {
			$('login-error').innerHTML = 'Invalid username or password';
		}

		function clearLoginError() {
			$('login-error').innerHTML = '';
		}

		function logout() {
			onSessionInvalid();
		}
		// -----------------------------------
		// Helper Functions
		// -----------------------------------

		/**
		 * A helper function that makes a navigation button active
		 * 
		 * @param btnId -
		 *            The id of the navigation button
		 */

		
		function showLoadingMessage(msg) {
			var itemList = document.getElementById('item-list');
			itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> '
					+ msg + '</p>';
		}

		function showWarningMessage(msg) {
			var itemList = document.getElementById('item-list');
			itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> '
					+ msg + '</p>';
		}

		function showErrorMessage(msg) {
			var itemList = document.getElementById('item-list');
			itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i> '
					+ msg + '</p>';
		}
		
		
		// -------------------------------------
		// AJAX call server-side APIs
		// -------------------------------------

		/**
		 * API #1 Load the nearby items API end point: [GET]
		 * /Dashi/search?user_id=1111&lat=37.38&lon=-122.08
		 */
		function loadNearbyItems() {
			console.log('loadNearbyItems');
			activeBtn('nearby-btn');

			// The request parameters
			var url = './search';
			var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;
			var req = JSON.stringify({});

			// display loading message
			showLoadingMessage('Loading nearby items...');

			// make AJAX call
			ajax('GET', url + '?' + params, req,
			// successful callback
			function(res) {
				var items = JSON.parse(res);
				if (!items || items.length === 0) {
					showWarningMessage('No nearby item.');
				} else {
					listItems(items);
				}
			},
			// failed callback
			function() {
				showErrorMessage('Cannot load nearby items.');
			}, true);
		}

		/**
		 * API #2 Load favorite (or visited) items API end point: [GET]
		 * /Dashi/history?user_id=1111
		 */
		function loadFavoriteItems() {
			activeBtn('fav-btn');

			// The request parameters
			var url = 'http://34.211.21.63/EventAuth/history';
			var params = 'user_id=' + user_id;
			var req = JSON.stringify({});

			// display loading message
			showLoadingMessage('Loading favorite items...');

			// make AJAX call
			ajax('GET', url + '?' + params, req, function(res) {
				var items = JSON.parse(res);
				if (!items || items.length === 0) {
					showWarningMessage('No favorite item.');
				} else {
					listItems(items);
				}
			}, function() {
				showErrorMessage('Cannot load favorite items.');
			}, true);
		}

		/**
		 * API #3 Load recommended items API end point: [GET]
		 * /Dashi/recommendation?user_id=1111
		 */
		function loadRecommendedItems() {
			activeBtn('recommend-btn');

			// The request parameters
			var url = 'http://34.211.21.63/EventAuth/recommendation';
			var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;

			var req = JSON.stringify({});

			// display loading message
			showLoadingMessage('Loading recommended items...');

			// make AJAX call
			ajax(
					'GET',
					url + '?' + params,
					req,
					// successful callback
					function(res) {
						var items = JSON.parse(res);
						if (!items || items.length === 0) {
							showWarningMessage('No recommended item. Make sure you have favorites.');
						} else {
							listItems(items);
						}
					},
					// failed callback
					function() {
						showErrorMessage('Cannot load recommended items.');
					}, 
					true);
		}

		/**
		 * API #4 Toggle favorite (or visited) items
		 * 
		 * @param item_id -
		 *            The item business id
		 * 
		 * API end point: [POST]/[DELETE] /Dashi/history request json data: {
		 * user_id: 1111, visited: [a_list_of_business_ids] }
		 */
		function changeFavoriteItem(item_id) {
			// Check whether this item has been visited or not
			var li = $('item-' + item_id);
			var favIcon = $('fav-icon-' + item_id);
			var favorite = li.dataset.favorite !== 'true';

			// The request parameters
			var url = 'http://34.211.21.63/EventAuth/history';
			var req = JSON.stringify({
				user_id : user_id,
				favorite : [ item_id ]
			});
			var method = favorite ? 'POST' : 'DELETE';

			ajax(method, url, req,
			// successful callback
			function(res) {
				var result = JSON.parse(res);
				if (result.status === 'OK') {
					li.dataset.favorite = favorite;
					favIcon.className = favorite ? 'fa fa-heart' : 'fa fa-heart-o';
				}
			},
			function() {
				showErrorMessage('Cannot update favorite items.');
			},
			true);
		}
		
	}
})() 