/**
 * jQuery meanMenu v1.7.3
 * Copyright (C) 2012 Chris Wharton (themes@meanthemes.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * THIS SOFTWARE AND DOCUMENTATION IS PROVIDED "AS IS," AND COPYRIGHT
 * HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR
 * FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE
 * OR DOCUMENTATION WILL NOT INFRINGE ANY THIRD PARTY PATENTS,
 * COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.COPYRIGHT HOLDERS WILL NOT
 * BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL
 * DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENTATION.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://gnu.org/licenses/>.
 *
 * Find more information at http://www.meanthemes.com/plugins/meanmenu/
 *
 */
(function ($) {
    $.fn.meanmenu = function (options) {
        var defaults = {
            meanMenuTarget: jQuery(this), // Target the current HTML markup you wish to replace
            meanMenuClose: "<span /><span /><span /><div>MENU</div>", // single character you want to represent the close menu button
            //meanMenuClose: "&#8801;&#8801;&nbsp;MENU", // single character you want to represent the close menu button
           //	meanMenuCloseSize: "18px", // set font size of close button
            meanMenuOpen: "<span /><span /><span /><div>MENU</div>", // text/markup you want when menu is closed
           // meanMenuOpenText: "<div>MENU</div>", // text/markup you want when menu is closed
           	meanRevealPosition: "left", // left right or center positions
            meanRevealPositionDistance: "0", // Tweak the position of the menu
            meanRevealColour: "none", // override CSS colours for the reveal background
            meanRevealHoverColour: "#000", // override CSS colours for the reveal hover
            meanScreenWidth: "959", // 480 set the screen width you want meanmenu to kick in at
            meanNavPush: "", // set a height here in px, em or % if you want to budge your layout now the navigation is missing.
            meanShowChildren: true, // true to show children in the menu, false to hide them
            meanRemoveAttrs: false, // true to remove classes and IDs, false to keep them
			rightNav_width:"15.625%",
			rightNavSite:false,
			mainNav:"5%",
			main_width:"65%",
			mainSite:false,
			menu_width:"15.625%",
			horMenu: false,
			social_nav_horizontalRD:"",
			superTopException: false,
			secondary_social_nav:false,
			topNavSearch_position: "-196px",
			menu_display: "block",
        };
        var options = $.extend(defaults, options);
        
        // get browser width
        currentWidth = jQuery(window).width();
		jQuery("#screenwidth").attr('id','menubannerLinks');
		var sitePath = window.location.pathname.split('/')[1];
		var sitePath2 = window.location.pathname.split('-')[2];
		var sitePathContentID = window.location.pathname.split('-')[3];
		var sitePathListOID = window.location.pathname.split('-')[5];
		var sitePathSPOID = "";
		if (sitePathListOID != "" && sitePathListOID != null && sitePathListOID != undefined) {
			sitePathSPOID = sitePathListOID.split(',')[0];
		}
		var sitePath3 = ""
		if (sitePath2 != undefined) {
			var sitePath3 = sitePath2.split('_')[0];
			var subNavHtml = $('#' + sitePath3).html()
		}
		return this.each(function () {
            var meanMenu = options.meanMenuTarget;
            var meanReveal = options.meanReveal;
            var meanMenuClose = options.meanMenuClose;
            var meanMenuCloseSize = options.meanMenuCloseSize;
            var meanMenuOpen = options.meanMenuOpen;
			//var meanMenuOpenText = options.meanMenuOpenText;
            var meanRevealPosition = options.meanRevealPosition;

            var meanRevealPositionDistance = options.meanRevealPositionDistance;
            var meanRevealColour = options.meanRevealColour;
            var meanRevealHoverColour = options.meanRevealHoverColour;
            var meanScreenWidth = options.meanScreenWidth;
            var meanNavPush = options.meanNavPush;
            var meanTarget = jQuery(this);
            var meanRevealClass = ".meanmenu-reveal";
            meanShowChildren = options.meanShowChildren;
            var meanRemoveAttrs = options.meanRemoveAttrs;
            var rightNav_width = options.rightNav_width;
			var rightNavSite = options.rightNavSite;
			var mainNav = options.mainNav;
			var mainNavSite = options.mainNavSite;
            var main_width = options.main_width;
			var mainSite = options.mainSite;
			var social_nav_horizontalRD = options.social_nav_horizontalRD;
			var secondary_social_nav = options.secondary_social_nav;
			var superTopException =  options.superTopException;
			var menu_width = options.menu_width;
			var topNavSearch_position = options.topNavSearch_position;
			var topNavSearch_width = options.topNavSearch_width;
			var superTop_txtcolor = options.superTop_txtcolor;
			var superTop_txtHovercolor = options.superTop_txtHovercolor;
			var menu_display = options.menu_display;
			var horMenu = options.horMenu;
			if (sitePath2 !=  undefined && sitePath2 !=  null  && sitePath2 !=  "" && horMenu == true ) {
				if (subNavHtml  !=  undefined && subNavHtml !=  null  && subNavHtml !=  "") {
					$('#contentWrapper').prepend('<div id="sub_nav">'+$('#' + sitePath3).html()+'</div>');
					$('#contentWrapper').css("margin-top","0");
				}
				//$('#contentWrapper').css("background-color","#fff");
			} else {
				if (sitePathContentID != "" && sitePathContentID !=  undefined && sitePathContentID !=  null &&  horMenu == true ||  sitePathSPOID != "") {
					$('#main.page.TW').css("background","#fff");
					//$('#contentWrapper').css("background-color","#fff");
					//$('#contentWrapper').css("margin-top","0");
				}
			}
			//detect known mobile/tablet usage
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/Blackberry/i)) || (navigator.userAgent.match(/Windows Phone/i))) {
                
				var isMobile = true;
				jQuery('#mobileCookie').css("display","none"); 
				jQuery('.copyright').append(jQuery('#mobileCookie').html());
				if ((navigator.userAgent.match(/iPhone/i))) {
					//currentWidth = 320;
				}
            }
            if (secondary_social_nav == true) {
					//jQuery('#menu').after('<div class="social_nav" />');
					jQuery('#menu').after('<div id="social_nav">'+jQuery('#social_nav_horizontalRD').html()+'</div>');
					//jQuery('#social_nav_horizontalRD').content('test');
				}
            function meanCentered() {
            	if (meanRevealPosition == "center") {
	            	var newWidth = jQuery(window).width();
	            	var meanCenter = ( (newWidth/2)-22 )+"px";
	            	meanRevealPos = "left:" + meanCenter + ";right:auto;";
	            	
	            	if (!isMobile) {	            	
	            		jQuery('.meanmenu-reveal').css("left",meanCenter); 
	            	} else {
		            	jQuery('.meanmenu-reveal').animate({
		            	    left: meanCenter
		            	});
	            	}
            	}
            }
            
            menuOn = false;
            meanMenuExist = false;
            
            if (meanRevealPosition == "right") {
                meanRevealPos = "right:" + meanRevealPositionDistance + ";left:auto;";
            }
            if (meanRevealPosition == "left") {
                meanRevealPos = "left:" + meanRevealPositionDistance + ";right:auto;";
            } 
            // run center function	
            meanCentered();
            
            // set all styles for mean-reveal
            meanStyles = "background:"+meanRevealColour+";color:"+meanRevealColour+";"+meanRevealPos;

            function meanInner() {
                // get last class name
                navOpen = $navreveal.attr('class').split(' ').slice(-1);
                if (navOpen == "meanclose") {
                    $navreveal.html(meanMenuClose);
                } else {
                    $navreveal.html(meanMenuOpen);
                }
            }
            
            //re-instate original nav (and call this on window.width functions)
            function meanOriginal() {
				jQuery('.mean-bar,.mean-push').remove();
            	jQuery('#superTop').removeClass("mean-container");
            	jQuery(meanMenu).show();
				jQuery('#menu').css('display',menu_display);
				jQuery('#menu').css('width',menu_width);
				jQuery('#mainnav').attr('id','nav');
				jQuery('#topnav').css('display','block');
				jQuery('#topNavSearch').css('position','relative');
				jQuery('#topNavSearch').css('z-index','100');
				jQuery('#topNavSearch').css('top',topNavSearch_position);
				jQuery('#topNavSearch').css("right","0px");
				jQuery('.topnavlinksmenu').attr('class','topnavlinks');
				jQuery('#menubannerLinks').css("display","none");
				jQuery('#rightNav').css('float','right');
				jQuery('#menu-left-link').css("display","none");			
				jQuery('#sub_nav').css('display',menu_display);
				/*************************/
				/* SuperTop */
				//jQuery('#superTop').css('height',superTop_height);
				//jQuery('#superTop').css('background-color',superTop_bgcolor);
				/************/
				// We are on the home page.
				if (sitePath2 == undefined) {
					jQuery('#rightNav').css('width',rightNav_width);
					jQuery('.DW.page').css('width',main_width);
					if (social_nav_horizontalRD != "") {
						jQuery('#social_nav_horizontalRD').css('width',social_nav_horizontalRD);
						jQuery('#social_nav_horizontalRD').css('max-width',social_nav_horizontalRD);
						jQuery('#social_nav').css('width',social_nav_horizontalRD);
						jQuery('#social_nav').css('max-width',social_nav_horizontalRD);
					}
				} else {
					// If not on Homepage check sitewide value.
					if (rightNavSite == false) {
						jQuery('#rightNav').css('width',"15.625%");
					} else {
						jQuery('#rightNav').css('width',rightNav_width);
					}
					if (mainSite == false) {
						jQuery('.DW.page').css('width','66%');
						jQuery('.DW.page').css('display','block');
						//annie
						//jQuery('#main').css('left','150px');
						if (horMenu == true) {
							jQuery('#main.page.TW').css('width','80%');
							jQuery('#main.page.TW').css('float','left');
							jQuery('.DW.page').css('width','55%');	
						}
					} else {
						if (horMenu == true) {
							jQuery('.DW.page').css('width','59%');
						} else {
							jQuery('.DW.page').css('width',main_width);
						}
						jQuery('.DW.page').css('display','block');
					}
				}
				
				if (superTopException == true) {
					jQuery('#superTop').css('display','none');
				}
				if (secondary_social_nav == true) {
					//alert(jQuery('#social_nav').html());
					//jQuery('#social_nav').html(jQuery('#social_nav_horizontalRD').html());
				}
				
				menuOn = false;
            	meanMenuExist = false;
				
            }
            
            //navigation reveal 
            function showMeanMenu() {
                if (currentWidth <= meanScreenWidth) {
                	meanMenuExist = true;
                	// add class to body so we don't need to worry about media queries here, all CSS is wrapped in '.mean-container'
                	jQuery('#superTop').css('display','block');
					jQuery('.mean-bar,.mean-push').remove();
					jQuery('#superTop').addClass("mean-container");
					//jQuery('#superTop').css('background-color',superTop_bgcolor);
                	jQuery('#menu').css('display','none');
					jQuery('#sub_nav').css('display','none');
					jQuery('#topnav').css('display','block');
					//jQuery('#menubannerLinks').css('display','block');
					jQuery('#menubannerLinks').html(jQuery('#bannerLinks').html());
					
					//jQuery('#topNavSearch').css('width','65%');

					//jQuery('#superTop').css('height','auto');
					
					if ($('#nav').length) {				
						$('#nav').attr('id','mainnav');
					};
					jQuery('.mean-container').prepend('<div class="mean-bar"><a href="javascript:void(0)" id="navreveal" class="meanmenu-reveal" style="'+meanStyles+'" title="Show Navigation">Show Navigation</a><nav class="mean-nav"></nav></div>');
                  	jQuery('#main').append('<div id="menu-left-link">');
                    //push meanMenu navigation into .mean-nav
                    var meanMenuContents = jQuery(meanMenu).html();
                    jQuery('.mean-nav').html(meanMenuContents);
            		// remove all c	lasses from EVERYTHING inside meanmenu nav
            		jQuery('.mean-nav').after('<div id="topnavmenu" />')
					jQuery('#mainnav').append(jQuery('#TOP_NAV_LINKS').html());
					jQuery('#mainnav').append(jQuery('#menubannerLinks').html());

					if(meanRemoveAttrs) {
            			jQuery('nav.mean-nav *').each(function(index) {
            				jQuery(this).removeAttr("class");
            				jQuery(this).removeAttr("id");
            			});
            		}
                    
                    // push in a holder div (this can be used if removal of nav is causing layout issues)
                    jQuery(meanMenu).before('<div class="mean-push" />');
                    jQuery('.mean-push').css("margin-top",meanNavPush);
                    					
                    // hide current navigation and reveal mean nav link
                    jQuery(meanMenu).hide();
                    jQuery(".meanmenu-reveal").show();
					
                    // turn 'X' on or off 
                    jQuery(meanRevealClass).html(meanMenuOpen);
                    $navreveal = jQuery(meanRevealClass);
                    
                    //hide mean-nav ul
                    jQuery('.mean-nav ul').hide();
                    // hide sub nav
						if(meanShowChildren) {
							jQuery('.mean-nav ul ul').show();
							jQuery('.mainnav ul ul').show();
							
						} else {
							jQuery('.mean-nav ul ul').hide();
							jQuery('.mainnav ul ul').hide();
						}
                    $navreveal.removeClass("meanclose");
					
					//  Change Michigan.gov to Mi.gov when the screen width gets to 475
					if (currentWidth < 960) {
							jQuery('#menubannerLinks').html(jQuery('#bannerLinks').html());
							jQuery('div#menubannerLinks').css('background-color','#505060');
							jQuery('#topNavSearch').css("top","0px");
							jQuery('#topNavSearch').css("position","relative");
							jQuery('#topnav').css('display','none');
							jQuery('.DW.page').css('width','98%');
							jQuery('#rightNav').css('width','98%');
							//anne
							jQuery('#main').css('left','0px');
							//jQuery('#superTop').css('background-color',superTop_bgcolor);
							jQuery('#menu-left-link').html(jQuery('#menu').html());
							jQuery('#menu-left-link').css('display','block');
							jQuery('#menu-left-link').css('padding','10px');
					} else if (currentWidth < 768) {
						if (currentWidth > 479) {
							jQuery('#menubannerLinks').html(jQuery('#bannerLinks').html());
							jQuery('#menubannerLinks').css('display','none');
							jQuery('#bannerHolder').style("display","none");
							jQuery('#menu-left-link').html(jQuery('#menu').html());
							//jQuery('#superTop').css('background-color',superTop_bgcolor);
							
						} else {
							jQuery('#menubannerLinks').css('display','none');
							jQuery('#menu-left-link').html(jQuery('#menu').html());	
						}
							jQuery('#bannerLinks li').css('display','none');	
							jQuery('#rightNav').css('width','30%');
							jQuery('#migovlink').css('display','none');	
							jQuery('#rightNav').css('float','none');
							jQuery('#rightNav').css('width','96%');
							jQuery('.DW.page').css('width','95%');
							jQuery('#menu-left-link').html(jQuery('#menu').html());
							//jQuery('#superTop').css('background-color',superTop_bgcolor);
							jQuery('#topnav').css('display','none');
					} else if (currentWidth < 481 ) {
							jQuery('#bannerLinks').css('display','none');	
							jQuery('#menubannerLinks').html("");
							jQuery('#rightNav').css('float','none');
							jQuery('#rightNav').css('width','96%');
							jQuery('.DW.page').css('width','95%');
							//jQuery('#superTop').css('background-color',superTop_bgcolor);
							jQuery('#topnav').css('display','none');
							jQuery('#topNavSearch').css("right","-10px");
							jQuery('#topNavSearch').css("float","none");
							jQuery('#topNavSearch').css("position","relative");
							jQuery('#menu-left-link').html(jQuery('#menu').html());
			
					}
					
                    jQuery($navreveal).click(function(){
	            		if(menuOn == false) {
	                        $navreveal.toggleClass('meanclose');
	                        $navreveal.css('text-align', 'left');
	                        $navreveal.css('text-indent', '0');
	                        $navreveal.css("font-size", meanMenuCloseSize);
							jQuery('#menu').css('display','none');
	                        meanInner();
	                        jQuery('.mean-nav ul:first').slideDown();
	                        menuOn = true;
	                    } else {
	                    	$navreveal.html(meanMenuOpen);
	                    	$navreveal.toggleClass('meanclose');
	                    	meanInner();
							jQuery('#menu').css('display','none');
	                    	jQuery('.mean-nav ul:first').slideUp();
							
	                    	menuOn = false;
	                    }    
                    });
                    
                } else {
                	meanOriginal();
					
                }	
            } 


            showMeanMenu();
            if (!isMobile) {
                //reset menu on resize above meanScreenWidth
                	jQuery(window).resize(function () {
                    currentWidth = jQuery(window).width();
				
				
                  // Debugging only. Comment out for Productions
				   //jQuery('#query').attr('placeholder',currentWidth);

					if (currentWidth > meanScreenWidth) {
                        meanOriginal();
                    } else {
                    	meanOriginal();
                    }	
                    if (currentWidth <= meanScreenWidth) {
                        showMeanMenu();
                        meanCentered();
                    } else {
                    	meanOriginal();
                    }	
                });
            }

       		// adjust menu positioning on centered navigation     
            window.onorientationchange = function() {
            	meanCentered();
            	// get browser width
            	currentWidth = jQuery(window).width();
            	if (currentWidth >= meanScreenWidth) {
            		meanOriginal();
            	}
            	if (currentWidth <= meanScreenWidth) {
            		if (meanMenuExist == false) {
            			showMeanMenu();

						
            		}
            	}
            }
            
        });
    };
})(jQuery);

//ADDITIONAL PLUGINS
//IMAGE MAP ADJUSTOR PLUGIIN
$(document).ready(function(e) {

		 $('img.imgMap').rwdImageMaps();

	//SIMPLE FORM VALIDATOR
// validate the form when it is submitted
		$(".cmxForm").validate();
		
//FIND IN PAGE PLUGIN
    $("#filter").keyup(function(){
        var filter = $(this).val(), count = 0;
        $(".contentList li").each(function(){
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();
            } else {
                $(this).show();
                count++;
            }
        });
         var numberItems = count;
        $("#filter-count").text("Number of Items=  "+count);
    });
// TOGGLE BODY COMPONENT PLUGIN
		  $(".showDetail .flip").click(function(){
			if ($('.faqdetails').is(':visible')){
			   $('.faqdetails').slideUp();
			  
			}			
			if ($(this).next('.faqdetails').is(':visible')){
				$(this).next(".faqdetails").slideUp();
				
			} else {
			
			if ($(this).next('.faqdetails').is(':hidden')){
			   $(this).next(".faqdetails").slideDown();
			
			
			};
			};
			return false;
		  });
	
//TOGGLE-DESC STYLE PLUGIN	
		$('.toggleList .shortdesc').hide()	
	  	$(".toggleList .bodylinks").click(function(){
			if ($('.shortdesc').is(':visible')){
			   $('.shortdesc').slideUp();
			  
			}			
			if ($(this).next('.shortdesc').is(':visible')){
				$(this).next(".shortdesc").slideUp();
				
			} else {
			
			if ($(this).next('.shortdesc').is(':hidden')){
			   $(this).next(".shortdesc").slideDown();
			
			
			};
			};
			return false;
		  });
	//end plugin section
	
});
