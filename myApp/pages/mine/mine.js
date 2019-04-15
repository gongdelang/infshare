const WXAPI = require('../../wxapi/main');
const { $Message } = require('../../components/iView/base/index');

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:"",
        infInfo:"",
        showTelNumber:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let userInfo = wx.getStorageSync("userInfo");
        let infInfo = wx.getStorageSync("infInfo");
        //WXAPI获取infInfo

        //测试
        infInfo = infInfo ? infInfo:{};
        infInfo.telNumber = "18758896369";
        infInfo.jiaoWuAccount = "1500304128";
        infInfo.jiaoWuPassword = "1500304128";
        infInfo.libraryAccount = "1500304128";
        infInfo.libraryPassword = "1500304128";
        wx.setStorageSync("infInfo",infInfo);
        
        this.setData({
            userInfo: userInfo,
            infInfo: infInfo,
            showTelNumber: infInfo.telNumber ? (infInfo.telNumber.substr(0, 3) +"****"+ infInfo.telNumber.substr(7, 4)):""
        });
    },

    /**
     * 用户自定义函数
     */
    goInfo:function(){
        let telNumber = this.data.infInfo.telNumber? this.data.infInfo.telNumber:"";
        wx.navigateTo({
            url: "../mine-phone/index?telNumber=" + telNumber
        });
    }

})