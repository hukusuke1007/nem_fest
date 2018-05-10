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
