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
                <span class="currencyLabel headerlabel" style="margin-left: 0px;">fest</span>
                <span class="amountLabel headerlabel"  style="margin-left: 6px;">{{ festBalance }}</span>
                <span class="currencyLabel headerlabel" style="margin-left: 34px;">xem</span>
                <span class="amountLabel headerlabel"  style="margin-left: 6px;">{{ nemBalance }}</span>
              </v-card-text>
            </v-card>
            <v-flex>
             <qriously v-model="qrValue" :size="240"></qriously>
            </v-flex>
            <v-flex>
              <v-card-text>
                {{ address }}
              </v-card-text>
              <v-btn color="originalBlue"
                class="customBtn white--text"
                v-clipboard:copy="address"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                large block
              >自分のアドレスをコピー</v-btn>
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
      qrValue: ''
    }),
    components: {
    },
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword']),
      ...mapGetters('Nem', ['address', 'pairKey', 'nemBalance', 'festBalance'])
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
        this.reloadItem()
      }
    },
    methods: {
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      reloadItem () {
        this.qrValue = nemWrapper.getJSONInvoiceForQRcode(2, 2, 'nem_fest', this.address, 0, '')
      },
      onCopy (e) {
        this.$toast('コピーしました')
      },
      onError (e) {
        this.$toast('コピーに失敗しました')
      },
      close () {
        this.$emit('dialog-wallet-account-close', 'close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
