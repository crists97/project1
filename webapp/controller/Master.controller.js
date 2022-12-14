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
            sendModel = this.formatDates(sendModel);
            receivedModel = this.formatDates(receivedModel);
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
                allMessages.sort(function compare(a, b) {
                    if (a.date < b.date) {
                        return -1;
                    }
                    if (a.date > b.date) {
                        return 1;
                    }
                    return 0;
                });
                chatModel[i].allMessages = allMessages;
                chatModel[i].photo = "/model/resources/" + chatModel[i].photo.replace("images", "image");
                if (allMessages[0])
                    chatModel[i].LastMessage = allMessages[0].text;
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
        },
        formatDates: function(data) {
            var date = "";
            for (var j = 0; j < data.length; j++) {
                let firstData = data[j].date.replace("T", " ");
                let dateNew = firstData.split(" ")[0];
                dateNew = dateNew.split("/")[1] + "/" + dateNew.split("/")[0] + "/" + dateNew.split("/")[2];
                data[j].date = dateNew + " " + firstData.split(" ")[1];
                date = date = new Date(data[j].date);
                data[j].dateNum = parseFloat(("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) +
                    date.getFullYear() + "" + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2))
            }

            return data;
        }

    });
});