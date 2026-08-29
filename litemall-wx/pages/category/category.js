var util = require('../../utils/util.js');
var api = require('../../config/api.js');

// 批发改造：硬编码2个分类，不再依赖后端 GoodsCategory API
var CATEGORIES = [
  { id: 2000000, name: '食物' },
  { id: 2000001, name: '饮品' }
];

Page({
  data: {
    navList: CATEGORIES,
    goodsList: [],
    id: 2000000,
  },

  onLoad: function() {
    wx.setNavigationBarTitle({ title: '分类' });
    this.getGoodsList();
  },

  onShow: function() {
    // 从其他页面回来时刷新一下
    this.setData({ goodsList: [] });
    this.getGoodsList();
  },

  getGoodsList: function() {
    var that = this;
    util.request(api.GoodsList, {
      categoryId: that.data.id,
      page: 1,
      limit: 100
    }).then(function(res) {
      that.setData({
        goodsList: res.data.list || []
      });
    }).catch(function(err) {
      console.error('分类商品加载失败', err);
    });
  },

  switchCate: function(event) {
    var id = event.currentTarget.dataset.id;
    if (this.data.id == id) return;
    this.setData({ id: id, goodsList: [] });
    this.getGoodsList();
  }
});
