//一个页面调用多个ajax请求时，wx.showLoading要确认每个请求都有返回数据之后才会做关闭。所以计算同个页面的ajax请求的次数，并进行判断即可。ajaxTimes

//同时发送异步代码次数
let ajaxTimes = 0;

//promise封装，避免回调地狱
export const request = (params) => {
  //判断url中是否带有 /my/ ，此路径请求的是私有的路径，都需要带上header token

  //let header = { };
  //这样就是将header写死了，之后就会不方便在请求头里加新的属性了

  let header = { ...params.header }; //将params里传输过来的值进行合并，既能带上权限token，也能接收新的请求头属性信息
  if (params.url.includes("/my/")) {
    //拼接token 带上token
    header["Authorization"] = wx.getStorageSync("token");
  }
  ajaxTimes++;
  //显示加载中 效果
  wx.showLoading({
    title: "正在加载...", //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    // success: res => {}
  });

  //定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //关闭正在等待的图标
          wx.hideLoading();
        }
      },
    });
  });
};
