'use strict';

describe('stockApp.view1 module', function() {

  beforeEach(module('stockApp.view1'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var stocksCtrl = $controller('stocksCtrl');
      expect(stocksCtrl).toBeDefined();
    }));

  });
});