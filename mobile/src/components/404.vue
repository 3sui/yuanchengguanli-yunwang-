<template>
  <div class="notfind">
    <div class="title">404</div>
    <div class="content">
      <div class="vactor">
        <div class="icon_container">
        <van-image width="100%" height="100%" fit="contain" :src="require('../assets/img/404.png')" />
        </div>
        <p class="text">您访问的页面出错了</p>
      </div>
    </div>
       <div class="sub">
          <van-button round block type="info" @click="back">返回</van-button>
        </div>
  </div>
</template>

<script>
// import imgUrl from "../assets/img/404.png";
import { Button, Icon,Image as VanImage } from "vant";
export default {
     name: "notfind",
  components: {
   
    [Button.name]: Button,
    [Icon.name]: Icon,
    [VanImage.name]: VanImage
  },
  data() {
    return {

     
    };
  },
  methods: {
      back(){
          this.$router.go(-1);
      }
  }
};
</script>

<style  scoped>
.notfind {
  height: 95vh;
}

.title {
  font-size: 3rem;
  text-align: center;
  line-height: 15vh;
}


.vactor {
  padding: 30% 0;

  height: 10rem;

  /* border-radius: 50%;
  background-color: white; */
}


.icon_container {
  /* border-radius: 50%; */
  /* background-color: white; */
  width: 10rem;
  height: 10rem;
  margin: auto;
}

.text{
text-align: center;
}
.sub {
  width: 80%;
  margin: 1rem auto;
}
</style>