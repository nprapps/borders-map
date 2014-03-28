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
var aspectWidth = 16;
var aspectHeight = 9;
var optimalWidth;
var optimalHeight;
var imageWidth;
var imageHeight;
var $jplayer = null;

var resize = function() {

    $w = $(window).width();
    $h = $(window).height();

    $slides.width($w);

    optimalWidth = ($h * aspectWidth) / aspectHeight;
    optimalHeight = ($w * aspectHeight) / aspectWidth;

    w = $w;
    h = optimalHeight;

    if (optimalWidth > $w) {
        w = optimalWidth;
        h = $h;
    }
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
        afterRender: onPageLoad,
        afterSlideLoad: lazyLoad,
        onSlideLeave: onSlideLeave
    });
};

// after the page loads

var onPageLoad = function() {
    setSlidesForLazyLoading(0)
    // fade in
    $('body').css('opacity', 1);
};

// after a new slide loads

var lazyLoad = function(anchorLink, index, slideAnchor, slideIndex) {
    if ($($slides[slideIndex]).hasClass('image-split')) {
        setImages($($slides[slideIndex]).find('img')[0]);
    } else {
        setSlidesForLazyLoading(slideIndex);
    }

    if (slideAnchor === 'dashboard') {
        onStartCounts();
    }
};

var setSlidesForLazyLoading = function(slideIndex) {
    var thisSlide = $slides[slideIndex];

    if ($(thisSlide).data('anchor')) {
        currentSection = $(thisSlide).data('anchor');
        for (i=0; i < anchors.length; i++) {
            if (anchors[i] === currentSection) {
                currentSectionIndex = i;
            }
        }
    };

    slides = [
        $slides[slideIndex - 2],
        $slides[slideIndex - 1],
        thisSlide,
        $slides[slideIndex + 1],
        $slides[slideIndex + 2]
    ];

    findImages(slides);

    if (!$jplayer && $(thisSlide).hasClass('video')) {
        setupVideoPlayer();
    }
}

var findImages = function(slides) {
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
};

var showNavigation = function() {
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
}

var animateArrows = function() {
    $arrows.addClass('active');

    if ($arrows.hasClass('active')) {
        $arrows.css('display', 'block');
        var fade = _.debounce(fadeInArrows, 1);
        fade();
    }
};

var fadeInArrows = function() {
    $arrows.css('opacity', 1)
};


var setImages = function(image) {
    // Grab Wes's properly sized width.
    var imageWidth = w;

    // Sometimes, this is wider than the window, shich is bad.
    if (imageWidth > $w) {
        imageWidth = $w;
    }

    // Set the hight as a proportion of the image width.
    var imageHeight = ((imageWidth * aspectHeight) / aspectWidth);

    // Sometimes the lightbox width is greater than the window height.
    // Center it vertically.
    if (imageWidth > $h) {
        imageTop = (imageHeight - $h) / 2;
    }

    // Sometimes the lightbox height is greater than the window height.
    // Resize the image to fit.
    if (imageHeight > $h) {
        imageWidth = ($h * aspectWidth) / aspectHeight;
        imageHeight = $h;
    }

    // Sometimes the lightbox width is greater than the window width.
    // Resize the image to fit.
    if (imageWidth > $w) {
        imageHeight = ($w * aspectHeight) / aspectWidth;
        imageWidth = $w;
    }

    // Set the top and left offsets.
    var imageTop = ($h - imageHeight) / 2;
    var imageLeft = ($w - imageWidth) / 2;

    // Set styles on the lightbox image.
    $(image).css({
        'width': imageWidth + 'px',
        'height': imageHeight + 'px',
        'opacity': 1,
        'position': 'absolute',
        'top': imageTop + 'px',
        'left': imageLeft + 'px',
    });

};

// after you leave a slide

var onSlideLeave = function(anchorLink, index, slideIndex, direction) {
    var thisSlide = $slides[slideIndex];

    if ($jplayer && $(thisSlide).hasClass('video')) {
        stopVideo();
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

var fadeInNav = function() {
    $nav.css('opacity', 1);
};

var fadeOutNav = function() {
    $nav.css('display', 'none');
};

var setupVideoPlayer = function() {
    /*
    * Setup jPlayer.
    */
    var computePlayerHeight = function() {
        return ($h - ($('.jp-interface').height() + NAV_HEIGHT))
    }

    $jplayer = $('.jp-jplayer').jPlayer({
        ready: function () {
            $(this).jPlayer('setMedia', {
                poster: '../assets/img/junior/junior.jpg',
                m4v: 'http://pd.npr.org/npr-mp4/npr/nprvid/2014/03/20140327_nprvid_junior-n.mp4',
                webmv: '../assets/img/junior/junior.webm'
            });
        },
        play: function (){
            $('.jp-current-time').removeClass('hide');
            $('.jp-duration').addClass('hide');
        },
        ended: function(){
            $('.jp-current-time').addClass('hide');
            $('.jp-duration').removeClass('hide');
        },
        size: {
            width: $w,
            height: computePlayerHeight() + 'px'
        },
        swfPath: 'js/lib',
        supplied: 'm4v, webmv',
        loop: false
    });

    $(window).resize(function() {
        $jplayer.jPlayer('option', { 'size': {
            width: $w,
            height: computePlayerHeight() + 'px'
        }});
    });
};

var startVideo = function() {
    var text = $(this).parents('.text');
    $(text).hide();
    $(text).parent().css('background-image', '');
    $(text).next().css('display', 'block');

    $('.jp-video').css('height', 'auto');
    $('.jp-jplayer').jPlayer('play');
}

var stopVideo = function() {
    $('.jp-jplayer').jPlayer('stop');
}

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

    $play_video.on('click', startVideo);
    $navButton.on('click', animateNav);
    $navItems.on('click', animateNav);
    $secondaryNav.on('click', animateNav);
    $titleCardButton.on('click', goToNextSlide);
    $nextSectionButtton.on('click', goToNextSection);

    // Redraw slides if the window resizes
    $(window).resize(resize);
    $(window).resize(function() {
        if ($('.slide.active').hasClass('image-split')) {
            setImages($('.slide.active').find('img')[0]);
        }
    });
});
