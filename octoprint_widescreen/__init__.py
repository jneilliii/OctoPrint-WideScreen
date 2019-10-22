# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin

class WidescreenPlugin(octoprint.plugin.SettingsPlugin,
                       octoprint.plugin.AssetPlugin,
                       octoprint.plugin.TemplatePlugin):

	##~~ SettingsPlugin mixin

	def get_settings_defaults(self):
		return dict(
			right_sidebar_items = []
		)

	##~~ AssetPlugin mixin

	def get_assets(self):
		return dict(
			js=["js/widescreen.js"],
			css=["css/widescreen.css"]
		)

	##~~ Softwareupdate hook

	def get_update_information(self):
		return dict(
			widescreen=dict(
				displayName="OctoPrint-WideScreen",
				displayVersion=self._plugin_version,

				# version check: github repository
				type="github_release",
				user="jneilliii",
				repo="OctoPrint-WideScreen",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/jneilliii/OctoPrint-WideScreen/archive/{target_version}.zip"
			)
		)

__plugin_name__ = "OctoPrint-WideScreen"
__plugin_pythoncompat__ = ">=2.7,<4"

def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = WidescreenPlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}

