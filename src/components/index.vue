<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in listInformation"
        :key="index"
        :label="item.name"
        :name="item.index"
      >
        <div class="box" v-if="!item.isMv && index < 5">
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
                <span class="refreshSpan" v-if="isRefresh" @click="refresh"
                  ><i class="el-icon-refresh" style="margin-left: 20px"></i
                ></span>
                <span class="noRefreshSpan" v-else>{{ time }}秒后再刷新</span>
              </div>
            </div>
          </div>
          <div class="songs-box">
            <div class="songs">
              <div class="songs-item">
                <el-table
                  v-loading="loading"
                  :data="tableData"
                  style="width: 100vw"
                  height="448px"
                >
                  <el-table-column label="标题">
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
                  <el-table-column prop="time" label="时长"> </el-table-column>
                  <el-table-column prop="artistsname" label="歌手">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="item.isMv && index === 5">
          <h3>
            热歌榜mv推荐<span
              class="refreshSpan"
              v-if="isRefresh"
              @click="refresh"
              ><i class="el-icon-refresh" style="margin-left: 20px"></i
            ></span>
            <span
              style="font-size: 13px; color: red; margin-left: 10px"
              class="noRefreshSpan"
              v-else
              >{{ time }}秒后再刷新</span
            >
          </h3>
          <div style="height: 50vh; line-height: 50vh" v-if="hasData">
            敲会代码，精彩mv正在加载....
          </div>
          <div class="mv-box" v-else>
            <div
              style="
                position: absolute;
                top: 35px;
                left: 50%;
                transform: translateX(-50%);
              "
            >
              <el-autocomplete
                style="width: 320px; margin-right: 30px"
                placeholder="请输入mv名称进行搜索"
                v-model="input"
                @keyup.enter.native="searchMv()"
                :fetch-suggestions="querySearchAsync"
                :trigger-on-focus="false"
                @select="handleSelect"
                clearable
              ></el-autocomplete>
            </div>
            <div class="mv-item" v-for="(v, flag) in mvDatas" :key="flag">
              <img :src="v.cover" alt="" @click="viewMv(v)" />
              <div class="info-box">
                <div class="mv-name">
                  mv名：<span>{{ v.name }}</span>
                </div>
                <div class="mv-artist">
                  作者：<span>{{ v.artistName }}</span>
                </div>
                <div class="mv-artist">
                  描述：<span>{{
                    v.briefDesc || "该作者很懒，什么也没有留下"
                  }}</span>
                </div>
                <div class="mv-play-count">
                  播放量：<span>{{ v.playCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!item.isMv && index === 6">
          <h3>
            娱乐榜<span class="refreshSpan" v-if="isRefresh" @click="refresh"
              ><i class="el-icon-refresh" style="margin-left: 20px"></i
            ></span>
            <span
              class="noRefreshSpan"
              style="margin-left: 20px; font-size: 14px; color: red"
              v-else
              >{{ time }}秒后再刷新</span
            >
          </h3>
          <el-tabs v-model="amusementName" @tab-click="handleClickAmusement">
            <el-tab-pane label="热搜榜单" name="1">
              <div
                class="noData"
                style="margin-top: 20vh"
                v-if="douyinData_hot.length === 0"
              >
                正在快马加鞭请求数据......
              </div>
              <div class="hot-box" v-else>
                <div
                  class="hot-item"
                  v-for="(item, index) in douyinData_hot"
                  :key="index"
                  @click="lookDouyin(item, index)"
                >
                  <img :src="item.img_url" alt="" />
                  <div class="title-box">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="热点上升榜" name="2">
              <div
                class="noData"
                style="margin-top: 20vh"
                v-if="douyinData_up.length === 0"
              >
                正在快马加鞭请求数据......
              </div>
              <div class="hot-box" v-else>
                <div
                  class="hot-item"
                  v-for="(item, index) in douyinData_up"
                  :key="index"
                  @click="lookDouyin(item, index)"
                >
                  <img :src="item.img_url" alt="" />
                  <div class="title-box">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="今日热门视频" name="3">
              <div
                class="noData"
                style="margin-top: 20vh"
                v-if="douyinData_day.length === 0"
              >
                正在快马加鞭请求数据......
              </div>
              <div class="hot-box" v-else>
                <div
                  class="hot-item"
                  v-for="(item, index) in douyinData_day"
                  :key="index"
                  @click="lookDouyin(item, index)"
                >
                  <img :src="item.img_url" alt="" />
                  <div class="title-box">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="'今日抖音时间：' + foramt"
      :visible.sync="dialogTableVisible"
      :before-close="handleClose"
    >
      <div style="display: flex; align-items: center">
        <i
          class="el-icon-caret-left"
          style="font-size: 26px"
          @click="preDouyin"
        ></i>
        <video
          id="douyin-video"
          style="width: 86%"
          autoplay="autoplay"
          :src="currentDouyinUrl"
          controls="controls"
          controlsList="nodownload"
        >
          <source src="video/FF4.ogv" type="video/ogg" />
          <source src="video/FF4.webm" type="video/webm" />
          <source src="video/FF4.mp4" type="video/mp4" />
        </video>
        <i
          class="el-icon-caret-right"
          style="font-size: 26px"
          @click="nextDouyin"
        ></i>
      </div>
    </el-dialog>
    <el-pagination
      v-if="activeName === '6'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getDatasByListId } from "../api/indexApi";
import {
  getMVInfoById,
  getLyricsById,
  getMvByName,
  getHotSearch,
  getDouyinDetail,
  getHotspotRise,
  getPopular
} from "../route.js";
import MySwiper from "./MySwiper";
export default {
  components: {
    MySwiper,
  },
  data() {
    return {
      amusementName: "1",
      douyinViewTime: sessionStorage.getItem("douyinViewTime") || 0,
      closeTimeId: null,
      currentViewVideoIndex: null,
      dialogTableVisible: false,
      input: "",
      hasData: true,
      currentPage: 1,
      pageSize: 10,
      count: 0,
      isRefresh: true, //是否刷新
      time: 30, //重新刷新时间
      tableData: [],
      activeName: "1",
      loading: true,
      listInformation: [
        {
          name: "热歌榜",
          index: "1",
          cover: "http://xzebin.com/1.jpg",
          list: [],
          isMv: false,
        },
        {
          name: "新歌榜",
          index: "2",
          cover: "http://xzebin.com/2.jpg",
          list: [],
          isMv: false,
        },
        {
          name: "飙升榜",
          index: "3",
          cover: "http://xzebin.com/3.jpg",
          list: [],
          isMv: false,
        },
        {
          name: "抖音榜",
          index: "4",
          cover: "http://xzebin.com/4.jpg",
          list: [],
          isMv: false,
        },
        {
          name: "电音榜",
          index: "5",
          cover: "http://xzebin.com/5.jpg",
          list: [],
          isMv: false,
        },
        {
          name: "mv榜",
          index: "6",
          cover: "",
          list: [],
          isMv: true,
        },
        {
          name: "娱乐榜",
          index: "7",
          cover: "",
          list: [],
          isMv: false,
        },
      ],
      recommendMvDada: [],
      mvDatas: [],
      hasMv: false,
      douyinData_hot: [],
      douyinData_up: [],
      douyinData_day: [],
      currentDouyinUrl: "",
    };
  },
  async created() {
    this.getSongDataByIndex(0);
  },
  metaInfo: {
    meta: [{ name: "referrer", content: "never" }],
  },
  computed: {
    foramt() {
      return this.formatSeconds(this.douyinViewTime);
    },
  },
  methods: {
    formatSeconds(value) {
      var secondTime = parseInt(value); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      var dayTime = 0; // 天
      var result = "";
      if (value < 60) {
        result = secondTime + "秒";
      } else {
        if (secondTime >= 60) {
          // 如果秒数大于60，将秒数转换成整数
          // 获取分钟，除以60取整数，得到整数分钟
          minuteTime = parseInt(secondTime / 60);
          // 获取秒数，秒数取佘，得到整数秒数
          secondTime = parseInt(secondTime % 60);
          // 如果分钟大于60，将分钟转换成小时
          if (minuteTime >= 60) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
            if (hourTime >= 24) {
              // 获取天数， 获取小时除以24，得到整数天
              dayTime = parseInt(hourTime / 24);
              // 获取小时后取余小时，获取分钟除以24取余的分；
              hourTime = parseInt(hourTime % 24);
            }
          }
        }
        if (secondTime > 0) {
          secondTime =
            parseInt(secondTime) >= 10 ? secondTime : "0" + secondTime;
          result = "" + secondTime + "秒";
        }
        if (minuteTime > 0) {
          minuteTime =
            parseInt(minuteTime) >= 10 ? minuteTime : "0" + minuteTime;
          result = "" + minuteTime + "分" + result;
        }
        if (hourTime > 0) {
          result = "" + parseInt(hourTime) + "小时" + result;
        }
        if (dayTime > 0) {
          result = "" + parseInt(dayTime) + "天" + result;
        }
      }
      return result;
    },
    handleClose(done) {
      this.$confirm("不看了吗？")
        .then((_) => {
          var elevideo = document.getElementById("douyin-video");
          elevideo.pause();
          clearInterval(this.closeTimeId);
          this.closeTimeId = null;
          done();
        })
        .catch((_) => {});
    },
    //抖音视频去水印
    goToWatermark(url) {
      let newUrl = url.replace("playwm", "play");
      let newUrl2 = newUrl.replace("line=0", "line=1");
      return newUrl2;
    },
    //获取抖音视频详情
    getDouyinDetail(item, index) {
      console.log("index",index);
      let req = /(\d+)\//g;
      let result = req.exec(item);
      getDouyinDetail(result[1]).then((data) => {
        let videoUrl = data.data.item_list[0].video.play_addr.url_list[0];
        let url = this.goToWatermark(videoUrl);
        this.currentDouyinUrl = url;
        this.dialogTableVisible = true;
        this.currentViewVideoIndex = index;
        if (this.closeTimeId === null) {
          this.closeTimeId = setInterval(() => {
            let old = sessionStorage.getItem("douyinViewTime") || 0;
            this.douyinViewTime = sessionStorage.getItem("douyinViewTime");
            sessionStorage.setItem("douyinViewTime", Number(old) + 1);
          }, 1000);
        }
      });
    },
    //上一个
    preDouyin() {
      if (!this.currentViewVideoIndex || this.currentViewVideoIndex === 0) {
        this.$message({
          message: "已经是第一个了，没有上一个了哦",
          type: "warning",
        });
      } else {
        this.getDouyinDetail(
          this.douyinData_hot[this.currentViewVideoIndex - 1].link,
          this.currentViewVideoIndex - 1
        );
      }
    },
    //下一个
    nextDouyin() {
      if (this.currentViewVideoIndex === this.douyinData_hot.length - 1) {
        this.$message({
          message: "已经是最后一个了，没有下一条了哦",
          type: "warning",
        });
      } else {
        this.getDouyinDetail(
          this.douyinData_hot[this.currentViewVideoIndex + 1].link,
          this.currentViewVideoIndex + 1
        );
      }
    },
    //观看抖音
    lookDouyin(item, index) {
      this.getDouyinDetail(item.link, index);
    },
    //获取抖音热搜榜视频
    getHotSearch() {
      getHotSearch().then((res) => {
        let tempArr = [];
        res.map((v) => {
          if (v.extra_list) {
            tempArr.push(v.extra_list[0]);
          }
        });
        this.douyinData_hot = tempArr;
        this.loading = false;
      });
    },
    //获取抖音热点上升榜视频
    getHotspotRise() {
      getHotspotRise().then((res) => {
        let tempArr = [];
        res.map((v) => {
          if (v.extra_list) {
            tempArr.push(v.extra_list[0]);
          }
        });
        this.douyinData_up = tempArr;
        this.loading = false;
      });
    },
    //获取抖音热门榜视频
    getPopular() {
      getPopular().then((res) => {
        let tempArr = [];
        res.map((v) => {
          tempArr.push({
            img_url: v.img_url,
            link: v.link,
            title: v.title,
          });
        });
        this.douyinData_day = tempArr;
        console.log("tempArr", tempArr);
        this.loading = false;
      });
    },
    //mv搜索
    async searchMv() {
      let res = await getMvByName(this.input);
      let tempArr = [];
      res.data.result.mvs.map((v) => {
        tempArr.push(v);
      });
      this.recommendMvDada = tempArr;
      let result = [];
      tempArr.map((v, index) => {
        if (index < 10) {
          result.push(v);
        }
      });
      this.mvDatas = result;
      this.count = this.recommendMvDada.length;
    },
    handleSelect(item) {
      this.viewMv(item);
    },
    async querySearchAsync(queryString, cb) {
      let res = await getMvByName(queryString);
      let tempArr = [];
      res.data.result.mvs.map((v) => {
        v.value = v.name;
        tempArr.push(v);
      });
      cb(tempArr);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataByPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataByPage();
    },
    getDataByPage() {
      let flag = (this.currentPage - 1) * this.pageSize;
      let temp = [];
      for (let index = flag; index < flag + this.pageSize; index++) {
        if (index > this.recommendMvDada.length - 1) {
          break;
        }
        temp.push(this.recommendMvDada[index]);
      }
      this.mvDatas = temp;
    },
    //获取热歌榜推荐mv
    async getHostSongMv() {
      if (!this.hasMv) {
        let tempArr = [];
        for (let index = 0; index < 20; index++) {
          tempArr.push(getDatasByListId("热歌榜"));
        }
        let result = await Promise.all(tempArr);
        let tempArr2 = [];
        result.map((v) => {
          tempArr2.push(v.data.data.name);
        });
        let tempArr3 = [];
        tempArr2.map((v) => {
          tempArr3.push(getMvByName(v));
        });
        let result2 = await Promise.all(tempArr3);
        let result3 = [];
        result2.map((v) => {
          if (v.data.result.mvs) {
            result3.push(v.data.result.mvs[0]);
          }
        });
        this.recommendMvDada = result3;
        let result4 = [];
        result3.map((v, index) => {
          if (index < 10) {
            result4.push(v);
          }
        });
        this.mvDatas = result4;
        this.count = this.recommendMvDada.length;
        this.hasMv = true;
        this.hasData = false;
      }
    },
    //观看mv
    viewMv(v) {
      let a = document.querySelector("#app audio");
      a.pause();
      getMVInfoById(v.id).then(({ data }) => {
        let res = data.data;
        let url = "";
        if (res.brs[1080]) {
          url = res.brs[1080];
        } else if (res.brs[720]) {
          url = res.brs[720];
        } else if (res.brs[480]) {
          url = res.brs[480];
        } else if (res.brs[240]) {
          url = res.brs[240];
        }
        this.$alert(
          `<video id="video" style="width:100%;" autoplay="autoplay" src="${url}" controls="controls">
            </video>`,
          v.name,
          {
            dangerouslyUseHTMLString: true,
            center: true,
          }
        )
          .then(() => {
            var elevideo = document.getElementById("video");
            elevideo.pause();
          })
          .catch(() => {
            var elevideo = document.getElementById("video");
            elevideo.pause();
          });
        document.getElementsByClassName(
          "el-message-box__btns"
        )[0].style.display = "none";
      });
    },
    //播放
    playNow(data) {
      console.log("data", data);
      this.$emit("click_even", {
        url: data.url,
        songer: data.artistsname,
        songId: data.songId,
        imgUrl: data.picurl,
        name: data.name,
      });
    },
    //刷新
    refresh() {
      this.isRefresh = false;
      let _this = this;
      let index = Number(_this.activeName);
      if (index === 6) {
        this.hasMv = false;
        this.hasData = true;
        this.getHostSongMv();
      } else if (index === 7) {
        if (Number(this.amusementName) === 1) {
          this.douyinData_hot = [];
          this.getHotSearch();
        } else if (Number(this.amusementName) === 2) {
          this.douyinData_up = [];
          this.getHotspotRise();
        } else if (Number(this.amusementName) === 3) {
          this.douyinData_day = [];
          this.getPopular();
        }
      } else {
        this.getSongDataByIndex(index, true);
      }
      this.$message({
        message: "刷新成功",
        center: true,
      });
      let temp = setInterval(function () {
        _this.time -= 1;
        if (_this.time == 0) {
          _this.time = 30;
          _this.isRefresh = true;
          clearInterval(temp);
        }
      }, 1000);
    },
    //根据榜单获取对应的歌曲数据信息
    async getSongDataByIndex(index, bool = false) {
      if (index === 5 && !this.hasMv) {
        this.getHostSongMv();
        return;
      }
      this.loading = true;
      if (index === 6) {
        this.getHotSearch();
        return;
      }
      if (this.listInformation[index].list.length > 0 && bool == false) {
        this.tableData = this.listInformation[index].list;
        return;
      }

      let value = this.listInformation[index].name;
      let tempArr = [];
      for (let index = 0; index < 10; index++) {
        tempArr.push(getDatasByListId(value));
      }
      let res = await Promise.all(tempArr);
      let tempArr2 = [];
      res.map(async (e, i) => {
        let url = e.data.data.url;
        let reg = /\?id=([0-9]+)/;
        let res2 = reg.exec(url);
        let songId = res2[1];
        let result = await getLyricsById(songId);
        tempArr2.push({
          index: i + 1,
          name: e.data.data.name,
          artistsname: e.data.data.artistsname,
          songId: songId,
          url: url,
          picurl: e.data.data.picurl,
          time: result.data.lrc.lyric.substring(
            result.data.lrc.lyric.lastIndexOf("[") + 1,
            result.data.lrc.lyric.lastIndexOf("]")
          ),
        });
      });
      this.listInformation[index].list = tempArr2;
      this.tableData = tempArr2;
      this.loading = false;
    },
    //播放所有
    playAll() {
      this.$emit("playAll", this.tableData);
    },
    handleClick(tab, event) {
      let index = Number(tab.index);
      this.getSongDataByIndex(index);
    },
    handleClickAmusement(tab, event) {
      if (this.douyinData_hot.length === 0 && Number(tab.index) === 0) {
        this.getHotSearch();
      } else if (this.douyinData_up.length === 0 && Number(tab.index) === 1) {
        this.getHotspotRise();
      } else if (this.douyinData_day.length === 0 && Number(tab.index) === 2) {
        this.getPopular();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog {
  width: 30% !important;
}
.hot-box {
  display: flex;
  flex-wrap: wrap;
  height: 64vh;
  overflow: auto;
  .hot-item {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 20%;
  }
}
.mv-box {
  display: flex;
  padding: 60px;
  flex-wrap: wrap;
  text-align: left;
  .mv-item {
    width: 25%;
    margin-bottom: 30px;
    margin-right: 20px;
  }
  img {
    width: 100%;
    cursor: pointer;
  }
}
.info-box {
  .mv-name,
  .mv-artist,
  .mv-play-count {
    width: 100%;
    font-size: 14px;
    margin-top: 10px;
  }
  .mv-name {
    span {
      color: black;
      font-weight: 500;
    }
  }
  .mv-artist {
    span {
      color: rgb(114, 101, 101);
    }
  }
  .mv-play-count {
    span {
      color: red;
    }
  }
}
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
  .play {
    .refreshSpan:hover {
      cursor: pointer;
      color: red;
    }
    .noRefreshSpan {
      background-color: #ccc;
      margin-left: 20px;
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