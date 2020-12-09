<template>
  <v-container fluid>
    <v-card flat :color="`${darkMode ? 'grey lighten-3' : ''}`" class="mb-2 pa-2">
      <v-row justify="center" align="center">
        <img alt="LOGO-APSOFT" src="@/assets/logoapsoft.png">
        <img alt="LOGO-SOSALUD" src="@/assets/logososalud.png">
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  created () {
    this.$store.commit('SET_GOBACK')
  }
}
</script>
