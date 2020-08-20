//
//
//
$(document).ready(function(){

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
  if ($(window).scrollTop() >= $headerTotalHeight) {
      $('.fixed-header').addClass('sticky-header');
  }
  else {
      $('.fixed-header').removeClass('sticky-header');
  }
});

  /**********************
	*Preloader
	***********************/

	$(window).on('load', function(){
		$('.zakas-preloader').removeClass("active");
	});

})

