<template>
  <div>
    <title-bar title="Ubicación de Domicilio" />
    <div id="map" />
    <loading v-model="loading"></loading>
  </div>
</template>

<script>
export default {
  name: 'DetalleDomicilioMapa',
  props: {
    idd: {
      type: [Number, String],
      default: null
    }
  },
  data: () => ({
    loading: false,
    domicilio: null,
    googleMaps: null,
    map: null,
    datos: [],
    markers: []
  }),
  created () {
    this.$store.commit('SET_GOBACK', { name: 'DomicilioSinEncuesta' })
  },
  mounted () {
    /* eslint-disable */
    this.googleMaps = google.maps
    this.getDomicilio()
  },
  methods: {
    async getDomicilio () {
      this.loading = true
      this.$store.dispatch('obtenerDomicilio', this.idd).then(domicilio => {
        if (domicilio) {
          this.domicilio = domicilio
          const latLng = this.latLng()
          this.map = new this.googleMaps.Map(document.getElementById('map'), {
            zoom: 15,
            center: latLng
          })
          const marker = new this.googleMaps.Marker({
            position: latLng,
            map: this.map,
            title: this.domicilio.direccion || 'No reporta'
          })
          const infowindow = new this.googleMaps.InfoWindow({
            content: ''
          })
          marker.addListener('click', () => {
            infowindow.setContent(this.textInfoWindow(this.domicilio))
            infowindow.open(this.map, marker)
          })
        }
        this.loading = false
      })
    },
    latLng () {
      let ll = this.domicilio.coordenadas.replace(/ /g, '').split(',')
      return {lat: Number(ll[0]), lng: Number(ll[1])}
    },
    textInfoWindow(domicilio) {
      return `
				<div id="content">
					<div id="bodyContent">
						<p>
							<b>
							<i class="mdi mdi-sign-direction font-weight-bold orange--text"></i>
								${domicilio.direccion || 'No registra dirección'}
							</b>
						</p>
						<p>
							<b>
								${[domicilio.nombreBarrio, domicilio.nombreMunicipio, domicilio.nombreDepartamento].filter(x => x).join(', ')}
							</b>
						</p>
					</div>
				</div>`
    }
  }
}
</script>

<style lang="scss" scoped>
#map {
  width: 100% !important;
  height: 460px !important;
}
</style>
