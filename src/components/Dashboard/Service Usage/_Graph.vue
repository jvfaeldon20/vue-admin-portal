<template>
<v-card
    class="mx-auto pa-5"
>
  <div class="random">
    <trend-chart id="serviceUsageGraph" :datasets="datasets" :grid="grid" :labels="labels" :min="0" :interactive="true" @mouse-move="onMouseMove" class="random-chart"></trend-chart>
    <div id="pop" role="tooltip" ref="tooltip" class="tooltip" :class="{'is-active': tooltipData}">
      <div class="tooltip-container" v-if="tooltipData">
        <strong>{{labels.xLabels[tooltipData.index]}}</strong>
        <div class="tooltip-data">
          <div class="tooltip-data-item tooltip-data-item--1">{{tooltipData.data[0]}}</div>
          <div class="tooltip-data-item tooltip-data-item--2">{{tooltipData.data[1]}}</div>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <v-icon color="#6fbd35" class="mr-2">mdi-circle</v-icon>Manual Trigger
      <v-icon color="#F24C4F" class="mr-2">mdi-circle</v-icon>Log Search
    </div>
  </div>
</v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "ServiceUsageGraph",
  data() {
    return {
      grid: {
        verticalLines: true,
        horizontalLines: true
      },
      labels: {
        xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        yLabels: 5,
        yLabelsTextFormatter: val => Math.round(val * 100) / 100
      },
      tooltipData: null,
      popper: null,
      popperIsActive: false
    }
  },
  methods: {
    initPopper() {
      const chart = document.querySelector(".random-chart")
      const ref = chart.querySelector(".active-line")
      const tooltip = this.$refs.tooltip
      this.popper = new Popper(ref, tooltip, {
        placement: "right",
        modifiers: {
          offset: { offset: "0,10" },
          preventOverflow: {
            boundariesElement: chart
          }
        }
      })
    },
    onMouseMove(params) {
      // this.popperIsActive = !!params;
      // this.popper.scheduleUpdate();
      // this.tooltipData = params || null;
    },
    ...mapActions(['fetchServiceListChart'])
  },
  computed: {
    ...mapGetters(['allLogSearch', 'allManualTrigger']),
    datasets() {
      let arr1 = {data: this.allLogSearch.map( i => i === undefined ? 0 : i['total'] ), smooth: true, showPoints: true, fill: false, className: 'curve1'}
      let arr2 = {data: this.allManualTrigger.map( i => i === undefined ? 0 : i['total'] ), smooth: true, showPoints: true, fill: false, className: 'curve2'}

      return [arr1, arr2]
    }

  },
  mounted() {
    
  },
  created() {
    this.fetchServiceListChart()
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

strong {
  font-weight: 600;
}

body {
  padding: 0;
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  color: #2f4053;
}

#app {
  margin: 0 auto;
  padding: 20px;
}

.random {
  
  width: 100%;
  .vtc {
    height: 150px;
    font-size: 12px;
    @media (min-width: 600px) {
      height: 300px;
    }
  }
  .labels {
    stroke: rgba(0, 0, 0, 0.05);
  }
  .active-line {
    stroke: rgba(0, 0, 0, 0.2);
  }
  .point {
    stroke-width: 12;
    transition: stroke-width 0.2s;
  }
  .point.is-active {
    stroke-width: 20;
  }
  .curve1 {
    .stroke {
      stroke: #fbac91;
      stroke-width: 5;
    }
    .fill {
      fill: #fbac91;
      opacity: 0.05;
    }
    .point {
      fill: #fbac91;
      stroke: #fbac91;
    }
  }
  .curve1 {
    .stroke {
      stroke: #fbe1b6;
      stroke-width: 10;
    }
    .point {
      fill: #fbe1b6;
      stroke: #fbe1b6;
    }
  }
  .curve2 {
    .stroke {
      stroke: #7fdfd4;
      stroke-width: 3;
    }
    .point {
      fill: #7fdfd4;
      stroke: #7fdfd4;
    }
  }

  .tooltip {
    &:not(.is-active) {
      display: none;
    }
    padding: 10px;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    &-data {
      display: flex;
      &-item {
        display: flex;
        align-items: center;
        &:not(:first-child) {
          margin-left: 20px;
        }
        &:before {
          content: "";
          display: block;
          width: 15px;
          height: 15px;
          margin-right: 5px;
        }
        &--1:before {
          background: #fbe1b6;
        }
        &--2:before {
          background: #7fdfd4;
        }
      }
    }
  }
}
</style>