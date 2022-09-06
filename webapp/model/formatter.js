sap.ui.define([], function() {
    "use strict";
    return {

        /*
        a. Delivered, but not Read, should be displayed with a grey check mark.
b. Delivered and Read should display a blue check mark
c. Sent, but not Delivered and not Read, should not display any check
*/
        formatIcon: function(read, delivered) {
            if ((delivered && !read) || (delivered && read)) {
                return "sap-icon://accept"
            }
            return "";

        },
        formatIconColor: function(read, delivered) {
            if (delivered && read) {
                return "blue"
            } else if (delivered && !read) {
                return "normal"
            }
            return "";

        }
    };
});