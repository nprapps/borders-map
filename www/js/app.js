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
var $navButton;
var $nav;
var $nextSectionButton;
var $nextSectionTease;
var panoDirection = 'right';
var slug;
var chapter;
var thisChapter;
var store;
var anchors;
var playlist;
var story_start = 0;
var story_end_1 = 673;
var story_end_2 = 771;
var is_touch = Modernizr.touch;


var breakSlidesForMobile = function() {
    /*
    * break slides into multiple slides if the screen is too small
    */
    $w = $(window).width();
    $h = $(window).height();
    if ($w < 768 && is_touch) {
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
        menu: '.nav',
        verticalCentered: false,
        fixedElements: '.primary-navigation, .nav',
        scrollOverflow: true,
        resize: false,
        css3: true,
        scrollingSpeed: 100,
        loopHorizontal: false,
        easing: 'swing',
        afterLoad: lazyLoad,
        onLeave: fadeOutText,
        afterRender: onPageLoad
    });
};

var onPageLoad = function() {
    // always get the home stuff
    lazyLoad('home', 0);

    $('.section.active').find('.controlArrow').hide();

    // fade in
    $('body').css('opacity', 1);

    // find the title and fade in
    $('.section.active').find('.text').addClass('fade').css('opacity', 1);

    // set the slug
    if (window.location.hash) {
        slug = window.location.hash.substring(1);
    }
    else {
        slug = 'home';
    }

    // set the next chapter button
    if ($w > 768) {
        var next = $('.section.active').next().data('chapter');
        $nextSectionTease.html(': ' + next);
    }
};

var lazyLoad = function(anchor, index) {
    if(anchor === 'listen') {
        // load all the other stuff before jplayer absolutely destroys localhost kill me please
        getBackgroundImages($slides);
        setTimeout(setUpAudio, 1000);
    }
    // load the next section
    var nextSection = $sections[index];
    var slides = $(nextSection).find('.slide ');
    if (anchor === 'panos') {
        getPanoImages(slides);
    }
    else {
        getBackgroundImages(slides);
    }

    // load the current section if it hasn't been done
    var thisSection = $($sections[index - 1]);
    slides = thisSection.find('.slide');
    getBackgroundImages(slides);
    if (anchor === 'panos') {
        getPanoImages(slides);
    }
    // set the slug for the new section
    slug = thisSection.data('anchor');

    // set the next chapter button
    if ($w > 768) {
        var next = $(nextSection).data('chapter');
        $nextSectionTease.html(': ' + next);
    }


    // fade in the title
    thisSection.find('.text').addClass('fade');
    thisSection.find('.text').css('opacity', 1);

    // hide the next arrow on titlecards
    if ($(slides).first().hasClass('active') === true) {
        $(thisSection).find('.controlArrow').hide();
    }

};

var fadeOutText = function() {
    _.each($sections, function(section) {
        if ($(section).hasClass('active') === false) {
            $(section).find('.text').css('opacity', 0);
        }
    });
}

var getBackgroundImages = function(slides) {
    _.each($(slides), function(slide) {
        var image = 'assets/img/' + $(slide).data('bgimage');

        if (image !== 'assets/img/undefined' && $(slide).css('background-image') === 'none') {
            $(slide).css('background-image', 'url(' + image + ')');
        }
    });
};

var getPanoImages = function(slides) {
    _.each($(slides), function(slide) {
        var pano = $(slide).find('.pano-container');
        if (!Modernizr.touch && $w > 768) {
            var image = 'assets/img/' + $(pano).data('bgimage');
        }
        else {
            var image = 'assets/img/' + $(pano).data('bgimage-small');
        }

        if (image !== 'assets/img/undefined' && $(pano).css('background-image') === 'none') {
            $(pano).css('background-image', 'url(' + image + ')');
        }
    });
};

var animatePano = function() {
    // get the width of the background image
    console.log(panoDirection);

    var image_url = $(this).css('background-image');
    var container = $(this);
    var image;
    var width;
    var height;
    var containerHeight;
    var newWidth;

    container.on('transitionend webkitTransitionEnd', function() {
        $(this).find('.text').show();
    });

    if (!Modernizr.touch && $w > 600) {
        container.find('.text').hide();

        // Remove url() or in case of Chrome url("")
        image_url = image_url.match(/^url\("?(.+?)"?\)$/);

        if (image_url[1]) {

            image_url = image_url[1];
            image = new Image();

            // just in case it is not already loaded
            $(image).load({"panoContainer": container}, function(event) {
                width = image.width;
                height = image.height;
                containerHeight = $h * 0.7;
                aspectRatio = width/height;
                console.log(aspectRatio);
                newWidth = aspectRatio * containerHeight;

                if (panoDirection === 'right') {
                    event.data.panoContainer.css({
                        'background-position': $w - newWidth
                    });
                    event.data.panoContainer.find('.backward').css('opacity', '1');
                    panoDirection = 'left';
                }
                else if (panoDirection === 'left') {
                    event.data.panoContainer.css({
                        'background-position': 0
                    });
                    event.data.panoContainer.find('.backward').css('opacity', '0');
                    panoDirection = 'right';

                }

            });

            image.src = image_url;
        }
    }
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

var showNav = function() {
    $nav.height($h);
    $navButton.find('i').toggleClass('fa-bars').toggleClass('fa-times');
    $nav.toggleClass('active');
    if ($nav.hasClass('active')) {
        $nav.css('display', 'block');
        var fade = _.debounce(fadeInNav, 1);
        fade();
    }
    else {
        $nav.css('opacity', 0);
        var fade = _.debounce(fadeOutNav, 500);
        fade();
    }
}

var fadeInNav = function() {
    $nav.css('opacity', 1);
};

var fadeOutNav = function() {
    $nav.css('display', 'none');
};

var nextSection = function() {
    $.fn.fullpage.moveSectionDown();
}

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
                file: 'http://pd.npr.org/npr-mp4/npr/nprvid/2014/03/20140324_nprvid_juniorrough-n.mp4',
                image: '../assets/img/junior/junior.jpg',
                'hd.file': 'http://pd.npr.org/npr-mp4/npr/nprvid/2014/03/20140324_nprvid_juniorrough-n.mp4'
            }
        }, {
            type: 'html5',
            config: {
                levels: [
                    {
                        file: 'http://pd.npr.org/npr-mp4/npr/nprvid/2014/03/20140324_nprvid_juniorrough-n.mp4',
                        image: '../assets/img/junior/junior.jpg'
                    }
                ]
            }
        }],
        bufferlength: '5',
        controlbar: 'over',
        icons: 'true',
        autostart: false,
        width: '100%',
        height: $h - 50
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
    $navButton = $('.primary-navigation-btn');
    $nextSectionButton = $('.next-section');
    $nextSectionTease = $('.section-tease')
    $nav = $('.nav');
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
    $navButton.on('click', showNav);
    $nextSectionButton.on('click', nextSection);

    // Redraw slides if the window resizes
    $(window).resize(breakSlidesForMobile);
});