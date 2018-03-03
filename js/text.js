/*src="/js/default.js">*/
/* jslint   browser: true, continue:true,
devel: true,indent:2 maxerr:50
newcap: true, nomen: true , plusplus: true,
regexp : true, sloppy : true, vars : true
whitespace : true
*/

/* global jquery */

// Module /spa/
// Provideds chat slider capability
//
var spa = (function ($) {
    // module scope variables
    // set constants
    var configMap = {
        extended_height: 434,
        extened_title: 'click to retract',
        retracted_height: 16,
        retracted_title: 'click to extend',
        template_html: '<div class="spa-slider"></div>'
    },
        // Declare all other module scope variables
        $chatSlider,
        toggleSlider, onClickSlider, initModule;

    // DOM method /toggleSilder/
    //alternatesslider height
    toggleSlider = function () {
        var
        slider_height = $chatSlider.height();
        //extend slider if fully retracted
        if (slider_height === configMap.retracted_height) {
            $chatSlider
                .animate({ height: configMap.extended_height })
            .attr('title', configMap.extened_title);
            return true;
        }
            //retract slider if fully extended
        else if (slider_height === configMap.extended_height) {
            $chatSlider.animate({ height: configMap.retracted_height })
            .attr('title', configMap.retracted_title);
            return true;
        }
        return false;
    }

    //Event handler /onClickSlider/
    // recieves click events and calls toggleSlider
    onClickSlider = function (event) {
        toggleSlider();
        return false;
    };

    //public method /initMethod/
    // sets initial state and provided features
    initModule = function ($container) {
        // render HTML
        $container.html(configMap.template_html);
        $chatSlider = $container.find('.spa-slider');
        //initialze slider height and title
        // bind the user click event to the event handler
        $chatSlider
            .attr('title', configMap.retracted_title)
        .click(onClickSlider);
        return true;
    };
    return { initModule: initModule };
}(jQuery));

// Start SPA once DOM is ready
jQuery(document).ready(
    function () { spa.initModule(jQuery('#spa')); }
    );