const CONFIG = require('config.js')

const login = (data) => {
  let _url = CONFIG.baseUrl + CONFIG.subDomain + '/userController/login'
    wx.showLoading({
        title: '登陆中'
    });

  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: 'post',
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data);
      },
      fail(error) {
        reject(error);
      },
      complete() {
        wx.hideLoading();
        console.log("login-执行完毕");
      }
    })
  })
}

const request = (url, method, data, isLoading=true) => {
  let _url = CONFIG.baseUrl + CONFIG.subDomain + url

  // 获取token
  let token = wx.getStorageSync('token');

  return new Promise((resolve, reject) => {
    if (!token || token === '') {
        console.log('没有token');
        let res = {};
        res.code = -2;
        resolve(res);
        return;
    }
    if (isLoading){
        wx.showLoading({
            title: '加载中'
        });
    }
  

    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie':'token=' + token
      },
      success(request) {
        resolve(request.data);
      },
      fail(error) {
        reject(error);
      },
      complete() {
          if(isLoading){
              wx.hideLoading();
          }
         console.log(`${url}-执行完毕`);
      }
    })
  })
}


module.exports = {
    request,
    login,
    checkToken:() => {
        return request('/userController/checkToken', 'get')
    },
    sendUserInfo:(data) => {
        return request('/userController/sendUserInfo', 'post', data)
    },

    // 未实现接口
    //用户相关接口
    getInfInfo: () => {
        return request('/userController/getInfInfo', 'get');
    },
    getCode: (data) => {
        return request('/userController/getCode', 'post', data);
    },
    bindTel: (data) => {
        return request('/userController/bindTel', 'post', data);
    },
    bindJiaoWu: (data) => {
        return request('/userController/bindJiaoWu', 'post', data);
    },
    bindLibrary: (data) => {
        return request('/userController/bindLibrary', 'post', data);
    },

    //资讯相关接口
    getANotice:()=>{
        return request('/newController/getANotice', 'get', {}, false);
    }
}