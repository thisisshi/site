/**
 * @preserve
 * FullCalendar v1.5.2
 * http://arshaw.com/fullcalendar/
 *
 * Use fullcalendar.css for basic styling.
 * For event drag & drop, requires jQuery UI draggable.
 * For event resizing, requires jQuery UI resizable.
 *
 * Copyright (c) 2011 Adam Shaw
 * Dual licensed under the MIT and GPL licenses, located in
 * MIT-LICENSE.txt and GPL-LICENSE.txt respectively.
 *
 * Date: Sun Aug 21 22:06:09 2011 -0700
 *
 */
 
(function ($, undefined) {


    var defaults = {

        // display
        // Display options - month, basicWeek, basicDay, agendaWeek, agendaDay.
        defaultView: 'month',

        aspectRatio: 1.35,
        header: {
            left: 'title',
            center: '',
            right: 'today prev,next'
        },
        weekends: true,

        // editing
        //editable: false,
        //disableDragging: false,
        //disableResizing: false,

        allDayDefault: true,
        ignoreTimezone: true,
		maxperday: 20,
        moretitle: 'More Events',
        DaysEvents: 0,
        // event ajax
        lazyFetching: true,
        startParam: 'start',
        endParam: 'end',

        // time formats
        titleFormat: {
            month: 'MMMM yyyy',
            week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",
            day: 'ddd, MMM d, yyyy'
        },
        columnFormat: {
            month: 'ddd',
            week: 'ddd M/d',
            day: 'dddd M/d'
        },
		startEndFormat: {
            month: 'ddd',
            week: 'ddd M/d',
            day: 'M/d/yy'
        },
		dayFormat: {
            month: 'ddd',
            week: 'ddd M/d',
            day: 'yyyy-M-d',
			dayNum: 'dd',
			dateComp: 'yyyyMdd',
			dayWeekYear: 'M/dd/yyyy'
        },

        timeFormat: { // for event elements
            '': 'h(:mm)tt' // default
        },

        // locale
        isRTL: false,
        firstDay: 0,
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        buttonText: {
            prev: '&nbsp;&#9668;&nbsp;',
            next: '&nbsp;&#9658;&nbsp;',
 			prevUrl: '#',
			nextUrl: '#',
			monthUrl: '#',
			prevYear: '&nbsp;&lt;&lt;&nbsp;',
            nextYear: '&nbsp;&gt;&gt;&nbsp;',
            future: false,
            yearlyIndex: 'Yearly Index',
			today: 'today',
            month: 'month',
            week: 'week',
            day: 'day',
			printCal: 'Print Calendar'
        },

        // jquery-ui theming
        theme: false,
        buttonIcons: {
            prev: 'circle-triangle-w',
            next: 'circle-triangle-e'
        },

        //selectable: false,
        unselectAuto: true,

        dropAccept: '*'

    };
    //if (!setview) {
    //    defaultView: setview,
    //};
    // right-to-left defaults
    var rtlDefaults = {
        header: {
            //left: 'next,prev today',
			left: 'next,prev',
            center: '',
            right: 'title'
        },
        buttonText: {
            prev: '&nbsp;&#9658;&nbsp;',
            next: '&nbsp;&#9668;&nbsp;',
			prevUrl: '#',
			nextUrl: '#',
            monthUrl: '#',
			prevYear: '&nbsp;&gt;&gt;&nbsp;',
            nextYear: '&nbsp;&lt;&lt;&nbsp;',
			yearlyIndex: 'Yearly Index',
			printCal: 'Print Calendar'
        },
        buttonIcons: {
            prev: 'circle-triangle-e',
            next: 'circle-triangle-w'
        }
    };



    var fc = $.fullCalendar = { version: "1.5.2" };
    var fcViews = fc.views = {};


    $.fn.fullCalendar = function (options) {

        // method calling
        if (typeof options == 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            var res;
            this.each(function () {
                var calendar = $.data(this, 'fullCalendar');
                if (calendar && $.isFunction(calendar[options])) {
                    var r = calendar[options].apply(calendar, args);
                    if (res === undefined) {
                        res = r;
                    }
                    if (options == 'destroy') {
                        $.removeData(this, 'fullCalendar');
                    }
                }
            });
            if (res !== undefined) {
                return res;
            }
            return this;
        }


        // would like to have this logic in EventManager, but needs to happen before options are recursively extended
        var eventSources = options.eventSources || [];
        delete options.eventSources;
        if (options.events) {
            eventSources.push(options.events);
            delete options.events;
        }


        options = $.extend(true, {},
		defaults,
		(options.isRTL || options.isRTL === undefined && defaults.isRTL) ? rtlDefaults : {},
		options
	);

        this.each(function (i, _element) {
            var element = $(_element);
            var calendar = new Calendar(element, options, eventSources);
            element.data('fullCalendar', calendar); // TODO: look into memory leak implications
            calendar.render();
        });


        return this;

    };

    // Read a page's GET URL variables and return them as an associative array. 
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
			
        } return vars;
    }


    // function for adding/overriding defaults
    function setDefaults(d) {
        $.extend(true, defaults, d);
    }




    function Calendar(element, options, eventSources) {
        var t = this;


        // exports
        t.options = options;
        t.render = render;
        t.destroy = destroy;
        t.refetchEvents = refetchEvents;
        t.reportEvents = reportEvents;
        t.reportEventChange = reportEventChange;
        t.rerenderEvents = rerenderEvents;
        t.changeView = changeView;
        t.select = select;
        t.unselect = unselect;
        t.prev = prev;
        t.next = next;
		t.printCal = printCal;
        t.prevYear = prevYear;
        t.nextYear = nextYear;
        t.monthUrl = monthUrl,
		t.yearlyIndex = yearlyIndex;
       	t.today = today;
        t.gotoDate = gotoDate;
        t.incrementDate = incrementDate;
        t.formatDate = function (format, date) { return formatDate(format, date, options) };
        t.formatDates = function (format, date1, date2) { return formatDates(format, date1, date2, options) };
        t.getDate = getDate;
        t.getView = getView;
        t.option = option;
        t.trigger = trigger;

        // imports
        EventManager.call(t, options, eventSources);
        var isFetchNeeded = t.isFetchNeeded;
        var fetchEvents = t.fetchEvents;


        // locals
        var _element = element[0];
        var header;
        var maxperday;
        var moreTitle;
		var headerElement;
        var content;
        var tm; // for making theme classes
        var currentView;
        var viewInstances = {};
        var elementOuterWidth;
        var suggestedViewHeight;
        var absoluteViewElement;
        var resizeUID = 0;
        var ignoreWindowResize = 0;
        var date = new Date();
		var events = [];
        var _dragElement;
		var setView;
		var setAgendaDate;
		var setDateList;
		var setYearDate;
		var setMonthDate;
		var setDayDate;
        /* Main Rendering
        -----------------------------------------------------------------------------*/
		var setView = getUrlVars()["view"];
		var setAgendaDate = getUrlVars()['agendadate'];
		if (setView == "agendaDay") {
		       // maxperday(setView);
               // $('.fcMaxEvents').css('display', 'true');
			   $('#meEvents').css('display','none');
			   
		} else {
			$('#meAllDayListing').css('display','none');
		}
		if (setView != "") {
			if (setView == "month" || setView == "basicWeek" ||setView == "basicDay" || setView == "agendaWeek" || setView == "agendaDay"){
			} else {
				setView = "";
			}
			
		}
	
        setYMD(date, options.year, options.month, options.date);
      	// John Thompson - Check to see if a date has been passed in the URL.
		if (setAgendaDate) {
			setAgendaDate = setAgendaDate.replace(/^#+/, '');
			var setDateList = setAgendaDate.split('-'); 
			var setYearDate = setDateList[0];
			var setMonthDate = setDateList[1] -1;
			var setDayDate = setDateList[2];
			setYMD(date, setYearDate, setMonthDate, setDayDate);
		}
        function render(inc) {
            if (!content) {
                initialRender();
				/*if (options.ToolTip === 1){
				codabubble();
				};*/

            } else {
                calcSize();
                markSizesDirty();
                markEventsDirty();
                renderView(inc);

            }
        }


        function initialRender() {
            tm = options.theme ? 'ui' : 'fc';
            element.addClass('fc');
            if (options.isRTL) {
                element.addClass('fc-rtl');
            }
            if (options.theme) {
                element.addClass('ui-widget');
            }
            content = $("<div class='fc-content' style='position:relative'/>")
			.prependTo(element);
            header = new Header(t, options);
			headerElement = header.render();
            if (headerElement) {
                element.prepend(headerElement);
            }

            //John T - This will change the View based upon what is past in the url parameters.
            if (!setView == "") {
                options.defaultView = setView;
                
            };
           
			
            changeView(options.defaultView);
           
            $(window).resize(windowResize);
            // needed for IE in a 0x0 iframe, b/c when it is resized, never triggers a windowResize
            if (setView == "agendaDay") {
            //alert (options.DaysEvents);
                if (options.DaysEvents) {
                    $('.fc-view').css('display','none');
                } else {
				    $('#fcMaxEvents').css('display','inherit');
				    $('#fcMaxMoreEvents').css('display','none');
                }
				lateRender();
			}

			if (!bodyVisible()) {
                lateRender();
				
            }
        }


        // called when we know the calendar couldn't be rendered when it was initialized,
        // but we think it's ready now
        function lateRender() {
            setTimeout(function () { // IE7 needs this so dimensions are calculated correctly
                if (!currentView.start && bodyVisible()) { // !currentView.start makes sure this never happens more than once
                    renderView();

                }
            }, 0);
        }


        function destroy() {
            $(window).unbind('resize', windowResize);
            header.destroy();
            content.remove();
            element.removeClass('fc fc-rtl ui-widget');
        }



        function elementVisible() {
            return _element.offsetWidth !== 0;
        }


        function bodyVisible() {
            return $('body')[0].offsetWidth !== 0;
        }



        /* View Rendering
        -----------------------------------------------------------------------------*/

        // TODO: improve view switching (still weird transition in IE, and FF has whiteout problem)

        function changeView(newViewName) {
            if (!currentView || newViewName != currentView.name) {
                ignoreWindowResize++; // because setMinHeight might change the height before render (and subsequently setSize) is reached

                unselect();
				
                var oldView = currentView;
                var newViewElement;
				
                if (oldView) {
                    (oldView.beforeHide || noop)(); // called before changing min-height. if called after, scroll state is reset (in Opera)
                    setMinHeight(content, content.height());
                    oldView.element.hide();
                } else {
                    setMinHeight(content, 1); // needs to be 1 (not 0) for IE7, or else view dimensions miscalculated
                }
                content.css('overflow', 'hidden');

                currentView = viewInstances[newViewName];
                if (currentView) {
                    currentView.element.show();
                } else {
                    currentView = viewInstances[newViewName] = new fcViews[newViewName](
					newViewElement = absoluteViewElement =
						$("<div class='fc-view fc-view-" + newViewName + "' style='position:absolute'/>")
							.appendTo(content),
					t // the calendar object
				);
                }

                if (oldView) {
                    header.deactivateButton(oldView.name);
                }
                header.activateButton(newViewName);
                
                renderView(); // after height has been set, will make absoluteViewElement's position=relative, then set to null
                

                content.css('overflow', '');
                if (oldView) {
                    setMinHeight(content, 1);
                }

                if (!newViewElement) {
                    (currentView.afterShow || noop)(); // called after setting min-height/overflow, so in final scroll state (for Opera)
                }

                ignoreWindowResize--;
            }
        }



        function renderView(inc) {
            if (elementVisible()) {
                ignoreWindowResize++; // because renderEvents might temporarily change the height before setSize is reached
                unselect();

                if (suggestedViewHeight === undefined) {
                    calcSize();
                }
                
                var forceEventRender = false;
                if (!currentView.start || inc || date < currentView.start || date >= currentView.end) {
                    // view must render an entire new date range (and refetch/render events)
                    currentView.render(date, inc || 0); // responsible for clearing events
                    setSize(true);
                    forceEventRender = true;
                }
                else if (currentView.sizeDirty) {
                    // view must resize (and rerender events)
                    currentView.clearEvents();
                    setSize();
                    forceEventRender = true;
                }
                else if (currentView.eventsDirty) {
                    currentView.clearEvents();
                    forceEventRender = true;
                }
                currentView.sizeDirty = false;
                currentView.eventsDirty = false;
                updateEvents(forceEventRender);

                elementOuterWidth = element.outerWidth();

                header.updateTitle(currentView.title);
                var today = new Date();
                if (today >= currentView.start && today < currentView.end) {
                    header.disableButton('today');
                } else {
                    header.enableButton('today');
                }
           
                ignoreWindowResize--;
                currentView.trigger('viewDisplay', _element);

            }
        }



        /* Resizing
        -----------------------------------------------------------------------------*/


        function updateSize() {
            markSizesDirty();
            if (elementVisible()) {
                calcSize();
                setSize();
                unselect();
                currentView.clearEvents();
                currentView.renderEvents(events);
                currentView.sizeDirty = false;
            }
        }


        function markSizesDirty() {
            $.each(viewInstances, function (i, inst) {
                inst.sizeDirty = true;
            });
        }


        function calcSize() {
            if (options.contentHeight) {
                suggestedViewHeight = options.contentHeight;
            }
            else if (options.height) {
                suggestedViewHeight = options.height - (headerElement ? headerElement.height() : 0) - vsides(content);
            }
            else {
                suggestedViewHeight = Math.round(content.width() / Math.max(options.aspectRatio, .5));
            }
        }


        function setSize(dateChanged) { // todo: dateChanged?
            ignoreWindowResize++;
            currentView.setHeight(suggestedViewHeight, dateChanged);
            if (absoluteViewElement) {
                absoluteViewElement.css('position', 'relative');
                absoluteViewElement = null;
            }
            currentView.setWidth(content.width(), dateChanged);
            ignoreWindowResize--;
        }


        function windowResize() {
            if (!ignoreWindowResize) {
                if (currentView.start) { // view has already been rendered
                    var uid = ++resizeUID;
                    setTimeout(function () { // add a delay
                        if (uid == resizeUID && !ignoreWindowResize && elementVisible()) {
                            if (elementOuterWidth != (elementOuterWidth = element.outerWidth())) {
                                ignoreWindowResize++; // in case the windowResize callback changes the height
                                updateSize();
                                currentView.trigger('windowResize', _element);
                                ignoreWindowResize--;
                            }
                        }
                    }, 200);
                } else {
                    // calendar must have been initialized in a 0x0 iframe that has just been resized
                    lateRender();
                }
            }
        }



        /* Event Fetching/Rendering
        -----------------------------------------------------------------------------*/


        // fetches events if necessary, rerenders events if necessary (or if forced)
        function updateEvents(forceRender) {
            if (!options.lazyFetching || isFetchNeeded(currentView.visStart, currentView.visEnd)) {
                refetchEvents();
            }
            else if (forceRender) {
                rerenderEvents();
            }
        }


        function refetchEvents() {
            fetchEvents(currentView.visStart, currentView.visEnd); // will call reportEvents
        }


        // called when event data arrives
        function reportEvents(_events) {
            events = _events;
            rerenderEvents();
        }


        // called when a single event's data has been changed
        function reportEventChange(eventID) {
            rerenderEvents(eventID);
        }


        // attempts to rerenderEvents
        function rerenderEvents(modifiedEventID) {
            markEventsDirty();
            if (elementVisible()) {
                currentView.clearEvents();
                currentView.renderEvents(events, modifiedEventID);
                currentView.eventsDirty = false;
            }
        }


        function markEventsDirty() {
            $.each(viewInstances, function (i, inst) {
                inst.eventsDirty = true;
            });
        }



        /* Selection
        -----------------------------------------------------------------------------*/


        function select(start, end, allDay) {
            currentView.select(start, end, allDay === undefined ? true : allDay);
        }


        function unselect() { // safe to be called before renderView
            if (currentView) {
                currentView.unselect();
            }
        }
        /* Date
        -----------------------------------------------------------------------------*/
        function prev() {
            //renderView(-1);
        }

        function next() {  
            //renderView(1);
        }
		function printCal() {
            renderView();
        }
	
        function prevYear() {
            //addYears(date, -1);
           // renderView();
        }

        function nextYear() {
            //addYears(date, 1);
            //renderView();
        }
         function monthUrl() {
            //addYears(date, 1);
            //renderView();
        }      
		
		
		function yearlyIndex() {
            //addYears(date, 1);
            //renderView();
        }

        function today() {
            date = new Date();
            renderView();
        }

        function gotoDate(year, month, dateOfMonth) {
  			if (year instanceof Date) {
                date = cloneDate(year); // provided 1 argument, a Date
            } else {
                setYMD(date, year, month, dateOfMonth);
                
            }
            renderView();
        }

        function incrementDate(years, months, days) {
            if (years !== undefined) {
                addYears(date, years);
            }
            if (months !== undefined) {
                addMonths(date, months);
            }
            if (days !== undefined) {
                addDays(date, days);
            }
			
            renderView();
        }

        function getDate() {
            return cloneDate(date);
        }

        /* Misc
        -----------------------------------------------------------------------------*/
        function getView() {
            return currentView;
        }

        function option(name, value) {
            if (value === undefined) {
                return options[name];
            }
            if (name == 'height' || name == 'contentHeight' || name == 'aspectRatio') {
                options[name] = value;
                updateSize();
            }
        }

        function trigger(name, thisObj) {
            if (options[name]) {
                return options[name].apply(
				thisObj || _element,
				Array.prototype.slice.call(arguments, 2)
			);
            }
        }

        /* External Dragging
        ------------------------------------------------------------------------*/

        if (options.droppable) {
            $(document)
			.bind('dragstart', function (ev, ui) {
			    var _e = ev.target;
			    var e = $(_e);
			    if (!e.parents('.fc').length) { // not already inside a calendar
			        var accept = options.dropAccept;
			        if ($.isFunction(accept) ? accept.call(_e, e) : e.is(accept)) {
			            _dragElement = _e;
			            currentView.dragStart(_dragElement, ev, ui);
			        }
			    }
			})
			.bind('dragstop', function (ev, ui) {
			    if (_dragElement) {
			        currentView.dragStop(_dragElement, ev, ui);
			        _dragElement = null;
			    }
			});
        }


    }

    function Header(calendar, options) {
        var t = this;


        // exports
        t.render = render;
        t.destroy = destroy;
        t.updateTitle = updateTitle;
        t.activateButton = activateButton;
        t.deactivateButton = deactivateButton;
        t.disableButton = disableButton;
        t.enableButton = enableButton;


        // locals
        var element = $([]);
        var tm;



        function render() {
            tm = options.theme ? 'ui' : 'fc';
            var sections = options.header;
            if (sections) {
                element = $("<table class='fc-header' style='width:100%'/>")
				.append(
					$("<tr/>")
						.append(renderSection('left'))
						.append(renderSection('center'))
						.append(renderSection('right'))
				);
                return element;
            }
        }


        function destroy() {
            element.remove();
        }


        function renderSection(position) {
            var e = $("<td class='fc-header-" + position + "'/>");
            var buttonStr = options.header[position];
            
			if (buttonStr) {
                $.each(buttonStr.split(' '), function (i) {
                    if (i > 0) {
                        e.append("<span class='fc-header-space'/>");
                    }
                    var prevButton;
                    $.each(this.split(','), function (j, buttonName) {
						if (buttonName == 'title') {
                            e.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>");
                            if (prevButton) {
                                prevButton.addClass(tm + '-corner-right');
                            }
                            prevButton = null;
                        } else {
                            var buttonClick;
                            if (calendar[buttonName]) {
                                buttonClick = calendar[buttonName]; // calendar method
                            }
                            else if (fcViews[buttonName]) {
                                buttonClick = function () {
                                    button.removeClass(tm + '-state-hover'); // forget why
                                    calendar.changeView(buttonName);

                                };
                            }
                            if (buttonClick) {
																
                                var icon = options.theme ? smartProperty(options.buttonIcons, buttonName) : null; // why are we using smartProperty here?
                                var text = smartProperty(options.buttonText, buttonName); // why are we using smartProperty here?
                                //John Thompson - Added href and buttonTitle for ADA.
								var btntext = text
								var buttonTitle = buttonName;
								var buttonUrl = "";
								if (buttonTitle == "agendaWeek"){
									buttonTitle = "Week";
								} else if (buttonTitle == "agendaDay"){
									buttonTitle = "Day";
									
								};
								if (buttonName == "printCal") {
									var buttonUrl = "#' onclick='print_calendar();";
								}
								
								var incDate;
								if (buttonName == "prev") {
									var buttonUrl = smartProperty(options.buttonText, buttonName + 'Url');
									btntext += "Previous&nbsp;Month";
								} else if (buttonName == "next") {
									var buttonUrl = smartProperty(options.buttonText, buttonName + 'Url');
									btntext += "&nbsp;-&nbsp;Next&nbsp;Month";
								} else {
									//incDate = "0";
								}
								if (buttonName == "prevYear") {
									var buttonUrl = smartProperty(options.buttonText, buttonName + 'Url');
									btntext += "Previous&nbsp;Year";
								} else if (buttonName == "nextYear") {
									var buttonUrl = smartProperty(options.buttonText, buttonName + 'Url');
									btntext += "&nbsp;-&nbsp;Next&nbsp;Year";
																	
								}
								if (buttonName == "yearlyIndex") {
									var buttonUrl = smartProperty(options.buttonText, buttonName + 'Url');
								}
								if (buttonName == "month") {
									var buttonUrl = smartProperty(options.buttonText, buttonName + 'Url');
								}
								var button = $(
								//John T. Added href for ADA
								
								"<a href='" + buttonUrl + "' title=" + btntext + ">" +
								"<span class='fc-button fc-button-" + buttonName + " " + tm + "-state-default'>" +
									"<span class='fc-button-inner'>" +
										"<span class='fc-button-content'>" +
											(icon ?
												"<span class='fc-icon-wrap'>" +
													"<span class='ui-icon ui-icon-" + icon + "'/>" +
												"</span>" :
												text
												) +
										"</span>" +
										"<span class='fc-button-effect'><span></span></span>" +
									"</span>" +
								"</span>" +
								"</a>"
							);
                                if (button) {
                                    button
									.click(function () {
									    if (!button.hasClass(tm + '-state-disabled')) {
									        buttonClick();
									    }
									})
									.mousedown(function () {
									    button
											.not('.' + tm + '-state-active')
											.not('.' + tm + '-state-disabled')
											.addClass(tm + '-state-down');
									})
									.mouseup(function () {
									    button.removeClass(tm + '-state-down');
									})
									.hover(
										function () {
										    button
												.not('.' + tm + '-state-active')
												.not('.' + tm + '-state-disabled')
												.addClass(tm + '-state-hover');
										},
										function () {
										    button
												.removeClass(tm + '-state-hover')
												.removeClass(tm + '-state-down');
										}
									)
									.appendTo(e);
                                    if (!prevButton) {
                                        button.addClass(tm + '-corner-left');
                                    }
                                    prevButton = button;
                                }
                            }
                        }
                    });
                    if (prevButton) {
                        prevButton.addClass(tm + '-corner-right');
                    }
                });
            }
            return e;
        }


        function updateTitle(html) {
            element.find('h2')
			.html(html);
        }


        function activateButton(buttonName) {
            element.find('span.fc-button-' + buttonName)
			.addClass(tm + '-state-active');
        }


        function deactivateButton(buttonName) {
            element.find('span.fc-button-' + buttonName)
			.removeClass(tm + '-state-active');
        }


        function disableButton(buttonName) {
            element.find('span.fc-button-' + buttonName)
			.addClass(tm + '-state-disabled');
        }


        function enableButton(buttonName) {
            element.find('span.fc-button-' + buttonName)
			.removeClass(tm + '-state-disabled');
        }


    }

    fc.sourceNormalizers = [];
    fc.sourceFetchers = [];

    var ajaxDefaults = {
        dataType: 'json',
        cache: false
    };

    var eventGUID = 1;


    function EventManager(options, _sources) {
        var t = this;


        // exports
        t.isFetchNeeded = isFetchNeeded;
        t.fetchEvents = fetchEvents;
        t.addEventSource = addEventSource;
        t.removeEventSource = removeEventSource;
        t.updateEvent = updateEvent;
        t.renderEvent = renderEvent;
        t.removeEvents = removeEvents;
        t.clientEvents = clientEvents;
        t.normalizeEvent = normalizeEvent;


        // imports
        var trigger = t.trigger;
        var getView = t.getView;
        var reportEvents = t.reportEvents;


        // locals
        var stickySource = { events: [] };
        var sources = [stickySource];
        var rangeStart, rangeEnd;
        var currentFetchID = 0;
        var pendingSourceCnt = 0;
        var loadingLevel = 0;
        var cache = [];


        for (var i = 0; i < _sources.length; i++) {
            _addEventSource(_sources[i]);
        }



        /* Fetching
        -----------------------------------------------------------------------------*/


        function isFetchNeeded(start, end) {
            return !rangeStart || start < rangeStart || end > rangeEnd;
        }


        function fetchEvents(start, end) {
            rangeStart = start;
            rangeEnd = end;
            cache = [];
            var fetchID = ++currentFetchID;
            var len = sources.length;
            pendingSourceCnt = len;
            for (var i = 0; i < len; i++) {
                fetchEventSource(sources[i], fetchID);
            }
        }


        function fetchEventSource(source, fetchID) {
            _fetchEventSource(source, function (events) {
                if (fetchID == currentFetchID) {
                    if (events) {
                        for (var i = 0; i < events.length; i++) {
                            events[i].source = source;
                            normalizeEvent(events[i]);
                        }
                        cache = cache.concat(events);
                    }
                    pendingSourceCnt--;
                    if (!pendingSourceCnt) {
                        reportEvents(cache);
                    }
                }
            });
        }


        function _fetchEventSource(source, callback) {
            var i;
            var fetchers = fc.sourceFetchers;
            var res;
            for (i = 0; i < fetchers.length; i++) {
                res = fetchers[i](source, rangeStart, rangeEnd, callback);
                if (res === true) {
                    // the fetcher is in charge. made its own async request
                    return;
                }
                else if (typeof res == 'object') {
                    // the fetcher returned a new source. process it
                    _fetchEventSource(res, callback);
                    return;
                }
            }
            var events = source.events;
            if (events) {
                if ($.isFunction(events)) {
                    pushLoading();
                    events(cloneDate(rangeStart), cloneDate(rangeEnd), function (events) {
                        callback(events);
                        popLoading();
                    });
                }
                else if ($.isArray(events)) {
                    callback(events);
                }
                else {
                    callback();
                }
            } else {
                var url = source.url;
                var url = source.url;
                if (url) {
                    var success = source.success;
                    var error = source.error;
                    var complete = source.complete;
                    var data = $.extend({}, source.data || {});
                    var startParam = firstDefined(source.startParam, options.startParam);
                    var endParam = firstDefined(source.endParam, options.endParam);
                    if (startParam) {
                        data[startParam] = Math.round(+rangeStart / 1000);
                    }
                    if (endParam) {
                        data[endParam] = Math.round(+rangeEnd / 1000);
                    }
                    pushLoading();
                    $.ajax($.extend({}, ajaxDefaults, source, {
                        data: data,
                        success: function (events) {
                            events = events || [];
                            var res = applyAll(success, this, arguments);
                            if ($.isArray(res)) {
                                events = res;
                            }
                            callback(events);
                        },
                        error: function () {
                            applyAll(error, this, arguments);
                            callback();
                        },
                        complete: function () {
                            applyAll(complete, this, arguments);
                            popLoading();
                        }
                    }));
                } else {
                    callback();
                }
            }
        }



        /* Sources
        -----------------------------------------------------------------------------*/


        function addEventSource(source) {
            source = _addEventSource(source);
            if (source) {
                pendingSourceCnt++;
                fetchEventSource(source, currentFetchID); // will eventually call reportEvents
            }
        }


        function _addEventSource(source) {
            if ($.isFunction(source) || $.isArray(source)) {
                source = { events: source };
            }
            else if (typeof source == 'string') {
                source = { url: source };
            }
            if (typeof source == 'object') {
                normalizeSource(source);
                sources.push(source);
                return source;
            }
        }


        function removeEventSource(source) {
            sources = $.grep(sources, function (src) {
                return !isSourcesEqual(src, source);
            });
            // remove all client events from that source
            cache = $.grep(cache, function (e) {
                return !isSourcesEqual(e.source, source);
            });
            reportEvents(cache);
        }



        /* Manipulation
        -----------------------------------------------------------------------------*/


        function updateEvent(event) { // update an existing event
            var i, len = cache.length, e,
			defaultEventEnd = getView().defaultEventEnd, // getView???
			startDelta = event.start - event._start,
			endDelta = event.end ?
				(event.end - (event._end || defaultEventEnd(event))) // event._end would be null if event.end
				: 0;                                                      // was null and event was just resized
            for (i = 0; i < len; i++) {
                e = cache[i];
                if (e._id == event._id && e != event) {
                    e.start = new Date(+e.start + startDelta);
                    if (event.end) {
                        if (e.end) {
                            e.end = new Date(+e.end + endDelta);
                        } else {
                            e.end = new Date(+defaultEventEnd(e) + endDelta);
                        }
                    } else {
                        e.end = null;
                    }
                    e.title = event.title;
                    e.url = event.url;
                    e.allDay = event.allDay;
                    e.className = event.className;
                    e.editable = event.editable;
                    e.color = event.color;
                    e.backgroudColor = event.backgroudColor;
                    e.borderColor = event.borderColor;
                    e.textColor = event.textColor;
                    normalizeEvent(e);
                }
            }
            normalizeEvent(event);
            reportEvents(cache);
        }


        function renderEvent(event, stick) {
            normalizeEvent(event);
            if (!event.source) {
                if (stick) {
                    stickySource.events.push(event);
                    event.source = stickySource;
                }
                cache.push(event);
            }
            reportEvents(cache);
        }


        function removeEvents(filter) {
            if (!filter) { // remove all
                cache = [];
                // clear all array sources
                for (var i = 0; i < sources.length; i++) {
                    if ($.isArray(sources[i].events)) {
                        sources[i].events = [];
                    }
                }
            } else {
                if (!$.isFunction(filter)) { // an event ID
                    var id = filter + '';
                    filter = function (e) {
                        return e._id == id;
                    };
                }
                cache = $.grep(cache, filter, true);
                // remove events from array sources
                for (var i = 0; i < sources.length; i++) {
                    if ($.isArray(sources[i].events)) {
                        sources[i].events = $.grep(sources[i].events, filter, true);
                    }
                }
            }
            reportEvents(cache);
        }


        function clientEvents(filter) {
            if ($.isFunction(filter)) {
                return $.grep(cache, filter);
            }
            else if (filter) { // an event ID
                filter += '';
                return $.grep(cache, function (e) {
                    return e._id == filter;
                });
            }
            return cache; // else, return all
        }



        /* Loading State
        -----------------------------------------------------------------------------*/


        function pushLoading() {
            if (!loadingLevel++) {
                trigger('loading', null, true);
            }
        }


        function popLoading() {
            if (! --loadingLevel) {
                trigger('loading', null, false);
            }
        }



        /* Event Normalization
        -----------------------------------------------------------------------------*/


        function normalizeEvent(event) {
            var source = event.source || {};
            var ignoreTimezone = firstDefined(source.ignoreTimezone, options.ignoreTimezone);
            event._id = event._id || (event.id === undefined ? '_fc' + eventGUID++ : event.id + '');
            if (event.date) {
                if (!event.start) {
                    event.start = event.date;
                }
                delete event.date;
            }
            event._start = cloneDate(event.start = parseDate(event.start, ignoreTimezone));
            event.end = parseDate(event.end, ignoreTimezone);
            if (event.end && event.end <= event.start) {
                //event.end = null;
            }
            event._end = event.end ? cloneDate(event.end) : null;
            if (event.allDay === undefined) {
                event.allDay = firstDefined(source.allDayDefault, options.allDayDefault);
            }
            if (event.className) {
                if (typeof event.className == 'string') {
                    event.className = event.className.split(/\s+/);
                }
            } else {
                event.className = [];
            }
            // TODO: if there is no start date, return false to indicate an invalid event
        }



        /* Utils
        ------------------------------------------------------------------------------*/


        function normalizeSource(source) {
            if (source.className) {
                // TODO: repeat code, same code for event classNames
                if (typeof source.className == 'string') {
                    source.className = source.className.split(/\s+/);
                }
            } else {
                source.className = [];
            }
            var normalizers = fc.sourceNormalizers;
            for (var i = 0; i < normalizers.length; i++) {
                normalizers[i](source);
            }
        }


        function isSourcesEqual(source1, source2) {
            return source1 && source2 && getSourcePrimitive(source1) == getSourcePrimitive(source2);
        }


        function getSourcePrimitive(source) {
            return ((typeof source == 'object') ? (source.events || source.url) : '') || source;
        }


    }


    fc.addDays = addDays;
    fc.cloneDate = cloneDate;
    fc.parseDate = parseDate;
    fc.parseISO8601 = parseISO8601;
    fc.parseTime = parseTime;
    fc.formatDate = formatDate;
    fc.formatDates = formatDates;



    /* Date Math
    -----------------------------------------------------------------------------*/

    var dayIDs = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
	DAY_MS = 86400000,
	HOUR_MS = 3600000,
	MINUTE_MS = 60000;


    function addYears(d, n, keepTime) {
        d.setFullYear(d.getFullYear() + n);
        if (!keepTime) {
            clearTime(d);
        }
        return d;
    }


    function addMonths(d, n, keepTime) { // prevents day overflow/underflow
        if (+d) { // prevent infinite looping on invalid dates
            var m = d.getMonth() + n,
			check = cloneDate(d);
            check.setDate(1);
            check.setMonth(m);
            d.setMonth(m);
            if (!keepTime) {
                clearTime(d);
            }
            while (d.getMonth() != check.getMonth()) {
                d.setDate(d.getDate() + (d < check ? 1 : -1));
            }
        }
        return d;
    }


    function addDays(d, n, keepTime) { // deals with daylight savings
        if (+d) {
            var dd = d.getDate() + n,
			check = cloneDate(d);
            check.setHours(9); // set to middle of day
            check.setDate(dd);
            d.setDate(dd);
            if (!keepTime) {
                clearTime(d);
            }
            fixDate(d, check);
        }
        return d;
    }


    function fixDate(d, check) { // force d to be on check's YMD, for daylight savings purposes
        if (+d) { // prevent infinite looping on invalid dates
            while (d.getDate() != check.getDate()) {
                d.setTime(+d + (d < check ? 1 : -1) * HOUR_MS);
            }
        }
    }


    function addMinutes(d, n) {
        d.setMinutes(d.getMinutes() + n);
        return d;
    }


    function clearTime(d) {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    }


    function cloneDate(d, dontKeepTime) {
        if (dontKeepTime) {
            return clearTime(new Date(+d));
        }
        return new Date(+d);
    }


    function zeroDate() { // returns a Date with time 00:00:00 and dateOfMonth=1
        var i = 0, d;
        do {
            d = new Date(1970, i++, 1);
        } while (d.getHours()); // != 0
        return d;
    }


    function skipWeekend(date, inc, excl) {
        inc = inc || 1;
        while (!date.getDay() || (excl && date.getDay() == 1 || !excl && date.getDay() == 6)) {
            addDays(date, inc);
        }
        return date;
    }


    function dayDiff(d1, d2) { // d1 - d2
        return Math.round((cloneDate(d1, true) - cloneDate(d2, true)) / DAY_MS);
    }


    function setYMD(date, y, m, d) {
		if (y !== undefined && y != date.getFullYear()) {
            date.setDate(1);
            date.setMonth(0);
            date.setFullYear(y);
        }
        if (m !== undefined && m != date.getMonth()) {
            date.setDate(1);
            date.setMonth(m);
        }
        if (d !== undefined) {
            date.setDate(d);
        }
    }



    /* Date Parsing
    -----------------------------------------------------------------------------*/


    function parseDate(s, ignoreTimezone) { // ignoreTimezone defaults to true
        if (typeof s == 'object') { // already a Date object
            return s;
        }
        if (typeof s == 'number') { // a UNIX timestamp
            return new Date(s * 1000);
        }
        if (typeof s == 'string') {
            if (s.match(/^\d+(\.\d+)?$/)) { // a UNIX timestamp
                return new Date(parseFloat(s) * 1000);
            }
            if (ignoreTimezone === undefined) {
                ignoreTimezone = true;
            }
            return parseISO8601(s, ignoreTimezone) || (s ? new Date(s) : null);
        }
        // TODO: never return invalid dates (like from new Date(<string>)), return null instead
        return null;
    }


    function parseISO8601(s, ignoreTimezone) { // ignoreTimezone defaults to false
        // derived from http://delete.me.uk/2005/03/iso8601.html
        // TODO: for a know glitch/feature, read tests/issue_206_parseDate_dst.html
        var m = s.match(/^([0-9]{4})(-([0-9]{2})(-([0-9]{2})([T ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
        if (!m) {
            return null;
        }
        var date = new Date(m[1], 0, 1);
        if (ignoreTimezone || !m[13]) {
            var check = new Date(m[1], 0, 1, 9, 0);
            if (m[3]) {
                date.setMonth(m[3] - 1);
                check.setMonth(m[3] - 1);
            }
            if (m[5]) {
                date.setDate(m[5]);
                check.setDate(m[5]);
            }
            fixDate(date, check);
            if (m[7]) {
                date.setHours(m[7]);
            }
            if (m[8]) {
                date.setMinutes(m[8]);
            }
            if (m[10]) {
                date.setSeconds(m[10]);
            }
            if (m[12]) {
                date.setMilliseconds(Number("0." + m[12]) * 1000);
            }
            fixDate(date, check);
        } else {
            date.setUTCFullYear(
			m[1],
			m[3] ? m[3] - 1 : 0,
			m[5] || 1
		);
            date.setUTCHours(
			m[7] || 0,
			m[8] || 0,
			m[10] || 0,
			m[12] ? Number("0." + m[12]) * 1000 : 0
		);
            if (m[14]) {
                var offset = Number(m[16]) * 60 + (m[18] ? Number(m[18]) : 0);
                offset *= m[15] == '-' ? 1 : -1;
                date = new Date(+date + (offset * 60 * 1000));
            }
        }
        return date;
    }


    function parseTime(s) { // returns minutes since start of day
        if (typeof s == 'number') { // an hour
            return s * 60;
        }
        if (typeof s == 'object') { // a Date object
            return s.getHours() * 60 + s.getMinutes();
        }
        var m = s.match(/(\d+)(?::(\d+))?\s*(\w+)?/);
        if (m) {
            var h = parseInt(m[1], 10);
            if (m[3]) {
                h %= 12;
                if (m[3].toLowerCase().charAt(0) == 'p') {
                    h += 12;
                }
            }
            return h * 60 + (m[2] ? parseInt(m[2], 10) : 0);
        }
    }



    /* Date Formatting
    -----------------------------------------------------------------------------*/
    // TODO: use same function formatDate(date, [date2], format, [options])


    function formatDate(date, format, options) {
        return formatDates(date, null, format, options);
    }


    function formatDates(date1, date2, format, options) {
        options = options || defaults;
        var date = date1,
		otherDate = date2,
		i, len = format.length, c,
		i2, formatter,
		res = '';
        for (i = 0; i < len; i++) {
            c = format.charAt(i);
            if (c == "'") {
                for (i2 = i + 1; i2 < len; i2++) {
                    if (format.charAt(i2) == "'") {
                        if (date) {
                            if (i2 == i + 1) {
                                res += "'";
                            } else {
                                res += format.substring(i + 1, i2);
                            }
                            i = i2;
                        }
                        break;
                    }
                }
            }
            else if (c == '(') {
                for (i2 = i + 1; i2 < len; i2++) {
                    if (format.charAt(i2) == ')') {
                        var subres = formatDate(date, format.substring(i + 1, i2), options);
                        if (parseInt(subres.replace(/\D/, ''), 10)) {
                            res += subres;
                        }
                        i = i2;
                        break;
                    }
                }
            }
            else if (c == '[') {
                for (i2 = i + 1; i2 < len; i2++) {
                    if (format.charAt(i2) == ']') {
                        var subformat = format.substring(i + 1, i2);
                        var subres = formatDate(date, subformat, options);
                        if (subres != formatDate(otherDate, subformat, options)) {
                            res += subres;
                        }
                        i = i2;
                        break;
                    }
                }
            }
            else if (c == '{') {
                date = date2;
                otherDate = date1;
            }
            else if (c == '}') {
                date = date1;
                otherDate = date2;
            }
            else {
                for (i2 = len; i2 > i; i2--) {
                    if (formatter = dateFormatters[format.substring(i, i2)]) {
                        if (date) {
                            res += formatter(date, options);
                        }
                        i = i2 - 1;
                        break;
                    }
                }
                if (i2 == i) {
                    if (date) {
                        res += c;
                    }
                }
            }
        }
        return res;
    };


    var dateFormatters = {
        s: function (d) { return d.getSeconds() },
        ss: function (d) { return zeroPad(d.getSeconds()) },
        m: function (d) { return d.getMinutes() },
        mm: function (d) { return zeroPad(d.getMinutes()) },
        h: function (d) { return d.getHours() % 12 || 12 },
        hh: function (d) { return zeroPad(d.getHours() % 12 || 12) },
        H: function (d) { return d.getHours() },
        HH: function (d) { return zeroPad(d.getHours()) },
        d: function (d) { return d.getDate() },
        dd: function (d) { return zeroPad(d.getDate()) },
        ddd: function (d, o) { return o.dayNamesShort[d.getDay()] },
        dddd: function (d, o) { return o.dayNames[d.getDay()] },
        M: function (d) { return d.getMonth() + 1 },
        MM: function (d) { return zeroPad(d.getMonth() + 1) },
        MMM: function (d, o) { return o.monthNamesShort[d.getMonth()] },
        MMMM: function (d, o) { return o.monthNames[d.getMonth()] },
        yy: function (d) { return (d.getFullYear() + '').substring(2) },
        yyyy: function (d) { return d.getFullYear() },
        t: function (d) { return d.getHours() < 12 ? 'a' : 'p' },
        tt: function (d) { return d.getHours() < 12 ? 'am' : 'pm' },
        T: function (d) { return d.getHours() < 12 ? 'A' : 'P' },
        TT: function (d) { return d.getHours() < 12 ? 'AM' : 'PM' },
        u: function (d) { return formatDate(d, "yyyy-MM-dd'T'HH:mm:ss'Z'") },
        S: function (d) {
            var date = d.getDate();
            if (date > 10 && date < 20) {
                return 'th';
            }
            return ['st', 'nd', 'rd'][date % 10 - 1] || 'th';
        }
    };



    fc.applyAll = applyAll;


    /* Event Date Math
    -----------------------------------------------------------------------------*/


    function exclEndDay(event) {
        if (event.end) {
            return _exclEndDay(event.end, event.allDay);
        } else {
            return addDays(cloneDate(event.start), 1);
        }
    }


    function _exclEndDay(end, allDay) {
        end = cloneDate(end);
        return allDay || end.getHours() || end.getMinutes() ? addDays(end, 1) : clearTime(end);
    }


    function segCmp(a, b) {
        return (b.msLength - a.msLength) * 100 + (a.event.start - b.event.start);
    }


    function segsCollide(seg1, seg2) {
        return seg1.end > seg2.start && seg1.start < seg2.end;
    }



    /* Event Sorting
    -----------------------------------------------------------------------------*/


    // event rendering utilities
    function sliceSegs(events, visEventEnds, start, end) {
        var segs = [],
		i, len = events.length, event,
		eventStart, eventEnd,
		segStart, segEnd,
		isStart, isEnd;
        for (i = 0; i < len; i++) {
            event = events[i];
            eventStart = event.start;
            eventEnd = visEventEnds[i];
            if (eventEnd > start && eventStart < end) {
                if (eventStart < start) {
                    segStart = cloneDate(start);
                    isStart = false;
                } else {
                    segStart = eventStart;
                    isStart = true;
                }
                if (eventEnd > end) {
                    segEnd = cloneDate(end);
                    isEnd = false;
                } else {
                    segEnd = eventEnd;
                    isEnd = true;
                }
                segs.push({
                    event: event,
                    start: segStart,
                    end: segEnd,
                    isStart: isStart,
                    isEnd: isEnd,
                    msLength: segEnd - segStart
                });
            }
        }
        return segs.sort(segCmp);
    }


    // event rendering calculation utilities
    function stackSegs(segs) {
        var levels = [],
		i, len = segs.length, seg,
		j, collide, k;
        for (i = 0; i < len; i++) {
            seg = segs[i];
            j = 0; // the level index where seg should belong
            while (true) {
                collide = false;
                if (levels[j]) {
                    for (k = 0; k < levels[j].length; k++) {
                        if (segsCollide(levels[j][k], seg)) {
                            collide = true;
                            break;
                        }
                    }
                }
                if (collide) {
                    j++;
                } else {
                    break;
                }
            }
            if (levels[j]) {
                levels[j].push(seg);
            } else {
                levels[j] = [seg];
            }
        }
        return levels;
    }



    /* Event Element Binding
    -----------------------------------------------------------------------------*/


    function lazySegBind(container, segs, bindHandlers) {
        container.unbind('mouseover').mouseover(function (ev) {
            var parent = ev.target, e,
			i, seg;
            while (parent != this) {
                e = parent;
                parent = parent.parentNode;
            }
            if ((i = e._fci) !== undefined) {
                e._fci = undefined;
                seg = segs[i];
                bindHandlers(seg.event, seg.element, seg);
                $(ev.target).trigger(ev);
            }
            ev.stopPropagation();
        });
    }



    /* Element Dimensions
    -----------------------------------------------------------------------------*/


    function setOuterWidth(element, width, includeMargins) {
        for (var i = 0, e; i < element.length; i++) {
            e = $(element[i]);
            e.width(Math.max(0, width - hsides(e, includeMargins)));
        }
    }


    function setOuterHeight(element, height, includeMargins) {
        for (var i = 0, e; i < element.length; i++) {
            e = $(element[i]);
            e.height(Math.max(0, height - vsides(e, includeMargins)));
        }
    }


    // TODO: curCSS has been deprecated (jQuery 1.4.3 - 10/16/2010)


    function hsides(element, includeMargins) {
        return hpadding(element) + hborders(element) + (includeMargins ? hmargins(element) : 0);
    }


    function hpadding(element) {
        return (parseFloat($.curCSS(element[0], 'paddingLeft', true)) || 0) +
	       (parseFloat($.curCSS(element[0], 'paddingRight', true)) || 0);
    }


    function hmargins(element) {
        return (parseFloat($.curCSS(element[0], 'marginLeft', true)) || 0) +
	       (parseFloat($.curCSS(element[0], 'marginRight', true)) || 0);
    }


    function hborders(element) {
        return (parseFloat($.curCSS(element[0], 'borderLeftWidth', true)) || 0) +
	       (parseFloat($.curCSS(element[0], 'borderRightWidth', true)) || 0);
    }


    function vsides(element, includeMargins) {
        return vpadding(element) + vborders(element) + (includeMargins ? vmargins(element) : 0);
    }


    function vpadding(element) {
        return (parseFloat($.curCSS(element[0], 'paddingTop', true)) || 0) +
	       (parseFloat($.curCSS(element[0], 'paddingBottom', true)) || 0);
    }


    function vmargins(element) {
        return (parseFloat($.curCSS(element[0], 'marginTop', true)) || 0) +
	       (parseFloat($.curCSS(element[0], 'marginBottom', true)) || 0);
    }


    function vborders(element) {
        return (parseFloat($.curCSS(element[0], 'borderTopWidth', true)) || 0) +
	       (parseFloat($.curCSS(element[0], 'borderBottomWidth', true)) || 0);
    }


    function setMinHeight(element, height) {
        height = (typeof height == 'number' ? height + 'px' : height);
        element.each(function (i, _element) {
            _element.style.cssText += ';min-height:' + height + ';_height:' + height;
            // why can't we just use .css() ? i forget
        });
    }



    /* Misc Utils
    -----------------------------------------------------------------------------*/


    //TODO: arraySlice
    //TODO: isFunction, grep ?


    function noop() { }


    function cmp(a, b) {
        return a - b;
    }


    function arrayMax(a) {
        return Math.max.apply(Math, a);
    }


    function zeroPad(n) {
        return (n < 10 ? '0' : '') + n;
    }


    function smartProperty(obj, name) { // get a camel-cased/namespaced property of an object
        if (obj[name] !== undefined) {
            return obj[name];
        }
        var parts = name.split(/(?=[A-Z])/),
		i = parts.length - 1, res;
        for (; i >= 0; i--) {
            res = obj[parts[i].toLowerCase()];
            if (res !== undefined) {
                return res;
            }
        }
        return obj[''];
    }


    function htmlEscape(s) {
        return s.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#039;')
		.replace(/"/g, '&quot;')
		.replace(/\n/g, '<br />');
    }


    function cssKey(_element) {
        return _element.id + '/' + _element.className + '/' + _element.style.cssText.replace(/(^|;)\s*(top|left|width|height)\s*:[^;]*/ig, '');
    }


    function disableTextSelection(element) {
        element
		.attr('unselectable', 'on')
		.css('MozUserSelect', 'none')
		.bind('selectstart.ui', function () { return false; });
    }


    /*
    function enableTextSelection(element) {
    element
    .attr('unselectable', 'off')
    .css('MozUserSelect', '')
    .unbind('selectstart.ui');
    }
    */


    function markFirstLast(e) {
        e.children()
		.removeClass('fc-first fc-last')
		.filter(':first-child')
			.addClass('fc-first')
		.end()
		.filter(':last-child')
			.addClass('fc-last');
    }


    function setDayID(cell, date) {
        cell.each(function (i, _cell) {
            _cell.className = _cell.className.replace(/^fc-\w*/, 'fc-' + dayIDs[date.getDay()]);
            // TODO: make a way that doesn't rely on order of classes
        });
    }


    function getSkinCss(event, opt) {
        var source = event.source || {};
       	var eventColor = event.color;
        var sourceColor = source.color;
        var optionColor = opt('eventColor');
        var backgroundColor =
		event.backgroundColor ||
		eventColor ||
		source.backgroundColor ||
		sourceColor ||
		opt('eventBackgroundColor') ||
		optionColor;
        var borderColor =
		event.borderColor ||
		eventColor ||
		source.borderColor ||
		sourceColor ||
		opt('eventBorderColor') ||
		optionColor;
        var textColor =
		event.textColor ||
		source.textColor ||
		opt('eventTextColor');
        var statements = [];
        if (backgroundColor) {
            statements.push('background-color:' + backgroundColor);
        }
        if (borderColor) {
            statements.push('border-color:' + borderColor);
        }
        if (textColor) {
            statements.push('color:' + textColor);
        }
        return statements.join(';');
    }


    function applyAll(functions, thisObj, args) {
        if ($.isFunction(functions)) {
            functions = [functions];
        }
        if (functions) {
            var i;
            var ret;
            for (i = 0; i < functions.length; i++) {
                ret = functions[i].apply(thisObj, args) || ret;
            }
            return ret;
        }
    }


    function firstDefined() {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] !== undefined) {
                return arguments[i];
            }
        }
    }



    fcViews.month = MonthView;

    function MonthView(element, calendar) {
        var t = this;


        // exports
        t.render = render;


        // imports
        BasicView.call(t, element, calendar, 'month');
        var opt = t.opt;
        var renderBasic = t.renderBasic;
        var formatDate = calendar.formatDate;
		



        function render(date, delta) {
            if (delta) {
                addMonths(date, delta);
                date.setDate(1);
            }
            var start = cloneDate(date, true);
            start.setDate(1);
            var end = addMonths(cloneDate(start), 1);
            var visStart = cloneDate(start);
            var visEnd = cloneDate(end);
            var firstDay = opt('firstDay');
            var nwe = opt('weekends') ? 0 : 1;
            if (nwe) {
                skipWeekend(visStart);
                skipWeekend(visEnd, -1, true);
            }
            addDays(visStart, -((visStart.getDay() - Math.max(firstDay, nwe) + 7) % 7));
            addDays(visEnd, (7 - visEnd.getDay() + Math.max(firstDay, nwe)) % 7);
            var rowCnt = Math.round((visEnd - visStart) / (DAY_MS * 7));
            if (opt('weekMode') == 'fixed') {
                addDays(visEnd, (6 - rowCnt) * 7);
                rowCnt = 6;
            }
            t.title = formatDate(start, opt('titleFormat'));
            t.start = start;
            t.end = end;
            t.visStart = visStart;
            t.visEnd = visEnd;
            renderBasic(6, rowCnt, nwe ? 5 : 7, true);
        }


    }

    fcViews.basicWeek = BasicWeekView;

    function BasicWeekView(element, calendar) {
        var t = this;


        // exports
        t.render = render;


        // imports
        BasicView.call(t, element, calendar, 'basicWeek');
        var opt = t.opt;
        var renderBasic = t.renderBasic;
        var formatDates = calendar.formatDates;



        function render(date, delta) {
            if (delta) {
                addDays(date, delta * 7);
            }
            var start = addDays(cloneDate(date), -((date.getDay() - opt('firstDay') + 7) % 7));
            var end = addDays(cloneDate(start), 7);
            var visStart = cloneDate(start);
            var visEnd = cloneDate(end);
            var weekends = opt('weekends');
            if (!weekends) {
                skipWeekend(visStart);
                skipWeekend(visEnd, -1, true);
            }
            t.title = formatDates(
			visStart,
			addDays(cloneDate(visEnd), -1),
			opt('titleFormat')
		);
            t.start = start;
            t.end = end;
            t.visStart = visStart;
            t.visEnd = visEnd;
            renderBasic(1, 1, weekends ? 7 : 5, false);
        }


    }

    fcViews.basicDay = BasicDayView;

    //TODO: when calendar's date starts out on a weekend, shouldn't happen


    function BasicDayView(element, calendar) {
        var t = this;


        // exports
        t.render = render;


        // imports
        BasicView.call(t, element, calendar, 'basicDay');
        var opt = t.opt;
        var renderBasic = t.renderBasic;
        var formatDate = calendar.formatDate;



        function render(date, delta) {
            if (delta) {
                addDays(date, delta);
                if (!opt('weekends')) {
                    skipWeekend(date, delta < 0 ? -1 : 1);
                }
            }
            t.title = formatDate(date, opt('titleFormat'));
            t.start = t.visStart = cloneDate(date, true);
            t.end = t.visEnd = addDays(cloneDate(t.start), 1);
            renderBasic(1, 1, 1, false);
        }


    }

    setDefaults({
        weekMode: 'fixed'
    });


    function BasicView(element, calendar, viewName) {
        var t = this;


        // exports
        t.renderBasic = renderBasic;
        t.setHeight = setHeight;
        t.setWidth = setWidth;
        t.renderDayOverlay = renderDayOverlay;
        t.defaultSelectionEnd = defaultSelectionEnd;
        t.renderSelection = renderSelection;
        t.clearSelection = clearSelection;
        t.reportDayClick = reportDayClick; // for selection (kinda hacky)
        t.dragStart = dragStart;
        t.dragStop = dragStop;
        t.defaultEventEnd = defaultEventEnd;
        t.getHoverListener = function () { return hoverListener };
        t.colContentLeft = colContentLeft;
        t.colContentRight = colContentRight;
        t.dayOfWeekCol = dayOfWeekCol;
        t.dateCell = dateCell;
        t.cellDate = cellDate;
        t.cellIsAllDay = function () { return true };
        t.allDayRow = allDayRow;
        t.allDayBounds = allDayBounds;
        t.getRowCnt = function () { return rowCnt };
        t.getColCnt = function () { return colCnt };
        t.getColWidth = function () { return colWidth };
        t.getDaySegmentContainer = function () { return daySegmentContainer };


        // imports
        View.call(t, element, calendar, viewName);
        OverlayManager.call(t);
        SelectionManager.call(t);
        BasicEventRenderer.call(t);
        var opt = t.opt;
        var trigger = t.trigger;
        var clearEvents = t.clearEvents;
        var renderOverlay = t.renderOverlay;
        var clearOverlays = t.clearOverlays;
        var daySelectionMousedown = t.daySelectionMousedown;
        var formatDate = calendar.formatDate;


        // locals

        var head;
        var headCells;
        var body;
        var bodyRows;
        var bodyCells;
        var bodyFirstCells;
        var bodyCellTopInners;
        var daySegmentContainer;

        var viewWidth;
        var viewHeight;
        var colWidth;

        var rowCnt, colCnt;
        var coordinateGrid;
        var hoverListener;
        var colContentPositions;

        var rtl, dis, dit;
        var firstDay;
        var nwe;
        var tm;
        var colFormat;



        /* Rendering
        ------------------------------------------------------------*/


        disableTextSelection(element.addClass('fc-grid'));


        function renderBasic(maxr, r, c, showNumbers) {
            rowCnt = r;
            colCnt = c;
            updateOptions();
            var firstTime = !body;
            if (firstTime) {
                buildSkeleton(maxr, showNumbers);
            } else {
                clearEvents();
            }
            updateCells(firstTime);
        }



        function updateOptions() {
            rtl = opt('isRTL');
            if (rtl) {
                dis = -1;
                dit = colCnt - 1;
            } else {
                dis = 1;
                dit = 0;
            }
            firstDay = opt('firstDay');
            nwe = opt('weekends') ? 0 : 1;
            tm = opt('theme') ? 'ui' : 'fc';
            colFormat = opt('columnFormat');
        }


        //Day columns for Months
        function buildSkeleton(maxRowCnt, showNumbers) {
            var s;
            var headerClass = tm + "-widget-header";
            var contentClass = tm + "-widget-content";
            var i, j;
            var table;
			
			// John Thompson - Added for clickable days

            s =
			"<table class='fc-border-separate' style='width:100%' cellspacing='0'>" +
			"<thead>" +
			"<tr>";
            for (i = 0; i < colCnt; i++) {
                s +=
				"<th class='fc- " + headerClass + "'/>"; // need fc- for setDayID
            }
            s +=
			"</tr>" +
			"</thead>" +
			"<tbody>";
            for (i = 0; i < maxRowCnt; i++) {
                s +=
				"<tr class='fc-week" + i + "'>";
                for (j = 0; j < colCnt; j++) {
                    s +=
					<!-- Day increment. -->
					"<td class='fc- " + contentClass + " fc-day" + (i * colCnt + j) + "'>" + //i + " *  " + colCnt + " * " + j + showNumbers +//<a href='?view=agendaDay&day=" + "'>" + // need fc- for setDayID
					"<div><a href='#' id='fc-eventday'>"  +
					//"<div>"  +
					(showNumbers ? "<div class='fc-day-number'/>" :	'') +
					"</a><div class='fc-day-content'>" +
					"<div style='position:relative'>&nbsp;</div>" +
					"</div>" +
					"</div>" +
					"</td>";
                }
                s +=
				"</tr>";
            }

            s +=
			"</tbody>" +
			"</table>";
            table = $(s).appendTo(element);

            head = table.find('thead');
            headCells = head.find('th');
            body = table.find('tbody');
            bodyRows = body.find('tr');
            bodyCells = body.find('td');
            bodyFirstCells = bodyCells.filter(':first-child');
            bodyCellTopInners = bodyRows.eq(0).find('div.fc-day-content div');

            markFirstLast(head.add(head.find('tr'))); // marks first+last tr/th's
            markFirstLast(bodyRows); // marks first+last td's
            bodyRows.eq(0).addClass('fc-first'); // fc-last is done in updateCells

            dayBind(bodyCells);
			
            daySegmentContainer =
			$("<div style='position:absolute;z-index:8;top:0;left:0'/>")
			
				.appendTo(element);
        }



        function updateCells(firstTime) {
            var dowDirty = firstTime || rowCnt == 1; // could the cells' day-of-weeks need updating?
            var month = t.start.getMonth();
            var today = clearTime(new Date());
            var cell;
            var date;
            var row;

            if (dowDirty) {
                headCells.each(function (i, _cell) {
                    cell = $(_cell);
                    date = indexDate(i);
                    cell.html(formatDate(date, colFormat));
                    setDayID(cell, date);
					
                });
            }

            bodyCells.each(function (i, _cell) {
                cell = $(_cell);
                date = indexDate(i);
                evDate = htmlEscape(formatDate(date, opt('dayFormat', 'day')))
				evDayWeekYear = htmlEscape(formatDate(date, opt('dayFormat', 'dayWeekYear')))
				fceventday = 'fc-eventday' + evDate;
				if (date.getMonth() == month) {
                    cell.removeClass('fc-other-month');
                } else {
                    cell.addClass('fc-other-month');
                }
                if (+date == +today) {
                    cell.addClass(tm + '-state-highlight fc-today');
                } else {
                    cell.removeClass(tm + '-state-highlight fc-today');
                }
                cell.find('div.fc-day-number').text(date.getDate());
				$('#fc-eventday').attr("id", fceventday);
				$('#' + fceventday).attr("href", "?view=agendaDay&agendadate=" + evDate);
				$('#' + fceventday).attr("title", evDayWeekYear);
				if (dowDirty) {
                    setDayID(cell, date);
                }
            });

            bodyRows.each(function (i, _row) {
                row = $(_row);
                if (i < rowCnt) {
                    row.show();
                    if (i == rowCnt - 1) {
                        row.addClass('fc-last');
                    } else {
                        row.removeClass('fc-last');
                    }
                } else {
                    row.hide();
                }
            });
        }



        function setHeight(height) {
            viewHeight = height;

            var bodyHeight = viewHeight - head.height();
            var rowHeight;
            var rowHeightLast;
            var cell;

            if (opt('weekMode') == 'variable') {
                rowHeight = rowHeightLast = Math.floor(bodyHeight / (rowCnt == 1 ? 2 : 6));
            } else {
                rowHeight = Math.floor(bodyHeight / rowCnt);
                rowHeightLast = bodyHeight - rowHeight * (rowCnt - 1);
            }

            bodyFirstCells.each(function (i, _cell) {
                if (i < rowCnt) {
                    cell = $(_cell);
                    setMinHeight(
					cell.find('> div'),
					(i == rowCnt - 1 ? rowHeightLast : rowHeight) - vsides(cell)
				);
                }
            });

        }


        function setWidth(width) {
            viewWidth = width;
            colContentPositions.clear();
            colWidth = Math.floor(viewWidth / colCnt);
            setOuterWidth(headCells.slice(0, -1), colWidth);
        }



        /* Day clicking and binding
        -----------------------------------------------------------*/


        function dayBind(days) {
            days.click(dayClick)
			.mousedown(daySelectionMousedown);
        }


  	function dayClick(ev) {
		if (!opt('selectable')) { // if selectable, SelectionManager will worry about dayClick
			var index = parseInt(this.className.match(/fc\-day(\d+)/)[1]); // TODO: maybe use .data
			var date = indexDate(index);
			
			trigger('dayClick', this, date, true, ev);
		}
	}
	




        /* Semi-transparent Overlay Helpers
        ------------------------------------------------------*/


        function renderDayOverlay(overlayStart, overlayEnd, refreshCoordinateGrid) { // overlayEnd is exclusive
            if (refreshCoordinateGrid) {
                coordinateGrid.build();
            }
            var rowStart = cloneDate(t.visStart);
            var rowEnd = addDays(cloneDate(rowStart), colCnt);
            for (var i = 0; i < rowCnt; i++) {
                var stretchStart = new Date(Math.max(rowStart, overlayStart));
                var stretchEnd = new Date(Math.min(rowEnd, overlayEnd));
                if (stretchStart < stretchEnd) {
                    var colStart, colEnd;
                    if (rtl) {
                        colStart = dayDiff(stretchEnd, rowStart) * dis + dit + 1;
                        colEnd = dayDiff(stretchStart, rowStart) * dis + dit + 1;
                    } else {
                        colStart = dayDiff(stretchStart, rowStart);
                        colEnd = dayDiff(stretchEnd, rowStart);
                    }
                    dayBind(
					renderCellOverlay(i, colStart, i, colEnd - 1)
				);
                }
                addDays(rowStart, 7);
                addDays(rowEnd, 7);
				
            }
        }


        function renderCellOverlay(row0, col0, row1, col1) { // row1,col1 is inclusive
            var rect = coordinateGrid.rect(row0, col0, row1, col1, element);
            return renderOverlay(rect, element);
        }



        /* Selection
        -----------------------------------------------------------------------*/


        function defaultSelectionEnd(startDate, allDay) {
            return cloneDate(startDate);
        }


        function renderSelection(startDate, endDate, allDay) {
            renderDayOverlay(startDate, addDays(cloneDate(endDate), 1), true); // rebuild every time???
        }


        function clearSelection() {
            clearOverlays();
        }


        function reportDayClick(date, allDay, ev) {
            var cell = dateCell(date);
            var _element = bodyCells[cell.row * colCnt + cell.col];
            trigger('dayClick', _element, date, allDay, ev);
        }



        /* External Dragging
        -----------------------------------------------------------------------*/


        function dragStart(_dragElement, ev, ui) {
            hoverListener.start(function (cell) {
                clearOverlays();
                if (cell) {
                    renderCellOverlay(cell.row, cell.col, cell.row, cell.col);
                }
            }, ev);
        }


        function dragStop(_dragElement, ev, ui) {
            var cell = hoverListener.stop();
            clearOverlays();
            if (cell) {
                var d = cellDate(cell);
                trigger('drop', _dragElement, d, true, ev, ui);
            }
        }



        /* Utilities
        --------------------------------------------------------*/


        function defaultEventEnd(event) {
            return cloneDate(event.start);
        }


        coordinateGrid = new CoordinateGrid(function (rows, cols) {
            var e, n, p;
            headCells.each(function (i, _e) {
                e = $(_e);
                n = e.offset().left;
                if (i) {
                    p[1] = n;
                }
                p = [n];
                cols[i] = p;
            });
            p[1] = n + e.outerWidth();
            bodyRows.each(function (i, _e) {
                if (i < rowCnt) {
                    e = $(_e);
                    n = e.offset().top;
                    if (i) {
                        p[1] = n;
                    }
                    p = [n];
                    rows[i] = p;
                }
            });
            p[1] = n + e.outerHeight();
        });


        hoverListener = new HoverListener(coordinateGrid);


        colContentPositions = new HorizontalPositionCache(function (col) {
            return bodyCellTopInners.eq(col);
        });


        function colContentLeft(col) {
            return colContentPositions.left(col);
        }


        function colContentRight(col) {
            return colContentPositions.right(col);
        }




        function dateCell(date) {
            return {
                row: Math.floor(dayDiff(date, t.visStart) / 7),
                col: dayOfWeekCol(date.getDay())
            };
        }


        function cellDate(cell) {
            return _cellDate(cell.row, cell.col);
        }


        function _cellDate(row, col) {
            return addDays(cloneDate(t.visStart), row * 7 + col * dis + dit);
            // what about weekends in middle of week?
        }


        function indexDate(index) {
            return _cellDate(Math.floor(index / colCnt), index % colCnt);
        }


        function dayOfWeekCol(dayOfWeek) {
            return ((dayOfWeek - Math.max(firstDay, nwe) + colCnt) % colCnt) * dis + dit;
        }




        function allDayRow(i) {
            return bodyRows.eq(i);
        }


        function allDayBounds(i) {
            return {
                left: 0,
                right: viewWidth
            };
        }


    }

    function BasicEventRenderer() {
        var t = this;


        // exports
        t.renderEvents = renderEvents;
        t.compileDaySegs = compileSegs; // for DayEventRenderer
        t.clearEvents = clearEvents;
        t.bindDaySeg = bindDaySeg;


        // imports
        DayEventRenderer.call(t);
        var opt = t.opt;
        var trigger = t.trigger;
        //var setOverflowHidden = t.setOverflowHidden;
        var isEventDraggable = t.isEventDraggable;
        var isEventResizable = t.isEventResizable;
        var reportEvents = t.reportEvents;
        var reportEventClear = t.reportEventClear;
        var eventElementHandlers = t.eventElementHandlers;
        var showEvents = t.showEvents;
        var hideEvents = t.hideEvents;
        var eventDrop = t.eventDrop;
        var getDaySegmentContainer = t.getDaySegmentContainer;
        var getHoverListener = t.getHoverListener;
        var renderDayOverlay = t.renderDayOverlay;
        var clearOverlays = t.clearOverlays;
        var getRowCnt = t.getRowCnt;
        var getColCnt = t.getColCnt;
        var renderDaySegs = t.renderDaySegs;
        var resizableDayEvent = t.resizableDayEvent;




        /* Rendering
        --------------------------------------------------------------------*/


        function renderEvents(events, modifiedEventId) {
            reportEvents(events);
            renderDaySegs(compileSegs(events), modifiedEventId);
        }


        function clearEvents() {
            reportEventClear();
            getDaySegmentContainer().empty();
        }


        function compileSegs(events) {
            var rowCnt = getRowCnt(),
			colCnt = getColCnt(),
			d1 = cloneDate(t.visStart),
			d2 = addDays(cloneDate(d1), colCnt),
			visEventsEnds = $.map(events, exclEndDay),
			i, row,
			j, level,
			k, seg,
			segs = [];
            for (i = 0; i < rowCnt; i++) {
                row = stackSegs(sliceSegs(events, visEventsEnds, d1, d2));
                for (j = 0; j < row.length; j++) {
                    level = row[j];
                    for (k = 0; k < level.length; k++) {
                        seg = level[k];
                        seg.row = i;
                        seg.level = j; // not needed anymore
                        segs.push(seg);
                    }
                }
                addDays(d1, 7);
                addDays(d2, 7);
            }
            return segs;
        }


        function bindDaySeg(event, eventElement, seg) {
            if (isEventDraggable(event)) {
                draggableDayEvent(event, eventElement);
            }
            if (seg.isEnd && isEventResizable(event)) {
                resizableDayEvent(event, eventElement, seg);
            }
            eventElementHandlers(event, eventElement);
            // needs to be after, because resizableDayEvent might stopImmediatePropagation on click
        }



        /* Dragging
        ----------------------------------------------------------------------------*/


        function draggableDayEvent(event, eventElement) {
            var hoverListener = getHoverListener();
            var dayDelta;
            eventElement.draggable({
                zIndex: 9,
                delay: 50,
                opacity: opt('dragOpacity'),
                revertDuration: opt('dragRevertDuration'),
                start: function (ev, ui) {
                    trigger('eventDragStart', eventElement, event, ev, ui);
                    hideEvents(event, eventElement);
                    hoverListener.start(function (cell, origCell, rowDelta, colDelta) {
                        eventElement.draggable('option', 'revert', !cell || !rowDelta && !colDelta);
                        clearOverlays();
                        if (cell) {
                            //setOverflowHidden(true);
                            dayDelta = rowDelta * 7 + colDelta * (opt('isRTL') ? -1 : 1);
                            renderDayOverlay(
							addDays(cloneDate(event.start), dayDelta),
							addDays(exclEndDay(event), dayDelta)
						);
                        } else {
                            //setOverflowHidden(false);
                            dayDelta = 0;
                        }
                    }, ev, 'drag');
                },
                stop: function (ev, ui) {
                    hoverListener.stop();
                    clearOverlays();
                    trigger('eventDragStop', eventElement, event, ev, ui);
                    if (dayDelta) {
                        eventDrop(this, event, dayDelta, 0, event.allDay, ev, ui);
                    } else {
                        eventElement.css('filter', ''); // clear IE opacity side-effects
                        showEvents(event, eventElement);
                    }
                    //setOverflowHidden(false);
                }
            });
        }


    }

    fcViews.agendaWeek = AgendaWeekView;

    function AgendaWeekView(element, calendar) {
        var t = this;


        // exports
        t.render = render;


        // imports
        AgendaView.call(t, element, calendar, 'agendaWeek');
        var opt = t.opt;
        var renderAgenda = t.renderAgenda;
        var formatDates = calendar.formatDates;



        function render(date, delta) {
            if (delta) {
                addDays(date, delta * 7);
            }
            var start = addDays(cloneDate(date), -((date.getDay() - opt('firstDay') + 7) % 7));
            var end = addDays(cloneDate(start), 7);
            var visStart = cloneDate(start);
            var visEnd = cloneDate(end);
            var weekends = opt('weekends');
            if (!weekends) {
                skipWeekend(visStart);
                skipWeekend(visEnd, -1, true);
            }
            t.title = formatDates(
			visStart,
			addDays(cloneDate(visEnd), -1),
			opt('titleFormat')
		);
            t.start = start;
            t.end = end;
            t.visStart = visStart;
            t.visEnd = visEnd;
            renderAgenda(weekends ? 7 : 5);
        }


    }

    fcViews.agendaDay = AgendaDayView;

    function AgendaDayView(element, calendar) {
        var t = this;


        // exports
        t.render = render;


        // imports
        AgendaView.call(t, element, calendar, 'agendaDay');
        
		var opt = t.opt;
        var renderAgenda = t.renderAgenda;
        var formatDate = calendar.formatDate;

			
		
        function render(date, delta) {
			if (delta) {
                addDays(date, delta);
                if (!opt('weekends')) {
                    skipWeekend(date, delta < 0 ? -1 : 1);
                }
            }
            var start = cloneDate(date, true);
            var end = addDays(cloneDate(start), 1);
            t.title = formatDate(date, opt('titleFormat'));
            t.start = t.visStart = start;
            t.end = t.visEnd = end;
            renderAgenda(1);
        }


    }

    setDefaults({
        allDaySlot: true,
        allDayText: 'all-day',
        firstHour: 6,
        slotMinutes: 30,
        defaultEventMinutes: 120,
        axisFormat: 'h(:mm)tt',
        timeFormat: {
            agenda: 'h:mm{ - h:mm}tt'
        },
        dragOpacity: {
            agenda: .5
        },
        minTime: 0,
        maxTime: 24
    });


    // TODO: make it work in quirks mode (event corners, all-day height)
    // TODO: test liquid width, especially in IE6


    function AgendaView(element, calendar, viewName) {
        var t = this;

			
        // exports
        t.renderAgenda = renderAgenda;
        t.setWidth = setWidth;
        t.setHeight = setHeight;
        t.beforeHide = beforeHide;
        t.afterShow = afterShow;
        t.defaultEventEnd = defaultEventEnd;
        t.timePosition = timePosition;
        t.dayOfWeekCol = dayOfWeekCol;
        t.dateCell = dateCell;
        t.cellDate = cellDate;
        t.cellIsAllDay = cellIsAllDay;
        t.allDayRow = getAllDayRow;
        t.allDayBounds = allDayBounds;
        t.getHoverListener = function () { return hoverListener };
        t.colContentLeft = colContentLeft;
        t.colContentRight = colContentRight;
        t.getDaySegmentContainer = function () { return daySegmentContainer };
        t.getSlotSegmentContainer = function () { return slotSegmentContainer };
        t.getMinMinute = function () { return minMinute };
        t.getMaxMinute = function () { return maxMinute };
        t.getBodyContent = function () { return slotContent }; // !!??
        t.getRowCnt = function () { return 1 };
        t.getColCnt = function () { return colCnt };
        t.getColWidth = function () { return colWidth };
        t.getSlotHeight = function () { return slotHeight };
        t.defaultSelectionEnd = defaultSelectionEnd;
        t.renderDayOverlay = renderDayOverlay;
        t.renderSelection = renderSelection;
        t.clearSelection = clearSelection;
        t.reportDayClick = reportDayClick; // selection mousedown hack
        t.dragStart = dragStart;
        t.dragStop = dragStop;


        // imports
        View.call(t, element, calendar, viewName);
        OverlayManager.call(t);
        SelectionManager.call(t);
        AgendaEventRenderer.call(t);
        var opt = t.opt;
        var trigger = t.trigger;
        var clearEvents = t.clearEvents;
        var renderOverlay = t.renderOverlay;
        var clearOverlays = t.clearOverlays;
        var reportSelection = t.reportSelection;
        var unselect = t.unselect;
        var daySelectionMousedown = t.daySelectionMousedown;
        var slotSegHtml = t.slotSegHtml;
        var formatDate = calendar.formatDate;

		
        // locals

        var dayTable;
        var dayHead;
        var dayHeadCells;
        var dayBody;
        var dayBodyCells;
        var dayBodyCellInners;
        var dayBodyFirstCell;
        var dayBodyFirstCellStretcher;
        var slotLayer;
        var daySegmentContainer;
        var allDayTable;
        var allDayRow;
        var slotScroller;
        var slotContent;
        var slotSegmentContainer;
        var slotTable;
        var slotTableFirstInner;
        var axisFirstCells;
        var gutterCells;
        var selectionHelper;

        var viewWidth;
        var viewHeight;
        var axisWidth;
        var colWidth;
        var gutterWidth;
        var slotHeight; // TODO: what if slotHeight changes? (see issue 650)
        var savedScrollTop;

        var colCnt;
        var slotCnt;
        var coordinateGrid;
        var hoverListener;
        var colContentPositions;
        var slotTopCache = {};

        var tm;
        var firstDay;
        var nwe;            // no weekends (int)
        var rtl, dis, dit;  // day index sign / translate
        var minMinute, maxMinute;
        var colFormat;



        /* Rendering
        -----------------------------------------------------------------------------*/


        disableTextSelection(element.addClass('fc-agenda'));


        function renderAgenda(c) {
            colCnt = c;
            updateOptions();
            if (!dayTable) {
                buildSkeleton();
            } else {
                clearEvents();
            }
            updateCells();
        }



        function updateOptions() {
            tm = opt('theme') ? 'ui' : 'fc';
            nwe = opt('weekends') ? 0 : 1;
            firstDay = opt('firstDay');
            if (rtl = opt('isRTL')) {
                dis = -1;
                dit = colCnt - 1;
            } else {
                dis = 1;
                dit = 0;
            }
            minMinute = parseTime(opt('minTime'));
            maxMinute = parseTime(opt('maxTime'));
            colFormat = opt('columnFormat');
        }


        //Outter Table of the Calendar
        function buildSkeleton() {
            var headerClass = tm + "-widget-header";
            var contentClass = tm + "-widget-content";
            var s;
            var i;
            var d;
            var maxd;
            var minutes;
            var slotNormal = opt('slotMinutes') % 15 == 0;

            s =
			"<table style='width:100%' class='fc-agenda-days fc-border-separate' cellspacing='0'>" +
			"<thead>" +
			"<tr>" +
			"<th class='fc-agenda-axis " + headerClass + "'>&nbsp;</th>";
            for (i = 0; i < colCnt; i++) {
                s +=
				"<th class='fc- fc-col" + i + ' ' + headerClass + "'/>"; // fc- needed for setDayID
            }
            s +=
			"<th class='fc-agenda-gutter " + headerClass + "'>&nbsp;</th>" +
			"</tr>" +
			"</thead>" +
			"<tbody>" +
			"<tr>" +
			"<th class='fc-agenda-axis " + headerClass + "'>&nbsp;</th>";
            for (i = 0; i < colCnt; i++) {
                s +=
				"<td class='fc- fc-col" + i + ' ' + contentClass + "'>" + // fc- needed for setDayID
				"<div>" +
				"<div class='fc-day-content'>" +
				"<div style='position:relative'>&nbsp;</div>" +
				"</div>" +
				"</div>" +
				"</td>";
            }
            s +=
			"<td class='fc-agenda-gutter " + contentClass + "'>&nbsp;</td>" +
			"</tr>" +
			"</tbody>" +
			"</table>";
            dayTable = $(s).appendTo(element);
            dayHead = dayTable.find('thead');
            dayHeadCells = dayHead.find('th').slice(1, -1);
            dayBody = dayTable.find('tbody');
            dayBodyCells = dayBody.find('td').slice(0, -1);
            dayBodyCellInners = dayBodyCells.find('div.fc-day-content div');
            dayBodyFirstCell = dayBodyCells.eq(0);
            dayBodyFirstCellStretcher = dayBodyFirstCell.find('> div');

            markFirstLast(dayHead.add(dayHead.find('tr')));
            markFirstLast(dayBody.add(dayBody.find('tr')));

            axisFirstCells = dayHead.find('th:first');
            gutterCells = dayTable.find('.fc-agenda-gutter');

            slotLayer =
			$("<div style='position:absolute;z-index:2;left:0;width:100%'/>")
				.appendTo(element);

            if (opt('allDaySlot')) {

                daySegmentContainer =
				$("<div style='position:absolute;z-index:8;top:0;left:0'/>")
					.appendTo(slotLayer);

                s =
				"<table style='width:100%' class='fc-agenda-allday' cellspacing='0'>" +
				"<tr>" +
				"<th class='" + headerClass + " fc-agenda-axis'>" + opt('allDayText') + "</th>" +
				"<td>" +
				"<div class='fc-day-content'><div style='position:relative'/></div>" +
				"</td>" +
				"<th class='" + headerClass + " fc-agenda-gutter'>&nbsp;</th>" +
				"</tr>" +
				"</table>";
				
                allDayTable = $(s).appendTo(slotLayer);
                allDayRow = allDayTable.find('tr');

                dayBind(allDayRow.find('td'));

                axisFirstCells = axisFirstCells.add(allDayTable.find('th:first'));	
                gutterCells = gutterCells.add(allDayTable.find('th.fc-agenda-gutter'));

                slotLayer.append(
				"<div class='fc-agenda-divider " + headerClass + "'>" +
				"<div class='fc-agenda-divider-inner'/>" +
				"</div>"
			);

            } else {

                daySegmentContainer = $([]); // in jQuery 1.4, we can just do $()

            }

            slotScroller =
			$("<div style='position:absolute;width:100%;overflow-x:hidden;overflow-y:auto'/>")
				.appendTo(slotLayer);

            slotContent =
			$("<div style='position:relative;width:100%;overflow:hidden'/>")
				.appendTo(slotScroller);

            slotSegmentContainer =
			$("<div style='position:absolute;z-index:8;top:0;left:0'/>")
				.appendTo(slotContent);

            s =
			"<table class='fc-agenda-slots' style='width:100%' cellspacing='0'>" +
			"<tbody>";
            d = zeroDate();
            maxd = addMinutes(cloneDate(d), maxMinute);
            addMinutes(d, minMinute);
            slotCnt = 0;
            for (i = 0; d < maxd; i++) {
                minutes = d.getMinutes();
                s +=
				"<tr class='fc-slot" + i + ' ' + (!minutes ? '' : 'fc-minor') + "'>" +
				"<th class='fc-agenda-axis " + headerClass + "'>" +
				((!slotNormal || !minutes) ? formatDate(d, opt('axisFormat')) : '&nbsp;') +
				"</th>" +
				"<td class='" + contentClass + "'>" +
				"<div style='position:relative'>&nbsp;</div>" +
				"</td>" +
				"</tr>";
                addMinutes(d, opt('slotMinutes'));
                slotCnt++;
            }
            s +=
			"</tbody>" +
			"</table>";
            slotTable = $(s).appendTo(slotContent);
            slotTableFirstInner = slotTable.find('div:first');

            slotBind(slotTable.find('td'));

            axisFirstCells = axisFirstCells.add(slotTable.find('th:first'));
        }



        function updateCells() {
            var i;
            var headCell;
            var bodyCell;
            var date;
            var today = clearTime(new Date());
            for (i = 0; i < colCnt; i++) {
                date = colDate(i);
                headCell = dayHeadCells.eq(i);
                headCell.html(formatDate(date, colFormat));
                bodyCell = dayBodyCells.eq(i);
                if (+date == +today) {
                    bodyCell.addClass(tm + '-state-highlight fc-today');
                } else {
                    bodyCell.removeClass(tm + '-state-highlight fc-today');
                }
                setDayID(headCell.add(bodyCell), date);
            }
        }



        function setHeight(height, dateChanged) {
            if (height === undefined) {
                height = viewHeight;
            }
            viewHeight = height;
            slotTopCache = {};

            var headHeight = dayBody.position().top;
            var allDayHeight = slotScroller.position().top; // including divider
            var bodyHeight = Math.min( // total body height, including borders
			height - headHeight,   // when scrollbars
			slotTable.height() + allDayHeight + 1 // when no scrollbars. +1 for bottom border
		);

            dayBodyFirstCellStretcher
			.height(bodyHeight - vsides(dayBodyFirstCell));

            slotLayer.css('top', headHeight);

            slotScroller.height(bodyHeight - allDayHeight - 1);

            slotHeight = slotTableFirstInner.height() + 1; // +1 for border

            if (dateChanged) {
                resetScroll();
            }
        }



        function setWidth(width) {
            viewWidth = width;
            colContentPositions.clear();

            axisWidth = 0;
            setOuterWidth(
			axisFirstCells
				.width('')
				.each(function (i, _cell) {
				    axisWidth = Math.max(axisWidth, $(_cell).outerWidth());
				}),
			axisWidth
		);

            var slotTableWidth = slotScroller[0].clientWidth; // needs to be done after axisWidth (for IE7)
            //slotTable.width(slotTableWidth);

            gutterWidth = slotScroller.width() - slotTableWidth;
            if (gutterWidth) {
                setOuterWidth(gutterCells, gutterWidth);
                gutterCells
				.show()
				.prev()
				.removeClass('fc-last');
            } else {
                gutterCells
				.hide()
				.prev()
				.addClass('fc-last');
            }

            colWidth = Math.floor((slotTableWidth - axisWidth) / colCnt);
            setOuterWidth(dayHeadCells.slice(0, -1), colWidth);
        }



        function resetScroll() {
            var d0 = zeroDate();
            var scrollDate = cloneDate(d0);
            scrollDate.setHours(opt('firstHour'));
            var top = timePosition(d0, scrollDate) + 1; // +1 for the border
            function scroll() {
                slotScroller.scrollTop(top);
            }
            scroll();
            setTimeout(scroll, 0); // overrides any previous scroll state made by the browser
        }


        function beforeHide() {
            savedScrollTop = slotScroller.scrollTop();
        }


        function afterShow() {
            slotScroller.scrollTop(savedScrollTop);
        }



        /* Slot/Day clicking and binding
        -----------------------------------------------------------------------*/


        function dayBind(cells) {
            cells.click(slotClick)
			.mousedown(daySelectionMousedown);
        }


        function slotBind(cells) {
            cells.click(slotClick)
			.mousedown(slotSelectionMousedown);
        }


        function slotClick(ev) {
            if (!opt('selectable')) { // if selectable, SelectionManager will worry about dayClick
                var col = Math.min(colCnt - 1, Math.floor((ev.pageX - dayTable.offset().left - axisWidth) / colWidth));
                var date = colDate(col);
                var rowMatch = this.parentNode.className.match(/fc-slot(\d+)/); // TODO: maybe use data
                if (rowMatch) {
                    var mins = parseInt(rowMatch[1]) * opt('slotMinutes');
                    var hours = Math.floor(mins / 60);
                    date.setHours(hours);
                    date.setMinutes(mins % 60 + minMinute);
                    trigger('dayClick', dayBodyCells[col], date, false, ev);
                } else {
                    trigger('dayClick', dayBodyCells[col], date, true, ev);
                }
            }
        }



        /* Semi-transparent Overlay Helpers
        -----------------------------------------------------*/


        function renderDayOverlay(startDate, endDate, refreshCoordinateGrid) { // endDate is exclusive
            if (refreshCoordinateGrid) {
                coordinateGrid.build();
            }
            var visStart = cloneDate(t.visStart);
            var startCol, endCol;
            if (rtl) {
                startCol = dayDiff(endDate, visStart) * dis + dit + 1;
                endCol = dayDiff(startDate, visStart) * dis + dit + 1;
            } else {
                startCol = dayDiff(startDate, visStart);
                endCol = dayDiff(endDate, visStart);
            }
            startCol = Math.max(0, startCol);
            endCol = Math.min(colCnt, endCol);
            if (startCol < endCol) {
                dayBind(
				renderCellOverlay(0, startCol, 0, endCol - 1)
			);
            }
        }


        function renderCellOverlay(row0, col0, row1, col1) { // only for all-day?
            var rect = coordinateGrid.rect(row0, col0, row1, col1, slotLayer);
            return renderOverlay(rect, slotLayer);
        }


        function renderSlotOverlay(overlayStart, overlayEnd) {
            var dayStart = cloneDate(t.visStart);
            var dayEnd = addDays(cloneDate(dayStart), 1);
            for (var i = 0; i < colCnt; i++) {
                var stretchStart = new Date(Math.max(dayStart, overlayStart));
                var stretchEnd = new Date(Math.min(dayEnd, overlayEnd));
                if (stretchStart < stretchEnd) {
                    var col = i * dis + dit;
                    var rect = coordinateGrid.rect(0, col, 0, col, slotContent); // only use it for horizontal coords
                    var top = timePosition(dayStart, stretchStart);
                    var bottom = timePosition(dayStart, stretchEnd);
                    rect.top = top;
                    rect.height = bottom - top;
                    slotBind(
					renderOverlay(rect, slotContent)
				);
                }
                addDays(dayStart, 1);
                addDays(dayEnd, 1);
            }
        }



        /* Coordinate Utilities
        -----------------------------------------------------------------------------*/


        coordinateGrid = new CoordinateGrid(function (rows, cols) {
            var e, n, p;
            dayHeadCells.each(function (i, _e) {
                e = $(_e);
                n = e.offset().left;
                if (i) {
                    p[1] = n;
                }
                p = [n];
                cols[i] = p;
            });
            p[1] = n + e.outerWidth();
            if (opt('allDaySlot')) {
                e = allDayRow;
                n = e.offset().top;
                rows[0] = [n, n + e.outerHeight()];
            }
            var slotTableTop = slotContent.offset().top;
            var slotScrollerTop = slotScroller.offset().top;
            var slotScrollerBottom = slotScrollerTop + slotScroller.outerHeight();
            function constrain(n) {
                return Math.max(slotScrollerTop, Math.min(slotScrollerBottom, n));
            }
            for (var i = 0; i < slotCnt; i++) {
                rows.push([
				constrain(slotTableTop + slotHeight * i),
				constrain(slotTableTop + slotHeight * (i + 1))
			]);
            }
        });


        hoverListener = new HoverListener(coordinateGrid);


        colContentPositions = new HorizontalPositionCache(function (col) {
            return dayBodyCellInners.eq(col);
        });


        function colContentLeft(col) {
            return colContentPositions.left(col);
        }


        function colContentRight(col) {
            return colContentPositions.right(col);
        }




        function dateCell(date) { // "cell" terminology is now confusing
            return {
                row: Math.floor(dayDiff(date, t.visStart) / 7),
                col: dayOfWeekCol(date.getDay())
            };
        }


        function cellDate(cell) {
            var d = colDate(cell.col);
            var slotIndex = cell.row;
            if (opt('allDaySlot')) {
                slotIndex--;
            }
            if (slotIndex >= 0) {
                addMinutes(d, minMinute + slotIndex * opt('slotMinutes'));
            }
            return d;
        }


        function colDate(col) { // returns dates with 00:00:00
            return addDays(cloneDate(t.visStart), col * dis + dit);
        }


        function cellIsAllDay(cell) {
            return opt('allDaySlot') && !cell.row;
        }


        function dayOfWeekCol(dayOfWeek) {
            return ((dayOfWeek - Math.max(firstDay, nwe) + colCnt) % colCnt) * dis + dit;
        }




        // get the Y coordinate of the given time on the given day (both Date objects)
        function timePosition(day, time) { // both date objects. day holds 00:00 of current day
            day = cloneDate(day, true);
            if (time < addMinutes(cloneDate(day), minMinute)) {
                return 0;
            }
            if (time >= addMinutes(cloneDate(day), maxMinute)) {
                return slotTable.height();
            }
            var slotMinutes = opt('slotMinutes'),
			minutes = time.getHours() * 60 + time.getMinutes() - minMinute,
			slotI = Math.floor(minutes / slotMinutes),
			slotTop = slotTopCache[slotI];
            if (slotTop === undefined) {
                slotTop = slotTopCache[slotI] = slotTable.find('tr:eq(' + slotI + ') td div')[0].offsetTop; //.position().top; // need this optimization???
            }
            return Math.max(0, Math.round(
			slotTop - 1 + slotHeight * ((minutes % slotMinutes) / slotMinutes)
		));
        }


        function allDayBounds() {
            return {
                left: axisWidth,
                right: viewWidth - gutterWidth
            }
        }


        function getAllDayRow(index) {
            return allDayRow;
        }


        function defaultEventEnd(event) {
            var start = cloneDate(event.start);
            if (event.allDay) {
                return start;
            }
            return addMinutes(start, opt('defaultEventMinutes'));
        }



        /* Selection
        ---------------------------------------------------------------------------------*/


        function defaultSelectionEnd(startDate, allDay) {
            if (allDay) {
                return cloneDate(startDate);
            }
            return addMinutes(cloneDate(startDate), opt('slotMinutes'));
        }


        function renderSelection(startDate, endDate, allDay) { // only for all-day
            if (allDay) {
                if (opt('allDaySlot')) {
                    renderDayOverlay(startDate, addDays(cloneDate(endDate), 1), true);
                }
            } else {
                renderSlotSelection(startDate, endDate);
            }
        }


        function renderSlotSelection(startDate, endDate) {
            var helperOption = opt('selectHelper');
            coordinateGrid.build();
            if (helperOption) {
                var col = dayDiff(startDate, t.visStart) * dis + dit;
                if (col >= 0 && col < colCnt) { // only works when times are on same day
                    var rect = coordinateGrid.rect(0, col, 0, col, slotContent); // only for horizontal coords
                    var top = timePosition(startDate, startDate);
                    var bottom = timePosition(startDate, endDate);
                    if (bottom > top) { // protect against selections that are entirely before or after visible range
                        rect.top = top;
                        rect.height = bottom - top;
                        rect.left += 2;
                        rect.width -= 5;
                        if ($.isFunction(helperOption)) {
                            var helperRes = helperOption(startDate, endDate);
                            if (helperRes) {
                                rect.position = 'absolute';
                                rect.zIndex = 8;
                                selectionHelper = $(helperRes)
								.css(rect)
								.appendTo(slotContent);
                            }
                        } else {
                            rect.isStart = true; // conside rect a "seg" now
                            rect.isEnd = true;   //
                            selectionHelper = $(slotSegHtml(
							{
							    title: '',
							    start: startDate,
							    end: endDate,
							    className: ['fc-select-helper'],
							    editable: false
							},
							rect
						));
                            selectionHelper.css('opacity', opt('dragOpacity'));
                        }
                        if (selectionHelper) {
                            slotBind(selectionHelper);
                            slotContent.append(selectionHelper);
                            setOuterWidth(selectionHelper, rect.width, true); // needs to be after appended
                            setOuterHeight(selectionHelper, rect.height, true);
                        }
                    }
                }
            } else {
                renderSlotOverlay(startDate, endDate);
            }
        }


        function clearSelection() {
            clearOverlays();
            if (selectionHelper) {
                selectionHelper.remove();
                selectionHelper = null;
            }
        }


        function slotSelectionMousedown(ev) {
            if (ev.which == 1 && opt('selectable')) { // ev.which==1 means left mouse button
                unselect(ev);
                var dates;
                hoverListener.start(function (cell, origCell) {
                    clearSelection();
                    if (cell && cell.col == origCell.col && !cellIsAllDay(cell)) {
                        var d1 = cellDate(origCell);
                        var d2 = cellDate(cell);
                        dates = [
						d1,
						addMinutes(cloneDate(d1), opt('slotMinutes')),
						d2,
						addMinutes(cloneDate(d2), opt('slotMinutes'))
					].sort(cmp);
                        renderSlotSelection(dates[0], dates[3]);
                    } else {
                        dates = null;
                    }
                }, ev);
                $(document).one('mouseup', function (ev) {
                    hoverListener.stop();
                    if (dates) {
                        if (+dates[0] == +dates[1]) {
                            reportDayClick(dates[0], false, ev);
                        }
                        reportSelection(dates[0], dates[3], false, ev);
                    }
                });
            }
        }


        function reportDayClick(date, allDay, ev) {
            trigger('dayClick', dayBodyCells[dayOfWeekCol(date.getDay())], date, allDay, ev);
        }



        /* External Dragging
        --------------------------------------------------------------------------------*/


        function dragStart(_dragElement, ev, ui) {
            hoverListener.start(function (cell) {
                clearOverlays();
                if (cell) {
                    if (cellIsAllDay(cell)) {
                        renderCellOverlay(cell.row, cell.col, cell.row, cell.col);
                    } else {
                        var d1 = cellDate(cell);
                        var d2 = addMinutes(cloneDate(d1), opt('defaultEventMinutes'));
                        renderSlotOverlay(d1, d2);
                    }
                }
            }, ev);
        }


        function dragStop(_dragElement, ev, ui) {
            var cell = hoverListener.stop();
            clearOverlays();
            if (cell) {
                trigger('drop', _dragElement, cellDate(cell), cellIsAllDay(cell), ev, ui);
            }
        }


    }

    function AgendaEventRenderer() {
        var t = this;


        // exports
        t.renderEvents = renderEvents;
        t.compileDaySegs = compileDaySegs; // for DayEventRenderer
        t.clearEvents = clearEvents;
        t.slotSegHtml = slotSegHtml;
        t.bindDaySeg = bindDaySeg;


        // imports
        DayEventRenderer.call(t);
        var opt = t.opt;
        var trigger = t.trigger;
        //var setOverflowHidden = t.setOverflowHidden;
        var isEventDraggable = t.isEventDraggable;
        var isEventResizable = t.isEventResizable;
        var eventEnd = t.eventEnd;
        var reportEvents = t.reportEvents;
        var reportEventClear = t.reportEventClear;
        var eventElementHandlers = t.eventElementHandlers;
        var setHeight = t.setHeight;
        var getDaySegmentContainer = t.getDaySegmentContainer;
        var getSlotSegmentContainer = t.getSlotSegmentContainer;
        var getHoverListener = t.getHoverListener;
        var getMaxMinute = t.getMaxMinute;
        var getMinMinute = t.getMinMinute;
        var timePosition = t.timePosition;
        var colContentLeft = t.colContentLeft;
        var colContentRight = t.colContentRight;
        var renderDaySegs = t.renderDaySegs;
        var resizableDayEvent = t.resizableDayEvent; // TODO: streamline binding architecture
        var getColCnt = t.getColCnt;
        var getColWidth = t.getColWidth;
        var getSlotHeight = t.getSlotHeight;
        var getBodyContent = t.getBodyContent;
        var reportEventElement = t.reportEventElement;
        var showEvents = t.showEvents;
        var hideEvents = t.hideEvents;
        var eventDrop = t.eventDrop;
        var eventResize = t.eventResize;
        var renderDayOverlay = t.renderDayOverlay;
        var clearOverlays = t.clearOverlays;
        var calendar = t.calendar;
        var formatDate = calendar.formatDate;
        var formatDates = calendar.formatDates;



        /* Rendering
        ----------------------------------------------------------------------------*/


        function renderEvents(events, modifiedEventId) {
            reportEvents(events);
            var i, len = events.length,
			dayEvents = [],
			slotEvents = [];
            for (i = 0; i < len; i++) {
                if (events[i].allDay) {
                    dayEvents.push(events[i]);
                } else {
                    slotEvents.push(events[i]);
                }
            }
            if (opt('allDaySlot')) {
                renderDaySegs(compileDaySegs(dayEvents), modifiedEventId);
                setHeight(); // no params means set to viewHeight
            }
            renderSlotSegs(compileSlotSegs(slotEvents), modifiedEventId);
        }


        function clearEvents() {
            reportEventClear();
            getDaySegmentContainer().empty();
            getSlotSegmentContainer().empty();
        }


        function compileDaySegs(events) {
            var levels = stackSegs(sliceSegs(events, $.map(events, exclEndDay), t.visStart, t.visEnd)),
			i, levelCnt = levels.length, level,
			j, seg,
			segs = [];
            for (i = 0; i < levelCnt; i++) {
                level = levels[i];
                for (j = 0; j < level.length; j++) {
                    seg = level[j];
                    seg.row = 0;
                    seg.level = i; // not needed anymore
                    segs.push(seg);
                }
            }
            return segs;
        }


        function compileSlotSegs(events) {
            var colCnt = getColCnt(),
			minMinute = getMinMinute(),
			maxMinute = getMaxMinute(),
			d = addMinutes(cloneDate(t.visStart), minMinute),
			visEventEnds = $.map(events, slotEventEnd),
			i, col,
			j, level,
			k, seg,
			segs = [];
            for (i = 0; i < colCnt; i++) {
                col = stackSegs(sliceSegs(events, visEventEnds, d, addMinutes(cloneDate(d), maxMinute - minMinute)));
                countForwardSegs(col);
                for (j = 0; j < col.length; j++) {
                    level = col[j];
                    for (k = 0; k < level.length; k++) {
                        seg = level[k];
                        seg.col = i;
                        seg.level = j;
                        segs.push(seg);
                    }
                }
                addDays(d, 1, true);
            }
            return segs;
        }


        function slotEventEnd(event) {
            if (event.end) {
                return cloneDate(event.end);
            } else {
                return addMinutes(cloneDate(event.start), opt('defaultEventMinutes'));
            }
        }


        // renders events in the 'time slots' at the bottom

        function renderSlotSegs(segs, modifiedEventId) {
            var i, segCnt = segs.length, seg,
			event,
			classes,
			top, bottom,
			colI, levelI, forward,
			leftmost,
			availWidth,
			outerWidth,
			left,
			html = '',
			eventElements,
			eventElement,
			triggerRes,
			vsideCache = {},
			hsideCache = {},
			key, val,
			contentElement,
			height,
			slotSegmentContainer = getSlotSegmentContainer(),
			rtl, dis, dit,
			colCnt = getColCnt();
            var eventListingText = "<ul>";

            if (rtl = opt('isRTL')) {
                dis = -1;
                dit = colCnt - 1;
            } else {
                dis = 1;
                dit = 0;
            }
            $("#meDayListing").addClass("meEventListing");

            // calculate position/dimensions, create html
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                event = seg.event;
                top = timePosition(seg.start, seg.start);
                bottom = timePosition(seg.start, seg.end);
                colI = seg.col;
                levelI = seg.level;
                forward = seg.forward || 0;
                leftmost = colContentLeft(colI * dis + dit);
                availWidth = colContentRight(colI * dis + dit) - leftmost;
                availWidth = Math.min(availWidth - 6, availWidth * .95); // TODO: move this to CSS
                if (levelI) {
                    // indented and thin
                    outerWidth = availWidth / (levelI + forward + 1);
                } else {
                    if (forward) {
                        // moderately wide, aligned left still
                        outerWidth = ((availWidth / (forward + 1)) - (12 / 2)) * 2; // 12 is the predicted width of resizer =
                    } else {
                        // can be entire width, aligned left
                        outerWidth = availWidth;
                    }
                }
                left = leftmost +                                  // leftmost possible
				(availWidth / (levelI + forward + 1) * levelI) // indentation
				* dis + (rtl ? availWidth - outerWidth : 0);   // rtl
                seg.top = top;
                seg.left = left;
                seg.outerWidth = outerWidth;
                seg.outerHeight = bottom - top;
                eventListingText += slotSegHtml2(event, seg);
                html += slotSegHtml(event, seg);
            }
            eventListingText += "</ul>";
           	$("#meDayListing").html(eventListingText);
            slotSegmentContainer[0].innerHTML = html; // faster than html()
            eventElements = slotSegmentContainer.children();

            // retrieve elements, run through eventRender callback, bind event handlers
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                event = seg.event;
                eventElement = $(eventElements[i]); // faster than eq()
                triggerRes = trigger('eventRender', event, event, eventElement);
				if (triggerRes === false) {
                    eventElement.remove();
                } else {
                    if (triggerRes && triggerRes !== true) {
                        eventElement.remove();
                        eventElement = $(triggerRes)
						.css({
						    position: 'absolute',
						    top: seg.top,
						    left: seg.left
						})
						.appendTo(slotSegmentContainer);
                    }
                    seg.element = eventElement;
                    if (event._id === modifiedEventId) {
                        bindSlotSeg(event, eventElement, seg);
                    } else {
                        eventElement[0]._fci = i; // for lazySegBind
                    }
                    reportEventElement(event, eventElement);
                }
            }

            lazySegBind(slotSegmentContainer, segs, bindSlotSeg);

            // record event sides and title positions
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                if (eventElement = seg.element) {
                    val = vsideCache[key = seg.key = cssKey(eventElement[0])];
                    seg.vsides = val === undefined ? (vsideCache[key] = vsides(eventElement, true)) : val;
                    val = hsideCache[key];
                    seg.hsides = val === undefined ? (hsideCache[key] = hsides(eventElement, true)) : val;
                    contentElement = eventElement.find('div.fc-event-content');
                    if (contentElement.length) {
                        seg.contentTop = contentElement[0].offsetTop;
                    }
                }
            }

            // set all positions/dimensions at once
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                if (eventElement = seg.element) {
                    eventElement[0].style.width = Math.max(0, seg.outerWidth - seg.hsides) + 'px';
                    height = Math.max(0, seg.outerHeight - seg.vsides);
                    eventElement[0].style.height = height + 'px';
                    event = seg.event;
                    if (seg.contentTop !== undefined && height - seg.contentTop < 10) {
                        // not enough room for title, put it in the time header
                        eventElement.find('div.fc-event-time')
						.text(formatDate(event.start, opt('timeFormat')) + ' - ' + formatDate(event.end, opt('timeFormat')) + ' ' + event.title);
                        eventElement.find('div.fc-event-title')
						.remove();
                    }
                    trigger('eventAfterRender', event, event, eventElement);
                }
            }
        
        }

        //Event Cell with in month/week/day
        function slotSegHtml(event, seg) {
            var html = "<";
            var url = event.url;
            var target = event.target;
            var desc = event.title + event.desc;
            var alldesc = htmlEscape(event.title) + "<br>" + htmlEscape(formatDates(event.start, event.end, opt('timeFormat'))) + "<br>" + htmlEscape(event.desc);
            var alldescTitle = "";
            var skinCss = getSkinCss(event, opt);
            var skinCssAttr = (skinCss ? " style='" + skinCss + "'" : '');
            var classes = ['fc-event', 'fc-event-skin', 'fc-event-vert'];
 			var startDate;
			var endDate;
			var dateSep = " - "
            var date = new Date();
			var startTime;
			var endTime;
			var eventTime = "";
			var evStartTitle = "Date: ";
			var evEndTitle = "";

			if (isEventDraggable(event)) {
                classes.push('fc-event-draggable');
            }
            if (seg.isStart) {
                classes.push('fc-corner-top');
            }
            if (seg.isEnd) {
                classes.push('fc-corner-bottom');
            }
            classes = classes.concat(event.className);
            if (event.source) {
                classes = classes.concat(event.source.className || []);
			}
				startDate = htmlEscape(formatDates(event.start, event.start, opt('startEndFormat', 'day')));
				endDate = htmlEscape(formatDates(event.end, event.end, opt('startEndFormat', 'day')));
                startTime = htmlEscape(formatDate(event.start, opt('timeFormat'))) ;
				endTime = htmlEscape(formatDate(event.end, opt('timeFormat'))) ;
				if (endTime == "11:59pm") {
                    endTime = "TBD";
					dateSep = " - ";
					
                } else {
					if (endTime == "11:58pm") {
                		endTime = "";
						dateSep = "";
					}
				}
                if (startDate != endDate && startTime === endTime) {

					startTime = "All Day Event";
					endTime = "";
				}
				if (startDate == endDate) {
					
					if (startTime === endTime) {
						dateSep = "";
						//startDate = "";
						endDate = "All Day Event";
						evEndTitle = "Time: "
						startTime = "";
						endTime = "";
						
					} else {
						evStartTitle = "Date: "						
						evEndTitle = "";
                        endDate = "";	
                        evTimeTitle = "\n Time:  "
                        eventTime = startTime + dateSep + endTime + " ";
					}				
				}
				 
				var urlTitleTxt = htmlEscape(htmlEscape(event.title)) + " \n " + evStartTitle +  startDate +  " \n " + evEndTitle + endDate + " \n Description: " + htmlEscape(event.desc)				
            
			eventTime = startTime + dateSep + endTime
			alldescTitle = htmlEscape(event.title) + " \n Time: " + eventTime + " \n Description: " + htmlEscape(event.desc);
			
            if (url) {
                html += "a href='" + htmlEscape(url) + "'" + " title='" + alldescTitle + "'" + "'";
            } else {
                html += "div";
            }
            html +=
			" class='" + classes.join(' ') + "'" +
			" style='position:absolute;z-index:s;top:" + seg.top + "px;left:" + seg.left + "px;" + skinCss + "'" +
			">" +
			"<div class='fc-event-inner fc-event-skin'" + skinCssAttr + ">" +
			"<div class='fc-event-head fc-event-skin'" + skinCssAttr + ">" +
			"<div class='fc-event-time' title='" + alldescTitle + "'> Time: " +
			startTime + dateSep + endTime +
            //htmlEscape(formatDates(event.start, event.end, opt('timeFormat'))) +
			"</div>" +
			"</div>" +
			"<div class='fc-event-content' title='" + alldescTitle + "'>" +
			"<div class='fc-event-title' ><!--Date and Time Range on the week and day view--> " +
            // John T. - Added  htmlEscape(desc)
            htmlEscape(event.title) + "<br>" + htmlEscape(event.desc) +
			"</div>" +
			"</div>" +
			"<div class='fc-event-bg'></div>" +
			"</div>"; // close inner


			if (seg.isEnd && isEventResizable(event)) {
                html +=
				"<div class='ui-resizable-handle ui-resizable-s'>=</div>";
            }
            html +=
			"</" + (url ? "a" : "div") + ">";
            return html ;
        }
		
		// Event Listing that displays a list of events below the calendar.
        function slotSegHtml2(event, seg) {
            var url = event.url;
            var target = event.target;
            var desc = event.title + event.desc;
            var alldesc = htmlEscape(event.title) + "<br>" + htmlEscape(formatDates(event.start, event.end, opt('timeFormat'))) + "<br>" + htmlEscape(event.desc);
            //var alldescTitle = htmlEscape(event.title) + " \n Time: " + htmlEscape(formatDates(event.start, event.end, opt('timeFormat'))) + " \n Description: " + htmlEscape(event.desc);
            var skinCss = getSkinCss(event, opt);
            var skinCssAttr = (skinCss ? " style='" + skinCss + "'" : '');
            var classes = ['fc-event', 'fc-event-skin', 'fc-event-vert'];
            var eventListingText = "";
			var startDate = "";
			var endDate = "";
			var dateSep = " - "
            var date = new Date();
			var startTime = "";
			var endTime = "";
			var eventTime = "";
			var evStartTitle = "Date: "
			var evEndTitle = ""

			if (isEventDraggable(event)) {
                classes.push('fc-event-draggable');
            }
            if (seg.isStart) {
                classes.push('fc-corner-top');
            }
            if (seg.isEnd) {
                classes.push('fc-corner-bottom');
            }
            classes = classes.concat(event.className);
            if (event.source) {
                classes = classes.concat(event.source.className || []);
			}
				startDate = htmlEscape(formatDates(event.start, event.start, opt('startEndFormat', 'day')));
				endDate = htmlEscape(formatDates(event.end, event.end, opt('startEndFormat', 'day')));
                startTime = htmlEscape(formatDate(event.start, opt('timeFormat'))) ;
				endTime = htmlEscape(formatDate(event.end, opt('timeFormat'))) ;
				//evEndTitle = "End Date: "
				if (endTime == "11:59pm") {
						endTime = "TBD";
						dateSep = " - ";
				
					
				}
           	    if (endTime == "11:58pm") {
                		endTime = "";
						dateSep = "";
				}
				
				if (startDate != endDate) {
					if (startTime === endTime) {
						evStartTitle = "Date: "						
						evEndTitle = " - "
						evTimeTitle = "\n Time:  "
                        startTime = "All Day Event";
						endTime = "";
						eventTime = startTime + endTime;
					} else {
						evStartTitle = "Date: "
						evEndTitle = " - "
                        evTimeTitle = "\n Time:  "
                        //dateSep = "";
						eventTime = startTime + dateSep + endTime + " ";
						//endDate = endTime;
					}
				}
				if (startDate == endDate) {
					
					if (startTime === endTime) {
						dateSep = "";
						evStartTitle = "Date: "
						endDate = "All Day Event";
						//evEndTitle = "Time: "
						startTime = "";
						endTime = "";
						
					} else {
						dateSep = "";
						evStartTitle = "Date: "
						evEndTitle = ""
						evTimeTitle = "\n Time: ";
                        endDate = "";
                        eventTime = startTime + " - " + endTime + " ";
                      				
					}				
				}
             	var urlTitleTxt = htmlEscape(htmlEscape(event.title)) + " \n " + evStartTitle +  startDate +  " \n " + evEndTitle + endDate + " \n Description: " + htmlEscape(event.desc)				
			
            if (url) {
				var eventListTitle = "<a href='" + htmlEscape(url) + "'" + " title='" + urlTitleTxt + "'" + " target='" + htmlEscape(target) + "'>" + htmlEscape(event.title) + "</a>";
            } else {
				var eventListTitle = htmlEscape(event.title);

            }

               	//*********************************
				// John Thompson
				// Loop through the events and for the Event Listings for the booton of the calendar.

				eventListingText += "<!-- Timed Event Day View Event Listings 1--><li><span class='title'>" + eventListTitle + "</span>" +
				"<span class='startDate'><b>" + evStartTitle +  "</b>" + startDate + evEndTitle + endDate + "</span>" +
			    "<span class='endDate'><b>" + evTimeTitle + "</b>" + eventTime + "</span>" +
				"<span class='desc'><b>Description: </b>" + htmlEscape(event.desc) + "</span>" + 

                //"<span class='startDate'><b>" + evStartTitle +  "</b>" + startDate + "</span>" +
				//"<span class='endDate'><b>" + evEndTitle + "</b>" + endDate + "</span>"
				//if (startDate != endDate && startTime != endTime) {
					
				//}
				//eventListingText += "<span class='desc'><b>Description: </b>" + htmlEscape(event.desc) + "</span>" + 
				 "</li>";
            return eventListingText;
        }




        function bindDaySeg(event, eventElement, seg) {
            if (isEventDraggable(event)) {
                draggableDayEvent(event, eventElement, seg.isStart);
            }
            if (seg.isEnd && isEventResizable(event)) {
                resizableDayEvent(event, eventElement, seg);
            }
            eventElementHandlers(event, eventElement);
            // needs to be after, because resizableDayEvent might stopImmediatePropagation on click
        }


        function bindSlotSeg(event, eventElement, seg) {
            var timeElement = eventElement.find('div.fc-event-time');
            if (isEventDraggable(event)) {
                draggableSlotEvent(event, eventElement, timeElement);
            }
            if (seg.isEnd && isEventResizable(event)) {
                resizableSlotEvent(event, eventElement, timeElement);
            }
            eventElementHandlers(event, eventElement);
        }



        /* Dragging
        -----------------------------------------------------------------------------------*/


        // when event starts out FULL-DAY

        function draggableDayEvent(event, eventElement, isStart) {
            var origWidth;
            var revert;
            var allDay = true;
            var dayDelta;
            var dis = opt('isRTL') ? -1 : 1;
            var hoverListener = getHoverListener();
            var colWidth = getColWidth();
            var slotHeight = getSlotHeight();
            var minMinute = getMinMinute();
            eventElement.draggable({
                zIndex: 9,
                opacity: opt('dragOpacity', 'month'), // use whatever the month view was using
                revertDuration: opt('dragRevertDuration'),
                start: function (ev, ui) {
                    trigger('eventDragStart', eventElement, event, ev, ui);
                    hideEvents(event, eventElement);
                    origWidth = eventElement.width();
                    hoverListener.start(function (cell, origCell, rowDelta, colDelta) {
                        clearOverlays();
                        if (cell) {
                            //setOverflowHidden(true);
                            revert = false;
                            dayDelta = colDelta * dis;
                            if (!cell.row) {
                                // on full-days
                                renderDayOverlay(
								addDays(cloneDate(event.start), dayDelta),
								addDays(exclEndDay(event), dayDelta)
							);
                                resetElement();
                            } else {
                                // mouse is over bottom slots
                                if (isStart) {
                                    if (allDay) {
                                        // convert event to temporary slot-event
                                        eventElement.width(colWidth - 10); // don't use entire width
                                        setOuterHeight(
										eventElement,
										slotHeight * Math.round(
											(event.end ? ((event.end - event.start) / MINUTE_MS) : opt('defaultEventMinutes'))
											/ opt('slotMinutes')
										)
									);
                                        eventElement.draggable('option', 'grid', [colWidth, 1]);
                                        allDay = false;
                                    }
                                } else {
                                    revert = true;
                                }
                            }
                            revert = revert || (allDay && !dayDelta);
                        } else {
                            resetElement();
                            //setOverflowHidden(false);
                            revert = true;
                        }
                        eventElement.draggable('option', 'revert', revert);
                    }, ev, 'drag');
                },
                stop: function (ev, ui) {
                    hoverListener.stop();
                    clearOverlays();
                    trigger('eventDragStop', eventElement, event, ev, ui);
                    if (revert) {
                        // hasn't moved or is out of bounds (draggable has already reverted)
                        resetElement();
                        eventElement.css('filter', ''); // clear IE opacity side-effects
                        showEvents(event, eventElement);
                    } else {
                        // changed!
                        var minuteDelta = 0;
                        if (!allDay) {
                            minuteDelta = Math.round((eventElement.offset().top - getBodyContent().offset().top) / slotHeight)
							* opt('slotMinutes')
							+ minMinute
							- (event.start.getHours() * 60 + event.start.getMinutes());
                        }
                        eventDrop(this, event, dayDelta, minuteDelta, allDay, ev, ui);
                    }
                    //setOverflowHidden(false);
                }
            });
            function resetElement() {
                if (!allDay) {
                    eventElement
					.width(origWidth)
					.height('')
					.draggable('option', 'grid', null);
                    allDay = true;
                }
            }
        }


        // when event starts out IN TIMESLOTS

        function draggableSlotEvent(event, eventElement, timeElement) {
            var origPosition;
            var allDay = false;
            var dayDelta;
            var minuteDelta;
            var prevMinuteDelta;
            var dis = opt('isRTL') ? -1 : 1;
            var hoverListener = getHoverListener();
            var colCnt = getColCnt();
            var colWidth = getColWidth();
            var slotHeight = getSlotHeight();
            eventElement.draggable({
                zIndex: 9,
                scroll: false,
                grid: [colWidth, slotHeight],
                axis: colCnt == 1 ? 'y' : false,
                opacity: opt('dragOpacity'),
                revertDuration: opt('dragRevertDuration'),
                start: function (ev, ui) {
                    trigger('eventDragStart', eventElement, event, ev, ui);
                    hideEvents(event, eventElement);
                    origPosition = eventElement.position();
                    minuteDelta = prevMinuteDelta = 0;
                    hoverListener.start(function (cell, origCell, rowDelta, colDelta) {
                        eventElement.draggable('option', 'revert', !cell);
                        clearOverlays();
                        if (cell) {
                            dayDelta = colDelta * dis;
                            if (opt('allDaySlot') && !cell.row) {
                                // over full days
                                if (!allDay) {
                                    // convert to temporary all-day event
                                    allDay = true;
                                    timeElement.hide();
                                    eventElement.draggable('option', 'grid', null);
                                }
                                renderDayOverlay(
								addDays(cloneDate(event.start), dayDelta),
								addDays(exclEndDay(event), dayDelta)
							);
                            } else {
                                // on slots
                                resetElement();
                            }
                        }
                    }, ev, 'drag');
                },
                drag: function (ev, ui) {
                    minuteDelta = Math.round((ui.position.top - origPosition.top) / slotHeight) * opt('slotMinutes');
                    if (minuteDelta != prevMinuteDelta) {
                        if (!allDay) {
                            updateTimeText(minuteDelta);
                        }
                        prevMinuteDelta = minuteDelta;
                    }
                },
                stop: function (ev, ui) {
                    var cell = hoverListener.stop();
                    clearOverlays();
                    trigger('eventDragStop', eventElement, event, ev, ui);
                    if (cell && (dayDelta || minuteDelta || allDay)) {
                        // changed!
                        eventDrop(this, event, dayDelta, allDay ? 0 : minuteDelta, allDay, ev, ui);
                    } else {
                        // either no change or out-of-bounds (draggable has already reverted)
                        resetElement();
                        eventElement.css('filter', ''); // clear IE opacity side-effects
                        eventElement.css(origPosition); // sometimes fast drags make event revert to wrong position
                        updateTimeText(0);
                        showEvents(event, eventElement);
                    }
                }
            });
            function updateTimeText(minuteDelta) {
                var newStart = addMinutes(cloneDate(event.start), minuteDelta);
                var newEnd;
                if (event.end) {
                    newEnd = addMinutes(cloneDate(event.end), minuteDelta);
                }
                timeElement.text(formatDates(newStart, newEnd, opt('timeFormat')));
            }
            function resetElement() {
                // convert back to original slot-event
                if (allDay) {
                    timeElement.css('display', ''); // show() was causing display=inline
                    eventElement.draggable('option', 'grid', [colWidth, slotHeight]);
                    allDay = false;
                }
            }
        }



        /* Resizing
        --------------------------------------------------------------------------------------*/


        function resizableSlotEvent(event, eventElement, timeElement) {
            var slotDelta, prevSlotDelta;
            var slotHeight = getSlotHeight();
            eventElement.resizable({
                handles: {
                    s: 'div.ui-resizable-s'
                },
                grid: slotHeight,
                start: function (ev, ui) {
                    slotDelta = prevSlotDelta = 0;
                    hideEvents(event, eventElement);
                    eventElement.css('z-index', 9);
                    trigger('eventResizeStart', this, event, ev, ui);
                },
                resize: function (ev, ui) {
                    // don't rely on ui.size.height, doesn't take grid into account
                    slotDelta = Math.round((Math.max(slotHeight, eventElement.height()) - ui.originalSize.height) / slotHeight);
                    if (slotDelta != prevSlotDelta) {
                        timeElement.text(
						formatDates(
							event.start,
							(!slotDelta && !event.end) ? null : // no change, so don't display time range
								addMinutes(eventEnd(event), opt('slotMinutes') * slotDelta),
							opt('timeFormat')
						)
					);
                        prevSlotDelta = slotDelta;
                    }
                },
                stop: function (ev, ui) {
                    trigger('eventResizeStop', this, event, ev, ui);
                    if (slotDelta) {
                        eventResize(this, event, 0, opt('slotMinutes') * slotDelta, ev, ui);
                    } else {
                        eventElement.css('z-index', 8);
                        showEvents(event, eventElement);
                        // BUG: if event was really short, need to put title back in span
                    }
                }
            });
        }


    }


    function countForwardSegs(levels) {
        var i, j, k, level, segForward, segBack;
        for (i = levels.length - 1; i > 0; i--) {
            level = levels[i];
            for (j = 0; j < level.length; j++) {
                segForward = level[j];
                for (k = 0; k < levels[i - 1].length; k++) {
                    segBack = levels[i - 1][k];
                    if (segsCollide(segForward, segBack)) {
                        segBack.forward = Math.max(segBack.forward || 0, (segForward.forward || 0) + 1);
                    }
                }
            }
        }
    }




    function View(element, calendar, viewName) {
        var t = this;


        // exports
        t.element = element;
        t.calendar = calendar;
        t.name = viewName;
        t.opt = opt;
        t.trigger = trigger;
        //t.setOverflowHidden = setOverflowHidden;
        t.isEventDraggable = isEventDraggable;
        t.isEventResizable = isEventResizable;
        t.reportEvents = reportEvents;
        t.eventEnd = eventEnd;
        t.reportEventElement = reportEventElement;
        t.reportEventClear = reportEventClear;
        t.eventElementHandlers = eventElementHandlers;
        t.showEvents = showEvents;
        t.hideEvents = hideEvents;
        t.eventDrop = eventDrop;
        t.eventResize = eventResize;
        // t.title
        // t.start, t.end
        // t.visStart, t.visEnd


        // imports
        var defaultEventEnd = t.defaultEventEnd;
        var normalizeEvent = calendar.normalizeEvent; // in EventManager
        var reportEventChange = calendar.reportEventChange;


        // locals
        var eventsByID = {};
        var eventElements = [];
        var eventElementsByID = {};
        var options = calendar.options;



        function opt(name, viewNameOverride) {
            var v = options[name];
            if (typeof v == 'object') {
                return smartProperty(v, viewNameOverride || viewName);
            }
            return v;
        }


        function trigger(name, thisObj) {
            return calendar.trigger.apply(
			calendar,
			[name, thisObj || t].concat(Array.prototype.slice.call(arguments, 2), [t])
		);
        }


        /*
        function setOverflowHidden(bool) {
        element.css('overflow', bool ? 'hidden' : '');
        }
        */


        function isEventDraggable(event) {
            return isEventEditable(event) && !opt('disableDragging');
        }


        function isEventResizable(event) { // but also need to make sure the seg.isEnd == true
            return isEventEditable(event) && !opt('disableResizing');
        }


        function isEventEditable(event) {
            return firstDefined(event.editable, (event.source || {}).editable, opt('editable'));
        }



        /* Event Data
        ------------------------------------------------------------------------------*/


        // report when view receives new events
        function reportEvents(events) { // events are already normalized at this point
            eventsByID = {};
            var i, len = events.length, event;
            for (i = 0; i < len; i++) {
                event = events[i];
                if (eventsByID[event._id]) {
                    eventsByID[event._id].push(event);
                } else {
                    eventsByID[event._id] = [event];
                }
            }
        }


        // returns a Date object for an event's end
        function eventEnd(event) {
            return event.end ? cloneDate(event.end) : defaultEventEnd(event);
        }



        /* Event Elements
        ------------------------------------------------------------------------------*/


        // report when view creates an element for an event
        function reportEventElement(event, element) {
            eventElements.push(element);
            if (eventElementsByID[event._id]) {
                eventElementsByID[event._id].push(element);
            } else {
                eventElementsByID[event._id] = [element];
            }
        }


        function reportEventClear() {
            eventElements = [];
            eventElementsByID = {};
        }


        // attaches eventClick, eventMouseover, eventMouseout
        function eventElementHandlers(event, eventElement) {
            eventElement
			.click(function (ev) {
			    if (!eventElement.hasClass('ui-draggable-dragging') &&
					!eventElement.hasClass('ui-resizable-resizing')) {
			        return trigger('eventClick', this, event, ev);
			    }
			})
			.hover(
				function (ev) {
				    trigger('eventMouseover', this, event, ev);
				},
				function (ev) {
				    trigger('eventMouseout', this, event, ev);
				}
			);
            // TODO: don't fire eventMouseover/eventMouseout *while* dragging is occuring (on subject element)
            // TODO: same for resizing
        }


        function showEvents(event, exceptElement) {
            eachEventElement(event, exceptElement, 'show');
        }


        function hideEvents(event, exceptElement) {
            eachEventElement(event, exceptElement, 'hide');
        }


        function eachEventElement(event, exceptElement, funcName) {
            var elements = eventElementsByID[event._id],
			i, len = elements.length;
            for (i = 0; i < len; i++) {
                if (!exceptElement || elements[i][0] != exceptElement[0]) {
                    elements[i][funcName]();
                }
            }
        }



        /* Event Modification Reporting
        ---------------------------------------------------------------------------------*/


        function eventDrop(e, event, dayDelta, minuteDelta, allDay, ev, ui) {
            var oldAllDay = event.allDay;
            var eventId = event._id;
            moveEvents(eventsByID[eventId], dayDelta, minuteDelta, allDay);
            trigger(
			'eventDrop',
			e,
			event,
			dayDelta,
			minuteDelta,
			allDay,
			function () {
			    // TODO: investigate cases where this inverse technique might not work
			    moveEvents(eventsByID[eventId], -dayDelta, -minuteDelta, oldAllDay);
			    reportEventChange(eventId);
			},
			ev,
			ui
		);
            reportEventChange(eventId);
        }


        function eventResize(e, event, dayDelta, minuteDelta, ev, ui) {
            var eventId = event._id;
            elongateEvents(eventsByID[eventId], dayDelta, minuteDelta);
            trigger(
			'eventResize',
			e,
			event,
			dayDelta,
			minuteDelta,
			function () {
			    // TODO: investigate cases where this inverse technique might not work
			    elongateEvents(eventsByID[eventId], -dayDelta, -minuteDelta);
			    reportEventChange(eventId);
			},
			ev,
			ui
		);
            reportEventChange(eventId);
        }



        /* Event Modification Math
        ---------------------------------------------------------------------------------*/


        function moveEvents(events, dayDelta, minuteDelta, allDay) {
            minuteDelta = minuteDelta || 0;
            for (var e, len = events.length, i = 0; i < len; i++) {
                e = events[i];
                if (allDay !== undefined) {
                    e.allDay = allDay;
                }
                addMinutes(addDays(e.start, dayDelta, true), minuteDelta);
                if (e.end) {
                    e.end = addMinutes(addDays(e.end, dayDelta, true), minuteDelta);
                }
                normalizeEvent(e, options);
            }
        }


        function elongateEvents(events, dayDelta, minuteDelta) {
            minuteDelta = minuteDelta || 0;
            for (var e, len = events.length, i = 0; i < len; i++) {
                e = events[i];
                e.end = addMinutes(addDays(eventEnd(e), dayDelta, true), minuteDelta);
                normalizeEvent(e, options);
            }
        }


    }

    function DayEventRenderer() {
        var t = this;


        // exports
        t.renderDaySegs = renderDaySegs;
        t.resizableDayEvent = resizableDayEvent;


        // imports
        var opt = t.opt;
        var trigger = t.trigger;
        var isEventDraggable = t.isEventDraggable;
        var isEventResizable = t.isEventResizable;
        var eventEnd = t.eventEnd;
        var reportEventElement = t.reportEventElement;
        var showEvents = t.showEvents;
        var hideEvents = t.hideEvents;
        var eventResize = t.eventResize;
        var getRowCnt = t.getRowCnt;
        var getColCnt = t.getColCnt;
        var getColWidth = t.getColWidth;
        var allDayRow = t.allDayRow;
        var allDayBounds = t.allDayBounds;
        var colContentLeft = t.colContentLeft;
        var colContentRight = t.colContentRight;
        var dayOfWeekCol = t.dayOfWeekCol;
        var dateCell = t.dateCell;
        var compileDaySegs = t.compileDaySegs;
        var getDaySegmentContainer = t.getDaySegmentContainer;
        var bindDaySeg = t.bindDaySeg; //TODO: streamline this
        var formatDates = t.calendar.formatDates;
        var renderDayOverlay = t.renderDayOverlay;
        var clearOverlays = t.clearOverlays;
        var clearSelection = t.clearSelection;

        /* Rendering
        -----------------------------------------------------------------------------*/
        function renderDaySegs(segs, modifiedEventId) {
            var segmentContainer = getDaySegmentContainer();
            var rowDivs;
            var rowCnt = getRowCnt();
            var colCnt = getColCnt();
            var i = 0;
            var rowI;
            var levelI;
            var colHeights;
            var j;
            var segCnt = segs.length;
            var seg;
            var top;
            var k;
            segmentContainer[0].innerHTML = daySegHTML(segs); // faster than .html()

            daySegElementResolve(segs, segmentContainer.children());
            daySegElementReport(segs);
            daySegHandlers(segs, segmentContainer, modifiedEventId);
            daySegCalcHSides(segs);
            daySegSetWidths(segs);
            daySegCalcHeights(segs);
            rowDivs = getRowDivs();
            // set row heights, calculate event tops (in relation to row top)
            for (rowI = 0; rowI < rowCnt; rowI++) {
                levelI = 0;
                colHeights = [];
                for (j = 0; j < colCnt; j++) {
                    colHeights[j] = 0;
                }
				
                while (i < segCnt && (seg = segs[i]).row == rowI) {
                    // loop through segs in a row
                    top = arrayMax(colHeights.slice(seg.startCol, seg.endCol));
                    seg.top = top;
                    top += seg.outerHeight;
                    for (k = seg.startCol; k < seg.endCol; k++) {
                        colHeights[k] = top;
                    }
                    i++;
                }
                rowDivs[rowI].height(arrayMax(colHeights));
            }
            daySegSetTops(segs, getRowTops(rowDivs));
        }


        function renderTempDaySegs(segs, adjustRow, adjustTop) {
            var tempContainer = $("<div/>");
            var elements;
            var segmentContainer = getDaySegmentContainer();
            var i;
            var segCnt = segs.length;
            var element;
            tempContainer[0].innerHTML = daySegHTML(segs); // faster than .html()
            elements = tempContainer.children();
            segmentContainer.append(elements);
            daySegElementResolve(segs, elements);
            daySegCalcHSides(segs);
            daySegSetWidths(segs);
            daySegCalcHeights(segs);
            daySegSetTops(segs, getRowTops(getRowDivs()));
            elements = [];
            for (i = 0; i < segCnt; i++) {
                element = segs[i].element;
                if (element) {
                    if (segs[i].row === adjustRow) {
                        element.css('top', adjustTop);
                    }
                    elements.push(element[0]);
                }
            }
			
            return $(elements);
        }

        //Day cells within a Month
        function daySegHTML(segs) { // also sets seg.left and seg.outerWidth
            var rtl = opt('isRTL');
            var i;
            var segCnt = segs.length;
			var segCntTmp = segs.length;
            var seg;
			//var seg2;
            var event;
            var url;
            var classes;
            var bounds = allDayBounds();
            var minLeft = bounds.left;
            var maxLeft = bounds.right;
            var leftCol;
            var rightCol;
			var leftColTmp;
			var rightColTmp;
            var left;
            var right;
            var skinCss;
            var target;
            var title;
			var evTitleTxt;
			var evTitle;
            var html = '';
            var desc;
			var startDate;
			var endDate;
			var dateSep = ""
            var date = new Date();
			var startTime;
			var endTime;
			var eventTime = "";
			var evStartTitle = "Date: "
			var evEndTitle = "";
            var evTimeTitle = "";
			var eventListingText = "";
            var eventIDArray =new Array();
			var incID = 2;
			var j = 0;
			var maxEventsPerDay = opt("maxperday");
            var moreTitle = opt("moretitle");
			var eventMax;
			var evDay;
			var startDateComp;
			var endDateComp;
			var numOfDays;
 			var tmpHtml = '';
			var moreEventClassID = '';
			var colCnt = 0;
			var colDayCnt = 0;
            var colTotal = 0;
            var colDay0 = 0;
            var colDay1 = 0;
            var colDay2 = 0;
            var colDay3 = 0;
            var colDay4 = 0;
            var colDay5 = 0;
            var colDay6 = 0;
            var c;
            var k;
            var colIDCnt;
            var segRowTmp;
			// calculate desired position/dimensions, create html
			eventListingText += "<ul>";
            var setView = getUrlVars()["view"];
            if (setView == "agendaDay") {
                maxEventsPerDay = 0;
            }
            // maxEventsPerDay
			for (i = 0; i < segCnt; i++) {
                seg = segs[i];
				//seg2 = segs[i];
                event = seg.event;
                classes = ['fc-event', 'fc-event-skin', 'fc-event-hori'];
   				url = event.url;
                title = event.title;
                target = event.target;
                desc = event.desc;
                skinCss = getSkinCss(event, opt);
				startDate = htmlEscape(formatDates(event.start, event.start, opt('startEndFormat', 'day')));
				endDate = htmlEscape(formatDates(event.end, event.end, opt('startEndFormat', 'day')));
 				startDateComp = htmlEscape(formatDates(event.start, event.start, opt('dayFormat', 'dateComp')));
				endDateComp = htmlEscape(formatDates(event.end, event.end, opt('dayFormat', 'dateComp')));
               	// Figure out the Number of days for the event.
				numOfDays = (endDateComp - startDateComp) 
				startTime = htmlEscape(formatDate(event.start, opt('timeFormat'))) ;
				endTime = htmlEscape(formatDate(event.end, opt('timeFormat'))) ;
				evEndTitle = " - "
                dateSep = " - "
                // If the End Time is 11:59pm then that End Time is consider unknown (TBD).
                if (endTime == "11:59pm") {
                    endTime = "TBD";
                } else {
                     if (endTime == "11:58pm") {
                		endTime = "";
						dateSep = "";
					}
                }

				if (isEventDraggable(event)) {
                    classes.push('fc-event-draggable');
                }
                if (rtl) {
                    if (seg.isStart) {
                        classes.push('fc-corner-right');
                    }
                    if (seg.isEnd) {
                        classes.push('fc-corner-left');
                    }
                    leftCol = dayOfWeekCol(seg.end.getDay() - 1);
                    rightCol = dayOfWeekCol(seg.start.getDay());
                    left = seg.isEnd ? colContentLeft(leftCol) : minLeft;
                    right = seg.isStart ? colContentRight(rightCol) : maxLeft;
                } else {
                    if (seg.isStart) {
                        classes.push('fc-corner-left');
                    }
                    if (seg.isEnd) {
                        classes.push('fc-corner-right');
                    }
                    leftCol = dayOfWeekCol(seg.start.getDay());
                    rightCol = dayOfWeekCol(seg.end.getDay() - 1);
                    left = seg.isStart ? colContentLeft(leftCol) : minLeft;
                    right = seg.isEnd ? colContentRight(rightCol) : maxLeft;
                }
				classes = classes.concat(event.className);
                if (event.source) {
                    classes = classes.concat(event.source.className || []);
                }
 
				//Start counting the events starting from the beginning of the week.
                if (seg.row != segRowTmp) {
                    colDay0 = 0;
                    colDay1 = 0;
                    colDay2 = 0;
                    colDay3 = 0;
                    colDay4 = 0;
                    colDay5 = 0;
                    colDay6 = 0;
                } else {
                    if (seg.isEnd == false) {
                        colDay6 = 0;
                    }
                }
                segRowTmp = seg.row;
                if (leftColTmp <= leftCol &&  rightColTmp >= rightCol) {
				    leftColTmp = leftCol;
					colCnt++;
				} else {
                    colCnt = 0;
                }
				
                if (leftCol != rightCol) {
                    
                    for (c = 0; c < 6; c++) {
                        //Day 1 
                        if (c == 0 && leftCol == 0) {                            
                            colDay0++;
                            colIDCnt = colDay0;
                        }
                        //Day 2
                        if (c == 1 && leftCol <= 1 && rightCol >=2) {                            
                            colDay1++;
                            colIDCnt = colDay1;
                        }
                        //Day 3
                        if (c == 2 && leftCol <= 2 && rightCol >=3) {                            
                            colDay2++;
                            colIDCnt = colDay2;
                        }
                        //Day 4
                        if (c == 3 && leftCol <= 3 && rightCol >= 4) {                            
                            colDay3++;
                            colIDCnt = colDay3;
                        }
                        //Day 5
                        if (c == 4 && leftCol <= 4 && rightCol >=5) {                            
                            colDay4++;
                            colIDCnt = colDay4;
                        }
                        //Day 6
                        if (c == 5 && leftCol <= 5 && rightCol >=6) {                            
                            colDay5++;
                            colIDCnt = colDay5;
                        }
                    }

                } else {
                
                    if (leftCol == 0 &&  rightCol == 0) {
                        colDay0++;
                        colIDCnt = colDay0
                    }
                    if (leftCol == 1 &&  rightCol == 1) {
                        colDay1++;
                        colIDCnt = colDay1;
                    }
                    if (leftCol == 2 &&  rightCol == 2) {
                        colDay2++;
                        colIDCnt = colDay2;
                    }
                    if (leftCol == 3 &&  rightCol == 3) {
                        colDay3++;
                        colIDCnt = colDay3;
                    }
                    if (leftCol == 4 &&  rightCol == 4) {
                        colDay4++;
                        colIDCnt = colDay4;
                    }
                    if (leftCol == 5 &&  rightCol == 5) {
                        colDay5++;
                        colIDCnt = colDay5;
                    }
                    if (leftCol == 6 &&  rightCol == 6) {
                        colDay6++;
                        colIDCnt = colDay6;
                    }
                }    
				if (startDate != endDate) {
					if (startTime === endTime) {
						evStartTitle = "Date: "						
						evEndTitle = " - "
						evTimeTitle = "\n Time:  "
                        startTime = "All Day Event";
						endTime = "";
						eventTime = startTime + endTime;
					} else {
						evStartTitle = "Date: "
						evEndTitle = " - "
                        evTimeTitle = "\n Time:  "
						eventTime = startTime + dateSep + endTime + " ";
						//endDate = endTime;
					}
				} else {
				//if (startDate == endDate) {
					
					if (startTime === endTime) {
					    evStartTitle = "Date: "						
						evEndTitle = "";
                        endDate = "";
						evTimeTitle = "\n Time:  ";
                        startTime = "All Day Event";
						endTime = "";
						eventTime = startTime + endTime;
					} else {
						evStartTitle = "Date: "						
						evEndTitle = "";
                        endDate = "";	
                        evTimeTitle = "\n Time:  "
                        eventTime = startTime + dateSep + endTime + " ";
			
					}				
				}
				
				if (colIDCnt > maxEventsPerDay && maxEventsPerDay > 0) {
					eventMax = "fcMaxEvents";
					
				} else {
					eventMax = "fc-day" + htmlEscape(formatDate(event.start, opt('dayFormat', 'day'))) + " fc-eventday" + leftCol;
				}
                // Title Text for both Calendar events and the Event listing.
				var urlTitleTxt = htmlEscape(title) + " \n " + evStartTitle +  startDate +  evEndTitle + endDate + evTimeTitle + eventTime + " \n Description: " + htmlEscape(event.desc)				
				if (colIDCnt == (maxEventsPerDay + 1) && maxEventsPerDay != 0) {
				    evTitleTxt = moreTitle;
					evURL = "?view=agendaDay&agendadate=" + htmlEscape(formatDate(event.start, opt('dayFormat', 'day')));
					evTitle = " More Events "
					evTitle = "<div id='evMoreEvents" + htmlEscape(formatDate(event.start, opt('dayFormat', 'day'))) + "' class='moreEvents'>" + evTitleTxt + "</div>"
					evID = "evID" + htmlEscape(formatDate(event.start, opt('dayFormat', 'day')));
					eventMax = "fcMaxMoreEvents";
				} else {
					evTitleTxt = urlTitleTxt;
					evURL = htmlEscape(url);
					evTitle = htmlEscape(event.title);
				}
				
				if (url) {
                    html += "<a href='" + evURL + "'" + " title='" + evTitleTxt + "' target='" + htmlEscape(target) + "'";
					var eventListTitle = "<a class='bodylinks' href='" + htmlEscape(url) + "'" + " title='" + urlTitleTxt + "'" + " target='" + htmlEscape(target) + "'>" + htmlEscape(event.title) + "</a>";
                } else {
                    html += "<div";
                }
                
				html +=	" class='" + classes.join(' ') +  "' id='" + eventMax + "' style='position:absolute;z-index:8;left:" + left + "px;" + skinCss + "'>" +
				"<div" + " class='fc-event-inner fc-event-skin'" + (skinCss ? " style='" + skinCss + "'" : '') + ">"// + " leftCol " + leftCol + " rightCol " + rightCol + " seg.isStart " + seg.isStart + " seg.isEnd " + seg.isEnd + " seg.row " + seg.row 
					                 
                if (!event.allDay && seg.isStart) {
                   // html +=
					//"<span class='fc-event-time'>" +
					//htmlEscape(formatDate(event.start, opt('timeFormat'))) +
					//"</span>";
                }
               	html += "<span class='fc-event-title" + "'><!-- Title of the Monthly/Week/Day view -->" + evTitle //+ //" " + startDate + dateSep + endDate + "<br>" + htmlEscape(desc) + "</span>" +
				
				//*********************************
				// John Thompson
				// Loop through the events and for the Event Listings for the booton of the calendar.
			
                for (incID = 0; incID <= eventIDArray.length; incID++) {
				//alert("Event ID " + event.id);	
					if (jQuery.inArray(event.id, eventIDArray) < 0) {
						//alert(eventIDArray.length + " " + event.id);
						eventListingText += "<!-- Event Listings 2 --><li><span class='title'>" + eventListTitle + "</span>" +
						"<span class='startDate'><b>" + evStartTitle + "</b>" + startDate + evEndTitle + endDate + "</span>" +
						 "<span class='endDate'><b>" + evTimeTitle + "</b>" + eventTime + "</span>" +
						 "<span class='desc'><b>Description: </b>" + htmlEscape(event.desc) + "</span>" + 
						 "</li>";// +
						eventIDArray[i] = event.id;
						
					}
				}	
				
				//*********************************
				html += "</div>" ;
				
				if (seg.isEnd && isEventResizable(event)) {
                    html +=
					"<div class='ui-resizable-handle ui-resizable-" + (rtl ? 'w' : 'e') + "'>" +
					"&nbsp;&nbsp;&nbsp;" + // makes hit area a lot better for IE6/7 titleFormat
					"</div>";
                }
                seg.left = left;
                seg.outerWidth = right - left;
                seg.startCol = leftCol;
                seg.endCol = rightCol + 1; // needs to be exclusive
            }
			// Adjust the AllDay row on the AgendaDayView if there is more then 2 Allday events.
			switch(incID) {
				case 3: $(".fc-agenda-allday").css("height", "45px"); break;
				case 4:	$(".fc-agenda-allday").css("height", "60px"); break;
				case 5:	$(".fc-agenda-allday").css("height", "75px"); break;
				case 6:	$(".fc-agenda-allday").css("height", "90px"); break;
				case 7:	$(".fc-agenda-allday").css("height", "105px"); break;
				case 8:	$(".fc-agenda-allday").css("height", "120px"); break;
				case 9:	$(".fc-agenda-allday").css("height", "135px"); break;
			}
			// Populate the Event Listing DIV eventListingAllDay.
			eventListingText += "</ul>";
			$("#meAllDayListing").html(eventListingText);
			$("#meAllDayListing").addClass("meEventListing");
			
            return html;
        }

        function daySegElementResolve(segs, elements) { // sets seg.element
            var i;
            var segCnt = segs.length;
            var seg;
            var event;
            var element;
            var triggerRes;
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                event = seg.event;
                element = $(elements[i]); // faster than .eq()
                triggerRes = trigger('eventRender', event, event, element);
                if (triggerRes === false) {
                    element.remove();
                } else {
                    if (triggerRes && triggerRes !== true) {
                        triggerRes = $(triggerRes)
						.css({
						    position: 'absolute',
						    left: seg.left
						});
                        element.replaceWith(triggerRes);
                        element = triggerRes;
                    }
                    seg.element = element;
                }
            }
        }

        function daySegElementReport(segs) {
            var i;
            var segCnt = segs.length;
            var seg;
            var element;
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                element = seg.element;
                if (element) {
                    reportEventElement(seg.event, element);
                }
            }
        }


        function daySegHandlers(segs, segmentContainer, modifiedEventId) {
            var i;
            var segCnt = segs.length;
            var seg;
            var element;
            var event;
            // retrieve elements, run through eventRender callback, bind handlers
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                element = seg.element;
                if (element) {
                    event = seg.event;
					if (event._id === modifiedEventId) {
                        bindDaySeg(event, element, seg);
                    } else {
                        element[0]._fci = i; // for lazySegBind
                    }
                }
            }
            lazySegBind(segmentContainer, segs, bindDaySeg);
        }


        function daySegCalcHSides(segs) { // also sets seg.key
            var i;
            var segCnt = segs.length;
            var seg;
            var element;
            var key, val;
            var hsideCache = {};
            // record event horizontal sides
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                element = seg.element;
                if (element) {
                    key = seg.key = cssKey(element[0]);
					
                    val = hsideCache[key];
                    if (val === undefined) {
                        val = hsideCache[key] = hsides(element, true);
                    }
                    seg.hsides = val;
                }
            }
        }


        function daySegSetWidths(segs) {
            var i;
            var segCnt = segs.length;
            var seg;
            var element;
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                element = seg.element;
                if (element) {
                    element[0].style.width = Math.max(0, seg.outerWidth - seg.hsides) + 'px';
                }
            }
        }


        function daySegCalcHeights(segs) {
            var i;
            var segCnt = segs.length;
            var seg;
            var element;
            var key, val;
            var vmarginCache = {};
            // record event heights
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                element = seg.element;
                if (element) {
                    key = seg.key; // created in daySegCalcHSides
                    val = vmarginCache[key];
                    if (val === undefined) {
                        val = vmarginCache[key] = vmargins(element);
                    }
                    seg.outerHeight = element[0].offsetHeight + val;
                }
            }
        }


        function getRowDivs() {
            var i;
            var rowCnt = getRowCnt();
            var rowDivs = [];
            for (i = 0; i < rowCnt; i++) {
                rowDivs[i] = allDayRow(i)
				.find('td:first div.fc-day-content > div'); // optimal selector?
            }
            return rowDivs;
        }


        function getRowTops(rowDivs) {
            var i;
            var rowCnt = rowDivs.length;
            var tops = [];
            for (i = 0; i < rowCnt; i++) {
                tops[i] = rowDivs[i][0].offsetTop; // !!?? but this means the element needs position:relative if in a table cell!!!!
            }
            return tops;
        }


        function daySegSetTops(segs, rowTops) { // also triggers eventAfterRender
            var i;
            var segCnt = segs.length;
            
            var seg;
            var element;
            var event;
            for (i = 0; i < segCnt; i++) {
                seg = segs[i];
                element = seg.element;
                var arrID = element[0].id.split( " " );
                
                if (element) {
                    element[0].style.top = rowTops[seg.row] + (seg.top || 0) + 'px';
                    event = seg.event;
                    trigger('eventAfterRender', event, event, element);
                }
            }
        }



        /* Resizing
        -----------------------------------------------------------------------------------*/


        function resizableDayEvent(event, element, seg) {
            var rtl = opt('isRTL');
            var direction = rtl ? 'w' : 'e';
            var handle = element.find('div.ui-resizable-' + direction);
            var isResizing = false;

            // TODO: look into using jquery-ui mouse widget for this stuff
            disableTextSelection(element); // prevent native <a> selection for IE
            element
			.mousedown(function (ev) { // prevent native <a> selection for others
			    ev.preventDefault();
			})
			.click(function (ev) {
			    if (isResizing) {
			        ev.preventDefault(); // prevent link from being visited (only method that worked in IE6)
			        ev.stopImmediatePropagation(); // prevent fullcalendar eventClick handler from being called
			        // (eventElementHandlers needs to be bound after resizableDayEvent)
			    }
			});

            handle.mousedown(function (ev) {
                if (ev.which != 1) {
                    return; // needs to be left mouse button
                }
                isResizing = true;
                var hoverListener = t.getHoverListener();
                var rowCnt = getRowCnt();
                var colCnt = getColCnt();
                var dis = rtl ? -1 : 1;
                var dit = rtl ? colCnt - 1 : 0;
                var elementTop = element.css('top');
                var dayDelta;
                var helpers;
                var eventCopy = $.extend({}, event);
                var minCell = dateCell(event.start);
                clearSelection();
                $('body')
				.css('cursor', direction + '-resize')
				.one('mouseup', mouseup);
                trigger('eventResizeStart', this, event, ev);
                hoverListener.start(function (cell, origCell) {
                    if (cell) {
                        var r = Math.max(minCell.row, cell.row);
                        var c = cell.col;
                        if (rowCnt == 1) {
                            r = 0; // hack for all-day area in agenda views
                        }
                        if (r == minCell.row) {
                            if (rtl) {
                                c = Math.min(minCell.col, c);
                            } else {
                                c = Math.max(minCell.col, c);
                            }
                        }
                        dayDelta = (r * 7 + c * dis + dit) - (origCell.row * 7 + origCell.col * dis + dit);
                        var newEnd = addDays(eventEnd(event), dayDelta, true);
                        if (dayDelta) {
                            eventCopy.end = newEnd;
                            var oldHelpers = helpers;
                            helpers = renderTempDaySegs(compileDaySegs([eventCopy]), seg.row, elementTop);
                            helpers.find('*').css('cursor', direction + '-resize');
                            if (oldHelpers) {
                                oldHelpers.remove();
                            }
                            hideEvents(event);
                        } else {
                            if (helpers) {
                                showEvents(event);
                                helpers.remove();
                                helpers = null;
                            }
                        }
                        clearOverlays();
                        renderDayOverlay(event.start, addDays(cloneDate(newEnd), 1)); // coordinate grid already rebuild at hoverListener.start
                    }
                }, ev);

                function mouseup(ev) {
                    trigger('eventResizeStop', this, event, ev);
                    $('body').css('cursor', '');
                    hoverListener.stop();
                    clearOverlays();
                    if (dayDelta) {
                        eventResize(this, event, dayDelta, 0, ev);
                        // event redraw will clear helpers
                    }
                    // otherwise, the drag handler already restored the old events

                    setTimeout(function () { // make this happen after the element's click event
                        isResizing = false;
                    }, 0);
                }

            });
        }


    }

    //BUG: unselect needs to be triggered when events are dragged+dropped

    function SelectionManager() {
        var t = this;


        // exports
        t.select = select;
        t.unselect = unselect;
        t.reportSelection = reportSelection;
        t.daySelectionMousedown = daySelectionMousedown;


        // imports
        var opt = t.opt;
        var trigger = t.trigger;
        var defaultSelectionEnd = t.defaultSelectionEnd;
        var renderSelection = t.renderSelection;
        var clearSelection = t.clearSelection;


        // locals
        var selected = false;



        // unselectAuto
        if (opt('selectable') && opt('unselectAuto')) {
            $(document).mousedown(function (ev) {
                var ignore = opt('unselectCancel');
                if (ignore) {
                    if ($(ev.target).parents(ignore).length) { // could be optimized to stop after first match
                        return;
                    }
                }
                unselect(ev);
            });
        }


        function select(startDate, endDate, allDay) {
            unselect();
            if (!endDate) {
                endDate = defaultSelectionEnd(startDate, allDay);
            }
            renderSelection(startDate, endDate, allDay);
            reportSelection(startDate, endDate, allDay);
        }


        function unselect(ev) {
            if (selected) {
                selected = false;
                clearSelection();
                trigger('unselect', null, ev);
            }
        }


        function reportSelection(startDate, endDate, allDay, ev) {
            selected = true;
            trigger('select', null, startDate, endDate, allDay, ev);
        }


        function daySelectionMousedown(ev) { // not really a generic manager method, oh well
            var cellDate = t.cellDate;
            var cellIsAllDay = t.cellIsAllDay;
            var hoverListener = t.getHoverListener();
            var reportDayClick = t.reportDayClick; // this is hacky and sort of weird
            if (ev.which == 1 && opt('selectable')) { // which==1 means left mouse button
                unselect(ev);
                var _mousedownElement = this;
                var dates;
                hoverListener.start(function (cell, origCell) { // TODO: maybe put cellDate/cellIsAllDay info in cell
                    clearSelection();
                    if (cell && cellIsAllDay(cell)) {
                        dates = [cellDate(origCell), cellDate(cell)].sort(cmp);
                        renderSelection(dates[0], dates[1], true);
                    } else {
                        dates = null;
                    }
                }, ev);
                $(document).one('mouseup', function (ev) {
                    hoverListener.stop();
                    if (dates) {
                        if (+dates[0] == +dates[1]) {
                            reportDayClick(dates[0], true, ev);
                        }
                        reportSelection(dates[0], dates[1], true, ev);
                    }
                });
            }
        }


    }

    function OverlayManager() {
        var t = this;


        // exports
        t.renderOverlay = renderOverlay;
        t.clearOverlays = clearOverlays;


        // locals
        var usedOverlays = [];
        var unusedOverlays = [];


        function renderOverlay(rect, parent) {
            var e = unusedOverlays.shift();
            if (!e) {
                e = $("<div class='fc-cell-overlay' style='position:absolute;z-index:3'/>");
            }
            if (e[0].parentNode != parent[0]) {
                e.appendTo(parent);
            }
            usedOverlays.push(e.css(rect).show());
            return e;
        }


        function clearOverlays() {
            var e;
            while (e = usedOverlays.shift()) {
                unusedOverlays.push(e.hide().unbind());
            }
        }


    }

    function CoordinateGrid(buildFunc) {

        var t = this;
        var rows;
        var cols;


        t.build = function () {
            rows = [];
            cols = [];
            buildFunc(rows, cols);
        };


        t.cell = function (x, y) {
            var rowCnt = rows.length;
            var colCnt = cols.length;
            var i, r = -1, c = -1;
            for (i = 0; i < rowCnt; i++) {
                if (y >= rows[i][0] && y < rows[i][1]) {
                    r = i;
                    break;
                }
            }
            for (i = 0; i < colCnt; i++) {
                if (x >= cols[i][0] && x < cols[i][1]) {
                    c = i;
                    break;
                }
            }
            return (r >= 0 && c >= 0) ? { row: r, col: c} : null;
        };


        t.rect = function (row0, col0, row1, col1, originElement) { // row1,col1 is inclusive
            var origin = originElement.offset();
            return {
                top: rows[row0][0] - origin.top,
                left: cols[col0][0] - origin.left,
                width: cols[col1][1] - cols[col0][0],
                height: rows[row1][1] - rows[row0][0]
            };
        };

    }

    function HoverListener(coordinateGrid) {


        var t = this;
        var bindType;
        var change;
        var firstCell;
        var cell;


        t.start = function (_change, ev, _bindType) {
            change = _change;
            firstCell = cell = null;
            coordinateGrid.build();
            mouse(ev);
            bindType = _bindType || 'mousemove';
            $(document).bind(bindType, mouse);
        };


        function mouse(ev) {
            var newCell = coordinateGrid.cell(ev.pageX, ev.pageY);
            if (!newCell != !cell || newCell && (newCell.row != cell.row || newCell.col != cell.col)) {
                if (newCell) {
                    if (!firstCell) {
                        firstCell = newCell;
                    }
                    change(newCell, firstCell, newCell.row - firstCell.row, newCell.col - firstCell.col);
                } else {
                    change(newCell, firstCell);
                }
                cell = newCell;
            }
        }


        t.stop = function () {
            $(document).unbind(bindType, mouse);
            return cell;
        };


    }

    function HorizontalPositionCache(getElement) {

        var t = this,
		elements = {},
		lefts = {},
		rights = {};

        function e(i) {
            return elements[i] = elements[i] || getElement(i);
        }

        t.left = function (i) {
            return lefts[i] = lefts[i] === undefined ? e(i).position().left : lefts[i];
        };

        t.right = function (i) {
            return rights[i] = rights[i] === undefined ? t.left(i) + e(i).width() : rights[i];
        };

        t.clear = function () {
            elements = {};
            lefts = {};
            rights = {};
        };

    }
	
   

/********************************
* Mini calendar Script 
*
* First plugin 
*
* @author Maarten Hus
*
*
* Mini calendar Script 
*/
    var events = {};
    $.fn.ical = function(options){
        $.fn.ical.defaults = {
           daynames: ['Su','Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], //default short names for the days of the week
           monthnames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

           startdate: new Date(), // The date the calender should take as start point
       
		   events: {},
		   startOnSunday: true,
		   
           beforeDay: function (insdate) {},
           beforeMonth: function(insdate) {},
           beforeYear: function(insdate) {}
        };
        
        var options = $.extend({}, $.fn.ical.defaults, options);
        return this.each(function(){
            var obj = $(this); //get the object
            events = options.events;
            var date = new Date();
			var insdate = options.startdate; //The date that gets used for calculating the month
	  		setYMD(insdate, options.year, options.month, options.day);
			createCalendar(obj, insdate);
        });
        
    function setYMD(date, y, m, d) {
		if (y !== undefined && y != date.getFullYear()) {
            date.setDate(1);
            date.setMonth(0);
            date.setFullYear(y);
        }
        if (m !== undefined && m != date.getMonth()) {
            date.setDate(1);
            date.setMonth(m);
        }
        if (d !== undefined) {
            date.setDate(d);
        }
    }	 	/**
        * Create the calendar
        */
        function createCalendar(obj, insdate){
            obj.html('');
            createNavigation(obj, insdate);
            createTable(obj); //create table
            addDatesToTable(obj, insdate);
            if (options.ToolTip === 1 || options.DaysEvents === 1) {
				codabubbleMini();
				$("#eventsBody" + options.bodyDisplayID).show();
				
			};
   			var eventBodyContent = $('.today').children().children().html();
			$("#eventsBody" + options.bodyDisplayID).html(eventBodyContent);

			if (options.DaysEvents != 1) {
				$("#eventsBody" + options.bodyDisplayID).hide();
				
			};
			
        };
        
        /**
        * Create the navigation and handle its clicks
        */
        function createNavigation(obj, insdate){

			
			//var prevUrl  = "<a href='" + options.prevUrl + "'  title='Previous Month'> < </a>";
			var dateYearMonth = insdate.getFullYear() + "" +  (formatMonth(insdate.getMonth()));
			var nextYearMonth = options.year + "" + formatMonth(options.month);
            if (options.future == true) {
                var nextUrl  = "<a href='" + options.nextUrl + "' title='Next Month'> > </a>";
			    var prevUrl  = ""
			    if (nextYearMonth <= dateYearMonth) {
				    var nextUrl  = " > ";
			    }
			    if (nextYearMonth < dateYearMonth) {
				    var prevUrl  = " < ";
			    }
			
			} else {
                var nextUrl  = "";
			    var prevUrl  = ""

            }
			
			obj.append("<div id='ical-topnav'><span id ='icalprev' title='Previous Month'>" + prevUrl + "</span><a href='"+ options.currentMonth + ",00.html' title='"+ options.monthnames[insdate.getMonth()] +"'><span id = 'currentmonth'>"+ options.monthnames[insdate.getMonth()] +"</span> <span id = 'currentyear' >"+ insdate.getFullYear() +"</span></a><span id ='icalnext' title='Next Month'>" + nextUrl + "</span></div>");
                      //"<div><span id ='icalprev'><</span><span id ='icalnext'>></span></div>");
            $("#icalnext", obj).click(function()
            {
                var month = insdate.getMonth() + 1;
                
                if (month > 11)
                {
                    month = 0;
                    var year = insdate.getFullYear() + 1;
                    options.beforeYear(formatDate(year, month, 1));
                }
                else
                {
                    var year = insdate.getFullYear();    
                }
                
                options.beforeMonth(formatDate(year, month, 1));
                
                date = new Date(year, month, 1);
                createCalendar(obj, date);
            }); 
            
            $("#icalprev", obj).click(function()
            {
                var month = insdate.getMonth() - 1;
                
                if (month < 0)
                {
                    month = 11;
                    var year = insdate.getFullYear() - 1;
                    options.beforeYear(formatDate(year, month, 1));
                }
                else
                {
                    var year = insdate.getFullYear();    
                }
                
                options.beforeMonth(formatDate(year, month, 1));
                
                date = new Date(year, month, 1);
                createCalendar(obj, date);
            });         
        };
        
        /**
        * Create the table for the calendar
        */
        function createTable(obj){
            obj.append("<table class='icaltable' cellspacing='0'><thead><tr></tr></thead></table>"); //add a table 
            
            for (var i = 0; i < options.daynames.length; i++) 
            {
			   $(".icaltable tr", obj).append("<th>"+ options.daynames[i] +"</th>"); //add the day header
            }
        };
        
        function addDatesToTable(obj, insdate){
           
			var month = insdate.getMonth();
            var year  = insdate.getFullYear();
            
            var days = getDaysInMonth(year, month);
            var first = getFirstDayOfMonth(year, month); // 0 - 6
            var last = getLastDayOfMonth(year, month, days);// 0 - 6 
            
            var afterpadding = 6 - last; // week minus the last day of the month = afterpadding
            
            var firstrow = true;
            
			var startOnSunday = 0;
						
			if (options.startOnSunday){
				if (first == 6)
				{
					startOnSunday = -6;
				}
				else
				{
					startOnSunday = 1;
				}
			}   
			
            for (var i = 1; i <= days; i++) //each day in month
            {
   				var urlTitleTxtStr = "";
				var formatDisplaydate = "<span class='selEventDate'>" + formatDateReadable(month, i, year) + "</span>";
				
			
				if ((first + i - 1 + startOnSunday) % 7 === 0 || firstrow === true ) //add new tr for each new monday if i is zero
                {
                    $(".icaltable", obj).append("<tr></tr>");
                }
                
                for(var j = 0; j < first + startOnSunday && firstrow; j++) //add pre padding
                {
                    $(".icaltable tr:last", obj).append("<td class ='padding'></td>");
                }
                
                firstrow = false; //no more pre padding
                
                var month = getMonthNumber($("#currentmonth", obj).text());
                var year = $("#currentyear", obj).text();
				var formatdate = formatDate(year, month, i);
                var jsondates  = getevents(formatdate);
           	
                if (jsondates.length === 0)
                {
                    options.beforeDay(formatdate);
                    $(".icaltable tr:last", obj).append("<td id='"+formatdate+"' class='date_has_no_event'>"+i+"</td>"); //add day
                }
                else
                {
					var firstEvent = true;
					var eventLimit = 10
					
					for (var k = 0; k < jsondates.length; k++)
					{
						var datejson = jsondates[k];
						options.beforeDay(formatdate);
						
						//Format Start date
						var eventdateTime = datejson.date.split(' ');
						var eventdate = eventdateTime[0].split('-');	
						var eventStartDate = eventdate[1]+'/'+eventdate[2]+'/'+eventdate[0];
						//Format end date.
						var eventdateEndTime = datejson.end.split(' ');
						var eventdateEnd = eventdateEndTime[0].split('-');	
						var eventEndDate = eventdateEnd[1]+'/'+eventdateEnd[2]+'/'+eventdateEnd[0];
						var evEndTitle = " - "
						var evStartTitle = "Date: "
						if (eventStartDate != eventEndDate && eventdateTime === eventdateEndTime) {
								//endDate = "All Day Event";
								//evEndTitle = " - "
								eventdateTime = "All Day Event";
								eventdateEndTime = "";
							}
							if (eventStartDate == eventEndDate) {
								dateSep = "";
								evStartTitle = "Date: "
								if (datejson.starttime === datejson.endtime) {
									dateSep = "";
									//startDate = "";
									evStartTitle = "Date: "
									eventEndDate = "All Day Event";
									evEndTitle = "Time: "
									eventdateTime = "";
									eventdateEndTime = "";
									
								} else {
									eventEndDate = datejson.starttime + " - " + datejson.endtime + " ";
									evStartTitle = "Date: "
									evEndTitle = "Time: ";				
								}				
							}					
				

						urlTitleTxtStr += htmlEscape(datejson.title) + " \n " + evStartTitle +  eventStartDate +  " \n " + evEndTitle + eventEndDate + " \n \n "; //Description: " + datejson.desc				
						
						var str = "<li><span class='popupeventtitle'>" + datejson.title +"</span>" +
						"<span class='popupeventdate'>" + evStartTitle + eventStartDate + evEndTitle + eventEndDate + "</span>" +
						"<span class='desc'><b>Description: </b>"+ datejson.desc + "</span></li>"
						
						if (firstEvent)
						{
						
							$(".icaltable tr:last", obj).append("<td class='date_has_event' id = '"+ formatdate +"'><a href='"+ options.currentMonth + "_" + year + "_" + formatMonth(month) + ",00.html?view=agendaDay&agendadate=" + formatdate + "' id = '"+ formatdate +"url' title='"+ urlTitleTxtStr +"'>"+i+"</a><div class='events'><ul id ='ul-"+ formatdate +"'>"+ formatDisplaydate + str +"</ul></div></td>"); //add day  
							firstEvent = false;
							
						}
						else
						{
							$("#ul-" + formatdate, obj).append(str);
						}
					}
					addUrlTitleText(urlTitleTxtStr,formatdate);
                }
            };
            
			if (options.startOnSunday){
				startOnSunday = 1;
			} 

            for (var i = 0; i < afterpadding - startOnSunday; i++) //add after padding
            {
                $(".icaltable tr:last", obj).append("<td class='padding'></td>");
            }
            
            highlightToday(obj);
        };
        
        function getMonthNumber(month){
            for (var i = 0; i < options.monthnames.length; i++)
            {
                if (options.monthnames[i] === month)
                {
               
					return i;
                }
            }
        };
        
        function getDaysInMonth(year, month){
            return 32 - new Date(year, month, 32).getDate();
        };
        
        function highlightToday(obj){
            var today = new Date();
            today = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
            $("#"+today, obj).addClass("today");
			
        };
        function addUrlTitleText(titleText,formatdate){
			$("#"+formatdate).attr("title",titleText);
			$("#"+formatdate +"url").attr("title",titleText);
			
		};
        function getevents(date){
			
			var results = [];
			
            for (var i = 0;  i < events.length; i++)
            {     
                
				var evaldate = evaluateEventDate(events[i]["date"], date);
				var evaldateEnd = evaluateEventDate(events[i]["end"], date);
               	var evalEventTitle = events[i]["title"]
				/////////////////////////
				// John Thompson - Check to see if this is a multi day event.
				if (evaldate < evaldateEnd  && evaldate <= date) {
					//Check to see if the end date has exceed the current date.
		
					if (evaldateEnd >= date) {
						evaldate = date;
					}
				};
				////////////////////////
				if (date === evaldate)
                {
					results.push(events[i]);
				}
            }
            
            return results;
        };
        function geteventsEnd(date){
			
			var results = [];
			
            for (var i = 0;  i < events.length; i++)
            {     
				var evaldate = evaluateEventDate(events[i]["end"], date);
				if (date === evaldate)
                {
                	results.push(events[i]);
				}
            }
            
            return results;
        };

        function evaluateEventDate(eventdate, date){
          
			var eventdateTime = eventdate.split(' ');
			var eventdate = eventdateTime[0].split('-');
			
            var date = date.split('-');
         
            if (eventdate[0] === 'yyyy')
            {
                eventdate[0] = date[0];
            }
            
            if (eventdate[1] === 'mm') 
            {
                eventdate[1] = date[1];
            }
            
            if (eventdate[2] === 'dd')
            {
                eventdate[2] = date[2];
            }
            
            return eventdate[0]+'-'+eventdate[1]+'-'+eventdate[2];
        };



        function getLastDayOfMonth(year, month, days){
            var date = new Date(year, month, days);
            if (date.getDay() == 0)//we start on monday!
            {
                return 6;
            }
            else
            {
                return date.getDay() -1;
            }
        };
            
        function getFirstDayOfMonth(year, month){
            var date = new Date(year, month, 1);
            if (date.getDay() == 0) //we start on monday!
            {
                return 6;
            }
            else
            {
                return date.getDay() -1;
            }
        };
        
        function formatDate (year, month, day){    
            return year+'-'+formatMonth(month)+'-'+formatDay(day);
        };

       function formatDateReadable (month,day,year){    
            return options.monthnames[month]+' '+formatDay(day)+', '+year;
        };
		        
        function formatMonth(month){
            month = month + 1;
            
            if (month < 10)
            {
                month = '0'+month;
            }
            
            return month; 
        };
        
        function formatDay(day){
            if (day < 10) 
            {
                day = '0'+day;
            }
            
            return day;
        };
        
        function codabubbleMini(){ //Stefano Verna
            $('.date_has_event').each(function () {
        		// options
        		var distance = 18;
        		var time = 250;
        		var hideDelay = 500;
				var eventBodyContent = '';
        		var hideDelayTimer = null;

        		// tracker
        		var beingShown = false;
        		var shown = false;
        		var trigger = $(this);
        		var popup = $('.events ul', this).css('opacity', 0);
       			// set the mouseover and mouseout on both element
        		
				$([trigger.get(0), popup.get(0)]).mouseover(function () {
        			
					// stops the hide event if we move from the trigger to the popup element
        			if (hideDelayTimer) clearTimeout(hideDelayTimer);

        			// don't trigger the animation again if we're being shown, or already visible
        			if (beingShown || shown) {
        				return;
        			} else {
        				beingShown = true;

        				// reset position of popup box
        				popup.css({
        					bottom: -20,
        					left: -76,
        					display: 'block' // brings the popup back in to view
        				})

        				// (we're using chaining on the popup) now animate it's opacity and position
        				.animate({
        					bottom: '+=' + distance + 'px',
        					opacity: 1
        				}, time, 'swing', function() {
        					// once the animation is complete, set the tracker variables
        					beingShown = false;
        					shown = true;
        				});
        			}
				
				 if (options.ToolTip === 0 || options.DaysEvents === 1) {
					var eventBodyContent = $('.events ul', this).html();
					$("#eventsBody" + options.bodyDisplayID).html(eventBodyContent);
					
					popup.css({
        					display: 'none' // brings the popup back in to view
        				})
				 } else {
				 
					$("#eventsBody" + options.bodyDisplayID).html();
				};
        		}).mouseout(function () {
        			// reset the timer if we get fired again - avoids double animations
        			if (hideDelayTimer) clearTimeout(hideDelayTimer);

        			// store the timer so that it can be cleared in the mouseover if required
        			hideDelayTimer = setTimeout(function () {
        				hideDelayTimer = null;
        				popup.animate({
        					bottom: '-=' + distance + 'px',
        					opacity: 0
        				}, time, 'swing', function () {
        					// once the animate is complete, set the tracker variables
        					shown = false;
        					// hide the popup entirely after the effect (opacity alone doesn't do the job)
        					popup.css('display', 'none');
        				});
        			}, hideDelay);
        		});
        	});  
        };
    };
    
    $.fn.ical.changeevents = function(array){
       events = array;
    };

})(jQuery);
