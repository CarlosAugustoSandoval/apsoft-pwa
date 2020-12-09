<template>
  <v-btn icon class="ml-1" @click.stop="setCustomizerDrawer(!Customizer_drawer)">
    <v-icon large>mdi-account-circle</v-icon>
  </v-btn>
</template>
<script>
// Utilities
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'UserMenu',
  data: () => ({}),
  computed: {
    ...mapState(['Customizer_drawer'])
  },
  methods: {
    ...mapMutations({
      setCustomizerDrawer: 'SET_CUSTOMIZER_DRAWER'
    })
  }
}
</script>

<style lang="scss">

</style>
