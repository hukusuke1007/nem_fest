<template>
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="dialog-bottom-transition"
   scrollable
  >
  <v-card flat>
      <v-toolbar color="blue-grey lighten-5" dark>
        <v-toolbar-title class="black--text">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="close()" dark>
          <v-icon color="primary">close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
      <v-flex xs12 sm6 offset-sm3>
        <v-card flat>
        <div class="w-break sideOffset">
          <v-layout wrap column>
            <v-card>
              <v-card-text>
                <span style="margin-left: 0px;">xem</span>
                <span style="margin-left: 4px;">{{ nemBalance }}</span>
                <span style="margin-left: 30px;">fest</span>
                <span style="margin-left: 4px;">{{ festBalance }}</span>
              </v-card-text>
            </v-card>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>送信先</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    label="送信先を入力"
                    v-model="senderItem.address"
                    :rules="[rules.senderAddrLimit, rules.senderAddrInput]"
                    required
                    placeholder="例. XXXX-XXXX-XXXX-XXXX-XXXXXXXXXX"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>数量</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    label="数量を入力"
                    v-model="senderItem.amount"
                    :rules="[rules.amountLimit, rules.amountInput]"
                    required
                    placeholder=""
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <!--
                <v-flex xs4>
                  <v-subheader>メッセージ</v-subheader>
                </v-flex>
                -->
                <v-flex xs12>
                  <v-text-field
                    label="メッセージ"
                    v-model="senderItem.message"
                    :rules="[rules.messageRules]"
                    :counter="1024"
                    placeholder="メッセージを入力"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
            <v-card>
              <v-card-title>
              <div style="margin: 2px, 10px, 2px, 0px; text-align: left;">
                <div class="grey--text" style="font-size: 1.4em;">数量 {{ senderItem.amount }}</div>
                <div class="grey--text" style="font-size: 1.4em;">手数料 {{ fee }}</div>
                <div class="black--text" style="font-size: 2em;">合計 {{ totalAmount }}</div>
                <div class="grey--text" style="font-size: 1.2em;">残高 {{ remainBalance }}</div>
              </div>
              </v-card-title>
            </v-card>
            <v-flex>
              <v-btn color="primary" class="btnLarge" large block @click="tapSend" :disabled="!valid">送金する！</v-btn>
            </v-flex>
            <v-btn class="blue--text" flat large block @click="close">キャンセル</v-btn>
          </v-layout>
        </div>
        </v-card>
      </v-flex>
    </v-container>
  </v-card>

  <!-- 送金確認ダイアログ -->
  <DialogPositiveNegative v-bind:dialogVal="isShowDialogPosNeg"
                 titleVal="送金確認"
                 v-bind:messageVal="dialogPosNegMsg"
                 positiveVal="送金する"
                 negativeVal="いいえ"
                 v-on:dialog-positive-negative-event-tap="tapSendPosNeg"></DialogPositiveNegative>
  <!-- プログレス -->
  <ProgressCircular v-bind:isShowVal="isShowProgress"></ProgressCircular>
  
  </v-dialog>
</template>

<script>
  import nemWrapper from '@/js/nem_wrapper'
  import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  import ProgressCircular from '@/components/ProgressCircular'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data: () => ({
      dialog: false,
      valid: false,
      title: '送金する',
      isShowDialogPosNeg: false,
      isShowProgress: false,
      dialogPosNegMsg: '',
      fee: 0,
      totalAmount: 0,
      remainBalance: 0,
      trMosaics: { item: [], other: [] },
      rules: {
        senderAddrLimit: (value) => !!value || 'アドレスを入力してください',
        senderAddrInput: (value) => {
          const pattern = /^[a-zA-Z0-9-]+$/
          return pattern.test(value) || '入力が不正です'
        },
        amountLimit: (value) => !!value || '金額を入力してください',
        amountInput: (value) => {
          const pattern = /^[0-9.]+$/
          return (pattern.test(value) && !isNaN(Number(value))) || '入力が不正です'
        },
        messageRules: (value) => (value.length <= 1024) || '最大文字数を超えています。'
      }
    }),
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword'])
    },
    components: {
      DialogPositiveNegative,
      ProgressCircular
    },
    mounted () {
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      nemBalance: {
        type: Number,
        default: 0
      },
      festBalance: {
        type: Number,
        default: 0
      },
      transactionType: {
        type: String,
        default: 'nem'
      },
      pairKey: {
        type: Object,
        default: {}
      },
      senderItem: {
        type: Object,
        default: {}
      },
      mosaics: {
        type: Array,
        default: []
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
      },
      transactionType (val) {
        console.log('transactionType: ' + val)
        if (val === 'nem') {
          this.title = 'NEMを送金する'
        } else if (val === 'mosaics') {
          this.title = 'モザイクを送金する'
        }
      },
      nemBalance (val) {
        this.update('nemBalance', val)
      },
      'senderItem.address' (val) {
        if (val.length >= 40) {
          this.update('senderItem', val)
        }
      },
      'senderItem.amount' (val) {
        this.update('senderItem', val)
      },
      'senderItem.message' (val) {
        this.update('senderItem', val)
      }
    },
    methods: {
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      tapSend () {
        if (this.$refs.form.validate()) {
          console.log('submit')
          this.senderItem.address = this.senderItem.address.replace(/-/g, '')
          console.log(this.senderItem.address)
          if (this.remainBalance < 0) {
            let message = '残高が足りません'
            this.$toast(message)
          } else {
            this.dialogPosNegMsg = '送金しますか？<br><br>' +
              '数量:<br>' + this.senderItem.amount + ' xem' + '<br>' +
              '手数量:<br>' + this.fee + ' xem' + '<br>' +
              '合計:<br>' + this.totalAmount + ' xem' + '<br><br>' +
              '送金先:<br>' + this.senderItem.address + '<br><br>' +
              'メッセージ:<br>' + this.senderItem.message
            this.isShowDialogPosNeg = true
          }
        }
      },
      tapSendPosNeg (isPositive, message) {
        if (this.isShowDialogPosNeg === true) {
          if (isPositive) {
            this.sendTransaction()
          }
          this.isShowDialogPosNeg = false
        }
      },
      sendTransaction () {
        let message = ''
        let successMsg = '送金しました。<br>反映されるまで数分かかることがあります。' + '<br><br>'
        let errorMsg = '送金エラー' + '<br><br>' + 'メッセージ:<br>'

        this.isShowProgress = true
        if (this.transactionType === 'nem') {
          // NEM送金
          console.log('nem')
          nemWrapper.transferTransaction(this.senderItem.address, this.senderItem.amount, this.senderItem.message, this.pairKey.privateKey)
            .then((result) => {
              console.log(result)
              if (result.message === 'SUCCESS') {
                message = successMsg + 'Hash:<br>' + result.transactionHash.data + '<br>'
              } else {
                message = errorMsg + result.message + '<br>'
              }
              this.isShowProgress = false
              this.sended(result.message, message)
            }).catch((err) => {
              console.error(err)
              let error = err.error.message
              message = errorMsg + error + '<br>'
              this.isShowProgress = false
              this.sended(error, message)
            })
        } else if (this.transactionType === 'mosaics') {
          // モザイク送金
          console.log('mosaics')
          nemWrapper.transferTransactionMosaics(this.senderItem.address, this.trMosaics.item, this.senderItem.message, this.pairKey.privateKey)
            .then((result) => {
              console.log(result)
              if (result.message === 'SUCCESS') {
                message = successMsg + 'Hash:<br>' + result.transactionHash.data + '<br>'
              } else {
                message = errorMsg + result.message + '<br>'
              }
              this.isShowProgress = false
              this.sended(result.message, message)
            }).catch((err) => {
              console.error(err)
              let error = err.error.message
              message = errorMsg + error + '<br>'
              this.isShowProgress = false
              this.sended(error, message)
            })
        } else {
          console.log(this.transactionType)
          this.isShowProgress = false
        }
      },
      update (tag, val) {
        // 手数料
        if ((this.rules.senderAddrLimit(this.senderItem.address) === true) &&
            (this.rules.senderAddrInput(this.senderItem.address) === true)) {
          if (this.transactionType === 'nem') {
            this.fee = nemWrapper.getFeeTransferXem(this.senderItem.address, this.senderItem.amount, this.senderItem.message)
          } else if (this.transactionType === 'mosaics') {
            if ((this.rules.senderAddrLimit(this.senderAddr) === true) && (this.rules.senderAddrInput(this.senderAddr) === true)) {
              nemWrapper.getFeeTransferMosaics(this.senderAddr, this.trMosaics.item, this.message)
                .then((result) => {
                  this.fee = result
                  console.log(this.fee)
                }).catch((err) => {
                  console.error(err)
                  this.fee = 0
                })
            }
          }
        }
        // トータルを計算
        let total = Number(this.senderItem.amount) + Number(this.fee)
        let n = 6 // 下6桁まで残す.
        this.totalAmount = Math.floor(total * Math.pow(10, n)) / Math.pow(10, n)
        // 残高を計算
        this.remainBalance = this.nemBalance - this.totalAmount
      },
      clear () {
        this.senderItem.address = ''
        this.senderItem.amount = 0
        this.senderItem.message = ''
      },
      sended (stauts, message) {
        this.clear()
        this.$emit('dialog-transfer-transaction-sended', stauts, message)
      },
      close () {
        this.clear()
        this.$emit('dialog-transfer-transaction-close', 'close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btnLarge {
  font-color: white;
  height: 60px;
}
</style>
