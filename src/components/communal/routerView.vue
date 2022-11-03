<template>
  <div class="page">
    <div class="main">
      <slot />
    </div>
    <vueTabBar
      @fetch-index="clickIndexNav"
      :selectNavIndex="selectNavIndex"
      :baseColor="baseColor"
      :footerMenu="footerMenu"
    />
  </div>
</template>
<script>
import vueTabBar from "@/components/communal/vueTabBar";
import { $storage, $routers } from "@/utils/prototype/vue.js";
export default {
  props: ["selectNavIndex"],
  components: { vueTabBar },
  data() {
    return {
      baseColor: "",
      footerMenu: [] //底部菜单
    };
  },
  mounted() {
    this.footerMenu = $storage.get("footerMenu");
  }
};
</script>