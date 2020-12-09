import Vue from 'vue'
import { mapGetters } from 'vuex'

Vue.mixin({
  data: () => ({
    esMovil: false
  }),
  computed: {
    ...mapGetters(['darkMode', 'user', 'themeColor', 'themeColors', 'goBack'])
  },
  watch: {
    '$vuetify.breakpoint.name': {
      handler (val) {
        val && (this.esMovil = !!(navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/BlackBerry/i)))
      },
      immediate: true
    }
  },
  methods: {
    clone (object) {
      return JSON.parse(JSON.stringify(object))
    },
    calculaEdad (fechaNacimiento) {
      if (fechaNacimiento && this.moment(fechaNacimiento).isValid()) {
        const a = this.moment()
        const b = this.moment(fechaNacimiento)
        const years = a.diff(b, 'year')
        b.add(years, 'years')

        const months = a.diff(b, 'months')
        b.add(months, 'months')

        const days = a.diff(b, 'days')
        b.add(days, 'days')
        let stringDate = ''
        stringDate = stringDate + (years ? `${years} año${years === 1 ? '' : 's'}` : '')
        stringDate = stringDate + (months ? ` ${months} mes${months === 1 ? '' : 'es'}` : '')
        stringDate = stringDate + (years || months ? days ? ` ${days} d${days === 1 ? 'ía' : 'ias'}` : '' : `${days} d${days === 1 ? 'ía' : 'ias'}`)
        return {
          stringDate: stringDate,
          years: years,
          months: months,
          days: days
        }
      } else {
        return {
          stringDate: '',
          years: null,
          months: null,
          days: null
        }
      }
    }
  }
})
