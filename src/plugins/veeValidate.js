/* eslint-disable camelcase */
import Vue from 'vue'
import moment from 'moment'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email, required_if, numeric, is_not, confirmed } from 'vee-validate/dist/rules'

Vue.use({
  install (Vue) {
    Vue.component('ValidationProvider', ValidationProvider)
    Vue.component('ValidationObserver', ValidationObserver)
  }
})

extend('required', {
  ...required,
  message: 'El campo {_field_} es requerido'
})

extend('is_not', {
  ...is_not,
  message: 'El campo {_field_} no es válido'
})

extend('confirmed', {
  ...confirmed,
  message: 'El campo {_field_} no coincide con el campo a confirmar'
})

extend('minlength', {
  params: ['length'],
  validate (value, { length }) {
    return String(value).length >= length
  },
  message: 'El campo {_field_} debe tener como mínimo {length} caracteres'
})

extend('numeric', {
  ...numeric,
  message: 'El campo {_field_} debe ser un número'
})

extend('email', {
  ...email,
  message: 'El correo no es valido'
})

extend('required_if', {
  ...required_if,
  message: 'El campo {_field_} es requerido'
})

extend('integridadSQL', {
  validate (value) {
    if ((value !== null) && (typeof value !== 'undefined') && (value !== '')) {
      const expression = /(DELETE |CREATE |ALTER |DROP |RENAME |TRUNCATE |CALL |IMPORT |INSERT |REPLACE |LOAD |UPDATE |GRANT)/i
      return !expression.test(value)
    }
  },
  message: 'La consulta no está permitida'
})

extend('min', {
  params: ['minimo'],
  validate (value, { minimo }) {
    return Number(value) >= minimo
  },
  message: 'El campo {_field_} debe ser mayor o igual a {minimo}'
})

extend('mindate', {
  params: ['minimo'],
  validate (value, { minimo }) {
    const newValue = Vue.prototype.moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
    const newMinimo = Vue.prototype.moment(minimo, 'DD/MM/YYYY').format('YYYY-MM-DD')
    return Vue.prototype.moment(newValue).valueOf() >= Vue.prototype.moment(newMinimo).valueOf()
  },
  message: 'El campo {_field_} debe ser mayor o igual a {minimo}'
})

extend('maxdate', {
  params: ['maximo'],
  validate (value, { maximo }) {
    const newValue = Vue.prototype.moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')
    const newMaximo = Vue.prototype.moment(maximo, 'DD/MM/YYYY').format('YYYY-MM-DD')
    return Vue.prototype.moment(newValue).valueOf() <= Vue.prototype.moment(newMaximo).valueOf()
  },
  message: 'El campo {_field_} debe ser menor o igual a {maximo}'
})

extend('max', {
  params: ['maximo'],
  validate (value, { maximo }) {
    return Number(value) <= maximo
  },
  message: 'El campo {_field_} debe ser menor o igual a {maximo}'
})

extend('maxlength', {
  params: ['length'],
  validate (value, { length }) {
    return String(value).length <= length
  },
  message: 'El campo {_field_} debe tener como maximo {length} caracteres'
})

extend('dateValid', {
  validate (value) {
    return moment(value, 'DD/MM/YYYY').isValid()
  },
  message: 'La fecha no es válida'
})

extend('direccion', {
  validate (value) {
    return (isNaN(value) && value.trim().length > 5) || value > 0
  },
  message: 'El campo {_field_} no es un dato válido'
})
