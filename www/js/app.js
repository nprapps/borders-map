/*
* Global vars
*/

var $w;
var $h;
var $slides;
var $sections;
var $components;
var $play;
var $video;
var $playlist;
var $panos;
var chapter;
var store;
var anchors;
var story_start = 0;
var story_end_1 = 673;
var story_end_2 = 771;

var breakSlidesForMobile = function() {
    /*
    * break slides into multiple slides if the screen is too small
    */
    $w = $(window).width();
    $h = $(window).height();
    if ($w < 768) {
        $components.addClass('slide');
        chapter = $components.parents('.section');
        store = $components.clone();
        $components.parents('.slide').remove();
        $(chapter).append(store);
    }
};

var setUpFullPage = function() {
    // clear all anchors
    anchors = [];

    // get the anchors

   _.each($sections, function(section) {
        var anchor = $(section).data('anchor');
        if (anchor === undefined) {
            var slides = $(section).find('.slide');
            anchor = $(slides[0]).data('anchor');
        }
        anchors.push(anchor);
    });

    $.fn.fullpage({
        autoScrolling: false,
        anchors: anchors,
        verticalCentered: true,
        fixedElements: '.primary-navigation-btn',
        resize: true,
        css3: true,
        scrollingSpeed: 200,
        loopHorizontal: false,
        easing: 'swing',
        afterLoad: lazyLoad,
    });

    lazyLoad('home', 0);
};

var revealVideo = function() {

    /*
    * Show the video.
    */

    var text = $(this).parents('.text');
    $(text).hide();
    $(text).parent().css('background-image', '');
    $(text).next().css('display', 'table-cell');
    var player = text.siblings('#player');
    initPlayer(player);
};

var initPlayer = function(player) {

    /*
    * Setup JWPlayer.
    */

    jwplayer('player').setup({
        modes: [{
            type: 'flash',
            src: 'http://www.npr.org/templates/javascript/jwplayer/player.swf',
            config: {
                skin: 'http://media.npr.org/templates/javascript/jwplayer/skins/mle/npr-video-archive/npr-video-archive.zip',
                file: 'http://pd.npr.org/npr-mp4/npr/nprvid/2013/02/20130219_nprvid_oscars-n-600000.mp4',
                image: 'http://apps.npr.org/oscars-2013/img/cheat-sheet-promo_wide.jpg',
                'hd.file': 'http://pd.npr.org/npr-mp4/npr/nprvid/2013/02/20130219_nprvid_oscars-n-1200000.mp4'
            }
        }, {
            type: 'html5',
            config: {
                levels: [
                    {
                        file: 'http://pd.npr.org/npr-mp4/npr/nprvid/2013/02/20130219_nprvid_oscars-n-600000.mp4',
                        image: 'http://apps.npr.org/oscars-2013/img/cheat-sheet-promo_wide.jpg'
                    }
                ]
            }
        }],
        bufferlength: '5',
        controlbar: 'over',
        icons: 'true',
        autostart: false,
        width: $w,
        height: $h
    });
    jwplayer('player').play();

};

var setUpAudio = function() {
    var myPlaylist = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_N",
        cssSelectorAncestor: "#jp_container_N"
    }, [
        {
            title:"Culture Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-1.mp3",
            oga:"../assets/audio/part-1.ogg",
            free: true
        },
        {
            title:"States Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Grito",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Crossing from Afar",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Money Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Money Crossing II",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Blocking a Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Music Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Watching the Crossings",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"The Politics of Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Women Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Opportunity Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"The City at the Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Opportunity Crossing II",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Barrio Aztecas",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"The Two Raids at the Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Trade at the Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Weapons Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"The Danger of the Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Crossing Back",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"Entrepreneurship Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        },
        {
            title:"The Final Crossing",
            artist:"Morning Edition (3/19/14)",
            mp3:"../assets/audio/part-2.mp3",
            oga:"../assets/audio/part-2.ogg",
            free: true
        }
    ], {
        swfPath: "/js",
        supplied: "mp3, oga",
        smoothPlayBar: true,
    });
};

var onStoryTimeUpdate = function(e) {
    var this_player = e.currentTarget.id;
    var story_end;
    if (this_player == 'pop-audio_1') {
        story_end = story_end_1;
    } else if (this_player == 'pop-audio_2') {
        story_end = story_end_2;
    }

    /*
    * Handles the time updates for the story player.
    */

    // If we reach the end, stop playing AND send a Google event.
    if (e.jPlayer.status.currentTime > parseInt(story_end, 0)) {
        e.jPlayer('stop');
        _gaq.push(['_trackEvent', 'Audio', 'Completed story audio', APP_CONFIG.PROJECT_NAME, 1]);
    }

    // Count down when playing but for the initial time, show the length of the audio.
    // Set the time to the current time ...
    var time_text = $.jPlayer.convertTime(e.jPlayer.status.currentTime);

    // ... unless it's the initial state. In that case, show the length of the audio.
    if (parseInt(e.jPlayer.status.currentTime, 0) === 0) {
        time_text = $.jPlayer.convertTime(story_end);
    }

    // Write the current time to our time div.
    $(this).next().find('.current-time').text(time_text);
};

var onButtonDownloadClick = function(){
    /*
    * Click handler for the download button.
    */
    _gaq.push(['_trackEvent', 'Audio', 'Downloaded story audio mp3', APP_CONFIG.PROJECT_NAME, 1]);
};

var onStoryPlayerButtonClick = function(e){
    /*
    * Click handler for the story player "play" button.
    */
    _gaq.push(['_trackEvent', 'Audio', 'Played audio story', APP_CONFIG.PROJECT_NAME, 1]);
    e.data.player.jPlayer("pauseOthers");
    e.data.player.jPlayer('play');
};

var animatePano = function() {
    $(this).css('background-position', $w - 2500);
};


var lazyLoad = function(anchor, index) {
    var section = $sections[index];
    var slides = $(section).find('.slide');

    _.each($(slides), function(slide) {
        var image = 'assets/img/' + $(slide).data('bgimage');
        if (image !== 'assets/img/undefined' && $(slide).css('background-image') === 'none') {
            $(slide).css('background-image', 'url(' + image + ')');
        }
    });
};
$(document).ready(function() {

    /*
    * Define vars
    */

    $slides = $('.section, .slide');
    $sections = $('.section, #playlist, #credits');
    $play_video = $('.btn-video');
    $video = $('.video');
    $components = $('.component');
    $playlist = $('.playlist');
    $panos = $('.pano-container');

    // init chapters

    breakSlidesForMobile();
   // setFooter();
    setUpFullPage();

    // jplayer
    // setUpAudio();

    // handlers

    $play_video.on('click', revealVideo);
    $panos.on('click', animatePano);

    // Redraw slides if the window resizes
    $(window).resize(breakSlidesForMobile);
});