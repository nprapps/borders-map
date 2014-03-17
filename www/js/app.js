/*
* Global vars
*/

var $w;
var $h;
var $slides;
var $components;
var $play;
var $video;
var chapter;
var store;

var breakSlidesForMobile = function() {
    /*
    * break slides into multiple slides if the screen is too small
    */
    $w = $(window).width();
    $h = $(window).height();
    if ($w < 768) {
        $('.component').addClass('slide');
        chapter = $('.component').parents('.section').attr('id');
        store = $('.component').clone();
        console.log(store);
        $('.component').parents('.slide').remove();
        $('#' + chapter).append(store);
    }
}

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

var setUpFullPage = function() {
    $.fn.fullpage({
        verticalCentered: true,
        resize: true,
        css3: true,
        scrollingSpeed: 200,
        loopHorizontal: false,
        easing: 'swing',
        touchSensitivity: 80
    });
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

    $slides = $('.section, .slide');
    $play = $('.btn-play');
    $video = $('.video');

    // init chapters

    breakSlidesForMobile();
    setSlideHeight();
    setUpFullPage();

    // hasher setup

    hasher.changed.add(handleChanges);
    hasher.initialized.add(handleChanges);
    hasher.init();

    // handlers

    // $(document).keydown(handleKeyPress);
    $play.on('click', revealVideo);

    // Redraw slides if the window resizes

    $(window).resize(setSlideHeight);
});