<template>
  <div>
    <div id="toolbar" class="d-flex justify-space-between">
      <v-btn
        class="menu-icon-button pa-6 ml-2 block"
        color="white--text rounded-0 elevation-0"
        left
        to="/dashboard-service-usage"
      >
        <v-icon class="mr-2">mdi-view-dashboard</v-icon>
        Service Usage
      </v-btn>
    </div>
    <div id="cards-container" class="rounded-0 elevation-0 mt-5">
      <UserUsageChart/>
    </div>
    <UserUsageList/>
  </div>
</template>

<script>
import UserUsageChart from '../components/Dashboard/User Usage/_Graph'
import UserUsageList from '../components/Dashboard/User Usage/_List'

export default {
  components:{
    UserUsageChart,
    UserUsageList
  }
};
</script>


<style lang="scss">
.curve1 {
    .stroke {
      stroke: #F24C4F;
      stroke-width: 5;
    }
    .points {
      circle {
        stroke: #F24C4F;
        stroke-width: 15;

      }
    }
  }
  .curve2 {
    .stroke {
      stroke: #6fbd35;
      stroke-width: 5;
    }
    .point {
      fill: #6fbd35;
      stroke: #6fbd35;
      stroke-width: 15;

    }
  }

  .v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}

#cards-container {
  margin: 5px 5px 0px 22px;
}

#toolbar{
  margin: 15px 0px 0px 15px;
}

.menu-icon-button {
  background-color: #6fbd35 !important;
}

.v-btn__content {
  padding-left: 0px;
}

.v-card__actions {
  padding-left: 0px;
}

.v-card{
  border-radius: 0px !important;
}


</style>