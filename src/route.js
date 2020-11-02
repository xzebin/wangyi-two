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

//根据对应的歌曲名字获取对应的歌曲
export function searchSongByName(songName) {
    return new Promise((res,rej)=>{
        axios
        .get(`http://musicapi.leanapp.cn/search?keywords=${songName}`)
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