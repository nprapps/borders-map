/*
* Global vars
*/
var NAV_HEIGHT = 75;

var $w;
var $h;
var $slides;
var $components;
var $portraits;
var $play;
var $video;
var $navButton;
var $nav;
var $navItems;
var $navClose;
var $nextSectionButtton;
var $arrows;
var currentSection = '_'
var currentSectionIndex = 0;
var anchors;
var mobileSuffix;
var player;
var is_touch = Modernizr.touch;
var active_counter = null;
var begin = moment();

var resize = function() {
    /*
    * break slides into multiple slides if the screen is too small
    */
    $w = $(window).width();
    $h = $(window).height();
};

var setUpFullPage = function() {
    // clear all anchors
    anchors = [];

    // get the anchors

   _.each($slides, function(section) {
        var anchor = $(section).data('anchor');
        if (anchor === undefined) {
            return false;
        }
        anchors.push(anchor);
    });

    $.fn.fullpage({
        autoScrolling: false,
        anchors: anchors,
        menu: '.nav',
        verticalCentered: false,
        fixedElements: '.primary-navigation, .nav',
        resize: false,
        css3: true,
        loopHorizontal: false,
        afterSlideLoad: lazyLoad,
        afterRender: onPageLoad
    });
};

var onPageLoad = function() {
    // always get the home stuff
    lazyLoad('_', 0, 'home', 0);

    // fade in
    $('body').css('opacity', 1);
};

var lazyLoad = function(anchorLink, index, slideAnchor, slideIndex) {

    var thisSlide = $slides[slideIndex];

    if ($(thisSlide).data('anchor')) {
        currentSection = $(thisSlide).data('anchor');
        findSlideIndex();
    };

    slides = [
        $slides[slideIndex - 2],
        $slides[slideIndex - 1],
        thisSlide,
        $slides[slideIndex + 1],
        $slides[slideIndex + 2]
    ];

    setMobileSuffix(slides)

    // hide slide/section nav on titlecards
    if ($slides.first().hasClass('active') === true) {
        $arrows.css('display', 'none');
        $('.next-section').css('display', 'none');
    }
    else {
        $arrows.css('display', 'block');
        $('.next-section').css('display', 'block');
    }

    if (slideAnchor === 'dashboard') {
        onStartCounts();
    }
};

var findSlideIndex = function() {
    for (i=0; i < anchors.length; i++) {
        if (anchors[i] === currentSection) {
            currentSectionIndex = i;
        }
    }
}

var setMobileSuffix = function(slides) {
    /*
    * Set background images on slides.
    * Should get square images for mobile.
    */

    // Mobile suffix should be blank by default.
    mobileSuffix = '';

    //
    if ($w < 769 && is_touch) {
        mobileSuffix = '-sq';
    }

    _.each($(slides), function(slide) {

        getBackgroundImage(slide);             
        var containedImage = $(slide).find('.contained-image');
       	getBackgroundImage(containedImage);        
    });
};

var getBackgroundImage = function(container) {

	if ($(container).data('bgimage')) {

            var image_filename = $(container).data('bgimage').split('.')[0];
            var image_extension = '.' + $(container).data('bgimage').split('.')[1];
            var image_path = 'assets/img/' + image_filename + mobileSuffix + image_extension;

            if ($(container).css('background-image') === 'none') {
                $(container).css('background-image', 'url(' + image_path + ')');
            }

     }
}

var goToNextSection = function() {
    $.fn.fullpage.moveTo(0, anchors[currentSectionIndex + 1]);
}

var goToNextSlide = function() {
    $.fn.fullpage.moveSlideRight();
}

var showAndHideNav = function() {
    //$nav.height($h);
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

var revealVideo = function() {
    /*
    * Show the video.
    */
    var text = $(this).parents('.text');
    $(text).hide();
    $(text).parent().css('background-image', '');
    $(text).next().css('display', 'block');

    var $player = text.siblings('.jp-jplayer');
    initPlayer($player);
};

var initPlayer = function($player) {
    /*
    * Setup jPlayer.
    */
    var computePlayerHeight = function() {
        return ($h - ($('.jp-interface').height() + NAV_HEIGHT))
    }

    $('.jp-jplayer').jPlayer({
        ready: function () {
            $(this).jPlayer('setMedia', {
                poster: '../assets/img/junior/junior.jpg',
                m4v: 'http://pd.npr.org/npr-mp4/npr/nprvid/2014/03/20140324_nprvid_juniorrough-n.mp4',
                webmv: '..assets/img/junior/junior.webm'
            }).jPlayer('play');
        },
        size: {
            width: $w,
            height: computePlayerHeight() + 'px' 
        },
        swfPath: 'js/lib',
        supplied: 'm4v',
        loop: false
    });

    $(window).resize(function() {
        $('.jp-jplayer').jPlayer('option', { 'size': {
            width: $w,
            height: computePlayerHeight() + 'px'
        }});
    });

};

var onUpdateCounts = function(e) {
    /*
    * Updates the count based on elapsed time and known rates.
    */
    var now = moment();
    var elapsed_seconds = (now - begin) / 1000;
    var RATES = [
        ['marijuana', 0.08844],
        ['cocaine', 0.01116],
        ['illegal-entry', 0.01065],
        ['vehicles', 2.15096],
        ['pedestrians', 1.30102]
    ]

    _.each(RATES, function(count, i){
        var count_category = count[0];
        var count_number = count[1];
        var count_unit = count[2];

        $('#' + count_category + ' span.number').html(Math.round(count_number * elapsed_seconds));
    });

};

var onStartCounts = function(e) {
    active_counter = setInterval(onUpdateCounts,500);
}

$(document).ready(function() {

    /*
    * Define vars
    */

    $slides = $('.slide');
    $play_video = $('.btn-video');
    $video = $('.video');
    $components = $('.component');
    $portraits = $('.section[data-anchor="people"] .slide')
    $navButton = $('.primary-navigation-btn');
    $nav = $('.nav');
    $navItems = $('.nav .section-tease');
    $navClose = $('.close-nav');
    $nextSectionButtton = $('.next-section');
    $titleCardButton = $('.btn-play');
    $arrows = $('.controlArrow');

    // init chapters

    resize();
    setUpFullPage();

    // handlers

    $play_video.on('click', revealVideo);
    $navButton.on('click', showAndHideNav);
    $navItems.on('click', showAndHideNav);
    $navClose.on('click', showAndHideNav);
    $titleCardButton.on('click', goToNextSlide);
    $nextSectionButtton.on('click', goToNextSection);

    // Redraw slides if the window resizes
    $(window).resize(resize);

});
