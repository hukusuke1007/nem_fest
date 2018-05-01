<template>
  <!-- <div id="app"> -->
    <v-app>

     <!-- 上のツールバー -->
     <v-toolbar
      dark
      color="blue-grey lighten-5"
      clipped-left
      fixed
      app
     >
      <v-btn icon class="hidden-xs-only primary--text" @click="back">
        <v-icon>arrow_back</v-icon>
      </v-btn>
       <v-toolbar-title class="black--text">NEM fest</v-toolbar-title>
       <v-spacer></v-spacer>
     </v-toolbar>
     <v-content>

      <!-- 真ん中のView -->
      <!-- <v-container fluid fill-height> -->
      <v-container fluid>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
     </v-container>
      <!-- </v-container> -->
     </v-content>
  </v-app>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      naviBar: false
    }
  },
  mounted: function () {

  },
  destroyed: function () {

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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.w-break {
  word-break: break-all;
}

.font-color-shamrock { color: #2FCDB4; }

.sideOffset {
  margin: 2px 10px 2px 10px;
}
 /*
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
