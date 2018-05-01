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
              <v-btn large block @click="tapCreate">{{ createBtnName }}</v-btn>
            </div>
            <br>
          </v-flex>
          <v-flex v-else>
            ウォレットあったよ〜
          </v-flex>

          <DialogAuthWallet v-bind:dialogVal="isShowAuthWallet"
                       v-on:dialog-auth-wallet-close="tapAuthWalletClose"
                       v-on:dialog-auth-wallet-notify="tapAuthWalletNotify"></DialogAuthWallet>
        </v-card>
      </v-layout>
     </v-flex>
    </div>
  </v-container>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import DialogAuthWallet from '@/components/DialogAuthWallet'
  export default {
    name: 'topPage',
    data: () => ({
      createBtnName: 'ウォレットを作成する',
      isExistWallet: false,
      isShowAuthWallet: false,
      description: 'このウォレットの説明文が入ります<br>ユキちゃんへ相談<br>・送受金している最中と完了したときのUIについて<br>・送受金履歴どうしようか<br>・送金画面はプッシュかモーダルか'
    }),
    components: {
      DialogAuthWallet
    },
    mounted () {
      this.getWallet()
    },
    methods: {
      getWallet () {
        dbWrapper.getItem(dbWrapper.KEY_WALLET_INFO)
          .then((result) => {
            if (result) {
              this.createBtnName = 'パスワードを入力する'
              // this.isExistWallet = true
              this.isShowAuthWallet = true
            } else {
              this.createBtnName = 'ウォレットを作成する'
            }
          }).catch((err) => {
            console.error(err)
          })
      },
      tapCreate () {
        this.isShowAuthWallet = true
      },
      tapAuthWalletClose (status) {
        this.isShowAuthWallet = false
      },
      tapAuthWalletNotify (status) {
        console.log(status)
        if (status === 'created' || status === 'auth_success') {
          console.log('go to next page')
          this.isExistWallet = true
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
