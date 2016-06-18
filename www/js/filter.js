angular.module('starter.filters', [])
.filter('topic',function(){
  return function(x){
    if(x){
      var topic="#"+x+"#"
      return topic;
    }
    return;
  }
});
