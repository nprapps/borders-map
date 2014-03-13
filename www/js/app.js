var $w;
var $h;
var $slides;
var $currentChapter;
var $currentSlideshow;
var $rails;
var $previous;
var $next;
var $play;
var $video;
var index = -1;
var currentSlide;
var currentPanel;

var setSlideHeight = function() {
    $w = $(window).width();
    $h = $(window).height();
    $slides.css('height', $h);
    $slides.css('width', $w);

    // also resize the video

    jwplayer('player').resize($w, $h);
};

var setUpPanelSnap = function() {
    var options = {
        $menu: $('footer .menu'),
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
    $currentChapter.find('.slide.present').removeClass('present');
    $currentChapter.addClass('present');

    if ($currentSlideshow.length > 0) {
        $currentChapter.append(JST.slide_nav());
        $rails = $('.rail');
        $previous = $('.previous-slide');
        $next = $('.next-slide');
        $previous.css('display', 'none');
    }
    setChapterHash();
};

var setChapterHash = function() {
    currentPanel = $currentChapter.data('panel');
    hasher.setHash(currentPanel);
};

var setSlideHash = function() {
    if (index >= 0) {
        hasher.setHash(currentPanel + '/' + index);
    }
    else {
        hasher.setHash(currentPanel);
    }
};

var previousSlide = function() {
    if (index >= 0) {
        index--;
        $(currentSlide).removeClass('present');
        currentSlide = $currentSlideshow[index];
        $(currentSlide).addClass('present');
        setSlideHash();
        checkArrows();
    }
};

var nextSlide = function() {
    if (index < $currentSlideshow.length) {
        index++;
        $(currentSlide).removeClass('present');
        currentSlide = $currentSlideshow[index];
        $(currentSlide).addClass('present');
        setSlideHash();
        checkArrows();
    }
};

var checkArrows = function() {
    if (index < 0) {
        $previous.css('display', 'none');
    }
    else if (index === $currentSlideshow.length - 1) {
        $next.css('display', 'none');
    }
    else {
        $previous.css('display', 'block');
        $next.css('display', 'block');
    }
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
    var text = $(this).parents('.text');
    $(text).hide();
    $(text).parent().css('background-image', '');
    $(text).next().css('display', 'table-cell');
    var player = text.siblings('#player');
    console.log(player);
    initPlayer(player);
};

var initPlayer = function(player) {
    $video.fitVids();

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

//handle hash changes
var handleChanges = function(newHash, oldHash){
    // $.smoothScroll({ speed: 800, scrollTarget: '#' + newHash });
};

$(document).ready(function() {
    $slides = $('.slide');
    $currentChapter = $('.chapter.active');
    $currentSlideshow = $currentChapter.find('.slide');
    $play = $('.btn-play');
    $video = $('.video');
    currentSlide = $currentSlideshow[index];
    currentPanel = $currentChapter.data('panel');

    setSlideHeight();
    setUpPanelSnap();

    hasher.changed.add(handleChanges); //add hash change listener
    hasher.initialized.add(handleChanges); //add initialized listener (to grab initial value in case it is already set)
    hasher.init(); //initialize hasher (start listening for history changes)

    $(document).keydown(handleKeyPress);
    $previous.on('click', previousSlide);
    $next.on('click', nextSlide);
    $play.on('click', setUpVideo);

    $(window).resize(setSlideHeight);
});