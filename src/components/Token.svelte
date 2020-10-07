<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let num: number = 0;
  let priceChange: number = 0;
  let weight: number = 0;

  const dispatch = createEventDispatcher();

  function priceChangeUpdate(num: number) {
    dispatch("priceChange", {
      index: num,
      priceChange: priceChange,
    });
  }
  function weightUpdate(num: number) {
    dispatch("weight", {
      index: num,
      weight: weight,
    });
  }
</script>

<div>
  Token
  {num + 1}
  price change (%):
  <input
    type="number"
    bind:value={priceChange}
    on:input={() => {
      priceChangeUpdate(num);
    }} />
  <br />
  Token
  {num + 1}
  weight (%):
  <input
    type="number"
    bind:value={weight}
    on:input={() => {
      weightUpdate(num);
    }} />
</div>
