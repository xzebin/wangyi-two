<template>
    <div class="lyric_container">
        <div class="noLyric" v-if="isShow">
            抱歉,该歌曲暂无歌词
        </div>
        <ul ref='ul' v-else>
            <li v-for="(item,index) in lyricDatas" :key="index">{{item.info}}</li>
        </ul>
    </div>
</template>  
  
<script>
export default {
    data(){
        return {
            lyricDatas:[],
            currentLyricDatas:"",
            isShow:false
        }
    },
    mounted(){
        let ul =this.$refs.ul;
        let lis = ul.children;
        let result = JSON.parse(localStorage.getItem("lyric"));
        //判断是否有歌词信息
        if(result.length == 0){
            this.isShow = true;
            return ;
        }
        let newArr = [];
        result.map((e,index) => {
            if(index == 0){
                newArr.push({"info":e,"checkStatus":true});
            }else{
                newArr.push({"info":e,"checkStatus":false});
            }
        });
        this.lyricDatas = newArr;
        let _this = this;
        let index = 0;
        let top = 200;
        this.$eventBus.$on("getInfo",function(data){
            if(_this.currentLyricDatas != data){
               try {
                    if(index != 0){
                        lis[index-1].classList.remove("changeStyle")
                    }
                    _this.currentLyricDatas = data;
                    ul.style.marginTop = top + "px";
                    top-=41;
                    lis[index].classList.add("changeStyle");
                    index++;
               } catch (error) {
                   
               }
            }
        });
    }
};
</script>  
  
<style type="text/css">
    .lyric_container{
        height: 300px;
    }
</style> 