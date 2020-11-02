<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in listInformation"
        :key="index"
        :label="item.name"
        :name="item.index"
      >
        <div class="box">
          <div class="listInfo">
            <img :src="item.cover" />
            <div class="name-play">
              <div class="name">
                {{ item.name }}
              </div>
              <div class="play">
                <el-button
                  icon="el-icon-plus"
                  @click="playAll"
                  type="danger"
                  size="mini"
                  >播放</el-button
                >
                <span class="refreshSpan" v-if="isRefresh" @click="refresh"><i class="el-icon-refresh" style="margin-left:20px"></i></span>
                <span class="noRefreshSpan" v-else>{{time}}秒后再刷新</span>
              </div>
            </div>
          </div>
          <div class="songs-box">
            <div class="songs">
              <div class="songs-item">
                <el-table v-loading="loading" :data="tableData" style="width: 100vw" height="448px">
                  <el-table-column prop="index" label="" width="180">
                  </el-table-column>
                  <el-table-column label="标题" width="540">
                    <template slot-scope="scope">
                      <div class="song-title" @click="playNow(scope.row)">
                        <img :src="scope.row.picurl" alt="" />
                        <span>
                          <i class="el-icon-video-play"></i>
                          {{ scope.row.name }}
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="time" label="时长" width="380">
                  </el-table-column>
                  <el-table-column prop="artistsname" width="480" label="歌手">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getDatasByListId } from "../api/indexApi";
export default {
  data() {
    return {
      isRefresh:true,     //是否刷新
      time:30,   //重新刷新时间
      tableData: [],
      activeName: "1",
      loading:true,
      listInformation: [
        {
          name: "热歌榜",
          index: "1",
          cover: "http://xzebin.com/1.jpg",
          list: [],
        },
        {
          name: "新歌榜",
          index: "2",
          cover: "http://xzebin.com/2.jpg",
          list: [],
        },
        {
          name: "飙升榜",
          index: "3",
          cover: "http://xzebin.com/3.jpg",
          list: [],
        },
        {
          name: "抖音榜",
          index: "4",
          cover: "http://xzebin.com/4.jpg",
          list: [],
        },
        {
          name: "电音榜",
          index: "5",
          cover: "http://xzebin.com/5.jpg",
          list: [],
        },
      ],
    };
  },
  async created() {
    this.getSongDataByIndex(0);
  },
  methods: {
    //播放
    playNow(data){
      console.log("data",data);
      this.$emit("click_even",{url:data.url,songer:data.artistsname,songId:data.songId,imgUrl:data.picurl,name:data.name});
    },
    //刷新
    refresh(){
      this.isRefresh = false;
      let _this = this;
      let index = Number(_this.activeName);
      this.getSongDataByIndex(index,true);
      this.$message({
          message: "刷新成功",
          center: true,
      });
      let temp = setInterval(function(){
        _this.time -= 1;
        if(_this.time == 0){
          _this.isRefresh = true;
          clearInterval(temp);
        }
      },1000);
    },
    //根据榜单获取对应的歌曲数据信息
    async getSongDataByIndex(index,bool = false){
        if(this.listInformation[index].list.length > 0 && bool == false){
          this.tableData = this.listInformation[index].list;
          return;
        }
        this.loading = true;
        let value = this.listInformation[index].name;
        let tempArr = [];
        for (let index = 0; index < 10; index++) {
          tempArr.push(getDatasByListId(value));
        }
        let res = await Promise.all(tempArr);
        let tempArr2 = [];
        res.map((e,i) => {
          let url = e.data.data.url;
          let reg = /\?id=([0-9]+)/;
          let res2 = reg.exec(url);
          let songId = res2[1];
          tempArr2.push({
            index:i+1,
            name: e.data.data.name,
            artistsname: e.data.data.artistsname,
            songId: songId,
            url: url,
            picurl: e.data.data.picurl,
          });
        });
        this.listInformation[index].list = tempArr2;
        this.tableData = tempArr2;
        this.loading = false;
    },
    //播放所有
    playAll(){
      this.$emit("playAll",this.tableData);
    },
    handleClick(tab, event) {
      let index = Number(tab.index);
      this.getSongDataByIndex(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 670px;
  overflow: auto;
}
.container .box {
  margin: 10px;
  display: flex;
  width: 100%;
  flex-direction: column;
}
.container .box .listInfo {
  width: 100%;
  display: flex;
  /* align-items: center; */
}
.container .box .listInfo .name-play {
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  .play{
    .refreshSpan:hover{
      cursor: pointer;
      color: red;
    }
    .noRefreshSpan{
      background-color: #ccc;
      margin-left:20px;
    }
  }
}
.container .box .listInfo .name {
  font-size: 16px;
  font-weight: 700;
}
.container .box .songs-box {
  width: 100%;
  display: flex;
  margin-top: 30px;
  .song-title {
    display: flex;
    align-items: center;
    img {
      width: 54px;
      height: 54px;
      margin-right: 10px;
    }
  }
}
.container .box .songs-box .songs .songs-item .song-title span:hover {
  border-bottom: 1px solid black;
  cursor: pointer;
}
.container .box .songs-box .songs .songs-item .song-title span:hover {
  border-bottom: 1px solid black;
  cursor: pointer;
}
</style>