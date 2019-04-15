const { $Toast } = require('../../components/iView/base/index');
const WXAPI = require('../../wxapi/main');
var app = getApp();

Page({
    data: {
        banner: [
            "http://www.cjlu.edu.cn/upload/ad/1550934473809.jpg",
            "http://www.cjlu.edu.cn/upload/ad/1551259140098.jpg",
            "http://www.cjlu.edu.cn/upload/ad/1547459394963.jpg"],
        notice: { newId: 1, title: "年前，校长宋明顺在学工部部长赵蓓茁、国际教育学院院长吴宏宽、副院长赵自力、生命学院副书记徐鎏、后勤服务中心副书记朱然等人的陪同下" },
        news: [
            {   
                newId:"1",
                title: "奖学金公布", 
                brief: "信息工程学院大三第一学期奖学金公布情况",
                time:"2018-12-05",
                browse:105,
                imgUrl:"",
                tag:"NOTICE"
            },
            {
                newId: "2",
                title: "校园活动",
                brief: "信息工程学院社团之夜",
                time: "2018-12-05",
                browse: 224,
                imgUrl: "http://www.cjlu.edu.cn/upload/pic/1550459526254.png",
                tag: "ACTIVITY"
            },
            {
                newId: "3",
                title: "共庆新春",
                brief: "年前，校长宋明顺在学工部部长赵蓓茁、国际教育学院院长吴宏宽...",
                time: "2018-12-05",
                browse: 257,
                imgUrl: "http://www.cjlu.edu.cn/upload/pic/1550459526220.png",
                tag: "NEW"
            },
            {
                newId: "4",
                title: "后勤通知",
                brief: "一号楼西停水注意事项",
                time: "2018-12-05",
                browse: 20,
                imgUrl: "",
                tag: "OTHER"
            }
            ],
        noticeSpeed:2000,
        showLoadOk:false,
        showSpin:false,
        showActionSheet:false,
        actions: [
            {
                name: '分享',
                icon: 'share',
                openType: 'share'
            }
        ],
        shareNewId:""
    },

    onLoad:function(){
        let that = this;

        //WXAPI
        //每5秒获取notice
        /*setInterval(function() {
           WXAPI.getANotice().then(function(res){
               
           }).catch(function(err){
               
           });
        }, 5000)*/
    },

    /**
     * 自定义函数
     */

    /**
     * 打开新闻详情页
     */
    openNewDetail:function (e){
        //增加浏览量
        let that = this;
        let news =  this.data.news;
        news[e.currentTarget.dataset.index].browse = news[e.currentTarget.dataset.index].browse+1;
        this.setData({
            news: news
        });
        //WXAPI记录浏览量


        //跳转
        wx.navigateTo({
            url: '../new-detail/index?newId=' + e.currentTarget.dataset.newId
        })
    },

    /**
     * 上拉加载news数据
     */
    onReachBottom:function(e){
        let that = this;

        this.setData({
            showSpin: true,
            showLoadOk:false
        });

        //WXAPI获取随机资讯
      
        //测试
        setTimeout(function(){
            for (let i = 0; i < 4; i++) {
                that.data.news.push(that.data.news[i]);
            }
            that.setData({
                showSpin: false,
                showLoadOk: true,
                news: that.data.news
            });
        },2000)
    },
    
    /**
     * 分享接口
     */
    onShareAppMessage(){
        let that = this;
        return {
            title: 'CJLU信息共享',
            imageUrl: 'https://file.iviewui.com/iview-weapp-logo.png',
            path: '/../new-detail/index?newId=' + that.data.shareNewId
        };
    },

     /**
     * 打开actionSheet
     */
    openActionSheet(e) {
        this.setData({
            showActionSheet: true,
            shareNewId:e.currentTarget.dataset.newId
        });
    },

    /**
     * 点击了取消（actionSheet）
     */
    cancelActionSheet() {
        this.setData({
            showActionSheet: false
        });
    },

     /**
     * 点击了分享（actionSheet）
     */
    clickActionSheet() {
        const action = [...this.data.actions];
        action[0].loading = true;

        this.setData({
            actions: action
        });

        setTimeout(() => {
            action[0].loading = false;
            this.setData({
                showActionSheet: false,
                actions: action
            });
        }, 2000);
    }
})