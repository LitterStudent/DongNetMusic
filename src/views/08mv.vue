<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <div class="title">
        <h3>mv详情</h3>
      </div>
      <div class="video-wrap">
        <video controls :src="videUrl"></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="icon" alt="" />
          </div>
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mvInfo.name }}</h2>
          <div class="date">发布：{{ mvInfo.publishTime }}</div>
          <div class="number">播放：{{ playCount(mvInfo.playCount) }}次</div>
          <p class="desc">
            {{ mvInfo.desc }}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap">
        <p class="title">精彩评论<span class="number">({{hotComments.length}})</span></p>
        <div class="content-wrap">
          <div class="items" v-for="(item,index) in hotComments" :key="index">
            <div class="item">
            <div class="icon-wrap" >
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content" >
                <span class="name">{{item.user.nickname}}</span>
                <span class="content">:{{item.content}}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length>0">
                <span class="name">{{item.beReplied[0].user.nickname}}:</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{new Date(item.time)}}</div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">最新评论<span class="number">({{total}})</span></p>
        <div class="content-wrap" v-for="(item,index) in comments" :key="index">
          <div class="item">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}：</span>
                <span class="content">{{item.content}}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length>0">
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{new Date(item.time)}}</div>
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
        :limit="limit"
      >
      </el-pagination>
    </div>
    <!-- mv推荐 -->
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div
            class="item"
            v-for="item in recommondMvs"
            :key="item.id"
            @click="toMv(item.id)"
          >
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ playCount(item.playCount) }}</div>
              </div>
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      videUrl: "",
      // 总条数
      total: 20,
      // 页容量
      limit: 10,
      // 当前页码
      page: 1,
      // 推荐mv
      recommondMvs: [],
      // 本mv的id
      id: "",
      mvInfo: {},
      icon: "",
      hotComments:[],
      comments:[]
    };
  },
  methods: {
    playCount(num){
      return (num/10000)>10 ? "10万+":(num/10000).toFixed(2)+"万"
    },
    handleCurrentChange(page) {
      this.page = page;
      console.log(page);
      this.getComment();
      
    },
    toMv(id) {
      this.$router.push("/mv?id=" + id);
    },
    getData() {
      // 获取mv播放地址
      axios({
        url: "http://localhost:3000/mv/url",
        method: "get",
        params: {
          id: this.id,
        },
      }).then((res) => {
        console.log(res);
        this.videUrl = res.data.data.url;
      });
      // 获取相关mv地址
      axios({
        url: "http://localhost:3000/simi/mv",
        method: "get",
        params: {
          mvid: this.id,
        },
      }).then((res) => {
        this.recommondMvs = res.data.mvs;
        this.recommondMvs.map((item) => {
          let i = parseInt(item.duration / 60000);
          let j = parseInt((item.duration / 1000) % 60);
          if (j < 10) {
            j = "0" + j;
          }
          item.duration = `${i}:${j}`;
          return item;
        });
      });
      // 获取mv信息
      axios({
        url: "http://localhost:3000/mv/detail",
        method: "get",
        params: {
          mvid: this.id,
        },
      }).then((res) => {
        console.log(res);
        this.mvInfo = res.data.data;
      }).then(()=>{
        // 获取歌手头像
        axios({
        url: "http://localhost:3000/artists",
        methods: "get",
        params: {
          id: this.mvInfo.artistId,
        },
      }).then((res) => {
        console.log(res);
        console.log(res.data.artist.picUrl);
        this.icon = res.data.artist.picUrl;
      });
      });
      this.getComment();
      
      
    },
    getComment(){
       // 获取评论
      axios({
        url:"http://localhost:3000/comment/mv",
        methods:"get",
        params:{
          id:this.id,
          offset:this.page*10-10,
          limit:this.limit
        }
      }).then(res=>{
        console.log(res);
        this.hotComments = res.data.hotComments||this.hotComments;
        this.comments = res.data.comments;
        this.total = res.data.total
        console.log(this.hotComments);
      })
    }
  },
  watch: {
    $route() {
      this.getData();
    },
  },
  created() {
    this.id = this.$route.query.id;
    this.getData();
  },
};
</script>

<style>
</style>