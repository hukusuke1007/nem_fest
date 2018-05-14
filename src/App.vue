<template>
  <!-- <div id="app"> -->
    <v-app>

     <!-- 上のツールバー -->
     <v-toolbar
      dark
      color="blue-grey lighten-5"
      fixed
      app
     >
     <div v-if="tag==='history'">
       <v-toolbar-side-icon @click="back">
        <v-icon color="primary">arrow_back</v-icon>
       </v-toolbar-side-icon>
     </div>
     <v-toolbar-title class="black--text">{{ title }}</v-toolbar-title>
     </v-toolbar>
     <v-content>

      <!-- 真ん中のView -->
      <!-- <v-container fluid fill-height> -->
      <!-- <v-container fluid> -->
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
     <!-- </v-container> -->
      <!-- </v-container> -->
     </v-content>
  </v-app>
  <!-- </div> -->
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  data: () => ({
    naviBar: false
  }),
  computed: {
    ...mapGetters('Top', ['tag', 'title'])
  },
  mounted: () => {
  },
  destroyed: () => {
  },
  methods: {
    back () {
      history.go(-1)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Hiragino Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  background-color: #f9f9fb;
}

.w-break {
  word-break: break-all;
}

.font-color-shamrock { color: #2FCDB4; }

.sideOffset {
  margin: 2px 10px 2px 10px;
}

.currencyLabel {
  height: 16px;
  width: 35px;
  color: #939393;
  font-family: "Hiragino Sans";
  font-size: 16px;
  line-height: 24px;
}

.amountLabel {
  height: 27px;
  color: #0D0D0D;
  font-family: "Hiragino Sans";
  font-size: 30px;
  line-height: 27px;
  letter-spacing: -1.17px;
}

.currencyLabel.headerlabel {
  height: 12px;
  color: #939393;
  font-family: "Hiragino Sans";
  font-size: 12px;
  line-height: 18px;
}

.amountLabel.headerlabel {
  height: 27px;
  color: #0D0D0D;
  font-family: "Hiragino Sans";
  font-size: 18px;
  letter-spacing: -0.58px;
  line-height: 27px;
}

.amountLabel.total {
  line-height: 40px;
}

.totalUnitLabel {
  height: 27px;
  color: #0D0D0D;
  font-family: "Hiragino Sans";
  font-size: 24px;
  letter-spacing: -0.78px;
  line-height: 27px;
}

.customBtn {
  font-family: "Hiragino Sans";
  font-size: 16px;
  height: 70px;
}

.customBtn.customHalf {
  width: 43%;
}

.desLabel {
  color: #939393;
  font-family: "Hiragino Sans";
  font-size: 16px;
  line-height: 24px;
}

.desLabel.total {
  padding: 0.4em 0.6em;
  /* margin: 2em 0; */
  color: #FFFFFF;
  background-color: #DD3030;
  border-radius: 6px;
}

p.resizeImage {
   text-align: center;
   max-width: 271px; /* 最大幅 */
   min-width: 220px; /* 最小幅 */
   margin: 0 auto;
}
p.resizeImage img { width: 100%; }
 /*
}
a {
  text-decoration: none;
}
 */
 /*
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
 */
</style>
