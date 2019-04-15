const WXAPI = require('../../wxapi/main');
const { $Message } = require('../../components/iView/base/index');

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */////
    data: {
        telNumber:"",
        code:"",
        isBind:true,
        isCode:true,
        codeText:"获取验证码",
        currentTime:60
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 用户自定义函数
     */
    /**
     * 获取input信息
     */
    getInputTel:function(e){
        this.setData({
            telNumber: e.detail.detail.value
        });
        let myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
        if (myreg.test(e.detail.detail.value)) {
            this.setData({
                isCode: false
            });
        }else{
            this.setData({
                isCode: true
            });
        }
    },
    getInputCode: function (e) {
        this.setData({
            code: e.detail.detail.value
        });
        
        let myregTel = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
        let myreg = /^[0-9]{4}$/;
        if (myreg.test(e.detail.detail.value) && myregTel.test(this.data.telNumber)) {
            this.setData({
                isBind: false
            });
        }else{
            this.setData({
                isBind: true
            });
        }
    },

     /**
     * 请求-获取code
     */
    getCode:function(){
        let that = this;
       
        that.setData({
            isCode: true,
        })

        //调用后台api
        let data = {};
        data.telNumber = this.data.telNumber;
        WXAPI.getCode(data).then(function (res) {
            if (res.code != 0) {
                if (res.code == -2) {
                    app.goLoginPageTimeOut();
                } else {
                    $Message({
                        content: res.msg,
                        type: 'error',
                        duration: 3
                    });
                }
                that.setData({
                    codeText: '重新获取',
                    iscode: false
                })
            } else {
                $Message({
                    content: "短信验证码已经发送",
                    type: 'success',
                    duration: 3
                });

                //设置一分钟的倒计时
                let interval = setInterval(function () {
                    that.data.currentTime--; //每执行一次让倒计时秒数减一
                    that.setData({
                        codeText: '重新获取' + that.data.currentTime + 's', //按钮文字变成倒计时对应秒数
                    })
                    if (that.data.currentTime <= 0) {
                        clearInterval(interval)
                        that.setData({
                            codeText: '重新获取',
                            currentTime: 60,
                            isCode: false
                        })
                    }
                }, 1000);

            }
        }).catch(function (err) {
            //console.log(err)
            $Message({
                content: "获取验证码出错",
                type: 'error',
                duration: 3
            });

            that.setData({
                codeText: '重新发送',
                currentTime: 60,
                isCode: false
            })
        })

    },

    /**
     * 请求-更新手机号码
     */
    updataTelNumber:function(){
        let infInfo = wx.getStorageSync("infInfo");
        infInfo.telNumber = this.data.telNumber;
        wx.setStorageSync("infInfo", infInfo);
        
        //WXAPI
    }

})