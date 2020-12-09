<template>
  <v-dialog v-model="dialogMenu" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{on}">
      <v-btn icon large v-on="on" @click.stop="dialogMenu = true" class="mx-1">
        <v-icon>mdi-apps</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="py-2">
        MENÚ
        <v-spacer></v-spacer>
        <v-btn icon @click="dialogMenu = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider/>
      <template v-if="datosEmpresa && itemsMenu && itemsMenu.length">
        <v-card-text
          v-if="datosEmpresa.covid_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'covid').length">
          <v-subheader class="font-weight-bold">COVID-19</v-subheader>
          <cards-list
            :items-menu="itemsMenu.filter(x => x.typeRoute === 'covid')"
            @clickitem="dialogMenu = false"
          ></cards-list>
        </v-card-text>
        <v-card-text v-if="datosEmpresa.aps_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'aps').length">
          <v-subheader class="font-weight-bold">RIESGO CARDIOVASCULAR</v-subheader>
          <cards-list
            :items-menu="itemsMenu.filter(x => x.typeRoute === 'aps')"
            @clickitem="dialogMenu = false"
          ></cards-list>
        </v-card-text>
        <v-card-text
          v-if="datosEmpresa.demanda_inducida_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'demandaInducida').length">
          <v-subheader class="font-weight-bold">DEMANDA INDUCIDA</v-subheader>
          <cards-list
            :items-menu="itemsMenu.filter(x => x.typeRoute === 'demandaInducida')"
            @clickitem="dialogMenu = false"
          ></cards-list>
        </v-card-text>
        <v-card-text v-if="itemsMenu.filter(x => x.typeRoute === 'general').length">
          <v-subheader class="font-weight-bold">GENERAL</v-subheader>
          <cards-list
            :items-menu="itemsMenu.filter(x => x.typeRoute === 'general')"
            @clickitem="dialogMenu = false"
          ></cards-list>
        </v-card-text>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import CardsList from './CardsList'

export default {
  name: 'AppMenu',
  data: () => ({
    dialogMenu: false
  }),
  components: {
    CardsList
  },
  computed: {
    ...mapGetters([
      'itemsMenu',
      'datosEmpresa'
    ])
  }
}
</script>
