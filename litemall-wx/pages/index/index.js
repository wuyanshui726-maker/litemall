const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data: {
    goodsCount: 0
  },

  onShareAppMessage: function() {
    return {
      title: '食品饮料批发商城',
      path: '/pages/index/index'
    }
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.getGoodsCount();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  getGoodsCount: function() {
    let that = this;
    util.request(api.GoodsCount).then(function(res) {
      that.setData({
        goodsCount: res.data
      });
    });
  },

  onLoad: function(options) {
    // 批发改造：简化首页，只保留商品总数
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var info_arr = scene.split(',');
      var _type = info_arr[0];
      var id = info_arr[1];
      if (_type == 'goods') {
        wx.navigateTo({ url: '../goods/goods?id=' + id });
      }
    }
    if (options.goodId) {
      wx.navigateTo({ url: '../goods/goods?id=' + options.goodId });
    }
    if (options.orderId) {
      wx.navigateTo({ url: '../ucenter/orderDetail/orderDetail?id=' + options.orderId });
    }

    this.getGoodsCount();
  },

  onShow: function() {
    this.getGoodsCount();
  }
})
