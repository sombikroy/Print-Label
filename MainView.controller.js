sap.ui.define([
    "jquery.sap.global",
    "sap/dm/dme/podfoundation/controller/PluginViewController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (jQuery, PluginViewController, JSONModel, MessageBox) {
    "use strict";

    return PluginViewController.extend("sb.custom.plugins.printlabel.controller.MainView", {

        onInit: function () {
            PluginViewController.prototype.onInit.apply(this, arguments);
        },

        onAfterRendering: function () {
            var oConfig = this.getConfiguration();
            this.getView().byId("backButton").setVisible(oConfig.backButtonVisible);
            this.getView().byId("closeButton").setVisible(oConfig.closeButtonVisible);
            this.getView().byId("headerTitle").setText(oConfig.title);

            // Automatically open the label PDF as soon as the plugin panel loads.
            // The operator no longer needs to click the button manually.
            this.onViewLabelPress();
        },

        onBeforeRenderingPlugin: function () {
            // Reserved for future use
        },

        /**
         * Opens the SFC label PDF in a new browser tab.
         * Called automatically from onAfterRendering, and also available
         * as a manual fallback via the "View Label" button in the panel.
         */
        onViewLabelPress: function () {
            var oI18n = this.getView().getModel("i18n").getResourceBundle();

            // ── 1. Validate configuration ────────────────────────────────────
            var oConfig        = this.getConfiguration();
            var sPrintDocument = oConfig.printDocumentName    || "";
            var sPrintVersion  = oConfig.printDocumentVersion || "1";

            if (!sPrintDocument) {
                MessageBox.error(oI18n.getText("print.error.noDocumentName"));
                return;
            }

            // ── 2. Get the POD selections ────────────────────────────────────
            var aPodSelections;
            try {
                aPodSelections = this.getPodController()
                    .getPodSelectionModel()
                    .getSelections();
            } catch (e) {
                MessageBox.error(oI18n.getText("print.error.noSelection"));
                return;
            }

            if (!aPodSelections || aPodSelections.length === 0) {
                MessageBox.warning(oI18n.getText("print.warning.noSfc"));
                return;
            }

            // ── 3. Extract SFC and plant ─────────────────────────────────────
            var oSelection = aPodSelections[0];
            var sSfc       = oSelection.sfc || oSelection.input || "";

            if (!sSfc) {
                MessageBox.warning(oI18n.getText("print.warning.noSfc"));
                return;
            }

            var sSite = "";
            try {
                sSite = this.getPodController().getUserPlant();
            } catch (e) {
                sSite = (oSelection.shopOrder && oSelection.shopOrder.site) || "";
            }

            // ── 4. Build the document-ms base URL ────────────────────────────
            var sApiUri   = this.getPublicApiRestDataSourceUri();
            var oAnchor   = document.createElement("a");
            oAnchor.href  = sApiUri;
            var sAbsolute = oAnchor.href;

            var sFndIndex = sAbsolute.indexOf("/fnd/");
            var sPrefix   = sFndIndex !== -1
                ? sAbsolute.substring(0, sFndIndex)
                : sAbsolute.replace(/\/$/, "");

            var sDocBase  = sPrefix + "/fnd/document-ms/document/v1/download";

            // ── 5. Build query parameters ─────────────────────────────────────
            var oDocument   = {
                document: sPrintDocument,
                version:  sPrintVersion
            };

            var oParameters = {
                sfc:   "SFCBO:" + sSite + "," + sSfc,
                plant: sSite
            };

            var sUrl = sDocBase
                + "?document="   + encodeURIComponent(JSON.stringify(oDocument))
                + "&parameters=" + encodeURIComponent(JSON.stringify(oParameters));

            // ── 6. Open in a new tab then auto-close the plugin panel ─────────
            window.open(sUrl, "_blank");
            this.onClosePress();
        },

        isSubscribingToNotifications: function () {
            return false;
        },

        getCustomNotificationEvents: function (sTopic) {
            // Not used
        },

        getNotificationMessageHandler: function (sTopic) {
            return null;
        },

        onExit: function () {
            PluginViewController.prototype.onExit.apply(this, arguments);
        }
    });
});
