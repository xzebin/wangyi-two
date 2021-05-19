<template>
  <div id="search_container">
    <div class="hasData">
      <el-table
        :data="searchDatas"
        height="100%"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          row-key="name"
          label="单曲"
        ></el-table-column>
        <el-table-column
          prop="artists[0].name"
          label="歌手"
        ></el-table-column>
        <el-table-column prop="album.name" label="主播电台"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="playNow(scope.row)" type="text" size="small"
              >播放</el-button
            >
            <el-button @click.stop="playNext(scope.row)" type="text" size="small">下一首</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getSongBySongId } from "../route.js";
export default {
  props: ["searchDatas"],
  methods: {
    liveBroadcast(obj) {
      this.$emit("click_even", obj);
    },
    nextSong(obj){
      this.$emit("next_song", obj);
    },
    async playNow(row){
      console.log(row);
      let songId = row.id;
      let res = await getSongBySongId(songId);
      let url = res.url;
      this.liveBroadcast({ url, songId,row });
    },
    async playNext(row){
      let songId = row.id;
      let res = await getSongBySongId(songId);
      let url = res.url;
      this.nextSong({ url, songId,row });
    },
  },
};
</script>

<style scoped>
.hasData{
  height: 100%;
}
img {
  width: 30px;
}
</style>