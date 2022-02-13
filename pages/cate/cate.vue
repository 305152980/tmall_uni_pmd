<template>
  <view>
    <!-- 搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <view class="scroll-view-container">
      <!-- 左侧的滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{ height: wh + 'px' }">
        <view v-for="(item, i) in cateList" :key="i" :class="['left-scroll-view-item', i === active ? 'active' : '']"
          @click="activeChanged(i)">{{ item.cat_name }}</view>
      </scroll-view>
      <!-- 右侧的滑动区域 -->
      <scroll-view scroll-y="true" :style="{ height: wh + 'px' }" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">/ {{ item2.cat_name }} /</view>
          <!-- 三级分类的列表 -->
          <view class="cate-lv3-list">
            <!-- 三级分类的 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 三级分类的文本 -->
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        // 当前设备可用的高度。
        wh: 0,
        cateList: [],
        // 左侧默认激活项。
        active: 0,
        cateLevel2: [],
        scrollTop: 0
      };
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight - 50
      this.getCateList()
    },
    methods: {
      // 获取分类列表的数据。
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      },
      // 一级分类改变事件。
      activeChanged(i) {
        this.active = i
        this.cateLevel2 = this.cateList[i].children
        // 置顶右侧的滚动条。
        // this.scrollTop = this.scrollTop === 0 ? 1 : 0
        this.scrollTop = Math.random()
      },
      // 跳转到商品列表页面。
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 240rpx;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 120rpx;
        text-align: center;
        font-size: 24rpx;

        &.active {
          // & 是并集选择器。
          background-color: #FFFFFF;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 6rpx;
            height: 60rpx;
            background-color: #C00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 24rpx;
    font-weight: bold;
    text-align: center;
    padding: 30rpx 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 20rpx;

      image {
        width: 120rpx;
        height: 120rpx;
      }

      text {
        font-size: 24rpx;
      }
    }
  }
</style>
