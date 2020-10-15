<script lang="ts">
  import {
    calcImpermanentLoss,
    calcRemainingInventory,
    round,
  } from "../javascript/math";
  const maxTokenCount: number = 2;
  let tokenNames: string[] = ["ABC", "XYZ"];
  let tokenBalances: number[] = [0, 0];
  let tokenWeights: number[] = [50, 50];
  let updatedBalances: number[] = [0, 0];

  // When flipped is false, price is for token A in terms of token B
  // When flipped is true, price is for token B in terms of token A
  let flipped: boolean = false;
  let initialPrice: number = 0;
  let updatedPrice: number = 0;
  let pricePercentage: number = 100;

  let err: string = "";
  let IL: number = 0;

  function updatePrice() {
    if (
      tokenBalances[0] &&
      tokenBalances[1] &&
      tokenWeights[0] &&
      tokenWeights[1]
    ) {
      initialPrice =
        (tokenBalances[1] * tokenWeights[0]) /
        (tokenBalances[0] * tokenWeights[1]);
      updatedPrice = initialPrice;
      updatedBalances = tokenBalances;
    }
  }

  function flip() {
    flipped = !flipped;
    initialPrice = 1 / initialPrice;
    updatedPrice = initialPrice;
    pricePercentage = 100;
    IL = 0;
  }

  function updatePricePercentage() {
    pricePercentage = (updatedPrice / initialPrice) * 100;
  }
</script>

<style>
  #err {
    color: red;
  }
  table,
  th,
  td {
    border: 1px solid black;
  }

  .selected {
    border: 2px solid red;
    border-radius: 4px;
  }
</style>

<main>
  <h1>Impermanent Loss Calculator</h1>
  {#if err != ''}
    <h5 id="err">Error: {err}</h5>
  {/if}
  <div>
    <h3>1. Specify token name, token quantity supplied & token weight (%)</h3>
    <table>
      <tr>
        <th>Token Name</th>
        <th>Qty Supplied</th>
        <th>Weight (%)</th>
      </tr>
      {#each Array(maxTokenCount) as _, i}
        <tr>
          <td>
            <input
              class:selected={+flipped == i}
              type="text"
              bind:value={tokenNames[i]} />
          </td>
          <td>
            <input
              class:selected={+flipped == i}
              type="number"
              bind:value={tokenBalances[i]}
              on:input={() => {
                updatePrice();
              }} />
          </td>
          <td>
            <input
              class:selected={+flipped == i}
              type="number"
              bind:value={tokenWeights[i]}
              on:input={() => {
                updatePrice();
              }} />%
          </td>
        </tr>
      {/each}
    </table>
    <h3>
      2. Modify token price
      <button
        on:click={() => {
          flip();
        }}>
        flip me!
      </button>
    </h3>

    <p>
      Initial Price: 1
      {tokenNames[+flipped]}
      =
      {initialPrice}
      {tokenNames[+!flipped]}
    </p>
    <p>
      Modified Price: 1
      {tokenNames[+flipped]}
      =
      <input
        type="number"
        bind:value={updatedPrice}
        on:input={() => {
          updatePricePercentage();
          IL = calcImpermanentLoss(pricePercentage, tokenWeights, flipped);
          updatedBalances = calcRemainingInventory(updatedPrice, tokenBalances, tokenWeights, flipped);
        }} />
      {tokenNames[+!flipped]}
    </p>
    <p>
      Price Diff (%):
      {#if pricePercentage < 100}
        {round(100 - pricePercentage)}%↓
      {:else if pricePercentage > 100}
        {round(pricePercentage - 100)}%↑
      {:else}0%{/if}
    </p>
    <h3>3. Results</h3>
    <p>
      Impermanent Loss:
      {#if isNaN(IL) || !isFinite(IL)}0%{:else}{round(IL * -100)}%{/if}
    </p>
    <p />
    <p>
      Hodl value:
      {round(tokenBalances[+flipped] + tokenBalances[+!flipped] / updatedPrice)}
      {tokenNames[+flipped]}
      ==
      {round(tokenBalances[+flipped] * updatedPrice + tokenBalances[+!flipped])}
      {tokenNames[+!flipped]}
    </p>
    <p>
      Pooled value:
      {round((updatedBalances[+flipped] / tokenWeights[+flipped]) * 100)}
      {tokenNames[+flipped]}
      ==
      {round((updatedBalances[+!flipped] / tokenWeights[+!flipped]) * 100)}
      {tokenNames[+!flipped]}
    </p>
    <table>
      <tr>
        <th>Token Name</th>
        <th>Initial Qty</th>
        <th>Final Qty</th>
      </tr>
      {#each Array(maxTokenCount) as _, i}
        <tr>
          <td>{tokenNames[i]}</td>
          <td>{round(tokenBalances[i])}</td>
          <td>{round(updatedBalances[i])}</td>
        </tr>
      {/each}
    </table>
  </div>
</main>
