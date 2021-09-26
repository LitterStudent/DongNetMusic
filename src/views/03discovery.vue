<template>
  <div>
    <div class="discovery-container" >
      <!-- 轮播图 -->
      <el-carousel class="el-carousel__container" :interval="4000" type="card" height="200px">
        <el-carousel-item
          class="el-carousel__item"
          v-for="item in banners"
          :key="item.imageUrl"
          @click.native="clickEvent"
        >
          <img :src="item.imageUrl" />
        </el-carousel-item>
      </el-carousel>
      <!-- 推荐歌单 -->
      <div class="recommend">
        <h3 class="title">推荐歌单</h3>
        <div class="items">
          <div class="item" v-for="item in list" :key="item.picUrl" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="desc-wrap">
                <span class="desc">
                  热门推荐
                </span>
              </div>
              <img v-lazy="item.picUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="news"> 
        <h3 class="title">最新音乐</h3>
        <div class="items">
          <div class="item" v-for="item in newSongs" :key = "item.id" @click="newMusice(item.id)">
          <div class="img-wrap">
          <div class="img">
            <img v-lazy="item.picUrl" >
            <span class="iconfont icon-play">
            </span>
          </div>
          </div>
          <div class="song-wrap content">
            
              <div class="song-name">
                {{item.song.name}}
              </div>
              <div class="singer">
                {{item.song.artists[0].name}}
              </div>
          </div>
          

        </div>
        </div>
      </div>
      <div class="mvs">
        <h3 class="title">推荐MV</h3>
        <div class="items">
          <div class="item" v-for="item in mvs" :key="item.id" @click="toMv(item.id)">
            <div class="img-wrap">
              <img v-lazy="item.picUrl" alt="">
              <span class="iconfont icon-play "></span>
              <div class="num_wrap">
                <div class="iconfont icon-play">
                </div>
                <div class="num">
                  {{item.playCount}}
                </div>
              </div>
            </div>
            <div class="info-wrap">
              <div class="name">
                {{item.name}}
              </div>
              <div class="singer">
                {{item.artists[0].name}}
              </div>
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
  data: function () {
    return {
      banners: {},
      list: {},
      newSongs:{},
      mvs:{}
    };
  },
  methods: {
    toMv(id){
      this.$router.push("/mv?id="+id);
    },
    toPlaylist(id){
      this.$router.push("/playlist?id="+id)
    },
    clickEvent(e) {
      console.log(e);
    },
    newMusice(id){
      const that = this;
       // 获取最新音乐的URL
    axios({
      url:"http://localhost:3000/song/url",
      method:'get',
      params:{
        id
      },
    }).then((res)=>{
      console.log(that);
      this.$parent.musicUrl = res.data.data[0].url
    })
    }
  },
  created() {
    axios({
      url: "http://localhost:3000/banner",
      method: "get",
    }).then((res) => {
      this.banners = res.data.banners;
      console.log(this.banners);
    });
    axios({
      url: "http://localhost:3000/personalized",
      method: "get",
      params:{
        limit:10
      }
    }).then((res) => {
      this.list = res.data.result;
      console.log(res);
    });
    // 最新音乐
    axios({
      url:"http://localhost:3000/personalized/newsong",
      method:"get"
    }).then((res)=>{
      this.newSongs = res.data.result
      console.log(this.newSongs);
    })
    // 最新MV
    axios({
      url:"http://localhost:3000/personalized/mv",
      method:"get"
    }).then((res)=>{
      // this.newSongs = res.data.result
      console.log(res);
      this.mvs = res.data.result
    })

   
  },
};
</script>
