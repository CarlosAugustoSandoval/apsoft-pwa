<template>
  <div>
    <title-bar title="Sincronizadores"/>
    <v-row no-gutters>
      <v-col
        cols="12"
      >
        <v-list class="py-0">
          <v-list-item class="px-1" v-if="datosEmpresa.covid_activo === '1'">
            <v-list-item-avatar size="50" color="error">
              <v-icon size="30" color="white">mdi-clipboard-plus-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title><span class="text-truncate">ERP</span></v-list-item-title>
              <v-list-item-subtitle class="caption text-truncate">Encuestas de Riesgo Poblacional</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :disabled="!isOnline"
                small
                fab
                color="primary"
                @click.stop="sincronizarERPS"
              >
                <v-icon>mdi-sync</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider/>
          <v-list-item class="px-1" v-if="datosEmpresa.covid_activo === '1'">
            <v-list-item-avatar size="50" color="purple">
              <v-icon size="30" color="white">mdi-home-alert</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title><span class="text-truncate">Domicilios sin Encuesta</span></v-list-item-title>
              <v-list-item-subtitle class="caption text-truncate">Domicilios donde no se realizarón ERP</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :disabled="!isOnline"
                small
                fab
                color="primary"
                @click.stop="sincronizarDomicilios"
              >
                <v-icon>mdi-sync</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider/>
        </v-list>
      </v-col>
    </v-row>
    <footer-app />
    <loading v-model="loading"></loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Sincronizadores',
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapGetters([
      'datosEmpresa'
    ])
  },
  created () {
    this.$store.commit('SET_GOBACK')
  },
  methods: {
    sincronizarERPS () {
      this.loading = true
      this.$store.dispatch('sincronizarERPS')
        .then(() => {
          this.loading = false
        })
    },
    sincronizarDomicilios () {
      this.loading = true
      this.$store.dispatch('sincronizarDomicilios')
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
