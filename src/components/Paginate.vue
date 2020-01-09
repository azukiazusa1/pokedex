<template>
  <span id="next">
    <p v-if="loading">Now Loading...</p>
    <p v-else="response.next" @click="nextPage">もっとみる</p>
  </span>
</template>

<script>
export default {
  props: ['response'],
  data: function() {
    return {
      loading: true,
    }
  },
  methods: {
    nextPage() {
      this.loading = true;
      this.$emit('next-page', this.response.next);
    }
  },
  watch: {
    response: function (){
      this.loading = false;
    }
  }
}

</script>

<style>
  #next {
    cursor : pointer;
    text-align: center;
    font-size: 25px;
  }
</style>