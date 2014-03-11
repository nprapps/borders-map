var $w;
var $h;
var $slides;

var setUpPanelSnap = function() {
    var options = {
        $menu: $('header .menu'),
        directionThreshold: 1,
        slideSpeed: 200,
        panelSelector: 'section',
        onSnapStart: function(){
            console.log('motherfucker');
        },
        onActivate: function() {
            console.log('you shit');
        }
    };

    $('#content').panelSnap(options);
};

var setSlideHeight = function() {
    $w = $(window).width();
    $h = $(window).height();
    $slides.css('height', $h - $('.menu').height());
    $slides.css('width', $w);
};

$(document).ready(function() {
    $slides = $('.slide');
    setSlideHeight();
    setUpPanelSnap();

    $(window).resize(setSlideHeight);
});