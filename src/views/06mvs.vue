<template>
  <div class="mvs-container">
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap" @click="choseArea">
          <li class="tab">
            <span class="title" :class="{active:area=='全部'}">全部</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='内地'}">内地</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='港台'}">港台</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='欧美'}">欧美</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='日本'}">日本</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='韩国'}">韩国</span>
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type" :class="{active:type=='类型'}">类型:</span>
        <ul class="tabs-wrap" @click="choseType">
          <li class="tab">
            <span class="title " :class="{active:type=='全部'}" >全部</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='官方版'}">官方版</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='原声'}">原声</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='现场版'}">现场版</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='网易出品'}">网易出品</span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap" @click="choseOrder">
          <li class="tab">
            <span class="title" :class="{active:order=='上升最快'}">上升最快</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:order=='最热'}">最热</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:order=='最新'}">最新</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- mv容器 -->
    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div class="item" v-for="(item,index) in mvs" :key="index" @click="toMv(item.id)">
          <div class="img-wrap">
            <img v-lazy="item.cover" alt="" />
            <div class="num_wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{playNum(item.playCount)}}万+</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
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
        :page-size="5"
        :limit="limit"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: 'mvs',
  data() {
    return {
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 8,
      mvs:[],
      area:"全部",
      type:"全部",
      order:"上升最快"
    };
  },
  methods: {
     playNum(playCount){
        return (playCount/10000)>10?10:(playCount/10000).toFixed(2); 
    },
    choseArea(e){
      if(e.target.nodeName.toLocaleLowerCase() ==="span"){
        console.log(e.target.innerHTML);
        this.area = e.target.innerHTML;
        this.page =1
        this.getdata()
      }
    },
    choseType(e){
      if(e.target.nodeName.toLocaleLowerCase() ==="span"){
        console.log(e.target.innerHTML);
        this.type = e.target.innerHTML;
        this.page = 1;
        this.getdata()
      }
    },
    choseOrder(e){
      if(e.target.nodeName.toLocaleLowerCase() ==="span"){
        console.log(e.target.innerHTML);
        this.order = e.target.innerHTML;
        this.page = 1
        this.getdata()
      }
    },
    toMv(id) {
      this.$router.push(`/mv?id=${id}`);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getdata();
      console.log(`当前页: ${val}`);
    },
    getdata(){
          axios({
      url:"http://localhost:3000/mv/all",
      method:"get",
      params:{
         limit:this.limit,
        area:this.area,
        type:this.type,
        order:this.order,
        offset:(this.page-1)*this.limit
      }
    }).then(res=>{
      this.mvs = res.data.data;
      this.total = res.data.count ||this.total
      console.log(res);
    })
    }
  },
  computed:{
   
  },
  created(){
    this.getdata();
  }
};
</script>

<style>

</style>