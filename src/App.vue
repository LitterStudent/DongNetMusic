<template>
  <div id="app">
   <top></top>
   <index></index>
  </div>
</template>

<script>
import top  from "./components/01top.vue"
import index from "./components/02index.vue"
export default {
  components:{
    top,
    index
  }
}
</script>
<style>
*{
    margin: 0;
    padding: 0;
}
</style>

