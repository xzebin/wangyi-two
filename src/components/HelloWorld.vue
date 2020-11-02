<template>
    <div>
        <div style="padding:10px 0;">
            <aplayer autoplay :music="musicList">
            </aplayer>
        </div>
    </div>
</template>  
  
<script>
import aplayer from "vue-aplayer";
 
export default {
  name: "Aplayer",
  props: ["pdfurl"],
  components: {
    //别忘了引入组件
    aplayer: aplayer
  },
  data() {
    return {
      musicList: {
        title: "youkao100",
        author: "youkao100",
        url: 'http://localhost:1122/static/ceshi.mp3',
        pic: "",
        lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
      }
    };
  },
  computed: {
    url() {
      return this.pdfurl;
    }
  },
  mounted() {
    this.musicList = {
      title: "youkao100",
      author: "youkao100",
      url: this.url,
      pic: "",
      lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
    };
  }
};
</script>  
  
<style lang="scss" scoped type="text/css">
</style> 