var util = require('../../utils/util.js');
var api = require('../../config/api.js');

// 批发改造：硬编码2个分类，不再依赖 CatalogList API
var NAV_LIST = [
  { id: 2000000, name: '食物' },
  { id: 2000001, name: '饮品' }
];

Page({
  data: {
    navList: NAV_LIST,
    id: 2000000,
    goodsList: [],
    goodsCount: 0,
    scrollHeight: 600
  },

  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        // 减去顶部搜索栏高度 88rpx ≈ 44px，减去 tabBar 高度
        that.setData({
          scrollHeight: res.windowHeight - 44 - 50
        });
      }
    });
    that.loadData();
  },

  onShow: function() {
    this.setData({ goodsList: [] });
    this.loadGoods();
  },

  loadData: function() {
    var that = this;
    util.request(api.GoodsCount).then(function(res) {
      that.setData({ goodsCount: res.data });
    });
    that.loadGoods();
  },

  loadGoods: function() {
    var that = this;
    util.request(api.GoodsList, {
      categoryId: that.data.id,
      page: 1,
      limit: 100
    }).then(function(res) {
      that.setData({ goodsList: res.data.list || [] });
    }).catch(function(err) {
      console.error('加载商品失败', err);
    });
  },

  switchCate: function(event) {
    var id = event.currentTarget.dataset.id;
    if (this.data.id == id) return;
    this.setData({ id: id, goodsList: [] });
    this.loadGoods();
  }
});
