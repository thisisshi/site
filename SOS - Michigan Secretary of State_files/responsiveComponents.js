/* ----------------
ResponsiveTabs.js
Author: Pete Love | www.petelove.com
Version: 1.9
------------------- */

var RESPONSIVEUI = {};

(function($) {

	RESPONSIVEUI.responsiveTabs = function () {
		var $tabSets = $('.responsive-tabs');

		if (!$tabSets.hasClass('responsive-tabs--enabled')) {	// if we haven't already called this function and enabled tabs
			$tabSets.addClass('responsive-tabs--enabled'); 

			//loop through all sets of tabs on the page
			var tablistcount = 1;

			$tabSets.each(function() {

				var $tabs = $(this);

				// add tab heading and tab panel classes
				$tabs.children('h1,h2,h3,h4,h5,h6').addClass('responsive-tabs__heading');
				$tabs.children('div').addClass('responsive-tabs__panel');

				// determine if markup already identifies the active tab panel for this set of tabs
				// if not then set first heading and tab to be the active one
				var $activePanel = $tabs.find('.responsive-tabs__panel--active');
				if(!$activePanel.length) {
					$activePanel = $tabs.find('.responsive-tabs__panel').first().addClass('responsive-tabs__panel--active');
				}

				$tabs.find('.responsive-tabs__panel').not('.responsive-tabs__panel--active').hide().attr('aria-hidden','true'); //hide all except active panel
				$activePanel.attr('aria-hidden', 'false');
				/* make active tab panel hidden for mobile */
				$activePanel.addClass('responsive-tabs__panel--closed-accordion-only');

				// wrap tabs in container - to be dynamically resized to help prevent page jump
				var $tabsWrapper = $('<div/>', {'class': 'responsive-tabs-wrapper' });
				$tabs.wrap($tabsWrapper);

				var highestHeight = 0;

				// determine height of tallest tab panel. Used later to prevent page jump when tabs are clicked
				$tabs.find('.responsive-tabs__panel').each(function() {
					var tabHeight = $(this).height();
					if (tabHeight > highestHeight) {
						highestHeight = tabHeight;
					}
				});

				//create the tab list
				var $tabList = $('<ul/>', { 'class': 'responsive-tabs__list', 'role': 'tablist' });

				//loop through each heading in set
				var tabcount = 1;
				$tabs.find('.responsive-tabs__heading').each(function() {

					var $tabHeading = $(this);
					var $tabPanel = $(this).next();

					$tabHeading.attr('tabindex', 0);

					// CREATE TAB ITEMS (VISIBLE ON DESKTOP)
					//create tab list item from heading
					//associate tab list item with tab panel
					var $tabListItem = $('<li/>', { 
						'class': 'responsive-tabs__list__item',
						id: 'tablist' + tablistcount + '-tab' + tabcount,
						'aria-controls': 'tablist' + tablistcount +'-panel' + tabcount,
						'role': 'tab',
						tabindex: 0,
						text: $tabHeading.text(),
						mouseover: function (objEvent) { // If user mouseover tab open that tab
							$tabListItem.click();
						},
						keydown: function (objEvent) {
							if (objEvent.keyCode === 13) { // if user presses 'enter'
								$tabListItem.click();
							}
						},
						click: function() {
							//Show associated panel

							//set height of tab container to highest panel height to avoid page jump
							$tabsWrapper.css('height', highestHeight);

							// remove hidden mobile class from any other panel as we'll want that panel to be open at mobile size
							$tabs.find('.responsive-tabs__panel--closed-accordion-only').removeClass('responsive-tabs__panel--closed-accordion-only');
							
							// close current panel and remove active state from its (hidden on desktop) heading
							$tabs.find('.responsive-tabs__panel--active').toggle().removeClass('responsive-tabs__panel--active').attr('aria-hidden','true').prev().removeClass('responsive-tabs__heading--active');
							
							//make this tab panel active
							$tabPanel.toggle().addClass('responsive-tabs__panel--active').attr('aria-hidden','false');

							//make the hidden heading active
							$tabHeading.addClass('responsive-tabs__heading--active');

							//remove active state from currently active tab list item
							$tabList.find('.responsive-tabs__list__item--active').removeClass('responsive-tabs__list__item--active');

							//make this tab active
							$tabListItem.addClass('responsive-tabs__list__item--active');

							//reset height of tab panels to auto
							$tabsWrapper.css('height', 'auto');
						}
					});
					
					//associate tab panel with tab list item
					$tabPanel.attr({
						'role': 'tabpanel',
						'aria-labelledby': $tabListItem.attr('id'),
						id: 'tablist' + tablistcount + '-panel' + tabcount
					});

					// if this is the active panel then make it the active tab item
					if($tabPanel.hasClass('responsive-tabs__panel--active')) {
						$tabListItem.addClass('responsive-tabs__list__item--active','current');
					}

					// add tab item
					$tabList.append($tabListItem);

					
					// TAB HEADINGS (VISIBLE ON MOBILE)
					// if user presses 'enter' on tab heading trigger the click event
					$tabHeading.keydown(function(objEvent) {
						if (objEvent.keyCode === 13) {
							$tabHeading.click();
						}
					});

					//toggle tab panel if click heading (on mobile)
					$tabHeading.click(function() {

						// remove any hidden mobile class
						$tabs.find('.responsive-tabs__panel--closed-accordion-only').removeClass('responsive-tabs__panel--closed-accordion-only');

						// if this isn't currently active
						if (!$tabHeading.hasClass('responsive-tabs__heading--active')){

							var oldActivePos;
							// if there is an active heading, get its position
							if($('.responsive-tabs__heading--active').length) {
								oldActivePos = $('.responsive-tabs__heading--active').offset().top;
							}
							
							// close currently active panel and remove active state from any hidden heading
							$tabs.find('.responsive-tabs__panel--active').slideToggle().removeClass('responsive-tabs__panel--active').prev().removeClass('responsive-tabs__heading--active');
							
							//close all tabs
							$tabs.find('.responsive-tabs__panel').hide().attr('aria-hidden','true');

							//open this panel
							$tabPanel.slideToggle().addClass('responsive-tabs__panel--active').attr('aria-hidden','false');

							// make this heading active
							$tabHeading.addClass('responsive-tabs__heading--active');

							var $currentActive = $tabs.find('.responsive-tabs__list__item--active');

							//set the active tab list item (for desktop)
							$currentActive.removeClass('responsive-tabs__list__item--active');
							var panelId = $tabPanel.attr('id');
							var tabId = panelId.replace('panel','tab');
							$('#' + tabId).addClass('responsive-tabs__list__item--active');

							//scroll to active heading only if it is below previous one
							var tabsPos = $('.responsive-tabs').offset().top;
							var newActivePos = ($('.responsive-tabs__heading--active').offset().top) - 15;
							if(oldActivePos < newActivePos) {
								$('html, body').animate({ scrollTop: tabsPos }, 0).animate({ scrollTop: newActivePos }, 400);
							}
							
						}

						// if this tab panel is already active
						else {

							// hide panel but give it special responsive-tabs__panel--closed-accordion-only class so that it can be visible at desktop size
							$tabPanel.removeClass('responsive-tabs__panel--active').slideToggle(function () { $(this).addClass('responsive-tabs__panel--closed-accordion-only'); });

							//remove active heading class
							$tabHeading.removeClass('responsive-tabs__heading--active');

							//don't alter classes on tabs as we want it active if put back to desktop size
						}
						
					});

					tabcount ++;

				});

				// add finished tab list to its container
				$tabs.prepend($tabList);

				// next set of tabs on page
				tablistcount ++;
			});
		}
	};
})(jQuery);

/* ----------------
ResponsiveAccordion.js
Author: Pete Love | www.petelove.com
Version: 1.9
------------------- */

var RESPONSIVEACCORD = {};

(function($) {

	RESPONSIVEACCORD.responsiveAccordion = function () {
		var $accordSets = $('.responsive-accordion');

		if (!$accordSets.hasClass('responsive-accordion--enabled')) {	// if we haven't already called this function and enabled accords
			$accordSets.addClass('responsive-accordion--enabled'); 

			//loop through all sets of accords on the page
			var accordlistcount = 1;

			$accordSets.each(function() {

				var $accords = $(this);

				// add accord heading and accord panel classes
				$accords.children('h1,h2,h3,h4,h5,h6').addClass('responsive-accordion__heading');
				$accords.children('div').addClass('responsive-accordion__panel');

				// determine if markup already identifies the active accord panel for this set of accords
				// if not then set first heading and accord to be the active one
				var $activePanel = $accords.find('.responsive-accordion__panel--active');
				if(!$activePanel.length) {
					$activePanel = $accords.find('.responsive-accordion__panel').first().addClass('responsive-accordion__panel--active');
				}

				$accords.find('.responsive-accordion__panel').not('.responsive-accordion__panel--active').hide().attr('aria-hidden','true'); //hide all except active panel
				$activePanel.attr('aria-hidden', 'false');
				/* make active accord panel hidden for mobile */
				$activePanel.addClass('responsive-accordion__panel--closed-accordion-only');

				// wrap accords in container - to be dynamically resized to help prevent page jump
				var $accordsWrapper = $('<div/>', {'class': 'responsive-accordion-wrapper' });
				$accords.wrap($accordsWrapper);

				var highestHeight = "98%";

				// determine height of tallest accord panel. Used later to prevent page jump when accords are clicked
				$accords.find('.responsive-accordion__panel').each(function() {
					var accordHeight = $(this).height();
					if (accordHeight > highestHeight) {
						
						highestHeight = accordHeight;
					}
				});

				//create the accord list
				var $accordList = $('<ul/>', { 'class': 'responsive-accordion__list', 'role': 'accordlist' });

				//loop through each heading in set
				var accordcount = 1;
				$accords.find('.responsive-accordion__heading').each(function() {

					var $accordHeading = $(this);
					var $accordPanel = $(this).next();

					$accordHeading.attr('accordindex', 0);

					// CREATE accord ITEMS (VISIBLE ON DESKTOP)
					//create accord list item from heading
					//associate accord list item with accord panel
					var $accordListItem = $('<li/>', { 
						'class': 'responsive-accordion__list__item',
						id: 'accordlist' + accordlistcount + '-accord' + accordcount,
						'aria-controls': 'accordlist' + accordlistcount +'-panel' + accordcount,
						'role': 'accord',
						accordindex: 0,
						text: $accordHeading.text(),
						keydown: function (objEvent) {
							if (objEvent.keyCode === 13) { // if user presses 'enter'
								$accordListItem.click();
							}
						},
						click: function() {
							//Show associated panel

							//set height of accord container to highest panel height to avoid page jump
							$accordsWrapper.css('height', highestHeight);
							// remove hidden mobile class from any other panel as we'll want that panel to be open at mobile size
							$accords.find('.responsive-accordion__panel--closed-accordion-only').removeClass('responsive-accordion__panel--closed-accordion-only');
							
							// close current panel and remove active state from its (hidden on desktop) heading
							$accords.find('.responsive-accordion__panel--active').toggle().removeClass('responsive-accordion__panel--active').attr('aria-hidden','true').prev().removeClass('responsive-accordion__heading--active');
							
							//make this accord panel active
							$accordPanel.toggle().addClass('responsive-accordion__panel--active').attr('aria-hidden','false');

							//make the hidden heading active
							$accordHeading.addClass('responsive-accordion__heading--active');

							//remove active state from currently active accord list item
							$accordList.find('.responsive-accordion__list__item--active').removeClass('responsive-accordion__list__item--active');

							//make this accord active
							$accordListItem.addClass('responsive-accordion__list__item--active');

							//reset height of accord panels to auto
							$accordsWrapper.css('height', 'auto');
						}
					});
					
					//associate accord panel with accord list item
					$accordPanel.attr({
						'role': 'accordpanel',
						'aria-labelledby': $accordListItem.attr('id'),
						id: 'accordlist' + accordlistcount + '-panel' + accordcount
					});

					// if this is the active panel then make it the active accord item
					if($accordPanel.hasClass('responsive-accordion__panel--active')) {
						$accordListItem.addClass('responsive-accordion__list__item--active');
					}

					// add accord item
					$accordList.append($accordListItem);

					
					// accord HEADINGS (VISIBLE ON MOBILE)
					// if user presses 'enter' on accord heading trigger the click event
					$accordHeading.keydown(function(objEvent) {
						if (objEvent.keyCode === 13) {
							$accordHeading.click();
						}
					});

					//toggle accord panel if click heading (on mobile)
					$accordHeading.click(function() {

						// remove any hidden mobile class
						$accords.find('.responsive-accordion__panel--closed-accordion-only').removeClass('responsive-accordion__panel--closed-accordion-only');

						// if this isn't currently active
						if (!$accordHeading.hasClass('responsive-accordion__heading--active')){

							var oldActivePos;
							// if there is an active heading, get its position
							if($('.responsive-accordion__heading--active').length) {
								oldActivePos = $('.responsive-accordion__heading--active').offset().top;
							}
							
							// close currently active panel and remove active state from any hidden heading
							$accords.find('.responsive-accordion__panel--active').slideToggle().removeClass('responsive-accordion__panel--active').prev().removeClass('responsive-accordion__heading--active');
							//alert(highestHeight);

							//close all accords
							$accords.find('.responsive-accordion__panel').hide().attr('aria-hidden','true');

							//open this panel
							$accordPanel.slideToggle().addClass('responsive-accordion__panel--active').attr('aria-hidden','false');

							// make this heading active
							$accordHeading.addClass('responsive-accordion__heading--active');

							var $currentActive = $accords.find('.responsive-accordion__list__item--active');

							//set the active accord list item (for desktop)
							$currentActive.removeClass('responsive-accordion__list__item--active');
							var panelId = $accordPanel.attr('id');
							var accordId = panelId.replace('panel','accord');
							$('#' + accordId).addClass('responsive-accordion__list__item--active');

							//scroll to active heading only if it is below previous one
							var accordsPos = $('.responsive-accordion').offset().top;
							var newActivePos = ($('.responsive-accordion__heading--active').offset().top) - 15;
							if(oldActivePos < newActivePos) {
								//$('html, body').animate({ scrollTop: accordsPos }, 0).animate({ scrollTop: newActivePos }, 400);
								//alert("jump");
							}
							
						}

						// if this accord panel is already active
						else {

							// hide panel but give it special responsive-accordion__panel--closed-accordion-only class so that it can be visible at desktop size
							$accordPanel.removeClass('responsive-accordion__panel--active').slideToggle(function () { $(this).addClass('responsive-accordion__panel--closed-accordion-only'); });

							//remove active heading class
							$accordHeading.removeClass('responsive-accordion__heading--active');

							//don't alter classes on accords as we want it active if put back to desktop size
						}
						
					});

					accordcount ++;

				});

				// add finished accord list to its container
				$accords.prepend($accordList);

				// next set of accords on page
				accordlistcount ++;
			});
		}
	};
})(jQuery);
