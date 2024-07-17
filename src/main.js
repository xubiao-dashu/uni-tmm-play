import {
	createSSRApp
} from 'vue'
import App from './App.vue'
import {
	setupStore
} from './store'
import 'virtual:uno.css'
import uvUI from '@climblee/uv-ui'

export function createApp() {
	const app = createSSRApp(App)
	setupStore(app)
	app.use(uvUI)
	return {
		app
	}
}