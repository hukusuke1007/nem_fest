<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg>
    <div class="w-break sideOffset">
      <v-flex xs12 sm6 offset-sm3>
       <v-layout column wrap>
          <v-flex>
            <v-flex>
              <p class="resizeImage">
                <img :src="logoImage"></img>
              </p>
            </v-flex>
            <v-flex>
              <div class="label">ようこそ！</div>
            </v-flex>
            <v-flex>
              <v-btn color="originalGrey" class="customBtn white--text" large block @click="tapCreate">{{ createBtnName }}</v-btn>
            </v-flex>
          </v-flex>

      </v-layout>
     </v-flex>
    </div>
    <DialogAuthWallet v-bind:dialogVal="isShowAuthWallet"
                 v-on:dialog-auth-wallet-close="tapAuthWalletClose"
                 v-on:dialog-auth-wallet-notify="tapAuthWalletNotify"></DialogAuthWallet>
  </v-container>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import DialogAuthWallet from '@/components/DialogAuthWallet'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'topPage',
    data: () => ({
      logoImage: require('@/assets/logo.png'),
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
<style scoped>
.label {
  height: 20px;
  color: #000000;
  font-family: "Hiragino Sans";
  font-size: 20px;
  line-height: 30px;
  text-align: center;
}
</style>
