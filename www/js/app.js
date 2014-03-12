var $w;
var $h;
var $slides;
var $currentChapter;
var $currentSlideshow;
var index = 0;
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
        onSnapStart: function(){
        },
        onSnapFinish: function(){
            index = 0;
            $currentChapter = $('.chapter.active');
            $currentSlideshow = $currentChapter.find('.slide');
            currentSlide = $currentSlideshow[index];

            console.log(currentSlide);
        },
        onActivate: function() {
        }
    };

    $('#content').panelSnap(options);
};

var handleKeyPress = function(e) {
    if (e.keyCode === 37 && index >= 0) {
        index--;
        $(currentSlide).removeClass('present');
        currentSlide = $currentSlideshow[index];
        $(currentSlide).addClass('present');

        console.log(currentSlide);
    }

    if (e.keyCode === 39 && index < $currentSlideshow.length - 1) {
        index++;
        $(currentSlide).removeClass('present');
        currentSlide = $currentSlideshow[index];
        $(currentSlide).addClass('present');
    }
};

$(document).ready(function() {
    $slides = $('.slide');
    $currentChapter = $('.chapter.active');
    $currentSlideshow = $currentChapter.find('.slide');
    currentSlide = $currentSlideshow[index];

    setSlideHeight();
    setUpPanelSnap();

    console.log($currentSlideshow);

    $(document).keydown(handleKeyPress);
    $(window).resize(setSlideHeight);
});