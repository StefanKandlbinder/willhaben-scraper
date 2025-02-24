<template>
  <div class="inline relative">
    <!-- display targetURL link -->
    <a class="link break-words" :href="targetURL" :target="previewData ? previewData.title : '_blank'"
      @mouseover="togglePreview" @mouseout="togglePreview">
      {{ targetURL }}
    </a>
    <!-- display preview data if object exists -->
    <div v-if="previewData && showPreview"
      class="result-preview absolute top-8 left-1/2 transform translate-y-4 -translate-x-1/2 opacity-0 invisible transition bg-white overflow-hidden rounded-md shadow-lg z-10 w-72 md:w-[800px]">
      <!-- display title and description -->
      <div class="p-4 text-left bg-white">
        <div class="flex justify-center" v-if="loading">
          <div class="w-16 fill-current">
            <WillhabenSkeleton></WillhabenSkeleton>
          </div>
        </div>
        <h1 class="font-extrabold text-xl text-center" v-if="previewData.title">
          {{ previewData.title }}
        </h1>
        <img v-if="previewData.screenshot" :src="`data:image/jpeg;base64,${previewData.screenshot}`"
          :alt="previewData.description" width="800" height="600" />
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "@vue/runtime-core";
import WillhabenSkeleton from "./WillhabenSkeleton.vue"

export default {
  // define targetURL as a prop
  props: ["targetURL"],
  components: {
    WillhabenSkeleton,
  },

  setup(props) {
    // create a reactive previewData object using ref
    const previewData = ref({});
    const loading = ref(true);
    const showPreview = ref(false);

    // function to send a POST request containing the targetURL to the serverless function
    const generatePreview = async () => {
      try {
        const res = await fetch("/.netlify/functions/willhaben-stats/", {
          method: "POST",
          body: JSON.stringify({
            title: "Mietwohnungen",
            targetURL: props.targetURL,
            screenshot: true,
          }),
        });

        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
        return null;
      }
    };

    const getWillhabenStats = async () => {
      try {
        const res = await fetch("/.netlify/functions/willhaben-stats/", {
          method: "POST",
          body: JSON.stringify({
            title: "Mietwohnungen Linz",
            url: props.targetURL,
            screenshot: true,
          }),
        });

        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
        return null;
      }
    };

    const togglePreview = () => {
      showPreview.value === false
        ? (showPreview.value = true)
        : (showPreview.value = false);
    };

    // run function before component is mounted
    onBeforeMount(async () => {
      previewData.value = await getWillhabenStats();
      loading.value = false;
    });

    // make the following entities available to the component
    return {
      getWillhabenStats,
      generatePreview,
      previewData,
      loading,
      showPreview,
      togglePreview,
    };
  },
};
</script>

<style scoped>
.link:hover~.result-preview {
  @apply opacity-100 translate-y-0 visible !important;
}

.loading {
  width: 600px;
}
</style>
