<template>
  <v-alert
    tile
    dense
    style="width: 100%"
    class="ma-0"
    dark
    v-model="showInstall"
    dismissible
    color="primary"
    border="left"
    colored-border
    icon="mdi-application-import"
  >
    <a
      class="white--text"
      @click.prevent="install"
    >Instalar en el dispositivo
    </a>
  </v-alert>
</template>

<script>
let installEvent
export default {
  name: 'AlertInstall',
  data: () => ({
    showInstall: false
  }),
  created () {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      installEvent = e
      this.showInstall = true
    })
  },
  methods: {
    install () {
      this.showInstall = false
      installEvent.prompt()
      installEvent.userChoice.then(() => {
        installEvent = null
      })
    }
  }
}
</script>

<style scoped>

</style>
