angular.module('starter.controllers', [])
//微博首页Ctrl
.controller('DashCtrl', function($scope,$http,Pusher,prefix,time) {
      time.Format();
      var user_id=localStorage.user_id;
      var pushcallback=function(data) {
        if(navigator&&navigator.notification&&navigator.notification.vibrate){
        navigator.notification.vibrate(500);         //震动500ms
        }
        // navigator.notification.beep(2);
        // alert(data.from);
        alert('有新的消息');
      }
      Pusher.GetPush(user_id,'my_event',pushcallback);           //监听推送

      /*获取微博列表*/
          $scope.weibo_mode='square';
          $scope.$watch('weibo_mode',function(){
            switch ($scope.weibo_mode) {
              case "square":
                var url=prefix+"WeiBoSquare";
                $http({method: 'GET', url: url})
                    .then(function successCallback(res) {
                        $scope.postList=res.data;
                        console.log(res.data);
                    },
                    function errorCallback(data, status, headers, config) {
                        console.log(data);
                    });
                break;
              case "observe":
                var url=prefix+"WeiBoObserve";
                $http({method: 'GET', url: url})
                    .then(function successCallback(res) {
                        $scope.postList=res.data;
                        console.log(res.data);
                    },
                    function errorCallback(data, status, headers, config) {
                        console.log(data);
                    });
                break;
              case "new":
                var url=prefix+"WeiBoNew";
                $http({method: 'GET', url: url})
                    .then(function successCallback(res) {
                        $scope.postList=res.data;
                        console.log(res.data);
                    },
                    function errorCallback(data, status, headers, config) {
                        console.log(data);
                    });
                break;
              default:
                console.log("请选择一种模式");
            }
            /* 下拉刷新 */
            $scope.doRefresh = function() {
                $http.get(url)   //注意改为自己本站的地址，不然会有跨域问题
                    .success(function(newItems) {
                        $scope.postList = newItems;
                        console.log($scope.postList);
                    })
                    .finally(function() {
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            };
          })

      /*点赞*/
      $scope.parise=function(postId){
        var post_id=postId;
        var date= new Date().Format("MM-dd hh:mm");
        var data={post_id:post_id,date:date};
        console.log(data);
        var url=prefix+"parise";
        $http({method: 'POST', url: url,data:data})
            .then(function successCallback(res) {
              console.log(res);
              $scope.doRefresh();
            },
            function errorCallback(res) {
              console.log(res);
            });
      }

      /*收藏*/
      $scope.favourite=function(postId){
        console.log(postId);
        var post_id=postId;
        var date= new Date().Format("MM-dd hh:mm");
        var data={post_id:post_id,date:date};
        var url=prefix+"favourite";
        $http({method: 'POST', url: url,data:data})
            .then(function successCallback(res) {
              console.log(res);
              $scope.doRefresh();
            },
            function errorCallback(res) {
              console.log(res);
            });
      }
})
//注册Ctrl
.controller('SignUpCtrl',function($scope,$http,$ionicPopup,prefix,$location){
  //在userinfo插入一条刚注册的用户名数据
  var addUserinfo=function(){
    var url=prefix+'addUserinfo';
    $http({method: 'POST', url: url,data:{username:$scope.newUser.name}})
        .then(function successCallback(data, status, headers, config) {
          console.log(data);
          $location.path("/userinfo");
        },
        function errorCallback(data, status, headers, config) {
          console.log(data);
        });
  }
    $scope.newUser={};                //这里有个坑  如果直接绑定ng-model=name的话输入框的值变化反应不到controller的scope,但是却能反应到视图上的{{name}}
    // $scope.user.name="HelloMXU";
    // $scope.user.email="2477384533@qq.com";
    // $scope.user.password="wokaonilaji";
    // $scope.user.password_confirmation="wokaonilaji";
    $scope.register=function(newUser){
        var url=prefix+'auth/register';
        // var data={name:$scope.user.name,email:$scope.user.email,password:$scope.user.password,password_confirmation:$scope.user.password_confirmation};
        // console.log(data);
        $http({method: 'POST', url: url,data:newUser})
        .then(function successCallback(data, status, headers, config) {
          console.log(data);
          addUserinfo();
          $location.path("/userinfo");
          // location.href="#/tab/dash";
        },
        function errorCallback(data, status, headers, config) {
          var alertPopup = $ionicPopup.alert({
            // title: '错误',
            template: '<p style="text-align:center" class="padding">注册失败</p>'
          });
          alertPopup.then(function(res) {
            console.log('注册失败');
          });
        });
    }
})
//登陆Ctrl
.controller('LoginCtrl',function($scope,$http,$location,prefix,$ionicPopup){
    // $scope.user={username:"wangmingxu",password:"wokaonilaji"}
    $scope.user={};
    $scope.login=function(user){
        var url=prefix+'auth/login';
        $http({method: 'POST', url: url,data:user})
              .then(function successCallback(result) {
              console.log(result.data);
              localStorage.user_id=result.data.name;
              $location.path("/tab/dash");
            },
            function errorCallback(result) {
              console.log(result.data);
              var alertPopup = $ionicPopup.alert({
                // title: '错误',
                template: '<p style="text-align:center" class="padding">登陆失败</p>'
              });
              alertPopup.then(function(res) {
                console.log('登陆失败');
              });
            });
    }
})
//创建微博Ctrl
.controller('createCtrl',function($scope,$http,$ionicPopup, $ionicModal,prefix,$ionicHistory,time,$location){
  time.Format();
  $scope.photoList=[];
  $scope.friendList=[];
  $scope.atList=[];
//
  var url=prefix+"myFans";
  $http({method: 'GET', url: url})
      .then(function successCallback(res) {
        console.log(res.data);
        $scope.friendList=res.data;
      },
      function errorCallback(res) {
        console.log(res);
      });
//
  $scope.showPopup = function() {

        // 自定义弹窗
        $scope.data = {}
        var myPopup = $ionicPopup.show({
          template: '<div class="padding"><h3 style="text-align:center">请输入话题</h3><input type="text" ng-model="data.topic"></div>',
          // title: 'Enter Wi-Fi Password',
          // subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.topic) {
                  // 不允许用户关闭，除非输入
                  e.preventDefault();
                } else {
                  return $scope.data.topic;
                }
              }
            },
            { text: 'Cancel' },
          ]
        });
        myPopup.then(function(res) {
          $scope.topic=res;
        });
      }
//

$ionicModal.fromTemplateUrl('templates/modal.html', {
  scope: $scope
}).then(function(modal) {
  $scope.modal = modal;     //读取modal.html，现在可以用$scope.modal来调用它了
});

$scope.modalShow=function(){
  $scope.atList=[];
  $scope.modal.show();
}

$scope.finish = function(list) {
  // $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
  console.log(list);
  list.map(function(item,i){
    if(item.checked){
      $scope.atList.push(item.user_id);
    }
  })
  console.log($scope.atList);
  $scope.modal.hide();
};

$scope.canAdd=function(){
  var maxPhotoCount=9;
  var len=$scope.photoList.length;
  if(len<=maxPhotoCount)return true;
  else return false;
}
$scope.createPost=function(){
  var url=prefix+"createPost";
  var date = new Date().Format("MM-dd hh:mm");
  console.log(date);
  var data={date:date,content:$scope.content,topic:$scope.topic,photoList:$scope.photoList,atList:$scope.atList};
  $http({method: 'POST', url: url,data:data})
      .then(function successCallback(res) {
        console.log(res);
        $location.path('tab/dash');
      },
      function errorCallback(res) {
        console.log(res);
      });
}
/*返回按钮*/
$scope.historyback=function(){
  $ionicHistory.goBack();
}
})

//个人中心Ctrl
.controller('AccountCtrl',function($scope,$http,$ionicPopup,prefix,$location){
    var url=prefix+"account";
    $http({method: 'GET', url: url})
        .then(function successCallback(result) {
          console.log(result.data);
          var data=result.data;
          $scope.headUrl=data.headUrl;
          $scope.nickname=data.nickname;
          $scope.signature=data.signature;
          $scope.headUrl=data.headUrl;
          $scope.fans_count=data.fans_count;
          $scope.observe_count=data.observe_count;
          $scope.weibo_count=data.weibo_count;
        },
        function errorCallback(data, status, headers, config) {
          console.log(data);
        });

    /*退出登陆*/
    $scope.Logout=function(){
      var confirmPopup = $ionicPopup.confirm({
        template: '<div class="padding"><h3 style="text-align:center">是否退出该账户？</h3></div>'
      });
      confirmPopup.then(function(res) {
        if(res) {
          var url=prefix+"auth/logout"
          $http({method: 'GET', url: url})
              .then(function successCallback(res) {
                console.log("退出成功");
                $location.path("/login")
              },
              function errorCallback(data, status, headers, config) {
                console.log(data);
              });
        } else {
          console.log('You are not sure');
        }
      });
}

})

.controller('UserinfoCtrl', function($scope,$http,prefix,$ionicModal,$ionicPopup,$ionicHistory,$location) {
    //获取用户信息
    // $scope.headUrl='http://7xssdf.com1.z0.glb.clouddn.com/c60a4e7a42bb0dc7a631463f429648a5.jpg';
    var getInfoUrl=prefix+"getUserInfo";
    $http({method: 'GET', url: getInfoUrl})
    .then(function successCallback(res, status, headers, config) {
      console.log(res.data);
      var data=res.data;
      $scope.headUrl=data.headUrl;
      $scope.nickname=data.nickname;
      $scope.signature=data.signature;
      $scope.area=data.area;
      $scope.sex=data.sex;
    },
    function errorCallback(data, status, headers, config) {
      console.log(data);
    });
    //上传头像定义指令来处理
    $scope.data = {}
    //修改用户信息
    /*修改昵称*/
    $scope.setNickname=function(){
      // 自定义弹窗
      var myPopup = $ionicPopup.show({
        template: '<div class="padding"><h3 style="text-align:center">请输入昵称</h3><input type="text" ng-model="data.nickname"></div>',
        // title: 'Enter Wi-Fi Password',
        // subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.nickname) {
                // 不允许用户关闭，除非输入
                e.preventDefault();
              } else {
                return $scope.data.nickname;
              }
            }
          },
          { text: 'Cancel' },
        ]
      });
      myPopup.then(function(res) {
        if(res){
        $scope.nickname=res;
        }
      });
    }
    /*修改地区*/
    $scope.setArea=function(){
      // 自定义弹窗
      var myPopup = $ionicPopup.show({
        template: '<div class="padding"><h3 style="text-align:center">请输入地区</h3><input type="text" ng-model="data.area"></div>',
        // title: 'Enter Wi-Fi Password',
        // subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.area) {
                // 不允许用户关闭，除非输入
                e.preventDefault();
              } else {
                return $scope.data.area;
              }
            }
          },
          { text: 'Cancel' },
        ]
      });
      myPopup.then(function(res) {
        if(res){
        $scope.area=res;
        }
      });
    }

    /*输入签名*/
    $scope.setSignature=function(){
      // 自定义弹窗
      var myPopup = $ionicPopup.show({
        template: '<div class="padding"><h3 style="text-align:center">请输入签名</h3><input type="text" ng-model="data.signature"></div>',
        // title: 'Enter Wi-Fi Password',
        // subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.signature) {
                // 不允许用户关闭，除非输入
                e.preventDefault();
              } else {
                return $scope.data.signature;
              }
            }
          },
          { text: 'Cancel' },
        ]
      });
      myPopup.then(function(res) {
        if(res){
        $scope.signature=res;
        }
      });
    }


    /*保存修改*/
    $scope.updateinfo=function(){
      var updateData={};
      updateData.nickname=$scope.nickname;
      updateData.sex=$scope.sex;
      updateData.area=$scope.area;
      updateData.signature=$scope.signature;
      console.log(updateData);
      var updateUrl=prefix+"updateInfo";
      $http({method: 'POST', url: updateUrl,data:updateData})
          .then(function successCallback(data, status, headers, config) {
              console.log(data);
              $location.path('/tab/account');
          },
          function errorCallback(data, status, headers, config) {
              console.log(data);
          });
    }
    /*返回按钮*/
    $scope.historyback=function(){
      $ionicHistory.goBack();
    }
})

//添加关注好友
.controller('addFriendCtrl',function($scope,$http,prefix,$ionicPopup,$ionicHistory,$location,time){
  time.Format();
  $scope.noUser=true;
  $scope.findUserid=function(id){
    var url=prefix+"findUserid";
    var date = new Date().Format("MM-dd hh:mm");
    $http({method: 'POST', url: url,data:{user_id:id,date:date}})
        .then(function successCallback(res) {
          console.log(res.data);
          var data=res.data;
          if (res.data) {
            $scope.noUser=false;
          }
          $scope.headUrl=data.headUrl;
          $scope.nickname=data.nickname;
          $scope.signature=data.signature;
          $scope.ishufan=data.ishufan;
          $scope.area=data.area;
          $scope.sex=data.sex;
        },
        function errorCallback(res) {
          console.log(res);
        });
  }
  $scope.fanTa=function(id){
    var url=prefix+"addFriend";
    var date = new Date().Format("MM-dd hh:mm");
    $http({method: 'POST', url: url,data:{observe_id:id,date:date}})
        .then(function successCallback(res) {
            console.log(res.data);
            alert("添加成功");
        },
        function errorCallback(res) {
            console.log(res);
        });
  }
  /*返回按钮*/
  $scope.historyback=function(){
    $ionicHistory.goBack();
  }

})

//好友列表(我的关注)
.controller('friendCtrl',function($scope,$http,prefix,$ionicPopup,$ionicHistory,$location,sort){
    var url=prefix+"myObserve";
    $http({method: 'GET', url: url})
        .then(function successCallback(res) {
          console.log(res.data);
          var data=res.data;
          $scope.friendList=sort.sortName(data);
        },
        function errorCallback(res) {
          console.log(res);
        });
})


//评论
.controller('commentCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location,time){
  time.Format();
  $scope.sendComment=function(){
    var post_id=$stateParams.id;
    var comment=$scope.comment;
    var url=prefix+"comment";
    var date = new Date().Format("MM-dd hh:mm");
    var data={post_id:post_id,comment:comment,date:date};
    console.log(data);
    $http({method: 'POST', url: url,data:data})
        .then(function successCallback(res) {
          console.log(res);
          // $location.path("/")
          alert('评论成功')
        },
        function errorCallback(res) {
          console.log(res);
        });
  }
  /*返回按钮*/
  $scope.historyback=function(){
    $ionicHistory.goBack();
  }
})

.controller('MessageCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location){
      var url=prefix+"message";
      $http({method: 'GET', url: url})
        .then(function successCallback(res) {
          console.log(res);
          $scope.data=res.data;
        },
        function errorCallback(res) {
          console.log(res);
        });
})

.controller('favouriteCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location){
    var url=prefix+'mycollect';
    $http({method: 'GET', url: url})
        .then(function successCallback(res) {
          console.log(res);
          $scope.data=res.data;
        },
        function errorCallback(res) {
          console.log(res);
        });
})

.controller('myweiboCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location){
  var url=prefix+"myweibo";
  $http({method: 'GET', url: url})
      .then(function successCallback(res) {
          $scope.postList=res.data;
          console.log(res.data);
      },
      function errorCallback(data, status, headers, config) {
          console.log(data);
      });
  /* 下拉刷新 */
  $scope.doRefresh = function() {
      var url=prefix+"myweibo"
      $http.get(url)   //注意改为自己本站的地址，不然会有跨域问题
          .success(function(newItems) {
              $scope.postList = newItems;
              console.log($scope.postList);
          })
          .finally(function() {
              $scope.$broadcast('scroll.refreshComplete');
          });
  };


  /*点赞*/
  $scope.parise=function(postId){
    var post_id=postId;
    var date= new Date().Format("MM-dd hh:mm");
    var data={post_id:post_id,date:date};
    console.log(data);
    var url=prefix+"parise";
    $http({method: 'POST', url: url,data:data})
        .then(function successCallback(res) {
          console.log(res);
          $scope.doRefresh();
        },
        function errorCallback(res) {
          console.log(res);
        });
  }

  /*收藏*/
  $scope.favourite=function(postId){
    console.log(postId);
    var post_id=postId;
    var date= new Date().Format("MM-dd hh:mm");
    var data={post_id:post_id,date:date};
    var url=prefix+"favourite";
    $http({method: 'POST', url: url,data:data})
        .then(function successCallback(res) {
          console.log(res);
        },
        function errorCallback(res) {
          console.log(res);
        });
  }

  $scope.delWeibo=function(postId){
    console.log(postId);
    var post_id=postId;
    var url=prefix+'delWeibo'
    $http({method: 'POST', url: url,data:{post_id:post_id}})
        .then(function successCallback(res) {
            console.log(res);
            $scope.doRefresh();
        },
        function errorCallback(res) {
          console.log(res);
        });
  }

  $scope.historyback=function(){
    $ionicHistory.goBack();
  }

})
.controller('mypariseCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location){
  var url=prefix+"myparise";
  $http({method: 'GET', url: url})
      .then(function successCallback(res) {
          $scope.postList=res.data;
          console.log(res.data);
      },
      function errorCallback(data, status, headers, config) {
          console.log(data);
      });
  /* 下拉刷新 */
  $scope.doRefresh = function() {
      var url=prefix+"myparise"
      $http.get(url)   //注意改为自己本站的地址，不然会有跨域问题
          .success(function(newItems) {
              $scope.postList = newItems;
              console.log($scope.postList);
          })
          .finally(function() {
              $scope.$broadcast('scroll.refreshComplete');
          });
  };


  /*点赞*/
  $scope.parise=function(postId){
    var post_id=postId;
    var date= new Date().Format("MM-dd hh:mm");
    var data={post_id:post_id,date:date};
    console.log(data);
    var url=prefix+"parise";
    $http({method: 'POST', url: url,data:data})
        .then(function successCallback(res) {
          console.log(res);
          $scope.doRefresh();
        },
        function errorCallback(res) {
          console.log(res);
        });
  }

  /*收藏*/
  $scope.favourite=function(postId){
    console.log(postId);
    var post_id=postId;
    var date= new Date().Format("MM-dd hh:mm");
    var data={post_id:post_id,date:date};
    var url=prefix+"favourite";
    $http({method: 'POST', url: url,data:data})
        .then(function successCallback(res) {
          console.log(res);
        },
        function errorCallback(res) {
          console.log(res);
        });
  }
})

.controller('weibodetailCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location){
    var post_id=$stateParams.id;
    console.log(post_id);
    var url=prefix+"weibodetail";
    var data={post_id:post_id};
    $http({method: 'POST', url: url,data:data})
        .then(function successCallback(res) {
            console.log(res);
            $scope.post=res.data;
        },
        function errorCallback(res) {
          console.log(res);
        });

        /*点赞*/
        $scope.parise=function(){
          var date= new Date().Format("MM-dd hh:mm");
          var data={post_id:post_id,date:date};
          console.log(data);
          var url=prefix+"parise";
          $http({method: 'POST', url: url,data:data})
              .then(function successCallback(res) {
                console.log(res);
                $scope.doRefresh();
              },
              function errorCallback(res) {
                console.log(res);
              });
        }

        /*收藏*/
        $scope.favourite=function(){
          console.log(postId);
          var date= new Date().Format("MM-dd hh:mm");
          var data={post_id:post_id,date:date};
          var url=prefix+"favourite";
          $http({method: 'POST', url: url,data:data})
              .then(function successCallback(res) {
                console.log(res);
                $scope.doRefresh();
              },
              function errorCallback(res) {
                console.log(res);
              });
        }

      $scope.historyback=function(){
        $ionicHistory.goBack();
      }
})


.controller('friendinfoCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location){
    var friend_id=$stateParams.friend_id;
    console.log(friend_id);
    var url=prefix+"friendInfo";
    var data={friend_id:friend_id};
    $http({method: 'POST', url: url,data:data})
        .then(function successCallback(res) {
            console.log(res);
            $scope.friendInfo=res.data;
        },
        function errorCallback(res) {
          console.log(res);
        });

    $scope.historyback=function(){
      $ionicHistory.goBack();
    }

        /*点赞*/
        $scope.parise=function(post_id){
          var date= new Date().Format("MM-dd hh:mm");
          var data={post_id:post_id,date:date};
          console.log(data);
          var url=prefix+"parise";
          $http({method: 'POST', url: url,data:data})
              .then(function successCallback(res) {
                console.log(res);
                $scope.doRefresh();
              },
              function errorCallback(res) {
                console.log(res);
              });
        }

        /*收藏*/
        $scope.favourite=function(post_id){
          var date= new Date().Format("MM-dd hh:mm");
          var data={post_id:post_id,date:date};
          var url=prefix+"favourite";
          $http({method: 'POST', url: url,data:data})
              .then(function successCallback(res) {
                console.log(res);
                $scope.doRefresh();
              },
              function errorCallback(res) {
                console.log(res);
              });
        }
})

.controller('myphotoCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location){
  var url=prefix+"myphoto";
  $http({method: 'GET', url: url})
      .then(function successCallback(res) {
          console.log(res);
          $scope.data=res.data;
      },
      function errorCallback(res) {
          console.log(res);
      });

      $scope.historyback=function(){
        $ionicHistory.goBack();
      }
})

.controller('searchweiboCtrl',function($scope,$stateParams,$http,prefix,$ionicPopup,$ionicHistory,$location){
  var url=prefix+'searchTopic';
  // var topic=$scope.topic;
  $scope.searchTopic=function(topic){
    console.log(topic);
    $http({method: 'POST', url: url,data:{topic:topic}})
        .then(function successCallback(res) {
              console.log(res);
              $scope.postList=res.data;
        },
        function errorCallback(res) {
              console.log(res);
        });
  }
})
