<template>
  <div>
    <title-bar title="Domicilios sin Encuesta" />
    <v-row>
      <template v-if="table && table.total || table.search !== null">
        <v-col cols="12">
          <v-text-field
            v-model="table.search"
            label="Buscar"
            dense
            clearable
            outlined
            :append-icon="table.search && esMovil ? 'mdi-magnify' : ''"
            @input="val => !val ? getRegistros() : ''"
            @click:append="getRegistros"
            @keyup.enter="getRegistros"
            hide-details
          />
        </v-col>
        <v-col class="pt-0" cols="12">
          <template v-if="table.items.length">
            <v-list>
              <template v-for="(item, indexItem) in table.items">
                <v-list-item
                  :key="`domicilio${indexItem}`"
                  class="px-1"
                  @click="isArrayObject(item.observaciones) ? $router.push({ name: 'DetalleDomicilioSinEncuesta', params: { idd: item.idd }}) : ''"
                >
                  <v-badge
                    :value="item.uuid"
                    bordered
                    color="orange"
                    icon="mdi-sync"
                    overlap
                    offset-x="20"
                    offset-y="20"
                  >
                    <v-list-item-avatar class="mr-1 ml-1" :color="item.status ? 'red' : 'green'">
                      <v-icon dark>
                        mdi-home-{{item.status ? 'alert' : 'account'}}
                      </v-icon>
                    </v-list-item-avatar>
                  </v-badge>
                  <v-list-item-content class="px-0" style="width: 100% !important;">
                    <v-list-item-title>
                      {{ `${item.nombreMunicipio}, ${item.nombreDepartamento}` }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.nombreBarrio }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-if="item.direccion">
                      <v-icon small>mdi-sign-direction</v-icon>
                      {{item.direccion}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action class="flex-row-reverse align-center">
                    <v-btn
                      dark
                      depressed
                      fab
                      small
                      color="green"
                      @click.stop="$router.push({ name: 'DetalleDomicilioMapa', params: { idd: item.idd }})"
                      class="mr-1"
                      v-if="item.coordenadas"
                    >
                      <v-icon>mdi-map-marker-radius</v-icon>
                    </v-btn>
                    <v-btn
                      dark
                      depressed
                      fab
                      small
                      color="blue"
                      @click.stop="refactorizarDomicilio(item)"
                      class="mr-1"
                      v-if="!isArrayObject(item.observaciones)"
                    >
                      <v-icon>mdi-restore</v-icon>
                    </v-btn>
                    <v-btn
                      dark
                      depressed
                      fab
                      small
                      color="red"
                      @click.stop="eliminarDomicilio(item)"
                      class="mr-1"
                      v-if="(!item.uuid && item.status === 0) || (item.observaciones && isArrayObject(item.observaciones) && Array.isArray(JSON.parse(item.observaciones)) && JSON.parse(item.observaciones).length === 1 && item.uuid)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider v-if="indexItem !== (table.items.length - 1)" :key="`dividerdomicilio${indexItem}`"/>
              </template>
            </v-list>
          </template>
          <template v-else>
            <div class="text-center pt-2">
            <span class="title grey--text text--darken-1 text-center caption pa-1">
              <v-icon>mdi-magnify</v-icon>
              No hay registros para mostrar
            </span>
            </div>
            <div class="text-center pt-2">
              <v-btn
                large
                color="primary"
                dark
                fab
                @click="crearDomicilio"
                v-if="permisos.DomicilioSinEncuestaCrear"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </template>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" class="text-center title">
          No hay domicilios registradas
        </v-col>
        <v-col cols="12" class="text-center title">
          <v-btn
            large
            color="primary"
            dark
            fab
            @click="crearDomicilio"
            v-if="permisos.DomicilioSinEncuestaCrear"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </template>
      <loading v-model="table.loading"></loading>
    </v-row>
    <registro-domicilio
      ref="RegistroDomicilio"
      @guardado="getRegistros"
    />
    <footer-app v-if="table.items.length">
      <v-btn
        color="primary"
        dark
        absolute
        top
        right
        fab
        @click="crearDomicilio"
        v-if="permisos.DomicilioSinEncuestaCrear"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <div class="text-center px-2">
              <span class="title grey--text text--darken-1 text-center caption pa-1">
                Registros del {{ table.from }} al {{ table.to }} de {{ table.total }} totales
              </span>
        <v-pagination
          v-model="table.currentPage"
          :length="table.totalPage"
          :total-visible="7"
          @input="getRegistros"
        />
      </div>
    </footer-app>
    <v-dialog
      v-model="eliminar.dialog"
      persistent
      max-width="300"
    >
      <v-card>
        <v-card-text
          class="pt-3 text-center"
        >
          {{eliminar.texto}}
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="cancelaEliminacion"
          >
            Cancelar
          </v-btn>
          <v-spacer/>
          <v-btn
            dark
            color="red"
            @click="confirmaEliminar"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RegistroDomicilio from '@/modules/covid/components/domicilioSinEncuesta/RegistroDomicilio'
import { mapGetters } from 'vuex'
export default {
  name: 'Domicilios',
  components: {
    RegistroDomicilio
  },
  data: () => ({
    eliminar: {
      dialog: false,
      texto: '',
      item: null
    },
    dialog: false,
    table: {
      search: null,
      options: {},
      changeSearch: false,
      items: [],
      loading: false,
      currentPage: 1,
      from: 0,
      to: 0,
      total: 0,
      totalPage: 1,
      itemsPerPage: 20
    }
  }),
  computed: {
    ...mapGetters([
      'user'
    ]),
    permisos () {
      return this.$store.getters.getPermissionModule('covid')
    }
  },
  watch: {
    'table.options': {
      handler (val) {
        if (val && val.sortBy && val.sortBy.length) this.table.search = null
        this.getRegistros()
      },
      deep: false
    },
    'table.search': {
      handler () {
        this.table.changeSearch = true
      },
      immediate: false
    }
  },
  created () {
    this.$store.commit('SET_GOBACK')
    this.getRegistros()
    this.$store.commit('SET_ASSIGN_DB_COMPLEMENTOS')
  },
  methods: {
    isArrayObject (text) {
      return text.includes('[{"') && text.includes('"}]') && text.includes('{') && text.includes('}') && text.includes('"') && text.includes('","') && text.includes('":"')
    },
    crearDomicilio () {
      this.$refs.RegistroDomicilio.open()
    },
    eliminarDomicilio (item) {
      this.eliminar.item = item
      this.eliminar.texto = '¿Está seguro de eliminar el domicilio seleccionado?'
      this.eliminar.dialog = true
    },
    cancelaEliminacion () {
      this.eliminar.dialog = false
      setTimeout(() => {
        this.eliminar.texto = ''
        this.eliminar.item = null
      }, 500)
    },
    async confirmaEliminar () {
      this.table.loading = true
      this.$store.dispatch('eliminarDomicilio', this.eliminar.item.idd).then(response => {
        if (response) {
          this.cancelaEliminacion()
          this.getRegistros()
        } else {
          this.table.loading = false
        }
      })
    },
    async getRegistros () {
      this.table.loading = true
      this.$store.dispatch('getDomiciliosTabla', this.table).then(data => {
        console.log('this.table', this.table)
        this.table.changeSearch = false
        this.table.currentPage = data.currentPage
        this.table.totalPage = data.totalPage
        this.table.items = data.items
        this.table.from = data.from
        this.table.to = data.to
        this.table.total = data.total
        this.table.loading = false
      })
    },
    refactorizarDomicilio (domicilio) {
      this.loading = true
      const domiCopia = JSON.parse(JSON.stringify(domicilio))
      domiCopia.observaciones = JSON.stringify([{
        tipificacion: domiCopia.tipificacion,
        fecha: domiCopia.updated_at,
        observacion: domiCopia.observaciones,
        user_id: this.user.id,
        usuario: this.user.name
      }])
      this.$store.dispatch('guardarDomicilio', domiCopia).then(response => {
        if (response) {
          this.getRegistros()
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
