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
            <payPassword :name="aaa" :length="4" :value="pass"
              v-on:input="inputPass"
              v-on:focus="forcusPass"
              v-on:clear="clearPass">
              </payPassword>
            <br>
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
  import dbWrapper from '@/js/local_database_wrapper'
  import payPassword from 'vue-pay-password'
  import 'vue-pay-password/dist/vue-pay-password.css'

  export default {
    name: 'topPage',
    data: () => ({
      password: '',
      isExistWallet: false,
      description: 'このウォレットの説明文が入ります<br>ユキちゃんへ相談<br>・送受金している最中と完了したときのUIについて<br>・送受金履歴どうしようか<br>・送金画面はプッシュかモーダルか'
    }),
    components: {
      payPassword
    },
    mounted () {
      this.getWallet()
    },
    methods: {
      getWallet () {
        let id = 0
        dbWrapper.getItemArray(dbWrapper.KEY_WALLET_INFO, id)
          .then((result) => {
            if (result) {
              this.isExistWallet = true
            }
          }).catch((err) => {
            console.error(err)
          })
      },
      tapCreate () {
      },
      inputPass (val) {
        console.log(val)
      },
      forcusPass () {
        console.log('forcus')
      },
      clearPass () {
        console.log('clear')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
