sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(
    Controller, JSONModel, Filter, FilterOperator
) {
    "use strict";

    return Controller.extend("project1.controller.Master", {
        /**
         * @override
         */
        onInit: function() {
            /*var router = sap.ui.core.UIComponent.getRouterFor(this);
            router.attachRouteMatched(this.onRouteMatched, this);*/
            this.onRouteMatched();

        },
        onRouteMatched: function() {

            var chatModel = this.getOwnerComponent().getModel("chatsSet").getData(),
                sendModel = this.getOwnerComponent().getModel("SentMessagesSet").getData(),
                receivedModel = this.getOwnerComponent().getModel("ReceivedMessagesSet").getData(),
                messagesSend = null,
                messagesRecived = null,
                allMessages = null,
                modelFinal = [],
                compare = function compare(a, b) {
                    if (a.date < b.date) {
                        return -1;
                    }
                    if (a.date > b.date) {
                        return 1;
                    }
                    return 0;
                };
            for (let i = 0; i < chatModel.length; i++) {
                messagesSend = null;
                messagesRecived = null;
                allMessages = null;
                messagesSend = sendModel.filter(object => object.phone === chatModel[i].phone);
                messagesSend.sort(function compare(a, b) {
                    a.sendMessage = true;
                    if (a.date < b.date) {
                        return -1;
                    }
                    if (a.date > b.date) {
                        return 1;
                    }
                    return 0;
                });
                allMessages = messagesSend;
                chatModel[i].MessagesSend = $.extend(true, [], messagesSend);
                messagesRecived = receivedModel.filter(object => object.phone === chatModel[i].phone);
                messagesRecived.sort(compare);
                chatModel[i].MessagesReceived = messagesRecived;
                for (let j = 0; j < messagesRecived.length; j++) {
                    allMessages.push(messagesRecived[j]);
                }
                allMessages.sort(compare);
                chatModel[i].allMessages = allMessages;
                chatModel[i].photo = "/model/resources/" + chatModel[i].photo.replace("images", "image");
                if ((messagesSend.length != 0 && messagesRecived.length != 0 && messagesSend[0].date > messagesRecived[0].date) || (messagesSend.length != 0 && messagesSend[0].date && messagesRecived.length === 0)) {
                    chatModel[i].Person = this.getResourceBundle().getText("lblYou");

                } else if ((messagesRecived.length != 0 && messagesSend.length != 0 && messagesRecived[0].date > messagesSend[0].date) || (messagesRecived.length != 0 && messagesRecived[0].date && messagesSend.length === 0)) {
                    chatModel[i].Person = "";
                } else {
                    if (messagesRecived.length != 0) {
                        chatModel[i].Person = "";
                    } else if (messagesSend.length != 0) {
                        chatModel[i].Person = this.getResourceBundle().getText("lblYou");
                    }
                }
                modelFinal.push(chatModel[i]);
            }

            this.getOwnerComponent().setModel(new JSONModel(modelFinal), "chatModel");
        },

        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        onSearch: function(oEvent) {
            // add filter for search
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter("contactName", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }

            // update list binding
            var oList = this.byId("idList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        onSelectionList: function(oEvent) {

            var path = oEvent.getParameter("listItem").getBindingContext("chatModel").sPath;
            var model = oEvent.getParameter("listItem").getBindingContext("chatModel").getModel().getData();
            path = path.split("/")[1]
            var phone = model[path].phone;

            this.getOwnerComponent().getRouter().navTo("detail", { chat: phone });
        }

    });
});