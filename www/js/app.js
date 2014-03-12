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
var currentPanel;

var setSlideHeight = function() {
    $w = $(window).width();
    $h = $(window).height();
    $slides.css('height', $h);
    $slides.css('width', $w);
};

var setUpPanelSnap = function() {
    var options = {
        $menu: $('header .menu'),
        directionThreshold: 50,
        slideSpeed: 200,
        panelSelector: 'section',
        onSnapFinish: setSlideshow,
        keyboardNavigation: {
            enabled: true,
            nextPanelKey: 40,
            previousPanelKey: 38,
            wrapAround: false
        }
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

    setChapterHash();
};

var setChapterHash = function() {
    currentPanel = $currentChapter.data('panel');
    hasher.setHash(currentPanel);
};

var setSlideHash = function() {
    console.log(index.toString());
    if (index >= 0) {
        hasher.setHash(currentPanel + '/' + index);
    }
    else {
        hasher.setHash(currentPanel);
    }

}

var previousSlide = function() {
    index--;
    $(currentSlide).removeClass('present');
    currentSlide = $currentSlideshow[index];
    $(currentSlide).addClass('present');
    setSlideHash();
};

var nextSlide = function() {
    index++;
    $(currentSlide).removeClass('present');
    currentSlide = $currentSlideshow[index];
    $(currentSlide).addClass('present');
    setSlideHash();
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

//handle hash changes
var handleChanges = function(newHash, oldHash){
  console.log(newHash);
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
    currentPanel = $currentChapter.data('panel');

    setSlideHeight();
    setUpPanelSnap();
    setUpVideo();

    hasher.changed.add(handleChanges); //add hash change listener
    hasher.initialized.add(handleChanges); //add initialized listener (to grab initial value in case it is already set)
    hasher.init(); //initialize hasher (start listening for history changes)

    hasher.setHash('home');
    $(document).keydown(handleKeyPress);
    $previous.on('click', previousSlide);
    $next.on('click', nextSlide);
    $play.on('click', setUpVideo);

    $(window).resize(setSlideHeight);
});