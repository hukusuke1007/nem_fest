<template>
  <v-dialog v-model="dialog"
   fullscreen
   hide-overlay
   transition="dialog-bottom-transition"
   scrollable
  >
  <v-card flat class="background">
      <v-toolbar color="blue-grey lighten-5" dark>
        <v-toolbar-title class="black--text">QRコードを読み込む</v-toolbar-title>
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
        <v-card flat class="background">
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
             <qrcode-reader @init="onInit" @decode="onDecode" :paused="pause">
              <div class="decoded-content">{{ content }}</div>
             </qrcode-reader>
            </v-flex>
            <v-btn class="blue--text" flat large block @click="close">キャンセル</v-btn>
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
      pause: true,
      content: ''
    }),
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword']),
      ...mapGetters('Nem', ['nemBalance', 'festBalance'])
    },
    mounted () {
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
        if (val === true) {
          this.pause = false
        } else {
          this.pause = true
        }
      }
    },
    methods: {
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      async onInit (promise) {
        // show loading indicator
        try {
          await promise
          // successfully initialized
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            console.log('user denied camera access permisson')
          } else if (error.name === 'NotFoundError') {
            console.log('no suitable camera device installed')
          } else if (error.name === 'NotSupportedError') {
            console.log('page is not served over HTTPS (or localhost)')
          } else if (error.name === 'NotReadableError') {
            console.log('maybe camera is already in use')
          } else if (error.name === 'OverconstrainedError') {
            console.log('Did you requested the front camera although there is none?')
            // passed constraints don't match any camera. Did you requested the front camera although there is none?
          } else {
            console.log('browser is probably lacking features (WebRTC, Canvas)')
            // browser is probably lacking features (WebRTC, Canvas)
          }
        } finally {
          console.log('hide loading indicator')
          // hide loading indicator
        }
      },
      onDecode (content) {
        console.log(content)
        if (content !== '') {
          let json = nemWrapper.getJsonQRcode(content)
          if (!json) {
            this.content = '不正なQRコードです'
            console.log('qr_reader error')
          } else {
            this.content = ''
            this.$emit('dialog-qr-reader-scan', json)
            // this.paused = true
          }
        } else {
          console.log('QR読み込みエラー')
        }
      },
      close () {
        this.$emit('dialog-qr-reader-close', 'close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
