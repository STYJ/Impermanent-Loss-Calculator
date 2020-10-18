<script lang="ts">
  import {
    calcImpermanentLoss,
    calcRemainingInventory,
    round,
  } from "../javascript/math";
  const maxTokenCount: number = 2;
  let tokenNames: string[] = ["A", "B"];
  let tokenBalances: number[] = [1, 1];
  let tokenWeights: number[] = [50, 50];
  let updatedBalances: number[] = [1, 1];

  // When flipped is false, price is for token A in terms of token B
  // When flipped is true, price is for token B in terms of token A
  let flipped: boolean = false;
  let initialPrice: number = 1;
  let updatedPrice: number = 1;
  let pricePercentage: number = 100;

  let err: string = "";
  let IL: number = 0;

  let breakdown: boolean = false;

  function updateWeights() {
    tokenWeights[+!flipped] = 100 - tokenWeights[+flipped];
  }

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
      pricePercentage = 100;
    }
  }

  function flip() {
    flipped = !flipped;
    initialPrice = 1 / initialPrice;
    updatedPrice = initialPrice;
    updatedBalances = tokenBalances;
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

  .container {
    display: flex;
    flex-direction: column;
  }

  table {
    border-collapse: collapse;
  }

  th,
  td,
  input {
    border: 1px solid black;
    width: 10em;
    text-align: center;
    vertical-align: middle;
  }

  td > input {
    border: none;
  }

  .selected > td {
    background: cadetblue;
  }

  .selected > td > input {
    background: cadetblue;
  }

  input {
    padding: 0.5em 1em;
  }

  button {
    background: none;
    outline: none;
    font-size: large;
    border: none;
    padding: 1px;
  }

  #initial-price {
    font-weight: bold;
    font-size: x-small;
  }

  #initial-price,
  #impermanent-loss {
    visibility: visible;
  }

  div {
    padding-bottom: 1.5em;
  }

  #what-is-this,
  #error {
    padding-bottom: 0;
  }
  span {
    visibility: hidden;
  }

  .breakdown {
    visibility: visible;
  }

  /* Hide arrow key in input */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>

<main class="container">
  <div id="what-is-this">
    <h1>Impermanent Loss Calculator</h1>
  </div>
  <div id="error">
    {#if err != ''}
      <h5 id="err">Error: {err}</h5>
    {/if}
  </div>
  <div id="step-1">
    <h3>1. Specify token name, initial quantity supplied & token weight (%)</h3>
    <table>
      <tr>
        <th>Token Name</th>
        <th>Qty Supplied</th>
        <th>Weight (%)</th>
      </tr>
      {#each Array(maxTokenCount) as _, i}
        <tr class:selected={+flipped == i}>
          <td><input type="text" bind:value={tokenNames[i]} /></td>
          <td>
            <input
              type="number"
              bind:value={tokenBalances[i]}
              on:input={() => {
                updatePrice();
              }} />
          </td>
          <td>
            <input
              type="number"
              bind:value={tokenWeights[i]}
              on:input={() => {
                updateWeights();
                updatePrice();
              }} />
          </td>
        </tr>
      {/each}
    </table>
    <span id="initial-price">
      Initial Price: 1
      {tokenNames[+flipped]}
      =
      {initialPrice}
      {tokenNames[+!flipped]}
    </span>
  </div>
  <div id="step-2">
    <h3>
      2. Modify token price
      <button
        id="flip-button"
        on:click={() => {
          flip();
        }}>
        🔄
      </button>
    </h3>
    1
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
    {#if pricePercentage < 100}
      |
      {round(100 - pricePercentage)}%↓
    {:else if pricePercentage > 100}| {round(pricePercentage - 100)}%↑{/if}
  </div>
  <div id="step-3">
    <h3>3. Calculate IL and remaining inventory after price change</h3>
    <table>
      <tr>
        <th>Sum of Token</th>
        <th>Hodl (before)</th>
        <th>
          Pooled (after)
          <button
            on:click={() => {
              breakdown = !breakdown;
            }}>
            ⬇️
          </button>
        </th>
      </tr>

      {#if +flipped}
        <tr>
          <td>{tokenNames[0]}</td>
          <td>
            {round(tokenBalances[+flipped] * updatedPrice + tokenBalances[+!flipped])}
          </td>
          <td>
            {round((updatedBalances[+!flipped] / tokenWeights[+!flipped]) * 100)}
          </td>
        </tr>
        <tr>
          <td>{tokenNames[1]}</td>
          <td>
            {round(tokenBalances[+flipped] + tokenBalances[+!flipped] / updatedPrice)}
          </td>
          <td>
            {round((updatedBalances[+flipped] / tokenWeights[+flipped]) * 100)}
          </td>
        </tr>
      {:else}
        <tr>
          <td>{tokenNames[0]}</td>
          <td>
            {round(tokenBalances[+flipped] + tokenBalances[+!flipped] / updatedPrice)}
          </td>
          <td>
            {round((updatedBalances[+flipped] / tokenWeights[+flipped]) * 100)}
          </td>
        </tr>
        <tr>
          <td>{tokenNames[1]}</td>
          <td>
            {round(tokenBalances[+flipped] * updatedPrice + tokenBalances[+!flipped])}
          </td>
          <td>
            {round((updatedBalances[+!flipped] / tokenWeights[+!flipped]) * 100)}
          </td>
        </tr>
      {/if}
    </table>
    <span id="impermanent-loss">
      IL =
      {#if isNaN(IL) || !isFinite(IL)}0%{:else}{round(IL * -100)}%{/if}
    </span>
    <br />
    <span class:breakdown>
      Breakdown:
      {round(updatedBalances[0])}
      {tokenNames[0]}
      +
      {round(updatedBalances[1])}
      {tokenNames[1]}
    </span>
  </div>
</main>
