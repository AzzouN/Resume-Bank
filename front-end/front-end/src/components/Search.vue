<template>
  <div class="search">
    <div id="inputArea">
      <h5>Search criteria</h5>
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
      <vs-button id="add_btn" flat :active="1 == 0" @click="add_alternatives">
        Add alternatives input
      </vs-button>
      <vs-button flat :active="1 == 1" @click="search"> Search </vs-button>
    </div>

    <div id="results">
      <h5>Search results : {{ total }} results</h5>
      <div id="resumes">
        <div class="resume" v-for="(r, index) in resumes" :key="index">
          <span v-if="r.email"><b>Email : </b> {{ r.email }} </span>
          <span v-if="r.score"><b>Score : </b> {{ r.score }} </span>
          <vs-button border :active="1 == 0" :href="apiURL+r.filename">
            Download resume
          </vs-button>
        </div>
      </div>
      <vs-pagination 
        v-if="total > 0" 
        v-model="page" 
        :length="Math.ceil(total/resumesPerPage)" 
        @input="search"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Search",
  data: function () {
    return {
      apiURL: "http://localhost:5000/",
      page: 1,
      resumesPerPage: 5,
      resumes: [],
      total: 0,
      must: "",
      alternatives: [""],
      optional: "",
    };
  },
  methods: {
    add_alternatives: function () {
      this.alternatives.push("");
    },
    search: function () {
      let query = {
        from: this.resumesPerPage * (this.page - 1),
        size: this.resumesPerPage,
        must: this.must,
        optional: this.optional,
        alternatives: [],
      };
      this.alternatives.map((elt) => {
        if (elt.length > 0) {
          query.alternatives.push(elt);
        }
      });
      axios
        .post("http://localhost:5000/resumes/search", { query })
        .then((result) => {
          this.resumes = result.data.result;
          console.log(result.data);
          this.total = result.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search {
  display: grid;
  grid-template-columns: 30% 70%;
}

#inputArea {
  margin-top: 0px;
  height: 85vh;
  overflow: auto;
  overflow-x: hidden;
}

#inputArea > h5 {
  margin-left: 10px;
}

#resumes {
  height: calc(80vh - 50px);
  overflow: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
}

.inputs {
  margin-bottom: 35px;
  margin-top: 40px;
}

.resume {
  width: calc(100% - 30px);
  height: auto;
  margin: 5px;
  box-shadow: 1;
  display: inline-block;
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  border-radius: 5px;
  font-family: "arial";
  padding: 5px 0px 5px 10px;
}

.resume > span {
  display: block;
  margin: 8px 8px;
}

.resume > vs-button {
  margin-top: 15px;
}

#add_btn {
  margin-top: -20px;
}
</style>
