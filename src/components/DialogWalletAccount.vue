<template>
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="slide-x-reverse-transition"
   scrollable
  >
  <v-card flat>
      <v-toolbar color="blue-grey lighten-5" dark>
        <v-btn icon @click.native="close()" dark>
          <v-icon color="primary">arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title class="black--text">受け取る</v-toolbar-title>
      </v-toolbar>
      <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
        >
      <v-flex xs12 sm6 offset-sm3>
        <v-card flat>
        <div class="w-break sideOffset">
          <v-layout row wrap column>
            <v-card>
              <v-card-text>
                <span style="margin-left: 0px;">xem</span>
                <span style="margin-left: 4px;">{{ nemBalance }}</span>
                <span style="margin-left: 30px;">fest</span>
                <span style="margin-left: 4px;">{{ festBalance }}</span>
              </v-card-text>
            </v-card>
            <v-flex>
             <qriously v-model="qrValue" :size="240"></qriously>
            </v-flex>
            <v-flex>
              <v-card-text>
                {{ address }}
              </v-card-text>
              <v-btn color="primary" class="btnLarge" large block @click="tapCopy">自分のアドレスへコピー</v-btn>
            </v-flex>
            <v-btn class="blue--text" flat large block @click="close">ダッシュボードへ</v-btn>
          </v-layout>
        </div>
        </v-card>
      </v-flex>
    </v-container>
  </v-card>
  </v-dialog>
</template>

<script>
  import nemWrapper from '@/js/nem_wrapper'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data: () => ({
      dialog: false,
      address: '',
      qrValue: ''
    }),
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword'])
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      walletItem: {
        type: Object,
        default: null
      },
      nemBalance: {
        type: Number,
        default: 0
      },
      festBalance: {
        type: Number,
        default: 0
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
      },
      walletItem (val) {
        this.reloadItem()
      }
    },
    methods: {
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      reloadItem () {
        if (this.walletItem !== null) {
          this.address = this.walletItem.account.address.value
          this.qrValue = nemWrapper.getJSONInvoiceForQRcode(2, 1, 'nem_fest', this.address, 0, '')
        }
      },
      tapCopy () {
        this.copyText(this.address)
        this.showToast()
      },
      copyText (text) {
        let ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.parentElement.removeChild(ta)
      },
      showToast () {
        let toastMsg = 'コピーしました。'
        this.$toast(toastMsg)
        /*
        this.$toasted.show(toastMsg, {
          theme: 'outline',
          position: 'bottom-center',
          icon: 'assignment',
          fitToScreen: true,
          duration: 2000
        })
        */
      },
      close () {
        this.$emit('dialog-wallet-account-close', 'close')
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
