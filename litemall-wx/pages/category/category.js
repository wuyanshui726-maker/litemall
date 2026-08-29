var util = require('../../utils/util.js');
var api = require('../../config/api.js');

// 批发改造：只有2个顶级分类，直接硬编码
var CATEGORIES = [
  { id: 2000000, name: '食物' },
  { id: 2000001, name: '饮品' }
];

Page({
  data: {
    navList: CATEGORIES,
    goodsList: [],
    id: 2000000,  // 默认选中食物
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    limit: 10,
    pages: 1,
  },

  onLoad: function(options) {
    var that = this;
    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      });
    }

    wx.setNavigationBarTitle({ title: '分类' });

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    this.getGoodsList();
  },

  // 触底加载更多
  onReachBottom: function() {
    var that = this;
    var pagenum = that.data.page + 1;
    if (pagenum <= that.data.pages) {
      that.setData({ page: pagenum });
      that.getGoodsList();
    }
  },

  getGoodsList: function() {
    var that = this;
    util.request(api.GoodsList, {
        categoryId: that.data.id,
        page: that.data.page,
        limit: that.data.limit
      })
      .then(function(res) {
        var arr1 = that.data.goodsList;
        var arr2 = res.data.list;
        arr1 = arr1.concat(arr2);
        that.setData({
          goodsList: arr1,
          pages: res.data.pages
        });
      });
  },

  switchCate: function(event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return;
    }
    this.setData({
      id: event.currentTarget.dataset.id,
      page: 1,
      goodsList: []
    });
    this.getGoodsList();
  }
})
