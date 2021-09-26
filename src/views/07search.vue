<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.searchValue }}</h2>
      <span class="sub-title">共搜索到{{ count }}结果 </span>
    </div>
    <el-tabs v-model="activeIndex" @tab-click="handleClick">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              @dblclick="playmusic(item.id)"
              class="el-table__row"
              v-for="(item, index) in songlists"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <span
                      v-if="item.mvid !== 0"
                      class="iconfont icon-mv"
                    ></span>
                  </div>
                  <span v-if="item.alias.length > 0">{{ item.alias[0] }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album["name"] }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="(item,index) in playlists " :key="index" @click="toSongsList(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{(item.playCount/10000)>10?10+"万+":(item.playCount/10000).toFixed(2)+"万"}}</span>
              </div>
              <img v-lazy="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.name}}</p>
         </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item,index) in mvlist" :key="index" @click="toMv(item.id)" >
            <div class="img-wrap">
              <img v-lazy="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{(item.playCount/10000)>10?10+"万+":(item.playCount/10000).toFixed(2)+"万"}}</div>
              </div>
              <span class="time">{{item.duration}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artists["name"]}}</div>
            </div>
          </div>
       </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "result",
  data() {
    return {
      activeIndex: "songs",
      limit: 30,
      type: 1,
      songlists: [],
      count: 0, //搜索到的总数量
      playlists:[], //歌单数量,
      mvlist:[]
    };
  },
  methods: {
    toMv(id){
      this.$router.push("/mv?id="+id)
    },
    toSongsList(id){
      this.$router.push("/playlist?id="+id)
    },
    handleClick() {
      switch (this.activeIndex) {
        // activeIndex 是点击的TabsPane的 name属性 
        case "songs": {
          this.type = 1;
          break;
        }
        case "lists": {
          this.type = 1000;
          break;
        }
        case "mv":
          {
            this.type = 1004;
            break;
          }
      }
          this.getdata();
    },
    getdata() {
      axios({
        url: "http://localhost:3000/search",
        method: "get",
        params: {
          keywords: this.$route.query.searchValue,
          type: this.type,
          // offset:0
        },
      }).then((res) => {
        if (this.activeIndex === "songs") {
          // console.log(res);
          this.songlists = res.data.result.songs;
          this.count = res.data.result.songCount;
          this.songlists.map((item) => {
            let i = item.duration;
            let min = parseInt(i / 60000);
            let s = parseInt(i / 1000) % 60;
            if (s < 10) {
              s = "0" + s;
            }
            item.duration = `${min}:${s}`;
            return item;
          });
        }//如果切换tabs
        else if (this.activeIndex === "lists") {
        this.count = res.data.result.playlistCount;
        this.playlists = res.data.result.playlists
        }
        else if(this.activeIndex === "mv"){
          this.mvlist = res.data.result.mvs;
          this.count = res.data.result.mvCount;
          this.mvlist.map((item) => {
            let i = item.duration;
            let min = parseInt(i / 60000);
            let s = parseInt(i / 1000) % 60;
            if (s < 10) {
              s = "0" + s;
            }
            item.duration = `${min}:${s}`;
            return item;
          })
          console.log(this.mv);
        }
        // console.log(222);
        // console.log(res);
      });
    },

    playmusic(id) {
      axios({
        url: "http://localhost:3000/song/url",
        method: "get",
        params: {
          id,
        },
      }).then((res) => {
        console.log(res);
        this.$parent.musicUrl = res.data.data[0].url;
      });
    },
  },
  created() {
    this.getdata();
  },
};
</script>

<style>
</style>