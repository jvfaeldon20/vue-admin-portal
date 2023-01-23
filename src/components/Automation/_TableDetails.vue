<template>
  <v-container v-if="rowDetails != null">
    <v-dialog v-model="show" :width="850">
      <v-card>
        <v-card-title class="headline">
          Sub Details
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="rowDetails.headers"
          :items="rowDetails.items"
          :search="search"
        ></v-data-table>
        <template v-slot:no-results>
          <v-alert
            :value="true"
            :dense="true"
            color="error"
            icon="mdi-alert-circle"
            >No results found.
          </v-alert>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  props: {
    rowDetails: Object,
    value: Boolean,
  },
  data: () => ({
    search: null,
  }),
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>