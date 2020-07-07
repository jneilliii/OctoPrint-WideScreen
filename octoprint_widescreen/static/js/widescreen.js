/*
 * View model for OctoPrint-WideScreen
 *
 * Author: jneilliii
 * License: AGPLv3
 */
$(function() {
	function WidescreenViewModel(parameters) {
		var self = this;

		self.settingsViewModel = parameters[0];
		self.touchui = parameters[1];

		if (self.touchui && self.touchui.isActive()) {
			return
		}

		self.right_sidebar_items = ko.observableArray([]);
		self.available_sidebar_items = ko.observableArray([]);


		self.onBeforeBinding = function() {
			self.right_sidebar_items(self.settingsViewModel.settings.plugins.widescreen.right_sidebar_items());
		}

		self.onSettingsBeforeSave = function () {
			self.settingsViewModel.settings.plugins.widescreen.right_sidebar_items(self.right_sidebar_items());
		}

		self.onEventSettingsUpdated = function (payload) {
			// move panels to right sidebar
			ko.utils.arrayForEach(self.right_sidebar_items(), function(item) {
				$('#'+item+'_wrapper').appendTo('#right_sidebar');
			});
			// move panels to left sidebar
			ko.utils.arrayForEach(self.available_sidebar_items(), function(item) {
				$('#'+item+'_wrapper').appendTo('#sidebar');
			});
		}

		self.onAfterBinding = function(){
			$('div.container.octoprint-container > div.row > div.accordion.span4:first').children('div.accordion-group').each(function(){
				var data = $(this).attr('id').replace('_wrapper','');
				if(ko.toJS(self.right_sidebar_items()).indexOf(data) < 0){
					self.available_sidebar_items.push(data);
				}
			});
		}

		self.onAllBound = function(){
			// navbar adjustments
			$('#navbar > div.navbar-inner > div.container').css({'width':'100%'});
			$('#navbar > div.navbar-inner').css({'padding-left':'20px'});

			// main content adjustments
			$('div.container.octoprint-container').addClass('row-fluid');
			$('div.container.octoprint-container.row-fluid > div.row').css({'margin-left':'20px','padding-right':'20px'});

			// sidebar adjustments
			$('div.container.octoprint-container > div.row > div.accordion.span4:first').removeClass('span4').addClass('span3');
			// $('#files div.row-fluid.upload-buttons > span.btn.btn-primary.fileinput-button.span6:nth-child(2) > span').text('Upload SD');

			// footer adjustments
			$('ul#footer_version').css({'padding-left':'20px'});
			$('ul#footer_links').css({'padding-right':'20px'});

			// tabs adjustments
			$('div.container.octoprint-container > div.row > div.tabbable.span8').removeClass('span8').addClass('span6');

			// add new right sidebar
			$('div.container.octoprint-container > div.row').append('<div class="accordion span3" id="right_sidebar"></div>');

			// move panels to right sidebar
			ko.utils.arrayForEach(self.right_sidebar_items(), function(item) {
				$('#'+item+'_wrapper').appendTo('#right_sidebar');
			});
		}

		self.add_sidebar_item = function(data) {
			console.log(data);
			if(ko.toJS(self.right_sidebar_items()).indexOf(data) < 0){
				self.right_sidebar_items.push(data);
				self.available_sidebar_items.remove(data);
			}
		}

		self.remove_sidebar_item = function(data) {
			console.log(data);
			if(ko.toJS(self.available_sidebar_items()).indexOf(data) < 0){
				self.right_sidebar_items.remove(data);
				self.available_sidebar_items.push(data);
			}
		}

	}

	OCTOPRINT_VIEWMODELS.push({
		construct: WidescreenViewModel,
		dependencies: ["settingsViewModel", "touchUIViewModel"],
		optional: ["touchUIViewModel"],
		elements: ["#settings_plugin_widescreen"]
	});
});
