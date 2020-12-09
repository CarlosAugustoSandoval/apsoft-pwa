<template>
  <v-app>
    <Header/>
    <v-main>
      <v-container fluid class="page-wrapper">
        <router-view/>
      </v-container>
    </v-main>
    <customizer/>
  </v-app>
</template>

<script>
import Header from './header/Header'
import Customizer from '@/modules/userDrawer/components/Customizer'
export default {
  name: 'Layout',
  components: {
    Header,
    Customizer
  }
}
</script>

<style>

</style>
