<script lang="ts">
  import { user, userData } from "$lib/firebase";
  import "../app.css";

  $user;
  $userData;
</script>

<div class="flex min-h-screen flex-col">
  <slot />
</div>
