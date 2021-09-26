<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img v-lazy="listdata.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{listdata.name}}</p>
        <div class="author-wrap">
          <img class="avatar" v-lazy="listdata.creator.avatarUrl" alt="" />
          <span class="name">{{listdata.creator.nickname}}</span>
          <span class="time">{{listdata.createTime}}创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item,index) in listdata.tags" :key="index">
              {{item}}
              </li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">
           {{listdata.description}}
          </span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <table class="el-table playlit-table">
          <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in listdata.tracks" :key="index" @dblclick="playMusic(item.id)">
              <td>{{index+1}}</td>
              <td>
                <div class="img-wrap">
                  <img v-lazy="item.al.picUrl " alt="" />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv"></span>
                  </div>
                  <span>{{item.alia[1]}}</span>
                </div>
              </td>
              <td>{{item.ar[0].name}}</td>
              <td>{{item.alia[0]}}</td>
              <td>{{item.dt}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="'评论('+newCommentCount+')'" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap"  v-if="hotComments.length>0">
          <p class="title">精彩评论<span class="number">({{commentCount}})</span></p>
          <div class="comments-wrap">
            <div class="item"  v-for="(item,index) in hotComments" :key="index">
              <div class="icon-wrap">
                <img v-lazy="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <!-- 评论的回复 -->
                <div class="re-content" v-if="item.beReplied.length!=0">
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">({{this.newCommentCount}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item,index) in newComments" :key="index">
              <div class="icon-wrap">
                <img v-lazy="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}：</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <!-- 评论的回复 -->
                <div class="re-content" v-if="item.beReplied.length!=0">
                  <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                  <span class="comment">{{item.beReplied[0].content}}</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="newCommentCount"
          :current-page="page"
          :page-size="limit"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios"
export default {
    data:function(){
        return{
            activeIndex:"1",
            listdata:{}, //歌单信息,
            total:0,
            page:1,
            hotComments:[],
            commentCount:0,
            newComments:[],
            newCommentCount:0,
            limit:10
        }
    },
    methods:{
      playMusic(id) {
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
      handleCurrentChange(val){
        this.page = val
        console.log(this.page);
               // 获取最新评论
      axios({
        url:"http://localhost:3000/comment/playlist",
        method:"get",
        params:{
          limit:this.limit,
          id:this.$route.query.id,
          offset:(this.page-1)*this.limit
        }
      }).then(res=>{
           console.log(res);
           this.newComments = res.data.comments;
      })
      }
    },
    created(){
      console.log(this.$route.query.id);
      // 获取歌单详情
      axios({
        url:"http://localhost:3000/playlist/detail",
        method:"get",
        params:{
          id:this.$route.query.id
        }
      }).then(res=>{
        console.log(res);
        this.listdata = res.data.playlist;
        this.listdata.tracks.map((item) => {
            let i = item.dt;
            let min = parseInt(i / 60000);
            let s = parseInt(i / 1000) % 60;
            if (s < 10) {
              s = "0" + s;
            }
            item.dt = `${min}:${s}`;
            return item;
          })
      })
      // 获取热门评论
      axios({
        url:"http://localhost:3000/comment/hot",
        method:"get",
        params:{
          type:2,
          id:this.$route.query.id
        }
      }).then(res=>{
        console.log(res);
        this.hotComments = res.data.hotComments;
        this.commentCount = res.data.total; 
        console.log(this.hotComments);
      })
       // 获取最新评论
      axios({
        url:"http://localhost:3000/comment/playlist",
        method:"get",
        params:{
          limit:this.limit,
          id:this.$route.query.id,
          offset:(this.page-1)*this.limit
        }
      }).then(res=>{
        console.log(res);
        this.newCommentCount = res.data.total
        this.newComments = res.data.comments;
        this.total = Math.ceil(this.newCommentCount/10)
      })
    }
}
</script>

<style>

</style>