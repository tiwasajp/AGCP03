(function (window, $) {
    'use strict';

    function CallView(template, handlers) {
        this._dtmf = '';
        this._template = template;

        this._init();
        this._addHandlers(handlers);
    }

    CallView.prototype = {
        _init: function(){
            this.callId = this._template.find(".callId");

            this.call = this._template.find(".call");
            this.headerView = $("#headerView");
            this.callService = $("#callService");

            this.localVideo = this._template.find(".localVideo");
            this.remoteVideo = this._template.find(".remoteVideo");
            
            this.muteBtn = this._template.find(".tel-muteBtn");
            this.unmuteBtn = this._template.find(".tel-unmuteBtn");

            this.blockVideoBtn = this._template.find(".blockVideoBtn");
            this.unblockVideoBtn = this._template.find(".unblockVideoBtn");

            this.callTimer = this._template.find(".callTimer");
            this.callState = this._template.find(".callState");

            this.callWithAddress = this._template.find(".callWithAddress");
            this.endCallBtn = this._template.find(".tel-dropCallBtn");
            this.videoPanel = this._template.find(".videoPanel");

            //this.errorLog = $("#errorLog");
        },

        _addHandlers: function(handlers){
            this.endCallBtn.on('click', function () {
                handlers.handleEndCall();
            });

            this.muteBtn.on('click', function () {
                handlers.handleMuteUnmute();
            });

            this.unmuteBtn.on('click', function () {
                handlers.handleMuteUnmute();
            });

            this.blockVideoBtn.on('click', function () {
                handlers.handleBlockUnblockVideo(true);
            });

            this.unblockVideoBtn.on('click', function () {
                handlers.handleBlockUnblockVideo(false);
            });
        },

        /**
         * Function show call created localy.
         *
         * @param {String} remoteAddress
         */
        showLocalCall: function (remoteAddress) {
            this.callWithAddress.text(remoteAddress);
            this.endCallBtn.show();
            this.muteBtn.show();
            this.unmuteBtn.hide();
        },

        /**
         * Function shows call control panel after the connection.
         *
         * @param {Object} call
         * @param {Boolean} hasVideo
         */
        showCallControlPanel: function (call, hasVideo) {
            console.log("Client: call established callback");
            this.callWithAddress.text(call.getRemoteAddress());
            this.endCallBtn.show();
            this.muteBtn.show();

            if (hasVideo) {
                console.log("Client: Video offer SUPPORTED");
                this.videoPanel.show();
                this.blockVideoBtn.show();
            } else {
                this.videoPanel.hide();
                this.blockVideoBtn.hide();
            }
        },

        /**
         * Function show call error.
         */
        showCallFailedInformation: function (err) {
            console.log("Client: Call failed");
            this.callService.hide();
            this.headerView.show();
            //this.errorLog.append('<div>Call failed: ' + err + '</div>');
            alert(`Makecall failed: ${err}`);

        },

        /**
         * Function show remote alerting.
         */
        showRemoteAlerting: function () {
            console.log("Client: Remote party alerting.......");
        },

        /**
         * Function hide call panel.
         */
        hideCallPanel: function () {
            console.log("Client: Call Ended Callback");
            this.endCallBtn.hide();
            this.videoPanel.hide();
            this.muteBtn.hide();
            this.unmuteBtn.hide();

            this.blockVideoBtn.hide();
            this.unblockVideoBtn.hide();

            this.callService.hide();
            this.headerView.show();
        },

        /**
         * Function disable Ignore button.
         */
        disableIgnoreButton: function () {
            this.ignoreCallBtn.prop('disabled', true);
        },

        /**
         * Function change hold/unhold button.
         *
         * @param {Boolean} isHolded
         */
        changeHoldUnholdBtn: function (isHolded) {
            if (isHolded) {
                this.holdBtn.hide();
                this.unholdBtn.show();
            } else {
                this.holdBtn.show();
                this.unholdBtn.hide();
            }
        },

        /**
         * Function change mute/unmute button.
         *
         * @param {Boolean} isMuted
         */
        changeMuteUnmuteBtn: function (isMuted) {
            if (isMuted) {
                this.muteBtn.hide();
                this.unmuteBtn.show();
            } else {
                this.muteBtn.show();
                this.unmuteBtn.hide();
            }
        },

        /**
         * Function change block video button.
         *
         * @param {Boolean} isAllowed
         */
        changeBlockBtn: function (isAllowed) {
            if (isAllowed) {
                this.blockVideoBtn.show();
            } else {
                this.blockVideoBtn.hide();
            }
        },

        /**
         * Function change unblock video button.
         *
         * @param {Boolean} isAllowed
         */
        changeUnblockBtn: function (isAllowed) {
            if (isAllowed) {
                this.unblockVideoBtn.show();
            } else {
                this.unblockVideoBtn.hide();
            }
        },

        /**
         * Function change call state.
         *
         * @param {String} state
         */
        changeCallState: function (state) {
            this.callState.text(state);
        },

        /**
         * Function refresh call timer.
         *
         * @param {Number} timeInSeconds
         */
        refreshCallTimer: function (timeInSeconds) {
            var date = new Date(null);
            date.setSeconds(timeInSeconds);
            var timeString = date.toISOString().substr(11, 8);

            this.callTimer.text(timeString);
        },

        /**
         * Function clear call timer.
         */
        clearCallTimer: function () {
            this.callTimer.text("--:--:--");
        },

        /**
         * Function sets title kind of call.
         */
        setCallTitle: function () {
            this.call.text('Call');
        },

        setCallId: function(callId){
            this.callId.text(callId);
        },

        /**
         * Function sets title kind of call.
         */
        setConferenceTitle: function () {
            this.call.text('Conference');
        },

        /**
         * Function set src parameter to local stream.
         *
         * @param {MediaStream} url
         */
        setLocalStream: function (url) {       
		   this.localVideo.get(0).srcObject = url;
        },

        /**
         * Function set src parameter to local stream.
         *
         * @param {MediaStream} url
         */
        setRemoteStream: function (url) {
		   this.remoteVideo.get(0).srcObject = url;
        }
    };

    window.CallView = CallView;

})(window, jQuery);
