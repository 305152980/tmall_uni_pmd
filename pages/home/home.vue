<template>
  <view>
    <!-- 搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <scroll-view scroll-y="true" :style="{ height: wh + 'px' }">
      <!-- 轮播图的区域 -->
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
        <swiper-item v-for="(item, i) in swiperList" :key="i">
          <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
            <image :src="item.image_src"></image>
          </navigator>
        </swiper-item>
      </swiper>
      <!-- 分类导航区域 -->
      <view class="nav-list">
        <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
          <image :src="item.image_src" class="nav-img"></image>
        </view>
      </view>
      <!-- 楼层区域 -->
      <view class="floor-list">
        <view class="floor-item" v-for="(item, i) in floorList" :key="i">
          <!-- 楼层的标题 -->
          <image :src="item.floor_title.image_src" class="floor-title"></image>
          <!-- 楼层的图片区域 -->
          <view class="floor-img-box">
            <!-- 左侧大图片的盒子 -->
            <navigator class="left-img-box" :url="item.product_list[0].url">
              <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }"
                mode="widthFix"></image>
            </navigator>
            <!-- 右侧 4 个小图片的盒子 -->
            <view class="right-img-box">
              <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"
                :url="item2.url">
                <image :src="item2.image_src" :style="{ width: item2.image_width + 'rpx' }" mode="widthFix"></image>
              </navigator>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
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
        swiperList: [],
        navList: [],
        floorList: []
      };
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight - 50
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      },
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.swiperList = res.message
      },
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      navClickHandler(item) {
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg()
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 30rpx 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    width: 100%;
    height: 60rpx;
    margin-top: 34rpx;
  }

  .floor-list .floor-item:first-child .floor-title {
    margin-top: 10rpx;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;

    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
</style>
