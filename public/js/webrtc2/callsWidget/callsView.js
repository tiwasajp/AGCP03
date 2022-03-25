(function (window, $) {
    'use strict';

    function CallsView(handlers) {
	    this.dialService = $("#dialService");
        this.makeAudioCallBtn = $("#audioCallBtn");
        this.makeVideoCallBtn = $("#videoCallBtn");
        this.calleeAddress = $("#calleeAddress");
        this.headerView = $("#headerView");
        this.callService = $("#callService");

        this.makeAudioCallBtn.off('click').on('click', function () {
			this.headerView.hide();
			$("#webRtcCall").hide();
			this.callService.show();
            var remoteAddress = this.calleeAddress.val();
            handlers.handleAudioMakeCall(remoteAddress);
        }.bind(this));
        
        this.makeVideoCallBtn.off('click').on('click', function () {
            var remoteAddress = this.calleeAddress.val();
            handlers.handleVideoMakeCall(remoteAddress);
        }.bind(this));

        //this._initCollapse();
    }

    CallsView.prototype = {
        /**
         * Function disable inputs in calls panel.
         */
        disableCallsPanel: function () {
            this.makeAudioCallBtn.prop('disabled', true);
            this.calleeAddress.prop('disabled', true);
        },

        /**
         * Function enable inputs in calls panel.
         */
        enableCallsPanel: function () {
            this.makeAudioCallBtn.prop('disabled', false);
            this.calleeAddress.prop('disabled', false);
        },

        createCallTemplate: function(){
	 		this.dialService.hide();
			this.disableCallsPanel();
           return $('#templates .callView').clone(true, true);
        },

        createCollaborationTemplate: function(){
            return $('#templates .collaborationView').clone(true, true);
        },

        addCallTemplate: function(template){
            $('#calls').prepend(template);
        },

        addCollaborationTemplate: function(template){
            $('#collaborationService').prepend(template);
        },

        removeTemplate: function(template){
            template.remove();
           	this.dialService.show();
            this.enableCallsPanel();
        }
    };

    window.CallsView = CallsView;

})(window, jQuery);
