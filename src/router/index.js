import Vue from 'vue'
import VueRouter from 'vue-router'
import discovery from '../views/03discovery.vue'
import playlists from "../views/04playlists.vue"
import songs from "../views/05songs.vue"
import mvs from "../views/06mvs.vue"
import search from "../views/07search.vue"
import mv from "../views/08mv.vue"
import playlist from "../views/09playlist.vue"

Vue.use(VueRouter)

const routes = [
    {
        path:"/",
        component:discovery
    },
  {
    path: '/discovery',
    name: 'Discovery',
    component: discovery
  },
  {
      path:"/playlists",
      component:playlists
  },
  {
      path:"/songs",
      component:songs
  },
  {
      path:"/mvs",
      component:mvs
  },
  {
    path:"/search",
    component:search,
    props:true
  },
  {
    path:"/mv",
    component:mv,
    name:"mv"
  },
  {
    path:"/playlist",
    component:playlist
  },
  {
    path:"/search",
    component:search
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router