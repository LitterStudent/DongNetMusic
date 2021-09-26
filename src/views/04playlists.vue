<template>
  <div class="playlists-container">
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="top.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{ top.name }}
        </div>
        <div class="info">
          {{ top.description }}
        </div>
      </div>
      <img :src="top.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <div class="tab-bar" @click="tagclick">
        <span class="item" :class="{ active: tag === '全部' }">全部</span>
        <span class="item" :class="{ active: tag === '欧美' }">欧美</span>
        <span class="item" :class="{ active: tag === '华语' }">华语</span>
        <span class="item" :class="{ active: tag === '流行' }">流行</span>
        <span class="item" :class="{ active: tag === '说唱' }">说唱</span>
        <span class="item" :class="{ active: tag === '摇滚' }">摇滚</span>
        <span class="item" :class="{ active: tag === '民谣' }">民谣</span>
        <span class="item" :class="{ active: tag === '电子' }">电子</span>
        <span class="item" :class="{ active: tag === '轻音乐' }">轻音乐</span>
        <span class="item" :class="{ active: tag === '影视原声' }"
          >影视原声</span
        >
        <span class="item" :class="{ active: tag === 'ACG' }">ACG</span>
        <span class="item" :class="{ active: tag === '怀旧' }">怀旧</span>
        <span class="item" :class="{ active: tag === '治愈' }">治愈</span>
        <span class="item" :class="{ active: tag === '旅行' }">旅行</span>
      </div>
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="item in lists" :key="item.id" @click="toPlaylist(item.id)">
            <!--img-wrap 图片的上边遮罩  -->
            <div class="img-wrap">
              <div class="num-wrap">
                <span class="desc">播放量：{{ item.vlayCount }}</span>
              </div>
              <img v-lazy="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function () {
    return {
      total: 0,
      page: 1,
      top: {},
      lists: [],
      tag: "全部",
    };
  },
  methods: {
    // watch:{
      
    // },
    toPlaylist(id){
      this.$router.push("/playlist?id="+id);
    },
    tagclick(e) {
      // console.log(e.target.nodeName);
      // 事件委托
      if (e.target.nodeName.toLocaleLowerCase() === "span") {
        this.tag = e.target.innerHTML;
      }
      this.page = 1;
      this.gettop();
      this.getlists();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getlists()
    },
     gettop(){
      // 顶部的精品歌单
      axios({
        url: "http://localhost:3000/top/playlist/highquality",
        method: "get",
        params: {
          limit: 1,
          cat: this.tag,
        },
      }).then((res) => {
        this.top = res.data.playlists[0];
        // console.log(this.top);
      });
     
    },
    getlists(){
      console.log(this.page);
 // 歌单列表
      axios({
        url: "http://localhost:3000/top/playlist/",
        method: "get",
        params: {
          limit: 10,
          offset: (this.page-1)*10,
          cat: this.tag,
        },
      }).then((res) => {
        this.lists = res.data.playlists;
        // console.log(res);
        this.total = res.data.total;
        // console.log(this.total);
      });
    }
  },
  created() {
    this.gettop();
    this.getlists();
  }
  
};
</script>

<style>
</style>