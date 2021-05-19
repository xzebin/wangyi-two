import axios from "axios";
//根据歌曲id获取对应的歌词
export function getLyricsById(songId) {
    return new Promise((res,rej)=>{
        axios
        .get(`https://api.imjad.cn/cloudmusic/?type=lyric&id=${songId}&br=128000`)
        .then(function (response) {
            res(response);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

//根据歌手或者歌曲名称搜索mv
export function getMvByName(value) {
    return new Promise((res,rej)=>{
        axios
        .get(`https://autumnfish.cn/search?keywords=${value}&type=1004`)
        .then(function (response) {
            res(response);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

//根据对应的歌曲名字获取对应的歌曲
export function searchSongByName(songName) {
    return new Promise((res,rej)=>{
        axios
        // .get(`/music/search?keywords=${songName}`)
        .get(`https://autumnfish.cn/search?keywords=${songName}`)
        .then(function (response) {
            res(response.data.result);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

//根据对应的歌曲id获取对应的播放资源
export function getSongBySongId(songId) {
    return new Promise((res,rej)=>{
        axios
        .get(`https://api.imjad.cn/cloudmusic/?id=${songId}&search_type=100`)
        .then(function (response) {
            res(response.data.data[0]);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

//获取必应随机壁纸接口
export function getbingImgs() {
    return new Promise((res,rej)=>{
        axios
        .get(`http://music_server.zhengkj.com:5053/api/getBingImg`)
        .then(function (response) {
            res(response.data);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

//根据mv的id获取mv信息
export function getMVInfoById(mvId) {
    return new Promise((res,rej)=>{
        axios
        .get(`https://api88.net/api/mv/?key=857cdf8fa8d3fccb&mv=163&id=${mvId}&type=info&word=%27%27`)
        .then(function (response) {
            res(response);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

// 获取抖音热搜榜单
export function getHotSearch() {
    return new Promise((res,rej)=>{
        axios
        .get(`http://music_server.zhengkj.com:5053/api/hotSearch`)
        .then(function (response) {
            res(response.data.billboard_data);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

// 获取抖音热点上升榜单
export function getHotspotRise() {
    return new Promise((res,rej)=>{
        axios
        .get(`http://music_server.zhengkj.com:5053/api/hotspotRise`)
        .then(function (response) {
            res(response.data.billboard_data);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

// 获取抖音热点上升榜单
export function getPopular() {
    return new Promise((res,rej)=>{
        axios
        .get(`http://music_server.zhengkj.com:5053/api/popular`)
        .then(function (response) {
            res(response.data.billboard_data);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}

export function getDouyinDetail(id) {
    return new Promise((res,rej)=>{
        axios
        .delete(`http://music_server.zhengkj.com:5053/api/videoDetail?id=${id}`)
        .then(function (response) {
            res(response);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}