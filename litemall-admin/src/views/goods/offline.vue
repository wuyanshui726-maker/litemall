<template>
  <div class="app-container">
    <!-- 批发改造：商品下架管理 -->
    <div class="filter-container">
      <el-radio-group v-model="filterType" size="small">
        <el-radio-button label="all">全部异常</el-radio-button>
        <el-radio-button label="offline">已下架</el-radio-button>
        <el-radio-button label="expired">已过期</el-radio-button>
        <el-radio-button label="expiring">临期(30天内)</el-radio-button>
      </el-radio-group>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="fetchData">刷新</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-warning" :disabled="!canBatchOffline" @click="batchOffline">一键下架所有过期商品</el-button>
    </div>

    <el-table v-loading="listLoading" :data="filteredList" border fit highlight-current-row>
      <el-table-column align="center" label="ID" prop="id" width="80" />
      <el-table-column align="center" label="图片" width="100">
        <template slot-scope="scope">
          <el-image :src="scope.row.picUrl" style="width:60px;height:60px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column min-width="200" label="商品名称" prop="name" show-overflow-tooltip />
      <el-table-column align="center" label="零售价" width="100">
        <template slot-scope="scope">￥{{ scope.row.retailPrice }}</template>
      </el-table-column>
      <el-table-column align="center" label="到期日期" width="140">
        <template slot-scope="scope">
          <span :style="{color: isExpired(scope.row) ? '#f56c6c' : isExpiringSoon(scope.row) ? '#e6a23c' : '#67c23a'}">
            {{ scope.row.expireDate || '—' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.isOnSale" type="danger" size="mini">已下架</el-tag>
          <el-tag v-else-if="isExpired(scope.row)" type="danger" size="mini">已过期</el-tag>
          <el-tag v-else-if="isExpiringSoon(scope.row)" type="warning" size="mini">临期</el-tag>
          <el-tag v-else type="success" size="mini">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isOnSale" type="text" size="mini" @click="handleOnSale(scope.row)">上架</el-button>
          <el-button v-else type="text" size="mini" style="color:#f56c6c" @click="handleOffSale(scope.row)">下架</el-button>
          <el-button type="text" size="mini" @click="goEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="empty-tip" v-if="filteredList.length === 0 && !listLoading">
      暂无异常商品 🎉
    </div>
  </div>
</template>

<script>
import { listGoods, editGoods } from '@/api/goods'

export default {
  name: 'GoodsOffline',
  data() {
    return {
      listLoading: false,
      goodsList: [],
      filterType: 'all'
    }
  },
  computed: {
    filteredList() {
      var today = new Date()
      var thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

      return this.goodsList.filter(g => {
        var offline = !g.isOnSale
        var expired = this.isExpired(g)
        var expiring = this.isExpiringSoon(g)

        switch (this.filterType) {
          case 'offline': return offline
          case 'expired': return expired
          case 'expiring': return !offline && !expired && expiring
          case 'all':
          default: return offline || expired
        }
      })
    },
    canBatchOffline() {
      return this.goodsList.some(g => g.isOnSale && (this.isExpired(g) || this.isExpiringSoon(g)))
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // 拉全部商品，前端筛选
      listGoods({ page: 1, limit: 9999 }).then(res => {
        this.goodsList = res.data.list || []
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    parseDate(d) {
      if (!d) return null
      return new Date(d.replace(/-/g, '/'))
    },
    isExpired(row) {
      var d = this.parseDate(row.expireDate)
      if (!d) return false
      return d < new Date()
    },
    isExpiringSoon(row) {
      var d = this.parseDate(row.expireDate)
      if (!d) return false
      var today = new Date()
      var in30 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      return d >= today && d <= in30
    },
    handleOnSale(row) {
      this.$confirm('确认上架商品「' + row.name + '」？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doUpdate(row, true)
      }).catch(() => {})
    },
    handleOffSale(row) {
      this.$confirm('确认下架商品「' + row.name + '」？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doUpdate(row, false)
      }).catch(() => {})
    },
    doUpdate(row, onSale) {
      var newRow = Object.assign({}, row, { isOnSale: onSale })
      delete newRow.addTime
      delete newRow.updateTime
      editGoods(newRow).then(() => {
        this.$message.success(onSale ? '已上架' : '已下架')
        this.fetchData()
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    batchOffline() {
      var targets = this.goodsList.filter(g => g.isOnSale && (this.isExpired(g) || this.isExpiringSoon(g)))
      if (targets.length === 0) {
        this.$message.info('没有需要下架的商品')
        return
      }
      this.$confirm('确认批量下架 ' + targets.length + ' 个临期/过期商品？', '批量下架', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var chain = Promise.resolve()
        targets.forEach(t => {
          chain = chain.then(() => this.doUpdateQuiet(t))
        })
        chain.then(() => {
          this.$message.success('批量下架完成')
          this.fetchData()
        })
      }).catch(() => {})
    },
    doUpdateQuiet(row) {
      var newRow = Object.assign({}, row, { isOnSale: false })
      delete newRow.addTime
      delete newRow.updateTime
      return editGoods(newRow)
    },
    goEdit(row) {
      this.$router.push({ path: '/goods/edit', query: { id: row.id } })
    }
  }
}
</script>

<style scoped>
.empty-tip {
  text-align: center;
  padding: 80px 0;
  color: #999;
  font-size: 16px;
}
.filter-container {
  margin-bottom: 20px;
}
</style>
