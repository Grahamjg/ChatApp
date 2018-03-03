/*
*sp.shell.js
*shellmodulefor SPA
*/

// Currently on Page 130

/* jslint   browser: true, continue:true,
devel: true,indent:2 maxerr:50
newcap: true, nomen: true , plusplus: true,
regexp : true, sloppy : true, vars : true
whitespace : true
*/

/* global $, spa */

/* Currently at  page 92/93 of the actual document   */
/* Starting new veatures  105/106*/
/* PDF Page 131 */

spa.shell = (function() 
{
    var
    configMap = {
        anchor_schema_map : {
            chat : {opened: true, closed : true}
        },
        main_html: String()
        + '<div class="spa-shell-head">'
        + '<div class="spa-shell-head-logo"></div>'
        + '<div class="spa-shell-head-acct"></div>'
        + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
        + '<div class="spa-shell-main-nav"></div>'
        + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-chat"></div>'
        //+ '<div class="spa-shell-modal"></div>',
        //chat_extend_time:    1000,
        //chat_retract_time:   300,
        //chat_extend_height : 450,
        //chat_retract_height : 15,
        //chat_extended_title : 'Click to retract',
        //chat_retracted_title : 'Click to extend'
    },
    stateMap = {  anchor_map : {} },
    jqueryMap = {},
    
    copyAchorMap, setJqueryMap,  
    changeAnchorPart, onHashChange, 
    setChatAnchor, initModule;
    // Begin UtilityMethod
    // Returns copy of stored anchor map
    copyAnchormap = function() {
        return $.extend ( true, {}, stateMap.anchor_map);
    }
    /*
    // Begin DOM Method / changeAnchorPart/
    // Purpose: Changes part of the URI anchor component
    // Arguments:
    //  * arg_map - The map describing what part of the URI anchor we want changed
    // Returns : boolean
    // Returns true on success 
    changeAnchorPart = function (arg_map) {
        varanchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name, key_name_dep;
        // begin merge changes into anchor map
        KEYVAL :
        for (key_name in arg_map) {
            if (arg_map.hasOwnProperty (key_name)) {
                // skip dependent keys during iteration
                if (key_name.indexOf('_') === 0) {continue KEYVAL;}

                //update independent key val
                anchor_map_revise[key_name] = arg_map[key_name];

                // update matching dependent key
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                }
                else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        // end merge changes into anchor map

        // begin attempt to update URI; revert if not successful
        try {
            $.uriAnchor.setAnchor (stateMap.anchor_map_revise);
         }
         catch (error) {
             // replace URI with existing state
             $.uriAnchor.setAnchor (stateMap.anchor_map, null, true);
             bool_return = false;
         }
         // end attempt to update URI
         return bool_return;
    };
    // end dom method /changeAnchorPart/
*/
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () 
    {
        var $container =stateMap.$container;
        jqueryMap = { $container : $container  } ;
    } ;
/*
    // Begin DOM method toggleChat
    // Purpose - extend or retract chat slider
    toggleChat = function (do_extend, callback) {
        var 
        px_chat_ht = jqueryMap.$chat.height(),
        is_open = px_chat_ht === configMap.chat_extend_height,
        is_closed = px_chat_ht === configMap.chat_retract_height,
        is_sliding = ! is_open && !is_closed;
    //avoid race condition
    if (is_sliding) {return false}

    // begin extend chat slider
    if (do_extend) {
        jqueryMap.$chat.animate (
            { height : configMap.chat_extend_height  },
            configMap.chat_extend_time,
        function() {
            jqueryMap.$chat.attr (
                'title', configMap.chat_extended_title
            );
            stateMap.is_chat_retracted = false;
        if (callback) {callback (jqueryMap.$chat);}
    }
);
    return true;
    // end extended slider
    }

    */

    changeAnchorPart = function (arg_map) {
        var
        anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name, key_name_dep;
        // begin merge changes into anchor map
        KEYVAL :
        for (key_name in arg_map) {
            if (arg_map.hasOwnProperty (key_name)) {
                // skip dependent keys during iteration
                if (key_name.indexOf('_') === 0) {continue KEYVAL;}

                //update independent key val
                anchor_map_revise[key_name] = arg_map[key_name];

                // update matching dependent key
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                }
                else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        // end merge changes into anchor map

        // begin attempt to update URI; revert if not successful
        try {
            $.uriAnchor.setAnchor (stateMap.anchor_map_revise);
         }
         catch (error) {
             // replace URI with existing state
             $.uriAnchor.setAnchor (stateMap.anchor_map, null, true);
             bool_return = false;
         }
         // end attempt to update URI
         return bool_return;
    };


    // Begin event handler /onHashChange/
// Purpose handles the hash chage event
// Arguments 
//  * event - jquery event object
// Settings - none
// Returns : false
// Action
//  * Parse the uri anchor component
onHashChange = function ( event) {
    var
    _s_chat_previous, _s_chat_proposed, s_chat_proposed,
    anchor_map_proposed,
    is_ok = true,
    anchor_map_previous = copyAnchorMap(), 
 
    // attempy to parse anchor
    try {
        anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    }
    catch (error) {
        $.uriAnchor.setAnchor(anchor_map_previous, null, true);
        return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    // convenience variables
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    // begin adjust chat component if changed
    if ( !anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
        s_chat_proposed = anchor_map_proposed.chat;
        switch(s_chat_proposed) {
            case 'opened':
           is_ok = spa.chat.setSliderPosition ('opened');
            break;
            case 'closed':
            is_ok = spa.chat.setSliderPosition ('closed');
            break;
            default:
            spa.chat.setSliderPosition ('closed');
            delete anchor_map_proposed.chat;
            $.uriAnchor.setAnchor (anchor_map_proposed, null, true);
        }
    }
    // end chat component if changed
    // Begin revert anchor if slider change denied
    if (!is_ok) {
        if (anchor_map_previous) {
            $.uriAnchor.setAnchor (anchor_map_previous, null, true);
            stateMap.anchor_map = anchor_map_previous;
        } else {
            delete anchor_map_proposed.chat;
            $.uriAnchor.setAnchor (anchor_map_proposed, null, true);
        }
    }
    // End revert anchor if slider change denied
    return false;
};


//---------------------- BEGIN CALLBACKS ---------------------
// Begin callback method /setChatAnchor/
// Example : setChatAnchor( 'closed' );
// Purpose : Change the chat component of the anchor
// Arguments:
// * position_type - may be 'closed' or 'opened'
// Action :
// Changes the URI anchor parameter 'chat' to the requested
// value if possible.
// Returns :
// * true - requested anchor part was updated
// * false - requested anchor part was not updated
// Throws : none
//

setChatAnchor = function (position_type) {
    return chatAchorPart({chat: position_type});
};

/*
    // Begin Retract chat slider
    jqueryMap.$chat.animate (
        { height : configMap.chat_retract_height  },
        configMap.chat_retract_time,
    function() {
        jqueryMap.$chat.attr (
            'title', configMap.chat_retracted_title
        );
        stateMap.is_chat_retracted = true;
    if (callback) {callback (jqueryMap.$chat);}
    }
);
return true;
// End Retracted
*/
// End Dom method toggle chat
// Event


// Begin Public method /initModule/
// Example : spa.shell.initModule( $('#app_div_id') );
// Purpose :
// Directs the Shell to offer its capability to the user
// Arguments :
// * $container (example: $('#app_div_id')).
// A jQuery collection that should represent
// a single DOM container
// Action :
// Populates $container with the shell of the UI
// and then configures and initializes feature modules.
// The Shell is also responsible for browser-wide issues
// such as URI anchor and cookie management.
// Returns : none
// Throws : none
//
/*

onClickChat = function (event){
    if (toggleChat (stateMap.is_chat_retracted)) {
        $.uriAnchor.setAnchor ({
            chat :(stateMap.is_chat_retracted ? 'open' : 'closed')
        })
    }
    return false;
}
*/
    // Beginpublic method /initModule/
    initModule = function ($container) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html (configMap.main_html);
        setJqueryMap();

        //stateMap.is_chat_retracted =true;
        //jqueryMap.$chat
        //.attr('title', configMap.chat_retracted_title)
        //.click (onClickChat);

        // configure URI anchor
        $.uriAnchor.configModule ({
            schema_map : configMap.anchor_schema_map
        });

        // configure and initialize feature module
        spa.cha.configModule ({
            set_chat_anchor : setChatAnchor,
            chat_model : spa.model.chat,
            people_model : spa.model.people
        });
        spa.chat.initModule ( jqueryMap.$container);


        // Handle URI anchor change event
        // This id done after all feature modules are configured
        // and initialized, otherwise they will not be ready to handle
        // the trigger event which is used to ensure the anchor
        // is considered on-load
        $(window)
        .bind ('hashChange', onHashChange)
        .trigger ('hashChange');
    };
    return {initModule : initModule};
}());