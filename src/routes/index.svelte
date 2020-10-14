<script lang="ts">
  import { calcImpermanentLoss, round } from "../javascript/math";
  const maxTokenCount: number = 2;
  let tokenNames: string[] = ["ABC", "XYZ"];
  let tokenBalances: number[] = [0, 0];
  let tokenWeights: number[] = [50, 50];
  let tokenPrices: number[] = [0, 0];
  let updatedPrices: number[] = [0, 0];
  let priceDiffPercentage: number[] = [100, 100];
  let err: string = "";
  let IL: number = 0;

  function updatePrice() {
    if (
      tokenBalances[0] &&
      tokenBalances[1] &&
      tokenWeights[0] &&
      tokenWeights[1]
    ) {
      tokenPrices[1] =
        (tokenBalances[0] * tokenWeights[1]) /
        (tokenBalances[1] * tokenWeights[0]);
      updatedPrices[1] = tokenPrices[1];
      tokenPrices[0] =
        (tokenBalances[1] * tokenWeights[0]) /
        (tokenBalances[0] * tokenWeights[1]);
      updatedPrices[0] = tokenPrices[0];
    }
  }

  function updateDiff() {
    for (let i: number = 0; i < maxTokenCount; i++) {
      priceDiffPercentage[i] = (updatedPrices[i] / tokenPrices[i]) * 100;
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

  table,
  th,
  td {
    border: 1px solid black;
  }
</style>

<main>
  <h1>Impermanent Loss Calculator</h1>
  {#if err != ''}
    <h5 id="err">Error: {err}</h5>
  {/if}
  <div>
    <p>1. Specify token name, token quantity supplied & token weight (%)</p>
    <table>
      <tr>
        <th>Token Name</th>
        <th>Quantity Supplied</th>
        <th>Weight (%)</th>
      </tr>
      {#each Array(maxTokenCount) as _, i}
        <tr>
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
                updatePrice();
              }} />%
          </td>
        </tr>
      {/each}
    </table>
    <p>2. Modify token price</p>
    <table>
      <tr>
        <th>Token</th>
        <th>Initial Price</th>
        <th>Updated Price</th>
        <th>Price Diff (%)</th>
      </tr>
      {#each Array(maxTokenCount) as _, i}
        <tr>
          <td>
            1
            {#if tokenNames[i] == ''}token B{:else}{tokenNames[i]}{/if}
          </td>
          <td>
            {#if tokenPrices[i] == 0}1{:else}{tokenPrices[i]}{/if}
            {#if tokenNames[(i + 1) % 2] == ''}token B{:else}{tokenNames[(i + 1) % 2]}{/if}
          </td>
          <td>
            {#if tokenPrices[i] == 0}
              1
            {:else}
              <input
                type="number"
                bind:value={updatedPrices[i]}
                on:input={() => {
                  updateDiff();
                  IL = calcImpermanentLoss(tokenWeights, priceDiffPercentage);
                }} />
            {/if}
            {#if tokenNames[(i + 1) % 2] == ''}token A{:else}{tokenNames[(i + 1) % 2]}{/if}
          </td>
          <td>
            {#if priceDiffPercentage[i] < 100}
              {round(100 - priceDiffPercentage[i])}%↓
            {:else if priceDiffPercentage[i] > 100}
              {round(priceDiffPercentage[i] - 100)}%↑
            {:else}0%{/if}
          </td>
        </tr>
      {/each}
      <!-- <tr> -->
<!--         

        <td>
          1
          {#if tokenNames[0] == ''}token A{:else}{tokenNames[0]}{/if}
        </td>
        <td>
          {#if tokenPrices[0] == 0}1{:else}{tokenPrices[0]}{/if}
          {#if tokenNames[0] == ''}token B{:else}{tokenNames[0]}{/if}
        </td>
        <td>
          {#if tokenPrices[0] == 0}
            1
          {:else}
            <input
              type="number"
              bind:value={updatedPrices[0]}
              on:input={() => {
                updateDiff();
                IL = calcImpermanentLoss(tokenWeights, priceDiffPercentage);
              }} />
          {/if}
          {#if tokenNames[1] == ''}token B{:else}{tokenNames[1]}{/if}
        </td>
        <td>
          {#if priceDiffPercentage[0] < 100}
            {round(100 - priceDiffPercentage[0])}%↓
          {:else if priceDiffPercentage[0] > 100}
            {round(priceDiffPercentage[0] - 100)}%↑
          {:else}0%{/if}
        </td>
      </tr>

      <tr>
        <td>
          1
          {#if tokenNames[1] == ''}token B{:else}{tokenNames[1]}{/if}
        </td>
        <td>
          {#if tokenPrices[1] == 0}1{:else}{tokenPrices[1]}{/if}
          {#if tokenNames[0] == ''}token B{:else}{tokenNames[0]}{/if}
        </td>
        <td>
          {#if tokenPrices[1] == 0}
            1
          {:else}
            <input
              type="number"
              bind:value={updatedPrices[1]}
              on:input={() => {
                updateDiff();
                IL = calcImpermanentLoss(tokenWeights, priceDiffPercentage);
              }} />
          {/if}
          {#if tokenNames[0] == ''}token A{:else}{tokenNames[0]}{/if}
        </td>
        <td>
          {#if priceDiffPercentage[1] < 100}
            {round(100 - priceDiffPercentage[1])}%↓
          {:else if priceDiffPercentage[1] > 100}
            {round(priceDiffPercentage[1] - 100)}%↑
          {:else}0%{/if}
        </td>
      </tr> -->
    </table>
    <!-- <p>
      1
      {#if tokenNames[1] == ''}token B{:else}{tokenNames[1]}{/if}
      =
      {#if tokenPrices[0] == 0}
        1
      {:else}
        <input
          type="number"
          bind:value={updatedPrices[0]}
          on:input={() => {
            updateDiff();
            IL = calcImpermanentLoss(tokenWeights, priceDiffPercentage);
          }} />
      {/if}
      {#if tokenNames[0] == ''}token A{:else}{tokenNames[0]}{/if}
      {#if priceDiffPercentage[0] < 100}
        {round(100 - priceDiffPercentage[0])}%↓
      {:else if priceDiffPercentage[0] > 100}
        {round(priceDiffPercentage[0] - 100)}%↑
      {:else}no change{/if}
    </p> -->
    <p>3. Results</p>
    Impermanent Loss:
    {#if isNaN(IL) || !isFinite(IL)}0%{:else}{round(IL * -100)}%{/if}
  </div>
</main>
