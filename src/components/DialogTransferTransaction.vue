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
                <span class="currencyLabel headerlabel" style="margin-left: 0px;">fest</span>
                <span class="amountLabel headerlabel"  style="margin-left: 6px;">{{ festBalance }}</span>
                <span class="currencyLabel headerlabel" style="margin-left: 34px;">xem</span>
                <span class="amountLabel headerlabel"  style="margin-left: 6px;">{{ nemBalance }}</span>
              </v-card-text>
            </v-card>
            <v-flex>
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
                <div v-if="(transactionType==='nem')||(transactionType==='mosaics')">
                <v-layout row>
                    <v-flex xs4>
                      <v-subheader>数量 {{ targetUnit }}</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field
                        label="数量を入力"
                        v-model="senderItem.amount"
                        :rules="[rules.amountLimit, rules.amountInput]"
                        required
                        placeholder=""
                        type="number"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  </div>
                  <div v-else-if="transactionType==='all'">
                    <div v-for="(item, index) in senderItem.mosaics">
                      <v-layout row>
                        <v-flex xs4>
                          <v-subheader>数量 {{ item.name }}</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                          <v-text-field
                            label="数量を入力"
                            v-model="item.quantity"
                            :rules="[rules.amountLimit, rules.amountInput]"
                            required
                            placeholder=""
                            type="number"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </div>
                  </div>
                <v-layout row>
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
            </v-flex>
            <v-card>
              <v-card-title>
              <div v-if="(transactionType==='nem')||(transactionType==='mosaics')" style="margin: 2px, 10px, 2px, 0px; text-align: left;">
                <div>
                  <span class="desLabel">数量</span>
                  <span class="desLabel" style="margin-left: 2em;">{{ senderItem.amount }}{{ targetUnit }}</span>
                </div>
                <div>
                  <span class="desLabel">手数料</span>
                  <span class="desLabel" style="margin-left: 1em;">{{ fee }}xem</span>
                </div>
                <div>
                  <span class="desLabel total">合計</span>
                  <span class="amountLabel total" style="margin-left: 0.3em;">{{ totalAmount }}</span>
                  <span class="totalUnitLabel">{{ targetUnit }}</span>
                </div>
                <!-- <div class="grey--text" style="font-size: 1.2em;">残高 {{ remainBalance }} {{ targetUnit }}</div> -->
              </div>
              <div v-else-if="transactionType==='all'" style="margin: 2px, 10px, 2px, 0px; text-align: left;">
                <div v-for="(item, index) in senderItem.mosaics">
                  <span class="desLabel">数量</span>
                  <span class="desLabel" style="margin-left: 2em;">{{ item.quantity }}{{ item.name }}</span>
                </div>
                <!-- 
                <div v-for="(item, index) in senderItem.mosaics">
                  <div class="grey--text" style="font-size: 1.2em;">残高 {{ item.remainBalance }} {{ item.name }}</div>
                </div>
                -->
                <div>
                  <span class="desLabel">手数料</span>
                  <span class="desLabel" style="margin-left: 1em;">{{ fee }}xem</span>
                </div>
              </div>
              </v-card-title>
            </v-card>
            <v-flex>
              <v-btn color="originalRed" class="customBtn" large block @click="tapSend" :disabled="!valid">送金する</v-btn>
            </v-flex>
            <v-btn color="primary" class="customBtn" flat large block @click="close">キャンセル</v-btn>
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
  <!-- ダイアログ -->
  <DialogConfirm v-bind:dialogVal="isShowDialog"
                 v-bind:titleVal="dialogTitle"
                 v-bind:messageVal="dialogMsg"
                 v-on:dialog-confirm-event-tap-positive="tapDialogConfirm"></DialogConfirm>
  <!-- プログレス -->
  <ProgressCircular v-bind:isShowVal="isShowProgress"></ProgressCircular>

  </v-dialog>
</template>

<script>
  import nemWrapper from '@/js/nem_wrapper'
  import DialogPositiveNegative from '@/components/DialogPositiveNegative'
  import DialogConfirm from '@/components/DialogConfirm'
  import ProgressCircular from '@/components/ProgressCircular'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({
      dialog: false,
      valid: false,
      title: '送金する',
      isShowDialogPosNeg: false,
      isShowDialog: false,
      isShowProgress: false,
      dialogPosNegMsg: '',
      dialogTitle: '',
      dialogMsg: '',
      fee: 0,
      totalAmount: 0,
      remainBalance: 0,
      trMosaics: { item: [], other: [] },
      targetUnit: 'xem',
      rules: {
        senderAddrLimit: (value) => !!value || 'アドレスを入力してください',
        senderAddrInput: (value) => {
          const pattern = /^[a-zA-Z0-9-]+$/
          return pattern.test(value) || '入力が不正です'
        },
        amountLimit: (value) => (value !== '') || '金額を入力してください',
        amountInput: (value) => {
          const pattern = /^[0-9.]+$/
          return (pattern.test(value) && !isNaN(Number(value))) || '入力が不正です'
        },
        messageRules: (value) => (value.length <= 1024) || '最大文字数を超えています。'
      }
    }),
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword']),
      ...mapGetters('Nem', ['pairKey', 'nemBalance', 'festBalance', 'mosaics', 'targetMosaicNamespace', 'targetMosaicTemplate'])
    },
    components: {
      DialogPositiveNegative,
      DialogConfirm,
      ProgressCircular
    },
    mounted () {
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      transactionType: {
        type: String,
        default: 'nem'
      },
      senderItem: {
        type: Object,
        default: {}
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
        this.setTransferMosaics()
        if (val === true) {
          this.fee = 0
          this.totalAmount = 0
          this.remainBalance = 0
          if (this.transactionType === 'nem') {
            this.title = 'NEMを送金する'
            this.targetUnit = 'xem'
          } else if (this.transactionType === 'mosaics') {
            this.title = 'モザイクを送金する'
            this.targetUnit = this.targetMosaicNamespace.name
          } else if (this.transactionType === 'all') {
            this.title = 'すべて出金する'
            this.setAllamount()
          }
          if (this.senderItem.address.length >= 40) { this.update() }
        }
      },
      transactionType (val) {
        console.log('transactionType: ' + val)
      },
      nemBalance (val) {
        this.update()
      },
      'senderItem': {
        handler: function (val, oldVal) {
          console.log('senderItem watch 1', 'newval: ', val, '   oldVal:', oldVal)
          if (val.address.length >= 40) { this.update() }
        },
        deep: true
      }
    },
    methods: {
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      tapSend () {
        if (this.$refs.form.validate()) {
          console.log('submit remainBalance', this.remainBalance, this.senderItem.address)
          this.senderItem.address = this.senderItem.address.replace(/-/g, '')
          if (this.transactionType === 'nem') {
            if (this.remainBalance < 0) {
              let message = '残高が足りません'
              this.$toast(message)
            } else {
              this.dialogPosNegMsg = 'NEMを送金しますか？<br><br>' +
                '数量:<br>' + this.senderItem.amount + ' xem' + '<br>' +
                '手数量:<br>' + this.fee + ' xem' + '<br>' +
                '合計:<br>' + this.totalAmount + ' xem' + '<br><br>' +
                '送金先:<br>' + this.senderItem.address + '<br><br>' +
                'メッセージ:<br>' + this.senderItem.message
              this.isShowDialogPosNeg = true
            }
          } else if (this.transactionType === 'mosaics') {
            if ((this.remainBalance < 0) || (this.nemBalance < this.fee)) {
              let message = '残高が足りません。'
              this.$toast(message)
            } else {
              let target = this.targetMosaicNamespace
              let targetMosaic = this.getTargetMosaic(target.namespaceId, target.name)
              let name = targetMosaic.other[0].name
              let namespaceId = targetMosaic.other[0].namespaceId
              this.dialogPosNegMsg = namespaceId + 'を送金しますか？<br><br>' +
                '数量:<br>' + this.senderItem.amount + ' ' + name + '<br>' +
                '手数量:<br>' + this.fee + ' xem' + '<br>' +
                '送金先:<br>' + this.senderItem.address + '<br><br>' +
                'メッセージ:<br>' + this.senderItem.message
              this.isShowDialogPosNeg = true
            }
          } else if (this.transactionType === 'all') {
            this.updateNemQuantity() // 手数料を再計算.
            let isError = false
            this.senderItem.mosaics.forEach((element) => {
              if (element.remainBalance < 0) { isError = true }
            })
            if (isError === true) {
              let message = '残高が足りません。'
              this.$toast(message)
            } else {
              let mosaicsMsg = ''
              this.senderItem.mosaics.forEach((element) => {
                mosaicsMsg += '数量:<br>' + element.quantity + ' ' + element.name + '<br>'
              })
              this.dialogPosNegMsg = 'すべて送金しますか？<br><br>' +
                mosaicsMsg +
                '手数量:<br>' + this.fee + ' xem' + '<br>' +
                '送金先:<br>' + this.senderItem.address + '<br><br>' +
                'メッセージ:<br>' + this.senderItem.message
              this.isShowDialogPosNeg = true
            }
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
        let successMsg = '送金しました。トランザクション承認中...'
        let errorTitle = '送金エラー'

        this.isShowProgress = true
        if (this.transactionType === 'nem') {
          // NEM送金
          console.log('sendTransaction', 'nem')
          nemWrapper.transferTransaction(this.senderItem.address, this.senderItem.amount, this.senderItem.message, this.pairKey.privateKey)
            .then((result) => {
              console.log(result)
              this.isShowProgress = false
              if (result.message === 'SUCCESS') {
                this.sended(result.message, successMsg)
              } else {
                this.showDialog(errorTitle, result.message)
              }
            }).catch((err) => {
              console.error(err)
              this.isShowProgress = false
              this.showDialog(errorTitle, err.error.message)
            })
        } else if (this.transactionType === 'mosaics') {
          // モザイク送金
          console.log('sendTransaction', 'mosaics')
          let target = this.targetMosaicNamespace
          let targetMosaic = this.getTargetMosaic(target.namespaceId, target.name)
          targetMosaic.item[0].quantity = this.senderItem.amount
          nemWrapper.transferTransactionMosaics(this.senderItem.address, targetMosaic.item, this.senderItem.message, this.pairKey.privateKey)
            .then((result) => {
              console.log(result)
              this.isShowProgress = false
              if (result.message === 'SUCCESS') {
                this.sended(result.message, successMsg)
              } else {
                this.showDialog(errorTitle, result.message)
              }
            }).catch((err) => {
              console.error(err)
              this.isShowProgress = false
              this.showDialog(errorTitle, err.error.message)
            })
        } else if (this.transactionType === 'all') {
          // XEMとモザイク送金
          console.log('sendTransaction', 'all')
          nemWrapper.transferTransactionMosaics(this.senderItem.address, this.senderItem.mosaics, this.senderItem.message, this.pairKey.privateKey)
            .then((result) => {
              console.log(result)
              this.isShowProgress = false
              if (result.message === 'SUCCESS') {
                this.sended(result.message, successMsg)
              } else {
                this.showDialog(errorTitle, result.message)
              }
            }).catch((err) => {
              console.error(err)
              this.isShowProgress = false
              this.showDialog(errorTitle, err.error.message)
            })
        } else {
          console.log(this.transactionType)
          this.isShowProgress = false
        }
      },
      setTransferMosaics () {
        let target = this.targetMosaicNamespace
        this.trMosaics = { item: [], other: [] }
        this.mosaics.forEach((element) => {
          // XEMとfestモザイクのみ取得する.
          if ((element.namespaceId === 'nem' && element.name === 'xem') ||
              (element.namespaceId === target.namespaceId && element.name === target.name)) {
            let amount = 0
            if (this.transactionType === 'all') { amount = element.amount }
            let item = {
              namespaceId: element.namespaceId,
              name: element.name,
              quantity: amount
            }
            this.trMosaics.item.push(item)
            this.trMosaics.other.push(element)
          }
        })
      },
      setAllamount () {
        this.senderItem.mosaics = []
        this.trMosaics.other.forEach((element) => {
          let item = {
            namespaceId: element.namespaceId,
            name: element.name,
            quantity: element.amount,
            amount: element.amount,
            divisibility: element.divisibility,
            remainBalance: 0
          }
          this.senderItem.mosaics.push(item)
        })
        console.log('this.senderItem.mosaics', this.senderItem.mosaics)
        console.log('this.trMosaics.item', this.trMosaics.item)
      },
      getTargetMosaic (namespaceId, name) {
        let targetMosaic = { item: [], other: [] }
        targetMosaic.item[0] = this.targetMosaicTemplate
        targetMosaic.other[0] = this.targetMosaicTemplate
        this.trMosaics.item.forEach((element) => {
          if ((element.namespaceId === namespaceId) && (element.name === name)) { targetMosaic.item[0] = element }
        })
        this.trMosaics.other.forEach((element) => {
          if ((element.namespaceId === namespaceId) && (element.name === name)) { targetMosaic.item[0] = element }
        })
        console.log('getTargetMosaic', targetMosaic)
        return targetMosaic
      },
      update () {
        let target = this.targetMosaicNamespace
        // 残高計算
        if (this.transactionType === 'nem') {
          // NEM
          let amount = Number(this.senderItem.amount)
          let n = 6 // 下6桁まで残す.
          this.totalAmount = Math.floor(amount * Math.pow(10, n)) / Math.pow(10, n)
          this.remainBalance = this.nemBalance - amount
        } else if (this.transactionType === 'mosaics') {
          // Mosaics
          let targetMosaic = this.getTargetMosaic(target.namespaceId, target.name)
          console.log('targetMosaic', targetMosaic)
          let n = targetMosaic.other[0].divisibility
          this.remainBalance = Math.floor((this.festBalance - this.senderItem.amount) * Math.pow(10, n)) / Math.pow(10, n)
          this.totalAmount = this.senderItem.amount
          console.log('残高計算 totalAmount', this.totalAmount)
        } else if (this.transactionType === 'all') {
          // すべて出金
          if (this.senderItem.mosaics.length > 0) {
            this.senderItem.mosaics.map((element) => {
              let n = element.divisibility
              element.remainBalance = Math.floor((element.amount - element.quantity) * Math.pow(10, n)) / Math.pow(10, n)
              console.log('mosaic.remainBalance', element.amount, element.quantity)
              return element
            })
          }
        }

        // 手数料を計算.
        if ((this.rules.senderAddrLimit(this.senderItem.address) === true) &&
            (this.rules.senderAddrInput(this.senderItem.address) === true)) {
          if (this.transactionType === 'nem') {
            // NEM
            this.fee = nemWrapper.getFeeTransferXem(this.senderItem.address, this.senderItem.amount, this.senderItem.message)
            let n = 6 // 下6桁まで残す.
            this.totalAmount = Math.floor((this.totalAmount + this.fee) * Math.pow(10, n)) / Math.pow(10, n)
            this.remainBalance = Math.floor((this.remainBalance - this.fee) * Math.pow(10, n)) / Math.pow(10, n)
          } else if (this.transactionType === 'mosaics') {
            // モザイク
            let targetMosaic = this.getTargetMosaic(target.namespaceId, target.name)
            targetMosaic.item[0].quantity = this.senderItem.amount
            nemWrapper.getFeeTransferMosaics(this.senderItem.address, targetMosaic.item, this.senderItem.message)
              .then((result) => {
                this.fee = result
                console.log('targetMosaic', this.fee)
              }).catch((err) => {
                console.error(err)
                this.fee = 0
              })
          } else if (this.transactionType === 'all') {
            // XEMとモザイク
            nemWrapper.getFeeTransferMosaics(this.senderItem.address, this.senderItem.mosaics, this.senderItem.message)
              .then((result) => {
                this.fee = result
                // 無限ループに入るためここでは自動計算しない
                // this.updateNemQuantity()
                console.log('allMosaics fee', this.fee)
              }).catch((err) => {
                console.error(err)
                this.fee = 0
              })
          }
        }
      },
      updateNemQuantity () {
        // 手数料分を引く
        this.senderItem.mosaics.map((element) => {
          if ((element.namespaceId === 'nem') && (element.name === 'xem')) {
            let remain = element.amount - (element.quantity + this.fee)
            let n = element.divisibility
            if (remain < 0) {
              element.quantity = Math.floor((element.amount - this.fee) * Math.pow(10, n)) / Math.pow(10, n)
              element.remainBalance = 0
            } else {
              element.quantity = Math.floor((element.quantity) * Math.pow(10, n)) / Math.pow(10, n)
              element.remainBalance = Math.floor((remain) * Math.pow(10, n)) / Math.pow(10, n)
            }
            console.log('element.remainBalance ', element.remainBalance)
          }
          return element
        })
      },
      showDialog (title, message) {
        this.dialogTitle = title
        this.dialogMsg = message
        this.isShowDialog = true
      },
      tapDialogConfirm () {
        this.isShowDialog = false
      },
      clear () {
        this.senderItem.address = ''
        this.senderItem.amount = 0
        this.senderItem.message = ''
        this.fee = 0
      },
      sended (stauts, message) {
        this.$emit('dialog-transfer-transaction-sended', stauts, message)
      },
      close () {
        // this.clear()
        this.$emit('dialog-transfer-transaction-close', 'close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
