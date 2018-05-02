<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg>
    <div class="w-break sideOffset">
      <v-flex xs12 sm6 offset-sm3>
       <v-layout column wrap>
        <v-card>
          <v-flex>
            <div style="text-align: center;">
              <h1>ようこそ！</h1>
            </div>
            <v-card-text><div v-html="description" style="text-align: left;"></div></v-card-text>
            <div style="margin: 100px 0px 32px 0px;">
              <v-btn large block @click="tapCreate">{{ createBtnName }}</v-btn>
            </div>
            <br>
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
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'topPage',
    data: () => ({
      createBtnName: 'ウォレットを作成する',
      isShowAuthWallet: false,
      description: 'このウォレットの説明文が入ります<br>ユキちゃんへ相談<br>・送受金している最中と完了したときのUIについて<br>・送受金履歴どうしようか<br>・送金画面はプッシュかモーダルか'
    }),
    components: {
      DialogAuthWallet
    },
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword'])
    },
    mounted () {
      this.doTitle('ウォレットの作成')

      // デバック用
      /*
      this.doAuth(true)
      this.doAuthPassword('aaaaaaaa')
      this.goNextPage()
      */
      if (this.isAuth === true) {
        this.goNextPage()
      } else {
        this.getWallet()
      }
    },
    methods: {
      ...mapActions('Top', ['doTitle']),
      // ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      getWallet () {
        dbWrapper.getItem(dbWrapper.KEY_WALLET_INFO)
          .then((result) => {
            if (result) {
              this.createBtnName = 'パスワードを入力する'
              this.isShowAuthWallet = true
            } else {
              this.createBtnName = 'ウォレットを作成する'
            }
          }).catch((err) => {
            console.error(err)
          })
      },
      goNextPage () {
        console.log('go to next page mounted')
        this.$router.push({name: 'Dashboard'})
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
          this.goNextPage()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>



</style>
