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
        },
        onActivate: function() {
        }
    };

    $('#content').panelSnap(options);
};

var setSlideHeight = function() {
    $w = $(window).width();
    $h = $(window).height();
    $slides.css('height', $h);
    $slides.css('width', $w);
};

$(document).ready(function() {
    $slides = $('.slide');
    setSlideHeight();
    setUpPanelSnap();

    $(window).resize(setSlideHeight);
});