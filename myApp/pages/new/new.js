const { $Toast } = require('../../components/iView/base/index');
const WXAPI = require('../../wxapi/main');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperHeight:0,
        baseItemHeightNoImg:95,
        baseItemHeightImg:134,
        current: 'NOTICE',
        tabs: [
            {
                key: 'NOTICE',
                title: '通知',
            },
            {
                key: 'ACTIVITY',
                title: '活动',
            },
            {
                key: 'NEW',
                title: '资讯',
            },
            {
                key: 'OTHER',
                title: '其他',
            }
        ],
        news: { 
            NOTICE: [{
                newId: "1",
                title: "奖学金公布",
                brief: "信息工程学院大三第一学期奖学金公布情况",
                time: "2018-12-05",
                browse: 105,
                imgUrl: "",
                tag: "NOTICE"
            },
            {
                newId: "2",
                title: "校园活动",
                brief: "信息工程学院社团之夜",
                time: "2018-12-05",
                browse: 224,
                imgUrl: "http://www.cjlu.edu.cn/upload/pic/1550459526254.png",
                tag: "ACTIVITY"
            }], 
            ACTIVITY: [{
                newId: "1",
                title: "奖学金公布",
                brief: "信息工程学院大三第一学期奖学金公布情况",
                time: "2018-12-05",
                browse: 105,
                imgUrl: "",
                tag: "NOTICE"
            },
                {
                    newId: "2",
                    title: "校园活动",
                    brief: "信息工程学院社团之夜",
                    time: "2018-12-05",
                    browse: 224,
                    imgUrl: "http://www.cjlu.edu.cn/upload/pic/1550459526254.png",
                    tag: "ACTIVITY"
                }, {
                    newId: "1",
                    title: "奖学金公布",
                    brief: "信息工程学院大三第一学期奖学金公布情况",
                    time: "2018-12-05",
                    browse: 105,
                    imgUrl: "",
                    tag: "NOTICE"
                },
                {
                    newId: "2",
                    title: "校园活动",
                    brief: "信息工程学院社团之夜",
                    time: "2018-12-05",
                    browse: 224,
                    imgUrl: "http://www.cjlu.edu.cn/upload/pic/1550459526254.png",
                    tag: "ACTIVITY"
                }],
            NEW: [{
                newId: "1",
                title: "奖学金公布",
                brief: "信息工程学院大三第一学期奖学金公布情况",
                time: "2018-12-05",
                browse: 105,
                imgUrl: "",
                tag: "NOTICE"
            },
                {
                    newId: "2",
                    title: "校园活动",
                    brief: "信息工程学院社团之夜",
                    time: "2018-12-05",
                    browse: 224,
                    imgUrl: "http://www.cjlu.edu.cn/upload/pic/1550459526254.png",
                    tag: "ACTIVITY"
                }, {
                    newId: "1",
                    title: "奖学金公布",
                    brief: "信息工程学院大三第一学期奖学金公布情况",
                    time: "2018-12-05",
                    browse: 105,
                    imgUrl: "",
                    tag: "NOTICE"
                },
                {
                    newId: "2",
                    title: "校园活动",
                    brief: "信息工程学院社团之夜",
                    time: "2018-12-05",
                    browse: 224,
                    imgUrl: "http://www.cjlu.edu.cn/upload/pic/1550459526254.png",
                    tag: "ACTIVITY"
                }],
            OTHER: [{
                newId: "1",
                title: "奖学金公布",
                brief: "信息工程学院大三第一学期奖学金公布情况",
                time: "2018-12-05",
                browse: 105,
                imgUrl: "",
                tag: "NOTICE"
            },
                {
                    newId: "2",
                    title: "校园活动",
                    brief: "信息工程学院社团之夜",
                    time: "2018-12-05",
                    browse: 224,
                    imgUrl: "http://www.cjlu.edu.cn/upload/pic/1550459526254.png",
                    tag: "ACTIVITY"
                }]
        },
        showLoadOk: false,
        showSpin: false,
        showActionSheet: false,
        actions: [
            {
                name: '分享',
                icon: 'share',
                openType: 'share'
            }
        ],
        shareNewId: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData(this.data.current);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let that = this;
        return {
            title: 'CJLU信息共享',
            imageUrl: 'https://file.iviewui.com/iview-weapp-logo.png',
            path: '../new-detail/index?newId=' + that.data.shareNewId
        };
    },

    /**
   * 打开actionSheet
   */
    openActionSheet(e) {
        this.setData({
            showActionSheet: true,
            shareNewId: e.currentTarget.dataset.newId
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
    },

    /**
     * 打开新闻详情页
     */
    openNewDetail: function (e) {
        //增加浏览量
        let that = this;
        let news = this.data.news;
        console.log(e.currentTarget.dataset.index)
        if (this.data.current == "NOTICE") {
            news.NOTICE[0].browse +=1 ;
        } else if (this.data.current == "ACTIVITY"){
            news.ACTIVITY[e.currentTarget.dataset.index].browse = news.ACTIVITY[e.currentTarget.dataset.index].browse + 1;
        } else if (this.data.current == "NEW"){
            news.NEW[e.currentTarget.dataset.index].browse = news.NEW[e.currentTarget.dataset.index].browse + 1;
        }else{
            news.OTHER[e.currentTarget.dataset.index].browse = news.OTHER[e.currentTarget.dataset.index].browse + 1;
        }

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
     * 用户自定义函数
     */
    onTabsChange(e) {
        const { key } = e.detail;
        const index = this.data.tabs.map((n) => n.key).indexOf(key);
        this.setData({
            key,
            index,
            current: this.data.tabs[index].key
        });
        this.autoHeight(this.data.current);
    },

    onSwiperChange(e) {
        const { current: index, source } = e.detail
        const { key } = this.data.tabs[index]
        if (!!source) {
            this.setData({
                key,
                index,
                current: this.data.tabs[index].key
            })
        }
        this.autoHeight(this.data.current);
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        this.getData(that.data.current);
    },

    /**
     * 请求-获取数据
     */
    getData(current) {
        let that = this;
        let { news } = this.data;
        this.setData({
            showSpin: true,
            showLoadOk: false
        });
        //WXAPI-请求

        //测试
        setTimeout(() => {
            for (var i = 0; i < 2; i++) {
                if (current == "NOTICE") {
                    news.NOTICE.push(news.NOTICE[i]);
                } else if (current == "ACTIVITY") {
                    news.ACTIVITY.push(news.ACTIVITY[i]);
                } else if (current == "NEW") {
                    news.NEW.push(news.NEW[i]);
                } else {
                    news.OTHER.push(news.OTHER[i]);
                }
            }
            that.setData({
                showSpin: false,
                showLoadOk: true,
                news: news
            });
            that.autoHeight(current);
        }, 2000);
    },

    autoHeight(current) {
        let that = this;
        let { news, baseItemHeight } = that.data;
        let listData;
        if (current == "NOTICE") {
            listData = news.NOTICE;
        } else if (current == "ACTIVITY") {
            listData = news.ACTIVITY;
        } else if (current == "NEW") {
            listData = news.NEW;
        } else {
            listData = news.OTHER;
        }
        
        let swiperHeight =0;
        for(let i=0; i<listData.length; i++){
            if(listData[i].imageUrl !=""){
                swiperHeight += this.data.baseItemHeightImg;
            }else{
                swiperHeight += this.data.baseItemHeightNoImg;
            }
        }

        this.setData({
            swiperHeight: swiperHeight > 0 ? swiperHeight+40:200
        });

        wx.createSelectorQuery()
            .select('#load').boundingClientRect()
            .select('#'+that.data.current).boundingClientRect().exec(rect => {
                let _space = rect[0].top - rect[1].top;
                let height = swiperHeight - _space;
                console.log()
                console.log(rect)
                this.setData({
                    swiperHeight: height>0?height+50:200
                });
        })
    }
})