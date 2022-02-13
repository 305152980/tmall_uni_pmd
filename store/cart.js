export default {
  namespaced: true,

  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象。
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  mutations: {
    // 添加商品到购物车。
    addToCart(state, goods) {
      const findResult = state.cart.find(goodz => goodz.goods_id === goods.goods_id)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    // 更新购物车中商品的勾选状态。
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(goodz => goodz.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新购物车中商品的数量。
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(goodz => goodz.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据 Id 删除对应的商品。
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(goodz => goodz.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新购物车中所有商品的勾选状态。
    updateAllGoodsState(state, newState) {
      state.cart.forEach(goodz => goodz.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    }
  },
  getters: {
    // 购物车中所有商品的总数量。
    total(state) {
      // let c = 0
      // state.cart.forEach(goodz => c += goodz.goods_count)
      // return c
      // 0 是初始值。
      return state.cart.reduce((total, goodz) => total += goodz.goods_count, 0)
    },
    // 购物车中已勾选商品的总数量。
    checkedCount(state) {
      return state.cart.filter(goodz => goodz.goods_state).reduce((total, goodz) => total += goodz.goods_count, 0)
    },
    // 购物车中已勾选商品的总价格。
    checkedGoodsAmount(state) {
      return state.cart.filter(goodz => goodz.goods_state).reduce((total, goodz) => total += goodz.goods_count * goodz
        .goods_price, 0).toFixed(2)
    }
  }
}
