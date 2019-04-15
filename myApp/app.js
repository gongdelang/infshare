const WXAPI = require('wxapi/main');

//app.js
App({
    globalData: {
        isConnected: true,
        navigateToLogin: false
    },
    
    onLaunch: function () {
        wx.setStorageSync("token", "saxas");
        const that = this;

        /**
        * 检测新版本
        */
        const updateManager = wx.getUpdateManager()
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                }
            })
        })

        /**
        * 初次加载判断网络情况
        * 无网络状态下根据实际情况进行调整
        */
        wx.getNetworkType({
            success(res) {
                const networkType = res.networkType
                if (networkType === 'none') {
                    that.globalData.isConnected = false
                    wx.showToast({
                        title: '当前无网络',
                        icon: 'loading',
                        duration: 2000
                    })
                }
            }
        });

        /**
        * 监听网络状态变化
        * 可根据业务需求进行调整
        */
        wx.onNetworkStatusChange(function (res) {
            if (!res.isConnected) {
                that.globalData.isConnected = false
                wx.showToast({
                    title: '网络已断开',
                    icon: 'loading',
                    duration: 2000
                })
            } else {
                that.globalData.isConnected = true;
                wx.hideToast();
            }
        });

        /**
         * 判断是否登录
         * 
         */
        WXAPI.checkToken().then(function (res) {
            if (res.code != 0) {
                //token有效，但是需要用户信息
                if (res.code != 10005) {
                    wx.removeStorageSync('token');
                }
                that.goLoginPageTimeOut();
            } else {
                if (!wx.getStorageSync("userInfo")) {
                    that.goLoginPageTimeOut();
                }
            }
        }).catch(function(err){
            wx.showToast({
                title: '服务器开小差了',
                icon:"none"
            });
        });
    },

    goLoginPageTimeOut: function () {
        //用锁锁住，防止多次登陆
        if (this.globalData.navigateToLogin) {
            return;
        }

        this.globalData.navigateToLogin = true;
        setTimeout(function () {
            wx.navigateTo({
                url: "/pages/login/login"
            })
        }, 1000);
    },

})