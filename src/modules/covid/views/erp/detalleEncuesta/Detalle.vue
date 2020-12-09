<template>
  <v-list v-if="encuesta">
    <v-list-item class="px-1">
      <v-list-item-content class="px-0">
        <v-list-item-subtitle>
          {{
            encuesta.tipo_tamizaje === 'telefónico'
              ? encuesta.llamada_entrante
              ? 'Llamada recibida por: '
              : `Llamada realizada por: '${tamizador}`
              : 'Realizado por:'
          }}
        </v-list-item-subtitle>
        <v-list-item-title>{{tamizador}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="px-1" v-if="encuesta.tamizador_id === 897 && encuesta.ips_bai">
      <v-list-item-content class="px-0">
        <v-list-item-subtitle>
          IPS Busqueda Activa Institucional
        </v-list-item-subtitle>
        <v-list-item-title>{{encuesta.ips_bai.nombre}}</v-list-item-title>
        <p class="mb-0 subtitle-2 grey--text text--lighten-1">
          {{[encuesta.ips_bai.telefono ? `Tel.${encuesta.ips_bai.telefono}`: null, `${encuesta.ips_bai.direccion} ${encuesta.ips_bai.nompio}, ${encuesta.ips_bai.nomdepto}`].filter(x => x).join(' | ')}}
        </p>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="px-1" v-if="encuesta.tamizador_id === 890 && encuesta.entidad_reporta_sivigila">
      <v-list-item-content class="px-0">
        <v-list-item-subtitle>
          Entidad que reporta a SIVIGILA
        </v-list-item-subtitle>
        <v-list-item-title>{{encuesta.entidad_reporta_sivigila}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <template v-if="encuesta.localiza_persona">
      <template v-if="encuesta.contesta_encuesta">
        <v-list-item class="px-1" v-if="encuesta.grupo_atencion_especial_id">
          <v-list-item-content class="px-0">
            <v-list-item-subtitle>Grupo de atención especial</v-list-item-subtitle>
            <v-list-item-title>
              {{ gruposAtencionEspecial && gruposAtencionEspecial.length && gruposAtencionEspecial.find(x => x.id === encuesta.grupo_atencion_especial_id).nombre }}
            </v-list-item-title>
            <p class="subtitle-2 orange--text mb-0" v-if="encuesta.grupo_atencion_especial_id !== 1">
              Según el instructivo del Instituto Nacional de Salud, se recomienda tener especial atención con esta persona.
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.riesgo_procedencia">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              <v-icon color="red">mdi-alert</v-icon>
              Riesgo por antecedentes de viaje
            </v-list-item-title>
            <p class="mb-0 subtitle-2 grey--text text--lighten-1">
              Antecedentes de Viaje: ¿Ud realizó algún viaje desde o hacia las zonas donde se presenta el virus o ha tenido cercanía con personas contagiadas en los últimos 14 días?
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.riesgo_ocupacional">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              <v-icon color="red">mdi-alert</v-icon>
              Riesgo por oficio u ocupación
            </v-list-item-title>
            <p class="mb-0 subtitle-2 grey--text text--lighten-1">
              ¿Es Trabajador de la salud u otro personal del ámbito hospitalario que haya tenido contacto estrecho* con caso confirmado para enfermedad por nuevo coronavirus (COVID-19)?
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.riesgo_contacto">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              <v-icon color="red">mdi-alert</v-icon>
              Riesgo por contacto estrecho
            </v-list-item-title>
            <p class="mb-0 subtitle-2 grey--text text--lighten-1">
              ¿Ha tenido contacto estrecho* en los últimos 14 días con un caso confirmado con infección respiratoria aguda grave asociada al nuevo coronavirus 2019 (COVID-19)?
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.hospitalizado">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              <v-icon color="orange">mdi-hospital-building</v-icon>
              Ha estado hospitalizado
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.prueba_rapida">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              <v-icon color="orange">mdi-test-tube</v-icon>
              Le han realizado prueba rápida
            </v-list-item-title>
            <v-list-item-subtitle v-if="encuesta.resultado_prueba_rapida">
              {{ `Resultado: ${encuesta.resultado_prueba_rapida}` }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.diagnosticado_covid">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              <v-icon color="red">mdi-alert</v-icon>
              Ha sido diagnósticado
            </v-list-item-title>
            <v-list-item-subtitle v-if="encuesta.fecha_diagnostico">
              {{ `Fecha: ${moment(encuesta.fecha_diagnostico).format('DD/MM/YYYY')}` }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              Síntomas
            </v-list-item-title>
            <template v-if="losSintomas.length">
              <template v-for="(chip, indexChip) in losSintomas">
                <v-chip label class="mr-2 mb-2 white--text" color="indigo" :key="`chip${indexChip}`">
                  {{ chip.descripcion }}
                </v-chip>
              </template>
              <v-chip label class="white--text mr-2 mb-2" color="orange" v-if="encuesta.fecha_sintomas">
                <v-icon small left>mdi-calendar-month</v-icon>
                {{ moment(encuesta.fecha_sintomas).format('DD/MM/YYYY') }}
              </v-chip>
            </template>
            <p v-else class="mb-0 grey--text text--lighten-1 text-center">No registra síntomas</p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              Signos de Alarma
            </v-list-item-title>
            <template v-if="losSignosAlarma.length">
              <template v-for="(chip, indexChipA) in losSignosAlarma">
                <v-chip label class="mr-2 mb-2 white--text" color="indigo" :key="`chipA${indexChipA}`">
                  {{ chip.descripcion }}
                </v-chip>
              </template>
            </template>
            <p v-else class="mb-0 grey--text text--lighten-1 text-center">No registra signos de alarma</p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1">
          <v-list-item-content class="px-0">
            <v-list-item-title>
              Comorbilidades
            </v-list-item-title>
            <template v-if="lasComorbilidades.length">
              <template v-for="(chip, indexChipC) in lasComorbilidades">
                <v-chip label class="mr-2 mb-2 white--text" color="indigo" :key="`chipA${indexChipC}`">
                  {{ chip.descrip }}
                </v-chip>
              </template>
            </template>
            <p v-else class="mb-0 grey--text text--lighten-1 text-center">No registra comorbilidades</p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.temperatura">
          <v-list-item-avatar class="my-1 align-self-center" color="deep-orange">
            <v-icon dark>mdi-thermometer</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="px-0">
            <v-list-item-subtitle>
              Temperatura
            </v-list-item-subtitle>
            <v-list-item-title>
              {{encuesta.temperatura}}
              <v-icon small style="margin-top: -4px !important;">mdi-temperature-celsius</v-icon>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.saturacion_oxigeno">
          <v-list-item-avatar class="my-1 align-self-center" color="purple">
            <v-icon dark>mdi-gauge</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="px-0">
            <v-list-item-subtitle>
              Saturación de Oxígeno
            </v-list-item-subtitle>
            <v-list-item-title>
              {{encuesta.saturacion_oxigeno}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.frecuencia_pulso">
          <v-list-item-avatar class="my-1 align-self-center" color="red">
            <v-icon dark>mdi-heart-pulse</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="px-0">
            <v-list-item-subtitle>
              Frecuencia de Pulso
            </v-list-item-subtitle>
            <v-list-item-title>
              {{encuesta.frecuencia_pulso}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-1" v-if="encuesta.estado_prueba">
          <v-list-item-avatar class="my-1 align-self-center" color="green">
            <v-icon dark>mdi-test-tube</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="px-0">
            <v-list-item-title>
              Requiere toma de muestra
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item class="px-1">
          <v-list-item-content class="px-0">
            <v-list-item-title class="orange--text">
              El paciente no diligencia la Encuesta de Riesgo Poblacional
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </template>
    <template v-else>
      <v-list-item class="px-1">
        <v-list-item-content class="px-0">
          <v-list-item-subtitle>
            Motivo de no localización
          </v-list-item-subtitle>
          <v-list-item-title class="red--text">
            {{encuesta.no_efectividad}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-list-item class="px-1">
      <v-list-item-content class="px-0">
        <v-list-item-subtitle>
          Observaciones
        </v-list-item-subtitle>
        <p class="mb-0">{{ encuesta.observaciones }}</p>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Detalle',
  props: {
    encuesta: {
      type: Object,
      default: null
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters([
      'gruposAtencionEspecial',
      'tiposIdentificacion',
      'tamizadores',
      'sintomas',
      'comorbilidades'
    ]),
    tamizador () {
      return this.encuesta && this.tamizadores && this.tamizadores.length && this.tamizadores.find(x => x.id === this.encuesta.tamizador_id) ? this.tamizadores.find(x => x.id === this.encuesta.tamizador_id).nombre : ''
    },
    losSintomas () {
      return (this && this.encuesta && this.encuesta.sintomas.length && this.sintomas && this.sintomas.length && this.sintomas.filter(x => this.encuesta.sintomas.find(z => z === x.id))) || []
    },
    losSignosAlarma () {
      return (this && this.encuesta && this.encuesta.signos_alarma.length && this.sintomas && this.sintomas.length && this.sintomas.filter(x => this.encuesta.signos_alarma.find(z => z === x.id))) || []
    },
    lasComorbilidades () {
      return (this && this.encuesta && this.encuesta.comorbilidades && this.encuesta.comorbilidades.length && this.comorbilidades && this.comorbilidades.length && this.comorbilidades.filter(x => this.encuesta.comorbilidades.find(z => z === x.codigo))) || []
    }
  }
}
</script>

<style scoped>

</style>
