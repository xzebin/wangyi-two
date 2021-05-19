<template>
  <div>
    <div class="swiper-container" ref="slider">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  mounted() {
    var swiper = new Swiper(".swiper-container", {
      slidesPerView: 5,
      freeMode: true,
      loop: false,
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../../node_modules/swiper/dist/css/swiper.css";
.swiper-container {
  height: 80px;
  padding-left: 56px;
  background-image: -webkit-radial-gradient(23% 100%, #2e79c3 0%, #297bc4 100%);
}
.swiper-slide {
  display: inline-block;
  margin-right: 40px;
  height: 80px;
  line-height: 80px;
  font-size: 32px;
  padding: 0 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.swiper-container .swiper-slide .active {
  color: #666;
  background-color: #fff8eb;
  box-shadow: 0 3px 13px 0 rgba(94, 94, 94, 0.5);
}
</style>