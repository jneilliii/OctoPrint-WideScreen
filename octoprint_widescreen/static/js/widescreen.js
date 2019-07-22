/*
 * View model for OctoPrint-WideScreen
 *
 * Author: jneilliii
 * License: AGPLv3
 */
$(function() {
    function WidescreenViewModel(parameters) {
        var self = this;
		self.right_sidebar_items = ko.observableArray();
		self.available_sidebar_items = ko.observableArray();
		self.unassigned_sidebar_items = ko.computed(function() {
				//find out the categories that are missing from uniqueNames
				var differences = ko.utils.compareArrays(self.available_sidebar_items().sort(), self.right_sidebar_items().sort());
				//return a flat list of differences
				var results = [];
				ko.utils.arrayForEach(differences, function(difference) {
					if (difference.status === "deleted") {
						results.push(difference.value);
					}
				});
				return results;
			});

        self.settingsViewModel = parameters[0];
		
		self.onBeforeBinding = function() {
			self.right_sidebar_items(self.settingsViewModel.settings.plugins.widescreen.right_sidebar_items());
		}
		
		self.onEventSettingsUpdated = function (payload) {
			self.right_sidebar_items(self.settingsViewModel.settings.plugins.widescreen.right_sidebar_items());
		}
		
		self.onAfterBinding = function(){
			$('div.container.octoprint-container > div.row > div.accordion.span4:first').children('div.accordion-group').each(function(){
				var wrapper_name = $(this).attr('id');
				self.available_sidebar_items.push(wrapper_name.replace('_wrapper',''));
			});
		}

        self.onAllBound = function(){
			// main content adjustments
			$('div.container.octoprint-container').addClass('row-fluid');
			$('div.container.octoprint-container.row-fluid > div.row').css({'margin-left':'20px','padding-right':'20px'});

			// sidebar adjustments
			$('div.container.octoprint-container > div.row > div.accordion.span4:first').removeClass('span4').addClass('span3');
			// $('#files div.row-fluid.upload-buttons > span.btn.btn-primary.fileinput-button.span6:nth-child(2) > span').text('Upload SD');

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
			self.settingsViewModel.settings.plugins.widescreen.right_sidebar_items.push(ko.observable(data));
			self.right_sidebar_items(self.settingsViewModel.settings.plugins.widescreen.right_sidebar_items());
		}

		self.remove_sidebar_item = function(data) {
			self.settingsViewModel.settings.plugins.widescreen.right_sidebar_items.remove(data);
			self.right_sidebar_items(self.settingsViewModel.settings.plugins.widescreen.right_sidebar_items());
		}

    }

    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
        construct: WidescreenViewModel,
        dependencies: ["settingsViewModel"],
        elements: ["#settings_plugin_widescreen"]
    });
});
