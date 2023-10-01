<script lang="ts">
  import { page } from "$app/stores";
  import SortableList from "$lib/components/SortableList.svelte";
  import UserLink from "$lib/components/UserLink.svelte";
  import { db, user, userData } from "$lib/firebase";
  import {
    arrayRemove,
    arrayUnion,
    doc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { writable } from "svelte/store";

  const icons = [
    "Twitter",
    "YouTube",
    "TikTok",
    "LinkedIn",
    "GitHub",
    "Custom",
  ];
  const formDefaults = {
    icon: "custom",
    title: "",
    url: "https://",
  };
  const formData = writable(formDefaults);

  let showForm = false;

  $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
  $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
  $: formIsValid = urlIsValid && titleIsValid;

  function sortList(e: CustomEvent) {
    const newList = e.detail;
    const userRef = doc(db, "users", $user!.uid);
    setDoc(userRef, { links: newList }, { merge: true });
  }

  async function addLink(e: SubmitEvent) {
    const userRef = doc(db, "users", $user!.uid);

    await updateDoc(userRef, {
      links: arrayUnion({
        ...$formData,
        id: Date.now().toString(),
      }),
    });

    formData.set({
      icon: "",
      title: "",
      url: "",
    });

    showForm = false;
  }

  async function deleteLink(item: any) {
    const userRef = doc(db, "users", $user!.uid);
    await updateDoc(userRef, {
      links: arrayRemove(item),
    });
  }

  async function toggleProfileStatus(item: any) {
    const userRef = doc(db, "users", $user!.uid);
    await updateDoc(userRef, {
      published: !$userData?.published,
    });
  }

  function cancelLink() {
    formData.set(formDefaults);
    showForm = false;
  }
</script>

<main class="mx-auto max-w-xl">
  {#if $userData?.username == $page.params.username}
    <h1 class="mx-2 mb-4 mt-8 text-center text-2xl font-bold">
      Edit your Profile
    </h1>

    <div class="mb-8 text-center">
      <p>
        Profile Link:
        <a href={`/${$userData?.username}`} class="link-accent link">
          https://kung.foo/{$userData?.username}
        </a>
      </p>
    </div>

    <div class="my-4 text-center">
      <a class="btn btn-outline btn-xs" href="/login/photo">Change photo</a>
      <a class="btn btn-outline btn-xs" href={`/${$userData.username}/bio`}
        >Edit Bio</a
      >
    </div>

    <form class="form-control">
      <label class="label flex cursor-pointer items-start justify-center">
        <span class="label-text mr-6">
          <div
            class="tooltip group-hover:tooltip-open"
            data-tip="If public, the world can see your profile"
          >
            {$userData?.published ? "Public profile" : "Private profile"}
          </div>
        </span>
        <input
          type="checkbox"
          class="toggle toggle-success"
          checked={$userData?.published}
          on:change={toggleProfileStatus}
        />
      </label>
    </form>

    <SortableList list={$userData?.links} on:sort={sortList} let:item let:index>
      <div class="group relative">
        <UserLink {...item} />
        <button
          on:click={() => deleteLink(item)}
          class="btn btn-error btn-xs invisible absolute -right-6 bottom-10 transition-all group-hover:visible"
          >Delete</button
        >
      </div>
    </SortableList>
    {#if showForm}
      <form
        on:submit|preventDefault={addLink}
        class="mx-auto w-full rounded-xl bg-base-200 p-6"
      >
        <select
          name="icon"
          class="select select-sm"
          bind:value={$formData.icon}
        >
          {#each icons as icon}
            <option value={icon.toLowerCase()}>{icon}</option>
          {/each}
        </select>
        <input
          name="title"
          type="text"
          placeholder="Title"
          class="input input-sm"
          bind:value={$formData.title}
        />
        <input
          name="url"
          type="text"
          placeholder="URL"
          class="input input-sm"
          bind:value={$formData.url}
        />
        <div class="my-4">
          {#if !titleIsValid}
            <p class="text-xs text-error">Must have valid title</p>
          {/if}
          {#if !urlIsValid}
            <p class="text-xs text-error">Must have a valid URL</p>
          {/if}
          {#if formIsValid}
            <p class="text-xs text-success">Looks good!</p>
          {/if}
        </div>

        <button
          disabled={!formIsValid}
          type="submit"
          class="btn btn-success block">Add Link</button
        >

        <button type="button" class="btn btn-xs my-4" on:click={cancelLink}
          >Cancel</button
        >
      </form>
    {:else}
      <button
        on:click={() => (showForm = true)}
        class="btn btn-info btn-outline mx-auto my-4 block"
      >
        Add a Link
      </button>
    {/if}
  {/if}
</main>
