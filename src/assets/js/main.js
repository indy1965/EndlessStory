//
//
//
$(document).ready(function(){

  'use strict';

  // Check if element exists
  $.fn.elExists = function() {
      return this.length > 0;
  };

  // Variables
  const $html = $('html'),
    $body = $('body'),
    $window = $(window),
    $header = $('.header'),
		$headerPosition = ( $header.elExists() ) ? $header.offset().top : '',
		$mainHeaderHeight = ( $header.elExists() ) ? $header[0].getBoundingClientRect().height : 0,
		$headerTotalHeight = $headerPosition + $mainHeaderHeight;

/**********************
	*Активация Мобильного Меню
	***********************/

	const $mainMenuNav = $('.mainmenu-nav');
	$mainMenuNav.meanmenu({
	    meanScreenWidth: '991',
	    meanMenuContainer: '.mobile-menu',
	    meanMenuClose: '<span class="menu-close"></span>',
	    meanMenuOpen: '<span class="menu-bar"></span>',
	    meanRevealPosition: 'right',
	    meanMenuCloseSize: '0',
	});

  /**********************
	*Функция нажатия на гамбургер
	***********************/
  $('.hamburger-icon').click(function(e){
    e.preventDefault();
    $('.hamburger-icon').toggleClass('close');
  })

  /**********************
	*Функция нажатия на кнопки счетчика
	***********************/
  const catalogItemCounter = function (field) {

    var fieldCount = function(el) {

      var min = el.data('min') || false, // Мин. значение
         max = el.data('max') || false,  // Макс. значение
        dec = el.prev('#dec'),  // Кнопка уменьшения кол-ва
        inc = el.next('#inc'); // Кнопка увеличения кол-ва

      function init(el) {
        if(!el.attr('disabled')){
          dec.on('click', decrement);
          inc.on('click', increment);
        }

        // Уменьшим значение
        function decrement() {
          var value = parseInt(el[0].value);
          value--;

          if(!min || value >= min) {
            el[0].value = value;
          }
        };

        // Увеличим значение
        function increment() {
          var value = parseInt(el[0].value);

          value++;

          if(!max || value <= max) {
            el[0].value = value++;
          }
        };
      }

      el.each(function() {
        init($(this));
      });
    };

    $(field).each(function(){
      fieldCount($(this));
    });
  };

  // Вызов функции обработки счетчика
  catalogItemCounter('.counter-control__fieldCount');

  /**********************
	* Липкий Заголовок
  ***********************/

//  $(window).on('scroll', function(){
//   if ($(window).scrollTop() >= $headerTotalHeight+120) {
//     console.log('headerTotalHeight: ', $headerTotalHeight);

//       $('.fixed-header').addClass('sticky-header');
//   }
//   else {
//       $('.fixed-header').removeClass('sticky-header');
//   }
// });

$(window).on('scroll', function () {
  var scrollPos = $(this).scrollTop();
  if (scrollPos > 300) {
    $('.sticky-header').addClass('is-sticky');
    console.log('is-sticky');
  } else {

    $('.sticky-header').removeClass('is-sticky');
  }
});

  /**********************
	*Preloader
	***********************/

	$(window).on('load', function(){
		$('.es-preloader').removeClass("active");
  });

  	/* Header Minicart */
	$('.mini-cart-btn').on('click', function(e){
    e.preventDefault();
		$('.header-minicart').slideToggle(
      {
        duration: 800, // продолжительность анимации
        easing: "linear", // скорость анимации
      });
	});

})

