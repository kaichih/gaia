/* global getSupportedNetworkInfo, loadJSON*/
/**
 * Used to show Personalization/Sound panel
 */
define(function(require) {
  'use strict';

  var SettingsPanel = require('modules/settings_panel');
  var VolumeManager = require('panels/sound/volume_manager');
  var ToneManager = require('panels/sound/tone_manager');

  return function ctor_sound_panel() {
    var volumeManager = VolumeManager();
    var toneManager = ToneManager();

    return SettingsPanel({
      onInit: function(panel) {
        var _elements = {
          vibrationSetting: panel.querySelector('.vibration-setting'),
          toneSelector: panel.querySelector('.touch-tone-selector')
        };
        this._customize(_elements);

        var vmElements = {
          media: panel.querySelector('.volume.media input'),
          notification: panel.querySelector('.volume.notification input'),
          alarm: panel.querySelector('.volume.alarm input')
        };
        volumeManager.init(vmElements);

        var tmElements = {
          alertToneSelection: panel.querySelector('.alert-tone-selection'),
          ringToneSelection: panel.querySelector('.ring-tone-selection'),
          ringer: panel.querySelector('.ringer'),
          manageTones: panel.querySelector('.manage-tones-button')
        };
        toneManager.init(tmElements);
      },

      /**
       * Change UI based on conditions
       */
      _customize: function(elements) {
        // Show/hide 'Virate' checkbox according to device-features.json
        loadJSON(['/resources/device-features.json'], function(data) {
          elements.vibrationSetting.hidden = !data.vibration;
        });

        // Show/hide tone selector based on mozMobileConnections
        if (window.navigator.mozMobileConnections) {
          var mobileConnections = window.navigator.mozMobileConnections;
          // Show the touch tone selector if and only if we're on a CDMA network
          var toneSelector = elements.toneSelector;
          Array.prototype.forEach.call(mobileConnections,
            function(mobileConnection) {
              getSupportedNetworkInfo(mobileConnection, function(result) {
                toneSelector.hidden = toneSelector.hidden && !result.cdma;
              });
          });
        }
      }
    });
  };
});