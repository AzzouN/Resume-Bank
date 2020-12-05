<template>
  <div class="upload">
    <h5>Click or Drag to upload a Resume</h5>
    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
  name: 'Upload',
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function () {
    return {
      dropzoneOptions: {
          url: 'http://localhost:5000/resumes',
          thumbnailWidth: 150,
          maxFilesize: 0.5,
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .upload {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
  h5 {
    color: darkslategray;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
</style>
