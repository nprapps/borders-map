var $w;
var $h;
var $slides;
var $currentChapter;
var $currentSlideshow;
var $rails;
var $previous;
var $next;
var $play;
var index = -1;
var currentSlide;

var setSlideHeight = function() {
    $w = $(window).width();
    $h = $(window).height();
    $slides.css('height', $h);
    $slides.css('width', $w);
};

var setUpPanelSnap = function() {
    var options = {
        $menu: $('header .menu'),
        directionThreshold: 1,
        slideSpeed: 200,
        panelSelector: 'section',
        onSnapFinish: setSlideshow,
    };

    $('#content').panelSnap(options);
};

var setSlideshow = function() {
    index = -1;
    $currentChapter = $('.chapter.active');
    $currentSlideshow = $currentChapter.find('.slide');
    currentSlide = $currentSlideshow[0];

    if ($currentSlideshow.length > 0) {
        $rails.css('display', 'table');
    }
    else {
        $rails.css('display', 'none');
    }
};

var previousSlide = function() {
    index--;
    $(currentSlide).removeClass('present');
    currentSlide = $currentSlideshow[index];
    $(currentSlide).addClass('present');
};

var nextSlide = function() {
    index++;
    $(currentSlide).removeClass('present');
    currentSlide = $currentSlideshow[index];
    $(currentSlide).addClass('present');
};

var handleKeyPress = function(e) {
    if (e.keyCode === 37 && index >= 0) {
        previousSlide();
    }
    else if (e.keyCode === 39 && index < $currentSlideshow.length - 1) {
        nextSlide();
    }
};

var setUpVideo = function() {
    $('.video').fitVids();
    var text = $(this).parents('.text');
    $(text).hide();
    $(text).parent().css('background-image', '');
    $(text).next().css('display', 'table-cell');
};

$(document).ready(function() {
    $slides = $('.slide');
    $currentChapter = $('.chapter.active');
    $currentSlideshow = $currentChapter.find('.slide');
    $rails = $('.rail');
    $previous = $('.previous-slide');
    $next = $('.next-slide');
    $play = $('.btn-play');
    currentSlide = $currentSlideshow[index];

    setSlideHeight();
    setUpPanelSnap();
    setUpVideo();

    $(document).keydown(handleKeyPress);
    $previous.on('click', previousSlide);
    $next.on('click', nextSlide);
    $play.on('click', setUpVideo);

    $(window).resize(setSlideHeight);
});