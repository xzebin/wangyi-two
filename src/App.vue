<template>
  <div id="app">
    <el-container>
      <el-aside width="300px">
        <h3 style="margin-top: 20px;">带上耳机，感受音乐的力量</h3>
        <h5 class="playlist">播放列表</h5>
        <div class="item_box">
          <div style="line-height:700px;font-size:20px" v-if="songList.length == 0">
              啥也没有，赶紧 <span @click="chooseSong" style="border-bottom: 1px solid red;color: red;cursor: pointer;">选歌</span> 吧
          </div>
          <div v-else class="item" v-for="(item,index) in songList" :key="index">
              <img :src="item.imgUrl">
              <div class="songInformation">
                <div class="title" @click="parentEven(item)">歌曲：{{item.name}}</div>
                <div class="singer" @click="searchSonger(item)">歌手：{{item.songer}}</div>
                <div class="delete" @click="deleteSong(item)">
                  <i class="iconfont icon-template_delete"></i>
                </div>
              </div>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <el-input placeholder="请输入歌名进行搜索" v-model="input" clearable></el-input>
          <el-button icon="el-icon-search" type="primary" size="small" @click="searchBtn" round>搜索</el-button>
        </el-header>
        <el-main>
            <router-view @click_even="parentEven" @playAll="playAll" @next_song="nextSong" id="searchResult" v-bind:searchDatas="searchDatas"></router-view>
            <div v-if="isShow" class="info">{{ info }}</div>
            <div class="box">
              <audio controls id="ad">
                <source :src="currentSongUrl" type="audio/ogg" />
              </audio>
              <div class="menu" v-if="isShow == false">
                  <div class="lyricsInformation" @click="clickMeLookLyrics">
                    点我看歌词
                  </div>
                  <div class="toIndex" @click="toIndex">
                    首页
                  </div>
              </div>
              <div class="menu" v-else>
                  <div class="lyricsInformation" @click="closeLyrics">
                    关闭歌词
                  </div>
                  <div class="toIndex" @click="toIndex">
                    首页
                  </div>
              </div>
            </div>
        </el-main>
        <el-footer>www.xzebin.com</el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLyricsById, searchSongByName } from "./route.js";
import "./static/icon-style.css";
var map = new Map();
var tempTime = 0;
var id = 0;
var songIndex = 0;
export default {
  name: "App",
  data() {
    return {
      info: "", //保存歌词数据
      time: 0, //歌词对应的时间点
      songList:[],  //保存歌曲列表
      isShow:false, //是否展示歌词数据
      input: "",
      searchDatas: [],
      songsDatas:[],
      currentSongUrl:" ",
      currentSongId: 0,
    };
  },
  mounted() {
    this.test();
  },
  methods: {
    //选歌
    chooseSong(){
      let path = this.$route.path;
      if(path != "/"){
        this.$router.push("/");
      }
    },
    //点击搜索歌手
    searchSonger(data){
      let songer = data.songer;
      this.input = songer;
      this.searchBtn();
    },
    //首页榜单播放所有
    playAll(data){
      let tempArr = [];
      data.map(e => {
        tempArr.push({
          imgUrl:e.picurl,
          name:e.name,
          songId:e.songId,
          songer:e.artistsname,
          url:e.url
        });
      });
      this.songList = tempArr;
      this.currentSongUrl = this.songList[0].url;
      this.currentSongId = this.songList[0].songId;
      let a = document.querySelector("#app audio");
      a.src = this.songList[0].url;
      this.info = "";
      map.clear();
      tempTime = 0;
      clearInterval(id);
      a.autoplay = true;
    },
    //去首页
    toIndex(){
      this.$router.push("/");
    },
    //关闭歌词
    closeLyrics(){
      this.isShow = false;
    },
    //从歌曲列表中删除某个歌曲
    deleteSong(item){
      console.log("item",item);
      let tempArr = this.songList;
      let song = tempArr.find(e => e.songId == item.songId);
      if(song.url == this.currentSongUrl){
        let a = document.querySelector("#app audio");
        a.src = "";
        this.info = "";
        this.isShow = false;
        this.$router.push("/");
      }
      this.songList = this.songList.filter(e => e.songId != item.songId);
      this.$message({
          message: "移除成功",
          center: true,
      });
    },
    //判断歌曲是否在歌曲列表中存在
    songIsExists(name,songer){
        let tempArr = this.songList;
        let song = tempArr.find(e => {
          return e.name == name && e.songer == songer;
        });
        if(song){
          return true;
        }else{
          return false;
        }
    },
    //下一首
    nextSong(data){
      console.log(data);
      let { url } = data;
      if (url == "") {
        this.$message({
          message: "暂无该歌曲的播放资源",
          center: true,
        });
      } else {
        let tempArr = this.songList;
        let bool = this.songIsExists(data.row.name,data.row.artists[0].name);
        console.log(bool);
        if(bool == false){
          this.$message({
            message: "成功加入播放列表",
            center: true,
          });
          tempArr.push({name:data.row.name,url:data.url,imgUrl:data.row.album.artist.img1v1Url,songId:data.songId,songer:data.row.artists[0].name});
          this.songList = tempArr;
        }else{
          this.$message({
            message: "该歌曲已经在播放列表中存在了",
            center: true,
          });
        }
      }
    },
    //点我看歌词
    clickMeLookLyrics(){
      this.isShow = true;
    },
    async searchBtn() {
      this.isShow = false;
      let songName = this.input;
      let res = await searchSongByName(songName);
      if (res) {
        this.searchDatas = res.songs;
      } else {
        this.searchDatas = [];
      }
      this.$router.push(`/search`);
    },
    test() {
      let _this = this;
      //获取当前的音频节点
      let a = document.querySelector("#app audio");
      let _self = this;
      //监听音频播放事件
      a.addEventListener("playing", async function () {
        _this.isShow = true;
        let lastLyricsTime = 0;
        // 根据歌曲请求对应的歌词
        let result = await getLyricsById(_self.currentSongId);
        let res = /\[(\d{2}\:\d{2}\.\d+)\]/g;
        var arr = [];
        var r;
        let arrStr = result.data.lrc.lyric;
        if(!result.data.lrc.lyric){
          this.info = "该歌曲暂无歌词"
          return;
        }
        let tempStartIndex = 0;
        let tempEndIndex = 0;
        let lyricArr = [];
        for (let i = 1; i < arrStr.length; i++) {
          if (arrStr[i] == "]") {
            tempStartIndex = i + 1;
          } else if (arrStr[i] == "[") {
            tempEndIndex = i;
            lyricArr.push(arrStr.substring(tempStartIndex, tempEndIndex));
          }
        }
        while ((r = res.exec(result.data.lrc.lyric))) {
          arr.push(r[1]);
        }
        let newArr = [];
        arr.map((r) => {
          let temp = r.split(":");
          let a = parseInt(temp[0]);
          let b = parseInt(temp[1]);
          r = a == 0 ? b : a * 60 + b;
          let temp2 = r;
          newArr.push(temp2);
        });
        lastLyricsTime = newArr[newArr.length - 1];
        newArr.forEach((e, index) => {
          map.set(e, lyricArr[index]);
        });
        localStorage.setItem("lyric",JSON.stringify(lyricArr));
        _this.$router.push(`/lyric`);
        id = setInterval(() => {
          if (tempTime > lastLyricsTime) {
            console.log("歌词已经唱完了...");
            this.info = "感谢收听!!!";
            clearInterval(id);
            return ;
          }
          if (map.get(tempTime)) {
            _this.info = map.get(tempTime);
          }
          _this.$eventBus.$emit("getInfo",_this.info);
          tempTime += 0.1;
        }, 99);
     });
      //监听音频暂停事件
      a.addEventListener("pause", function () {
        //暂停开始执行的函数
        clearInterval(id);
      });
      a.addEventListener('ended', function () {  
        console.log("结束啦");
        console.log("currentSongUrl",_this.currentSongUrl);
        console.log("currentSongId",_this.currentSongId);
        let index = _this.songList.findIndex(e => {
          console.log("eeeee",e);
          console.log("currentSongUrl",_this.currentSongUrl);
          return e.url == _this.currentSongUrl;
        });
        console.log("index",index);
        console.log("_this.songList.length-1",_this.songList.length-1);
        if(_this.songList.length-1 == 0){
            console.log("只有一个");
            _this.currentSongUrl = _this.songList[0].url;
            _this.currentSongId = _this.songList[0].songId;
            let a = document.querySelector("#app audio");
            a.src = _this.songList[0].url;
            _this.info = "";
            map.clear();
            tempTime = 0;
            clearInterval(id);
            a.autoplay = true;
        }else if (_this.songList.length-1 == index){
            console.log("最后一个");
            _this.currentSongUrl = _this.songList[0].url;
            _this.currentSongId = _this.songList[0].songId;
            let a = document.querySelector("#app audio");
            a.src = _this.songList[0].url;
            _this.info = "";
            map.clear();
            tempTime = 0;
            clearInterval(id);
            a.autoplay = true;
        }else{
            console.log("其他");
            _this.currentSongUrl = _this.songList[index+1].url;
            console.log("123123123123",this.currentSongUrl);
            _this.currentSongId = _this.songList[index+1].songId;
            let a = document.querySelector("#app audio");
            a.src = _this.songList[index+1].url;
            _this.info = "";
            map.clear();
            tempTime = 0;
            clearInterval(id);
            a.autoplay = true;
        }
      });
      //监听播放时间事件，进行快进后退
      a.addEventListener("timeupdate", function () {
        let temp = Math.floor(a.currentTime);
        this.info = map.get(temp);
        tempTime = temp;
      });
      document.addEventListener("touchstart", function () {
        a.play();
      });
    },
    parentEven(data) {
      console.log("data",data);
      let { url, songId } = data;
      if (url == "") {
        this.$message({
          message: "暂无该歌曲的播放资源",
          center: true,
        });
      } else {
        let bool;
        try {
          bool = this.songIsExists(data.row.name,data.row.artists[0].name);
          if(bool == false){
            let tempArr = this.songList;
            tempArr.push({name:data.row.name,url:data.url,imgUrl:data.row.album.artist.img1v1Url,songId:data.songId,songer:data.row.artists[0].name});
            this.songList = tempArr;
          }
        } catch (error) {
          bool = this.songIsExists(data.name,data.songer);
          if(bool == false){
            let tempArr = this.songList;
            tempArr.push({name:data.name,url:data.url,imgUrl:data.imgUrl,songId:data.songId,songer:data.songer});
            this.songList = tempArr;
          }
        }
        this.currentSongUrl = data.url;
        this.currentSongId = data.songId;
        let a = document.querySelector("#app audio");
        a.src = data.url;
        this.info = "";
        map.clear();
        tempTime = 0;
        clearInterval(id);
        a.autoplay = true;
      }
    },
  },
};
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
.playlist{
  margin-top: 14px;
  font-size: 16px;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-container{
  width: 100vw;
  padding: 0;
  margin: 0;
  height: 100%;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}
.el-aside .item_box {
  width: 100%;
  height: 800px;
  margin-top: 20px;
  overflow: auto;
}
.el-aside .item_box .item img{
  height: 100%;
}
.el-aside .item_box .item{
  display: flex;
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}
.el-aside .item_box .item .songInformation{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.el-aside .item_box .item .songInformation .title{
  cursor: pointer;
}
.el-aside .item_box .item .songInformation .title,.singer{
  width: 100%;
  height: 20px;
  display: -webkit-box;
  cursor: pointer;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.el-aside .item_box .item .songInformation .delete{
  color: red;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  cursor: pointer;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.el-main #searchResult {
  margin-bottom: 10px;
  flex: 1;
}
.el-main .lyric_container{
  height: 200px;
  width: 100%;
  overflow: hidden;
  font-size: 24px;
}
.el-main .lyric_container .noLyric{
  margin-top: 50%;
}
.el-main .lyric_container ul{
  margin-top: 250px;
  height: 100%;
}
.el-main .lyric_container ul .changeStyle{
  color: red;
  background-color: #ccc;
}
.el-main .lyric_container ul li{
  list-style-type: none;
  margin: 10px 0px;
}
.el-main .box {
  width: 100%;
  display: flex;
  align-items: center;
}
.el-main .box #ad {
  width: 80%;
}
.el-main .box .menu{
  display: flex;
}
.el-main .box .menu .lyricsInformation{
  margin-left: 30px;
  font-size: 14px;
  color: red;
  border-bottom: 1px solid red;
  cursor: pointer;
}
.el-main .box .menu .toIndex{
  margin-left: 30px;
  font-size: 14px;
  color: red;
  border-bottom: 1px solid red;
  cursor: pointer;
}
.el-header {
  display: flex;
  justify-content: space-around;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-container .el-header{
  padding: 0;
}
.el-container .el-header .el-button{
  width: 100px;
  height: 50px;
  margin-top: 5px;
  font-size: 16px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
#app {
  width: 100vw;
  margin: 0 auto;
  background-color: rgba(26, 17, 17, 0.726);
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
}
audio {
  margin: 10px;
}
.info {
  width: 100%;
  text-align: center;
  font-size: 25px;
  height: 60px;
  line-height: 60px;
  padding: 10px;
  background-color: pink;
}
</style>
