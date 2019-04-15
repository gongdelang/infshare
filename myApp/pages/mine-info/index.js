const WXAPI = require('../../wxapi/main');
const { $Message } = require('../../components/iView/base/index');

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigationBarTitleText:"",
        bindType:"",
        infInfo:{},
        account:"",
        password:"",
        isModify: true,
        isBind: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let infInfo = wx.getStorageSync("infInfo");

        //根据绑定类型设置title
        if (options.bindType == "jiaoWu") {
            this.data.navigationBarTitleText = "绑定教务处账号";
        } else{
            this.data.navigationBarTitleText = "绑定图书馆账号";
        } 
        wx.setNavigationBarTitle({
            title: this.data.navigationBarTitleText
        });
        this.setData({
            navigationBarTitleText: this.data.navigationBarTitleText,
            bindType: options.bindType,
            infInfo: infInfo,
            account: options.bindType == "jiaoWu" ? infInfo.jiaoWuAccount : infInfo.libraryAccount,
            password: options.bindType == "jiaoWu" ? infInfo.jiaoWuPassword : infInfo.libraryPassword
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if(!this.data.account || !this.data.password){
            this.setData({
                isModify:false
            });
        }
    },

    
    /**
     * 用户自定义函数
     */
    /**
    * 获取input信息
    */
    getInputAccount: function (e) {
        this.setData({
            account: e.detail.detail.value
        });
    },
    getInputPassword: function (e) {
        this.setData({
            password: e.detail.detail.value
        });

        let myregAccount = /^[0-9a-zA_Z]+$/;
        if (e.detail.detail.value && myregAccount.test(this.data.account)) {
            this.setData({
                isBind: true
            });
        } else {
            this.setData({
                isBind: false
            });
        }
    },

    deleteInput:function(){
        this.setData({
            account:"",
            password:"",
            isBind:false,
            isModify:false
        });
    },
    /**
     * 请求-更新infInfo（教务处或者图书馆账号）
     */
    updataInfInfo:function(){
        if(this.data.bindType == "jiaoWu"){
            //WXAPI-更新教务处
        }else{
            //WXAPI-更新图书馆
        }
    }
})