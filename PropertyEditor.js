sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (ResourceModel, PropertyEditor) {
    "use strict";

    var oFormContainer;

    return PropertyEditor.extend("sb.custom.plugins.printlabel.builder.PropertyEditor", {

        constructor: function (sId, mSettings) {
            PropertyEditor.apply(this, arguments);

            this.setI18nKeyPrefix("customComponentListConfig.");
            this.setResourceBundleName("sb.custom.plugins.printlabel.i18n.builder");
            this.setPluginResourceBundleName("sb.custom.plugins.printlabel.i18n.i18n");
        },

        addPropertyEditorContent: function (oPropertyFormContainer) {
            var oData = this.getPropertyData();

            // ── Visibility toggles ──────────────────────────────────────────
            this.addSwitch(oPropertyFormContainer, "backButtonVisible",  oData);
            this.addSwitch(oPropertyFormContainer, "closeButtonVisible", oData);

            // ── Display ─────────────────────────────────────────────────────
            this.addInputField(oPropertyFormContainer, "title", oData);

            // ── Document configuration ───────────────────────────────────────
            // printDocumentName : name of the document template in SAP DM
            //                     e.g. "SFC_LABEL GS1-128"
            // printDocumentVersion : version of the template, e.g. "1"
            this.addInputField(oPropertyFormContainer, "printDocumentName",    oData);
            this.addInputField(oPropertyFormContainer, "printDocumentVersion", oData);

            oFormContainer = oPropertyFormContainer;
        },

        getDefaultPropertyData: function () {
            return {
                "backButtonVisible":    true,
                "closeButtonVisible":   true,
                "title":                "View Label",
                "printDocumentName":    "",
                "printDocumentVersion": "1"
            };
        }

    });
});
