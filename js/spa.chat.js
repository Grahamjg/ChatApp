/*
 * spa.chat.js
 * Chat feature module for SPA
*/

/*  PDF 145 */

/*jslint  browser : true, continue : true,
  devel : true, indent : 2, maxerr : 50,
  newcap : true, nomen : true, plusplus : true,
  regexp : true, sloppy : true, vars : false,
  white : true
*/

/* global $, spa getComputedStyle*/

spa.chat = ( function () {
    // module scope variables   style="padding:1em; color:#fff;"
    var
    /*
    configMap = {
        main_html : String ()
            + '<div style="padding:1em; color:#fff;">'
            + 'Say hello to chat'
            +'</div>',
        settable_map : {}
    },
    */
    configMap = {
        main_html : String ()
            + '<div class="spa-chat">'
                + '<div class="spa-chat-head">'
                    + '<div class="spa-chat-head-toggle">+</div>'
                    + '<div class="spa-chat-head-title">'
                        + 'Chat'
                    +'</div>'
                + '</div>'
                + '<div class="spa-chat-closer">x</div>'
                + '<div class="spa-chat-sizer">'
                    + '<div class="spa-chat-msgs"></div>'
                    + '<div class="spa-chat-box">'
                        + '<input type="text"/>'
                        + '<div>send</div>'
                    + '</div>'
                + '</div>'
            +'</div>',
        settable_map : {
            slider_open_time: true,
            slider_close_time : true,
            slider_opened_em : true,
            slider_closed_em : true,
            slider_opened_title : true,
            slider_closed_title: true,
            
            chat_model : true,
            people_model: true,
            set_chat_anchor: true
        },
        slider_open_time : 250,
        slider_close_time :250,
        slider_opened_em : 16,
        slider_closed_em : 2,
        slider_opened_title : 'Click to close',
        slider_closed_title : 'Click to open',

        chat_model : null,
        people_model : null,
        set_chat_anchor : null
    },
    stateMap = {
        $append_target : null,
        position_type : 'closed',
        px_per_em : 0,
        slider_hidden_px : 0,
        slider_closed_px : 0,
        slider_open_px :0
        },
    jqueryMap = {},
    setJqueryMap, getEmSize, setPxSizes, setSliderPosition,
    onClickToggle, configModule, initModule
    ;
    // end module scope variables

    //Begin Utility method
    getEmSize = fuction (elem) {
        return Number(
        getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
        );
    };
    //End utility method

    // Begin Dom Method
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        $append_target = stateMap.$append_target,
        $slider - $append_target.find('.spa-chat');
        
        jqueryMap = {
            $slider :$slider,
            $head : $slider.find('.spa-chat-head'),
            $toggle : $slider.find('.spa-chat-head-toggle'),
            $title: $slider.find('.spa-chat-head-title'),
            $sizer: $slider.find('.spa-chat-sizer'),
            $msgs: $slider.find('.spa-chat-msgs'),
            $box: $slider.find('.spa-chat-box'),
            $input: $slider.find('.spa-chat-input input[type-text]')
        };
    };
    // end setJqueryMap

    // begin DOM Method /setPxSizes/
    setPxSizes = function () {
        var px_per_em, opened_height_em;
        px_per_em = getEmSize(jqueryMap.$slider.get(0));

        opened_height_em = configMap.slider_opened_em;
        stateMap.px_per_em = px_per_em;
        stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
        stateMap.slider_open_px = opened-opened_height_em *px_per_em;
        jqueryMap.$sizer.css({
            height : (opened_height_em-2) * px_per_em
        });
    };

    // Begin public method /setSliderPosition/
    // Example : spa.chat.setSliderPosition( 'closed' );
    // Purpose : Move the chat slider to the requested position
    // Arguments : // * position_type - enum('closed', 'opened', or 'hidden')
    // * callback - optional callback to be run end at the end
    // of slider animation. The callback receives a jQuery
    // collection representing the slider div as its single
    // argument
    // Action :
    // This method moves the slider into the requested position.
    // If the requested position is the current position, it
    // returns true without taking further action
    // Returns :
    // * true - The requested position was achieved
    // * false - The requested position was not achieved
    // Throws : none
    //

    setSliderPosition = function (position_type, callback) {
    var
        height_px, animate_time, slider_title, toggle_text;
        // return true if slider already in requested position
        if ( stateMap.position_type === position_type) {
            return true;
        }
        // prepare animate parameters
        switch (position_type) {
            case 'opened' :
                height_px = stateMap.slider_open_px;
                animate_time = configMap.slider_open_time;
                slider_title = configMap.slider_opened_title;
                toggle_text = '=';
            break;
            
            case 'hidden' :
                height_px = 0;
                animate_time = configMap.slider_open_time;
                slider_title = '';
                toggle_text = '+';
            break;

            case 'closed' :
                height_px = stateMap.slider_closed_px;
                animate_time = configMap.slider_close_time;
                slider_title = configMap.slider_closed_title;
                toggle_text = '+';
            break;
            // bail for unknown position_type
            default: return false;
        }
        // animate slider position change
        stateMap.position_type = '';
        jqueryMap.$slider.animate (
            {height : height_px},
            animate_time,
            function () {
                jqueryMap.$toggle.prop ('title', slider_title);
                jqueryMap.$toggle.text (toggle_text);
                stateMap.position_type = position_type;
                if (callback) {callback (jqueryMap.$slider);}
            }
        );
        return true;
    };

    // end DOM Methods

    // Begin Event Handlers
    onClickToggle = function ( event) {
        var set_char_anchor = configMap.set_chat_anchor;
        if ( stateMap.position_type === 'opened') {
            set_char_anchor ('closed');
        }
        else if ( stateMap.position_type === 'closed') {
            set_char_anchor ('opened');
        } return false;
    }
    // End Event Handlers

    // Begin Public Method
    // Begin public method /configModule/
    // Page 110 (PDF 135)
    // Example : spa.cat.configModule ({slider_open _em : 18});
    // Purpose : Configure the module prior to initialization
    // Arguments:
    //  * set_chat_anchor - a call back to modify the URI anchor to
    //    indicate open or closed state.  The callback must return 
    //    false if the requiested state cannot be met
    //  * chat_model - the chat model object provides methods to 
    //    interact with the instant messaging
    //  * people_model - the people model object which provides
    // methods to manage the list of people the model maintains
    // * slider_* settings. All these are optional scalars.
    // See mapConfig.settable_map for a full list
    // Example: slider_open_em is the open height in em's
    // Action :
    // The internal configuration data structure (configMap) is
    // updated with provided arguments. No other actions are taken.
    // Returns : true
    // Throws : JavaScript error object and stack trace on
    // unacceptable or missing arguments
    //



    configModule = function ( input_map) {
        spa.util.setConfigMap ({
            input_map :input_map,
            settable_map : configMap.settable_map,
            config_map : configMap
        });
        return true;
    };
    // endpublic method /configModule/

    //begin method /initModule/
    // Example : spa.chat.initModule( $('#div_id') );
    // Purpose : Directs Chat to offer its capability to the user
    // Arguments :
    // * $append_target (example: $('#div_id')).
    // A jQuery collection that should represent
    // a single DOM container
    // Action :
    // Appends the chat slider to the provided container and fills
    // it with HTML content. It then initializes elements,
    // events, and handlers to provide the user with a chat-room
    // interface
    // Returns : true on success, false on failure
    // Throws : none
    //
    initModule = function ( $append_target ) {
        $append_target.append ( configMap.main_html);
        stateMap.$append_target = $append_target;
        setJqueryMap();
        setPxSizes();
        // initialize chat slider to default title and state
        jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title);
        jqueryMap.$head.click ( onClickToggle );
        stateMap.position_type = 'closed';
        return true;
    };
    // end /initModule/

    // return public methods
    return {
        setSliderPosition : setSliderPosition,
        configModule : configModule,
        initModule : initModule
    };
    // EndPublic Method
}());