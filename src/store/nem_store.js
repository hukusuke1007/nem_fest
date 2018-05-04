import nemWrapper from '@/js/nem_wrapper'

// テスト用にLCNEMを採用
const MOSAIC_FEST = { namespaceId: 'lc', name: 'jpy' }

export default {
  namespaced: true,
  state: {
    walletItem: null,
    address: '',
    pairKey: {},
    nemBalance: 0,
    festBalance: 0,
    mosaics: [],
    transaction: [],
    targetMosaicNamespace: MOSAIC_FEST
  },
  getters: {
    walletItem: state => state.walletItem,
    address: state => state.address,
    pairKey: state => state.pairKey,
    nemBalance: state => state.nemBalance,
    festBalance: state => state.festBalance,
    festMosaic: state => state.festMosaic,
    mosaics: state => state.mosaics,
    transaction: state => state.transaction,
    targetMosaicNamespace: state => state.targetMosaicNamespace
  },
  mutations: {
    setWalletItem (state, value) {
      console.log('setWalletItem: ' + value)
      state.walletItem = value
    },
    setAddress (state, value) {
      console.log('setAddress: ' + value)
      state.address = value
    },
    setPairKey (state, value) {
      console.log('setPairKey: ' + value)
      state.pairKey = value
    },
    setNemBalance (state, value) {
      console.log('setNemBalance: ' + value)
      state.nemBalance = value
    },
    setFestBalance (state, value) {
      console.log('setFestBalance: ' + value)
      state.festBalance = value
    },
    setMosaics (state, value) {
      console.log('setMosaics:')
      console.log(value)
      state.mosaics = value
    },
    setTransactions (state, value) {
      console.log('setTransactions:')
      console.log(value)
      state.transaction = value
    },
    setTargetMosaicNamespace (state, value) {
      console.log('setTargetMosaicNamespace:')
      console.log(value)
      state.targetMosaicNamespace = value
    }
  },
  actions: {
    doUpdateNemBalance ({ commit, getters }) {
      if ('publicKey' in getters.pairKey) {
        nemWrapper.getAccountFromPublicKey(getters.pairKey.publicKey)
          .then((result) => {
            let value = result.balance.balance / nemWrapper.NEM_UNIT
            commit('setNemBalance', value)
          }).catch((err) => {
            console.log(err)
          })
      } else {
        console.log('nothing publicKey')
      }
    },
    doUpdateMosaicsBalance ({ commit, getters }) {
      console.log('doUpdateMosaicsBalance')
      let mosaics = []
      if (getters.address.length > 0) {
        nemWrapper.getMosaics(getters.address)
          .then((result) => {
            console.log('get Mosaics')
            result.forEach((element) => {
              let mosaic = {}
              mosaic.text = element.mosaicId.namespaceId + ':' + element.mosaicId.name
              mosaic.namespaceId = element.mosaicId.namespaceId
              mosaic.name = element.mosaicId.name
              mosaic.amount = element.amount
              mosaic.divisibility = element.properties.divisibility
              mosaic.initialSupply = element.properties.initialSupply
              mosaic.supplyMutable = element.properties.supplyMutable
              mosaic.transferable = element.properties.transferable
              mosaics.push(mosaic)

              if ((mosaic.namespaceId === MOSAIC_FEST.namespaceId) && (mosaic.name === MOSAIC_FEST.name)) {
                commit('setFestBalance', mosaic.amount)
              }
            })
            commit('setMosaics', mosaics)
          }).catch((err) => {
            console.log('get_mosaic_error: ' + err)
          })
      } else {
        console.log('nothing address')
      }
    },
    doUpdateTransaction ({ commit, getters }) {
      let address = getters.address
      let transaction = []
      nemWrapper.getTransaction(address, 100, undefined, undefined)
        .then((allResult) => {
          transaction = allResult
          return nemWrapper.getUnconfirmedTransaction(address)
        }).then((unResult) => {
          console.log('getUnconfirmedTransaction')
          console.log(unResult)
          transaction = unResult.concat(transaction)
          commit('setTransactions', transaction)
        }).catch((err) => {
          console.error(err)
        })
    },
    doClearAll ({ commit, getters }) {
      commit('setWalletItem', null)
      commit('setAddress', '')
      commit('setPairKey', {})
      commit('setNemBalance', 0)
      commit('setFestBalance', 0)
      commit('setMosaics', [])
    },
    doWalletItem ({ commit, getters }, value) {
      commit('setWalletItem', value)
    },
    doAddress ({ commit, getters }, value) {
      commit('setAddress', value)
    },
    doPairKey ({ commit, getters }, value) {
      commit('setPairKey', value)
    },
    doNemBalance ({ commit, getters }, value) {
      commit('setNemBalance', value)
    },
    doFestBalance ({ commit, getters }, value) {
      commit('setFestBalance', value)
    },
    doMosaics ({ commit, getters }, value) {
      commit('setMosaics', value)
    },
    doTargetMosaicNamespace ({ commit, getters }, value) {
      commit('setTargetMosaicNamespace', value)
    }
  }
}
