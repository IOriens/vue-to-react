<template>
  <div>
    <p class="title" @click="handleClick">{{title}}</p>
    <p class="name" v-if="show">{{name}}</p>
  </div>
</template>

<style>
.title {font-size: 28px;color: #333;}
.name {font-size: 32px;color: #999;}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    return {
      show: true,
      name: "name"
    };
  },
  mounted() {
    console.log(this.name);
  },
  methods: {
    handleClick() {}
  }
};
</script>