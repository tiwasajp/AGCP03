(function (AvayaClientServices, window, $) {
    'use strict';

    function LoginController() {
        this._client = new AvayaClientServices();
        this._conferenceTokenHref = undefined;
        this._user = undefined;
        this._loginView = new window.LoginView({
            clientVersion: this._client.getVersion(),
            handleLogin: function (callSettings, messagingSettings, deviceServicesSettings) {
                this.login(callSettings, messagingSettings, deviceServicesSettings);
            }.bind(this),
            handleLogout: function () {
                this.logout();
            }.bind(this)
        });

        this._callsController = undefined;
        this._contactsController = undefined;
        this._messagingController = undefined;
    }


    LoginController.prototype = {
        /**
         * Register and login the user.
         *
         * @param {Object} callSettings
         * @param {Object} messagingSettings
         * @param {Object} deviceServicesSettings
         */
        login: function (callSettings, messagingSettings, deviceServicesSettings) {
            var callUserConfiguration = new AvayaClientServices.Config.CallUserConfiguration();
            callUserConfiguration.incomingCall = true;
            callUserConfiguration.videoEnabled = true;

            var config = {
                callUserConfiguration: callUserConfiguration
            };

            var continueLogin = function () {
                if (messagingSettings.address) {
                    var messagingServicesCredentialProvider = new AvayaClientServices.Config.CredentialProvider(messagingSettings.username, messagingSettings.password);
                    var ammNetworkProviderConfig = new AvayaClientServices.Config.ServerInfo(messagingSettings.address, messagingSettings.port, messagingSettings.tls);
                    config.ammConfiguration = {
                        enabled: true,
                        allowPrevalidation: true,
                        pollingIntervalInMinutes: 1,
                        credentialProvider: messagingServicesCredentialProvider,
                        networkProviderConfiguration: new AvayaClientServices.Config.NetworkProviderConfiguration(ammNetworkProviderConfig)
                    };
                }

                if (deviceServicesSettings.address) {
                    var acsNetworkProviderConfig = new AvayaClientServices.Config.ServerInfo(deviceServicesSettings.address, deviceServicesSettings.port, deviceServicesSettings.tls);
                    var acsCredentialProvider = new AvayaClientServices.Config.CredentialProvider(deviceServicesSettings.username, deviceServicesSettings.password);
                    config.acsConfiguration = {
                        enabled: true,
                        credentialProvider: acsCredentialProvider,
                        networkProviderConfiguration: new AvayaClientServices.Config.NetworkProviderConfiguration(acsNetworkProviderConfig)
                    };
                }

                this._client = new AvayaClientServices();
                this._client.registerLogger(window.console);

                this._user = this._client.createUser(config);

                this._user.addOnUserRegistrationSuccessful(function (href) {
                    this._conferenceTokenHref = href;
                }.bind(this));

                this._initServices(this._user);

                this._user.start().then(function () {
                    this._loginView.userRegistrationSuccessful();
                    if (callSettings.tokenAuthenticationEnabled) {
                        this._loginView.activeCallTab();
                    } else if (callSettings.address) {
                        this._loginView.activeCallTab();
                    } else if (messagingSettings.address) {
                        this._loginView.activeMessagingTab();
                    } else if (deviceServicesSettings.address) {
                        this._loginView.activeContactsTab();
                    }
                }.bind(this), function () {
                    this._loginView.userRegistrationFailed();
                }.bind(this));
            }.bind(this);

            if (callSettings.address) {
                if (callSettings.tokenAuthenticationEnabled) {
                    this._retrieveOnceOffToken(callSettings.tokenServiceAddress, callSettings.callingNumber).then(function(onceOffToken) {
                        var tokenType = AvayaClientServices.Config.Authentication.TokenType.ESGTOKEN;
                        var callCredentialProvider = new AvayaClientServices.Config.CredentialTokenProvider(onceOffToken, tokenType);
                        var esgNetworkProviderConfig = new AvayaClientServices.Config.ServerInfo(callSettings.address, callSettings.port, callSettings.tls);
                        config.sgConfiguration = {
                            enabled: true,
                            credentialProvider: callCredentialProvider,
                            networkProviderConfiguration: new AvayaClientServices.Config.NetworkProviderConfiguration(esgNetworkProviderConfig)
                        };
                        continueLogin();
                    });
                } else {
                    var callCredentialProvider = new AvayaClientServices.Config.CredentialProvider(callSettings.username, callSettings.password);
                    var esgNetworkProviderConfig = new AvayaClientServices.Config.ServerInfo(callSettings.address, callSettings.port, callSettings.tls);
                    config.sgConfiguration = {
                        enabled: true,
                        credentialProvider: callCredentialProvider,
                        networkProviderConfiguration: new AvayaClientServices.Config.NetworkProviderConfiguration(esgNetworkProviderConfig)
                    };
                    config.uccpConfiguration = {
                        enabled: true,
                        credentialProvider: null,
                        networkProviderConfiguration: {
                            webSocketConfig: {}
                        }
                    };
                    config.collaborationConfiguration = {
                        contentSharingWorkerPath: 'js/webrtc2/lib/AvayaClientServicesWorker.min.js'
                    };
                    config.wcsConfiguration = {
                        enabled: true
                    };
                    config.presenceConfiguration = {
                        enabled: true
                    };
                    continueLogin();
                }
            }
            else {
                continueLogin();
            }
        },

        /**
         * User un-registration/logout function
         */
        logout: function () {
            this._user.stop().then(function () {
                this._loginView.userUnregistrationSuccessful();
            }.bind(this), function () {
                this._loginView.userUnregistrationFailed();
				this._loginView.userUnregistrationSuccessful();
            }.bind(this));
        },

        /**
         * Services initialization.
         *
         * @param {Object} user
         */
        _initServices: function (user) {
            if (user.getCalls()) {
                user.getCalls().addOnCallsServiceAvailableCallback(function () {
                    this._callsController = new window.CallsController(user, this._client);
                    this._loginView.showCallTab();
                }.bind(this));
            }
            /*
            if (user.getContacts()) {
                user.getContacts().addOnContactsServiceAvailableCallback(function () {
                    this._contactsController = new window.ContactsController(user);
                    this._loginView.showContactsTab();
                }.bind(this));
            }
            if (user.getMessaging()) {
                user.getMessaging().addOnMessagingServiceAvailableCallback(function () {
                    this._messagingController = new window.MessagingController(user);
                    this._loginView.showMessagingTab();
                }.bind(this));
            }
            */
        },

        /**
         * This method retrieves once off token from the sample Token Generation Service
         * It can be invoked in one of the following two ways:
         *   1) During login - In this case the "contact" field of token request will be null and the generated token is valid to call any number.
         *   2) Per call basis - In this case, the "contact" field of token request should be polulated with the "Called Number".  
         * 
         * @param {String} tokenServiceURL 
         * @param {String} callingNumber
         * @returns {Deferred}
         */
        _retrieveOnceOffToken: function (tokenServiceURL, callingNumber) {
            var dfd = $.Deferred();

            var tokenRequest = {use: "csaGuest", callingNumber: callingNumber};
            var tokenData = JSON.stringify(tokenRequest);

            console.log('Attempting to retrieve authorization token from: ' + tokenServiceURL);
            console.log('TokenData: ' + tokenData);

            $.ajax({
                url: tokenServiceURL,
                type: 'POST',
                credentials: "omit",
                cache: "no-store",
                headers: {  "Accept": "application/vnd.avaya.csa.tokens.v1+json",
                            "Content-Type": "application/vnd.avaya.csa.tokens.v1+json"
                         },
                data: tokenData,
                timeout: 5000,
                success: function (data) {
                    var token = data.encryptedToken;
                    console.log('Retrieved token: ' + token);
                    dfd.resolve(token);
                },
                error: function (error) {
                    console.error('Error retrieving authorization token: ' + error.statusText);
                    dfd.reject(error.statusText);
                }
            });
            return dfd.promise();
        }    
    };

    window.LoginController = LoginController;

})(AvayaClientServices, window, jQuery);
