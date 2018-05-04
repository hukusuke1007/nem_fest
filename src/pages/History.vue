<template>
  <v-flex xs12 sm6 offset-sm3>
  <v-card>
    <v-list two-line>
      <div v-if="isAuth">
        <template v-for="(item, index) in items">

          <v-list-tile ripple :key="index" @click="tapItem(index)">
            <v-list-tile-content v-show="item.type === `TransferTransaction`">
              <v-list-tile-title>通貨: {{ item.namespace }}:{{ item.name }}</v-list-tile-title>
              <!-- <v-list-tile-sub-title>受取先: {{ item.recipientAddr }}</v-list-tile-sub-title> -->
              <div v-if="!item.mosaics || item.mosaics.length === 0">
                <v-list-tile-sub-title>送金量: {{ item.amount }}</v-list-tile-sub-title>
              </div>
              <div v-else>
                <v-list-tile-sub-title><font color="blue">モザイクはタップして確認</font></v-list-tile-sub-title>
              </div>
              <v-list-tile-sub-title>メッセージ: {{ item.message }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>{{ item.timeStamp }}</v-list-tile-action-text>
              <v-list-tile-action-text><div :class="item.depositColor">{{ item.deposit }}</div></v-list-tile-action-text>
              <v-list-tile-action-text>手数料: {{ item.fee }}</v-list-tile-action-text>
              <!-- <v-icon color="grey lighten-1">keyboard_arrow_right</v-icon> -->
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
        </template>
      </div>
    </v-list>

    <!-- ダイアログ -->
    <DialogConfirm v-bind:dialogVal="isShowDialog"
                   v-bind:titleVal="dialogtitle"
                   v-bind:messageVal="dialogMessage"
                   v-on:dialog-confirm-event-tap-positive="tapPositive"></DialogConfirm>

    <!-- 履歴詳細ダイアログ -->
    <DialogHistoryDetail v-bind:dialogVal="isShowHistoryDetail"
                   v-bind:item="selectItem"
                   v-on:dialog-history-detail-close="tapHistoryDetailClose"></DialogHistoryDetail>
  </v-card>
  </v-flex>
</template>

<script>
  // import dbWrapper from '@/js/local_database_wrapper'
  import nemWrapper from '@/js/nem_wrapper'
  import DialogConfirm from '@/components/DialogConfirm'
  import DialogHistoryDetail from '@/components/DialogHistoryDetail'
  import {TransferTransaction, MultisigTransaction} from 'nem-library'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'history',
    data: () => ({
      // header: '送金履歴一覧 (最大100件)',
      dialogtitle: '',
      isShowDialog: false,
      isShowHistoryDetail: false,
      dialogMessage: '',
      selectItem: {},
      items: []
    }),
    components: {
      DialogConfirm,
      DialogHistoryDetail
    },
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword']),
      ...mapGetters('Nem', ['address', 'nemBalance', 'festBalance'])
    },
    mounted () {
      this.doTitle('トランザクション履歴')
      this.reloadItem()
    },
    props: {
    },
    watch: {
      address (val) {
        if (val) {
          // this.setTransactionListener()
        }
      }
    },
    methods: {
      ...mapActions('Top', ['doTitle']),
      reloadItem () {
        this.items = []
        nemWrapper.getTransaction(this.address, 100, undefined, undefined)
          .then((result) => {
            console.log(result)
            this.setItemsForTransaction(result)
          }).catch((err) => {
            console.error(err)
          })
      },
      setItemsForTransaction (transactions) {
        transactions.forEach((element, index) => {
          // console.log(element)
          if (element instanceof TransferTransaction) {
            let convMessage = nemWrapper.getMessageFromPlain(element.message.payload)
            let dateString = element.timeWindow.timeStamp.toString().replace('T', ' ')
            let feeVal = element.fee / nemWrapper.NEM_UNIT
            let nameVal = element._xem.mosaicId.name
            let namespaceVal = element._xem.mosaicId.namespaceId
            let depositMsg = '入金'
            let depositMsgColor = 'example2'
            if (element.signer.address.value === this.address) {
              depositMsg = '出金'
              depositMsgColor = 'example1'
            }
            let item = {
              type: 'TransferTransaction',
              message: convMessage,
              fee: feeVal,
              recipientAddr: element.recipient.value,
              senderAddr: element.signer.address.value,
              timeStamp: dateString,
              hash: element.transactionInfo.hash.data,
              name: nameVal,
              namespace: namespaceVal,
              amount: element._xem.amount,
              mosaics: element._mosaics,
              mosaicsAddInfos: [],
              deposit: depositMsg,
              depositColor: depositMsgColor
            }
            this.items.push(item)
          } else if (element instanceof MultisigTransaction) {
            /*
            console.log(element)
            let item = {
              type: 'MultisigTransaction'
              message: element.message.payload,
              fee: element.fee,
              recipientAddr: element.recipient.value,
              senderAddr: element.signer.address.value,
              timeStamp: element.timeStamp,
              hash: element.transactionInfo.hash.data,
              mosaics: element._mosaics,
              xemAmount: element._xem.amount
            }
            this.items.push(item)
            */
          }
        })
        // モザイク送金履歴を確認.
        this.items.map((element, index, array) => {
          if (element.mosaics && element.mosaics.length > 0) {
            // console.log('mosaics_item: ' + element.timeStamp)
            element.mosaics.forEach((mosaic) => {
              // console.log(mosaic)
              if ((mosaic.mosaicId.name !== 'xem') && (mosaic.mosaicId.namespaceId !== 'nem')) {
                nemWrapper.getMosaicDefinition(mosaic.mosaicId)
                  .then((result) => {
                    console.log(result)
                    let mosaicsAddInfo = {
                      name: result.id.name,
                      namespaceId: result.id.namespaceId,
                      quantity: mosaic.quantity,
                      divisibility: result.properties.divisibility
                    }
                    element.mosaicsAddInfos.push(mosaicsAddInfo)
                    array[index] = element
                  }).catch((error) => {
                    console.error(error)
                    array[index] = element
                  })
              } else {
                let mosaicsAddInfo = {
                  name: 'xem',
                  namespaceId: 'nem',
                  quantity: mosaic.quantity,
                  divisibility: 6
                }
                element.mosaicsAddInfos.push(mosaicsAddInfo)
                array[index] = element
              }
            })
          } else {
            array[index] = element
          }
        })
        // this.header = '送金履歴一覧 (' + this.items.length + '件）'
      },
      setTransactionListener () {
        // 未承認トランザクション
        nemWrapper.getUncofirmedTransactionListener(this.address)
          .then((result) => {
            console.log('getUncofirmedTransactionListener OK')
            console.log(result)
          }).catch((err) => {
            console.log('getUncofirmedTransactionListener ERROR')
            console.error(err)
          })

        // 承認トランザクション
        nemWrapper.getCofirmedTransactionListener(this.address)
          .then((result) => {
            console.log('getCofirmedTransactionListener OK')
            console.log(result)
          }).catch((err) => {
            console.log('getCofirmedTransactionListener ERROR')
            console.error(err)
          })
      },
      tapItem (index) {
        this.selectItem = this.items[index]
        console.log(this.selectItem)
        /*
        this.dialogtitle = item.timeStamp
        if (item.mosaicsAddInfos.length > 0) {
          let mosaicMessage = '【モザイク】<br><br>'
          item.mosaicsAddInfos.forEach((element) => {
            let amount = element.quantity
            if (element.divisibility > 0) {
              amount = element.quantity / Math.pow(10, element.divisibility)
            }
            mosaicMessage += '[' + element.namespaceId + ':' + element.name + ']' + '<br>' +
                     '送金量:<br>' + amount + ' ' + element.name + '<br><br>'
          })
          this.dialogMessage = mosaicMessage +
                     '手数量:<br>' + item.fee + ' xem<br><br>' +
                     '送金先:<br>「' + item.senderAddr + '」から<br>' + '「' + item.recipientAddr + '」へ<br><br>' +
                     'ハッシュ:<br>' + item.hash + '<br><br>' +
                     'メッセージ:<br>' + item.message
        } else {
          this.dialogMessage = '送金量:<br>' + item.amount + ' ' + item.name + '<br><br>' +
                     '手数量:<br>' + item.fee + ' xem<br><br>' +
                     '送金先:<br>「' + item.senderAddr + '」から<br>' + '「' + item.recipientAddr + '」へ<br><br>' +
                     'ハッシュ:<br>' + item.hash + '<br><br>' +
                     'メッセージ:<br>' + item.message
        }
        */
        // this.isShowDialog = true
        this.isShowHistoryDetail = true
      },
      tapPositive (message) {
        this.isShowDialog = false
      },
      tapHistoryDetailClose (message) {
        this.isShowHistoryDetail = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.example1 { color: #ff0000; }
.example2 { color: #008000; }
</style>
