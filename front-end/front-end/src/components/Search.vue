<template>
  <div class="search">
    <div id="inputs">
      <vs-input
      class="inputs"
      label="Candidate must know all the following"
      v-model="must"
      placeholder="html, css, javascript"
    />
    <vs-input
      class="inputs"
      label="It's a plus if the candidate know one of the following"
      v-model="optional"
      placeholder="python, c++"
    />
    <vs-input
      class="inputs"
      label="Candidate must know one of the following (alternatives)"      
      v-for="(item, index) in alternatives"
      :key="index"
      v-model="alternatives[index]"
      placeholder="Angular, React, Vue"
    />
    <vs-button
      id="add_btn"
      flat
      :active="1 == 0"
      @click="add_alternatives"
    >
      Add alternatives input
    </vs-button>
    <vs-button
      flat
      :active="1 == 1"
      @click="search"
    >
      Search
    </vs-button>
    </div>

    <div id="results">

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Search',
  data: function() {
    return {
      resumes: [],
      must: '',
      alternatives: [
        ''
      ],
      optional: ''
    }
  },
  methods: {
    add_alternatives: function () {
      this.alternatives.push('');
    },
    search: function () {
      let query = {
        must: this.must,
        optional: this.optional,
        alternatives: []
      };
      this.alternatives.map(elt => {
        if (elt.length > 0) {
          query.alternatives.push(elt);
        }
      })
      axios.post('http://localhost:5000/resumes/search', { query })
      .then(result => {
        this.resumes = result.data;
        console.log(this.resumes);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .inputs {
    margin-bottom: 35px;
  }

  #add_btn {
    margin-top: -20px;
  }
</style>
