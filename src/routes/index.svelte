<script lang="ts">
  import { increment, decrement, calcImpermanentLoss, parseIL } from "../javascript/math";
  import Token from "../components/Token.svelte";

  const maxTokenCount: number = 8;
  const minTokenCount: number = 2;
  let tokenCount: number = minTokenCount;
  let err: string = "";
  let IL: number = 0;
  let tokenWeights: number[] = new Array(maxTokenCount);
  tokenWeights.fill(Number(0));
  let tokenPriceChanges: number[] = new Array(maxTokenCount);
  tokenPriceChanges.fill(Number(0));

  function handlePriceChangeUpdate(e) {
    tokenPriceChanges[e.detail.index] = e.detail.priceChange;
    IL = calcImpermanentLoss(tokenWeights, tokenPriceChanges, tokenCount);
  }

  function handleWeightUpdate(e) {
    err = "";
    tokenWeights[e.detail.index] = e.detail.weight;
    let sumWeights: number = 0;
    for (let i = 0; i < tokenCount; i++) {
      if (tokenWeights[i] < 0) {
        err = "Token weights cannot be negative!";
        return;
      }
      sumWeights += tokenWeights[i];
    }

    if (sumWeights > 100) {
      err = "Total token weights must add up to 100!";
    } else {
      IL = calcImpermanentLoss(tokenWeights, tokenPriceChanges, tokenCount);
    }
  }
</script>

<style>
  #err {
    color: red;
  }
  p {
    font-weight: bold;
  }
</style>

<main>
  <h1>Impermanent Loss Calculator</h1>
  {#if err != ''}
    <h5 id="err">Error: {err}</h5>
  {/if}
  <div>
    <p>1. Select number of tokens:</p>
    <button
      on:click={() => {
        tokenCount = increment(tokenCount, maxTokenCount);
      }}>
      +
    </button>
    <button
      on:click={() => {
        tokenCount = decrement(tokenCount, minTokenCount);
      }}>
      -
    </button>
  </div>
  <div>
    <p>2. Modify price change and weightage of tokens:</p>
    {#each Array(tokenCount) as _, i}
      <Token
        num={i}
        on:priceChange={handlePriceChangeUpdate}
        on:weight={handleWeightUpdate} />
    {/each}
  </div>
  <div>
    <p>
      3. Impermanent Loss:
      {#if isNaN(IL) || !isFinite(IL)}0%{:else}{parseIL(IL)}%{/if}
    </p>
  </div>
</main>
