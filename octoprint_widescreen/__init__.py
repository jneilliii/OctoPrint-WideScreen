# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin

class WidescreenPlugin(octoprint.plugin.SettingsPlugin,
                       octoprint.plugin.AssetPlugin,
                       octoprint.plugin.TemplatePlugin):

	##~~ SettingsPlugin mixin

	def get_settings_defaults(self):
		return dict(
			right_sidebar_items = [],
			use_resolution=False,
			resolution_threshold=480,
			use_useragent=False,
		)

	##~~ AssetPlugin mixin

	def get_assets(self):
		return dict(
			js=["js/jquery-ui.min.js","js/knockout-sortable.1.2.0.js","js/widescreen.js"],
			css=["css/widescreen.css"]
		)

	def get_template_configs(self):
		return [dict(type="settings", custom_bindings=True)]

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
                stable_branch=dict(
                    name="Stable", branch="master", comittish=["master"]
                ),
                prerelease_branches=[
                    dict(
                        name="Release Candidate",
                        branch="rc",
                        comittish=["rc", "master"],
                    )
                ],

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

