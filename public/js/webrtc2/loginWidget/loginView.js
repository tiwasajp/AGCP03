(function (window, $) {
    'use strict';

    function LoginView(handlers) {

        this.callServerAddress = $('#callServerAddress');
        this.callPort = $('#callPort');
        this.callTls = $('#callTls');
        this.tokenAuthentication = $('#tokenAuthentication');
        this.callUsername = $('#callUsername');
        this.callUsernameLabel = $('#callUsernameLabel');
        this.callPassword = $('#callPassword');
        this.callPasswordLabel = $('#callPasswordLabel');

        this.tokenServiceHost = $('#tokenServiceHost');
        this.tokenServiceHostLabel = $('#tokenServiceHostLabel');
        this.tokenServicePort = $('#tokenServicePort');
        this.tokenServicePortLabel = $('#tokenServicePortLabel');
        this.tokenServiceURLPath = $('#tokenServiceURLPath');
        this.tokenServiceURLPathLabel = $('#tokenServiceURLPathLabel');

        this.callingNumber = $('#callingNumber');
        this.callingNumberLabel = $('#callingNumberLabel');

        this.callsServiceTab = $('#callsServiceTab');
        this.contactsServiceTab = $('#contactsServiceTab');
        this.messagingServiceTab = $('#messagingServiceTab');
        this.callService = $('#callService');
        this.messagingService = $('#messagingService');
        this.contactsService = $('#contactsService');

        this.messagingServerAddress = $('#messagingServerAddress');
        this.messagingPort = $('#messagingPort');
        this.messagingTls = $('#messagingTls');
        this.messagingUsername = $('#messagingUsername');
        this.messagingPassword = $('#messagingPassword');

        this.deviceServicesServerAddress = $('#deviceServicesServerAddress');
        this.deviceServicesPort = $('#deviceServicesPort');
        this.deviceServicesTls = $('#deviceServicesTls');
        this.deviceServicesUsername = $('#deviceServicesUsername');
        this.deviceServicesPassword = $('#deviceServicesPassword');

        this.loginBtn = $("#loginBtn");
        this.logoutBtn = $("#logoutBtn");
        this.SDKVersion = $('#SDKVersion');
        this.serviceTitle = $('#servicesTitle');
        this.errorLog = $('#errorLog');
        this.dialService = $('#dialService');

        this.SDKVersion.text(handlers.clientVersion);

        this.loginBtn.on('click', function () {
            var callSettings = {
                address: "wbgw1.aks.avdemo.com", //this.callServerAddress.val(),
                port: "6443", //this.callPort.val(),
                tls: true, //this.callTls.prop("checked"),
                username: "", //this.callUsername.val(),
                password: "", //this.callPassword.val(),
                tokenAuthenticationEnabled: true, //this.tokenAuthentication.prop("checked"),
                tokenServiceAddress: "https://wbgw1.aks.avdemo.com:9443/token-generation-service/token/getEncryptedToken", 
                // "https://" + this.tokenServiceHost.val() + ":" + this.tokenServicePort.val() + "/" + this.tokenServiceURLPath.val(),
                callingNumber: this.callingNumber.val()
            };
            var messagingSettings = {
                address: "", //this.messagingServerAddress.val(),
                port: "", //this.messagingPort.val(),
                tls: true, //this.messagingTls.prop("checked"),
                username: "", //this.messagingUsername.val(),
                password: "" //this.messagingPassword.val()
            };
            var deviceServicesSettings = {
                address: "", //this.deviceServicesServerAddress.val(),
                port: "", //this.deviceServicesPort.val(),
                tls: true, //this.deviceServicesTls.prop("checked"),
                username: "", //'this.deviceServicesUsername.val(),
                password: "", //this.deviceServicesPassword.val()
            };

			this.errorLog.empty();
            handlers.handleLogin(callSettings, messagingSettings, deviceServicesSettings);
            this.loginBtn.prop('disabled', true);
        }.bind(this));

        this.logoutBtn.on('click', function () {
            this.logoutBtn.prop('disabled', true);
            handlers.handleLogout();
        }.bind(this));

        this.tokenAuthentication.on('change', function() {
            if(this.tokenAuthentication.prop('checked')){
                // Hide Username related input
                this.callUsername.hide();
                this.callPassword.hide();
                this.callUsernameLabel.hide();
                this.callPasswordLabel.hide();

                // Show Token Generation related input 
                this.tokenServiceHost.show();
                this.tokenServiceHostLabel.show();
                this.tokenServicePort.show();
                this.tokenServicePortLabel.show();
                this.tokenServiceURLPath.show();
                this.tokenServiceURLPathLabel.show();
                this.callingNumber.show();
                this.callingNumberLabel.show();
            } else {
                // Hide Token Generation related input 
                this.tokenServiceHost.hide();
                this.tokenServiceHostLabel.hide();
                this.tokenServicePort.hide();
                this.tokenServicePortLabel.hide();
                this.tokenServiceURLPath.hide();
                this.tokenServiceURLPathLabel.hide();
                this.callingNumber.hide();
                this.callingNumberLabel.hide();

                // Show Username related input
                this.callUsername.show();
                this.callPassword.show();
                this.callUsernameLabel.show();
                this.callPasswordLabel.show();
            }
        }.bind(this));
    }

    LoginView.prototype = {
        /**
         * Function disable login buttons and settings. Show Services.
         */
        userRegistrationSuccessful: function () {
            this.callServerAddress.prop('disabled', true);
            this.callPort.prop('disabled', true);
            //this.callTls.bootstrapToggle('disable');
            this.callUsername.prop('disabled', true);
            this.callPassword.prop('disabled', true);

            //this.tokenAuthentication.bootstrapToggle('disable');
            this.tokenServiceHost.prop('disabled', true);
            this.tokenServicePort.prop('disabled', true);
            this.tokenServiceURLPath.prop('disabled', true);
            this.callingNumber.prop('disabled', true);

            this.logoutBtn.prop('disabled', false);
           	this.dialService.show();
            
            this.errorLog.empty();

        },

        /**
         * Function add information that registration failed.
         */
        userRegistrationFailed: function () {
            this.loginBtn.prop('disabled', false);
            this.errorLog.append('<div>Login failed</div>');
        },

        /**
         * Function hide Services buttons and show login buttons.
         */
        userUnregistrationSuccessful: function () {
            this.callServerAddress.prop('disabled', false);
            this.callPort.prop('disabled', false);
            //this.callTls.bootstrapToggle('enable');
            this.callUsername.prop('disabled', false);
            this.callPassword.prop('disabled', false);

            //this.tokenAuthentication.bootstrapToggle('enable');
            this.tokenServiceHost.prop('disabled', false);
            this.tokenServicePort.prop('disabled', true);
            this.tokenServiceURLPath.prop('disabled', true);
            this.callingNumber.prop('disabled', false);

			this.dialService.hide();
            this.loginBtn.prop('disabled', false);
			this.logoutBtn.prop('disabled', true);
        },

        /**
         * Function add information that un-registration failed.
         */
        userUnregistrationFailed: function () {
            this.logoutBtn.prop('disabled', false);
            this.errorLog.append('<div>Logout failed</div>');
        },

        /**
         * Function active Call tab.
         */
        activeCallTab: function () {
            this.callsServiceTab.addClass('active');
            this.callService.addClass('active');
        },

        /**
         * Function show Call tab.
         */
        showCallTab: function () {
            this.callsServiceTab.removeClass('hide');
            this.callService.removeClass('hide');
        },
    };

    window.LoginView = LoginView;

})
(window, jQuery);
