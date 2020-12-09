<template>
  <div>
    <title-bar title="Complementos"/>
    <v-row no-gutters>
      <v-col
        cols="12"
      >
        <v-list class="py-0 elevation-1">
          <v-list-item>
            <v-list-item-avatar size="50" color="blue">
              <v-icon size="30" color="white">mdi-table-cog</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title><span class="text-truncate">Generales</span></v-list-item-title>
              <v-list-item-subtitle class="caption text-truncate">Descarga todos los registros básicos de gestión</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :disabled="!isOnline"
                small
                fab
                color="primary"
                @click.stop="descargarGenerales"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider/>
          <v-list-item>
            <v-list-item-avatar size="50" color="yellow darken-2">
              <v-icon size="30" color="white">mdi-account-group</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title><span class="text-truncate">Afiliados</span></v-list-item-title>
              <v-list-item-subtitle class="caption text-truncate">Descarga todos los registros de afiliados registrados por la EPS</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :disabled="!isOnline"
                small
                fab
                color="primary"
                @click.stop="descargarAfiliados"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider/>
          <template v-if="departamentos && departamentos.length">
            <v-list-item>
              <v-list-item-avatar size="50" color="green">
                <v-icon size="30" color="white">mdi-map-marker-plus</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title><span class="text-truncate">Barrios</span></v-list-item-title>
                <v-list-item-subtitle class="caption text-truncate">Configuración y Descarga de barrios</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <configuracion-barrios/>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
      <loading v-model="loading"></loading>
    </v-row>
    <footer-app />
  </div>
</template>

<script>
import ConfiguracionBarrios from '@/modules/complementos/components/ConfiguracionBarrios'
import { mapGetters } from 'vuex'
export default {
  name: 'Complementos',
  components: {
    ConfiguracionBarrios
  },
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapGetters([
      'departamentos'
    ])
  },
  created () {
    this.$store.commit('SET_GOBACK')
    this.$store.commit('SET_ASSIGN_DB_COMPLEMENTOS')
  },
  methods: {
    descargarAfiliados () {
      this.loading = true
      this.$store.dispatch('descargasAfiliados')
        .then(() => {
          this.loading = false
        })
    },
    descargarGenerales () {
      this.loading = true
      this.$store.dispatch('descargasGenerales')
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
