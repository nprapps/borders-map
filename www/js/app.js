/*
* Global vars
*/

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
var $waypoints;
var index = -1;
var currentSlide;
var currentPanel;

var setSlideHeight = function() {

    /*
    * Set the window width and height, make all slides fill the screen.
    */

    $w = $(window).width();
    $h = $(window).height();
    $slides.css('height', $h);
    $slides.css('width', $w);

    // also resize the video

    jwplayer('player').resize($w, $h);
};

var setUpPanelSnap = function() {

    /*
    * See jquery.panelsnap.js for the code this is using. Listens for section tags.
    */

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
    /*
    * If chapters have slideshows, do some legwork to make them work properly
    */

    // set up slideshow

    index = -1; // -1 because of the titlecard. This is awful.

    $currentChapter = $('.chapter.active');
    $currentSlideshow = $currentChapter.find('.slide'); // find all slides within the section

    // reset slideshow if returning to chapter

    currentSlide = $currentSlideshow[0];
    $currentChapter.find('.slide.present').removeClass('present');
    $currentChapter.addClass('present');

    // append slide controls and load slides, but only if necessary

    if ($currentSlideshow.length > 0) {
        $currentChapter.append(JST.slide_nav());
        loadSlides($currentSlideshow);
        $rails = $('.rail');
        $previous = $('.previous-slide');
        $next = $('.next-slide');
        $previous.css('display', 'none');

        $previous.on('click', previousSlide);
        $next.on('click', nextSlide);
    }

    // check for playing video, stop it if it is playing

    if (jwplayer('player').getState() == 'PLAYING') {
        jwplayer('player').stop();
    }

    setChapterHash();
};

var loadSlides = function(slideshow) {

    /*
    * Lazy loading for slideshow background images
    */

    _.each(slideshow, function(slide) {
        if ($(slide).data('bgimage')) {
            var backgroundImage = 'assets/img/' + $(slide).data('bgimage');
            $(slide).css('background-image', 'url(' + backgroundImage + ')');
        }
    });
};

var setChapterHash = function() {

    /*
    * Set hash for chapter panels
    */

    currentPanel = $currentChapter.data('panel');
    hasher.setHash(currentPanel);
};

var setSlideHash = function() {

    /*
    * Set hash for slides
    */

    if (index >= 0) {
        hasher.setHash(currentPanel + '/' + index);
    }
    else {
        hasher.setHash(currentPanel);
    }
};

var previousSlide = function() {

    /*
    * Handler for moving backwards in slideshows
    */

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

    /*
    * Handler for moving forwards in slideshows
    */

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

    /*
    * Based on where you are in a slideshow, hide and show the appropriate arrow controls
    */

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

    /*
    * Enable keyboard navigation in slideshows
    */

    if (e.keyCode === 37 && index >= 0) {
        previousSlide();
    }
    else if (e.keyCode === 39 && index < $currentSlideshow.length - 1) {
        nextSlide();
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

var handleChanges = function(newHash, oldHash){

    /*
    * Do something when the hash changes. What are we doing here?
    */

};

$(document).ready(function() {

    /*
    * Define vars
    */

    $slides = $('.slide');
    $currentChapter = $('.chapter.active');
    $currentSlideshow = $currentChapter.find('.slide');
    $play = $('.btn-play');
    $video = $('.video');
    currentSlide = $currentSlideshow[index];
    currentPanel = $currentChapter.data('panel');

    // init chapters

    setSlideHeight();
    setUpPanelSnap();

    // hasher setup

    hasher.changed.add(handleChanges);
    hasher.initialized.add(handleChanges);
    hasher.init();

    // handlers

    $(document).keydown(handleKeyPress);
    $play.on('click', revealVideo);

    $slides.lazyload({
        threshold : 50,
    });

    // Redraw slides if the window resizes

    $(window).resize(setSlideHeight);
});