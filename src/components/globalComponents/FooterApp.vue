<template>
  <v-footer app class="footerpart pa-0 justify-center" inset>
    <slot></slot>
<!--    <v-col cols="12" class="py-1">-->
<!--      <slot tag="v-col" cols="12" class="py-1"></slot>-->
<!--&lt;!&ndash;      <span class="caption">© {{ new Date().getFullYear() }} — <strong>APSPOFT</strong> por <a>APSPOFT</a></span>&ndash;&gt;-->
<!--    </v-col>-->
    <v-alert
      v-if="!isOnline"
      width="100%"
      dark
      tile
      class="my-0 py-0 text-center"
      dense
      color="error"
    >
      <v-icon color="white">mdi-cloud-off-outline</v-icon>
      Sin conexión a Internet
    </v-alert>
  </v-footer>
</template>
<script>
export default {
  name: 'Footer',
  data: () => ({})
}
</script>
<style lang="scss">
.v-application .footerpart {
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.theme--light.v-footer {
  background: white;
}
</style>
