var login = function(){
	var redirect = 'https://www.facebook.com/dialog/oauth?client_id=698238793579627&redirect_uri=http://cythilya.apphb.com:52533/Social/Facebook/TaggableFriends&scope=publish_actions';
	location.href = redirect;
};

var SocialDemo = {};
SocialDemo.module = {
    version: '0.1',
    nameSocialDemoace: function(ns_string){
        var parts = ns_string.SocialDemolit('.'),
            parent = SocialDemo,
            i;
        if (parts[0] === 'SocialDemo'){
            parts = parts.slice(1);
        }
        for (i = 0; i < parts.length; i += 1){
            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    },
    inherit: function(Child, Parent){
        Child.prototype = new Parent();
    },
    taggableFriends: function(dModule){
		var dModule = $(dModule);
		var dFriendList = dModule.find('.friendList');
		var dMessgae = dModule.find('.message');
		var dShare = dModule.find('.btnShare');
		var dBtnLogin = dModule.find('.btnFBLogin');
		var friendString = '';
		
		dBtnLogin.click(function(e){
			e.preventDefault();
			login();
		});

		FBUtil.after(function (FB) {
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					dBtnLogin.hide();
					dMessgae.show();
					dShare.show();
					dFriendList.show();
					dMessgae.html('Loading...');
					
					FB.api('/me/taggable_friends', function(res) {
						if (res && !res.error) {
							var friendsData = res.data;
							dMessgae.html('');
							
							$.each(friendsData, function(index, value){
								var picture = friendsData[index].picture.data.url;

								HTML = "";
								HTML += [
									'<div class="friend">',
									'	<a target="_blank">',
									'		<img src="' + picture + '">',
									'	</a>',
									'	<div class="name">' + friendsData[index].name + '</div>',
									'   <div class="check"><input type="checkbox" class="checkbox" data-id="'+ value.id +'"></div>',
									'</div>'
								].join('');

								dFriendList.append(HTML);
							});	
						}
					});	
				}
				else {
					//FB.login();
				}
			});
		});	
		
		//Post
		dShare.click(function(e){
			e.preventDefault();
			
			var dFriends = dFriendList.find('.friend');
			var friendArr = [];
			
			dFriends.each(function(index, value){
				var dObj = $(value).find('.checkbox');
				
				if(dObj.attr('checked')){
					friendArr.push(dObj.data('id'));
				}
			});
			friendString = friendArr.join(',');
			
			//Post
			FB.login(function(){
				var params = {};
				params['name'] = 'Facebook Graph API & Demo Example - Taggable Friends';
				params['caption'] = 'Facebook Graph API & Demo Example - Taggable Friends';	
				params['description'] = 'Taggable Friends';
				params['message'] = 'Graph API是Facebook所推出的一種技術標準，它的核心概念是「物件與連結」。為什麼稱為「Graph API」呢？因為整個Facebook就是透過這些物件與連結建立而成的Social Graph。Facebook所提供存取的介面，就稱為「Graph API」。';
				params['link'] = 'http://bit.ly/1qtutRh';
				params['picture'] = 'https://lh4.googleusercontent.com/-nw381RE73SY/U5KlRrevDFI/AAAAAAAACMQ/FJnuqzQfnMA/w764-h509-no/twenty_800.jpg';
				params['tags'] = friendString;
				params['place'] = '647158178704039';//https://www.facebook.com/pages/Search-Engine-Optimization-Social-Media/647158178704039
			
				FB.api('/me/feed', 'post', params, function(response) {
				  if (!response || response.error) {
					alert('Error occured');
				  } else {
					alert('Post ID: ' + response.id);
				  }
				});
			}, {scope: 'publish_actions'});	
		});		
    },
	loginArea: function(dModule){
		var dModule = $(dModule);
		var dBtnFBLogin = dModule.find('.btnFBLogin');
		var dFacebookLogin = dModule.find('.btnFBLibraryLogin');
		var dBtnLogout = dModule.find('.btnLogout');
		
		//Customed Login
		dBtnFBLogin.click(function(e){
			e.preventDefault();
			var appid = '698238793579627';
			var redirect = 'https://www.facebook.com/dialog/oauth?client_id='+appid+'&redirect_uri=http://cythilya.apphb.com/Social/Facebook/FacebookLogin';
			location.href = redirect;
		});
		
		//FB.login()
		dFacebookLogin.click(function(e){
			e.preventDefault();
			
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					// the user is logged in and has authenticated your app,
					// and response.authResponse supplies
					// the user's ID, a valid access token, a signed request, 
					// and the time the access token and signed request each expire	
					console.log('Logged in.');
				}
				else if (response.status === 'not_authorized') {
					// the user is logged in to Facebook, but has not authenticated the app
				}					
				else {
					//response.status === 'unknown'
					// the user isn't logged in to Facebook.
					FB.login();
				}
			});
		});
		
		//FB.logout()
		dBtnLogout.click(function(e){
			e.preventDefault();
			
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					FB.logout(function(res){
						location.reload();
					});
				}
			});
		});
	}
};
(function(){
    var doWhileExist = function(ModuleID,objFunction){
        var dTarget = document.getElementById(ModuleID);
        if(dTarget){
            objFunction(dTarget);
        }                
    };
    doWhileExist('taggableFriends',SocialDemo.module.taggableFriends);
    doWhileExist('loginArea',SocialDemo.module.loginArea);
})();