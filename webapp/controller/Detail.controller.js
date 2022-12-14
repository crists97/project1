sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter"
], function(
    Controller, JSONModel, Filter, FilterOperator, formatter
) {
    "use strict";

    return Controller.extend("project1.controller.Detail", {
        formatter: formatter,
        /**
         * @override
         */
        onInit: function() {
            var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.attachRouteMatched(this.onRouteMatched, this);
            var that = this;
            var oInput = this.byId("addMessage");
            var oInputID = oInput.getId();
            oInput.onsapenter = ((oEvent) => {
                var text = sap.ui.getCore().byId(oInputID).getValue();
                that.addMessage(text);
                sap.ui.getCore().byId(oInputID).setValue("");
            });
        },
        onRouteMatched: function(oEvent) {
            if (oEvent)
                this.phone = oEvent.getParameter("arguments").chat;
            var modelChat = this.getOwnerComponent().getModel("chatModel").getData();

            var model = modelChat.filter(object => object.phone === this.phone);
            this.getView().setModel(new JSONModel(model[0]), "chatPersonal");
            this.scrollList();
            this.paintlines();

        },

        paintlines: function() {
            var oList = this.byId("idList");
            var item = null;
            for (var i = 0; i < oList.getItems().length; i++) {
                item = oList.getItems()[i].getBindingContext("chatPersonal");
                if (item && item.getModel("chatSet").getProperty(item.sPath).sent) {
                    oList.getItems()[i].addStyleClass("lineSend");
                }
            }

        },
        scrollList: function() {
            var oList = this.byId("idList");
            setTimeout(function() {
                oList.scrollToIndex(oList.getItems().length - 1);
            }, 200);
        },
        navButtonPress: function() {
            this.getOwnerComponent().getRouter().navTo("master");
        },

        addMessage: function(text) {
            var model = this.getOwnerComponent().getModel("chatModel").getData();
            var index = model.findIndex(object => object.phone === this.phone);
            if (index === -1) return;

            var date = new Date();
            var datestring = ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + "/" +
                date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);

            var object = {
                "id": Math.floor(Math.random() * 10000000000),
                "text": text,
                "phone": this.phone,
                "date": datestring,
                "sent": true,
                "delivered": false,
                "read": false,
                "sendMessage": true,
                "seconds": ("0" + date.getSeconds()).slice(-2),
                "dateNum": parseFloat(("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) +
                    date.getFullYear() + "" + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2))
            };
            model[index].MessagesSend.push(object);

            if (model[index].allMessages[0] && model[index].allMessages[0].date === datestring) {
                var indexData = model[index].allMessages.filter(object => object.date === datestring).length;
                model[index].allMessages.splice(indexData, 0, object);
            } else {
                model[index].allMessages.unshift(object);
            }
            model[index].LastMessage = text;
            this.getOwnerComponent().getModel("chatModel").refresh()
            this.onRouteMatched(null);
        },

        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        getDate: function(oContext) {
            return oContext.getProperty('date');
        },
        getGroupHeader: function(date) {
            return new sap.m.GroupHeaderListItem({
                title: date.key
            });
        }
    });
});