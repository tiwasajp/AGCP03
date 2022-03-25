(function (window, $) {
    'use strict';

    function CallsController(user, client) {
        this._user = user;
        this._client = client;
        this._calls = user.getCalls();
        this._callsView = new window.CallsView({
            handleAudioMakeCall: function (remoteAddress) {
                if (remoteAddress) {
                    this.makeCall(remoteAddress, false);
                } else {

                }
            }.bind(this),
            handleVideoMakeCall: function (remoteAddress) {
                if (remoteAddress) {
                    this.makeCall(remoteAddress, true);
                } else {

                }
            }.bind(this)
        });

        this._call = undefined;
        this._callController = undefined;
        this._init();
    }


    CallsController.prototype = {
        /**
         * Init function for Calls service.
         * Registration callbacks releated with Calls service.
         */
        _init: function () {
            this._calls.addOnCallsServiceAvailableCallback(function () {
                console.log("Client:addOnCallsServiceAvailableCallback");
            });

            this._calls.addOnIncomingCallCallback(function (call) {
                console.log("Client:addOnIncomingCallCallback");
                var hasVideo = false;
                if (call.getIncomingVideoOffered() === AvayaClientServices.Services.Call.VideoNetworkSignalingType.SUPPORTED) {
                    hasVideo = true;
                }

                this._call = call;

                this._callController = new window.CallController(this._call, this._client, hasVideo, this._callsView);
            }.bind(this));

            this._calls.removeOnCallCreatedCallback(function () {
                console.log("Client:removeOnCallCreatedCallback");
            });
            this._calls.removeOnCallRemovedCallback(function () {
                console.log("Client:removeOnCallRemovedCallback ");
            });
        },

        /**
         * Function make a call.
         *
         * @param {String} remoteAddress
         * @param {Boolean} requiresToken
         * @param {Boolean} hasVideo
         */
        makeCall: function (remoteAddress, hasVideo) {
            var callCreationInfo = new AvayaClientServices.Services.Call.CallCreationInfo(remoteAddress, false, 'NORMAL_CUSTOMER');
            this._call = this._calls.createCall(callCreationInfo);
            this.startCall(hasVideo);
        },

        /**
         * Function start call.
         *
         * @param {Boolean} hasVideo
         */
        startCall: function (hasVideo) {
            if (hasVideo) {
                this._call.setVideoMode(AvayaClientServices.Services.Call.VideoMode.SEND_RECEIVE);
            }

            this._callController = new window.CallController(this._call, this._client, hasVideo, this._callsView);

            this._call.start();
        },
    };

    window.CallsController = CallsController;

})(window, jQuery);
