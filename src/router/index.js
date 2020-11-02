import Vue from "vue";
import VueRouter from "vue-router";
import search from "../components/Search.vue";
import lyric from "../components/Lyric.vue";
import index from "../components/index.vue";
import app from "../App.vue";

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


//将vue路由安装到Vue身上
Vue.use(VueRouter);


// 创建路由对象
var router = new VueRouter({
    routes: [
        {
            path: "/",
            component:index
        },
        {
            path: "/search",
            component:search
        },
        {
            path: "/lyric",
            component:lyric
        }
    ]
})


//将路由对象导出
export default router;