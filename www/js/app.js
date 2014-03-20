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
var $arrows;
var $titlecardButtons;
var slug;
var chapter;
var thisChapter;
var store;
var anchors;
var playlist;
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
        scrollingSpeed: 100,
        loopHorizontal: false,
        easing: 'swing',
        afterLoad: lazyLoad,
        afterRender: onPageLoad
    });
};

var onPageLoad = function() {
    // always get the home stuff
    lazyLoad('home', 0);

    // fade in
    $('body').css('opacity', 1);

    // find the begin button and fade in
    $('.section.active').find('.btn').addClass('fade-in').css('opacity', 1);

    // set the slug
    if (window.location.hash) {
        slug = window.location.hash.substring(1);
    }
    else {
        slug = 'home';
    }
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
    if (!playlist) {
        playlist = new jPlayerPlaylist({
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
    }
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
    if(anchor === 'listen') {
        // load all the other stuff before jplayer absolutely destroys localhost kill me please
        getBackgroundImages($slides);
        setTimeout(setUpAudio, 1000);
    }
    else {
        // load the next section
        var nextSection = $sections[index];
        var slides = $(nextSection).find('.slide ');
        getBackgroundImages(slides);

        // load the current section if it hasn't been done
        var thisSection = $($sections[index - 1]);
        slides = thisSection.find('.slide');
        getBackgroundImages(slides);

        // set the slug for the new section
        slug = thisSection.data('anchor');
        thisSection.find('.btn').addClass('fade-in');
        thisSection.find('.btn').css('opacity', 1);

        // hide the next arrow
        if ($(slides).first().hasClass('active') === true) {
            $(thisSection).find('.controlArrow').hide();
        }

    }
};

var getBackgroundImages = function(slides) {
    _.each($(slides), function(slide) {
        var image = 'assets/img/' + $(slide).data('bgimage');
        if (image !== 'assets/img/undefined' && $(slide).css('background-image') === 'none') {
            $(slide).css('background-image', 'url(' + image + ')');
        }
    });
};

var onTitlecardButtonClick = function() {
    _.each($('.section'), function(section) {
        if ($(section).data('anchor') === slug) {
            thisChapter = section;
        }
    });
    $.smoothScroll($(thisChapter).position().top);

    $.fn.fullpage.moveTo(slug, 1);
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
    $titlecardButtons = $('.btn-play');
    if (window.location.hash) {
        slug = window.location.hash.substring(1);
    }

    // init chapters

    breakSlidesForMobile();
    setUpFullPage();

    // handlers

    $play_video.on('click', revealVideo);
    $panos.on('click', animatePano);
    $titlecardButtons.on('click', onTitlecardButtonClick);

    // Redraw slides if the window resizes
    $(window).resize(breakSlidesForMobile);
});