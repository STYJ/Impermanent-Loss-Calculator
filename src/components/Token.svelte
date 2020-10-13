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

<tr>
  <td>
    {num + 1}
  </td>
  <td>
    <input
    type="number"
    bind:value={priceChange}
    on:input={() => {
      priceChangeUpdate(num);
    }} />
  </td>
  <td>
    <input
    type="number"
    bind:value={weight}
    on:input={() => {
      weightUpdate(num);
    }} />
  </td>
</tr>
