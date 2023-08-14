<script lang="ts">
  import { page } from "$app/stores";
</script>

<nav class="my-6 flex justify-center">
  <ul class="steps">
    <a href="/login" class="step step-primary">Sign In</a>
    <a
      href="/login/username"
      class="step"
      class:step-primary={$page.route.id?.match(/username|photo/g)}
      >Choose Username</a
    >
    <a
      href="/login/photo"
      class="step"
      class:step-primary={$page.route.id?.includes("photo")}>Upload Photo</a
    >
  </ul>
</nav>

<main class="card mx-auto w-4/6 bg-neutral text-neutral-content">
  <div class="card-body items-center text-center">
    <slot />
  </div>
</main>
