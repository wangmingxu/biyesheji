angular.module('starter.directives', [])
.directive("avatarUpload",function($http,prefix,$ionicPopup){
  return{
    restrict:'EAC',
    scope:{
      result:"=avatar"      //等于号绑定   绑定一个外部Scope的值  result和外部scope的值双向绑定
    },
    template:"<input type='file' name='name' value='' class='avatar' accept='image/*'>",
    link:function($scope,$element,$attr){
      $element.bind('change', function(e) {
        console.log(this);   //this指向指令元素
        console.log(e.target.files);   //file对象
        console.log($scope.result);
        // $scope.result="244141"              //有时成功有时失败,原因不明      要传数据出去可以用localstroge
        var type=e.target.files[0].type.split('/')[1];    //获取图片后缀
        console.log("The image type is"+type);
        //选择的图片不能大于5M
        if(e.target.files[0].size>5120000){
          var alertPopup = $ionicPopup.alert({
            // title: '错误',
            template: '<p style="text-align:center" class="padding">图片过大，请选择其他图片</p>'
          });
          alertPopup.then(function(res) {
            console.log('图片过大');
          });
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e){
            console.log(e.target.result);
            $scope.result=e.target.result;
            // angular.element(document.querySelector('#avatar')).attr('src', e.target.result);   //逼我操作DOM的...
            var url=prefix+"avatarUpload";
            var avatarbase64=e.target.result;
            $http({method: 'POST', url: url,data:{"avatar":avatarbase64,"type":type}})
              .then(function successCallback(data, status, headers, config) {
                console.log(data);
              },
              function errorCallback(data, status, headers, config) {
                console.log(data);
              });
        };
        reader.readAsDataURL(e.target.files[0]);
      });
      // $element.bind('click', function(e) {
      //   $scope.result="1234";          //成功
      // });
    }
  }
})

.directive("photoUpload",function($http,prefix,$ionicPopup){
  return{
    restrict:'EAC',
    require:'?ngModel',
    scope:{
      result:"=photo"      //等于号绑定   绑定一个外部Scope的值  result和外部scope的值双向绑定
    },
    template:"<li class='uploadPicView'>"+
            "<input type='file' class='inputFile'>"+
            "<span class='uploadimg'><img src='img/upload.png'></span>"+
            "</li>",
    link:function($scope,$element,$attr,ngModel){
      $element.bind('change', function(e) {
        console.log(this);   //this指向指令元素
        console.log(e.target.files);   //file对象
        console.log($scope.result);
        var fileinfo={};
        var type=e.target.files[0].type.split('/')[1];    //获取图片后缀
        console.log("The image type is"+type);
        //选择的图片不能大于5M
        if(e.target.files[0].size>5120000){
          var alertPopup = $ionicPopup.alert({
            // title: '错误',
            template: '<p style="text-align:center" class="padding">图片过大，请选择其他图片</p>'
          });
          alertPopup.then(function(res) {
            console.log('图片过大');
          });
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e){
            // console.log(e.target.result);
            // $scope.result=e.target.result;
            // fileinfo={type:type,data:e.target.result}
            $scope.result.push(e.target.result);
            console.log($scope.result);
            $scope.$apply(function(){
              ngModel.$setViewValue($scope.result);
            })
            // angular.element(document.querySelector('#avatar')).attr('src', e.target.result);   //逼我操作DOM的...
            // var url=prefix+"avatarUpload";
            // var avatarbase64=e.target.result;
            // $http({method: 'POST', url: url,data:{"avatar":avatarbase64,"type":type}})
            //   .then(function successCallback(data, status, headers, config) {
            //     console.log(data);
            //   },
            //   function errorCallback(data, statusl, headers, config) {
            //     console.log(data);
            //   });
        };
        reader.readAsDataURL(e.target.files[0]);
     });

    //  $element.on('click', function(e) {
    //    $scope.result="1234";          //成功
    //    $scope.$apply(function(){
    //      ngModel.$setViewValue("du9e");
    //    })
    //  });
    }
 }
})
