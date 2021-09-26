<template>
  <div class="songs-container">
    <div class="tab-bar" @click="choseEvent">
      <span class="item" :class="{active: type===0}">全部</span>
      <span class="item" :class="{active: type===7}">华语</span>
      <span class="item" :class="{active: type===96}">欧美</span>
      <span class="item" :class="{active: type===8}">日本</span>
      <span class="item" :class="{active: type===16}">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table song-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="el-table__row" v-for="(item, index) in lists" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap" @click="choseMusic(item.id)">
              <img v-lazy="item.album.picUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span class="iconfont icon-mv"></span>
              </div>
              <span></span>
            </div>
          </td>
          <td>{{ item.album.artists["0"].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    choseMusic(id){
      
      axios({
        url:"http://localhost:3000/song/url",
        method:"get",
        params:{
          id
        }
      }).then(res=>{
        let url = res.data.data[0].url
        this.$parent.musicUrl = url;
      })
    },
    getdata() {
      axios({
        url: "http://localhost:3000/top/song",
        method: "get",
        params: {
          type: this.type,
        },
      }).then((res) => {
        this.lists = res.data.data;
        this.lists.map((item) => {
          let i = parseInt(item.duration / 60000);
          let j = parseInt((item.duration / 1000) % 60);
          if (j < 10) {
            j = "0" + j;
          }
          item.duration = `${i}:${j}`;
          return item;
        });
      });
    },
    choseEvent(e) {
      if (e.target.nodeName.toLocaleLowerCase() === "span") {
        let tag = e.target.innerHTML;
        if (tag === "全部") {
          this.type = 0;
        } else if (tag === "华语") {
          this.type = 7;
        } else if (tag === "欧美") {
          this.type = 96;
        } else if (tag === "日本") {
          this.type = 8;
        } else if (tag === "韩国") {
          this.type = 16;
        }
        this.getdata();
      }
    },
  },
  data: function () {
    return {
      lists: [],
      type: 0,
    };
  },
  created() {
    this.getdata();
  },
};
</script>

<style>
</style>