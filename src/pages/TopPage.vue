<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg>
    <div class="w-break sideOffset">
      <v-flex xs12 sm6 offset-sm3>
       <v-layout column wrap>
        <v-card>
          <v-flex v-if="!isExistWallet">
            <div style="text-align: center;">
              <h1>ようこそ！</h1>
            </div>
            <v-card-text><div v-html="description" style="text-align: left;"></div></v-card-text>
            <div style="margin: 100px 0px 32px 0px;">
              <v-btn large block @click="tapCreate">ウォレットを作成する</v-btn>
            </div>
          </v-flex>
          <v-flex v-else>
            ウォレットあったよ〜
          </v-flex>
        </v-card>
      </v-layout>
     </v-flex>
    </div>
  </v-container>
</template>

<script>
  export default {
    name: 'topPage',
    data: () => ({
      isExistWallet: false,
      description: 'このウォレットの説明文が入ります<br>ユキちゃんへ相談<br>・送受金している最中と完了したときのUIについて<br>・送受金履歴どうしようか<br>・送金画面はプッシュかモーダルか'
    }),
    mounted () {
      this.getWallet()
    },
    methods: {
      getWallet () {

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
