<template>
  <v-app>
    <router-view/>
    <v-snackbar
      v-model="showVersion"
      :timeout="-1"
      color="warning"
      top
      content-class="text-center"
    >
      Hay actualizaciones pendientes, por favor cierre y abra nuevamente a la aplicación.
    </v-snackbar>
    <snackbar/>
    <footer-app>
      <alert-install/>
    </footer-app>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  watch: {
    themeColor: {
      handler (color) {
        this.$vuetify.theme.themes[this.isDark ? 'dark' : 'light'].primary = color
        this.$vuetify.theme.themes[this.isLight ? 'light' : 'dark'].primary = color
      },
      immediate: true
    },
    darkMode: {
      handler (mode) {
        this.$vuetify.theme.dark = mode
      },
      immediate: true
    }
  },
  computed: {
    showVersion () {
      return this && this.alertChange
    },
    ...mapGetters([
      'alertChange'
    ])
  }
}
</script>

<style>
.v-autocomplete.v-select.v-input--is-focused input{
  min-width: 0px !important;
}
</style>
