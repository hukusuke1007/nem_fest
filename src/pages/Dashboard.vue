<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg>
    <div class="w-break sideOffset">
      <v-flex xs12 sm6 offset-sm3>
       <v-layout column wrap>
          <v-flex v-if="isAuth">
              <v-card>
                <v-card-actions>
                   <v-card-title class="grey--text" style="font-weight: bold;">残高</v-card-title>
                   <v-spacer></v-spacer>
                   <v-menu offset-y>
                   <v-btn slot="activator" fab small flat><v-icon>view_module</v-icon></v-btn>
                    <v-list>
                      <v-subheader>保有モザイク一覧</v-subheader>
                      <v-list-tile v-for="mosaic in mosaics" :key="mosaic.text" @click="">
                        <v-list-tile-title>{{ mosaic.amount }} {{ mosaic.text }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-btn fab small flat @click="getWallet" :loading="isLoading"><v-icon>cached</v-icon></v-btn>
                </v-card-actions>
                <div style="text-align: left; margin-left: 30px;">
                  <div>
                    <span class="currencyLabel">fest</span>
                    <span class="amountLabel" style="margin-left: 22px;">{{ festBalance }}</span>
                  </div>
                  <div>
                    <span class="currencyLabel">xem</span>
                    <span class="amountLabel" style="margin-left: 20px;">{{ nemBalance }}</span>
                  </div>
                </div>
                <br>
              </v-card>
              <div style="margin-top: 10px;">
                <v-btn color="originalRed" class="customBtn white--text" large block @click="tapShowAccount">受け取る</v-btn>
                <v-btn color="originalGreen" class="customBtn white--text" large block @click="tapSendQRcode('mosaics')">ドリンク・グッズ引き換え</v-btn>
                <v-btn color="originalGreen" class="customBtn white--text" large block @click="tapSendQRcode('mosaics')">投票する</v-btn>
              </div>
              <div style="margin: 10px 0px 5px 0px;"><v-divider></v-divider></div>
                <v-btn color="originalGrey" class="customBtn customHalf white--text" large @click="tapSend">送る</v-btn>
                <v-btn color="originalGrey" class="customBtn customHalf white--text" large @click="tapSendQRcode('nem')">QR読み込み</v-btn>
              <div style="margin-top: 0px;">
                <v-btn color="originalGrey" class="customBtn white--text" large block @click="tapShowHistory">履歴を見る</v-btn>
              </div>
              <div style="margin-top: 20px;">
                <v-btn color="primary" class="customBtn" flat large block @click="tapShowPrivateKey">秘密鍵を表示</v-btn>
                <v-btn color="primary" class="customBtn" flat large block @click="tapWalletReset">ウォレットをリセット</v-btn>
              </div>
            
          </v-flex>
          <v-flex v-else>
            <v-card-text><div v-html="descriptionNotAuth" style="text-align: left;"></div></v-card-text>
          </v-flex>
      </v-layout>
     </v-flex>
    </div>
    <!-- 受け取る -->
    <DialogWalletAccount
                 v-bind:dialogVal="isShowAccount"
                 v-on:dialog-wallet-account-close="tapWalletAccountClose"></DialogWalletAccount>

    <!-- 送金する(選択) -->
    <DialogSelectTransfer
                 v-bind:dialogVal="isSelectTrans"
                 v-on:dialog-select-transfer-select="tapSelectTransSelect"
                 v-on:dialog-select-transfer-close="tapSelectTransClose"></DialogSelectTransfer>

    <!-- 実際に送金する画面 -->
    <DialogTransferTransaction
                 v-bind:dialogVal="isShowTransfer"
                 v-bind:transactionType="transactionType"
                 v-bind:senderItem="senderItem"
                 v-on:dialog-transfer-transaction-sended="tapTransferSended"
                 v-on:dialog-transfer-transaction-close="tapTransferClose"></DialogTransferTransaction>

    <!-- QRコードから送る -->
    <DialogQRreader
                 v-bind:dialogVal="isShowQRreader"
                 v-on:dialog-qr-reader-scan="getQRContent"
                 v-on:dialog-qr-reader-close="tapQRreaderClose"></DialogQRreader>

    <!-- パスワード入力 -->
    <DialogAuthWallet v-bind:dialogVal="isShowAuthWallet"
                 v-on:dialog-auth-wallet-close="tapAuthWalletClose"
                 v-on:dialog-auth-wallet-notify="tapAuthWalletNotify"></DialogAuthWallet>

    <!-- ダイアログ -->
    <DialogConfirm v-bind:dialogVal="isShowDialog"
                   v-bind:titleVal="dialogTitle"
                   v-bind:messageVal="dialogMsg"
                   v-on:dialog-confirm-event-tap-positive="tapDialogConfirm"></DialogConfirm>

    <!-- 確認ダイアログ -->
    <DialogPositiveNegative v-bind:dialogVal="isShowDialogPosNeg"
                   v-bind:titleVal="dialogPosNegTitle"
                   v-bind:messageVal="dialogPosNegTitleMessage"
                   v-bind:positiveVal="dialogPosMsg"
                   v-bind:negativeVal="dialogNegMsg"
                   v-on:dialog-positive-negative-event-tap="tapDialogPosNeg"></DialogPositiveNegative>
  </v-container>
</template>

<script>
  import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogWalletAccount from '@/components/DialogWalletAccount'
  import DialogSelectTransfer from '@/components/DialogSelectTransfer'
  import DialogTransferTransaction from '@/components/DialogTransferTransaction'
  import DialogQRreader from '@/components/DialogQRreader'
  import DialogAuthWallet from '@/components/DialogAuthWallet'
  import DialogConfirm from '@/components/DialogConfirm'
  import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'dashboard',
    data: () => ({
      senderItem: {
        address: '',
        amount: 0,
        message: '',
        mosaics: []
      },
      selectBtn: '',
      transactionType: '',
      isShowAccount: false,
      isSelectTrans: false,
      isShowTransfer: false,
      isShowQRreader: false,
      isShowAuthWallet: false,
      isShowDialog: false,
      isShowDialogPosNeg: false,
      dialogTitle: '',
      dialogMsg: '',
      dialogPosNegTitle: '',
      dialogPosNegTitleMessage: '',
      dialogPosMsg: '',
      dialogNegMsg: ''
    }),
    components: {
      DialogWalletAccount,
      DialogSelectTransfer,
      DialogTransferTransaction,
      DialogQRreader,
      DialogAuthWallet,
      DialogConfirm,
      DialogPositiveNegative
    },
    computed: {
      ...mapGetters('Top', ['descriptionNotAuth']),
      ...mapGetters('Auth', ['isAuth', 'authPassword']),
      ...mapGetters('Nem', ['walletItem', 'address', 'pairKey', 'nemBalance', 'festBalance', 'mosaics', 'transactionStatus', 'isLoading'])
      /*
      ...mapGetters('Nem', {
        stWalletItem: 'walletItem',
        stAddress: 'address',
        stPairKey: 'pairKey',
        stNemBalance: 'nemBalance',
        stFestBalance: 'festBalance',
        stMosaics: 'mosaics'
      })
      */
    },
    mounted () {
      // デバックのため認証状態にする
      // this.doAuth(true)
      // this.doAuthPassword('11110000')
      this.doTargetMosaicTemplate()
      this.doTag('dashboard')
      this.doTitle('ダッシュボード')
      if (this.isAuth === true) {
        this.getWallet()
      } else {
        this.$router.push({name: 'TopPage'})
      }
    },
    watch: {
      address (val) {
        this.doObserveTransaction()
      },
      transactionStatus (val) {
        console.log('transactionStatus', val)
        if (val === 'unconfirmed') {
          this.$toast('トランザクション承認中...')
        } else if (val === 'confirmed') {
          this.$toast('トランザクションが承認されました。反映されない場合は更新ボタンを押してください。')
          this.doTransactionStatus('none')
        }
      }
    },
    methods: {
      ...mapActions('Top', ['doTag', 'doTitle']),
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      ...mapActions('Nem', ['doUpdateNemBalance', 'doUpdateMosaicsBalance', 'doObserveTransaction', 'doWalletItem', 'doAddress', 'doPairKey', 'doTransactionStatus', 'doTargetMosaicTemplate']),
      getWallet () {
        dbWrapper.getItem(dbWrapper.KEY_WALLET_INFO)
          .then((result) => {
            this.doWalletItem(result)
            this.doAddress(result.account.address.value)
            this.doPairKey(nemWrapper.getPairKey(result.account, this.authPassword))
            this.doUpdateNemBalance()
            this.doUpdateMosaicsBalance()
          }).catch((err) => {
            console.error(err)
          })
      },
      getQRContent (content) {
        console.log(content)
        if ((content !== null) && ('data' in content)) {
          console.log(content)
          // this.name = content.data.name
          if (this.selectBtn === 'nem') {
            this.transactionType = 'nem'
          } else if (this.selectBtn === 'mosaics') {
            this.transactionType = 'mosaics'
          }
          this.senderItem.address = content.data.addr
          // amount
          if (this.transactionType === 'mosaics') {
            this.senderItem.amount = 1
          } else if ('amount' in content.data) {
            this.senderItem.amount = Number(content.data.amount) / Math.pow(10, 6)
          } else {
            this.senderItem.amount = 0
          }
          // メッセージ.
          this.senderItem.message = ''
          /*
          if ('msg' in content.data) {
            this.senderItem.message = content.data.msg
          } else {
            this.senderItem.message = ''
          }
          */
          this.isShowQRreader = false
          this.isShowTransfer = true
          console.log('getQRContent', this.selectBtn, this.transactionType)
        }
      },
      resetWallet () {
        this.doAuth(false)
        this.doAuthPassword('')
        dbWrapper.removeItem(dbWrapper.KEY_WALLET_INFO)
          .then((walletResult) => {
            dbWrapper.removeItem(dbWrapper.KEY_AUTH_PASSWORD)
              .then((authResult) => {
                this.$toast('リセットしました')
                this.$router.push({name: 'TopPage'})
              }).catch((err) => {
                console.log(err)
                this.showDialog('ウォレットのリセット', err.error.message)
              })
          }).catch((err) => {
            console.log(err)
            this.showDialog('ウォレットのリセット', err.error.message)
          })
      },
      showDialog (title, message) {
        this.dialogTitle = title
        this.dialogMsg = message
        this.isShowDialog = true
      },
      tapShowAccount () {
        this.isShowAccount = true
      },
      tapSend () {
        this.isSelectTrans = true
      },
      tapSendQRcode (type) {
        console.log(type)
        this.selectBtn = type
        this.isShowQRreader = true
      },
      tapShowHistory () {
        this.$router.push({name: 'History'})
      },
      tapShowPrivateKey () {
        this.selectBtn = 'private'
        this.isShowAuthWallet = true
      },
      tapWalletReset () {
        this.selectBtn = 'reset'
        this.isShowAuthWallet = true
      },
      tapWalletAccountClose (status) {
        this.isShowAccount = false
      },
      tapSelectTransSelect (select) {
        console.log(select)
        this.senderItem.address = ''
        this.senderItem.amount = 0
        this.senderItem.message = ''
        this.transactionType = select
        this.isShowTransfer = true
      },
      tapTransferSended (status, message) {
        if (status === 'SUCCESS') {
          this.isShowTransfer = false
          this.isSelectTrans = false
        }
        this.$toast(message)
      },
      tapTransferClose (status) {
        this.isShowTransfer = false
      },
      tapSelectTransClose (status) {
        this.isSelectTrans = false
      },
      tapQRreaderClose (status) {
        this.isShowQRreader = false
      },
      tapAuthWalletClose (status) {
        this.isShowAuthWallet = false
      },
      tapAuthWalletNotify (status) {
        console.log(status)
        if (status === 'auth_success') {
          if (this.selectBtn === 'private') {
            this.dialogTitle = '秘密鍵'
            this.dialogMsg = this.pairKey.privateKey
            this.isShowDialog = true
          } else if (this.selectBtn === 'reset') {
            this.dialogPosNegTitle = 'ウォレットのリセット'
            this.dialogPosNegTitleMessage = 'ウォレットをリセットしますか？'
            this.dialogPosMsg = 'リセットする'
            this.dialogNegMsg = 'いいえ'
            this.isShowDialogPosNeg = true
          }
        } else if (status === 'created') {
          this.$router.push({name: 'TopPage'})
        }
      },
      tapDialogConfirm (status) {
        this.isShowDialog = false
      },
      tapDialogPosNeg (isPositive, message) {
        this.isShowDialogPosNeg = false
        if (isPositive) {
          this.resetWallet()
        }
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
  font-size: 1.0em;
  font-color: white;
  width: 102px;
  height: 102px;
}


</style>
