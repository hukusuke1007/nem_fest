<template>
  <v-flex xs12 sm6 offset-sm3>
  <v-card>
    <v-list two-line>
      <div v-if="isAuth">
        <template v-for="(item, index) in items">
          <v-list-tile ripple :key="index" @click="tapItem(index)">
            <v-list-tile-content v-show="item.type === `TransferTransaction`">
              <v-list-tile-title><div :class="item.depositId">{{ item.deposit }}</div></v-list-tile-title>
              <v-list-tile-sub-title>{{ item.recipientAddr }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>送金量: {{ item.amount }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>{{ item.timeStamp }}</v-list-tile-action-text>
              <v-list-tile-action-text><div :class="item.statusId">{{ item.status }}</div></v-list-tile-action-text>
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
      ...mapGetters('Nem', ['address', 'nemBalance', 'festBalance', 'transaction'])
    },
    mounted () {
      this.doTitle('履歴')
      this.reloadItem()
    },
    props: {
    },
    watch: {
      address (val) {
        if (val) {
          // this.setTransactionListener()
        }
      },
      transaction (val) {
        this.setItemsForTransaction(val)
      }
    },
    methods: {
      ...mapActions('Auth', ['doAuth']),
      ...mapActions('Top', ['doTitle']),
      ...mapActions('Nem', ['doAddress', 'doUpdateTransaction']),
      reloadItem () {
        // this.doAuth(true) // 削除予定(テスト用)
        // this.doAddress('NCQVG5KPMB6VHOBSHRUM2D3ZENL4F4Z6MVUNTFS3') // 削除予定(テスト用)
        this.doUpdateTransaction()
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
            let depositMsgColor = 'recieve'
            if (element.signer.address.value === this.address) {
              depositMsg = '出金'
              depositMsgColor = 'send'
            }
            let amount = element._xem.amount
            let confirmMsg = '承認'
            let confirmMsgColor = 'confirm'
            let hash = ''
            if (element.transactionInfo == null) {
              confirmMsg = '未承認'
              confirmMsgColor = 'unConfirm'
              amount = '承認中...'
            } else {
              hash = element.transactionInfo.hash.data
            }

            let item = {
              type: 'TransferTransaction',
              message: convMessage,
              fee: feeVal,
              recipientAddr: element.recipient.value,
              senderAddr: element.signer.address.value,
              timeStamp: dateString,
              hash: hash,
              name: nameVal,
              namespace: namespaceVal,
              amount: amount,
              mosaics: element._mosaics,
              mosaicsAddInfos: [],
              deposit: depositMsg,
              depositId: depositMsgColor,
              status: confirmMsg,
              statusId: confirmMsgColor
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
                    // console.log(result)
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
        this.isShowHistoryDetail = true
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
.send { color: #ff0000; }
.recieve { color: #008000; }
.confirm { color: #00b894; font-weight: bold;}
.unConfirm { color: #fdcb6e; font-weight: bold;}
</style>
