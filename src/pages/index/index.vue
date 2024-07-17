<template>
	<view class="content">
		<view class="mt-20">
      <uv-button type="primary" @click="getList" text="点击请求数据"
                 color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></uv-button>
    </view>
	</view>
</template>

<script setup>
	import { getCurrentInstance } from 'vue'

	const { ctx } = getCurrentInstance()
	const { API_DEMO_GET } = useRequest()
	const getList = () => {
		uni.showLoading({
			title: '加载中...'
		})
		API_DEMO_GET()
			.then((res) => {
				console.log(res)
				ctx.$uv.toast('请求成功')
				uni.hideLoading()
			})
			.catch(() => {
				uni.hideLoading()
			})
	}
	onMounted(() => {})
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20rpx 0;
	}
</style>
