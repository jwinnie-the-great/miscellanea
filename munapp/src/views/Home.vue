<template>
  <div class="home">
    <button class="clear" @click="clear">Clear</button>
    <input type="text" v-model="searchTerms" placeholder="Search for a country...">
    <button class="searchClear" @click="searchTerms = ''" v-if="searchTerms != ''">✕</button>
    <table>
      <VirtualList :size="300" :remain="3">
        <tr v-for="country in fuzzySearchCountries" v-bind:key="country.name">
          <th><span class="emoji">{{ country.emoji }}</span> {{ country.name }}</th>
          <td>
            <VueTrix v-model="country.notes" placeholder="Type your notes here..."></VueTrix>
          </td>
        </tr>
      </VirtualList>
    </table>
  </div>
</template>

<script>
import _ from 'lodash'
import { countries } from 'countries-list'
import Fuse from 'fuse.js'
import VirtualList from 'vue-virtual-scroll-list'
import VueTrix from 'vue-trix'

export default {
  components: {
    VirtualList,
    VueTrix,
  },
  data: () => {
    let storedCountries = localStorage.getItem("countries")
    if (_.isNil(storedCountries)) {
      return { countries: countries, searchTerms: "" }
    } else {
      return { countries: JSON.parse(storedCountries), searchTerms: "" }
    }
  },
  watch: {
    countries: {
      handler: function(val) {
        console.log("saving...")
        this.countries = val
        localStorage.setItem("countries", JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {
    clear() {
      if (confirm("This will delete all notes. Are you sure you want to proceed?")) {
        this.countries = countries
      }
    }
  },
  computed: {
    fuzzySearchCountries() {
      if (this.searchTerms !== "") {
        let fuse = new Fuse(Object.values(this.countries), {
          keys: ["name"],
          threshold: 0.3
        })
        return fuse.search(this.searchTerms)
      } else {
        return this.countries
      }
    }
  }
}
</script>

<style lang="sass">
body
  font-size: 25px
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif
  overflow: hidden
th
  text-align: left
.emoji
  font-size: 2em
table
  width: 100%
input[type=text]
  padding: 8px
  font-size: 25px
.clear
  padding: 8px
  font-size: 25px
  background-color: red
  color: white
  border: none
  border-radius: 10px
  cursor: pointer
  margin-right: 20px
.trix-button--icon
  font-size: 0.65em
.trix-content
  height: 200px
  overflow: scroll
.searchClear
  padding: 8px
  padding-left: 12px
  padding-right: 12px
  font-size: 25px
  border-radius: 100px
  border: none
  cursor: pointer

@import "~vue-virtual-scroller/dist/vue-virtual-scroller.css"
</style>
