/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2017 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

OSH.UI.EntityChartEditPanel = OSH.UI.EntityViewItemsEditPanel.extend({

    getNewStylerInstance:function(type) {
        if(type === "LinePlot") {
            return new OSH.UI.Styler.LinePlot({});
        }
    },

    getTypeFromStylerInstance:function(stylerInstance) {
        if(stylerInstance instanceof OSH.UI.Styler.LinePlot){
            return "LinePlot";
        }
    },

    getStylerList:function() {
        return ["LinePlot"];
    },

    getStylerPanelInstance:function(properties) {
        return new OSH.UI.Panel.StylerLinePlotPanel("",properties);
    }
});