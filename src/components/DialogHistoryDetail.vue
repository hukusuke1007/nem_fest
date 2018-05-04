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
        <v-toolbar-title class="black--text">トランザクション履歴</v-toolbar-title>
      </v-toolbar>
      <v-container
        fluid
        style="min-height: 0;"
        transition="slide-x-reverse-transition"
        grid-list-lg
        >
        <v-list two-line>
        </v-list>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
  // import dbWrapper from '@/js/local_database_wrapper'
  // import nemWrapper from '@/js/nem_wrapper'
  import { mapGetters } from 'vuex'
  export default {
    data: () => ({
      dialog: false
    }),
    components: {
    },
    computed: {
      ...mapGetters('Auth', ['isAuth', 'authPassword']),
      ...mapGetters('Nem', ['address', 'nemBalance', 'festBalance'])
    },
    mounted () {
      this.reloadItem()
    },
    props: {
      dialogVal: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default: {}
      }
    },
    watch: {
      dialogVal (val) {
        this.dialog = val
      }
    },
    methods: {
      reloadItem () {
      },
      close () {
        this.$emit('dialog-history-detail-close', 'close')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.example1 { color: #ff0000; }
.example2 { color: #008000; }
</style>
