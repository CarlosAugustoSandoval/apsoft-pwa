<template>
  <v-navigation-drawer
    style="padding-top: 40px !important; z-index: 2 !important;"
    v-model="Customizer_drawer"
    app
    temporary
    clipped
    right
  >
    <loading :value="loading"/>
    <!---USer Area -->
    <v-list-item two-line class="profile-bg" v-if="user">
      <v-list-item-avatar>
        <v-icon x-large>mdi-account-circle</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ user.name }}</v-list-item-title>
        <v-list-item-subtitle class="caption">{{ user.email }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <template v-if="isOnline">
      <v-divider/>
      <v-list class="pa-0">
        <v-list-item @click="logout">
          <v-list-item-avatar color="error">
            <v-icon dark>mdi-close</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
    <!---Theme color -->
    <v-divider></v-divider>
    <div class="px-4 py-4">
      <span>Color del Tema</span>
      <v-item-group
        mandatory
        v-model="colorActive"
      >
        <v-item
          v-for="tcolor in themeColors"
          :key="tcolor"
          :value="tcolor"
          class="mt-2"
        >
          <template v-slot="{ active, toggle }">
            <v-avatar
              :class="active && 'v-settings__item--active'"
              :color="tcolor"
              class="v-settings__item mr-2"
              size="25"
              @click="toggle"
            />
          </template>
        </v-item>
      </v-item-group>
      <v-switch v-model="dark" class="mt-4" hide-details primary label="Modo Oscuro"/>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Customizer',
  data: () => ({
    loading: false,
    colorActive: null,
    dark: false
  }),
  computed: {
    Customizer_drawer: {
      get () {
        return this.$store.state.userDrawer.Customizer_drawer
      },
      set (val) {
        this.$store.commit('SET_CUSTOMIZER_DRAWER', val)
      }
    }
  },
  watch: {
    dark: {
      handler (dark) {
        this.$store.commit('SET_THEME_MODE', dark)
      },
      immediate: false
    },
    colorActive: {
      handler (color) {
        this.$store.commit('SET_THEME_COLOR', color)
      },
      immediate: false
    }
  },
  created () {
    this.colorActive = this.themeColor
    this.dark = this.darkMode
  },
  methods: {
    logout () {
      this.loading = true
      setTimeout(() => {
        this.$router.push({ name: 'Login' })
        this.$store.commit('SET_LOGOUT')
        this.$store.commit('SET_CUSTOMIZER_DRAWER', false)
        this.loading = false
      }, 600)
    }
  }
}
</script>

<style lang="scss">
.profile-bg {
  .v-avatar {
    padding: 45px 0;
  }
}
</style>
