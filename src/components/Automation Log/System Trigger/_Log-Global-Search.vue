<template>
    <v-dialog v-model="show">
      <v-card color="primary">
        <v-card-title class="headline white--text">
          Global Log Search Results
          <v-spacer></v-spacer>
          <v-col cols="2">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              dark
            ></v-text-field>
          </v-col>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="logDetails"
          :search="search"
          :loading="loading"
          class="rounded-0 pa-5"
        ></v-data-table>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
    logDetails: Array,
    value: Boolean,
  },
  data: () => ({
    search: "",
    loading: false,
    headers: [
      {
        text: "LOG MESSAGE",
        value: "log_message",
        align: "left",
        class: "font-weight-black",
      },
      {
        text: "LOG STATUS",
        value: "log_status",
        align: "center",
        class: "font-weight-black",
      },
      {
        text: "LOG DATE",
        value: "log_datetime",
        align: "left",
        class: "font-weight-black",
      },
    ],
    pagination: {
      sortby: "DATE START",
      descending: true,
    },
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
  methods: {
   
  },
};
</script>

<style scoped>
div >>> table > tbody > tr:hover {
  background: #B3E5FC !important;
}
</style>