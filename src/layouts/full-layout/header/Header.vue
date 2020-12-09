<template>
  <v-app-bar app color="primary" dark>
    <v-btn
      v-if="goBack"
      depressed
      icon
      large
      @click="$router.push(goBack)"
    >
      <v-icon dark>mdi-arrow-left-bold</v-icon>
    </v-btn>
    <app-menu/>
    <v-list-item class="pa-0" style="max-width: 120px !important;">
      <v-list-item-content>
        <v-list-item-title>APSOFT</v-list-item-title>
        <v-list-item-subtitle class="caption text-truncate">{{ datosEmpresa.nombre_eps }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-spacer/>
    <user/>
  </v-app-bar>
</template>

<script>
import User from '@/layouts/full-layout/header/components/User'
import AppMenu from '@/modules/menu/components/AppMenu'
import store from '../../../store'
import { mapGetters } from 'vuex'
export default {
  name: 'Header',
  components: {
    User,
    AppMenu
  },
  computed: {
    ...mapGetters([
      'datosEmpresa'
    ])
  },
  mounted () {
    if (this.isOnline) {
      store.dispatch('getDatosEmpresa')
      store.dispatch('getUser')
    }
  },
  data: () => ({
    showLogo: true
  })
}
</script>

<style lang="scss">
.v-application #main-sidebar.theme--dark.white {
  background: #363636 !important;
}
</style>
