/*
* Global vars
*/

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
var currentSection = '_'
var currentSectionIndex = 0;
var anchors;
var is_touch = Modernizr.touch;
var active_counter = null;
var begin = moment();

var breakSlidesForMobile = function() {
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

   console.log(anchors);

    $.fn.fullpage({
        autoScrolling: false,
        anchors: anchors,
        menu: '.nav',
        verticalCentered: false,
        fixedElements: '.primary-navigation, .nav',
        scrollOverflow: true,
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

    $('.section.active').find('.controlArrow').hide();

    // fade in
    $('body').css('opacity', 1);

    // find the title and fade in
    $('.section.active').find('.text').addClass('fade').css('opacity', 1);
};

var lazyLoad = function(anchorLink, index, slideAnchor, slideIndex) {
    var thisSlide = $slides[slideIndex];
    var nextSlide = $slides[slideIndex + 1];

    if ($(thisSlide).data('anchor')) {
        currentSection = $(thisSlide).data('anchor');
        findSlideIndex();
    };

    console.log(currentSectionIndex);

    slides = [thisSlide, nextSlide];

    getBackgroundImages(slides)

    // hide slide/section nav on titlecards
    if ($slides.first().hasClass('active') === true) {
        $slides.find('.controlArrow').hide();
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

var getBackgroundImages = function(slides) {
    console.log(slides);
    _.each($(slides), function(slide) {
        var image = 'assets/img/' + $(slide).data('bgimage');

        if (image !== 'assets/img/undefined' && $(slide).css('background-image') === 'none') {
            $(slide).css('background-image', 'url(' + image + ')');
        }
    });
};

var goToNextSection = function() {
    $.fn.fullpage.moveTo(0, anchors[currentSectionIndex + 1]);
}

var goToNextSlide = function() {
    $.fn.fullpage.moveSlideRight();
}

var showNav = function() {
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
    $navItems = $('.nav ul li');
    $navClose = $('.close-nav');
    $nextSectionButtton = $('.next-section');
    $titleCardButton = $('.btn-play');

    // init chapters

    breakSlidesForMobile();
    setUpFullPage();

    // handlers

    $play_video.on('click', revealVideo);
    $navButton.on('click', showNav);
    $navItems.on('click', showNav);
    $navClose.on('click', showNav);
    $titleCardButton.on('click', goToNextSlide);
    $nextSectionButtton.on('click', goToNextSection);



    // Redraw slides if the window resizes
    $(window).resize(breakSlidesForMobile);

});