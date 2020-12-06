<template>
  <div id="app">
    <div>
      <vs-navbar center-collapsed v-model="active">
        <template #left>
          <img id="logo" src="curriculum-vitae.png" alt="" />
          <h4 id="brand">Resume Bank</h4>
        </template>
        <vs-navbar-item :active="active == 'upload'" id="upload">
          Upload
        </vs-navbar-item>
        <vs-navbar-item :active="active == 'search'" id="search">
          Search
        </vs-navbar-item>
      </vs-navbar>
    </div>

    <div id="content">
      <Upload id="upload" v-if="active == 'upload'"></Upload>
      <Search id="search" v-if="active == 'search'"></Search>
    </div>
  </div>
</template>


<script>
import Upload from "./components/Upload";
import Search from "./components/Search";

export default {
  name: "App",
  components: {
    Upload,
    Search,
  },
  data: () => ({
    active: "upload",
  }),
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#logo {
  height: 30px;
}

#brand {
  margin-left: 10px;
}

#content {
  margin-top: 70px;
}
</style>