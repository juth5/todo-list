<script>
  export let show = false;
  $: {
    show;
  }
</script>
<template lang='pug'>
  +if('show')
    div.modal-backdrop.f.fh
      div.f.fh.flex-column
        img.block.object-fit-contain.mb12(src='/load.gif')
        div.text-white loading ...
</template>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-content {
    background-color: #fff;
    margin: 10% auto;
    padding: 30px;
    width: 80%;
    max-width: 500px;
    border-radius: 8px;
  }
</style>
