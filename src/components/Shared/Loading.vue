<template>
  <div class="text-center">
    <v-dialog v-model="loading" width="300" persistent>
      <v-card>
        <v-card-text>
          <div class="text-center" style="padding: 10px">
            <p>Please wait while loading..</p>
            <v-progress-circular
              :size="70"
              :width="7"
              color="info"
              indeterminate
            ></v-progress-circular>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.menu-icon-button {
  background-color: #6fbd35 !important;
}
</style>