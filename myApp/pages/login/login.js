const WXAPI = require('../../wxapi/main');
const { $Message } = require('../../components/iView/base/index');

var app = getApp();
var loginData = {};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isLogin: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let that = this
        // //再检查一次token
        // WXAPI.checkToken().then(
        //     function (res) {
        //         if (res.code != 0) {
        //             //token有效，但是需要用户信息
        //             if (res.code != 10005) {
        //                 wx.removeStorageSync('token');
        //                 that.login();
        //             }
        //         }
        //     },
        //     function (err) {
        //         //console.log(err)
        //         $Message({
        //             content: '服务器开小差了!',
        //             type: 'error',
        //             duration: 3
        //         });
        //     }
        // )
    },

    /**
     * 获取用户信息（第一次需要用户手动点击接受授权）
     */
    bindGetUserInfo: function (e) {
        let that = this;

        //用户拒绝授权信息，直接返回（必须授权）
        if (!e.detail.userInfo) {
            $Message({
                content: '您点击了拒绝授权，将无法正常使用小程序，请重新授权!',
                type: 'warning',
                duration: 3
            });
            return;
        }

        //缓存用户信息
        wx.setStorageSync('userInfo', e.detail.userInfo);

        //装载登陆信息
        loginData.rawData = e.detail.rawData;
        loginData.signature = e.detail.signature;
        loginData.iv = e.detail.iv;
        loginData.encryptedData = e.detail.encryptedData;

        //给服务端发送用户信息
        WXAPI.sendUserInfo(loginData).then(
            function (res) {
                if (res.code != 0) {
                    //没有token，token错误，token失效，跳到登陆
                    if (res.code == -2 || res.code == 10003 || res.code == 10004) {
                        that.login();
                        return;
                    }
                    $Message({
                        content: '无法授权，请重试',
                        type: 'warning',
                        duration: 3
                    });
                } else {
                    if (loginData.rawData !== res.data.rawData) {
                        console.log("信息出错，但不影响逻辑");
                    }
                    // 回到原来的地方放
                    app.globalData.navigateToLogin = false;
                    wx.navigateBack();
                }
            },
            function (err) {
                //console.log(err);
                $Message({
                    content: '服务器开小差了!',
                    type: 'error',
                    duration: 3
                });
            }
        );
    },

    /**
     * 获取token接口
     */
    login: function () {
        const that = this;

        if (that.data.isLogin) {
            $Message({
                content: '正在登陆，请勿多次点击',
                type: 'warning',
                duration: 3
            });
            return;
        }

        that.data.isLogin = true;
        wx.login({
            success: function (res) {
                //console.log(res);
                WXAPI.login({code:res.code}).then(
                    function (res) {
                        // 登录错误
                        if (res.code != 0) {
                            //需要用户信息
                            if (res.code === 10005) {
                                wx.setStorageSync('token', res.data.token);
                                return;
                            }
                            $Message({
                                content: '无法登录，请重试',
                                type: 'error',
                                duration: 5
                            });
                        } else {
                            wx.setStorageSync('token', res.data.token)
                            if (!wx.getStorageSync('userInfo')) {
                                return;
                            }
                            // 回到原来的地方放
                            app. globalData.navigateToLogin = false;
                            wx.navigateBack();
                        }
                    },
                    function (err) {
                        //console.log(err)
                        $Message({
                            content: '服务器开小差了!',
                            type: 'error',
                            duration: 3
                        });
                    }
                ).then(() => { that.data.isLogin = false });
            }
        });
    },
})
