(function(factory) {
  var root = (typeof self == 'object' && self.self === self && self) ||
      (typeof global == 'object' && global.global === global && global);

  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'exports'], function($, exports) {
      root.animatedModal = factory(root, $);
    });
  } else if (typeof exports !== 'undefined') {
    var $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, $);
  } else {
    root.$animatedModal = factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
  }
})(function(root, $) {
  $.fn.animatedModal = function(options) {
    var modal = $(this),
      currentContext = this;

      //Defaults
      var settings = $.extend({
        modalTarget:'animatedModal',
        animatedIn: 'zoomIn',
        animatedOut: 'zoomOut',
        // Callbacks
        beforeOpen: function() {},
        afterOpen: function() {},
        beforeClose: function() {},
        afterClose: function() {},
        zoomOutTimeout: 1
      }, options);

      var closeBt = $('.close-'+settings.modalTarget);

      ['beforeOpen', 'afterOpen', 'beforeClose', 'afterClose'].forEach(function(key) {
        if (key in settings) {
          settings[key] = settings[key].bind(this);
        }
      }, this);

      var href = $(modal).attr('href'),
        id = $('body').find('#'+settings.modalTarget),
          idConc = '#'+id.attr('id');

          // Default Classes
          id.addClass('animated');
          id.addClass(settings.modalTarget+'-off');
          id.addClass('animated-off');

          modal.click(function(event) {
            event.preventDefault();
            $('body, html').css({'overflow':'hidden'});

            if (href == idConc) {
              if (id.hasClass(settings.modalTarget+'-off')) {
                id.removeClass(settings.modalTarget+'-off');
                id.addClass(settings.modalTarget+'-on');
                id.removeClass('animated-off');
                id.addClass('animated-on');
                id.removeClass(settings.animatedOut);
              }

              if (id.hasClass(settings.modalTarget+'-on')) {
                settings.beforeOpen(id);
                id.addClass(settings.animatedIn);
                id.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', afterOpen);
              };
            }
          });

          closeBt.click(function(event) {
            event.preventDefault();
            $('body, html').removeAttr('style');

            settings.beforeClose(id); //beforeClose
            if (id.hasClass(settings.modalTarget+'-on')) {
              // HOTFIX
              id.removeClass(settings.animatedIn);
              id.addClass(settings.animatedOut);
              id.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', afterClose);

              setTimeout(function() {
                id.removeClass(settings.modalTarget+'-on');
                id.removeClass('animated-on');
                id.addClass(settings.modalTarget+'-off');
                id.addClass('animated-off');
              }, settings.zoomOutTimeout);
            }
          });

          function afterClose () {
            settings.afterClose(id); //afterClose
          }

          function afterOpen () {
            settings.afterOpen(id); //afterOpen
          }

  }; // End animatedModal.js
});
