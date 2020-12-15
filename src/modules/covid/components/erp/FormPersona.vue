<template>
  <v-row>
    <v-col cols="12" sm="6">
      <c-identificacion
        v-model="persona.identificacion"
        label="Identificación"
        rules="required"
        name="identificación"
        @responsepersona="val => resultAfiliado(val)"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <c-select-complete
        v-model="persona.tipo_identificacion"
        label="Tipo identificación"
        rules="required"
        name="tipo identificación"
        :items="tiposIdentificacion"
        item-text="descripcion"
        item-value="id"
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <c-texto
        v-model="persona.nombre1"
        label="Primer nombre"
        rules="required"
        name="primer nombre"
        upper-case
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <c-texto
        v-model="persona.nombre2"
        label="Segundo nombre"
        upper-case
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <c-texto
        v-model="persona.apellido1"
        label="Primer apellido"
        rules="required"
        name="primer apellido"
        upper-case
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <c-texto
        v-model="persona.apellido2"
        label="Segundo apellido"
        upper-case
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <c-date
        v-model="persona.fecha_nacimiento"
        label="Fecha nacimiento"
        rules="required"
        name="fecha nacimiento"
        :hint="edad"
        :disabled="identificacionVerificada < 1"
        :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <v-card outlined>
        <v-card-text class="pt-3 pb-4">
          <c-radio
            v-model="persona.sexo"
            label="Sexo"
            rules="required"
            name="sexo"
            :items="sexosCovid"
            item-text="text"
            item-value="value"
            :column="!$vuetify.breakpoint.smAndUp"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12">
      <c-texto
        v-model="persona.celular"
        label="Celular Principal"
        rules="required|numeric|minlength:10|maxlength:10"
        name="celular principal"
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="12">
      <c-texto
        v-model="persona.celular2"
        label="Celular Opcional"
        rules="numeric|minlength:10|maxlength:10"
        name="celular opcional"
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="12">
      <c-texto
        v-model="persona.email"
        label="Email"
        rules="email"
        name="email"
        lower-case
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="12">
      <c-texto
        v-model="persona.acudiente"
        label="Acudiente"
        :rules="persona.edad < 18 ? 'required' : ''"
        name="acudiente"
        upper-case
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12">
      <c-texto
        v-model="persona.direccion"
        label="Dirección"
        rules="required|minlength:6|direccion"
        name="dirección"
        upper-case
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <v-col cols="12" sm="12">
      <c-select-complete
        v-model="persona.departamento_id"
        label="Departamento"
        name="departamento"
        rules="required"
        :items="departamentos"
        item-text="nombre"
        item-value="id"
        :disabled="identificacionVerificada < 1"
        @change="val => persona.municipio_id = val && persona.municipio_id && departamentos.find(x => x.id === val).municipios.find(z => z.id === persona.municipio_id) ? persona.municipio_id : null"
      />
    </v-col>
    <v-col cols="12" sm="12">
      <c-select-complete
        :disabled="!persona.departamento_id || identificacionVerificada < 1"
        v-model="persona.municipio_id"
        label="Municipio"
        name="municipio"
        :rules="persona.departamento_id ? 'required' : ''"
        :items="departamentos.length && persona.departamento_id && departamentos.find(x => x.id === persona.departamento_id) ? departamentos.find(x => x.id === persona.departamento_id).municipios : []"
        item-text="nombre"
        item-value="id"
      />
    </v-col>
    <v-col cols="12" sm="12">
      <c-select-complete
        :disabled="!persona.municipio_id || identificacionVerificada < 1"
        v-model="persona.barrio_id"
        :loading="loadingBarrios"
        label="Barrio"
        :items="barrios"
        item-text="nombre"
        item-value="id"
      />
    </v-col>
    <v-col cols="12">
      <v-checkbox
        v-model="persona.si_eps"
        class="shrink mr-2"
        label="¿Está afiliado a una EPS?"
        :false-value="0"
        :true-value="1"
        :disabled="identificacionVerificada < 1"
      />
    </v-col>
    <template v-if="persona.si_eps">
      <v-col cols="12" sm="12">
        <c-select-complete
          v-model="persona.eps_id"
          label="¿A que EPS está afiliado?"
          rules="required"
          name="EPS de afiliación"
          :items="epss"
          item-value="id"
          item-text="nombre"
          :disabled="identificacionVerificada < 1"
        />
      </v-col>
      <template v-if="persona.eps_id">
        <v-col cols="12" sm="12">
          <c-select-complete
            v-model="persona.tipo_afiliacion"
            label="Régimen"
            rules="required"
            name="régimen"
            :items="regimenes"
            :disabled="identificacionVerificada < 1"
          />
        </v-col>
        <v-col cols="12" sm="12" v-if="persona.tipo_afiliacion === 'Régimen Especial'">
          <c-select-complete
            v-model="persona.regimen_especial"
            label="Régimen especial"
            rules="required"
            name="régimen especial"
            :items="regimenesEspeciales"
            :disabled="identificacionVerificada < 1"
          />
        </v-col>
      </template>
    </template>
    <v-dialog
      v-model="dialogNoAplica"
      persistent
      max-width="300"
    >
      <v-card>
        <v-card-text
          class="text-center"
        >
          {{textoNoAplica}}
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            text
            @click="dialogNoAplica = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Persona from '@/class/Persona'
export default {
  name: 'FormPersona',
  props: {
    value: {
      type: Object,
      default: null
    },
    tipo: {
      type: String,
      default: 'tamizaje'
    }
  },
  data: () => ({
    identificacionVerificada: 0,
    loadingidentidad: false,
    edad: null,
    persona: null,
    barrios: [],
    loadingBarrios: false,
    dialogNoAplica: false,
    textoNoAplica: ''
  }),
  computed: {
    esTamizaje () {
      return this.tipo === 'tamizaje'
    },
    esFallecido () {
      return this.tipo === 'fallecido'
    },
    ...mapGetters([
      'sexosCovid',
      'tiposIdentificacion',
      'departamentos',
      'regimenes',
      'epss',
      'regimenesEspeciales',
      'datosMemoria'
    ])
  },
  watch: {
    value: {
      handler (val) {
        if (val && val.identificacion) {
          this.identificacionVerificada = 1
          this.$emit('verificado', 1)
        }
        this.assignPerson()
      },
      immediate: true
    },
    'persona.municipio_id': {
      handler (val) {
        this.persona.barrio_id = null
        this.barrios = []
        if (val) {
          this.getBarrios(val)
        }
      },
      immediate: false
    },
    'persona.identificacion': {
      handler (val) {
        if (!val) {
          this.identificacionVerificada = 0
          this.$emit('verificado', 0)
        }
      },
      immediate: false
    },
    'persona.fecha_nacimiento': {
      handler (val) {
        if (this && this.persona) {
          const laEdad = this.calculaEdad(val)
          this.persona.edad = laEdad.years
          this.edad = laEdad.stringDate
        }
      },
      immediate: true
    },
    'persona.si_eps': {
      handler (val) {
        if (!val) {
          this.persona.eps_id = null
          this.persona.tipo_afiliacion = null
        }
      },
      immediate: false
    },
    'persona.eps_id': {
      handler (val) {
        !val && (this.persona.tipo_afiliacion = null)
      },
      immediate: false
    },
    'persona.tipo_afiliacion': {
      handler (val) {
        if (!val || val !== 'Régimen Especial') {
          this.persona.regimen_especial = null
        }
      },
      immediate: false
    }
  },
  created () {
    if (this.value) {
      this.persona = this.value
    } else {
      this.assignPerson()
    }
  },
  methods: {
    assignPerson () {
      this.persona = new Persona()
    },
    getBarrios (municipioId) {
      this.loadingBarrios = true
      this.$store.dispatch('getBarriosMunicipio', municipioId).then(response => {
        this.barrios = response
        this.loadingBarrios = false
      })
    },
    resultAfiliado (response) {
      this.$emit('responsetamizaje', null)
      this.identificacionVerificada = 1
      this.$emit('verificado', this.identificacionVerificada)
      this.persona.tipo_identificacion = null
      this.persona.nombre1 = null
      this.persona.nombre2 = null
      this.persona.apellido1 = null
      this.persona.apellido2 = null
      this.persona.fecha_nacimiento = null
      this.persona.sexo = null
      this.persona.celular = null
      this.persona.email = null
      this.persona.direccion = null
      // this.persona.departamento_id = null
      // this.persona.municipio_id = null
      // this.persona.barrio_id = null
      this.persona.si_eps = 1
      this.persona.eps_id = null
      this.persona.tipo_afiliacion = null

      if (!(response.erps && response.erps.length && response.erps.find(x => x.localiza_persona)) && response.afiliado) {
        this.persona.afiliado_id = response.afiliado.id
        this.persona.tipo_identificacion = response.afiliado.tipo_documento_identidad_id
        this.persona.identificacion = response.afiliado.numero_documento_identidad
        this.persona.nombre1 = response.afiliado.nombre1
        this.persona.nombre2 = response.afiliado.nombre2
        this.persona.apellido1 = response.afiliado.apellido1
        this.persona.apellido2 = response.afiliado.apellido2
        this.persona.fecha_nacimiento = response.afiliado.fecha_nacimiento
        this.persona.sexo = response.afiliado.sexo
        this.persona.celular = response.afiliado.numero_celular
        this.persona.email = response.afiliado.email
        this.persona.direccion = response.afiliado.direccion
        if (this.datosMemoria && !this.datosMemoria.municipio_id) {
          this.persona.departamento_id = response.afiliado.departamento_id
          this.persona.municipio_id = response.afiliado.centro_poblado_id
          this.persona.barrio_id = response.afiliado.barrio_id || null
        }
        this.persona.eps_id = response.afiliado.eps_id
        this.persona.tipo_afiliacion = response.afiliado.regimen
      } else if (response.afiliado) {
        this.identificacionVerificada = -1
        this.textoNoAplica = `La identificación ${this.persona.identificacion} ya tiene una Encuesta activa.`
        this.dialogNoAplica = true
        this.$emit('verificado', this.identificacionVerificada)
      } else {
        this.identificacionVerificada = 1
        this.$emit('verificado', this.identificacionVerificada)
      }
    }
  }
}
</script>

<style scoped>

</style>
