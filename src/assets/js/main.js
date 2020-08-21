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
	*Функция нажатия на гамбургер
	***********************/
  $('.hamburger-icon').click(function(){
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

 $(window).on('scroll', function(){
   console.log('scroll');

  if ($(window).scrollTop() >= $headerTotalHeight) {
      $('.fixed-header').addClass('sticky-header');
      console.log('addClass');
  }
  else {
      $('.fixed-header').removeClass('sticky-header');
      console.log('removeClass');
  }
});

  /**********************
	*Preloader
	***********************/

	$(window).on('load', function(){
		$('.zakas-preloader').removeClass("active");
	});

})

