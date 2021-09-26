<template>
  <div class="top-container">
      <div class="left-box">
          <div class="icon-wrapper">
              <span class="iconfont icon-home"></span>
            <span class="iconfont icon-sami-select"></span>
            <span class="iconfont icon-full-screen"></span>
          </div>
           <div class="history-wrapper">
          <span class="iconfont icon-arrow-left"></span>
          <span class="iconfont icon-arrow-right"></span>
      </div>
      </div>
     
      <div class="right-box">
          <div class="el-input el-input--samll el-input--prefix">
              <input type="text"
                placeholder="搜索"
                class="el-input__inner"
                @keydown.enter="searchEvent"
                v-model="searchValue"
              >
              <span class="el-input__prefix">
                  <i class="el-input__icon el-icon-search"></i>
              </span>
          </div>
      </div>
  </div>
</template>

<script>
export default {
 data:function(){
     return {
         searchValue:""
     }
 },
 methods:{
     searchEvent:function(e){
         if(this.searchValue === ""){
              this.$message({
                  message:'请输入内容',
                  duration:500
              });
         }
         else{
             console.log(this);
             this.$router.push(`/search?searchValue=${this.searchValue}`)
         }
     }
 }
 
}
</script>

<style>

    
</style>