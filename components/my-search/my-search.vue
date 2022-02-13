<template>
  <view class="my-search-container" :style="{ 'background-color': bgcolor }" @click="searchBoxHandler">
    <view class="my-search-box" :style="{ 'border-radius': radius + 'rpx' }">
      <!-- 使用 uni-ui 提供的图标组件。 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      // 背景颜色
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 36 // rpx
      }
    },
    data() {
      return {}
    },
    methods: {
      searchBoxHandler() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 51px;
    display: flex;
    align-items: center;
    padding: 0 20rpx;

    .my-search-box {
      height: 72rpx;
      background-color: #FFFFFF;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .placeholder {
        font-size: 30rpx;
        margin-left: 10rpx;
      }
    }
  }
</style>
