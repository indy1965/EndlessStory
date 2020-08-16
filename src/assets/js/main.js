

$(document).ready(function(){
  $('.head-burger').click(function(){
    $('.head-burger').toggleClass('head-burger__active');
  })

  const catalogItemCounter = function (field) {

    var fieldCount = function(el) {

      var
        // Мин. значение
        min = el.data('min') || false,

        // Макс. значение
        max = el.data('max') || false,

        // Кнопка уменьшения кол-ва
        dec = el.prev('#dec'),

        // Кнопка увеличения кол-ва
        inc = el.next('#inc');

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

  catalogItemCounter('.fieldCount');

})

