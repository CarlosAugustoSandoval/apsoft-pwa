<template>
  <div>
    <v-list class="py-0" v-if="domicilio">
      <v-subheader>Información del domicilio</v-subheader>
      <v-list-item class="px-0">
        <v-list-item-avatar class="mr-1" color="purple">
          <v-icon dark>
            mdi-home-map-marker
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="px-0">
          <p class="ma-0">{{ [domicilio.nombreMunicipio, domicilio.nombreDepartamento].filter(x => x).join(', ') }}</p>
          <p class="ma-0">
            {{ domicilio.nombreBarrio }}
          </p>
          <v-list-item-subtitle v-if="domicilio.coordenadas">{{ domicilio.coordenadas }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider/>
      <v-subheader>Visitas</v-subheader>
      <template v-for="(visita, indexVisita) in visitas">
        <v-list-item class="px-0" :key="`Domicilio${indexVisita}`">
          <v-list-item-content class="px-0 pb-1">
            <v-list-item-title class="red--text" v-if="visita.tipificacion">{{ visita.tipificacion }}</v-list-item-title>
            <v-list-item-title class="green--text" v-else>Visita Efectiva</v-list-item-title>
            <v-list-item-title>{{ visita.fecha ? moment(visita.fecha).format('DD/MM/YYYY HH:mm') : '' }}</v-list-item-title>
            <v-list-item-title>{{ visita.usuario }}</v-list-item-title>
            <p class="ma-0">{{ visita.observacion }}</p>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="indexVisita !== (visitas.length - 1)" :key="`DividerDomicilio${indexVisita}`"/>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'Detalle',
  props: {
    domicilio: {
      type: Object,
      default: null
    }
  },
  data: () => ({
  }),
  computed: {
    visitas () {
      return (this && this.domicilio && this.domicilio.observaciones && Array.isArray(JSON.parse(this.domicilio.observaciones)) && JSON.parse(this.domicilio.observaciones)) || []
    }
  }
}
</script>

<style scoped>

</style>
