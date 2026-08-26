<template>
  <v-list class="d-flex justify-center" width="100%">
    <v-list-item-group :class="list_item_group_class">
      <v-list-item v-for="(item, i) in items" :key="i" disabled>
        <div class="d-flex justify-centera align-center text-no-wrap">
          <v-icon v-text="item.icon" :color="item.color" large></v-icon>
          <h1 v-text="item.text" class="body-2 list_text"></h1>
        </div>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { text: 'NON PHILHEALTH MEMBER', icon: 'mdi mdi-rectangle', color: '#1b9e77' },
        { text: 'PHILHEALTH MEMBERS:' },
        { text: 'YAKAP MEMBER', icon: 'mdi mdi-rectangle', color: '#d95f02' },
        { text: 'NON YAKAP MEMBER', icon: 'mdi mdi-rectangle', color: '#7570b3' },
      ]
    }
  },

  computed: {
    list_item_group_class() {
      return this.$vuetify.breakpoint.mdAndUp ? 'd-flex justify-center' : 'd-inline-block'
    }
  }
}
</script>

<style>
.list_text {
  color: black;
}
</style>
