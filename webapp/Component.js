sap.ui.define([
        "sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel",
        "sap/ui/Device",
        "project1/model/models"
    ],
    function(UIComponent, JSONModel, Device, models) {
        "use strict";

        return UIComponent.extend("project1.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function() {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                var oModel = new JSONModel("/model/resources/mockdata/chatsSet.json");
                this.setModel(oModel, "chatsSet");
                oModel = new JSONModel("/model/resources/mockdata/ReceivedMessagesSet.json");
                this.setModel(oModel, "ReceivedMessagesSet");
                oModel = new JSONModel("/model/resources/mockdata/SentMessagesSet.json");
                this.setModel(oModel, "SentMessagesSet");

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);