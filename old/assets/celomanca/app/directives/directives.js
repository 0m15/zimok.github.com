// angular application module
// --------------------------
stereomood
  .directive('progress', function() {
    return function(scope, element, attrs) {
      scope.$watch('track.loaded', function(loaded) {
        if(!loaded) return
        updateLoder(loaded)
      })
      function updateLoder(loaded) {
        element.css({
          'width': loaded + '%'
        })  
      }
    }
  })
  .directive('seeker', function() {
    return function(scope, element, attrs) {
      scope.$watch('track.cursor', function(position) {
        if(!position) return
        element.css({
          'width': position + '%'
        })
      })
    }
  })
  .directive('keyboard', ['$document', function($document) {
    var keyMaps = {
      'enter': ''
    } 
    return function(scope, element, attrs) {
      $document.bind('keydown', function(e) {
        scope.$emit('keyboard', e)  
      })
    }
  }])
  .directive('contenteditable', function() {
    console.log('contenteditable')
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        // view -> model
        elm.bind('blur', function() {
          scope.$apply(function() {
            ctrl.$setViewValue(elm.html());
          });
        });

        // model -> view
        ctrl.$render = function() {
          elm.html(ctrl.$viewValue);
        };

        // load init value from DOM
        ctrl.$setViewValue(elm.html());
      }
    }
  })