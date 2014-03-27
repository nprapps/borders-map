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
var $secondaryNav;
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

    $slides.width($w);
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
    getCurrentSection(0)
    // fade in
    $('body').css('opacity', 1);
};

var lazyLoad = function(anchorLink, index, slideAnchor, slideIndex) {
    getCurrentSection(slideIndex);

    // hide slide/section nav on titlecards
    if ($slides.first().hasClass('active')) {
        $arrows.removeClass('active');
        $arrows.css({
            'opacity': 0,
            'display': 'none'
        });
        $('.next-section').css('display', 'none');
    }
    else {
        if (!$arrows.hasClass('active')) {
            animateArrows();
        }
        $('.next-section').css('display', 'block');
    }

    if (slideAnchor === 'dashboard') {
        onStartCounts();
    }
};

var getCurrentSection = function(slideIndex) {
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

    setMobileSuffix(slides);
}

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

var animateNav = function() {
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

var animateArrows = function() {
    $arrows.addClass('active');

    if ($arrows.hasClass('active')) {
        $arrows.css('display', 'block');
        var fade = _.debounce(fadeInArrows, 1);
        fade();
    }
};

var fadeInNav = function() {
    $nav.css('opacity', 1);
};

var fadeInArrows = function() {
    $arrows.css('opacity', 1)
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
    var player = text.siblings('#player');
    initPlayer(player);
};

var initPlayer = function(player) {

    /*
    * Setup JWPlayer.
    */

    var player = jwplayer('player').setup({
        modes: [{
            type: 'html5',
            config: {
                levels: [
                    {
                        file: 'http://pd.npr.org/npr-mp4/npr/nprvid/2014/03/20140327_nprvid_junior-n.mp4',
                        // file: '../assets/img/junior/junior.webm',
                        image: '../assets/img/junior/junior.jpg',
                        skin: 'http://media.npr.org/templates/javascript/jwplayer/skins/mle/npr-video-archive/npr-video-archive.zip',
                    }
                ]
            }
        },{
            type: 'flash',
            src: 'http://www.npr.org/templates/javascript/jwplayer/player.swf',
            config: {
                file: 'http://pd.npr.org/npr-mp4/npr/nprvid/2014/03/20140327_nprvid_junior-n.mp4',
                image: '../assets/img/junior/junior.jpg',
                'hd.file': 'http://pd.npr.org/npr-mp4/npr/nprvid/2014/03/20140324_nprvid_juniorrough-n.mp4'
            }
        }],
        bufferlength: '5',
        controlbar: 'over',
        icons: 'true',
        autostart: false,
        width: '100%',
        height: $h - 70
    });
    player.play();

    // $(window).resize(player.resize($w, $h));

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
    $secondaryNav = $('.secondary-nav-btn');
    $nextSectionButtton = $('.next-section');
    $titleCardButton = $('.btn-play');
    $arrows = $('.controlArrow');

    // init chapters

    setUpFullPage();
    resize();

    // handlers

    $play_video.on('click', revealVideo);
    $navButton.on('click', animateNav);
    $navItems.on('click', animateNav);
    $secondaryNav.on('click', animateNav);
    $titleCardButton.on('click', goToNextSlide);
    $nextSectionButtton.on('click', goToNextSection);

    // Redraw slides if the window resizes
    $(window).resize(resize);

});