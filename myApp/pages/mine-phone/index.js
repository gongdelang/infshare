const WXAPI = require('../../wxapi/main');
const { $Message } = require('../../components/iView/base/index');

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getPhoneNumber'),
        telNumber:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            telNumber: options.telNumber
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 用户自定义函数
     */
    bindGetPhoneNumber:function(e){
        console.log(e)
        if (!e.detail.iv || !e.detail.encryptedData){
            $Message({
                content: '无法授权，请重试',
                type: 'warning',
                duration: 3
            });
            return;
        }
        let data = {};
        data.iv = e.detail.iv;
        data.encryptedData = e.detail.encryptedData;
        //WXAPI解密+更新telNumber
        
    },

    goBindPhone:function(){
        wx.navigateTo({
            url: "./bind-phone"
        });
    }
 
})