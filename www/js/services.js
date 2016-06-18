angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
//获取推送的消息
.factory('Pusher',function(){
  return {
  GetPush:function(subscribe,event,callback){
      if(!window.pusher){
        Pusher.log = function(message) {
          if (window.console && window.console.log) {
            window.console.log(message);
          }
        };

        window.pusher = new Pusher('27e8868aa3f9903b5947', {
          encrypted: true
        });

        // var channel = pusher.subscribe('test_channel');
        var channel = pusher.subscribe(subscribe);
        channel.bind(event,callback);
      }
  }
}
})

.factory('sort',function(){
  return {
    sortName:function(arr,empty) {
      if(!String.prototype.localeCompare)
      return null;

      var letters ="*abcdefghjklmnopqrstwxyz".split('');
      var zh ="啊把差大额发噶哈级卡啦吗那哦爬器然啥他哇西呀咋".split('');

      var segs = [];
      var curr;
      letters.map(function(item,i){
      curr = {letter: item, data:[]};
      arr.map(function(item){
      var firstAt=item.nickname.charAt(0).toLowerCase();
      console.log((!zh[i-1] || zh[i-1].localeCompare(item.nickname) <= 0) && item.nickname.localeCompare(zh[i]) == -1&&letters.indexOf(firstAt)==-1);
      if((!zh[i-1] || zh[i-1].localeCompare(item.nickname) <= 0) && item.nickname.localeCompare(zh[i]) == -1&&letters.indexOf(firstAt)==-1) {
      curr.data.push(item);
      }
      if (firstAt==curr.letter) {
      curr.data.push(item);
      }
      });
      if(empty || curr.data.length) {
      segs.push(curr);
      curr.data.sort(function(a,b){
      return a.nickname.localeCompare(b.nickname);
      });
      }
      });
      return segs;
      }
  }
})
.factory('time',function(){
  return{
    Format:function(){
      Date.prototype.Format = function (fmt) { //author: meizz
      var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
      };
    }
  }
})
