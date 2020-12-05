<template>
  <div class="upload">
    <h5>Click or Drag to upload a Resume</h5>
    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" v-on:vdropzone-success="uploadSuccess">
    </vue-dropzone>
    <vs-dialog width="550px" not-center v-model="show_alert">
      <template #header>
        <h4 class="not-margin">
          <b>Important</b>
        </h4>
      </template>


      <div class="con-content">
        <p>
          Your file has been uploaded, it will take some time to be indexed in ElasticSearch because it's an image and image processing takes time
        </p>
      </div>

      <template #footer>
        <div class="con-footer">
          <vs-button @click="show_alert=false" transparent>
            Ok
          </vs-button>
        </div>
      </template>
    </vs-dialog>
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
      show_alert: false,
      dropzoneOptions: {
          url: 'http://localhost:5000/resumes',
          thumbnailWidth: 150,
          maxFilesize: 5,
      }
    }
  },
  methods: {
    uploadSuccess: function(file, response) {
      console.log(file);
      console.log(response);
      if (response.status == 202) {
        this.show_alert = true;
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
