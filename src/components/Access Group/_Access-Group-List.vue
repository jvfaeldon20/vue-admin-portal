<template>
  <div id="automation">
    <v-overlay :value="overlay">
      <v-progress-circular
        :size="loaderSize"
        :width="loaderWidth"
        color="white"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
    <div id="toolbar" class="d-flex justify-space-between">
      <v-btn
        id="newAccessGroup"
        class="menu-icon-button pa-6 ml-2 block"
        color="white--text rounded-0 elevation-0"
        left
        to="/access-group-add"
      >
      <v-icon class="text-h5 pr-2">mdi-plus</v-icon>
        New Access Group
      </v-btn>
      <div width="600">
        <v-text-field
          id="searchAccessGroup"
          prepend-inner-icon="mdi-magnify"
          v-model="search"
          label="Search"
          right
          clearable
          class="mr-2"
        ></v-text-field>
      </div>
    </div>
    <div >
      <v-data-iterator
        :items="allAccessGroupList"
        :search="search"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        hide-default-footer
      >

      <template v-slot:default="props">
        <div id="cards-container">
          <v-card
              v-for="item in props.items" :key="item.access_group_id"
              class="card-item rounded-0 pa-3 ma-2 pb-0"
            >
              <v-img :aspect-ratio="16 / 6" src="automation pic/app-header.bg.jpg">
              <v-btn
                    absolute
                    color="menu-icon-button rounded-0"
                    class="white--text mr-15"
                    left
                    bottom
                    outlined
                     :to="{name:'Access-Group-Details',params:{key:item.access_group_id, access_group_name:item.access_group_name}}"
                  >
                    More Details
                  </v-btn> 
              <h3 class="font-weight-light white--text text-h5 pa-5">
                 {{item.access_group_name}}
              </h3>
              
              </v-img>
              <v-card-text class="pt-6 mb-3" style="position: relative;">
                <v-row>
                  <v-btn
                    absolute
                    color="menu-icon-button"
                    class="white--text mr-15"
                    fab
                    right
                    top
                    :to="{name:'Access-Group-Modify-DList',params:{key:item.access_group_id}}"
                  >
                    <v-icon class="text-h4">mdi-pencil</v-icon>
                  </v-btn>
                  <AccessGroupDelete :id="item.access_group_id" :access_group_name="item.access_group_name"/> 
                </v-row>
              </v-card-text>
            </v-card>
        </div>
      </template>
      

      <template v-slot:footer>
        <v-row
          class="mt-2 pa-6"
          align="center"
          justify="center"
        >
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>

      </v-data-iterator>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import AccessGroupDelete from './dialogs/_Access-Group-Delete'

export default {
  name:"Access-Group-List",
  data(){
    return {
      dialog: false,
      search: '',
      actionItems: [
          {list: 'Modify Distribution List'},
          {list: 'Delete'},
        ],
      loaderSize: 0,
      loaderWidth: 0,
      overlay: false,


      itemsPerPageArray: [8, 12, 16],
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 12,
    }
  },
  components:{
    AccessGroupDelete,
  },
  computed: {...mapGetters(['allAccessGroupList']),
     numberOfPages (){
        return Math.ceil(this.allAccessGroupList.length / this.itemsPerPage)
      },
      filteredKeys () {
        return this.keys.filter(key => key !== 'Name')
      },
  },
  methods: {
    ...mapActions(['fetchAccessGroup']),
    nextPage () {
        if (this.page <= ( this.allAccessGroupList.length / this.itemsPerPage )) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
  },
  beforeMount(){
    this.loaderSize = 80
    this.loaderWidth = 9
    this.overlay = true
  },
  mounted(){
    if(this.allAccessGroupList && this.allAccessGroupList.length > 0){
      this.loaderSize = 0
      this.overlay = false
      return
    }
    
    this.fetchAccessGroup().then(()=>{
      this.loaderSize = 0;
      this.overlay = false;
    })
  },
  
}
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}

#cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-gap: 1em;
  margin: 5px 0px 0px 15px;
}

#toolbar{
  margin: 15px 0px 0px 15px;
}

.menu-item-hover {
  background-color: #384355;
}

.menu-icon-button {
  background-color: #6fbd35 !important;
}

.menu-title {
  color: #234899;
  font-size: 25px;
}

.menu-action{
  color: #234899;
  font-size: 16px;
}

.menu-details{
  color: #459CC9;
}

.v-btn__content {
  padding-left: 0px;
}

.v-card__actions {
  padding-left: 0px;
}

.v-btn__content{
  text-transform: unset !important;
  color: #234899;
}

</style>