import axios from "axios";

//根据对应榜单获取对应的数据信息
export function getDatasByListId(value) {
    return new Promise((res,rej)=>{
        axios
        .get(`https://api.uomg.com/api/rand.music?sort=${value}&format=json`)
        .then(function (response) {
            res(response);
        })
        .catch(function (error) {
            rej(error);
        });
    });
}