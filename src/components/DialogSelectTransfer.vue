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
        <v-toolbar-title class="black--text">送金する</v-toolbar-title>
      </v-toolbar>
      <v-container
        fluid
        style="min-height: 0;"
        transition="slide-x-reverse-transition"
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
              <v-btn color="primary" class="btnMedium" large @click="tapSendNem">xemを送る</v-btn>
              <v-btn color="primary" class="btnMedium" large @click="tapSendMosaics">モザイクを送る</v-btn>
              <v-btn color="grey lighten-4" class="btnLarge" large block @click="tapAllTransfer">すべて出金する</v-btn>
            </v-flex>
            <v-btn class="blue--text" flat large block @click="close">ダッシュボードへ戻る</v-btn>
          </v-layout>
        </div>
        </v-card>
      </v-flex>
    </v-container>
  </v-card>
  </v-dialog>
</template>

<script>
  // import nemWrapper from '@/js/nem_wrapper'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data: () => ({
      dialog: false
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
      }
    },
    methods: {
      ...mapActions('Auth', ['doAuth', 'doAuthPassword']),
      tapSendNem () {
        this.$emit('dialog-select-transfer-select', 'nem')
      },
      tapSendMosaics () {
        this.$emit('dialog-select-transfer-select', 'mosaics')
      },
      tapAllTransfer () {
      },
      close () {
        this.$emit('dialog-select-transfer-close', 'close')
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

.btnMedium {
  font-size: 1.0em;
  font-color: white;
  width: 102px;
  height: 102px;
}
</style>
