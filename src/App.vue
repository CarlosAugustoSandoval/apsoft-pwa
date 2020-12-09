<template>
  <v-app>
    <router-view/>
    <snackbar/>
    <footer-app>
      <alert-install/>
    </footer-app>
  </v-app>
</template>

<script>

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
  data: () => ({
    //
  })
}
</script>

<style>
.v-autocomplete.v-select.v-input--is-focused input{
  min-width: 0px !important;
}
</style>
