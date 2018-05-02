<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg>
    <div class="w-break sideOffset">
      <v-flex xs12 sm6 offset-sm3>
      <v-card>
       <v-layout column wrap>
          <v-flex v-if="isAuth">
            <div style="text-align: center;">xem<font size="5" style="margin-left: 8px;">{{ nemBalance }}</font></div>
            <div style="text-align: center;">fest<font size="5" style="margin-left: 8px;">{{ festBalance }}</font></div>
            <v-flex>
              <v-btn color="primary" class="btnLarge" large block @click="tapShowAccount">受け取る</v-btn>
              <v-btn color="primary" class="btnMedium" large @click="tapSend">送金する</v-btn>
              <v-btn color="primary" class="btnMedium" large @click="tapSendQRcode">QRコードから<br>送る</v-btn>
              <v-btn color="grey lighten-4" class="btnLarge" large block @click="tapShowHistory">履歴を見る</v-btn>
              <v-btn color="grey lighten-4" class="black--text" large @click="tapShowPrivateKey">秘密鍵を表示する</v-btn>
              <v-btn flat large block @click="tapWalletReset">ウォレットをリセットする</v-btn>
            </v-flex>
          </v-flex>
          <v-flex v-else>
            <v-card-text><div v-html="description" style="text-align: left;"></div></v-card-text>
          </v-flex>               
        
      </v-layout>
      </v-card>
     </v-flex>
    </div>
    <!-- 受け取る -->
    <DialogWalletAccount
                 v-bind:dialogVal="isShowAccount"
                 v-bind:walletItem="walletItem"
                 v-bind:nemBalance="nemBalance"
                 v-bind:festBalance="festBalance"
                 v-on:dialog-wallet-account-close="tapWalletAccountClose"></DialogWalletAccount>
  </v-container>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogWalletAccount from '@/components/DialogWalletAccount'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'dashboard',
    data: () => ({
      walletItem: null,
      address: '',
      pairKey: {},
      nemBalance: 0,
      festBalance: 0,
      mosaics: [],
      createBtnName: 'ダッシュボード',
      isShowAccount: false,
      description: '本人確認できていません。<br>TOPページで認証してください。'
    }),
    components: {
      DialogWalletAccount
    },
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword'])
    },
    mounted () {
      // デバックのため認証状態にする
      this.doAuth(true)
      this.doAuthPassword('aaaaaaaa')
      this.doTitle('ダッシュボード')
      if (this.isAuth === true) {
        this.getWallet()
      } else {
        this.$router.push({name: 'TopPage'})
      }
    },
    methods: {
      ...mapActions('Top', ['doTitle']),
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      getWallet () {
        dbWrapper.getItem(dbWrapper.KEY_WALLET_INFO)
          .then((result) => {
            this.walletItem = result
            this.address = result.account.address.value
            this.pairKey = nemWrapper.getPairKey(result.account, this.authPassword)
            // 残高取得.
            nemWrapper.getAccountFromPublicKey(this.pairKey.publicKey)
              .then((result) => {
                this.nemBalance = result.balance.balance / nemWrapper.NEM_UNIT
              }).catch((err) => {
                console.log(err)
              })
            // モザイク取得.
            nemWrapper.getMosaics(this.address)
              .then((result) => {
                console.log(result)
                result.forEach((element) => {
                  let mosaic = {}
                  mosaic.text = element.mosaicId.namespaceId + ':' + element.mosaicId.name
                  mosaic.namespaceId = element.mosaicId.namespaceId
                  mosaic.name = element.mosaicId.name
                  mosaic.amount = element.amount
                  mosaic.divisibility = element.properties.divisibility
                  mosaic.initialSupply = element.properties.initialSupply
                  mosaic.supplyMutable = element.properties.supplyMutable
                  mosaic.transferable = element.properties.transferable
                  this.mosaics.push(mosaic)
                })
              }).catch((err) => {
                console.log('get_mosaic_error: ' + err)
              })
          }).catch((err) => {
            console.error(err)
          })
      },
      tapShowAccount () {
        this.isShowAccount = true
      },
      tapSend () {
      },
      tapSendQRcode () {
      },
      tapShowHistory () {
      },
      tapShowPrivateKey () {
      },
      tapWalletReset () {
      },
      tapWalletAccountClose (status) {
        this.isShowAccount = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btnLarge {
  font-color: white;
  height: 80px;
}

.btnMedium {
  font-color: white;
  width: 102px;
  height: 102px;
}


</style>
