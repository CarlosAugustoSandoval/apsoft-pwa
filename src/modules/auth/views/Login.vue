<template>
  <v-row>
    <v-col cols="12" md="6" lg="7" xl="8" class="primary d-none d-md-flex align-center">
      <v-container>
        <div class="pa-4">
          <v-row justify="center">
            <v-col cols="8" xl="6">
<!--              <v-list-item class="pa-0">-->
<!--                <img width="60px" alt="LOGO" src="@/assets/logo.png">-->
<!--                <v-list-item-content class="pa-0 ml-2">-->
<!--                  <h2 class="display-1 white&#45;&#45;text font-weight-medium">APSOFT</h2>-->
<!--                  <h6 class="caption white&#45;&#45;text font-weight-regular">Asesorías, Proyectos y Software</h6>-->
<!--                </v-list-item-content>-->
<!--              </v-list-item>-->
              <h1 class="display-1 white--text font-weight-medium mt-5">{{ datosEmpresa ? datosEmpresa.nombre_eps : '' }}</h1>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <v-col cols="12" md="6" lg="5" xl="4" class="d-flex align-center py-0">
      <v-container fluid class="py-0">
        <div class="px-10 py-0">
          <v-row justify="center">
            <v-col cols="12" sm="8" md="12" class="py-0">
              <v-card flat :color="`${darkMode ? 'grey lighten-3' : ''}`" class="mb-2 pa-2">
                <v-row justify="center" align="center">
                  <img alt="LOGO-APSOFT" src="@/assets/logoapsoft.png">
                  <img alt="LOGO-SOSALUD" src="@/assets/logososalud.png">
                </v-row>
              </v-card>
              <v-row justify="center" class="mb-2" no-gutters>
                <v-col cols="12" class="text-center">
                  <template v-if="$vuetify.breakpoint.smAndDown">
                    <h2 class="font-weight-medium mt-2 mb-5">{{ datosEmpresa ? datosEmpresa.nombre_eps : '' }}</h2>
                  </template>
                  <h2 :class="`font-weight-bold blue-grey--text text--${darkMode ? 'lighten-3' : 'darken-2'}`">
                    Inicio de Sesión
                  </h2>
                </v-col>
              </v-row>
              <validation-observer class="mb-5" ref="formLogin" v-slot="{ invalid }" tag="form" autocomplete="off"
                                  @submit.prevent="login">
                <c-texto
                  v-model="email"
                  label="Nombre de Usuario"
                  rules="required|email"
                  name="nombre de usuario"
                  :dense="false"
                />
                <c-password
                  v-model="password"
                  label="Contraseña"
                  rules="required"
                  name="contraseña"
                  :dense="false"
                />
                <v-btn
                  :disabled="invalid"
                  color="primary"
                  block
                  class="mr-4"
                  submit
                  type="submit"
                >Iniciar Sesión
                </v-btn>
              </validation-observer>
            </v-col>
          </v-row>
        </div>
      </v-container>
      <loading v-model="loading"></loading>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  data: () => ({
    email: null,
    password: null,
    loading: false
  }),
  computed: {
    ...mapGetters([
      'datosEmpresa'
    ])
  },
  created () {
    this.getDatosEmpresa()
  },
  methods: {
    getDatosEmpresa () {
      this.axios.get('api/configuraciones')
        .then(response => {
          response.data.departamento_id = parseInt(response.data.departamento_id)
          this.$store.commit('SET_DATOS_EMPRESA', response.data)
        })
        .catch(error => {
          this.$store.commit('SET_SNACKBAR', { color: 'error', message: 'Error al recuperar los datos de empresa.', error: error })
        })
    },
    login () {
      this.$refs.formLogin.validate().then(result => {
        if (result) {
          this.loading = true
          this.$store.dispatch('login', { username: this.email, password: this.password })
            .then(resolve => {
              if (resolve) this.$router.push({ name: 'Home' })
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
