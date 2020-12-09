<template>
  <div>
    <v-app-bar
      class="titlebar"
      :color="color"
      elevate-on-scroll
    >
      <v-avatar
        class="mr-1"
        size="40"
        :color="$route.meta.avatar.color"
      >
        <v-icon
          class="white--text"
        >
          {{ $route.meta.avatar.icon }}
        </v-icon>
      </v-avatar>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="actions"></slot>
    </v-app-bar>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'transparent'
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.titlebar .v-toolbar__content {
  padding: 0 !important;
}
</style>
